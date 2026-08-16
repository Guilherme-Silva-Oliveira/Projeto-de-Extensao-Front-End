import "./CardMaterial.css";

function CardMaterial({ material }) {
    const {
        nome,
        quantidade,
        unidadeMedida,
        dataVencimento,
        categoria,
        descricao,
    } = material;

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

            <div className="card-material-info card-material-descricao">
                <span className="card-material-label">Fornecedor:</span>
                <span className="card-material-valor">{descricao}</span>
            </div>
        </div>
    );
}

export default CardMaterial;