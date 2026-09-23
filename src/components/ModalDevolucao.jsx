import { useState } from "react";
import NavBar from "./NavBar";
import "./ModalDevolucao.css";

function ModalDevolucao({ solicitacao, onClose, onConfirmar }) {
    const materiais = solicitacao.materiais ?? [];
    const [itens, setItens] = useState([{ materialId: "", quantidade: "" }]);
    const [indiceAtual, setIndiceAtual] = useState(0);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState("");
    const itemAtual = itens[indiceAtual];

    function atualizarItem(campo, valor) {
        setItens((itensAtuais) => itensAtuais.map((item, indice) =>
            indice === indiceAtual ? { ...item, [campo]: valor } : item
        ));
    }

    function adicionarMaterial() {
        setItens((itensAtuais) => [...itensAtuais, { materialId: "", quantidade: "" }]);
        setIndiceAtual(itens.length);
    }

    function removerMaterial() {
        if (itens.length === 1) return;
        setItens((itensAtuais) => itensAtuais.filter((_, indice) => indice !== indiceAtual));
        setIndiceAtual((indice) => Math.max(0, indice - 1));
    }

    async function handleDevolver() {
        setErro("");
        if (materiais.length === 0) {
            setErro("Não foi possível identificar os materiais desta solicitação.");
            return;
        }
        if (itens.some((item) => !item.materialId)) {
            setErro("Selecione um material válido em cada seção.");
            return;
        }
        if (itens.some((item) => !item.quantidade || Number(item.quantidade) <= 0)) {
            setErro("Informe uma quantidade válida em cada seção.");
            return;
        }

        try {
            setEnviando(true);
            await onConfirmar(itens.map((item) => {
                const material = materiais.find((itemMaterial) =>
                    String(itemMaterial.materialId ?? itemMaterial.nome) === String(item.materialId)
                );
                return {
                    materialId: Number(item.materialId),
                    materialNome: material?.nome,
                    quantidade: Number(item.quantidade),
                };
            }));
        } catch (error) {
            console.error("Erro ao registrar devolução:", error);
            setErro("Não foi possível registrar a devolução. Tente novamente.");
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-devolucao" onClick={(event) => event.stopPropagation()}>
                <NavBar mostrarVoltar={true} onVoltar={onClose} />
                <div className="modal-devolucao-conteudo">
                    <h2 className="modal-devolucao-titulo">Devolução de material</h2>
                    <p className="modal-devolucao-solicitante">Solicitante: {solicitacao.solicitante}</p>
                    <div className="modal-devolucao-navegacao">
                        <button type="button" aria-label="Material anterior" onClick={() => setIndiceAtual((indice) => Math.max(0, indice - 1))} disabled={indiceAtual === 0}>&lt;</button>
                        <span>Material {indiceAtual + 1} de {itens.length}</span>
                        <button type="button" aria-label="Próximo material" onClick={() => setIndiceAtual((indice) => Math.min(itens.length - 1, indice + 1))} disabled={indiceAtual === itens.length - 1}>&gt;</button>
                    </div>
                    <div className="modal-devolucao-campo">
                        <label className="modal-devolucao-label">Material {indiceAtual + 1}:</label>
                        <select className="modal-devolucao-input" value={itemAtual.materialId} onChange={(event) => atualizarItem("materialId", event.target.value)}>
                            <option value="">Selecione um material</option>
                            {materiais.map((material) => (
                                <option key={material.id} value={material.materialId ?? material.nome}>{material.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-devolucao-campo">
                        <label className="modal-devolucao-label">Quantidade:</label>
                        <input type="number" min="1" className="modal-devolucao-input" value={itemAtual.quantidade} onChange={(event) => atualizarItem("quantidade", event.target.value)} />
                    </div>
                    <div className="modal-devolucao-materiais-acoes">
                        <button type="button" className="btn-adicionar-material" onClick={adicionarMaterial}>+ Adicionar Outro Material</button>
                        <button type="button" className="btn-remover-material" onClick={removerMaterial} disabled={itens.length === 1}>- Remover Material</button>
                    </div>
                    {erro && <p className="modal-devolucao-erro">{erro}</p>}
                    <button type="button" className="btn-confirmar-devolucao" onClick={handleDevolver} disabled={enviando}>
                        {enviando ? "Enviando..." : "Devolver"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalDevolucao;