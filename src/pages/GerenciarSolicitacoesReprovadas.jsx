import "./GerenciarSolicitacoes.css";
import "./GerenciarSolicitacoesReprovadas.css";
import NavBar from "../components/NavBar";
import CardSolicitacao from "../components/CardSolicitacao";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
        dataReprovacao: formatarData(solicitacao.dataReprovacao),
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
    }));
}


function parseDataEntrega(dataEntregaStr) {
    if (!dataEntregaStr || dataEntregaStr === "--") return null;
    const [dataParte] = dataEntregaStr.split(", ");
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
    const [menuAberto, setMenuAberto] = useState(false);
    const [alertas, setAlertas] = useState([]);

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
        async function carregarSolicitacoesReprovadas() {
            try {
                setCarregando(true);
                const response = await api.get("/v1/solicitacoes/rejeitadas");
                const solicitacoesRecebidas = Array.isArray(response.data)
                    ? response.data.map(normalizarSolicitacao)
                    : [];

                const solicitacoesComMateriais = await Promise.all(
                    solicitacoesRecebidas.map(async (solicitacao) => {
                        try {
                            const materiais = await buscarMateriaisSolicitacao(
                                solicitacao.id
                            );
                            return { ...solicitacao, materiais };
                        } catch (error) {
                            console.error(
                                `Erro ao buscar materiais da solicitação ${solicitacao.id}:`,
                                error
                            );
                            return solicitacao;
                        }
                    })
                );

                setSolicitacoes(solicitacoesComMateriais);
            } catch (error) {
                console.error("Erro ao buscar solicitações reprovadas:", error);
            } finally {
                setCarregando(false);
            }
        }

        carregarSolicitacoesReprovadas();
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

    function limparFiltroData() {
        setDataInicio("");
        setDataFim("");
        setMostrarFiltroData(false);
    }

    const solicitacoesFiltradas = solicitacoes.filter((s) => {
        const nomeCombina = (s.solicitante ?? "")
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
                    {/* <Link to="/dashboard">Menu de opções</Link>
                    <span> &gt; </span>
                    <span>Solicitações Reprovadas</span> */}
                </div>

                <div className="devolucoes-topo">
                    <div className="devolucoes-titulo-area">
                        <h1 className="titulo-devolucoes">SOLICITAÇÕES REPROVADAS</h1>
                        <div className="linha-laranja" id="linha-laranja-reprovadas"></div>
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
                        <div className="devolucoes-tabs-grupo">
                            <button
                                type="button"
                                className="tab-btn"
                                onClick={() => navigate("/gerenciar-devolucoes")}
                            >
                                Gerenciar Devoluções
                            </button>

                            <button
                                type="button"
                                className="tab-btn"
                                onClick={() => navigate("/gerenciar-solicitacoes")}
                            >
                                Gerenciar Solicitações
                            </button>
                        </div>

                        <button
                            type="button"
                            className="tab-btn tab-ativa tab-reprovadas"
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

            <button
                type="button"
                className={`menu-reprovadas-abrir${alertas.length > 0 ? " menu-reprovadas-abrir-alerta" : ""}`}
                aria-label="Abrir menu"
                aria-expanded={menuAberto}
                aria-controls="menu-lateral-reprovadas"
                onClick={() => setMenuAberto(true)}
            >
                <svg
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                    <path d="M10 21h4" />
                </svg>
            </button>

            <button
                type="button"
                className={`menu-reprovadas-overlay${menuAberto ? " menu-reprovadas-overlay-aberto" : ""}`}
                aria-label="Fechar menu"
                tabIndex={menuAberto ? 0 : -1}
                onClick={() => setMenuAberto(false)}
            />

            <aside
                id="menu-lateral-reprovadas"
                className={`menu-reprovadas-painel${menuAberto ? " menu-reprovadas-painel-aberto" : ""}`}
                aria-label="Menu"
                aria-hidden={!menuAberto}
            >
                <div className="menu-reprovadas-cabecalho">
                    <h2>ALERTAS EM ABERTO</h2>
                    <button type="button" onClick={() => setMenuAberto(false)}>
                        Fechar
                    </button>
                </div>
                <div className="menu-reprovadas-lista">
                    {alertas.map((alerta, index) => (
                        <article
                            className="menu-reprovadas-card"
                            key={`${alerta.causaAlerta ?? "alerta"}-${index}`}
                        >
                            <div className="menu-reprovadas-card-topo">
                                <h3>{alerta.causaAlerta || "Alerta"}</h3>
                                <span className={alerta.isResolvido ? "alerta-status resolvido" : "alerta-status aberto"}>
                                    {alerta.isResolvido ? "Resolvido" : "Em aberto"}
                                </span>
                            </div>
                            <div className="menu-reprovadas-card-conteudo">
                                <div className="menu-reprovadas-card-textos">
                                    <p className="menu-reprovadas-professor">
                                        {alerta.nomeProfessor || "Professor não informado"}
                                    </p>
                                    <p className="menu-reprovadas-descricao">
                                        {alerta.descricao || "Sem descrição."}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="menu-reprovadas-resolver"
                                    disabled={alerta.isResolvido}
                                    onClick={() => marcarAlertaResolvido(alerta)}
                                >
                                    {alerta.isResolvido ? "Resolvido" : "Resolver"}
                                </button>
                            </div>
                        </article>
                    ))}
                    {alertas.length === 0 && (
                        <p className="menu-reprovadas-vazio">Nenhum alerta listado.</p>
                    )}
                </div>
            </aside>
        </div>
    );
}

export default SolicitacoesReprovadas;
