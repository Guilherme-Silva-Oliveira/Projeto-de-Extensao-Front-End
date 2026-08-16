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

const criarBlocoVazio = () => ({
    id: Date.now() + Math.random(),
    nomeProfessor: listaProfessores[0].nome,
    prazo: "",
    motivo: listaMotivos[0].nome,
    materialId: catalogoMateriais[0].id,
    qtdSolicitada: "",
});

function SolicitarMaterial() {
    const navigate = useNavigate();
    const [modoAtivo, setModoAtivo] = useState("Automático");

    // Modo Automático State
    const [mensagemAuto, setMensagemAuto] = useState("");

    // Blocos de solicitação
    const [blocos, setBlocos] = useState([criarBlocoVazio()]);

    function adicionarBloco() {
        setBlocos((prev) => [...prev, criarBlocoVazio()]);
    }

    function removerBloco(id) {
        setBlocos((prev) => prev.filter((b) => b.id !== id));
    }

    function atualizarBloco(id, campo, valor) {
        setBlocos((prev) =>
            prev.map((b) => (b.id === id ? { ...b, [campo]: valor } : b))
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
                                    rows={4}
                                    placeholder="Eu Matheus Torres, gostaria de 50 cartolinas de cor verde claro para o dia 10/05/2026 para uma atividade avaliativa."
                                />
                            </div>
                        )}

                        {/* Renderização dos Blocos de Solicitação */}
                        {blocos.map((bloco, index) => {
                            const materialAtual =
                                catalogoMateriais.find((m) => m.id === bloco.materialId) ||
                                catalogoMateriais[0];

                            const qtdNum = Number(bloco.qtdSolicitada);
                            const temEstoqueSuficiente =
                                bloco.qtdSolicitada === "" ||
                                (qtdNum > 0 && qtdNum <= materialAtual.qtdEstoque);

                            return (
                                <div key={bloco.id} className="bloco-wrapper">
                                    {index > 0 && <div className="bloco-separador" />}
                                    <div className="bloco-solicitacao">
                                        {/* Cabeçalho do Bloco com Ícone de Lixeira */}
                                        <div className="bloco-header">
                                            <span className="bloco-titulo-index">Item de Solicitação #{index + 1}</span>
                                            <button
                                                type="button"
                                                className="btn-remover-bloco"
                                                onClick={() => removerBloco(bloco.id)}
                                                title="Excluir este item de solicitação"
                                            >
                                                <span className="material-symbols-outlined btn-icone-lixeira">delete</span>
                                            </button>
                                        </div>

                                        {/* Linha 1: Professor (Select), Prazo (Date), Motivo (Select) */}
                                        <div className="campos-linha">
                                            <SelectForm
                                                titulo="Nome do Professor:"
                                                opcoes={listaProfessores}
                                                valor={bloco.nomeProfessor}
                                                onChange={(val) => atualizarBloco(bloco.id, "nomeProfessor", val)}
                                                labelField="nome"
                                            />

                                            <InputForm
                                                titulo="Prazo para Solicitação:"
                                                type="date"
                                                placeholder="10/05/2026"
                                                value={bloco.prazo}
                                                onChange={(e) =>
                                                    atualizarBloco(bloco.id, "prazo", e.target.value)
                                                }
                                            />

                                            <SelectForm
                                                titulo="Motivo:"
                                                opcoes={listaMotivos}
                                                valor={bloco.motivo}
                                                onChange={(val) => atualizarBloco(bloco.id, "motivo", val)}
                                                labelField="nome"
                                            />
                                        </div>

                                        {/* Linha 2: Material Solicitado (Select), Quantidade em estoque (Disabled), Quantidade Solicitada (Com status) */}
                                        <div className="campos-linha">
                                            <div className="input-container">
                                                <label className="input-label">Material Solicitado:</label>
                                                <select
                                                    className="select-material-form"
                                                    value={bloco.materialId}
                                                    onChange={(e) =>
                                                        atualizarBloco(bloco.id, "materialId", Number(e.target.value))
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
                                                        value={bloco.qtdSolicitada}
                                                        onChange={(e) =>
                                                            atualizarBloco(bloco.id, "qtdSolicitada", e.target.value)
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
                                </div>
                            );
                        })}

                        {/* Botão Adicionar Material */}
                        <button
                            type="button"
                            className="adicionar-btn"
                            onClick={adicionarBloco}
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