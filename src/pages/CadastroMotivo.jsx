import "./CadastroMotivo.css";
import NavBar from "../components/NavBar";
import MainButton from "../components/MainButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../provider/api.js";

function CadastroMotivo() {
    const navigate = useNavigate();

    const [descricao, setDescricao] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState("");

    async function cadastrar() {
        setErro("");

        if (!descricao.trim()) {
            setErro("Informe uma descrição para o motivo.");
            return;
        }

        try {
            setEnviando(true);
            await api.post("/v1/motivos", { descricao: descricao.trim() });
            navigate(-1);
        } catch (error) {
            console.error("Erro ao cadastrar motivo:", error);
            setErro("Não foi possível cadastrar o motivo. Tente novamente.");
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} onVoltar={() => navigate(-1)} />

            <main className="cadastro-container">
                <h1 className="titulo-cadastro">CADASTRO DE MOTIVO</h1>
                <div className="linha-laranja"></div>

                <div className="cadastro-form">

                    <div className="descricao-section">
                        <label className="descricao-label">Motivo:</label>
                        <textarea
                            className="descricao-textarea"
                            placeholder="Atividade Avaliativa"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            rows={4}
                            disabled={enviando}
                        />
                    </div>

                    {erro && <p className="cadastro-erro">{erro}</p>}

                    <div className="cadastro-actions">
                        <MainButton
                            texto={enviando ? "Cadastrando..." : "Cadastrar"}
                            cor="#0A086B"
                            onClick={cadastrar}
                        />
                        <MainButton
                            texto="Cancelar"
                            cor="#FF4B09"
                            onClick={() => navigate(-1)}
                        />
                    </div>

                </div>
            </main>
        </div>
    );
}

export default CadastroMotivo;