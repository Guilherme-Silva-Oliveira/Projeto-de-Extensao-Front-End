import "./CadastroProfessor.css";
import NavBar from "../components/NavBar";
import InputForm from "../components/InputForm";
import MainButton from "../components/MainButton";
import { api } from "../provider/api.js"
import { useState } from "react";
import { useNavigate } from "react-router-dom";



function CadastroAlmoxarifado() {
    const navigate = useNavigate();

    const [numeroAlmoxarifado, setNumeroAlmoxarifado] = useState("");

    async function cadastrar() {
        try {
            const res = await api.post("/v1/almoxarifados", { 
                numeroSala: numeroAlmoxarifado
            })
            console.log("post response: ", res.data)
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
        }
    }

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
                            value={numeroAlmoxarifado}
                            onChange={(e) => setNumeroAlmoxarifado(e.target.value)}
                        />
                    </div>



                    <div className="cadastro-actions">
                        <MainButton texto="Cadastrar" cor="#0A086B" onClick={async () => {
                            await cadastrar() 
                            navigate(-1)
                        }}/>
                        <MainButton texto="Cancelar" cor="#FF4B09" onClick={() => navigate(-1)} />
                    </div>

                </div>
            </main>
        </div>
    );
}

export default CadastroAlmoxarifado;
