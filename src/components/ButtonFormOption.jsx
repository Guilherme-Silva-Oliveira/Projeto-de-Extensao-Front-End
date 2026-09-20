import "./ButtonFormOption.css"

function ButtonFormOption({ texto, className, children, onClick, selecionado }) {
    return (
        <button
            type="button"
            className={`btn-form-option ${selecionado ? "selecionado" : ""} ${className || ""}`}
            onClick={onClick}
            aria-pressed={!!selecionado}
        >
            {texto}
            {children}
        </button>
    );
}

export default ButtonFormOption;