import "./GerenciarMaterial.css";
import "./GerenciarSolicitacoesReprovadas.css";
import NavBar from "../components/NavBar.jsx";
import CardMaterial from "../components/CardMaterial.jsx";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../provider/api.js";
import lupaIcon from "../assets/lupa.png";
import cadastro from "../assets/cadastrar.png"

function normalizarMaterial(material) {
    const categoria = typeof material.categoria === "string"
        ? material.categoria
        : material.categoria?.nomeCategoria ??
            material.categoria?.nome ??
            material.categoriaNome ??
            material.nomeCategoria ??
            "";
    const unidadeMedida =
        material.unidadeMedida?.nomeUnidade ?? material.unidadeMedida?.nome ?? "";

    return {
        ...material,
        nome: material.nomeMaterial ?? "",
        categoria,
        categoriaGrupo: categoria,
        unidadeMedida,
    };
}

function GerenciarMaterial() {
    const navigate = useNavigate();
    const filtroRef = useRef(null);
    const tamanhoPagina = 7;
    const tamanhoPaginaApi = 100;

    const [materiais, setMateriais] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const [busca, setBusca] = useState("");
    const [mostrarFiltroCategoria, setMostrarFiltroCategoria] = useState(false);
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);

    const [page, setPage] = useState(0);
    const [menuAlertasAberto, setMenuAlertasAberto] = useState(false);
    const [alertas, setAlertas] = useState([]);

    useEffect(() => {
        async function carregarAlertas() {
            try {
                const response = await api.get("/v1/frontend/alertas");
                const alertasRecebidos = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data?.content)
                        ? response.data.content
                        : [];
                setAlertas(alertasRecebidos);
            } catch (error) {
                console.error("Erro ao buscar alertas:", error);
            }
        }

        carregarAlertas();
    }, []);

    // Carregar categorias apenas uma vez
    useEffect(() => {
        async function carregarCategorias() {
            try {
                const categoriasResponse = await api.get("/v1/categorias");
                setCategorias(
                    Array.isArray(categoriasResponse.data)
                        ? categoriasResponse.data.map((categoria) => ({
                            ...categoria,
                            nome: categoria.nomeCategoria ?? categoria.nome ?? "",
                        }))
                        : []
                );
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            }
        }
        carregarCategorias();
    }, []);

    // Carrega todas as páginas para que filtros por categoria considerem todo o catálogo.
    useEffect(() => {
        async function carregarMateriais() {
            try {
                setCarregando(true);
                const primeiraResposta = await api.get("/v1/materiais", {
                    params: { page: 0, size: tamanhoPaginaApi }
                });

                const primeiraPagina = Array.isArray(primeiraResposta.data)
                    ? primeiraResposta.data
                    : Array.isArray(primeiraResposta.data?.content)
                        ? primeiraResposta.data.content
                        : [];
                const totalPaginasApi = Array.isArray(primeiraResposta.data)
                    ? 1
                    : Math.max(1, primeiraResposta.data?.totalPages ?? 1);
                const paginasRestantes = await Promise.all(
                    Array.from({ length: totalPaginasApi - 1 }, (_, indice) =>
                        api.get("/v1/materiais", {
                            params: { page: indice + 1, size: tamanhoPaginaApi }
                        })
                    )
                );
                const materiaisRecebidos = [
                    ...primeiraPagina,
                    ...paginasRestantes.flatMap((resposta) =>
                        Array.isArray(resposta.data)
                            ? resposta.data
                            : Array.isArray(resposta.data?.content)
                                ? resposta.data.content
                                : []
                    ),
                ].map(normalizarMaterial);

                setMateriais(materiaisRecebidos);
            } catch (error) {
                console.error("Erro ao buscar materiais:", error);
            } finally {
                setCarregando(false);
            }
        }

        carregarMateriais();
    }, []);

    // fecha o dropdown de categorias ao clicar fora dele
    useEffect(() => {
        function handleClickFora(e) {
            if (filtroRef.current && !filtroRef.current.contains(e.target)) {
                setMostrarFiltroCategoria(false);
            }
        }
        document.addEventListener("mousedown", handleClickFora);
        return () => document.removeEventListener("mousedown", handleClickFora);
    }, []);

    function alternarCategoria(nomeCategoria) {
        setPage(0);
        setCategoriasSelecionadas((prev) =>
            prev.includes(nomeCategoria)
                ? prev.filter((c) => c !== nomeCategoria)
                : [...prev, nomeCategoria]
        );
    }

    async function registrarEntradaMaterial({ quantidade }, materialAlvo) {
        const quantidadeAdicionada = Number(quantidade);
        const quantidadeAtual = Number(materialAlvo.quantidade) || 0;

        const response = await api.patch(`/v1/materiais/${materialAlvo.id}`, {
            nomeMaterial: materialAlvo.nomeMaterial ?? materialAlvo.nome,
            quantidade: quantidadeAtual + quantidadeAdicionada,
            descricao: materialAlvo.descricao ?? "",
        });

        const materialAtualizado = response.data ?? {
            ...materialAlvo,
            quantidade: quantidadeAtual + quantidadeAdicionada,
        };

        setMateriais((prev) =>
            prev.map((material) =>
                material.id === materialAlvo.id
                    ? normalizarMaterial({ ...material, ...materialAtualizado })
                    : material
            )
        );
    }

    async function marcarAlertaResolvido(alerta) {
        if (alerta.idAlerta == null || alerta.isResolvido) return;

        try {
            await api.put(
                `/v1/frontend/alertas/${alerta.idAlerta}/${encodeURIComponent(alerta.causaAlerta)}`
            );
            setAlertas((anteriores) =>
                anteriores.map((item) =>
                    item.idAlerta === alerta.idAlerta &&
                    item.causaAlerta === alerta.causaAlerta
                        ? { ...item, isResolvido: true }
                        : item
                )
            );
        } catch (error) {
            console.error("Erro ao resolver alerta:", error);
            alert("Não foi possível marcar o alerta como resolvido.");
        }
    }

    const materiaisFiltrados = materiais.filter((m) => {
        const nomeCombina = m.nome.toLowerCase().includes(busca.toLowerCase());
        const categoriaCombina =
            categoriasSelecionadas.length === 0 ||
            categoriasSelecionadas.some(
                (categoria) =>
                    categoria.trim().toLocaleLowerCase("pt-BR") ===
                    String(m.categoriaGrupo ?? "").trim().toLocaleLowerCase("pt-BR")
            );
        return nomeCombina && categoriaCombina;
    });
    const totalPages = Math.max(1, Math.ceil(materiaisFiltrados.length / tamanhoPagina));
    const materiaisVisiveis = materiaisFiltrados.slice(
        page * tamanhoPagina,
        (page + 1) * tamanhoPagina
    );

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} mostrarLinks={true} />

            <main className="almoxarifado-container">
                <div className="almoxarifado-breadcrumb">
                    
                </div>

                <div className="almoxarifado-topo">
                    <div className="almoxarifado-titulo-area">
                        <h1 className="titulo-almoxarifado">MATERIAIS</h1>
                        <div className="linha-laranja"></div>
                    </div>

                    <div className="almoxarifado-filtros">
                        <div className="filtro-categoria-wrapper" ref={filtroRef}>
                            <button
                                type="button"
                                className="filtro-categoria-btn"
                                onClick={() => setMostrarFiltroCategoria((v) => !v)}
                            >
                                Filtrar por Categoria
                            </button>

                            {mostrarFiltroCategoria && (
                                <div className="filtro-categoria-dropdown">
                                    {categorias.map((cat) => (
                                        <label
                                            key={cat.id}
                                            className="filtro-categoria-item"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={categoriasSelecionadas.includes(
                                                    cat.nome
                                                )}
                                                onChange={() =>
                                                    alternarCategoria(cat.nome)
                                                }
                                            />
                                            {cat.nome}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="busca-wrapper">
                            <label className="busca-label">
                                Pesquise por um Material:
                            </label>
                            <div className="busca-input-wrapper">
                                <input
                                    type="text"
                                    className="busca-input"
                                    placeholder="Nome do material"
                                    value={busca}
                                    onChange={(e) => {
                                        setBusca(e.target.value);
                                        setPage(0);
                                    }}
                                />
                                <img
                                    src={lupaIcon}
                                    alt="Buscar"
                                    className="busca-icone"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="almoxarifado-acoes">
                        <button
                            type="button"
                            className="acao-btn acao-ativa"
                            onClick={() => navigate("/cadastro-material")}
                        >
                            Cadastrar material
                            <img src={cadastro} alt="ícone de cadastro" />
                        </button>
                        {/* <button
                                type="button"
                                className="acao-btn"
                                onClick={() => setModalAberto(true)}
                            >
                                Entrada de material existente
                            </button> */}
                    </div>
                </div>

                <div className="almoxarifado-lista">
                    {carregando && (
                        <p className="almoxarifado-status">Carregando materiais...</p>
                    )}

                    {!carregando && materiaisFiltrados.length === 0 && (
                        <p className="almoxarifado-status">
                            Nenhum material encontrado.
                        </p>
                    )}

                    {!carregando &&
                        materiaisVisiveis.map((material) => (
                            <CardMaterial
                                key={material.id}
                                material={material}
                                onConfirmarEntrada={registrarEntradaMaterial}
                            />
                        ))}
                    
                </div>
            </main>

            {!carregando && totalPages > 1 && (
                <nav className="almoxarifado-paginacao" aria-label="Paginação dos materiais">
                    <button
                        type="button"
                        aria-label="Página anterior"
                        onClick={() => setPage((paginaAtual) => Math.max(0, paginaAtual - 1))}
                        disabled={page === 0}
                    >
                        ‹
                    </button>
                    <span>Página {page + 1} de {totalPages}</span>
                    <button
                        type="button"
                        aria-label="Próxima página"
                        onClick={() => setPage((paginaAtual) => Math.min(totalPages - 1, paginaAtual + 1))}
                        disabled={page >= totalPages - 1}
                    >
                        ›
                    </button>
                </nav>
            )}

            <button
                type="button"
                className={`menu-reprovadas-abrir menu-alertas-materiais${alertas.length > 0 ? " menu-reprovadas-abrir-alerta" : ""}`}
                aria-label="Abrir alertas"
                aria-expanded={menuAlertasAberto}
                aria-controls="menu-lateral-alertas-materiais"
                onClick={() => setMenuAlertasAberto(true)}
            >
                <svg
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                    <path d="M10 21h4" />
                </svg>
            </button>

            <button
                type="button"
                className={`menu-reprovadas-overlay${menuAlertasAberto ? " menu-reprovadas-overlay-aberto" : ""}`}
                aria-label="Fechar alertas"
                tabIndex={menuAlertasAberto ? 0 : -1}
                onClick={() => setMenuAlertasAberto(false)}
            />

            <aside
                id="menu-lateral-alertas-materiais"
                className={`menu-reprovadas-painel${menuAlertasAberto ? " menu-reprovadas-painel-aberto" : ""}`}
                aria-label="Alertas"
                aria-hidden={!menuAlertasAberto}
            >
                <div className="menu-reprovadas-cabecalho">
                    <h2 id="title">ALERTAS EM ABERTO</h2>
                    <button type="button" onClick={() => setMenuAlertasAberto(false)}>
                        Fechar
                    </button>
                </div>
                <div className="menu-reprovadas-lista">
                    {alertas.map((alerta, index) => (
                        <article
                            className="menu-reprovadas-card"
                            key={`${alerta.causaAlerta ?? "alerta"}-${index}`}
                        >
                            <div className="menu-reprovadas-card-topo">
                                <h3>{alerta.causaAlerta || "Alerta"}</h3>
                                <span className={alerta.isResolvido ? "alerta-status resolvido" : "alerta-status aberto"}>
                                    {alerta.isResolvido ? "Resolvido" : "Em aberto"}
                                </span>
                            </div>
                            <div className="menu-reprovadas-card-conteudo">
                                <div className="menu-reprovadas-card-textos">
                                    <p className="menu-reprovadas-professor">
                                        {alerta.nomeProfessor || "Professor não informado"}
                                    </p>
                                    <p className="menu-reprovadas-descricao">
                                        {alerta.descricao || "Sem descrição."}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="menu-reprovadas-resolver"
                                    disabled={alerta.isResolvido}
                                    onClick={() => marcarAlertaResolvido(alerta)}
                                >
                                    {alerta.isResolvido ? "Resolvido" : "Resolver"}
                                </button>
                            </div>
                        </article>
                    ))}
                    {alertas.length === 0 && (
                        <p className="menu-reprovadas-vazio">Nenhum alerta listado.</p>
                    )}
                </div>
            </aside>

            {/* {modalAberto && (
                    <ModalCadastroMaterial />
                )} */}
        </div>
    );
}

export default GerenciarMaterial;