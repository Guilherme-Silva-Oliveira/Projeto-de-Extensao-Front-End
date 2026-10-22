import "./CadastroAlmoxarife.css";
import NavBarAdmin from "../components/NavBarAdmin.jsx";
import InputForm from "../components/InputForm";
import MainButton from "../components/MainButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../provider/api.js";

const SENHA_MINIMA = 6; 

function CadastroAlmoxarife() {
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false); // NOVO

    async function handleCadastrar() {
        if (carregando) return;

        if (!nome || !email || !telefone || !senha) {
            setErro("Preencha todos os campos.");
            return;
        }

      
        if (senha.length < SENHA_MINIMA) {
            setErro(`A senha deve ter no mínimo ${SENHA_MINIMA} caracteres.`);
            return;
        }

        try {
            setErro("");
            setCarregando(true);
            await api.post("/v1/almoxarifes", {
                nome,
                email,
                telefone,
                senha,
                idAlmoxarifado: 1,
            });
            navigate("/gerenciar-almoxarifes");
        } catch (error) {
            console.error("Erro ao cadastrar almoxarife:", error);
            setErro(error?.response?.data?.message ?? "Não foi possível cadastrar o almoxarife.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="page-container">
            <NavBarAdmin mostrarLinks={true} mostrarVoltar={true} />
            <main className="cadastro-almoxarife-container">
                <h1 className="titulo-cadastro-almoxarife">CADASTRO DE ALMOXARIFE</h1>
                <div className="cadastro-almoxarife-linha"></div>

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
                            placeholder={`Mínimo de ${SENHA_MINIMA} caracteres`}
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>
                    {erro && <p className="cadastro-almoxarife-erro">{erro}</p>}

                    <div className="cadastro-almoxarife-actions">
                        
                        <MainButton
                            texto={carregando ? "Cadastrando..." : "Cadastrar"}
                            cor="#0A086B"
                            onClick={handleCadastrar}
                            disabled={carregando}
                        />
                        <MainButton texto="Cancelar" cor="#FF4B09" onClick={() => navigate(-1)} />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default CadastroAlmoxarife;