import "./CadastroMaterial.css";
import NavBar from "../components/NavBar";
import InputForm from "../components/InputForm";
import MainButton from "../components/MainButton";
import SelectForm from "../components/SelectForm";
import { useEffect} from "react";
import { api } from "../provider/api.js"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CadastroMaterial() {
    const navigate = useNavigate();

    const [nomeMaterial, setNomeMaterial] = useState("");

    const [categoriaId, setCategoriaId] = useState("");
    const [categorias, setCategorias] = useState([])

    const [almoxarifadoId, setAlmoxarifadoId] = useState("")
 
    const [unidadeMedidaId, setUnidadeMedidaId] = useState("")
    const [unidadesMedida, setUnidadesMedida] = useState([])

    const [descricao, setDescricao] = useState("");


    useEffect(() => {
        loginMock()
        getCategorias()
        getUnidadeMedida()
    }, [])


    // login mockado p pegar o cookie do back
    async function loginMock() {
        const res = await api.post("/v1/almoxarifes/login", {
            email: "marisa@gmail.com",
            senha: "xingu1234",
        });
        if (res.data.almoxarifado.id) {
            setAlmoxarifadoId(res.data.almoxarifado.id)
        }
    }

    async function getCategorias() {
        try {
            const res = await api.get("/v1/categorias");
            setCategorias(res.data);
            if (res.data && res.data.length > 0) {
                setCategoriaId(res.data[0].id);
            }
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    }

    async function getUnidadeMedida() {
        try {
            const res = await api.get("/v1/unidademedida");
            if (res.data && res.data.length > 0) {
                setUnidadesMedida(res.data);
                setUnidadeMedidaId(res.data[0].id);
            }
        } catch (error) {
            console.error("Erro ao buscar unidades de medida:", error);
        }
    }

    async function cadastrar() {
        console.log("Cadastrar:")
        console.log("Categoria ID: ", categoriaId)
        console.log("Almoxarifado ID: ", almoxarifadoId)
        console.log("Nome Material: ", nomeMaterial)
        console.log("Unidade Medida ID: ", unidadeMedidaId)
        console.log("Descricao: ", descricao)

        try {
            const res = await api.post("/v1/materiais", { 
                idCategoria: categoriaId,
                idAlmoxarifado: almoxarifadoId,
                nomeMaterial: nomeMaterial,
                codigoBarras: gerarCodigoBarras(),
                idUnidadeMedida: unidadeMedidaId,
                descricao: descricao
            })
            console.log("post response: ", res.data)
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
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

                <div className="cadastro-actions">
                    <MainButton texto="Cadastrar" cor="#0A086B" onClick={async () => {
                        await cadastrar()
                        //navigate(-1)
                    }} />
                    <MainButton texto="Cancelar" cor="#FF4B09" onClick={() => navigate(-1)} />
                </div>

                </div>
            </main>
        </div>
    );
}

export default CadastroMaterial;
