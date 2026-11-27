import { useEffect, useState } from "react";
import { api } from "../provider/api.js";
import "./AlertasPanel.css";

function AlertasPanel() {
    const [menuAberto, setMenuAberto] = useState(false);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState("alertas");
    const [alertas, setAlertas] = useState([]);
    const [alertasVerificacao, setAlertasVerificacao] = useState([]);

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

        async function carregarAlertasVerificacao() {
            try {
                const response = await api.get("/v1/frontend/alertas-verificacao");
                const alertasRecebidos = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data?.content)
                        ? response.data.content
                        : [];
                setAlertasVerificacao(alertasRecebidos);
            } catch (error) {
                console.error("Erro ao buscar alertas de verificação:", error);
            }
        }

        carregarAlertas();
        carregarAlertasVerificacao();
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

    return (
        <>
            <button
                type="button"
                className={`menu-reprovadas-abrir menu-alertas-materiais${alertas.length + alertasVerificacao.length > 0 ? " menu-reprovadas-abrir-alerta" : ""}`}
                aria-label="Abrir alertas"
                aria-expanded={menuAberto}
                aria-controls="menu-lateral-alertas"
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
                aria-label="Fechar alertas"
                tabIndex={menuAberto ? 0 : -1}
                onClick={() => setMenuAberto(false)}
            />

            <aside
                id="menu-lateral-alertas"
                className={`menu-reprovadas-painel${menuAberto ? " menu-reprovadas-painel-aberto" : ""}`}
                aria-label="Alertas"
                aria-hidden={!menuAberto}
            >
                <div className="menu-reprovadas-cabecalho">
                    <h2>ALERTAS EM ABERTO</h2>
                    <button type="button" onClick={() => setMenuAberto(false)}>
                        Fechar
                    </button>
                </div>
                <fieldset className="menu-alertas-categorias">
                    <legend>Categoria dos alertas</legend>
                    <label className={`menu-alertas-categoria${categoriaSelecionada === "alertas" ? " selecionada" : ""}`}>
                        <input
                            type="radio"
                            name="categoria-alertas"
                            value="alertas"
                            checked={categoriaSelecionada === "alertas"}
                            onChange={() => setCategoriaSelecionada("alertas")}
                        />
                        Alertas
                        <span>Devolução e solicitação</span>
                    </label>
                    <label className={`menu-alertas-categoria${categoriaSelecionada === "verificacao" ? " selecionada" : ""}`}>
                        <input
                            type="radio"
                            name="categoria-alertas"
                            value="verificacao"
                            checked={categoriaSelecionada === "verificacao"}
                            onChange={() => setCategoriaSelecionada("verificacao")}
                        />
                        Verificação
                        <span>Alertas de verificação</span>
                    </label>
                </fieldset>
                <div className="menu-reprovadas-lista">
                    {categoriaSelecionada === "alertas" && alertas.map((alerta, index) => (
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
                    {categoriaSelecionada === "verificacao" && alertasVerificacao.map((alerta, index) => (
                        <article
                            className="menu-reprovadas-card"
                            key={alerta.id ?? `verificacao-${index}`}
                        >
                            <div className="menu-reprovadas-card-topo">
                                <h3>{alerta.nome || "Alerta de verificação"}</h3>
                                <span className="alerta-status aberto">
                                    {alerta.tipo || "Verificação"}
                                </span>
                            </div>
                            <div className="menu-reprovadas-card-conteudo">
                                <div className="menu-reprovadas-card-textos">
                                    <p className="menu-reprovadas-professor">
                                        Criado em: {alerta.dataCriacao
                                            ? new Date(alerta.dataCriacao).toLocaleString("pt-BR")
                                            : "Data não informada"}
                                    </p>
                                    <p className="menu-reprovadas-descricao">
                                        {alerta.descricao || "Sem descrição."}
                                    </p>
                                    {(alerta.solicitacao?.idSolicitacao ?? alerta.solicitacao?.id) != null && (
                                        <p className="menu-reprovadas-professor">
                                            Solicitação #{alerta.solicitacao.idSolicitacao ?? alerta.solicitacao.id}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                    {categoriaSelecionada === "alertas" && alertas.length === 0 && (
                        <p className="menu-reprovadas-vazio">Nenhum alerta listado.</p>
                    )}
                    {categoriaSelecionada === "verificacao" && alertasVerificacao.length === 0 && (
                        <p className="menu-reprovadas-vazio">Nenhum alerta listado.</p>
                    )}
                </div>
            </aside>
        </>
    );
}

export default AlertasPanel;
