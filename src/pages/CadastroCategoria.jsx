import "./CadastroProfessor.css";
import NavBar from "../components/NavBar";
import InputForm from "../components/InputForm";
import MainButton from "../components/MainButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../provider/api.js";

function CadastroCategoria() {
    const navigate = useNavigate();
    
    const [nomeCategoria, setNomeCategoria] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState(""); // "sucesso" ou "erro"

    async function handleCadastrar() {
        if (!nomeCategoria.trim()) {
            setMensagem("Por favor, preencha o nome da categoria.");
            setTipoMensagem("erro");
            return;
        }

        try {
            setEnviando(true);
            setMensagem("");

            await api.post("/v1/categorias", {
                nomeCategoria: nomeCategoria.trim()
            });

            setMensagem("Categoria cadastrada com sucesso!");
            setTipoMensagem("sucesso");
            setNomeCategoria("");

            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (error) {
            console.error("Erro ao cadastrar categoria:", error);
            setTipoMensagem("erro");
            if (error.response?.status === 401) {
                setMensagem("Sessão expirada ou não autenticada. Faça login novamente.");
            } else if (error.response?.data?.message) {
                setMensagem(error.response.data.message);
            } else {
                setMensagem("Não foi possível cadastrar a categoria. Verifique a conexão com o servidor.");
            }
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} onVoltar={() => navigate(-1)} />

            <main className="cadastro-container">
                <h1 className="titulo-cadastro">CADASTRO DE CATEGORIA</h1>
                <div className="linha-laranja"></div>

                <div className="cadastro-form">

                    <div className="cadastro-field">
                        <InputForm
                            titulo="Nome da categoria"
                            placeholder="Papeis"
                            type="text"
                            value={nomeCategoria}
                            onChange={(e) => setNomeCategoria(e.target.value)}
                        />
                    </div>

                    {mensagem && (
                        <p style={{
                            color: tipoMensagem === "sucesso" ? "#28a745" : "#d9534f",
                            fontSize: "14px",
                            margin: "-5px 0 0 0",
                            fontFamily: "'Inter', sans-serif",
                            textAlign: "center"
                        }}>
                            {mensagem}
                        </p>
                    )}

                    <div className="cadastro-actions">
                        <MainButton 
                            texto={enviando ? "Cadastrando..." : "Cadastrar"} 
                            cor="#0A086B" 
                            onClick={handleCadastrar} 
                        />
                        <MainButton texto="Cancelar" cor="#FF4B09" onClick={() => navigate(-1)} />
                    </div>

                </div>
            </main>
        </div>
    );
}

export default CadastroCategoria;