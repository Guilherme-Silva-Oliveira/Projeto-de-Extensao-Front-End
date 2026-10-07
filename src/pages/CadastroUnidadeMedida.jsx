import "./CadastroProfessor.css";
import "./CadastroUnidadeMedida.css";
import NavBar from "../components/NavBar.jsx";
import InputForm from "../components/InputForm.jsx";
import MainButton from "../components/MainButton.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../provider/api.js";

function CadastroUnidadeMedida() {
    const navigate = useNavigate();

    const [nomeUnidade, setNomeUnidade] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState("");

    async function handleCadastrar() {
        const nomeUnidadeNormalizado = nomeUnidade.trim();
        if (!nomeUnidadeNormalizado) {
            setErro("Informe o nome da unidade de medida.");
            return;
        }

        try {
            setEnviando(true);
            setErro("");
            await api.post("/v1/unidademedida", {
                nomeUnidade: nomeUnidadeNormalizado,
            });
            navigate("/gerenciamentos/unidades-medida");
        } catch (error) {
            console.error("Erro ao cadastrar unidade de medida:", error);
            if (error.response?.status === 401) {
                setErro("Sessão expirada ou não autenticada. Faça login novamente.");
            } else if (error.response?.data?.message) {
                setErro(error.response.data.message);
            } else {
                setErro(
                    "Não foi possível cadastrar a unidade de medida. Verifique a conexão com o servidor."
                );
            }
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="page-container">
            <NavBar mostrarLinks={true} mostrarVoltar={true} />
                
            <main className="cadastro-container">
                <h1 className="titulo-cadastro">CADASTRO DE UNIDADE DE MEDIDA</h1>
                <div className="linha-laranja"></div>

                <div className="cadastro-form">

                    <div className="cadastro-field">
                        <InputForm
                            titulo="Nome da unidade de medida"
                            placeholder="Unidade"
                            type="text"
                            value={nomeUnidade}
                            onChange={(e) => setNomeUnidade(e.target.value)}
                            required
                        />
                    </div>

                    {erro && <p className="cadastro-unidade-erro" role="alert">{erro}</p>}

                    <div className="cadastro-actions">
                        <MainButton
                            texto={enviando ? "Cadastrando..." : "Cadastrar"}
                            cor="#0A086B"
                            disabled={enviando}
                            onClick={handleCadastrar}
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

export default CadastroUnidadeMedida;