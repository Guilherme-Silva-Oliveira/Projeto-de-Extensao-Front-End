import "./GerenciarSolicitacoes.css";
import NavBar from "../components/NavBar";
import CardSolicitacao from "../components/CardSolicitacao";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../provider/api.js";
import lupaIcon from "../assets/lupa.png";

// ---- MOCK TEMPORÁRIO PARA TESTAR A TELA SEM BACKEND ----
function gerarSolicitacoesReprovadasMock() {
    const materiaisPadrao = () => [
        { id: 1, nome: "Cartolina Vermelha", quantidadeSolicitada: 150, quantidadeDisponivel: 145 },
        { id: 2, nome: "Giz de Cera", quantidadeSolicitada: 80, quantidadeDisponivel: 57 },
    ];

    const solicitantes = ["Heloisa Santos", "Pedro Leite", "Vitor Rocha"];
    const datasEntrega = ["08/05/2026 - 13h18", "12/05/2026 - 09h45", "20/05/2026 - 16h00"];
    const motivosReprovacao = [
        "Quantidade solicitada acima do disponível",
        "Material não disponível no período",
        "Solicitação duplicada",
    ];

    return Array.from({ length: 3 }, (_, i) => ({
        id: i + 1,
        solicitante: solicitantes[i],
        dataEntrega: datasEntrega[i],
        motivo: "Atividade Avaliativa",
        motivoReprovacao: motivosReprovacao[i],
        materiais: materiaisPadrao(),
    }));
}
// ---------------------------------------------------------

function parseDataEntrega(dataEntregaStr) {
    if (!dataEntregaStr) return null;
    const [dataParte] = dataEntregaStr.split(" - ");
    const [dia, mes, ano] = dataParte.split("/").map(Number);
    if (!dia || !mes || !ano) return null;
    return new Date(ano, mes - 1, dia);
}

function SolicitacoesReprovadas() {
    const navigate = useNavigate();

    const [solicitacoes, setSolicitacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const [busca, setBusca] = useState("");
    const [mostrarFiltroData, setMostrarFiltroData] = useState(false);
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");

    useEffect(() => {
        // buscarSolicitacoesReprovadas(); // <- descomentar quando a API estiver integrada

        setCarregando(true);
        setTimeout(() => {
            setSolicitacoes(gerarSolicitacoesReprovadasMock());
            setCarregando(false);
        }, 300);
    }, []);

    async function buscarSolicitacoesReprovadas() {
        try {
            setCarregando(true);
            const response = await api.get("/v1/solicitacoes/reprovadas");
            setSolicitacoes(response.data);
        } catch (error) {
            console.error("Erro ao buscar solicitações reprovadas:", error);
        } finally {
            setCarregando(false);
        }
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
                    <span>Solicitações Reprovadas</span>
                </div>

                <div className="devolucoes-topo">
                    <div className="devolucoes-titulo-area">
                        <h1 className="titulo-devolucoes">SOLICITAÇÕES REPROVADAS</h1>
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
                            className="tab-btn tab-reprovadas"
                            onClick={() => navigate("/gerenciar-solicitacoes")}
                        >
                            Solicitações
                        </button>
                    </div>
                </div>

                <div className="devolucoes-lista">
                    {carregando && (
                        <p className="devolucoes-status">Carregando solicitações reprovadas...</p>
                    )}

                    {!carregando && solicitacoesFiltradas.length === 0 && (
                        <p className="devolucoes-status">
                            Nenhuma solicitação reprovada encontrada.
                        </p>
                    )}

                    {!carregando &&
                        solicitacoesFiltradas.map((solicitacao) => (
                            <CardSolicitacao
                                key={solicitacao.id}
                                solicitacao={solicitacao}
                                somenteLeitura
                                className="card-reprovado"
                            />
                        ))}
                </div>
            </main>
        </div>
    );
}

export default SolicitacoesReprovadas;