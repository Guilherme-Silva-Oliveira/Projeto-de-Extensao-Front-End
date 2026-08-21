import "./GerenciarSolicitacoes.css";
import NavBar from "../components/NavBar";
import CardSolicitacao from "../components/CardSolicitacao";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../provider/api.js";
import lupaIcon from "../assets/lupa.png";

// ---- MOCK TEMPORÁRIO PARA TESTAR A TELA SEM BACKEND ----
function gerarSolicitacoesMock() {
    const materiaisPadrao = () => [
        { id: 1, nome: "Cartolina Azul", quantidadeSolicitada: 50, quantidadeDisponivel: 75 },
        { id: 2, nome: "Cartolina Azul", quantidadeSolicitada: 50, quantidadeDisponivel: 75 },
        { id: 3, nome: "Cartolina Azul", quantidadeSolicitada: 50, quantidadeDisponivel: 75 },
        { id: 4, nome: "Cartolina Azul", quantidadeSolicitada: 50, quantidadeDisponivel: 75 },
    ];

    const solicitantes = ["Rogério Silva", "Maria Fernanda Souza", "Rogério Silva"];
    const datasEntrega = ["08/05/2026 - 13h18", "12/05/2026 - 09h45", "20/05/2026 - 16h00"];
    const datasEncerramento = ["15/05/2026 - 13h30", "19/05/2026 - 09h45", "27/05/2026 - 16h00"];

    return Array.from({ length: 3 }, (_, i) => ({
        id: i + 1,
        solicitante: solicitantes[i],
        dataEntrega: datasEntrega[i],
        dataEncerramento: datasEncerramento[i],
        motivo: "Atividade Avaliativa",
        materiais: materiaisPadrao(),
    }));
}
// ---------------------------------------------------------

// Converte "08/05/2026 - 13h18" em um Date real, pra dar pra comparar com o range escolhido
function parseDataEntrega(dataEntregaStr) {
    if (!dataEntregaStr) return null;
    const [dataParte] = dataEntregaStr.split(" - ");
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

    useEffect(() => {
        // buscarSolicitacoes(); // <- descomentar quando a API estiver integrada

        setCarregando(true);
        setTimeout(() => {
            setSolicitacoes(gerarSolicitacoesMock());
            setCarregando(false);
        }, 300);
    }, []);

    async function buscarSolicitacoes() {
        try {
            setCarregando(true);
            const response = await api.get("/v1/solicitacoes");
            setSolicitacoes(response.data);
        } catch (error) {
            console.error("Erro ao buscar solicitacoes:", error);
        } finally {
            setCarregando(false);
        }
    }

    // Finaliza os materiais selecionados (checkboxes) de UMA solicitação.
    async function finalizarMateriais(solicitacaoId, idsSelecionados) {
        // MOCK: comentar a chamada de api enquanto não há backend
        // await api.post(`/v1/solicitacoes/${solicitacaoId}/finalizar`, {
        //     materiaisIds: idsSelecionados,
        // });

        setSolicitacoes((prev) =>
            prev
                .map((s) => {
                    if (s.id !== solicitacaoId) return s;
                    const materiaisRestantes = s.materiais.filter(
                        (m) => !idsSelecionados.includes(m.id)
                    );
                    return { ...s, materiais: materiaisRestantes };
                })
                .filter((s) => s.materiais.length > 0)
        );
    }

    // Cancela a solicitação inteira e a remove da tela
    async function cancelarSolicitacao(solicitacaoId) {
        // MOCK: comentar a chamada de api enquanto não há backend
        // await api.put(`/v1/solicitacoes/${solicitacaoId}/cancelar`);

        setSolicitacoes((prev) => prev.filter((s) => s.id !== solicitacaoId));
    }

    function limparFiltroData() {
        setDataInicio("");
        setDataFim("");
        setMostrarFiltroData(false);
    }

    const solicitacoesFiltradas = solicitacoes.filter((s) => {
        const nomeCombina = s.solicitante
            .toLowerCase()
            .includes(busca.toLowerCase());

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
                    <Link to="/dashboard">Menu de opções</Link>
                    <span> &gt; </span>
                    <span>Gerenciar Solicitações</span>
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
                                    <span className="filtro-data-popover-titulo">
                                        Selecione o período de tempo
                                    </span>

                                    <div className="filtro-data-popover-campos">
                                        <div className="filtro-data-campo">
                                            <label>Data início</label>
                                            <input
                                                type="date"
                                                value={dataInicio}
                                                onChange={(e) => setDataInicio(e.target.value)}
                                            />
                                        </div>

                                        <span className="filtro-data-separador">&gt;</span>

                                        <div className="filtro-data-campo">
                                            <label>Data fim</label>
                                            <input
                                                type="date"
                                                value={dataFim}
                                                onChange={(e) => setDataFim(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="filtro-data-limpar"
                                        onClick={limparFiltroData}
                                    >
                                        Limpar filtro
                                    </button>
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
                        <button
                            type="button"
                            className="tab-btn"
                            onClick={() => navigate("/gerenciar-devolucoes")}
                        >
                            Gerenciar Devoluções
                        </button>
                        <button type="button" className="tab-btn tab-ativa">
                            Gerenciar Solicitações
                        </button>
                    </div>
                </div>

                <div className="devolucoes-lista">
                    {carregando && (
                        <p className="devolucoes-status">Carregando solicitações...</p>
                    )}

                    {!carregando && solicitacoesFiltradas.length === 0 && (
                        <p className="devolucoes-status">Nenhuma solicitação encontrada.</p>
                    )}

                    {!carregando &&
                        solicitacoesFiltradas.map((solicitacao) => (
                            <CardSolicitacao
                                key={solicitacao.id}
                                solicitacao={solicitacao}
                                onFinalizar={(idsSelecionados) =>
                                    finalizarMateriais(solicitacao.id, idsSelecionados)
                                }
                                onCancelar={() => cancelarSolicitacao(solicitacao.id)}
                            />
                        ))}
                </div>
            </main>
        </div>
    );
}

export default GerenciarSolicitacoes;