import "./ButtonFormOption.css"

function ButtonFormOption({ texto, className, children }) {
    return (
        <button type="button" className={`btn-form-option ${className || ""}`}>
            {texto}
            {children}
        </button>
    );
}

export default ButtonFormOption;