import "./InputForm.css";

function InputForm({ titulo, placeholder, type = "text", value, onChange, name, required = false }) {
    return (
        <div className="input-container">

            <label className="input-label">
                {titulo}
            </label>

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                name={name}
                required={required}
                className="input-form"
            />

        </div>
    );
}

export default InputForm;