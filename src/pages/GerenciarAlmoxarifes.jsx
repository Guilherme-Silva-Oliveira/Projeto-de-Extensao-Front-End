import "./GerenciarAlmoxarifes.css";
import NavBar from "../components/NavBar";
import CardAlmoxarife from "../components/CardAlmoxarife";
import ModalEditarAlmoxarife from "../components/ModalEditarAlmoxarife";
import ModalRedefinirSenha from "../components/ModalRedefinirSenha";
import ModalConfirmarExclusao from "../components/ModalConfirmarExclusao";
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../provider/api.js";
import lupaIcon from "../assets/lupa.png";
// dados temporarios enquanto a api n ta conectada

function gerarAlmoxarifes() {
    return [
        {
            id: 1,
            nome: "Marisa da Silva Furtado",
            matricula: "M489254",
            dataCriacao: "08/05/2026 - 13h18",
            ultimoAcesso: "22/08/2026 - 16h40",
            email: "marisa.sf@xingu.com",
            telefone: "(11) 95846-5469",
            status: "Ativo",
        },
        {
            id: 2,
            nome: "João Vitoriano Liralvez",
            matricula: "M489255",
            dataCriacao: "10/05/2026 - 09h02",
            ultimoAcesso: "21/08/2026 - 10h12",
            email: "joao.vl@xingu.com",
            telefone: "(11) 94512-3387",
            status: "Ativo",
        },
        {
            id: 3,
            nome: "Pedro Luizaldo Giraldino",
            matricula: "M489256",
            dataCriacao: "12/05/2026 - 14h45",
            ultimoAcesso: "20/08/2026 - 08h55",
            email: "pedro.lg@xingu.com",
            telefone: "(11) 93321-7789",
            status: "Ativo",
        },
        {
            id: 4,
            nome: "Fernando Henrique Brandão",
            matricula: "M489257",
            dataCriacao: "15/05/2026 - 11h30",
            ultimoAcesso: "02/07/2026 - 17h20",
            email: "fernando.hb@xingu.com",
            telefone: "(11) 92210-4456",
            status: "Inativo",
        },
    ];
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
        setCarregando(true);
        setTimeout(() => {
            setAlmoxarifes(gerarAlmoxarifes());
            setCarregando(false);
        }, 300);
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

    async function buscarAlmoxarifes() {
        try {
            setCarregando(true);
            const response = await api.get("/v1/almoxarifes");
            setAlmoxarifes(response.data);
        } catch (error) {
            console.error("Erro ao buscar almoxarifes:", error);
        } finally {
            setCarregando(false);
        }
    }
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
            <NavBar mostrarVoltar={true} mostrarLinks={true} />

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