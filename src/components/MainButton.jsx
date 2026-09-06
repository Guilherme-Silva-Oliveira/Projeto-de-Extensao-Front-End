import "./MainButton.css"

function MainButton({ texto, cor, onClick, type = "button", disabled = false }) {
    return (
        <button 
        
        type={type}
        disabled={disabled}
        className="main-button"
        style={{ 
            backgroundColor: cor,
            color: "white"
        }}
        onClick={onClick}
        >
            {texto}
        </button>
    );
}

export default MainButton;