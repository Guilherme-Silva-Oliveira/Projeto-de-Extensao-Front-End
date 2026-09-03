import "./TabelaListagem.css";

function TabelaListagem({ colunas, dados }) {
    return (
        <table className="tabela-listagem">
            <thead>
                <tr>
                    {colunas.map((coluna, index) => (
                        <th key={index}>{coluna.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {dados.map((linha, index) => (
                    <tr key={index}>
                        {colunas.map((coluna, i) => (
                            <td key={i}>{linha[coluna.key]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default TabelaListagem;