import "./NavBar.css";
import logo from "../assets/logo_colegio_xingu.png";
import voltarIcon from "../assets/seta-voltar.png";

function NavBar({ mostrarVoltar, onVoltar }) {
    return (
        <nav className="navbar">
            <img src={logo} alt="logo" className="navbar-logo" />
            {mostrarVoltar && (
                <button className="navbar-voltar" onClick={onVoltar}>
                    <img src={voltarIcon} alt="Voltar" className="voltar-icon" />
                </button>
            )}
        </nav>
    );
}

export default NavBar;