import { useState } from "react";
import "./CardDevolucao.css";

function CardDevolucao({ solicitacao, onDevolver, onEncerrar }) {
    const [aberto, setAberto] = useState(false);

    const { solicitante, dataEntrega, dataEncerramento, motivo, materiais } =
        solicitacao;


    return (
        <div className="card-devolucao">
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
                        Data e Hora da Entrega
                    </span>
                    <span className="card-devolucao-valor">{dataEntrega}</span>
                </div>

                <div className="card-devolucao-info">
                    <span className="card-devolucao-label">
                        Data Prevista para Encerramento:
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
                                style={{
                                    textDecoration: material.quantidadeDevolvida != null
                                        ? "line-through"
                                        : "none",
                                }}
                            >
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
                                        Adicionar Devolução:{" "}
                                    </span>
                                    {material.quantidadeDevolvida ?? "--"}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="card-devolucao-acoes">
                        <button
                            type="button"
                            className="btn-devolver"
                            onClick={onDevolver}
                        >
                            Devolver
                        </button>
                        <button
                            type="button"
                            className="btn-encerrar"
                            onClick={onEncerrar}
                        >
                            Encerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CardDevolucao;
