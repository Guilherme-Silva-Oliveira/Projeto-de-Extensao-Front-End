import "./SolicitarMaterial.css";
import NavBar from "../components/NavBar";
import InputForm from "../components/InputForm";
import MainButton from "../components/MainButton";
import SelectForm from "../components/SelectForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const catalogoMateriais = [
    { id: 1, nome: "Cartolina Verde Claro", codigo: "1029479012", qtdEstoque: 60 },
    { id: 2, nome: "Papel Sulfite A4 (Pacote 500fls)", codigo: "1029479013", qtdEstoque: 500 },
    { id: 3, nome: "Pincel Atômico Azul", codigo: "1029479014", qtdEstoque: 45 },
    { id: 4, nome: "Cola Branca Escola 500g", codigo: "1029479015", qtdEstoque: 20 },
    { id: 5, nome: "Tesoura Sem Ponta", codigo: "1029479016", qtdEstoque: 35 },
    { id: 6, nome: "Tinta Guache Sortida 250ml", codigo: "1029479017", qtdEstoque: 18 },
];

const listaProfessores = [
    { id: 1, nome: "Matheus Torres" },
    { id: 2, nome: "Ricardo Amaral" },
    { id: 3, nome: "Ana Paula Silva" },
    { id: 4, nome: "Carlos Eduardo" },
    { id: 5, nome: "Fernanda Lima" },
];

const listaMotivos = [
    { id: 1, nome: "Atividade Avaliativa" },
    { id: 2, nome: "Aula Prática" },
    { id: 3, nome: "Projeto Escolar" },
    { id: 4, nome: "Reposição de Estoque" },
    { id: 5, nome: "Evento Escolar" },
    { id: 6, nome: "Outros" },
];

const criarItemVazio = () => ({
    id: Date.now() + Math.random(),
    materialId: catalogoMateriais[0].id,
    qtdSolicitada: "",
});

function SolicitarMaterial() {
    const navigate = useNavigate();
    const [modoAtivo, setModoAtivo] = useState("Automático");

    // Modo Automático State
    const [mensagemAuto, setMensagemAuto] = useState("");

    // Dados Gerais da Solicitação (Único para toda a solicitação)
    const [nomeProfessor, setNomeProfessor] = useState(listaProfessores[0].nome);
    const [prazo, setPrazo] = useState("");
    const [motivo, setMotivo] = useState(listaMotivos[0].nome);

    // Lista de Materiais Solicitados
    const [itens, setItens] = useState([criarItemVazio()]);

    function adicionarItem() {
        setItens((prev) => [...prev, criarItemVazio()]);
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

    function handleRegistrar() {
        alert("Solicitação registrada com sucesso!");
        navigate(-1);
    }

    function handleCancelar() {
        navigate(-1);
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
                        {/* Campo de Mensagem IA no Modo Automático */}
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

                        {/* Dados Gerais da Solicitação (Linha Única) */}
                        <div className="dados-gerais-section">
                            <div className="campos-linha">
                                <SelectForm
                                    titulo="Nome do Professor:"
                                    opcoes={listaProfessores}
                                    valor={nomeProfessor}
                                    onChange={(val) => setNomeProfessor(val)}
                                    labelField="nome"
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
                                    valor={motivo}
                                    onChange={(val) => setMotivo(val)}
                                    labelField="nome"
                                />
                            </div>
                        </div>

                        {/* Seção de Itens da Solicitação */}
                        <div className="itens-solicitacao-section">
                            {itens.map((item, index) => {
                                const materialAtual =
                                    catalogoMateriais.find((m) => m.id === item.materialId) ||
                                    catalogoMateriais[0];

                                const qtdNum = Number(item.qtdSolicitada);
                                const temEstoqueSuficiente =
                                    item.qtdSolicitada === "" ||
                                    (qtdNum > 0 && qtdNum <= materialAtual.qtdEstoque);

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
                                                    value={item.materialId}
                                                    onChange={(e) =>
                                                        atualizarItem(item.id, "materialId", Number(e.target.value))
                                                    }
                                                >
                                                    {catalogoMateriais.map((mat) => (
                                                        <option key={mat.id} value={mat.id}>
                                                            {mat.nome}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="input-container">
                                                <label className="input-label">Quantidade em estoque:</label>
                                                <input
                                                    type="text"
                                                    className="input-form input-read-only"
                                                    value={materialAtual.qtdEstoque}
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
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Botão Adicionar Material */}
                        <button
                            type="button"
                            className="adicionar-btn"
                            onClick={adicionarItem}
                        >
                            <span className="material-symbols-outlined btn-icone-adicionar">add_circle</span> Adicionar Material
                        </button>
                    </div>
                </div>

                {/* Botões de Ação Finais */}
                <div className="solicitar-actions">
                    <MainButton texto="Registrar Solicitação" cor="#0A086B" onClick={handleRegistrar} />
                    <MainButton texto="Cancelar Solicitação" cor="#FF4B09" onClick={handleCancelar} />
                </div>
            </main>
        </div>
    );
}

export default SolicitarMaterial;