import "./NavBar.css";
import logo from "../assets/logo_colegio_xingu.png";
import saida from "../assets/saida.png";
import { useNavigate, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

function NavBarAdmin({ mostrarVoltar, mostrarLinks }) {
    const navigate = useNavigate();
    const [menuAberto, setMenuAberto] = useState(false);
    const dropdownRef = useRef(null);

    const cadastros = [
        { label: "Almoxarifado", rota: "/cadastro-almoxarifado" },
        { label: "Almoxarife", rota: "/cadastro-almoxarife" },
        { label: "Categoria", rota: "/cadastro-categoria" },
        { label: "Fornecedor", rota: "/cadastro-fornecedor" },
        { label: "Motivo", rota: "/cadastro-motivo" },
        { label: "Professor", rota: "/cadastro-professor" },
        { label: "Tipo de Fornecedor", rota: "/cadastro-tipo-fornecedor" },
    ];

    useEffect(() => {
        function handleClickFora(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setMenuAberto(false);
            }
        }
        document.addEventListener("mousedown", handleClickFora);
        return () => document.removeEventListener("mousedown", handleClickFora);
    }, []);

    return (
        <nav className="navbar">
            <img src={logo} alt="logo" className="navbar-logo" />

            {mostrarLinks && (
                <div className="navbar-links">
                    <button onClick={() => navigate("/cadastrar-almoxarifados")}>Gerenciar Almoxarifados</button>
                    <button onClick={() => navigate("/gerenciar-almoxarifes")}>Gerenciar Almoxarifes</button>
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

export default NavBarAdmin;