import { useState } from "react";
import CardDashboard from "../components/CardDashboard";
import NavBarDashboard from "../components/NavBarDashboard";
import SelectData from "../components/SelectData";
import GraficoMovimentacao from "../components/GraficoMovimentacao";
import ButtonFormOption from "../components/ButtonFormOption";
import TabelaListagem from "../components/TabelaListagem";
import dashboardIcon from "../assets/dashboardIcon.png";
import "./DashboardControleAlmoxarifado.css";

function DashboardControleAlmoxarifado({ onVoltar }) {
    const hoje = new Date();

    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState(hoje);

    //Listagem vencimento
    const colunasVencimento = [
        { label: "Material", key: "material" },
        { label: "GTIN", key: "gtin" },
        { label: "Data Vencimento", key: "vencimento" },
    ];

    const dadosVencimento = [
        { material: "Papel", gtin: "0123456789213", vencimento: "12/04/2026" },
        { material: "Cola", gtin: "0123456029213", vencimento: "10/05/2026" },
        { material: "Tinta", gtin: "0123726789213", vencimento: "12/05/2026" },
        { material: "EVA", gtin: "9023456789213", vencimento: "25/06/2026" },
        { material: "Papelão", gtin: "0129256789213", vencimento: "12/07/2026" },
    ];

    //Listagem minimo
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

    return (
        <div className="dashboard">
            <NavBarDashboard onVoltar={onVoltar} />
            <section className="dashboard-content">
                <div className="titulo-dashboard">
                    <h1>Dashboard de Controle de Almoxarifado</h1>
                    <div className="linha-titulo"></div>
                </div>
                <div className="kpis">
                    <CardDashboard>
                        <p>Material mais solicitado</p>
                        <h3>Papel</h3>
                    </CardDashboard>
                    <CardDashboard>
                        <p>Gestão de solicitações</p>
                        <hr />
                        <div className="kpi-divisao">
                            <div>
                                <h3>10</h3>
                                <p>Solicitações em aberto</p>
                            </div>
                            <div>
                                <h3>6</h3>
                                <p>Solicitações próximas</p>
                            </div>

                        </div>
                    </CardDashboard>
                    <CardDashboard>
                        <p>Selecione o período de tempo</p>
                        <hr />
                        <div className="kpi-divisao">
                            <SelectData>
                                dataInicio={dataInicio}
                                dataFim={dataFim}
                                setDataInicio={setDataInicio}
                                setDataFim={setDataFim}
                            </SelectData>
                        </div>
                    </CardDashboard>
                </div>
                <div className="kpi-divisao">
                    <CardDashboard className="grafico-movimentacao">
                        <p>10 materiais com mais movimentações (Entradas e Saídas) no Almoxarifado</p>
                        <GraficoMovimentacao />
                    </CardDashboard>
                    <CardDashboard className="listagem-vencimento">
                        <p>Os 5 materiais que estão mais próximos de vencer</p>
                        <TabelaListagem colunas={colunasVencimento} dados={dadosVencimento} />
                    </CardDashboard>
                </div>
                <div className="kpi-divisao" style={{ marginTop: "1em" }}>
                    <div className="coluna-esquerda">
                        <CardDashboard className="listagem-minimo">
                            <p>Materiais mais próximos ou abaixo do mínimo</p>
                            <TabelaListagem colunas={colunasMinimo} dados={dadosMinimo} />
                        </CardDashboard>
                    </div>
                    <div className="coluna-direita">
                        <ButtonFormOption className="botoes-dashboard" texto="Visualizar Solicitações">
                            <img src={dashboardIcon} alt="" />
                        </ButtonFormOption>
                        <ButtonFormOption className="botoes-dashboard" texto="Em desenvolvimento">
                            <img src={dashboardIcon} alt="" />
                        </ButtonFormOption>
                        <ButtonFormOption className="botoes-dashboard" texto="Em desenvolvimento">
                            <img src={dashboardIcon} alt="" />
                        </ButtonFormOption>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default DashboardControleAlmoxarifado;