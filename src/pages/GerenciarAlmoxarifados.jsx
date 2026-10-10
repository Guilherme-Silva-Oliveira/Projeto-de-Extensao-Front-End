import "./GerenciarAlmoxarifados.css";
import NavBarAdmin from "../components/NavBarAdmin.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../provider/api.js";
import Pagination from "../components/Pagination";
import ModalConfirmarExclusao from "../components/ModalConfirmarExclusao";
import lupaIcon from "../assets/lupa.png";

function GerenciarAlmoxarifados() {
    const navigate = useNavigate();
    const [almoxarifados, setAlmoxarifados] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState("");
    const [erroExclusao, setErroExclusao] = useState("");
    const [almoxarifadoParaExcluir, setAlmoxarifadoParaExcluir] = useState(null);
    const [almoxarifadoExcluindoId, setAlmoxarifadoExcluindoId] = useState(null);
    const [busca, setBusca] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        async function carregarAlmoxarifados() {
            try {
                setCarregando(true);
                setErroCarregamento("");
                const response = await api.get("/v1/almoxarifados", {
                    params: { page, size: 10 },
                });
                const dados = Array.isArray(response.data)
                    ? response.data
                    : response.data?.content;

                if (!Array.isArray(dados)) {
                    throw new Error("A resposta da API não contém uma lista de almoxarifados.");
                }

                setAlmoxarifados(dados);
                setTotalPages(Array.isArray(response.data) ? 1 : response.data.totalPages || 1);
            } catch (error) {
                console.error("Erro ao buscar almoxarifados:", error);
                setAlmoxarifados([]);
                setErroCarregamento(
                    error?.response?.data?.message ?? "Não foi possível carregar os almoxarifados."
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarAlmoxarifados();
    }, [page]);

    async function confirmarExclusaoAlmoxarifado() {
        if (!almoxarifadoParaExcluir) return;

        const almoxarifado = almoxarifadoParaExcluir;
        try {
            setAlmoxarifadoExcluindoId(almoxarifado.id);
            setErroExclusao("");
            await api.delete(`/v1/almoxarifados/${almoxarifado.id}`);
            setAlmoxarifados((atuais) =>
                atuais.filter((item) => item.id !== almoxarifado.id)
            );

            if (almoxarifados.length === 1 && page > 0) {
                setPage((paginaAtual) => paginaAtual - 1);
            }
            setAlmoxarifadoParaExcluir(null);
        } catch (error) {
            console.error("Erro ao excluir almoxarifado:", error);
            setErroExclusao(
                error?.response?.data?.message ?? "Não foi possível excluir o almoxarifado."
            );
        } finally {
            setAlmoxarifadoExcluindoId(null);
        }
    }

    const almoxarifadosFiltrados = almoxarifados.filter((almoxarifado) =>
        String(almoxarifado.numeroSala ?? "").includes(busca.trim())
    );

    return (
        <div className="page-container">
            <NavBarAdmin mostrarVoltar={true} mostrarLinks={true} />

            <main className="almoxarifados-container">
                <div className="almoxarifados-topo">
                    <div>
                        <h1 className="titulo-almoxarifados">ALMOXARIFADOS</h1>
                        <div className="linha-laranja"></div>
                    </div>

                    <div className="busca-wrapper">
                        <label className="busca-label" htmlFor="busca-almoxarifados">
                            Pesquisar por número da sala:
                        </label>
                        <div className="busca-input-wrapper">
                            <input
                                id="busca-almoxarifados"
                                type="text"
                                className="busca-input"
                                value={busca}
                                onChange={(event) => setBusca(event.target.value)}
                            />
                            <img src={lupaIcon} alt="" className="busca-icone" />
                        </div>
                    </div>

                    <button
                        type="button"
                        className="almoxarifados-cadastrar-btn"
                        onClick={() => navigate("/cadastro-almoxarifado")}
                    >
                        Cadastrar Almoxarifado
                    </button>
                </div>

                <div className="almoxarifados-lista">
                    {carregando && (
                        <p className="almoxarifados-status">Carregando almoxarifados...</p>
                    )}

                    {!carregando && erroCarregamento && (
                        <p className="almoxarifados-status" role="alert">
                            {erroCarregamento}
                        </p>
                    )}

                    {!carregando && erroExclusao && (
                        <p className="almoxarifados-status" role="alert">
                            {erroExclusao}
                        </p>
                    )}

                    {!carregando && !erroCarregamento && almoxarifadosFiltrados.length === 0 && (
                        <p className="almoxarifados-status">Nenhum almoxarifado encontrado.</p>
                    )}

                    {!carregando &&
                        !erroCarregamento &&
                        almoxarifadosFiltrados.map((almoxarifado) => (
                            <article className="almoxarifado-card" key={almoxarifado.id}>
                                <span className="almoxarifado-card-id">#{almoxarifado.id}</span>
                                <span>Almoxarifado - Sala {almoxarifado.numeroSala}</span>
                                <button
                                    type="button"
                                    className="almoxarifado-excluir-btn"
                                    onClick={() => {
                                        setErroExclusao("");
                                        setAlmoxarifadoParaExcluir({
                                            ...almoxarifado,
                                            nome: `da sala ${almoxarifado.numeroSala}`,
                                        });
                                    }}
                                    disabled={almoxarifadoExcluindoId !== null}
                                >
                                    {almoxarifadoExcluindoId === almoxarifado.id
                                        ? "Excluindo..."
                                        : "Excluir"}
                                </button>
                            </article>
                        ))}

                    {!carregando && !erroCarregamento && almoxarifadosFiltrados.length > 0 && (
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    )}
                </div>
            </main>

            {almoxarifadoParaExcluir && (
                <ModalConfirmarExclusao
                    almoxarife={almoxarifadoParaExcluir}
                    entidade="o almoxarifado"
                    onConfirmar={confirmarExclusaoAlmoxarifado}
                    onCancelar={() => setAlmoxarifadoParaExcluir(null)}
                    processando={almoxarifadoExcluindoId !== null}
                />
            )}
        </div>
    );
}

export default GerenciarAlmoxarifados;
