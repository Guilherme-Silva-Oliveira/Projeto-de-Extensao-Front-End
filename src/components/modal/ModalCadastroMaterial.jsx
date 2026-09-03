import { useState } from "react";
import NavBar from "../layout/NavBar";
import SelectForm from "../forms/SelectForm";
import "./ModalCadastroMaterial.css";

// temporário
function gerarFornecedoresDisponiveis() {
    return [
        { id: 1, nome: "Pais" },
        { id: 2, nome: "Escola" },
        { id: 3, nome: "Doação" },
    ];
}

function ModalCadastroMaterial({
    materiaisDisponiveis,
    fornecedoresDisponiveis,
    onClose,
    onConfirmar,
}) {
    const primeiroMaterial = materiaisDisponiveis?.[0]?.nome || "";

    // usa a lista recebida por prop; se não vier nenhuma, usa a temporária
    const fornecedores = fornecedoresDisponiveis || gerarFornecedoresDisponiveis();
    const primeiroFornecedor = fornecedores?.[0]?.nome || "";

    const [nomeMaterial, setNomeMaterial] = useState(primeiroMaterial);
    const [quantidade, setQuantidade] = useState("");
    const [validade, setValidade] = useState("");
    const [fornecedor, setFornecedor] = useState(primeiroFornecedor);
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
                <NavBar mostrarVoltar={false} onVoltar={onClose} />

                <div className="modal-cadastro-material-conteudo">
                    <h2 className="modal-cadastro-material-titulo">
                        Adição de {nomeMaterial || "Material"}
                    </h2>
                    <p className="modal-cadastro-material-categoria">
                        Categorias: {categoria}
                    </p>

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
                        <SelectForm
                            titulo="Selecione o fornecedor:"
                            opcoes={fornecedores}
                            valor={fornecedor}
                            onChange={setFornecedor}
                            labelField="nome"
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