import "./CadastroMaterial.css";
import NavBar from "../components/NavBar";
import InputForm from "../components/InputForm";
import MainButton from "../components/MainButton";
import SelectForm from "../components/SelectForm";
import { useState } from "react";

const categorias = [
    "Artes",
    "Papelaria",
    "Limpeza",
    "Informática",
    "Esportes",
    "Laboratório",
    "Escritório",
    "Higiene",
    "Manutenção",
    "Outros",
];

const fornecedores = [
    "Escola",
    "Pais",
    "Doações",
    "Prefeitura",
    "Governo Estadual",
    "ONG Parceira",
    "Fornecedor Externo",
];

function CadastroMaterial({ onVoltar }) {
    const [nomeMaterial, setNomeMaterial] = useState("");
    const [categoria, setCategoria] = useState(categorias[0]);
    const [fornecedor, setFornecedor] = useState(fornecedores[0]);
    const [unidade, setUnidade] = useState("");
    const [descricao, setDescricao] = useState("");

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} onVoltar={onVoltar} />

            <main className="cadastro-container">
                <h1 className="titulo-cadastro">CADASTRO DE MATERIAL</h1>
                <div className="linha-laranja"></div>

                <div className="cadastro-form">

                    <div className="cadastro-field">
                        <InputForm
                            titulo="Nome do material:"
                            placeholder="Pincel B21"
                            value={nomeMaterial}
                            onChange={(e) => setNomeMaterial(e.target.value)}
                        />
                    </div>

                    <div className="cadastro-field">
                        <SelectForm
                            titulo="Categoria:"
                            opcoes={categorias}
                            valor={categoria}
                            onChange={setCategoria}
                        />
                    </div>

                    <div className="cadastro-field">
                        <SelectForm
                            titulo="Fornecedor:"
                            opcoes={fornecedores}
                            valor={fornecedor}
                            onChange={setFornecedor}
                        />
                    </div>

                    <div className="cadastro-field">
                        <InputForm
                            titulo="Unidade de medida:"
                            placeholder="Unidades"
                            value={unidade}
                            onChange={(e) => setUnidade(e.target.value)}
                        />
                    </div>

                    <div className="descricao-section">
                        <label className="descricao-label">
                            Adicione uma descrição ao material (opcional):
                        </label>
                        <textarea
                            className="descricao-textarea"
                            placeholder="Pincel ideal para acabamento e detalhes."
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="cadastro-actions">
                        <MainButton texto="Cadastrar" cor="#0A086B" />
                        <MainButton texto="Cancelar" cor="#FF4B09" onClick={onVoltar} />
                    </div>

                </div>
            </main>
        </div>
    );
}

export default CadastroMaterial;