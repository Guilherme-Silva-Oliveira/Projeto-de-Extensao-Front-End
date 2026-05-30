import "./NavBarDashboard.css"
import perfil from "../assets/perfil.png"
import menu from "../assets/menu.png"
import voltar from "../assets/voltar.png"

function NavBarDashboard({onVoltar}){
    return(
        <nav className="navbardashboard">
            <button>
                <img src={perfil} alt="perfil" className="navbardashboard-perfil"/>
            </button>
            <button>
                <img src={menu} alt="Menu" className="navbardashboard-menu"/>
            </button>
            <button onClick={onVoltar}>
                <img src={voltar} alt="Voltar" className="navbardashboard-voltar"/>
            </button>
        </nav>
    )
}

export default NavBarDashboard