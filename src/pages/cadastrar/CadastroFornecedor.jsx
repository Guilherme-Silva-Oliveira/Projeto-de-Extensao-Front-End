import "./CadastroFornecedor.css";
import NavBar from "../../components/layout/NavBar";
import InputForm from "../../components/forms/InputForm";
import MainButton from "../../components/forms/MainButton";
import SelectForm from "../../components/forms/SelectForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const tipoFornecedores = [
    "Responsável",
    "Escola"
]

function CadastroFornecedor() {
    const navigate = useNavigate();

    const [nomeFornecedor, setNomeFornecedor] = useState("");
    const [tipoFornecedor, setTipoFornecedor] = useState(tipoFornecedores[0]);
    const [telefone, setTelefone] = useState("");
    const [cpfCnpj, setCpfCnpj] = useState("");


    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} onVoltar={() => navigate(-1)} />

            <main className="cadastro-container">
                <h1 className="titulo-cadastro">CADASTRO DE FORNECEDOR</h1>
                <div className="linha-laranja"></div>

                <div className="cadastro-form">

                    <div className="cadastro-field">
                        <InputForm
                            titulo="Nome do Fornecedor:"
                            placeholder="Mohamed Neymar do Santos"
                            value={nomeFornecedor}
                            onChange={(e) => setNomeFornecedor(e.target.value)}
                        />
                    </div>

                    <div className="cadastro-field">
                        <SelectForm
                            titulo="Tipo do Fornecedor:"
                            opcoes={tipoFornecedores}
                            valor={tipoFornecedor}
                            onChange={setTipoFornecedor}
                        />
                    </div>

                    <div className="cadastro-field">
                        <InputForm
                            titulo="Telefone:"
                            placeholder="11953426776"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                        />
                    </div>

                    <div className="cadastro-field">
                        <InputForm
                            titulo="CPF/CNPJ:"
                            placeholder="40050070018"
                            value={cpfCnpj}
                            onChange={(e) => setCpfCnpj(e.target.value)}
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

export default CadastroFornecedor;