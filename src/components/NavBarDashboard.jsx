import "./NavBarDashboard.css"
import logo from "../assets/logo_colegio_xingu.png"
import voltar from "../assets/voltar.png"
import { useNavigate } from "react-router-dom"

function NavBarDashboard() {
    const navigate = useNavigate();

    return (
        <nav className="navbardashboard">
            <img src={logo} alt="logo" className="navbardashboard-logo" />

            <div className="navbardashboard-bottom">
                <button onClick={() => navigate("/gerenciar-almoxarifado")}>
                    <img src={voltar} alt="Voltar" className="navbardashboard-voltar" />
                </button>
            </div>
        </nav>
    )
}

export default NavBarDashboard