import "./NavBar.css";
import logo from "../../assets/logo_colegio_xingu.png";
import saida from "../../assets/saida.png";
import { useNavigate } from "react-router-dom";

function NavBar({ mostrarVoltar, mostrarLinks }) {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <img src={logo} alt="logo" className="navbar-logo" />

            {mostrarLinks && (
                <div className="navbar-links">
                    <button onClick={() => navigate("/dashboard")}>Dashboard</button>
                    <button onClick={() => navigate("/gerenciar-almoxarifado")}>Almoxarifado</button>
                    <button onClick={() => navigate("/gerenciar-solicitacoes")}>Solicitações</button>
                    <button onClick={() => navigate("/gerenciar-devolucoes")}>Devoluções</button>
                    <button onClick={() => navigate("/gerenciar-movimentacoes")}>Movimentações</button>
                </div>
            )}

            {mostrarVoltar && (
                <button className="navbar-saida" onClick={() => navigate("/")}>
                    <img src={saida} alt="Sair" className="saida-icon" />
                </button>
            )}
        </nav>
    );
}

export default NavBar;