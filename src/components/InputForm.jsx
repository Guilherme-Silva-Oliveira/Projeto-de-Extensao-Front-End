import "./InputForm.css";

function InputForm({ titulo, placeholder }) {
    return (
        <div className="input-container">

            <label className="input-label">
                {titulo}
            </label>

            <input
                type="text"
                placeholder={placeholder}
                className="input-form"
            />

        </div>
    );
}

export default InputForm;