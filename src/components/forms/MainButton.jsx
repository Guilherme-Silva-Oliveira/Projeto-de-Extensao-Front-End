import "./MainButton.css"

function MainButton({ texto, cor, onClick }) {
    return (
        <button 
        
        type="button"
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