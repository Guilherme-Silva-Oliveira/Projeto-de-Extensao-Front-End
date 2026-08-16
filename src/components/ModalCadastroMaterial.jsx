import { useState } from "react";
import NavBar from "./NavBar";
import SelectForm from "./SelectForm";
import "./ModalCadastroMaterial.css";

function ModalCadastroMaterial({ materiaisDisponiveis, onClose, onConfirmar }) {
    const primeiroMaterial = materiaisDisponiveis?.[0]?.nome || "";

    const [nomeMaterial, setNomeMaterial] = useState(primeiroMaterial);
    const [quantidade, setQuantidade] = useState("");
    const [validade, setValidade] = useState("");
    const [fornecedor, setFornecedor] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState("");

    const materialSelecionado = materiaisDisponiveis?.find(
        (m) => m.nome === nomeMaterial
    );
    const categoria = materialSelecionado?.categoria || "Não definida";

    async function handleAdicionar() {
        setErro("");

        if (!nomeMaterial) {
            setErro("Selecione um material.");
            return;
        }
        if (!quantidade || Number(quantidade) <= 0) {
            setErro("Informe uma quantidade válida.");
            return;
        }

        try {
            setEnviando(true);
            await onConfirmar({
                nome: nomeMaterial,
                categoria,
                quantidade,
                validade,
                fornecedor,
            });
        } catch (error) {
            console.error("Erro ao cadastrar material:", error);
            setErro("Não foi possível cadastrar o material. Tente novamente.");
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-cadastro-material"
                onClick={(e) => e.stopPropagation()}
            >
                <NavBar mostrarVoltar={true} onVoltar={onClose} />

                <div className="modal-cadastro-material-conteudo">
                    <h2 className="modal-cadastro-material-titulo">
                        Adição de {nomeMaterial || "Material"}
                    </h2>
                    <p className="modal-cadastro-material-categoria">
                        Categorias: {categoria}
                    </p>

                    <div className="modal-cadastro-material-campo">
                        <SelectForm
                            titulo="Selecione o material:"
                            opcoes={materiaisDisponiveis || []}
                            valor={nomeMaterial}
                            onChange={setNomeMaterial}
                            labelField="nome"
                        />
                    </div>

                    <div className="modal-cadastro-material-campo">
                        <label className="modal-cadastro-material-label">
                            Insira a quantidade:
                        </label>
                        <input
                            type="number"
                            min="1"
                            className="modal-cadastro-material-input"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                        />
                    </div>

                    <div className="modal-cadastro-material-campo">
                        <label className="modal-cadastro-material-label">
                            Insira a data de validade (se aplicável):
                        </label>
                        <input
                            type="date"
                            className="modal-cadastro-material-input"
                            value={validade}
                            onChange={(e) => setValidade(e.target.value)}
                        />
                    </div>

                    <div className="modal-cadastro-material-campo">
                        <label className="modal-cadastro-material-label">
                            Defina o fornecedor:
                        </label>
                        <input
                            type="text"
                            className="modal-cadastro-material-input"
                            value={fornecedor}
                            onChange={(e) => setFornecedor(e.target.value)}
                        />
                    </div>

                    {erro && <p className="modal-cadastro-material-erro">{erro}</p>}

                    <button
                        type="button"
                        className="btn-confirmar-cadastro-material"
                        onClick={handleAdicionar}
                        disabled={enviando}
                    >
                        {enviando ? "Enviando..." : "Adicionar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalCadastroMaterial;