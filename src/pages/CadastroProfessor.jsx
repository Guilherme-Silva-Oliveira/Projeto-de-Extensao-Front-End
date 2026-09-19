import "./CadastroProfessor.css";
import NavBar from "../components/NavBar";
import InputForm from "../components/InputForm";
import MainButton from "../components/MainButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../provider/api.js";

function CadastroProfessor() {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState(""); // "sucesso" ou "erro"

    async function handleCadastrar() {
        if (enviando) return; // evita duplo clique

        if (!nome.trim() || !email.trim() || !telefone.trim()) {
            setMensagem("Por favor, preencha todos os campos.");
            setTipoMensagem("erro");
            return;
        }

        try {
            setEnviando(true);
            setMensagem("");

            await api.post("/v1/professores", {
                nome: nome.trim(),
                email: email.trim(),
                telefone: telefone.trim()
            });

            setMensagem("Professor cadastrado com sucesso!");
            setTipoMensagem("sucesso");
            setNome("");
            setEmail("");
            setTelefone("");

            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (error) {
            console.error("Erro ao cadastrar professor:", error);
            setTipoMensagem("erro");

            const status = error.response?.status;

            if (status === 409) {
                setMensagem("Professor já existente.");
            } else if (status === 401) {
                setMensagem("Sessão expirada ou não autenticada. Faça login novamente.");
            } else if (status === 403) {
                setMensagem("Você não tem permissão para cadastrar professores.");
            } else if (error.response?.data?.message) {
                setMensagem(error.response.data.message);
            } else {
                setMensagem("Não foi possível cadastrar o professor. Verifique a conexão com o servidor.");
            }
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} onVoltar={() => navigate(-1)} />

            <main className="cadastro-container">
                <h1 className="titulo-cadastro">CADASTRO DE PROFESSOR</h1>
                <div className="linha-laranja"></div>

                <div className="cadastro-form">
                    <div className="cadastro-field">
                        <InputForm
                            titulo="Nome do professor:"
                            placeholder="Ricardo Amaral"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

                    <div className="cadastro-field">
                        <InputForm
                            titulo="Email do professor:"
                            placeholder="ricardo.amaral@Xingu.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="cadastro-field">
                        <InputForm
                            titulo="Telefone do professor:"
                            placeholder="(11) 95846-5469"
                            type="text"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
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

export default CadastroProfessor;