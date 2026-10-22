import { useEffect, useState } from "react";
import SelectForm from "./SelectForm";
import { api } from "../provider/api.js";
import logo from "../assets/logo_colegio_xingu.png";
import "./ModalCadastroMaterial.css";

function ModalCadastroMaterial({
    materiaisDisponiveis,
    onClose,
    onConfirmar,
}) {
    const primeiroMaterial = materiaisDisponiveis?.[0]?.nome || "";

    const nomeMaterial = primeiroMaterial;
    const [quantidade, setQuantidade] = useState("");
    const [validade, setValidade] = useState("");
    const [fornecedores, setFornecedores] = useState([]);
    const [fornecedor, setFornecedor] = useState("");
    const [carregandoFornecedores, setCarregandoFornecedores] = useState(true);
    const [erroFornecedores, setErroFornecedores] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregarFornecedores() {
            try {
                const response = await api.get("/v1/fornecedores");
                const fornecedoresRecebidos = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data?.content)
                        ? response.data.content
                        : [];
                const fornecedoresValidos = fornecedoresRecebidos.filter(
                    (item) => item?.id != null && typeof item.nome === "string"
                );

                setFornecedores(fornecedoresValidos);
                setFornecedor(fornecedoresValidos[0]?.nome ?? "");
            } catch (error) {
                console.error("Erro ao carregar fornecedores:", error);
                setErroFornecedores(
                    error.response?.data?.mensagem ||
                    error.response?.data?.message ||
                    "Não foi possível carregar os fornecedores."
                );
            } finally {
                setCarregandoFornecedores(false);
            }
        }

        carregarFornecedores();
    }, []);

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
        if (!fornecedor) {
            setErro("Selecione um fornecedor.");
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
                <div className="modal-cadastro-material-cabecalho">
                    <img src={logo} alt="Colégio Xingu" className="modal-cadastro-material-logo" />
                    <button
                        type="button"
                        className="modal-cadastro-material-fechar"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        ×
                    </button>
                </div>
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
                            valueField="nome"
                        />
                        {carregandoFornecedores && (
                            <p className="modal-cadastro-material-erro">Carregando fornecedores...</p>
                        )}
                        {!carregandoFornecedores && !erroFornecedores && fornecedores.length === 0 && (
                            <p className="modal-cadastro-material-erro" role="alert">
                                Nenhum fornecedor cadastrado.
                            </p>
                        )}
                        {erroFornecedores && (
                            <p className="modal-cadastro-material-erro" role="alert">
                                {erroFornecedores}
                            </p>
                        )}
                    </div>

                    {erro && <p className="modal-cadastro-material-erro">{erro}</p>}

                    <button
                        type="button"
                        className="btn-confirmar-cadastro-material"
                        onClick={handleAdicionar}
                        disabled={enviando || carregandoFornecedores || fornecedores.length === 0 || Boolean(erroFornecedores)}
                    >
                        {enviando ? "Enviando..." : "Adicionar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalCadastroMaterial;