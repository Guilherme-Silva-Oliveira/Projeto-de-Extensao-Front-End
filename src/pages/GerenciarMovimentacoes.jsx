import "./GerenciarMovimentacoes.css";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../provider/api.js";

function formatarData(dataMovimentacao) {
    if (!dataMovimentacao) return "-";

    const data = new Date(dataMovimentacao);
    if (Number.isNaN(data.getTime())) return dataMovimentacao;

    return `${data.toLocaleDateString("pt-BR")} - ${data.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    })}`;
}

function normalizarTipoAcao(acao) {
    return (acao ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function GerenciarMovimentacoes() {
    const navigate = useNavigate();
    const tamanhoPagina = 7;
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [paginacaoNoServidor, setPaginacaoNoServidor] = useState(false);
    const [filtroData, setFiltroData] = useState("");
    const [mostrarFiltroData, setMostrarFiltroData] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        async function carregarMovimentacoes() {
            try {
                setCarregando(true);
                setErro("");
                const response = await api.get("/v1/frontend/movimentacoes", {
                    params: { page, size: tamanhoPagina }
                });
                const respostaPaginada = !Array.isArray(response.data) && Array.isArray(response.data?.content);
                const registros = Array.isArray(response.data)
                    ? response.data
                    : respostaPaginada
                        ? response.data.content
                        : [];

                setMovimentacoes(registros);
                setPaginacaoNoServidor(respostaPaginada);
                setTotalPages(respostaPaginada
                    ? Math.max(1, response.data.totalPages ?? Math.ceil((response.data.totalElements ?? registros.length) / tamanhoPagina))
                    : Math.max(1, Math.ceil(registros.length / tamanhoPagina))
                );
            } catch (error) {
                console.error("Erro ao buscar movimentações:", error);
                setErro("Não foi possível carregar as movimentações.");
            } finally {
                setCarregando(false);
            }
        }

        carregarMovimentacoes();
    }, [page]);

    const movimentacoesFiltradas = movimentacoes.filter((movimentacao) =>
        !filtroData || movimentacao.dataMovimentacao?.startsWith(filtroData)
    );
    const movimentacoesVisiveis = paginacaoNoServidor
        ? movimentacoesFiltradas.slice(0, tamanhoPagina)
        : movimentacoesFiltradas.slice(page * tamanhoPagina, (page + 1) * tamanhoPagina);

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} mostrarLinks={true} onVoltar={() => navigate(-1)} />

            <main className="movimentacoes-container">
                <div className="movimentacoes-breadcrumb">
                    {/* <Link to="/menu">Menu de opções</Link>
                    <span> &gt; </span>
                    <span>Gerenciar Movimentações</span> */}
                </div>

                <div className="movimentacoes-topo">
                    <div className="movimentacoes-titulo-area">
                        <h1 className="titulo-movimentacoes">MOVIMENTAÇÕES</h1>
                        <div className="linha-laranja"></div>
                    </div>

                    <div className="movimentacoes-filtros">
                        <div className="filtro-data-wrapper">
                            <button
                                type="button"
                                className="filtro-movimentacoes filtro-data-btn"
                                onClick={() => setMostrarFiltroData((valorAtual) => !valorAtual)}
                            >
                                Filtrar por Data
                            </button>

                            {mostrarFiltroData && (
                                <input
                                    type="date"
                                    className="filtro-data-input"
                                    value={filtroData}
                                    onChange={(event) => {
                                        setFiltroData(event.target.value);
                                        setPage(0);
                                    }}
                                    aria-label="Filtrar por data"
                                />
                            )}
                        </div>

                    </div>
                </div>

                <div className="movimentacoes-lista"> 
                    {carregando && <p className="movimentacoes-status">Carregando movimentações...</p>}
                    {!carregando && erro && <p className="movimentacoes-status movimentacoes-erro">{erro}</p>}
                    {!carregando && !erro && movimentacoesFiltradas.length === 0 && (
                        <p className="movimentacoes-status">Nenhuma movimentação encontrada.</p>
                    )}
                    {!carregando && !erro && movimentacoesVisiveis.map((movimentacao, index) => (
                        <article className="card-movimentacao" key={`${movimentacao.dataMovimentacao}-${index}`}>
                            <div className="movimentacao-campo">
                                <span>Ação:</span>
                                <strong className={`movimentacao-acao acao-${normalizarTipoAcao(movimentacao.acao)}`}>
                                    {movimentacao.acao ?? "-"}
                                </strong>
                            </div>
                            <div className="movimentacao-campo">
                                <span>Material:</span>
                                <p>{movimentacao.material ?? "-"}</p>
                            </div>
                            <div className="movimentacao-campo">
                                <span>Motivo/Fornecedor</span>
                                <p>{movimentacao.motivoFornecedor ?? "-"}</p>
                            </div>
                            <div className="movimentacao-campo">
                                <span>Data da Movimentação</span>
                                <p>{formatarData(movimentacao.dataMovimentacao)}</p>
                            </div>
                            <div className="movimentacao-campo">
                                <span>Quantidade:</span>
                                <p>{movimentacao.quantidade ?? "-"}</p>
                            </div>
                        </article>
                    ))}
                    
                </div>
            </main>

            {!carregando && !erro && movimentacoesFiltradas.length > 0 && (
                <nav className="movimentacoes-paginacao" aria-label="Paginação das movimentações">
                    <button
                        type="button"
                        aria-label="Página anterior"
                        onClick={() => setPage((paginaAtual) => Math.max(0, paginaAtual - 1))}
                        disabled={page === 0}
                    >
                        ‹
                    </button>
                    <span>Página {page + 1} de {totalPages}</span>
                    <button
                        type="button"
                        aria-label="Próxima página"
                        onClick={() => setPage((paginaAtual) => Math.min(totalPages - 1, paginaAtual + 1))}
                        disabled={page >= totalPages - 1}
                    >
                        ›
                    </button>
                </nav>
            )}
        </div>
    );
}

export default GerenciarMovimentacoes;
