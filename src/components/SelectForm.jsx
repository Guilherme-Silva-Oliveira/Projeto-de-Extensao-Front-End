import "./SelectForm.css";

function SelectForm({ titulo, opcoes, valor, onChange, labelField }) {
    return (
        <div className="select-container">
            <label className="select-label">{titulo}</label>
            <div className="select-wrapper">
                <select
                    className="select-form"
                    value={valor}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {opcoes.map((opt) => (
                        <option key={opt.id} value={opt[labelField]}>{opt[labelField]}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default SelectForm;
