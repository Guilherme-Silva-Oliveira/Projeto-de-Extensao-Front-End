import "./components/App.css";
import { useState } from "react";
import NavBar from "./components/NavBar";
import InputForm from "./components/InputForm";
import ButtonFormOption from "./components/ButtonFormOption";
import LinkText from "./components/LinkText";
import MainButton from "./components/MainButton";
import SolicitarMaterial from "./pages/SolicitarMaterial";
import CadastroMaterial from "./pages/CadastroMaterial";

function App() {
  const [tela, setTela] = useState("cadastro");

  if (tela === "solicitar") {
    return <SolicitarMaterial onVoltar={() => setTela("login")} />;
  }

  if (tela === "cadastro") {
    return <CadastroMaterial onVoltar={() => setTela("cadastro")} />;
  }

  return (
    <div className="page-container">
      <NavBar />
      <main className="login-container">
        <h1 className="titulo-login">FAÇA SEU LOGIN</h1>
        <div className="linha-laranja"></div>

        <form className="login-form">
          <InputForm titulo="Digite seu Email:" placeholder="Email" />
          <InputForm titulo="Digite sua Senha:" placeholder="Senha" />

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

          <div className="action-buttons">
            <MainButton texto="Entrar" cor="#0A086B" onClick={() => setTela("cadastro")} />
            <MainButton texto="Cancelar" cor="#FF4B09" />
          </div>
        </form>
      </main>
    </div>
  );
}

export default App;