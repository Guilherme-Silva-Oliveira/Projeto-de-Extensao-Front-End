import "./GerenciarAlmoxarifado.css";
import NavBar from "../components/NavBar";
import CardMaterial from "../components/CardMaterial";
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../provider/api.js";
import lupaIcon from "../assets/lupa.png";
import cadastro from "../assets/cadastrar.png"
import ModalCadastroMaterial from "../components/ModalCadastroMaterial.jsx"

// dados temporarios enquanto a api n ta conectada 

function gerarMateriais() {
    return Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        nome: "Cartolina Azul",
        quantidade: 732,
        unidadeMedida: "Folhas",
        dataVencimento: null,
        categoria: "Cartolina",
        categoriaGrupo: "Papéis",
        descricao: "Jeferson",
    }));
}

function gerarCategorias() {
    // (banco de dados)
    return [
        { id: 1, nome: "Papéis" },
        { id: 2, nome: "Pincéis" },
        { id: 3, nome: "Tintas" },
        { id: 4, nome: "Isopor" },
    ];
}

function gerarMateriaisDisponiveis() {
    // temporario por enquanto pq dps vem do crud
    return [
        { id: 1, nome: "Cartolina Azul", categoria: "Papéis" },
        { id: 2, nome: "Cartolina Verde", categoria: "Papéis" },
        { id: 3, nome: "Pincel Chato Nº 12", categoria: "Pincéis" },
        { id: 4, nome: "Pincel Redondo Nº 8", categoria: "Pincéis" },
        { id: 5, nome: "Tinta Guache Preta", categoria: "Tintas" },
        { id: 6, nome: "Placa de Isopor", categoria: "Isopor" },
    ];
}

function GerenciarAlmoxarifado() {
    const navigate = useNavigate();
    const filtroRef = useRef(null);

    const [materiais, setMateriais] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [materiaisDisponiveis, setMateriaisDisponiveis] = useState([]);

    const [busca, setBusca] = useState("");
    const [mostrarFiltroCategoria, setMostrarFiltroCategoria] = useState(false);
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);

    const [modalAberto, setModalAberto] = useState(false);

    useEffect(() => {
        // buscarMateriais();
        // buscarCategorias();

        //simula um carregamento e popula a lista
        setCarregando(true);
        setTimeout(() => {
            setMateriais(gerarMateriais());
            setCategorias(gerarCategorias());
            setMateriaisDisponiveis(gerarMateriaisDisponiveis());
            setCarregando(false);
        }, 300);
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

    async function buscarMateriais() {
        try {
            setCarregando(true);
            const response = await api.get("/v1/materiais");
            setMateriais(response.data);
        } catch (error) {
            console.error("Erro ao buscar materiais:", error);
        } finally {
            setCarregando(false);
        }
    }

    async function buscarCategorias() {
        try {
            const response = await api.get("/v1/categorias");
            setCategorias(response.data);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    }

    function alternarCategoria(nomeCategoria) {
        setCategoriasSelecionadas((prev) =>
            prev.includes(nomeCategoria)
                ? prev.filter((c) => c !== nomeCategoria)
                : [...prev, nomeCategoria]
        );
    }

    function registrarEntradaMaterial({ quantidade }, materialAlvo) {
    // chamada de api (back), por exemplo:
    // await api.patch(`/v1/materiais/${materialAlvo.id}/entrada`, { quantidade: Number(quantidade) });

    setMateriais((prev) =>
        prev.map((m) =>
            m.id === materialAlvo.id
                ? { ...m, quantidade: m.quantidade + Number(quantidade || 0) }
                : m
        )
    );
}

    // registra um novo material e o exibe na tela
    async function cadastrarMaterial({ nome, categoria, quantidade, validade, fornecedor }) {
        //chamada de api (back)
        // const response = await api.post("/v1/materiais", {
        //     nome,
        //     categoria,
        //     quantidade: Number(quantidade),
        //     dataVencimento: validade || null,
        //     fornecedor,
        // });

        const novoMaterial = {
            id: Date.now(),
            nome: nome,
            quantidade: Number(quantidade) || 0,
            unidadeMedida: "Unidades",
            dataVencimento: validade || null,
            categoria: nome,
            categoriaGrupo: categoria,
            descricao: `Fornecedor: ${fornecedor || "não informado"}`,
        };

        setMateriais((prev) => [novoMaterial, ...prev]);
        setModalAberto(false);
    }

    const materiaisFiltrados = materiais.filter((m) => {
        const nomeCombina = m.nome.toLowerCase().includes(busca.toLowerCase());
        const categoriaCombina =
            categoriasSelecionadas.length === 0 ||
            categoriasSelecionadas.includes(m.categoriaGrupo);
        return nomeCombina && categoriaCombina;
    });

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} mostrarLinks={true} />

            <main className="almoxarifado-container">
                <div className="almoxarifado-breadcrumb">
                    <Link to="/menu">Menu de opções</Link>
                    <span> &gt; </span>
                    <span>Gerenciar Almoxarifado</span>
                </div>

                <div className="almoxarifado-topo">
                    <div className="almoxarifado-titulo-area">
                        <h1 className="titulo-almoxarifado">ALMOXARIFADO</h1>
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
                                    onChange={(e) => setBusca(e.target.value)}
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
                        materiaisFiltrados.map((material) => (
                            <CardMaterial
                                key={material.id}
                                material={material}
                                materiaisDisponiveis={materiaisDisponiveis}
                                onConfirmarEntrada={registrarEntradaMaterial}
                            />
                        ))}
                </div>
            </main>

            {/* {modalAberto && (
                    <ModalCadastroMaterial
                        materiaisDisponiveis={materiaisDisponiveis}
                        onClose={() => setModalAberto(false)}
                        onConfirmar={cadastrarMaterial}
                    />
                )} */}
        </div>
    );
}

export default GerenciarAlmoxarifado;