import "./CadastroFornecedor.css";
import NavBar from "../components/NavBar";
import InputForm from "../components/InputForm";
import MainButton from "../components/MainButton";
import SelectForm from "../components/SelectForm";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../provider/api";

function CadastroFornecedor() {
    const navigate = useNavigate();

    const [nomeFornecedor, setNomeFornecedor] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");

    const [tiposFornecedor, setTiposFornecedor] = useState([]); // [{id, nomeTipo}]
    const [tipoSelecionado, setTipoSelecionado] = useState(""); // nomeTipo (string, o que o SelectForm exibe)

    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

   
    useEffect(() => {
        async function carregarTipos() {
            try {
                const response = await api.get("/v1/fornecedores/tipos");
                setTiposFornecedor(response.data);
                if (response.data.length > 0) {
                    setTipoSelecionado(response.data[0].nomeTipo);
                }
            } catch (error) {
                setErro("Não foi possível carregar os tipos de fornecedor.");
            }
        }
        carregarTipos();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        setErro("");

        const tipoEncontrado = tiposFornecedor.find(
            (tipo) => tipo.nomeTipo === tipoSelecionado
        );

        if (!tipoEncontrado) {
            setErro("Selecione um tipo de fornecedor válido.");
            return;
        }

        setCarregando(true);

        try {
            await api.post("/v1/fornecedores", {
                nome: nomeFornecedor,
                email,
                telefone,
                idTipoFornecedor: tipoEncontrado.id,
            });

            navigate(-1);
        } catch (error) {
            const mensagem =
                error.response?.data?.message ||
                "Não foi possível cadastrar o fornecedor. Verifique os dados e tente novamente.";
            setErro(mensagem);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} onVoltar={() => navigate(-1)} />

            <main className="cadastro-container">
                <h1 className="titulo-cadastro">CADASTRO DE FORNECEDOR</h1>
                <div className="linha-laranja"></div>

                <form className="cadastro-form" onSubmit={handleSubmit}>

                    <div className="cadastro-field">
                        <InputForm
                            titulo="Nome do Fornecedor:"
                            placeholder="Mohamed Neymar do Santos"
                            value={nomeFornecedor}
                            onChange={(e) => setNomeFornecedor(e.target.value)}
                            required
                        />
                    </div>

                    <div className="cadastro-field">
                        <InputForm
                            titulo="Email do Fornecedor:"
                            placeholder="fornecedor@email.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="cadastro-field">
                        <SelectForm
                            titulo="Tipo do Fornecedor:"
                            opcoes={tiposFornecedor.map((tipo) => tipo.nomeTipo)}
                            valor={tipoSelecionado}
                            onChange={setTipoSelecionado}
                        />
                    </div>

                    <div className="cadastro-field">
                        <InputForm
                            titulo="Telefone:"
                            placeholder="11953426776"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            required
                        />
                    </div>

                    {erro && <p className="cadastro-error" role="alert">{erro}</p>}

                    <div className="cadastro-actions">
                        <MainButton
                            texto={carregando ? "Cadastrando..." : "Cadastrar"}
                            cor="#0A086B"
                            type="submit"
                            disabled={carregando}
                        />
                        <MainButton
                            texto="Cancelar"
                            cor="#FF4B09"
                            type="button"
                            onClick={() => navigate(-1)}
                        />
                    </div>

                </form>
            </main>
        </div>
    );
}

export default CadastroFornecedor;