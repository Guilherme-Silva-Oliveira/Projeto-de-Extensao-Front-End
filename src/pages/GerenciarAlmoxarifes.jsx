import "./GerenciarAlmoxarifes.css";
import NavBarAdmin from "../components/NavBarAdmin.jsx";
import CardAlmoxarife from "../components/CardAlmoxarife";
import ModalEditarAlmoxarife from "../components/ModalEditarAlmoxarife";
import ModalRedefinirSenha from "../components/ModalRedefinirSenha";
import ModalConfirmarExclusao from "../components/ModalConfirmarExclusao";
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../provider/api.js";
import lupaIcon from "../assets/lupa.png";
function formatarData(data) {
    if (!data) return "Não informado";

    const dataFormatada = new Date(data);
    if (Number.isNaN(dataFormatada.getTime())) return "Não informado";

    return dataFormatada.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).replace(", ", " - ");
}

function adaptarAlmoxarife(almoxarife) {
    return {
        ...almoxarife,
        email: almoxarife.email,
        telefone: almoxarife.telefone,
        dataCriacao: formatarData(almoxarife.dataCriacao),
        ultimoAcesso: formatarData(almoxarife.ultimoAcesso),
        status: almoxarife.statusUsuario ? "Ativo" : "Inativo",
    };
}

function GerenciarAlmoxarifes() {
    const navigate = useNavigate();
    const filtroRef = useRef(null);

    const [almoxarifes, setAlmoxarifes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const [busca, setBusca] = useState("");
    const [mostrarFiltroStatus, setMostrarFiltroStatus] = useState(false);
    const [statusSelecionados, setStatusSelecionados] = useState([]);

    // controle dos modais
    const [almoxarifeEditando, setAlmoxarifeEditando] = useState(null);
    const [almoxarifeRedefinindoSenha, setAlmoxarifeRedefinindoSenha] = useState(null);
    const [almoxarifeExcluindo, setAlmoxarifeExcluindo] = useState(null);

    useEffect(() => {
        async function carregarAlmoxarifes() {
            try {
                setCarregando(true);
                const response = await api.get("/v1/almoxarifes");
                const dados = Array.isArray(response.data)
                    ? response.data
                    : response.data.content || [];

                setAlmoxarifes(dados.map(adaptarAlmoxarife));
            } catch (error) {
                console.error("Erro ao buscar almoxarifes:", error);
                setAlmoxarifes([]);
            } finally {
                setCarregando(false);
            }
        }

        carregarAlmoxarifes();
    }, []);

    useEffect(() => {
        function handleClickFora(e) {
            if (filtroRef.current && !filtroRef.current.contains(e.target)) {
                setMostrarFiltroStatus(false);
            }
        }
        document.addEventListener("mousedown", handleClickFora);
        return () => document.removeEventListener("mousedown", handleClickFora);
    }, []);

    function alternarStatus(status) {
        setStatusSelecionados((prev) =>
            prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
        );
    }

  
    
    function handleSalvarEdicao(dadosAtualizados) {

        setAlmoxarifes((prev) =>
            prev.map((a) => (a.id === dadosAtualizados.id ? { ...a, ...dadosAtualizados } : a))
        );
        setAlmoxarifeEditando(null);

        // chamada à api sem travar o modal
        api.put(`/v1/almoxarifes/${dadosAtualizados.id}`, dadosAtualizados).catch((error) => {
            console.error("Erro ao editar almoxarife:", error);
        });
    }

   
    function handleSalvarSenha({ almoxarifeId, senhaAntiga, senhaNova }) {
        setAlmoxarifeRedefinindoSenha(null);

        api.patch(`/v1/almoxarifes/${almoxarifeId}/senha`, { senhaAntiga, senhaNova }).catch(
            (error) => {
                console.error("Erro ao redefinir senha:", error);
            }
        );
    }



    function handleConfirmarExclusao() {
        const idParaExcluir = almoxarifeExcluindo.id;

        setAlmoxarifes((prev) => prev.filter((a) => a.id !== idParaExcluir));
        setAlmoxarifeExcluindo(null);

        api.delete(`/v1/almoxarifes/${idParaExcluir}`).catch((error) => {
            console.error("Erro ao excluir almoxarife:", error);
        });
    }
    
    const almoxarifesFiltrados = almoxarifes.filter((a) => {
        const nomeCombina = a.nome.toLowerCase().includes(busca.toLowerCase());
        const statusCombina =
            statusSelecionados.length === 0 || statusSelecionados.includes(a.status);
        return nomeCombina && statusCombina;
    });

    return (
        <div className="page-container">
            <NavBarAdmin mostrarVoltar={true} mostrarLinks={true} />

            <main className="almoxarifes-container">
                <div className="almoxarifes-breadcrumb">
                    <Link to="/menu">Menu de opções</Link>
                    <span> &gt; </span>
                    <span>Gerenciar Almoxarifes</span>
                </div>

                <div className="almoxarifes-topo">
                    <div>
                        <h1 className="titulo-almoxarifes">ALMOXARIFES</h1>
                        <div className="linha-laranja"></div>
                    </div>

                    <div className="almoxarifes-filtros">
                        <div className="filtro-status-wrapper" ref={filtroRef}>
                            <button
                                type="button"
                                className="filtro-status-btn"
                                onClick={() => setMostrarFiltroStatus((v) => !v)}
                            >
                                Filtrar por Status
                            </button>

                            {mostrarFiltroStatus && (
                                <div className="filtro-status-dropdown">
                                    {["Ativo", "Inativo"].map((status) => (
                                        <label key={status} className="filtro-status-item">
                                            <input
                                                type="checkbox"
                                                checked={statusSelecionados.includes(status)}
                                                onChange={() => alternarStatus(status)}
                                            />
                                            {status}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="busca-wrapper">
                            <label className="busca-label">Pesquisar Almoxarife:</label>
                            <div className="busca-input-wrapper">
                                <input
                                    type="text"
                                    className="busca-input"
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                />
                                <img src={lupaIcon} alt="Buscar" className="busca-icone" />
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="almoxarifes-cadastrar-btn"
                        onClick={() => navigate("/cadastro-almoxarife")}
                    >
                        Cadastrar Almoxarife
                    </button>
                </div>

                <div className="almoxarifes-lista">
                    {carregando && (
                        <p className="almoxarifes-status">Carregando almoxarifes...</p>
                    )}

                    {!carregando && almoxarifesFiltrados.length === 0 && (
                        <p className="almoxarifes-status">Nenhum almoxarife encontrado.</p>
                    )}

                    {!carregando &&
                        almoxarifesFiltrados.map((almoxarife) => (
                            <CardAlmoxarife
                                key={almoxarife.id}
                                almoxarife={almoxarife}
                                onEditar={setAlmoxarifeEditando}
                                onRedefinirSenha={setAlmoxarifeRedefinindoSenha}
                                onExcluir={setAlmoxarifeExcluindo}
                            />
                        ))}
                </div>
            </main>

            {almoxarifeEditando && (
                <ModalEditarAlmoxarife
                    almoxarife={almoxarifeEditando}
                    onSalvar={handleSalvarEdicao}
                    onCancelar={() => setAlmoxarifeEditando(null)}
                />
            )}

            {almoxarifeRedefinindoSenha && (
                <ModalRedefinirSenha
                    almoxarife={almoxarifeRedefinindoSenha}
                    onSalvar={handleSalvarSenha}
                    onCancelar={() => setAlmoxarifeRedefinindoSenha(null)}
                />
            )}

            {almoxarifeExcluindo && (
                <ModalConfirmarExclusao
                    almoxarife={almoxarifeExcluindo}
                    onConfirmar={handleConfirmarExclusao}
                    onCancelar={() => setAlmoxarifeExcluindo(null)}
                />
            )}
        </div>
    );
}

export default GerenciarAlmoxarifes;