import "./CardMaterial.css";
import { useState } from "react";
import adicionar from "../assets/adicionar.png";
import ModalCadastroMaterial from "./ModalCadastroMaterial.jsx";

function CardMaterial({ material, onConfirmarEntrada }) {
    const {
        nome,
        quantidade,
        unidadeMedida,
        dataVencimento,
        categoria,
        descricao,
    } = material;

    const [modalAberto, setModalAberto] = useState(false);

    async function handleConfirmar(dados) {
        // repassa pro pai lidar com a atualização da lista/estado global
        await onConfirmarEntrada?.(dados, material);
        setModalAberto(false);
    }

    return (
        <div className="card-material">
            <div className="card-material-info">
                <span className="card-material-label">Nome do Material:</span>
                <span className="card-material-valor">{nome}</span>
            </div>

            <div className="card-material-info">
                <span className="card-material-label">Quantidade:</span>
                <span className="card-material-quantidade">{quantidade}</span>
            </div>

            <div className="card-material-info">
                <span className="card-material-label">Un. Medida:</span>
                <span className="card-material-valor">{unidadeMedida}</span>
            </div>

            <div className="card-material-info">
                <span className="card-material-label">Data de Vencimento:</span>
                <span className="card-material-valor">
                    {dataVencimento || "--"}
                </span>
            </div>

            <div className="card-material-info">
                <span className="card-material-label">Categoria:</span>
                <span className="card-material-valor">{categoria}</span>
            </div>

            <div
                className="div-botao-adicionar"
                onClick={() => setModalAberto(true)}
            >
                <img src={adicionar} alt="Adicionar entrada" />
            </div>

            {modalAberto && (
                <ModalCadastroMaterial
                    materiaisDisponiveis={[material]}
                    onClose={() => setModalAberto(false)}
                    onConfirmar={handleConfirmar}
                />
            )}
        </div>
    );
}

export default CardMaterial;