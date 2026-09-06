import "../components/App.css";
import NavBar from "../components/NavBar";
import InputForm from "../components/InputForm";
import ButtonFormOption from "../components/ButtonFormOption";
import LinkText from "../components/LinkText";
import MainButton from "../components/MainButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../provider/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      await api.post("/v1/almoxarifes/login", {
        email,
        senha,
      });

      navigate("/gerenciar-almoxarifado");
    } catch (error) {
      const mensagem = error.response?.data?.message || "Email ou senha inválidos.";
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="page-container">
      <NavBar />
      <main className="login-container">
        <h1 className="titulo-login">FAÇA SEU LOGIN</h1>
        <div className="linha-laranja"></div>

        <form className="login-form" onSubmit={handleSubmit}>
          <InputForm
            titulo="Digite seu Email:"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <InputForm
            titulo="Digite sua Senha:"
            placeholder="Senha"
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            required
          />

          <div className="options-section">
            <label className="label-opcao">Escolha uma Opção:</label>
            <div className="options-buttons">
              <ButtonFormOption texto="Almoxarife" />
              <ButtonFormOption texto="Administrador" />
            </div>
          </div>

          <div className="links-container">
            <LinkText texto="Esqueci minha Senha" />
            <LinkText texto="Precisa de Ajuda?" />
          </div>

          {erro && <p className="login-error" role="alert">{erro}</p>}

          <div className="action-buttons">
            <MainButton
              texto={carregando ? "Entrando..." : "Entrar"}
              cor="#0A086B"
              type="submit"
              disabled={carregando}
            />
            <MainButton texto="Cancelar" cor="#FF4B09" type="button" />
          </div>
        </form>
      </main>
    </div>
  );
}

export default Login;