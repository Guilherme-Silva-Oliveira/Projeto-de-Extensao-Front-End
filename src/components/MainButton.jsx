import "./MainButton.css"

function MainButton({ texto, cor }) {
    return (
        <button style={{ 
            backgroundColor: cor,
            color: "white"
        }}>
            {texto}
        </button>
    );
}

export default MainButton;