import "./Menu.css";
import NavBar from "../components/NavBar";
import InputForm from "../components/InputForm";
import MainButton from "../components/MainButton";
import SelectForm from "../components/SelectForm";
import ButtonFormOption from "../components/ButtonFormOption";
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
                    <ButtonFormOption texto="Gerenciar Materiais" onClick={() => navigate("/gerenciar-almoxarifado")} />
                    <ButtonFormOption texto="Gerenciar Solicitações" />
                    <ButtonFormOption texto="Gerenciar Movimentações" />
                    <ButtonFormOption texto="Gerenciar Dashboard" />
                    <ButtonFormOption texto="Configurações de Conta" />

                   

                    <div className="menu-actions">
                        <MainButton texto="Sair" cor="#FF4B09" onClick={() => navigate(-1)} />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Menu;