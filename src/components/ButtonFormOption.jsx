import "./ButtonFormOption.css"

function ButtonFormOption({ texto, className, children, onClick }) {
    return (
        <button type="button" className={`btn-form-option ${className || ""}`} onClick={onClick}>
            {texto}
            {children}
        </button>
    );
}

export default ButtonFormOption;