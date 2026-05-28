import "./SelectForm.css";

function SelectForm({ titulo, opcoes, valor, onChange }) {
    return (
        <div className="select-container">
            <label className="select-label">{titulo}</label>
            <div className="select-wrapper">
                <select
                    className="select-form"
                    value={valor}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {opcoes.map((op) => (
                        <option key={op} value={op}>{op}</option>
                    ))}
                </select>
                <span className="select-arrow">∧</span>
            </div>
        </div>
    );
}

export default SelectForm;