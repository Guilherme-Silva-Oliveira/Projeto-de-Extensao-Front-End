import "./CadastroAlmoxarife.css";
import NavBar from "../../components/layout/NavBar";
import InputForm from "../../components/forms/InputForm";
import MainButton from "../../components/forms/MainButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../provider/api.js";

function CadastroAlmoxarife() {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    async function handleCadastrar() {
        if (!nome || !email || !telefone || !senha) {
            setErro("Preencha todos os campos.");
            return;
        }

        try {
            setErro("");
            await api.post("/v1/almoxarifes", { nome, email, telefone, senha });
            navigate("/gerenciar-almoxarifado");
        } catch (error) {
            console.error("Erro ao cadastrar almoxarife:", error);
            setErro("Não foi possível cadastrar o almoxarife.");
        }
    }

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} onVoltar={() => navigate(-1)} />

            <main className="cadastro-almoxarife-container">
                <h1 className="titulo-cadastro-almoxarife">CADASTRO DE ALMOXARIFE</h1>
                <div className="linha-laranja"></div>

                <div className="cadastro-almoxarife-form">
                    <div className="cadastro-almoxarife-field">
                        <InputForm
                            titulo="Nome:"
                            placeholder="Marisa da Silva Furtado"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

                    <div className="cadastro-almoxarife-field">
                        <InputForm
                            titulo="E-mail:"
                            placeholder="Responsável"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="cadastro-almoxarife-field">
                        <InputForm
                            titulo="Telefone:"
                            placeholder="(11) 95846-5469"
                            type="text"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                        />
                    </div>

                    <div className="cadastro-almoxarife-field">
                        <InputForm
                            titulo="Senha:"
                            placeholder="**************"
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>

                    {erro && <p className="cadastro-almoxarife-erro">{erro}</p>}

                    <div className="cadastro-almoxarife-actions">
                        <MainButton texto="Cadastrar" cor="#0A086B" onClick={handleCadastrar} />
                        <MainButton texto="Cancelar" cor="#FF4B09" onClick={() => navigate(-1)} />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CadastroAlmoxarife;