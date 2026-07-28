import { useState } from "react";
import NavBar from "./NavBar";
import "./ModalDevolucao.css";

function ModalDevolucao({ solicitacao, onClose, onConfirmar }) {
    const primeiroMaterial = solicitacao.materiais?.[0]?.nome || "";

    const [material, setMaterial] = useState(primeiroMaterial);
    const [quantidade, setQuantidade] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState("");

    async function handleDevolver() {
        setErro("");

        if (!material.trim()) {
            setErro("Informe o material.");
            return;
        }
        if (!quantidade || Number(quantidade) <= 0) {
            setErro("Informe uma quantidade válida.");
            return;
        }

        try {
            setEnviando(true);
            await onConfirmar(material, quantidade);
            // o próprio pai fecha o modal e remove o item da tela após o sucesso
        } catch (error) {
            console.error("Erro ao registrar devolução:", error);
            setErro("Não foi possível registrar a devolução. Tente novamente.");
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-devolucao"
                onClick={(e) => e.stopPropagation()}
            >
                <NavBar mostrarVoltar={true} onVoltar={onClose} />

                <div className="modal-devolucao-conteudo">
                    <h2 className="modal-devolucao-titulo">
                        Devolução de {material || primeiroMaterial}
                    </h2>
                    <p className="modal-devolucao-solicitante">
                        Solicitante: {solicitacao.solicitante}
                    </p>

                    <div className="modal-devolucao-campo">
                        <label className="modal-devolucao-label">
                            Insira o Material:
                        </label>
                        <input
                            list="materiais-solicitacao"
                            className="modal-devolucao-input"
                            value={material}
                            onChange={(e) => setMaterial(e.target.value)}
                        />
                        <datalist id="materiais-solicitacao">
                            {solicitacao.materiais?.map((m) => (
                                <option key={m.id} value={m.nome} />
                            ))}
                        </datalist>
                    </div>

                    <div className="modal-devolucao-campo">
                        <label className="modal-devolucao-label">Quantidade:</label>
                        <input
                            type="number"
                            min="1"
                            className="modal-devolucao-input"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                        />
                    </div>

                    {erro && <p className="modal-devolucao-erro">{erro}</p>}

                    <button
                        type="button"
                        className="btn-confirmar-devolucao"
                        onClick={handleDevolver}
                        disabled={enviando}
                    >
                        {enviando ? "Enviando..." : "Devolver"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalDevolucao;