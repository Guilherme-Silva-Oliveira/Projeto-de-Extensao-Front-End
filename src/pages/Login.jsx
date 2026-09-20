import "../components/App.css";
import NavBar from "../components/NavBar";
import InputForm from "../components/InputForm";
import ButtonFormOption from "../components/ButtonFormOption";
import LinkText from "../components/LinkText";
import MainButton from "../components/MainButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../provider/api";

// Mapeia cada botão da tela para a role correspondente no banco
// (ajuste os valores conforme o que o seu backend retorna)
const PERFIS = {
  almoxarife: { role: "ALMOXARIFE", rota: "/gerenciar-almoxarifado" },
  administrador: { role: "ADMIN", rota: "/gerenciar-almoxarifes" },
};

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfilSelecionado, setPerfilSelecionado] = useState(""); // "almoxarife" | "administrador"
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");

    if (!perfilSelecionado) {
      setErro("Selecione uma opção: Almoxarife ou Administrador.");
      return;
    }

    setCarregando(true);

    try {
      const response = await api.post("/v1/almoxarifes/login", {
        email,
        senha,
      });

      const roleBanco = String(
        response.data.role ?? response.data.almoxarife?.role ?? ""
      ).toUpperCase();

      const perfil = PERFIS[perfilSelecionado];

      if (roleBanco !== perfil.role) {
        setErro("O perfil selecionado não corresponde ao seu tipo de acesso.");
        return;
      }

      if (response.data.almoxarifado?.id) {
        sessionStorage.setItem("almoxarifadoId", response.data.almoxarifado.id);
      }
      sessionStorage.setItem("role", roleBanco);

      navigate(perfil.rota);
    } catch (error) {
      const mensagem =
        error.response?.data?.message || "Email ou senha inválidos.";
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
              <ButtonFormOption
                texto="Almoxarife"
                selecionado={perfilSelecionado === "almoxarife"}
                onClick={() => setPerfilSelecionado("almoxarife")}
              />
              <ButtonFormOption
                texto="Administrador"
                selecionado={perfilSelecionado === "administrador"}
                onClick={() => setPerfilSelecionado("administrador")}
              />
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