import "./components/App.css";
import NavBar from "./components/NavBar";
import InputForm from "./components/InputForm";
import ButtonFormOption from "./components/ButtonFormOption";
import Link from "./components/LinkText";
import MainButton from "./components/MainButton";

function App() {
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
            <Link texto="Esqueci minha Senha" />
            <Link texto="Precisa de Ajuda?" />
          </div>

          <div className="action-buttons">
            <MainButton texto="Entrar" cor="#0A086B" />
            <MainButton texto="Cancelar" cor="#FF4B09" />
          </div>
        </form>
      </main>
    </div>
  );
}

export default App;