import "./CadastroMaterial.css";
import NavBar from "../components/NavBar";
import InputForm from "../components/InputForm";
import MainButton from "../components/MainButton";
import SelectForm from "../components/SelectForm";
import { useEffect, useState } from "react";
import { api } from "../provider/api.js"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/*
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
*/
const categorias = [
  {
    "id": 1,
    "nomeCategoria": "Artes"
  },
  {
    "id": 2,
    "nomeCategoria": "Papelaria"
  },
  {
    "id": 3,
    "nomeCategoria": "Limpeza"
  },
  {
    "id": 4,
    "nomeCategoria": "Informática"
  },
  {
    "id": 5,
    "nomeCategoria": "Esportes"
  },
  {
    "id": 6,
    "nomeCategoria": "Laboratório"
  },
  {
    "id": 7,
    "nomeCategoria": "Escritório"
  },
  {
    "id": 8,
    "nomeCategoria": "Higiene"
  },
  {
    "id": 9,
    "nomeCategoria": "Manutenção"
  },
  {
    "id": 10,
    "nomeCategoria": "Outros"
  },
];

/*
const fornecedores = [
    "Escola",
    "Pais",
    "Doações",
    "Prefeitura",
    "Governo Estadual",
    "ONG Parceira",
    "Fornecedor Externo",
];
*/
const fornecedores = [
  {
    "id": 1,
    "nome": "Escola"
  },
  {
    "id": 2,
    "nome": "Pais"
  },
  {
    "id": 3,
    "nome": "Doações"
  },
  {
    "id": 4,
    "nome": "Prefeitura"
  },
  {
    "id": 5,
    "nome": "Governo Estadual"
  },
  {
    "id": 6,
    "nome": "ONG Parceira"
  },
  {
    "id": 7,
    "nome": "Fornecedor Externo"
  }
];


function CadastroMaterial() {
    const navigate = useNavigate();

    const [nomeMaterial, setNomeMaterial] = useState("");
    const [categoriaId, setCategoriaId] = useState(categorias[0].id);
    const [fornecedorId, setFornecedorId] = useState(fornecedores[0].id);
    const [unidade, setUnidade] = useState("");
    const [descricao, setDescricao] = useState("");

    useEffect(() => {

      // GET de categorias

      // GET de fornecedores
      
      // GET de unidade de medida

    }, [])

    function cadastrar() {
      console.log(categoriaId)
      console.log(fornecedorId)
      console.log(unidade)
      console.log(descricao)

      //api .post("/v1/materiais", { "" })
    }

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} onVoltar={() => navigate(-1)} />

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
                            valor={categoriaId}
                            onChange={setCategoriaId}
                            labelField={"nomeCategoria"}
                        />
                    </div>

                    <div className="cadastro-field">
                        <SelectForm
                            titulo="Fornecedor:"
                            opcoes={fornecedores}
                            valor={fornecedorId}
                            onChange={setFornecedorId}
                            labelField={"nome"}
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
                        <MainButton texto="Cancelar" cor="#FF4B09" onClick={() => navigate(-1)} />
                    </div>

                </div>
            </main>
        </div>
    );
}

export default CadastroMaterial;
