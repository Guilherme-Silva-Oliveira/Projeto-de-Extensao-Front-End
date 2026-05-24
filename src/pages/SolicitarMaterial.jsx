import "./SolicitarMaterial.css";
import NavBar from "../components/NavBar";
import InputForm from "../components/InputForm";
import MainButton from "../components/MainButton";
import MaterialItem from "../components/MaterialItem";
import { useState } from "react";

function SolicitarMaterial({ onVoltar }) {
    const [modoAtivo, setModoAtivo] = useState("Manual");

    const materiais = [
        {
            id: 1,
            nome: "Cartolina Verde Claro",
            codigo: "1029479012",
            qtdSolicitada: 50,
            qtdAtual: 60,
            aprovado: true,
        },
    ];

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} onVoltar={onVoltar} />

            <main className="solicitar-container">
                <h1 className="titulo-solicitar">SOLICITE UM MATERIAL</h1>
                <div className="linha-laranja"></div>

                {/* Botões Automático / Manual */}
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

                <div className="solicitar-form">
                    {/* Linha de campos */}
                    <div className="campos-linha">
                        <InputForm titulo="Nome do Professor:" placeholder="Matheus Torres" />
                        <InputForm titulo="Prazo para Solicitação:" placeholder="10/05/2026" />
                        <InputForm titulo="Motivo:" placeholder="Atividade Avaliativa" />
                    </div>

                    {/* Materiais Solicitados */}
                    <div className="materiais-section">
                        <label className="materiais-label">Materiais Solicitados:</label>
                        <div className="materiais-lista">
                            {materiais.map((m) => (
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
                        <button type="button" className="adicionar-btn">
                            <span className="adicionar-icone">➕</span> Adicionar Material
                        </button>
                    </div>

                    {/* Botões de ação */}
                    <div className="action-buttons solicitar-actions">
                        <MainButton texto="Registrar Solicitação" cor="#0A086B" />
                        <MainButton texto="Cancelar Solicitação" cor="#FF4B09" />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default SolicitarMaterial;