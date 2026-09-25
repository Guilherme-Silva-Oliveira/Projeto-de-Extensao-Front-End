import "./GerenciarMovimentacoes.css";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../provider/api.js";
import Pagination from "../components/Pagination";

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
    const [movimentacoes, setMovimentacoes] = useState([]);
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
                    params: { page, size: 10 }
                });
                setMovimentacoes(Array.isArray(response.data) ? response.data : response.data.content || []);
                setTotalPages(response.data.totalPages || 1);
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
                                Filtrar por<br />Data
                            </button>

                            {mostrarFiltroData && (
                                <input
                                    type="date"
                                    className="filtro-data-input"
                                    value={filtroData}
                                    onChange={(event) => setFiltroData(event.target.value)}
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
                    {!carregando && !erro && movimentacoesFiltradas.map((movimentacao, index) => (
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
                    
                    {!carregando && !erro && movimentacoesFiltradas.length > 0 && (
                        <Pagination 
                            currentPage={page} 
                            totalPages={totalPages} 
                            onPageChange={setPage} 
                        />
                    )}
                </div>
            </main>
        </div>
    );
}

export default GerenciarMovimentacoes;
