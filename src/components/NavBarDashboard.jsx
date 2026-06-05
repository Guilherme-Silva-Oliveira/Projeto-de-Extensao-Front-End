import "./NavBarDashboard.css"
import perfil from "../assets/perfil.png"
import menu from "../assets/menu.png"
import voltar from "../assets/voltar.png"
import cadastrar from "../assets/cadastrar.png"

function NavBarDashboard({ onVoltar, onCadastrar }) {
    return (
        <nav className="navbardashboard">
            <button onClick={onCadastrar}>
                <img src={cadastrar} alt="cadastrar materiais" className="navbardashboard-cadastrar" />
            </button>
            <button>
                <img src={perfil} alt="perfil" className="navbardashboard-perfil" />
            </button>
            <button>
                <img src={menu} alt="Menu" className="navbardashboard-menu" />
            </button>
            <button onClick={onVoltar}>
                <img src={voltar} alt="Voltar" className="navbardashboard-voltar" />
            </button>
        </nav>
    )
}

export default NavBarDashboard