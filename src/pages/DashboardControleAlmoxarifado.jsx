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

    const colunasMinimo = [
        { label: "Material", key: "material" },
        { label: "Quantidade Total", key: "quantidade" },
        { label: "Qtd Mínima", key: "minimo" },
        { label: "Diferença", key: "diferenca" },
    ];

    const dadosMinimo = [
        { material: "Item A", quantidade: 90, minimo: 130, diferenca: -40 },
        { material: "Item B", quantidade: 225, minimo: 200, diferenca: 25 },
        { material: "Item X", quantidade: 300, minimo: 220, diferenca: 80 },
        { material: "Item Y", quantidade: 302, minimo: 218, diferenca: 84 },
        { material: "Item Z", quantidade: 310, minimo: 180, diferenca: 130 },
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

    useEffect(() => {
        buscarMaterialMaisSolicitado();
        buscarGestaoSolicitacoes();
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
                        <GraficoMovimentacao />
                    </CardDashboard>

                    <div className="coluna-direita">
                        <CardDashboard className="listagem-minimo">
                            <p>Materiais mais próximos ou abaixo do mínimo</p>
                            <TabelaListagem colunas={colunasMinimo} dados={dadosMinimo} />
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