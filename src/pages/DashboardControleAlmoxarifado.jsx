import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CardDashboard from "../components/CardDashboard";
import NavBarDashboard from "../components/NavBarDashboard";
import SelectData from "../components/SelectData";
import GraficoMovimentacao from "../components/GraficoMovimentacao";
import ButtonFormOption from "../components/ButtonFormOption";
import TabelaListagem from "../components/TabelaListagem";
import dashboardIcon from "../assets/dashboardIcon.png";
import "./DashboardControleAlmoxarifado.css";
import { api } from "../provider/api";

function DashboardControleAlmoxarifado() {
    const navigate = useNavigate();
    const hoje = new Date().toLocaleDateString("en-CA");

    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState(hoje);
    const [materialMaisSolicitado, setMaterialMaisSolicitado] = useState("Carregando...");
    const [carregandoMaterial, setCarregandoMaterial] = useState(true);

    const [gestaoSolicitacoes, setGestaoSolicitacoes] = useState({ emAberto: 0, proximas: 0 });
    const [carregandoGestao, setCarregandoGestao] = useState(true);

    const [dadosMinimo, setDadosMinimo] = useState([]);
    const [carregandoMinimo, setCarregandoMinimo] = useState(true);

    const [dadosMovimentacao, setDadosMovimentacao] = useState([]);
    const [carregandoMovimentacao, setCarregandoMovimentacao] = useState(true);

    const colunasMinimo = [
        { label: "Material", key: "material" },
        { label: "Quantidade Total", key: "quantidade" },
        { label: "Qtd Mínima", key: "minimo" },
        { label: "Diferença", key: "diferenca" },
    ];

    const buscarMaterialMaisSolicitado = async () => {
        try {
            setCarregandoMaterial(true);

            const response = await api.get("/v1/materiais/mais-solicitado", {
                params: {
                    dataInicio: dataInicio ? `${dataInicio}T00:00:00` : undefined,
                    dataFim: dataFim ? `${dataFim}T23:59:59` : undefined,
                },
            });

            setMaterialMaisSolicitado(response.data.nomeMaterial || "Nenhuma solicitação no período");
        } catch (error) {
            console.error("Erro ao buscar material mais solicitado:", error);
            setMaterialMaisSolicitado("Erro ao carregar");
        } finally {
            setCarregandoMaterial(false);
        }
    };

    const buscarGestaoSolicitacoes = async () => {
        try {
            setCarregandoGestao(true);

            const response = await api.get("/v1/solicitacoes/gestao-solicitacoes");

            setGestaoSolicitacoes({
                emAberto: response.data.emAberto ?? 0,
                proximas: response.data.proximas ?? 0,
            });
        } catch (error) {
            console.error("Erro ao buscar gestão de solicitações:", error);
            setGestaoSolicitacoes({ emAberto: 0, proximas: 0 });
        } finally {
            setCarregandoGestao(false);
        }
    };

    const buscarMateriaisProximosMinimo = async () => {
        try {
            setCarregandoMinimo(true);

            const response = await api.get("/v1/materiais/proximos-minimo");

            const dadosAdaptados = response.data.map((item) => ({
                material: item.nomeMaterial,
                quantidade: item.quantidadeAtual,
                minimo: item.quantidadeMinima,
                diferenca: item.diferenca,
            }));

            setDadosMinimo(dadosAdaptados);
        } catch (error) {
            console.error("Erro ao buscar materiais próximos do mínimo:", error);
            setDadosMinimo([]);
        } finally {
            setCarregandoMinimo(false);
        }
    };

    const buscarMovimentacoes = async () => {
        try {
            setCarregandoMovimentacao(true);

            const response = await api.get("/v1/materiais/movimentacoes");

            const dadosAdaptados = response.data.map((item) => ({
                material: item.nomeMaterial,
                entradas: item.entradas,
                saidas: item.saidas,
            }));

            setDadosMovimentacao(dadosAdaptados);
        } catch (error) {
            console.error("Erro ao buscar movimentações:", error);
            setDadosMovimentacao([]);
        } finally {
            setCarregandoMovimentacao(false);
        }
    };

    useEffect(() => {
        buscarMaterialMaisSolicitado();
        buscarGestaoSolicitacoes();
        buscarMateriaisProximosMinimo();
        buscarMovimentacoes();
    }, []);

    return (
        <div className="dashboard">
            <NavBarDashboard onVoltar={() => navigate(-1)} onCadastrar={() => navigate("/cadastro-material")} />
            <section className="dashboard-content">
                <div className="titulo-dashboard">
                    <h1>Dashboard de Controle de Almoxarifado</h1>
                    <div className="linha-titulo"></div>
                </div>
                <div className="kpis">
                    <CardDashboard className="card-kpi-topo">
                        <p className="titulo-kpi">Material mais solicitado</p>
                        <div className="conteudo-kpi">
                            <h3>{carregandoMaterial ? "Carregando..." : materialMaisSolicitado}</h3>
                        </div>
                    </CardDashboard>
                    <CardDashboard className="card-kpi-topo">
                        <p className="titulo-kpi">Gestão de solicitações</p>
                        <div className="conteudo-kpi">
                            <div className="kpi-divisao">
                                <div>
                                    <h3>{carregandoGestao ? "..." : gestaoSolicitacoes.emAberto}</h3>
                                    <p>Solicitações em aberto</p>
                                </div>
                                <div>
                                    <h3>{carregandoGestao ? "..." : gestaoSolicitacoes.proximas}</h3>
                                    <p>Solicitações próximas</p>
                                </div>
                            </div>
                        </div>
                    </CardDashboard>
                    <CardDashboard className="card-kpi-topo">
                        <p className="titulo-kpi">Selecione o período de tempo</p>
                        <div className="conteudo-kpi">
                            <div className="kpi-divisao">
                                <SelectData
                                    dataInicio={dataInicio}
                                    dataFim={dataFim}
                                    setDataInicio={setDataInicio}
                                    setDataFim={setDataFim}
                                    onBuscar={buscarMaterialMaisSolicitado}
                                />
                            </div>
                        </div>
                    </CardDashboard>
                </div>

                <div className="conteudo-dashboard">
                    <CardDashboard className="grafico-movimentacao">
                        <p>10 materiais com mais movimentações (Entradas e Saídas) no Almoxarifado</p>
                        {carregandoMovimentacao ? (
                            <p>Carregando...</p>
                        ) : dadosMovimentacao.length === 0 ? (
                            <p>Nenhuma movimentação registrada.</p>
                        ) : (
                            <GraficoMovimentacao dados={dadosMovimentacao} />
                        )}
                    </CardDashboard>

                    <div className="coluna-direita">
                        <CardDashboard className="listagem-minimo">
                            <p>Materiais mais próximos ou abaixo do mínimo</p>
                            {carregandoMinimo ? (
                                <p>Carregando...</p>
                            ) : dadosMinimo.length === 0 ? (
                                <p>Nenhum material próximo ou abaixo do mínimo.</p>
                            ) : (
                                <TabelaListagem colunas={colunasMinimo} dados={dadosMinimo} />
                            )}
                        </CardDashboard>

                        <ButtonFormOption
                            className="botao-solicitacoes"
                            texto="Visualizar Solicitações"
                            onClick={() => navigate("/gerenciar-solicitacoes")}
                        >
                            <img src={dashboardIcon} alt="" />
                        </ButtonFormOption>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default DashboardControleAlmoxarifado;