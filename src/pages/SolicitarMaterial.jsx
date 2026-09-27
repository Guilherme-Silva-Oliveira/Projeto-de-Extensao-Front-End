import "./SolicitarMaterial.css";
import NavBar from "../components/NavBar";
import InputForm from "../components/InputForm";
import MainButton from "../components/MainButton";
import SelectForm from "../components/SelectForm";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../provider/api.js";

const criarItemVazio = (materialIdPadrao) => ({
    id: Date.now() + Math.random(),
    materialId: materialIdPadrao,
    qtdSolicitada: "",
    deveDevolver: false,
});

function SolicitarMaterial() {
    const navigate = useNavigate();
    const [modoAtivo, setModoAtivo] = useState("Automático");

    // Dados vindos do back-end
    const [listaProfessores, setListaProfessores] = useState([]);
    const [listaMotivos, setListaMotivos] = useState([]);
    const [catalogoMateriais, setCatalogoMateriais] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState(null);

    // Modo Automático State
    const [mensagemAuto, setMensagemAuto] = useState("");

    // Dados Gerais da Solicitação (guardam o ID, não o nome)
    const [professorId, setProfessorId] = useState(null);
    const [prazo, setPrazo] = useState("");
    const [motivoId, setMotivoId] = useState(null);

    // Lista de Materiais Solicitados
    const [itens, setItens] = useState([]);
    const [enviando, setEnviando] = useState(false);

    // Carrega professores, motivos e materiais assim que a tela abre
    useEffect(() => {
        async function carregarDadosIniciais() {
            try {
                setCarregando(true);
                const [respProfessores, respMotivos, respMateriais] = await Promise.all([
                    api.get("/v1/professores"),
                    api.get("/v1/motivos"),
                    api.get("/v1/materiais", { params: { page: 0, size: 100 } }),
                ]);

                const professores = respProfessores.data ?? [];
                const motivos = respMotivos.data ?? [];
                const materiaisPage = respMateriais.data;
                const materiais = Array.isArray(materiaisPage)
                    ? materiaisPage
                    : materiaisPage?.content ?? [];

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

    async function handleRegistrar() {
        const itensValidos = itens.filter((item) => Number(item.qtdSolicitada) > 0);

        if (itensValidos.length === 0) {
            alert("Adicione ao menos um material com quantidade válida.");
            return;
        }
        if (!professorId || !motivoId) {
            alert("Selecione o professor e o motivo.");
            return;
        }
        if (!prazo) {
            alert("Informe o prazo para a solicitação.");
            return;
        }

        // o back espera 3 strings separadas por virgula:
        // materiais="nome a,nome b" | quantidade="10,5" | deveDevolver="false,true"
        const nomesMateriais = itensValidos
            .map((item) => {
                const material = catalogoMateriais.find((m) => m.id === item.materialId);
                return material?.nomeMaterial ?? material?.nome ?? "";
            })
            .join(",");

        const quantidades = itensValidos.map((item) => item.qtdSolicitada).join(",");

        
        const deveDevolver = itensValidos
            .map((item) => String(Boolean(item.deveDevolver)))
            .join(",");

        const motivoSelecionado = listaMotivos.find((m) => m.id === motivoId);

        const payload = {
            idProfessor: professorId,
            idMotivo: motivoId,
            materiais: nomesMateriais,
            quantidade: quantidades,
            deveDevolver,
            inteligenciaArtificialId: modoAtivo === "Automático" ? 1 : null,
            descricao: motivoSelecionado?.descricao ?? motivoSelecionado?.nome ?? "Solicitação de material",
            dataSolicitacao: new Date().toISOString(),
            dataParaEnvio: `${prazo}T00:00:00`,
            alerta: null,
        };

        try {
            setEnviando(true);
            await api.post("/v1/solicitacoes", payload);
            alert("Solicitação registrada com sucesso!");
            navigate(-1);
        } catch (error) {
            console.error("Erro ao registrar solicitação:", error);
            const mensagemErro =
                error?.response?.data?.message ||
                "Erro ao registrar a solicitação. Verifique os dados e tente novamente.";
            alert(mensagemErro);
        } finally {
            setEnviando(false);
        }
    }

    function handleCancelar() {
        navigate(-1);
    }

    if (carregando) {
        return (
            <div className="page-container">
                <NavBar mostrarVoltar={true} onVoltar={() => navigate(-1)} />
                <main className="solicitar-container">
                    <p>Carregando dados...</p>
                </main>
            </div>
        );
    }

    if (erroCarregamento) {
        return (
            <div className="page-container">
                <NavBar mostrarVoltar={true} onVoltar={() => navigate(-1)} />
                <main className="solicitar-container">
                    <p>{erroCarregamento}</p>
                </main>
            </div>
        );
    }

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} onVoltar={() => navigate(-1)} />

            <main className="solicitar-container">
                <h1 className="titulo-solicitar">SOLICITE UM MATERIAL</h1>
                <div className="linha-laranja"></div>

                {/* Alternador de Modos */}
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

                {/* Área de Formulário com Rolagem */}
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
                            </div>
                        )}

                        {/* Dados Gerais da Solicitação */}
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

                        {/* Itens da Solicitação */}
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
                                                    <span className="material-symbols-outlined btn-icone-lixeira">delete</span>
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

                        <button type="button" className="adicionar-btn" onClick={adicionarItem}>
                            <span className="material-symbols-outlined btn-icone-adicionar">add_circle</span> Adicionar Material
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
                    <MainButton texto="Cancelar Solicitação" cor="#FF4B09" onClick={handleCancelar} />
                </div>
            </main>
        </div>
    );
}

export default SolicitarMaterial;
