import "./CadastroMaterial.css";
import NavBar from "../components/NavBar";
import InputForm from "../components/InputForm";
import MainButton from "../components/MainButton";
import SelectForm from "../components/SelectForm";
import { useEffect, useState } from "react";
import { api } from "../provider/api.js";
import { useNavigate } from "react-router-dom";

function CadastroMaterial() {
    const navigate = useNavigate();

    const [nomeMaterial, setNomeMaterial] = useState("");

    const [categoriaId, setCategoriaId] = useState("");
    const [categorias, setCategorias] = useState([])

    const [almoxarifadoId] = useState(
        () => parseInt(sessionStorage.getItem("almoxarifadoId")) || ""
    )
 
    const [unidadeMedidaId, setUnidadeMedidaId] = useState("")
    const [unidadesMedida, setUnidadesMedida] = useState([])

    const [setorId, setSetorId] = useState("");
    const [setores, setSetores] = useState([]);

    const [descricao, setDescricao] = useState("");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);


    useEffect(() => {
        async function carregarOpcoes() {
            try {
                const [categoriasResponse, unidadesResponse, setoresResponse] = await Promise.all([
                    api.get("/v1/categorias"),
                    api.get("/v1/unidademedida"),
                    api.get("/v1/setores"),
                ]);

                const categoriasRecebidas = Array.isArray(categoriasResponse.data)
                    ? categoriasResponse.data
                    : [];
                const unidadesRecebidas = Array.isArray(unidadesResponse.data)
                    ? unidadesResponse.data
                    : [];
                const setoresRecebidos = Array.isArray(setoresResponse.data)
                    ? setoresResponse.data.map((setor) => ({
                        ...setor,
                        id: setor.almoxarifadoId,
                        nome: setor.identificadorSetor,
                    }))
                    : [];

                setCategorias(categoriasRecebidas);
                setUnidadesMedida(unidadesRecebidas);
                setSetores(setoresRecebidos);
                setCategoriaId(categoriasRecebidas[0]?.id ?? "");
                setUnidadeMedidaId(unidadesRecebidas[0]?.id ?? "");
                setSetorId(setoresRecebidos[0]?.id ?? "");
            } catch (error) {
                console.error("Erro ao buscar opções do material:", error);
                setErro("Não foi possível carregar categorias, unidades de medida e setores.");
            }
        }

        carregarOpcoes();
    }, []);

    async function cadastrar() {
        const idCategoria = Number(categoriaId);
        const idAlmoxarifado = Number(almoxarifadoId);
        const idUnidadeMedida = Number(unidadeMedidaId);
        const idSetor = Number(setorId);

        if (!nomeMaterial.trim()) {
            setErro("Informe o nome do material.");
            return false;
        }

        if (!idCategoria || !idAlmoxarifado || !idUnidadeMedida || !idSetor) {
            setErro("Não foi possível identificar os dados obrigatórios do material.");
            return false;
        }

        try {
            setEnviando(true);
            setErro("");
            await api.post("/v1/materiais", {
                idCategoria,
                idAlmoxarifado,
                nomeMaterial: nomeMaterial.trim(),
                codigoBarras: String(gerarCodigoBarras()),
                idUnidadeMedida,
                descricao: descricao.trim(),
                setorId: idSetor,
            });
            return true;
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            setErro(
                error.response?.data?.message ||
                "Não foi possível cadastrar o material. Tente novamente."
            );
            return false;
        } finally {
            setEnviando(false);
        }
    }

    function gerarCodigoBarras() {
        return Math.floor(100000000 + Math.random() * 900000000);
    }

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} onVoltar={() => navigate(-1)} />

            <main className="cadastro-container">
                <h1 className="titulo-cadastro">CADASTRO DE MATERIAL</h1>
                <div className="linha-laranja"></div>

                <div className="cadastro-form">

                <div className="cadastro-field">
                    <InputForm
                        titulo="Nome do material:"
                        placeholder="Pincel B21"
                        value={nomeMaterial}
                        onChange={(e) => setNomeMaterial(e.target.value)}
                    />
                </div>

                <div className="cadastro-field">
                    <SelectForm
                        titulo="Categoria:"
                         opcoes={categorias}
                         valor={categoriaId}
                         onChange={(id) => setCategoriaId(id)}
                         labelField={"nomeCategoria"}
                         valueField="id"
                     />
                </div>

                <div className="cadastro-field">
                    <SelectForm
                        titulo="Unidade de medida:"
                        opcoes={unidadesMedida}
                        valor={unidadeMedidaId}
                        onChange={(id) => setUnidadeMedidaId(id)}
                        labelField={"nomeUnidade"}
                        valueField="id"
                    />
                </div>

                <div className="cadastro-field">
                    <SelectForm
                        titulo="Setor:"
                        opcoes={setores}
                        valor={setorId}
                        onChange={setSetorId}
                        labelField="nome"
                        valueField="id"
                    />
                </div>

                <div className="descricao-section">
                    <label className="descricao-label">
                        Adicione uma descrição ao material (opcional):
                    </label>
                    <textarea
                        className="descricao-textarea"
                        placeholder="Pincel ideal para acabamento e detalhes."
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        rows={4}
                    />
                </div>

                {erro && <p className="cadastro-error">{erro}</p>}

                <div className="cadastro-actions">
                    <MainButton
                        texto={enviando ? "Cadastrando..." : "Cadastrar"}
                        cor="#0A086B"
                        disabled={enviando}
                        onClick={async () => {
                            const cadastrado = await cadastrar();
                            if (cadastrado) navigate(-1);
                        }}
                    />
                    <MainButton
                        texto="Cancelar"
                        cor="#FF4B09"
                        disabled={enviando}
                        onClick={() => navigate(-1)}
                    />
                </div>

                </div>
            </main>
        </div>
    );
}

export default CadastroMaterial;
