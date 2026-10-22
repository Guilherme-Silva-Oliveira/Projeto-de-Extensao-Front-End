import { useState } from "react";
import "./CardDevolucao.css";


const ALERTAS = {
    TUDO_CERTO: { rotulo: "Tudo certo", classe: "alerta-badge-ok" },
    ESTOQUE_VAZIO: { rotulo: "Estoque zerado", classe: "alerta-badge-atencao" },
    MATERIAIS_INSUFICIENTES: { rotulo: "Material insuficiente", classe: "alerta-badge-erro" },
};

function interpretarAlerta(alerta) {
    if (!alerta) return null;
    const separador = alerta.indexOf(":");
    const codigo = (separador >= 0 ? alerta.slice(0, separador) : alerta).trim();
    const detalhe = separador >= 0 ? alerta.slice(separador + 1).trim() : "";
    const info = ALERTAS[codigo];
    if (!info) return { rotulo: alerta, classe: "alerta-badge-neutro", detalhe: "" };
    return { ...info, detalhe };
}

const temValor = (valor) => Boolean(valor) && valor !== "--";

function CardSolicitacao({ solicitacao, onFinalizar, onCancelar, className, somenteLeitura }) {
    const [aberto, setAberto] = useState(false);
    const [materiaisSelecionados, setMateriaisSelecionados] = useState([]);

    const {
        solicitante, dataEntrega, dataEncerramento, dataReprovacao, motivoReprovacao,
        dataFinalizacao, motivo, alerta, materiais = [],
    } = solicitacao;

    const alertaInfo = interpretarAlerta(alerta);

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
        onCancelar();
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
                    <span className="card-devolucao-label">Data e Hora da Solicitação</span>
                    <span className="card-devolucao-valor">{dataEntrega}</span>
                </div>

                <div className="card-devolucao-info">
                    <span className="card-devolucao-label">Data Prevista para Entrega:</span>
                    <span className="card-devolucao-valor">{dataEncerramento}</span>
                </div>

                <div className="card-devolucao-info">
                    <span className="card-devolucao-label">Motivo:</span>
                    <span className="card-devolucao-valor">{motivo}</span>
                </div>

                
                <div className="card-devolucao-info card-devolucao-info-alerta">
                    <span className="card-devolucao-label">Alerta:</span>
                    {alertaInfo ? (
                        <>
                            <span className={`alerta-badge ${alertaInfo.classe}`}>{alertaInfo.rotulo}</span>
                            {alertaInfo.detalhe && (
                                <span className="alerta-detalhe">{alertaInfo.detalhe}</span>
                            )}
                        </>
                    ) : (
                        <span className="card-devolucao-valor">--</span>
                    )}
                </div>

                {temValor(dataReprovacao) && (
                    <div className="card-devolucao-info">
                        <span className="card-devolucao-label">Data e Hora da Reprovação:</span>
                        <span className="card-devolucao-valor">{dataReprovacao}</span>
                    </div>
                )}

                {temValor(dataFinalizacao) && (
                    <div className="card-devolucao-info">
                        <span className="card-devolucao-label">Data e Hora da Finalização:</span>
                        <span className="card-devolucao-valor">{dataFinalizacao}</span>
                    </div>
                )}

                <span className={`card-devolucao-seta ${aberto ? "seta-aberta" : ""}`}>
                    ⌄
                </span>
            </div>

            
            {temValor(dataReprovacao) && (
                <div className="card-devolucao-reprovacao">
                    <span className="card-devolucao-label">Motivo da reprovação:</span>
                    <p>{motivoReprovacao || "Não informado"}</p>
                </div>
            )}

            {aberto && (
                <div className="card-devolucao-corpo">
                    {materiais.length > 0 ? (
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
                                        <span className="card-devolucao-label">Material: </span>
                                        {material.nome}
                                    </span>
                                    <span>
                                        <span className="card-devolucao-label">Quantidade Solicitada: </span>
                                        {material.quantidadeSolicitada}
                                    </span>
                                    <span>
                                        <span className="card-devolucao-label">Quantidade Disponível: </span>
                                        {material.quantidadeDisponivel ?? "--"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="devolucoes-status">Detalhes de materiais não disponíveis.</p>
                    )}

                    {!somenteLeitura && materiais.length > 0 && (
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