import "./CadastroProfessor.css";
import NavBar from "../../components/layout/NavBar";
import InputForm from "../../components/forms/InputForm";
import MainButton from "../../components/forms/MainButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



function CadastroAlmoxarifado() {
    const navigate = useNavigate();

    const [nomeCategoria, setNomeCategoria] = useState("");

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} onVoltar={() => navigate(-1)} />

            <main className="cadastro-container">
                <h1 className="titulo-cadastro">CADASTRO DE ALMOXARIFADO</h1>
                <div className="linha-laranja"></div>

                <div className="cadastro-form">

                    <div className="cadastro-field">
                        <InputForm
                            titulo="Almoxarifado: "
                            placeholder="Ex: 204"
                            type="text"
                            value={nomeCategoria}
                            onChange={(e) => setNomeCategoria(e.target.value)}
                        />
                    </div>



                    <div className="cadastro-actions">
                        <MainButton texto="Cadastrar" cor="#0A086B" />
                        <MainButton texto="Cancelar" cor="#FF4B09" onClick={() => navigate(-1)} />
                    </div>

                </div>
            </main>
        </div>
    );
}

export default CadastroAlmoxarifado;