import "./SolicitarMaterial.css";
import NavBar from "../components/NavBar";
import InputForm from "../components/InputForm";
import MainButton from "../components/MainButton";
import SelectForm from "../components/SelectForm";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api, iaApi } from "../provider/api.js";

const criarItemVazio = (materialIdPadrao) => ({
    id: Date.now() + Math.random(),
    materialId: materialIdPadrao,
    qtdSolicitada: "",
    deveDevolver: false,
});

function encontrarPorNome(lista, nomeAlvo, campoNome) {
    if (!nomeAlvo) return null;
    const alvo = nomeAlvo.trim().toLowerCase();
    return lista.find((item) => (item[campoNome] ?? "").trim().toLowerCase() === alvo) ?? null;
}

function toLocalDateTimeString(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}


function IconeMais() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
    );
}

function IconeLixeira() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
    );
}

function SolicitarMaterial() {
    const navigate = useNavigate();
    const location = useLocation();
    const [modoAtivo, setModoAtivo] = useState("Automático");

    const [listaProfessores, setListaProfessores] = useState([]);
    const [listaMotivos, setListaMotivos] = useState([]);
    const [catalogoMateriais, setCatalogoMateriais] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState(null);

    const [mensagemAuto, setMensagemAuto] = useState("");
    const [analisandoIA, setAnalisandoIA] = useState(false);
    const [modeloIAId, setModeloIAId] = useState(null);
    const [alertaIA, setAlertaIA] = useState(null);

    const [professorId, setProfessorId] = useState(null);
    const [prazo, setPrazo] = useState("");
    const [motivoId, setMotivoId] = useState(null);

    const [itens, setItens] = useState([]);
    const [enviando, setEnviando] = useState(false);


    const [sucesso, setSucesso] = useState(false);
    const [erroRegistro, setErroRegistro] = useState("");

    useEffect(() => {
        async function carregarDadosIniciais() {
            try {
                setCarregando(true);
                const [respProfessores, respMotivos, respMateriais] = await Promise.all([
                    api.get("/v1/professores"),
                    api.get("/v1/motivos"),
                    api.get("/v1/materiais", { params: { page: 0, size: 100 } }),
                ]);

                
                const professores = Array.isArray(respProfessores.data) ? respProfessores.data : [];
                const motivos = Array.isArray(respMotivos.data) ? respMotivos.data : [];
                const materiaisPage = respMateriais.data;
                const materiais = Array.isArray(materiaisPage)
                    ? materiaisPage
                    : Array.isArray(materiaisPage?.content)
                        ? materiaisPage.content
                        : [];

                if (professores.length === 0 || motivos.length === 0) {
                    setErroCarregamento("Cadastre ao menos um professor e um motivo antes de solicitar um material.");
                }

                setListaProfessores(professores);
                setListaMotivos(motivos);
                setCatalogoMateriais(materiais);

                if (professores.length > 0) setProfessorId(professores[0].id);
                if (motivos.length > 0) setMotivoId(motivos[0].id);
                if (materiais.length > 0) {
                    setItens([criarItemVazio(materiais[0].id)]);
                }
            } catch (error) {
                console.error("Erro ao carregar dados iniciais:", error);
                setErroCarregamento(
                    "Não foi possível carregar professores, motivos ou materiais. Verifique se os endpoints /v1/professores, /v1/motivos e /v1/materiais estão disponíveis."
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarDadosIniciais();
    }, []);

    
    useEffect(() => {
        if (!sucesso) return;
        const timer = setTimeout(() => setSucesso(false), 8000);
        return () => clearTimeout(timer);
    }, [sucesso]);

    async function handleAnalisarComIA() {
        if (!mensagemAuto.trim()) {
            alert("Digite a mensagem de solicitação antes de analisar.");
            return;
        }

        try {
            setAnalisandoIA(true);
            const { data } = await iaApi.post("/ia/talk", mensagemAuto, {
                headers: { "Content-Type": "text/plain" },
            });

            const professorEncontrado = encontrarPorNome(listaProfessores, data.nome_professor, "nome");
            if (!professorEncontrado) {
                alert(`A IA não conseguiu identificar o professor ("${data.nome_professor}"). Selecione manualmente.`);
            } else {
                setProfessorId(professorEncontrado.id);
            }

            const motivoEncontrado = encontrarPorNome(listaMotivos, data.motivo, "descricao");
            setMotivoId(motivoEncontrado ? motivoEncontrado.id : listaMotivos[0]?.id ?? null);

            const prazoSugerido = typeof data.data_solicitacao === "string"
                ? data.data_solicitacao.trim().match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? ""
                : "";
            setPrazo(prazoSugerido);

            const nomesMateriais = (data.nome_material ?? "")
                .split(",")
                .map((s) => s.trim())
                .filter((nome, index, nomes) =>
                    nomes.findIndex((outroNome) => outroNome.toLowerCase() === nome.toLowerCase()) === index
                );
            const quantidades = (data.quantidade ?? "").split(",").map((s) => s.trim());
            const devolucoes = (data.deveDevolver ?? "").split(",").map((s) => s.trim());

            const novosItens = nomesMateriais.map((nomeMat, i) => {
                const materialEncontrado = encontrarPorNome(catalogoMateriais, nomeMat, "nomeMaterial");
                if (!materialEncontrado) {
                    alert(`Material "${nomeMat}" sugerido pela IA não foi encontrado no catálogo. Ajuste manualmente.`);
                }
                return {
                    id: Date.now() + Math.random() + i,
                    materialId: materialEncontrado?.id ?? catalogoMateriais[0]?.id ?? null,
                    qtdSolicitada: quantidades[i] ?? "",
                    deveDevolver: devolucoes[i]?.toLowerCase() === "true",
                };
            });

            if (novosItens.length > 0) setItens(novosItens);
            setModeloIAId(data.modeloId ?? null);
            setAlertaIA(data.alerta ?? null);
        } catch (error) {
            console.error("Erro ao consultar IA:", error);
            alert("Não foi possível analisar a mensagem com a IA. Preencha manualmente ou tente novamente.");
        } finally {
            setAnalisandoIA(false);
        }
    }

    function adicionarItem() {
        const materialPadrao = catalogoMateriais[0]?.id ?? null;
        setItens((prev) => [...prev, criarItemVazio(materialPadrao)]);
    }

    function removerItem(id) {
        if (itens.length === 1) {
            alert("A solicitação deve conter pelo menos um material.");
            return;
        }
        setItens((prev) => prev.filter((item) => item.id !== id));
    }

    function atualizarItem(id, campo, valor) {
        setItens((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [campo]: valor } : item))
        );
    }

    
    function limparFormulario() {
        setMensagemAuto("");
        setAlertaIA(null);
        setModeloIAId(null);
        setPrazo("");
        setProfessorId(listaProfessores[0]?.id ?? null);
        setMotivoId(listaMotivos[0]?.id ?? null);
        setItens(catalogoMateriais.length > 0 ? [criarItemVazio(catalogoMateriais[0].id)] : []);
    }

    async function handleRegistrar() {
        if (enviando) return;
        setSucesso(false);
        setErroRegistro("");

        
        if (itens.length === 0) {
            setErroRegistro("Adicione ao menos um material.");
            return;
        }
        if (itens.some((item) => !(Number(item.qtdSolicitada) > 0))) {
            setErroRegistro("Informe uma quantidade válida em todos os materiais ou remova os itens vazios.");
            return;
        }
        const idsMateriais = itens.map((item) => item.materialId);
        if (new Set(idsMateriais).size !== idsMateriais.length) {
            setErroRegistro("Há materiais repetidos. Use um único item por material.");
            return;
        }
        if (!professorId || !motivoId) {
            setErroRegistro("Selecione o professor e o motivo.");
            return;
        }
        if (!prazo) {
            setErroRegistro("Informe o prazo para a solicitação.");
            return;
        }

        const nomesMateriais = itens
            .map((item) => {
                const material = catalogoMateriais.find((m) => m.id === item.materialId);
                return material?.nomeMaterial ?? material?.nome ?? "";
            })
            .join(",");

        const quantidades = itens.map((item) => item.qtdSolicitada).join(",");

        const deveDevolver = itens
            .map((item) => String(Boolean(item.deveDevolver)))
            .join(",");

        const motivoSelecionado = listaMotivos.find((m) => m.id === motivoId);

        const payload = {
            idProfessor: professorId,
            idMotivo: motivoId,
            materiais: nomesMateriais,
            quantidade: quantidades,
            deveDevolver,
            inteligenciaArtificialId: modoAtivo === "Automático" ? modeloIAId : null,
            descricao: motivoSelecionado?.descricao ?? motivoSelecionado?.nome ?? "Solicitação de material",
            dataSolicitacao: toLocalDateTimeString(new Date()),
            dataParaEnvio: `${prazo}T00:00:00`,
            alerta: null,
        };

        try {
            setEnviando(true);
            await api.post("/v1/solicitacoes", payload);
           
            limparFormulario();
            setSucesso(true);
        } catch (error) {
            console.error("Erro ao registrar solicitação:", error);
            setErroRegistro(
                error?.response?.data?.message ||
                "Erro ao registrar a solicitação. Verifique os dados e tente novamente."
            );
        } finally {
            setEnviando(false);
        }
    }

   
    function handleCancelar() {
        if (location.key !== "default") {
            navigate(-1);
        } else {
            navigate("/gerenciar-solicitacoes");
        }
    }

    if (carregando) {
        return (
            <div className="page-container">
                <NavBar mostrarVoltar={true} mostrarLinks={true} />
                <main className="solicitar-container">
                    <p>Carregando dados...</p>
                </main>
            </div>
        );
    }

    if (erroCarregamento) {
        return (
            <div className="page-container">
                <NavBar mostrarVoltar={true} mostrarLinks={true} />
                <main className="solicitar-container">
                    <p>{erroCarregamento}</p>
                </main>
            </div>
        );
    }

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} mostrarLinks={true} />

            <main className="solicitar-container">
                <h1 className="titulo-solicitar">SOLICITE UM MATERIAL</h1>
                <div className="linha-laranja"></div>

                <div className="modo-buttons">
                    <button
                        type="button"
                        className={`modo-btn ${modoAtivo === "Automático" ? "modo-ativo" : ""}`}
                        onClick={() => setModoAtivo("Automático")}
                    >
                        Automático
                    </button>
                    <button
                        type="button"
                        className={`modo-btn ${modoAtivo === "Manual" ? "modo-ativo" : ""}`}
                        onClick={() => setModoAtivo("Manual")}
                    >
                        Manual
                    </button>
                </div>

          
                {sucesso && (
                    <div className="solicitar-banner solicitar-banner-sucesso" role="status">
                        <span>Solicitação registrada com sucesso!</span>
                        <button
                            type="button"
                            className="solicitar-banner-link"
                            onClick={() => navigate("/gerenciar-solicitacoes")}
                        >
                            Ver solicitações
                        </button>
                    </div>
                )}
                {erroRegistro && (
                    <div className="solicitar-banner solicitar-banner-erro" role="alert">
                        {erroRegistro}
                    </div>
                )}

                <div className="solicitar-scroll-area">
                    <div className="solicitar-form">
                        {modoAtivo === "Automático" && (
                            <div className="automatico-section">
                                <label className="input-label">Mensagem de Solicitação:</label>
                                <textarea
                                    className="mensagem-textarea"
                                    value={mensagemAuto}
                                    onChange={(e) => setMensagemAuto(e.target.value)}
                                    rows={3}
                                    placeholder="Eu Matheus Torres, gostaria de 50 cartolinas de cor verde claro para o dia 10/05/2026 para uma atividade avaliativa."
                                />
                                <button
                                    type="button"
                                    className="adicionar-btn"
                                    onClick={handleAnalisarComIA}
                                    disabled={analisandoIA}
                                >
                                    {analisandoIA ? "Analisando..." : "Analisar com IA"}
                                </button>
                                {alertaIA && (
                                    <p className="cadastro-almoxarife-erro" style={{ color: "#0A086B" }}>
                                        {alertaIA}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="dados-gerais-section">
                            <div className="campos-linha">
                                <SelectForm
                                    titulo="Nome do Professor:"
                                    opcoes={listaProfessores}
                                    valor={professorId ?? ""}
                                    onChange={(val) => setProfessorId(Number(val))}
                                    labelField="nome"
                                    valueField="id"
                                />

                                <InputForm
                                    titulo="Prazo para Solicitação:"
                                    type="date"
                                    placeholder="10/05/2026"
                                    value={prazo}
                                    onChange={(e) => setPrazo(e.target.value)}
                                />

                                <SelectForm
                                    titulo="Motivo:"
                                    opcoes={listaMotivos}
                                    valor={motivoId ?? ""}
                                    onChange={(val) => setMotivoId(Number(val))}
                                    labelField="descricao"
                                    valueField="id"
                                />
                            </div>
                        </div>

                        <div className="itens-solicitacao-section">
                            {itens.map((item, index) => {
                                const materialAtual =
                                    catalogoMateriais.find((m) => m.id === item.materialId) ||
                                    catalogoMateriais[0] ||
                                    {};

                                const estoqueDisponivel = materialAtual.quantidade ?? 0;
                                const qtdNum = Number(item.qtdSolicitada);
                                const temEstoqueSuficiente =
                                    item.qtdSolicitada === "" ||
                                    (qtdNum > 0 && qtdNum <= estoqueDisponivel);

                                return (
                                    <div key={item.id} className="item-linha-wrapper">
                                        <div className="item-header-row">
                                            <span className="item-titulo-index">Item de Solicitação #{index + 1}</span>
                                            {itens.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="btn-remover-bloco"
                                                    onClick={() => removerItem(item.id)}
                                                    title="Excluir este item de solicitação"
                                                >
                                                    
                                                    <span className="btn-icone-lixeira"><IconeLixeira /></span>
                                                </button>
                                            )}
                                        </div>

                                        <div className="campos-linha">
                                            <div className="input-container">
                                                <label className="input-label">Material Solicitado:</label>
                                                <select
                                                    className="select-material-form"
                                                    value={item.materialId ?? ""}
                                                    onChange={(e) =>
                                                        atualizarItem(item.id, "materialId", Number(e.target.value))
                                                    }
                                                >
                                                    {catalogoMateriais.map((mat) => (
                                                        <option key={mat.id} value={mat.id}>
                                                            {mat.nomeMaterial ?? mat.nome}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="input-container">
                                                <label className="input-label">Quantidade em estoque:</label>
                                                <input
                                                    type="text"
                                                    className="input-form input-read-only"
                                                    value={estoqueDisponivel}
                                                    disabled
                                                    readOnly
                                                />
                                            </div>

                                            <div className="input-container">
                                                <label className="input-label">Quantidade Solicitada:</label>
                                                <div className="input-com-status">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        className="input-form input-qtd-solicitada"
                                                        placeholder="50"
                                                        value={item.qtdSolicitada}
                                                        onChange={(e) =>
                                                            atualizarItem(item.id, "qtdSolicitada", e.target.value)
                                                        }
                                                    />
                                                    {temEstoqueSuficiente ? (
                                                        <span
                                                            className="status-badge status-sucesso"
                                                            title="Quantidade dentro do estoque disponível"
                                                        >
                                                            ✔
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className="status-badge status-erro"
                                                            title="Quantidade solicitada maior que o estoque disponível!"
                                                        >
                                                            ✖
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="input-container">
                                                <label className="input-label">Deve ser devolvido?</label>
                                                <label style={{ display: "flex", alignItems: "center", gap: "8px", height: "42px" }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={item.deveDevolver}
                                                        onChange={(e) =>
                                                            atualizarItem(item.id, "deveDevolver", e.target.checked)
                                                        }
                                                    />
                                                    Sim, é um material de devolução
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {catalogoMateriais.length === 0 && (
                            <p className="solicitar-aviso">
                                Nenhum material cadastrado. Cadastre ao menos um material para solicitar.
                            </p>
                        )}

                        <button
                            type="button"
                            className="adicionar-btn"
                            onClick={adicionarItem}
                            disabled={catalogoMateriais.length === 0}
                        >
                           
                            <span className="btn-icone-adicionar"><IconeMais /></span> Adicionar Material
                        </button>
                    </div>
                </div>

                <div className="solicitar-actions">
                    <MainButton
                        texto={enviando ? "Enviando..." : "Registrar Solicitação"}
                        cor="#0A086B"
                        onClick={handleRegistrar}
                        disabled={enviando}
                    />
                    
                    <MainButton texto="Cancelar" cor="#FF4B09" onClick={handleCancelar} />
                </div>
            </main>
        </div>
    );
}

export default SolicitarMaterial;