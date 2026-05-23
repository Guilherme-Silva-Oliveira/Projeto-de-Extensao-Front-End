import "./NavBar.css";
import logo from "../assets/logo_colegio_xingu.png";

function NavBar() {
    return (
        <nav className="navbar">
            <img src={logo} alt="logo" className="navbar-logo" />

        </nav>
    );
}

export default NavBar;