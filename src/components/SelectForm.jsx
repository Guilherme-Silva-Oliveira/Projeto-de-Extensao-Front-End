import "./SelectForm.css";

function SelectForm({ titulo, opcoes, valor, onChange, labelField, valueField = labelField }) {
    // ======= ALTERADO: protege contra opcoes não ser array (ex: "" quando o back responde 204) =======
    const lista = Array.isArray(opcoes) ? opcoes : [];

    return (
        <div className="select-container">
            <label className="select-label">{titulo}</label>
            <div className="select-wrapper">
                <select
                    className="select-form"
                    value={valor}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {lista.map((opt) => (
                        <option key={opt.id} value={opt[valueField]}>{opt[labelField]}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default SelectForm;