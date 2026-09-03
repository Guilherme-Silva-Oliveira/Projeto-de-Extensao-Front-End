import { useState } from "react";
import "./CardDevolucao.css";

function CardSolicitacao({ solicitacao, onFinalizar, onCancelar, className, somenteLeitura }) {
    const [aberto, setAberto] = useState(false);
    const [materiaisSelecionados, setMateriaisSelecionados] = useState([]);

    const { solicitante, dataEntrega, dataEncerramento, motivo, materiais } =
        solicitacao;

    function alternarSelecao(materialId) {
        setMateriaisSelecionados((prev) =>
            prev.includes(materialId)
                ? prev.filter((id) => id !== materialId)
                : [...prev, materialId]
        );
    }

    function handleFinalizar() {
        if (materiaisSelecionados.length === 0) {
            alert("Selecione ao menos um material para finalizar.");
            return;
        }
        onFinalizar(materiaisSelecionados);
        setMateriaisSelecionados([]);
    }

    function handleCancelar() {
        if (materiaisSelecionados.length === 0) {
            alert("Selecione ao menos um material para cancelar.");
            return;
        }
        onCancelar(materiaisSelecionados);
        setMateriaisSelecionados([]);
    }

    return (
        <div className={`card-devolucao ${className || ""}`}>
            <div
                className="card-devolucao-header"
                onClick={() => setAberto((v) => !v)}
            >
                <div className="card-devolucao-info">
                    <span className="card-devolucao-label">Solicitante:</span>
                    <span className="card-devolucao-valor">{solicitante}</span>
                </div>

                <div className="card-devolucao-info">
                    <span className="card-devolucao-label">
                        Data e Hora da Solicitação
                    </span>
                    <span className="card-devolucao-valor">{dataEntrega}</span>
                </div>

                <div className="card-devolucao-info">
                    <span className="card-devolucao-label">
                        Data Prevista para Entrega:
                    </span>
                    <span className="card-devolucao-valor">{dataEncerramento}</span>
                </div>

                <div className="card-devolucao-info">
                    <span className="card-devolucao-label">Motivo:</span>
                    <span className="card-devolucao-valor">{motivo}</span>
                </div>

                <span className={`card-devolucao-seta ${aberto ? "seta-aberta" : ""}`}>
                    ⌄
                </span>
            </div>

            {aberto && (
                <div className="card-devolucao-corpo">
                    <div className="card-devolucao-materiais">
                        {materiais.map((material) => (
                            <div
                                className="card-devolucao-material-linha"
                                key={material.id}
                            >
                                {!somenteLeitura && (
                                    <input
                                        type="checkbox"
                                        checked={materiaisSelecionados.includes(material.id)}
                                        onChange={() => alternarSelecao(material.id)}
                                    />
                                )}
                                <span>
                                    <span className="card-devolucao-label">
                                        Material:{" "}
                                    </span>
                                    {material.nome}
                                </span>
                                <span>
                                    <span className="card-devolucao-label">
                                        Quantidade Solicitada:{" "}
                                    </span>
                                    {material.quantidadeSolicitada}
                                </span>
                                <span>
                                    <span className="card-devolucao-label">
                                        Quantidade Disponível:{" "}
                                    </span>
                                    {material.quantidadeDisponivel ?? "--"}
                                </span>
                            </div>
                        ))}
                    </div>

                    {!somenteLeitura && (
                        <div className="card-devolucao-acoes">
                            <button
                                type="button"
                                className="btn-devolver"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleFinalizar();
                                }}
                            >
                                Finalizar
                            </button>
                            <button
                                type="button"
                                className="btn-encerrar"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelar();
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CardSolicitacao;