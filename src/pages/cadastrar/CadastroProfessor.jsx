import "./CadastroProfessor.css";
import NavBar from "../../components/layout/NavBar";
import InputForm from "../../components/forms/InputForm";
import MainButton from "../../components/forms/MainButton";
import SelectForm from "../../components/forms/SelectForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



function CadastroProfessor() {
    const navigate = useNavigate();
    
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");

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

                   

                    <div className="cadastro-actions">
                        <MainButton texto="Cadastrar" cor="#0A086B" />
                        <MainButton texto="Cancelar" cor="#FF4B09" onClick={() => navigate(-1)} />
                    </div>

                </div>
            </main>
        </div>
    );
}

export default CadastroProfessor;