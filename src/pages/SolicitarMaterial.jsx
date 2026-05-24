import "./SolicitarMaterial.css";
import NavBar from "../components/NavBar";
import InputForm from "../components/InputForm";
import MainButton from "../components/MainButton";
import MaterialItem from "../components/MaterialItem";
import { useState } from "react";

const materialPadrao = {
    id: 1,
    nome: "Cartolina Verde Claro",
    codigo: "1029479012",
    qtdSolicitada: 50,
    qtdAtual: 60,
    aprovado: true,
};

const blocoPadrao = () => ({
    id: Date.now() + Math.random(),
    nomeProfessor: "Matheus Torres",
    prazo: "10/05/2026",
    motivo: "Atividade Avaliativa",
    materiais: [{ ...materialPadrao }],
});

const blocoAutomaticoPadrao = () => ({
    id: Date.now() + Math.random(),
    mensagem: "",
    nomeProfessor: "",
    prazo: "",
    motivo: "",
    materiais: [{ ...materialPadrao }],
});

function SolicitarMaterial({ onVoltar }) {
    const [modoAtivo, setModoAtivo] = useState("Manual");

    const [blocos, setBlocos] = useState([blocoPadrao()]);

    const [blocosAutomaticos, setBlocosAutomaticos] = useState([
        {
            id: Date.now(),
            mensagem: "Eu Matheus Torres, gostaria de 50 cartolinas de cor verde claro para o dia 10/05/2026 para uma atividade avaliativa.",
            nomeProfessor: "Matheus Torres",
            prazo: "10/05/2026",
            motivo: "Atividade Avaliativa",
            materiais: [{ ...materialPadrao }],
        }
    ]);

    function adicionarBloco() {
        setBlocos((prev) => [...prev, blocoPadrao()]);
    }

    function adicionarBlocoAutomatico() {
        setBlocosAutomaticos((prev) => [...prev, blocoAutomaticoPadrao()]);
    }

    function atualizarMensagem(id, novaMsg) {
        setBlocosAutomaticos((prev) =>
            prev.map((b) => b.id === id ? { ...b, mensagem: novaMsg } : b)
        );
    }

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} onVoltar={onVoltar} />

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

                
                <div className="solicitar-scroll-area">
                    <div className="solicitar-form">

                       
                        {modoAtivo === "Automático" && (
                            <>
                                {blocosAutomaticos.map((bloco, index) => (
                                    <div key={bloco.id}>
                                        {index > 0 && <div className="bloco-separador" />}
                                        <div className="bloco-solicitacao">

                                            <div className="automatico-section">
                                                <label className="materiais-label">Mensagem de Solicitação:</label>
                                                <textarea
                                                    className="mensagem-textarea"
                                                    value={bloco.mensagem}
                                                    onChange={(e) => atualizarMensagem(bloco.id, e.target.value)}
                                                    rows={5}
                                                />
                                            </div>

                                            <div className="campos-linha">
                                                <InputForm titulo="Nome do Professor:" placeholder={bloco.nomeProfessor || "Nome do Professor"} />
                                                <InputForm titulo="Prazo para Solicitação:" placeholder={bloco.prazo || "DD/MM/AAAA"} />
                                                <InputForm titulo="Motivo:" placeholder={bloco.motivo || "Motivo"} />
                                            </div>

                                            <div className="materiais-section">
                                                <label className="materiais-label">Materiais Solicitados:</label>
                                                <div className="materiais-lista">
                                                    {bloco.materiais.map((m) => (
                                                        <MaterialItem
                                                            key={m.id}
                                                            nome={m.nome}
                                                            codigo={m.codigo}
                                                            qtdSolicitada={m.qtdSolicitada}
                                                            qtdAtual={m.qtdAtual}
                                                            aprovado={m.aprovado}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ))}

                                <button type="button" className="adicionar-btn" onClick={adicionarBlocoAutomatico}>
                                    <span className="adicionar-icone">➕</span> Adicionar Material
                                </button>
                            </>
                        )}

                        
                        {modoAtivo === "Manual" && (
                            <>
                                {blocos.map((bloco, index) => (
                                    <div key={bloco.id}>
                                        {index > 0 && <div className="bloco-separador" />}
                                        <div className="bloco-solicitacao">
                                            <div className="campos-linha">
                                                <InputForm titulo="Nome do Professor:" placeholder={bloco.nomeProfessor} />
                                                <InputForm titulo="Prazo para Solicitação:" placeholder={bloco.prazo} />
                                                <InputForm titulo="Motivo:" placeholder={bloco.motivo} />
                                            </div>
                                            <div className="materiais-section">
                                                <label className="materiais-label">Materiais Solicitados:</label>
                                                <div className="materiais-lista">
                                                    {bloco.materiais.map((m) => (
                                                        <MaterialItem
                                                            key={m.id}
                                                            nome={m.nome}
                                                            codigo={m.codigo}
                                                            qtdSolicitada={m.qtdSolicitada}
                                                            qtdAtual={m.qtdAtual}
                                                            aprovado={m.aprovado}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button type="button" className="adicionar-btn" onClick={adicionarBloco}>
                                    <span className="adicionar-icone">➕</span> Adicionar Material
                                </button>
                            </>
                        )}

                    </div>
                </div>

               
                <div className="solicitar-actions">
                    <MainButton texto="Registrar Solicitação" cor="#0A086B" />
                    <MainButton texto="Cancelar Solicitação" cor="#FF4B09" />
                </div>
            </main>
        </div>
    );
}

export default SolicitarMaterial;