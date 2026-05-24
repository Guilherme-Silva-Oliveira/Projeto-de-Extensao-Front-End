import "./MaterialItem.css";

function MaterialItem({ nome, codigo, qtdSolicitada, qtdAtual, aprovado }) {
    return (
        <div className="material-item">
            <span className="material-nome">{nome}</span>
            <span className="material-info">Cód: {codigo}</span>
            <span className="material-info">Qtd Solicitada: {qtdSolicitada}</span>
            <span className="material-info">Qtd Atual: {qtdAtual}</span>
            {aprovado && (
                <span className="material-check">✔</span>
            )}
        </div>
    );
}

export default MaterialItem;