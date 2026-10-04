import "./NavBar.css";
import logo from "../assets/logo_colegio_xingu.png";
import saida from "../assets/saida.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function NavBar({ mostrarVoltar, mostrarLinks }) {
    const navigate = useNavigate();
    const [cadastrosAberto, setCadastrosAberto] = useState(false);
    const [gerenciamentosAberto, setGerenciamentosAberto] = useState(false);
    const cadastrosRef = useRef(null);
    const gerenciamentosRef = useRef(null);

    const cadastros = [
        { label: "Categoria", rota: "/cadastro-categoria" },
        { label: "Fornecedor", rota: "/cadastro-fornecedor" },
        { label: "Motivo", rota: "/cadastro-motivo" },
        { label: "Professor", rota: "/cadastro-professor" },
        { label: "Tipo de Fornecedor", rota: "/cadastro-tipo-fornecedor" },
        { label: "Setor do Estoque", rota: "/cadastro-tipo-fornecedor" },
    ];
    const gerenciamentos = [
        { label: "Categoria", rota: "categorias" },
        { label: "Tipo de Fornecedor", rota: "tipos-fornecedor" },
        { label: "Fornecedor", rota: "fornecedores" },
        { label: "Setor de Estoque", rota: "setores-estoque" },
        { label: "Unidade de Medida", rota: "unidades-medida" },
        { label: "Professor", rota: "professores" },
        { label: "Motivo", rota: "motivos" },
        { label: "Limite", rota: "limites" },
    ];

    useEffect(() => {
        function fecharAoClicarFora(evento) {
            if (cadastrosRef.current && !cadastrosRef.current.contains(evento.target)) {
                setCadastrosAberto(false);
            }
            if (gerenciamentosRef.current && !gerenciamentosRef.current.contains(evento.target)) {
                setGerenciamentosAberto(false);
            }
        }

        document.addEventListener("mousedown", fecharAoClicarFora);
        return () => document.removeEventListener("mousedown", fecharAoClicarFora);
    }, []);

    return (
        <nav className="navbar">
            <img src={logo} alt="logo" className="navbar-logo" />

            {mostrarLinks && (
                <div className="navbar-links">
                    <button onClick={() => navigate("/dashboard")}>Dashboard </button>
                    <button onClick={() => navigate("/gerenciar-almoxarifado")}>Almoxarifado</button>
                    <button onClick={() => navigate("/gerenciar-solicitacoes")}>Solicitações</button>
                    <button onClick={() => navigate("/gerenciar-movimentacoes")}>Movimentações</button>
                    <div className="dropdown" ref={cadastrosRef}>
                        <button
                            type="button"
                            aria-expanded={cadastrosAberto}
                            aria-haspopup="true"
                            onClick={() => {
                                setCadastrosAberto((aberto) => !aberto);
                                setGerenciamentosAberto(false);
                            }}
                        >
                            Cadastros ▾
                        </button>
                        {cadastrosAberto && (
                            <div className="dropdown-menu">
                                <div className="dropdown-itens">
                                    {cadastros.map((item) => (
                                        <Link
                                            key={item.rota}
                                            to={item.rota}
                                            className="dropdown-link"
                                            onClick={() => setCadastrosAberto(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="dropdown" ref={gerenciamentosRef}>
                        <button
                            type="button"
                            aria-expanded={gerenciamentosAberto}
                            aria-haspopup="true"
                            onClick={() => {
                                setGerenciamentosAberto((aberto) => !aberto);
                                setCadastrosAberto(false);
                            }}
                        >
                            Gerenciamentos ▾
                        </button>
                        {gerenciamentosAberto && (
                            <div className="dropdown-menu dropdown-menu-gerenciamentos">
                                <div className="dropdown-itens">
                                    {gerenciamentos.map((item) => (
                                        <button
                                            type="button"
                                            className="dropdown-option"
                                            key={item.rota}
                                            onClick={() => {
                                                setGerenciamentosAberto(false);
                                                navigate(`/gerenciamentos/${item.rota}`);
                                            }}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
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