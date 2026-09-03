import "./Menu.css";
import NavBar from "../components/layout/NavBar";
import InputForm from "../components/forms/InputForm";
import MainButton from "../components/forms/MainButton";
import SelectForm from "../components/forms/SelectForm";
import ButtonFormOption from "../components/forms/ButtonFormOption";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



function Menu() {
    const navigate = useNavigate();
    const [nomeUsuario, setNomeUsuario] = useState("usuario");

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={false} onVoltar={() => navigate(-1)} />

            <main className="menu-container">
                <h1 className="titulo-menu">Bem vindo(a), {nomeUsuario}!</h1>
                <div className="linha-laranja"></div>

                <div className="menu-form">
                    <p>Escolha uma opção:</p>
                    <ButtonFormOption texto="Dashboard" onClick={() => navigate("/dashboard")}/>
                    <ButtonFormOption texto="Almoxarifado" onClick={() => navigate("/gerenciar-almoxarifado")} />
                    <ButtonFormOption texto="Solicitações" onClick={() => navigate("/gerenciar-solicitacoes")}/>
                    <ButtonFormOption texto="Devoluções" onClick={() => navigate("/gerenciar-devolucoes")}/>
                    <ButtonFormOption texto="Movimentações" onClick={() => navigate("/gerenciar-movimentacoes")}/>

                   

                    <div className="menu-actions">
                        <MainButton texto="Sair" cor="#FF4B09" onClick={() => navigate("/")}/>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Menu;