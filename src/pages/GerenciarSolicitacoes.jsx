import "./GerenciarSolicitacoes.css";
import NavBar from "../components/NavBar";
import CardSolicitacao from "../components/CardSolicitacao";
import ModalReprovarSolicitacao from "../components/ModalReprovarSolicitacao";
import { useEffect, useRef, useState } from "react"; // ======= ALTERADO: + useRef =======
import { useNavigate } from "react-router-dom";
import { api } from "../provider/api.js";
import Pagination from "../components/Pagination";
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

    const [solicitacoes, setSolicitacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const [busca, setBusca] = useState("");
    const [mostrarFiltroData, setMostrarFiltroData] = useState(false);
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [dataInicioSelecionada, setDataInicioSelecionada] = useState("");
    const [dataFimSelecionada, setDataFimSelecionada] = useState("");

    // solicitação que está sendo reprovada (abre o modal de motivo)
    const [solicitacaoReprovando, setSolicitacaoReprovando] = useState(null);

    // ======= NOVO: ids que estão sendo finalizados agora, para ignorar clique duplo
    // (um segundo POST geraria alerta de devolução duplicado) =======
    const finalizandoRef = useRef(new Set());

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        async function carregarSolicitacoes() {
            try {
                setCarregando(true);
                // só traz as solicitações em aberto (sem reprovadas, finalizadas, expiradas ou pendentes de devolução)
                const response = await api.get("/v1/solicitacoes/abertas", {
                    params: { page, size: 10 },
                });

                const dataArray = Array.isArray(response.data) ? response.data : response.data.content || [];
                const solicitacoesRecebidas = dataArray.map(normalizarSolicitacao);

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
                setTotalPages(response.data.totalPages || 1);
            } catch (error) {
                console.error("Erro ao buscar solicitacoes:", error);
            } finally {
                setCarregando(false);
            }
        }

        carregarSolicitacoes();
    }, [page]);

    // ======= ALTERADO =======
    // "Finalizar" = entregar os materiais marcados no checkbox.
    // - Se TODOS os materiais da solicitação foram marcados: chama o back
    //   (POST /finalizarSolicitacao/{id}) e só tira o card da tela quando o back confirmar.
    //   Antes o card sumia primeiro e, se o POST falhasse, ele ficava sumido só até recarregar.
    // - Se só ALGUNS foram marcados: continua apenas local (o back ainda não tem endpoint de
    //   entrega parcial), ou seja, ao recarregar a página a solicitação volta completa.
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

    // Reprova a solicitação inteira (ignora os checkboxes) e registra o motivo no histórico.
    // Não trata o erro aqui: o modal captura e mostra a mensagem sem perder o texto digitado.
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
    }

    function aplicarFiltroData() {
        setDataInicio(dataInicioSelecionada);
        setDataFim(dataFimSelecionada);
        setMostrarFiltroData(false);
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

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} mostrarLinks={true} />

            <main className="devolucoes-container">
                <div className="devolucoes-breadcrumb">

                </div>

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
                                    onChange={(e) => setBusca(e.target.value)}
                                />
                                <img src={lupaIcon} alt="Buscar" className="busca-icone" />
                            </div>
                        </div>
                    </div>

                    <div className="devolucoes-tabs">
                        <div className="devolucoes-tabs-grupo">
                            <button type="button" className="tab-btn" onClick={() => navigate("/gerenciar-devolucoes")}>
                                Gerenciar Devoluções
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
                        solicitacoesFiltradas.map((solicitacao) => (
                            <CardSolicitacao
                                key={solicitacao.id}
                                solicitacao={solicitacao}
                                onFinalizar={(idsSelecionados) => finalizarMateriais(solicitacao.id, idsSelecionados)}
                                onCancelar={() => setSolicitacaoReprovando(solicitacao)}
                            />
                        ))}

                    {!carregando && solicitacoesFiltradas.length > 0 && (
                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                    )}
                </div>
            </main>

            {solicitacaoReprovando && (
                <ModalReprovarSolicitacao
                    solicitante={solicitacaoReprovando.solicitante}
                    onConfirmar={(motivo) => reprovarSolicitacao(solicitacaoReprovando.id, motivo)}
                    onCancelar={() => setSolicitacaoReprovando(null)}
                />
            )}
        </div>
    );
}

export default GerenciarSolicitacoes;