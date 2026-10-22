import "./GerenciarSolicitacoes.css";
import "./GerenciarSolicitacoesReprovadas.css"; 
import NavBar from "../components/NavBar";
import CardSolicitacao from "../components/CardSolicitacao";
import ModalReprovarSolicitacao from "../components/ModalReprovarSolicitacao";
import AlertasPanel from "../components/AlertasPanel";
import { useEffect, useRef, useState } from "react"; // ======= ALTERADO: + useRef =======
import { useNavigate } from "react-router-dom";
import { api } from "../provider/api.js";
import lupaIcon from "../assets/lupa.png";

function formatarData(data) {
    if (!data) return "--";
    const dataFormatada = new Date(data);
    if (Number.isNaN(dataFormatada.getTime())) return "--";

    return dataFormatada.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    });
}

function normalizarSolicitacao(solicitacao) {
    return {
        ...solicitacao,
        solicitante: solicitacao.professor ?? "--",
        motivo: solicitacao.motivo ?? "--",
        dataEntrega: formatarData(solicitacao.dataSolicitacao),
        dataEncerramento: formatarData(solicitacao.dataParaEnvio),
        materiais: [],
    };
}

async function buscarMateriaisSolicitacao(solicitacaoId) {
    const response = await api.get(`/v1/solicitacoes/materiais/${solicitacaoId}`);
    const materiais = Array.isArray(response.data) ? response.data : [];

    return materiais.map((material, index) => ({
        ...material,
        id: `${solicitacaoId}-${index}`,
        nome: material.material ?? "--",
        quantidadeSolicitada: material.quantidadeSolicitada,
        quantidadeDisponivel: material.quantidadeDisponivel,
    }));
}

function parseDataEntrega(dataEntregaStr) {
    if (!dataEntregaStr || dataEntregaStr === "--") return null;
    const [dataParte] = dataEntregaStr.split(", ");
    const [dia, mes, ano] = dataParte.split("/").map(Number);
    if (!dia || !mes || !ano) return null;
    return new Date(ano, mes - 1, dia);
}

function GerenciarSolicitacoes() {
    const navigate = useNavigate();
    const tamanhoPagina = 6;
    const tamanhoPaginaApi = 100;

    const [solicitacoes, setSolicitacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const [busca, setBusca] = useState("");
    const [mostrarFiltroData, setMostrarFiltroData] = useState(false);
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [dataInicioSelecionada, setDataInicioSelecionada] = useState("");
    const [dataFimSelecionada, setDataFimSelecionada] = useState("");

    const [solicitacaoReprovando, setSolicitacaoReprovando] = useState(null);


    const [menuAberto, setMenuAberto] = useState(false);
    const [alertas, setAlertas] = useState([]);


    const finalizandoRef = useRef(new Set());

    const [page, setPage] = useState(0);

    // NOVO
    useEffect(() => {
        async function carregarAlertas() {
            try {
                const response = await api.get("/v1/frontend/alertas");
                const alertasRecebidos = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data?.content)
                        ? response.data.content
                        : [];
                setAlertas(alertasRecebidos);
            } catch (error) {
                console.error("Erro ao buscar alertas:", error);
            }
        }

        carregarAlertas();
    }, []);

    useEffect(() => {
        async function carregarSolicitacoes() {
            try {
                setCarregando(true);
                const primeiraResposta = await api.get("/v1/solicitacoes", {
                    params: { page: 0, size: tamanhoPaginaApi },
                });
                const primeiraPagina = Array.isArray(primeiraResposta.data)
                    ? primeiraResposta.data
                    : Array.isArray(primeiraResposta.data?.content)
                        ? primeiraResposta.data.content
                        : [];
                const totalPaginasApi = Array.isArray(primeiraResposta.data)
                    ? 1
                    : Math.max(1, primeiraResposta.data?.totalPages ?? 1);
                const paginasRestantes = await Promise.all(
                    Array.from({ length: totalPaginasApi - 1 }, (_, indice) =>
                        api.get("/v1/solicitacoes", {
                            params: { page: indice + 1, size: tamanhoPaginaApi },
                        })
                    )
                );
                const solicitacoesRecebidas = [
                    ...primeiraPagina,
                    ...paginasRestantes.flatMap((resposta) =>
                        Array.isArray(resposta.data)
                            ? resposta.data
                            : Array.isArray(resposta.data?.content)
                                ? resposta.data.content
                                : []
                    ),
                ].map(normalizarSolicitacao);

                const solicitacoesComMateriais = await Promise.all(
                    solicitacoesRecebidas.map(async (solicitacao) => {
                        try {
                            const materiais = await buscarMateriaisSolicitacao(solicitacao.id);
                            return { ...solicitacao, materiais };
                        } catch (error) {
                            console.error(`Erro ao buscar materiais da solicitação ${solicitacao.id}:`, error);
                            return solicitacao;
                        }
                    })
                );
                setSolicitacoes(solicitacoesComMateriais);
                setSolicitacoes(solicitacoesComMateriais);
            } catch (error) {
                console.error("Erro ao buscar solicitacoes:", error);
            } finally {
                setCarregando(false);
            }
        }

        carregarSolicitacoes();
    }, []);


    async function marcarAlertaResolvido(alerta) {
        if (alerta.idAlerta == null || alerta.isResolvido) return;

        try {
            await api.put(
                `/v1/frontend/alertas/${alerta.idAlerta}/${encodeURIComponent(alerta.causaAlerta)}`
            );
            setAlertas((anteriores) =>
                anteriores.map((item) =>
                    item.idAlerta === alerta.idAlerta &&
                    item.causaAlerta === alerta.causaAlerta
                        ? { ...item, isResolvido: true }
                        : item
                )
            );
        } catch (error) {
            console.error("Erro ao resolver alerta:", error);
            alert("Não foi possível marcar o alerta como resolvido.");
        }
    }

    async function finalizarMateriais(solicitacaoId, idsSelecionados) {
        if (finalizandoRef.current.has(solicitacaoId)) return;

        const solicitacaoAtual = solicitacoes.find((s) => s.id === solicitacaoId);
        if (!solicitacaoAtual) return;

        const materiaisRestantes = solicitacaoAtual.materiais.filter(
            (m) => !idsSelecionados.includes(m.id)
        );

        if (materiaisRestantes.length > 0) {
            setSolicitacoes((prev) =>
                prev.map((s) => (s.id === solicitacaoId ? { ...s, materiais: materiaisRestantes } : s))
            );
            return;
        }

        finalizandoRef.current.add(solicitacaoId);
        try {
            await api.post(`/v1/solicitacoes/finalizarSolicitacao/${solicitacaoId}`);
            setSolicitacoes((prev) => prev.filter((s) => s.id !== solicitacaoId));
        } catch (error) {
            console.error("Erro ao finalizar solicitação:", error);
            alert(
                error?.response?.data?.message ||
                "Não foi possível finalizar a solicitação. Tente novamente."
            );
        } finally {
            finalizandoRef.current.delete(solicitacaoId);
        }
    }


    async function reprovarSolicitacao(solicitacaoId, motivo) {
        await api.patch(`/v1/solicitacoes/${solicitacaoId}/decisao`, { aceita: false, motivo });
        setSolicitacoes((prev) => prev.filter((s) => s.id !== solicitacaoId));
        setSolicitacaoReprovando(null);
    }

    function limparFiltroData() {
        setDataInicio("");
        setDataFim("");
        setDataInicioSelecionada("");
        setDataFimSelecionada("");
        setMostrarFiltroData(false);
        setPage(0);
    }

    function aplicarFiltroData() {
        setDataInicio(dataInicioSelecionada);
        setDataFim(dataFimSelecionada);
        setMostrarFiltroData(false);
        setPage(0);
    }

    const solicitacoesFiltradas = solicitacoes.filter((s) => {
        const nomeCombina = (s.solicitante ?? "").toLowerCase().includes(busca.toLowerCase());

        let dataCombina = true;
        if (dataInicio || dataFim) {
            const dataSolicitacao = parseDataEntrega(s.dataEntrega);
            if (!dataSolicitacao) {
                dataCombina = false;
            } else {
                if (dataInicio) {
                    const inicio = new Date(dataInicio + "T00:00:00");
                    if (dataSolicitacao < inicio) dataCombina = false;
                }
                if (dataFim) {
                    const fim = new Date(dataFim + "T23:59:59");
                    if (dataSolicitacao > fim) dataCombina = false;
                }
            }
        }

        return nomeCombina && dataCombina;
    });
    const totalPages = Math.max(1, Math.ceil(solicitacoesFiltradas.length / tamanhoPagina));
    const paginaAtual = Math.min(page, totalPages - 1);
    const solicitacoesVisiveis = solicitacoesFiltradas.slice(
        paginaAtual * tamanhoPagina,
        (paginaAtual + 1) * tamanhoPagina
    );

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} mostrarLinks={true} />

            <main className="devolucoes-container">
                <div className="devolucoes-breadcrumb"></div>

                <div className="devolucoes-topo">
                    <div className="devolucoes-titulo-area">
                        <h1 className="titulo-devolucoes">SOLICITAÇÕES</h1>
                        <div className="linha-laranja"></div>
                    </div>

                    <div className="devolucoes-filtros">
                        <div className="filtro-data-wrapper">
                            <button
                                type="button"
                                className="filtro-data-btn"
                                onClick={() => setMostrarFiltroData((v) => !v)}
                            >
                                Filtrar por Data
                            </button>

                            {mostrarFiltroData && (
                                <div className="filtro-data-popover">
                                    <span className="filtro-data-popover-titulo">Selecione o período de tempo</span>

                                    <div className="filtro-data-popover-campos">
                                        <div className="filtro-data-campo">
                                            <label>Data início</label>
                                            <input
                                                type="date"
                                                value={dataInicioSelecionada}
                                                onChange={(e) => setDataInicioSelecionada(e.target.value)}
                                            />
                                        </div>

                                        <span className="filtro-data-separador">&gt;</span>

                                        <div className="filtro-data-campo">
                                            <label>Data fim</label>
                                            <input
                                                type="date"
                                                value={dataFimSelecionada}
                                                onChange={(e) => setDataFimSelecionada(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="filtro-data-acoes">
                                        <button type="button" className="filtro-data-aplicar" onClick={aplicarFiltroData}>
                                            Aplicar
                                        </button>
                                        <button type="button" className="filtro-data-limpar" onClick={limparFiltroData}>
                                            Limpar filtro
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="busca-wrapper">
                            <label className="busca-label">Buscar</label>
                            <div className="busca-input-wrapper">
                                <input
                                    type="text"
                                    className="busca-input"
                                    placeholder="Pesquise por um Professor"
                                    value={busca}
                                    onChange={(e) => {
                                        setBusca(e.target.value);
                                        setPage(0);
                                    }}
                                />
                                <img src={lupaIcon} alt="Buscar" className="busca-icone" />
                            </div>
                        </div>
                    </div>

                    <div className="devolucoes-tabs">
                        <div className="devolucoes-tabs-grupo">
                            
                            <button type="button" className="tab-btn" onClick={() => navigate("/solicitar-material")}>
                                Solicitar Material
                            </button>
                            <button type="button" className="tab-btn tab-ativa">
                                Gerenciar Solicitações
                            </button>
                        </div>

                        <button
                            type="button"
                            className="tab-btn tab-reprovadas"
                            onClick={() => navigate("/gerenciar-solicitacoes-reprovadas")}
                        >
                            Solicitações Reprovadas
                        </button>

                        <button
                            type="button"
                            className="tab-btn tab-reprovadas"
                            onClick={() => navigate("/gerenciar-solicitacoes-finalizadas")}
                        >
                            Solicitações Finalizadas
                        </button>
                    </div>
                </div>

                <div className="devolucoes-lista">
                    {carregando && <p className="devolucoes-status">Carregando solicitações...</p>}

                    {!carregando && solicitacoesFiltradas.length === 0 && (
                        <p className="devolucoes-status">Nenhuma solicitação encontrada.</p>
                    )}

                    {!carregando &&
                        solicitacoesVisiveis.map((solicitacao) => (
                            <CardSolicitacao
                                key={solicitacao.id}
                                solicitacao={solicitacao}
                                onFinalizar={(idsSelecionados) => finalizarMateriais(solicitacao.id, idsSelecionados)}
                                onCancelar={() => setSolicitacaoReprovando(solicitacao)}
                            />
                        ))}

                </div>
            </main>

            {!carregando && totalPages > 1 && (
                <nav className="solicitacoes-paginacao" aria-label="Paginação das solicitações">
                    <button
                        type="button"
                        aria-label="Página anterior"
                        onClick={() => setPage((pagina) => Math.max(0, pagina - 1))}
                        disabled={paginaAtual === 0}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <span>Página {paginaAtual + 1} de {totalPages}</span>
                    <button
                        type="button"
                        aria-label="Próxima página"
                        onClick={() => setPage((pagina) => Math.min(totalPages - 1, pagina + 1))}
                        disabled={paginaAtual >= totalPages - 1}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </nav>
            )}

            {solicitacaoReprovando && (
                <ModalReprovarSolicitacao
                    solicitante={solicitacaoReprovando.solicitante}
                    onConfirmar={(motivo) => reprovarSolicitacao(solicitacaoReprovando.id, motivo)}
                    onCancelar={() => setSolicitacaoReprovando(null)}
                />
            )}
            <AlertasPanel />
        </div>
    );
}

export default GerenciarSolicitacoes;