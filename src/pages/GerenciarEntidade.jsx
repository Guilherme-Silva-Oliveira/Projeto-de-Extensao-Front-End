import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { api } from "../provider/api.js";
import lupaIcon from "../assets/lupa.png";
import "./GerenciarEntidade.css";

const entidades = {
    categorias: {
        titulo: "CATEGORIAS",
        endpoint: "/v1/categorias",
        colunas: [
            { chave: "nomeCategoria", titulo: "Nome da Categoria" },
        ],
    },
    "tipos-fornecedor": {
        titulo: "TIPOS DE FORNECEDOR",
        endpoint: "/v1/fornecedores/tipos",
        colunas: [
            { chave: "nomeTipo", titulo: "Tipo de Fornecedor" },
        ],
    },
    fornecedores: {
        titulo: "FORNECEDORES",
        endpoint: "/v1/fornecedores",
        colunas: [
            { chave: "nome", titulo: "Nome" },
            { chave: "email", titulo: "Email" },
            { chave: "telefone", titulo: "Telefone" },
            { chave: "tipoFornecedor.nomeTipo", titulo: "Tipo de Fornecedor" },
        ],
    },
    "setores-estoque": {
        titulo: "SETORES DE ESTOQUE",
        endpoint: "/v1/setores",
        colunas: [
            { chave: "identificadorSetor", titulo: "Identificador do Setor" },
        ],
    },
    "unidades-medida": {
        titulo: "UNIDADES DE MEDIDA",
        endpoint: "/v1/unidademedida",
        colunas: [
            { chave: "nomeUnidade", titulo: "Unidade de Medida" },
        ],
    },
    professores: {
        titulo: "PROFESSORES",
        endpoint: "/v1/professores",
        colunas: [
            { chave: "nome", titulo: "Nome" },
            { chave: "email", titulo: "Email" },
            { chave: "telefone", titulo: "Telefone" },
        ],
    },
    motivos: {
        titulo: "MOTIVOS",
        endpoint: "/v1/motivos",
        colunas: [
            { chave: "descricao", titulo: "Descrição" },
        ],
    },
    limites: {
        titulo: "LIMITES",
        endpoint: "/v1/limites",
        colunas: [
            { chave: "limite", titulo: "Limite" },
            { chave: "tipoLimite.nomeTipo", titulo: "Tipo de Limite" },
        ],
    },
};

const secoes = [
    ["categorias", "tipos-fornecedor", "setores-estoque"],
    ["unidades-medida", "motivos", "limites"],
    ["fornecedores", "professores"],
];

function obterValor(registro, chave) {
    return chave.split(".").reduce((valor, parte) => valor?.[parte], registro) ?? "--";
}

function encontrarSecao(chaveEntidade) {
    const indice = secoes.findIndex((secao) => secao.includes(chaveEntidade));
    return indice < 0 ? 0 : indice;
}

function GerenciarEntidade() {
    const { entidade: chaveEntidade } = useParams();
    const [busca, setBusca] = useState("");
    const [secaoAtual, setSecaoAtual] = useState(() => encontrarSecao(chaveEntidade));
    const [dadosEntidades, setDadosEntidades] = useState({});
    const [carregandoEntidades, setCarregandoEntidades] = useState({});
    const [errosEntidades, setErrosEntidades] = useState({});

    useEffect(() => {
        setSecaoAtual(encontrarSecao(chaveEntidade));
        setBusca("");
    }, [chaveEntidade]);

    useEffect(() => {
        const controller = new AbortController();
        const chavesSecao = secoes[secaoAtual];

        setCarregandoEntidades((atuais) => ({
            ...atuais,
            ...Object.fromEntries(chavesSecao.map((chave) => [chave, true])),
        }));
        setErrosEntidades((atuais) => ({
            ...atuais,
            ...Object.fromEntries(chavesSecao.map((chave) => [chave, ""])),
        }));

        async function carregarEntidades() {
            await Promise.all(chavesSecao.map(async (chave) => {
                try {
                    const response = await api.get(entidades[chave].endpoint, {
                        signal: controller.signal,
                    });
                    const dados = Array.isArray(response.data)
                        ? response.data
                        : Array.isArray(response.data?.content)
                            ? response.data.content
                            : [];

                    setDadosEntidades((atuais) => ({ ...atuais, [chave]: dados }));
                } catch (error) {
                    if (controller.signal.aborted) return;
                    console.error(`Erro ao carregar ${entidades[chave].titulo.toLowerCase()}:`, error);
                    setErrosEntidades((atuais) => ({
                        ...atuais,
                        [chave]: "Não foi possível carregar esta listagem.",
                    }));
                } finally {
                    if (!controller.signal.aborted) {
                        setCarregandoEntidades((atuais) => ({ ...atuais, [chave]: false }));
                    }
                }
            }));
        }

        carregarEntidades();
        return () => controller.abort();
    }, [secaoAtual]);

    const entidadesVisiveis = secoes[secaoAtual].map((chave) => ({
        chave,
        ...entidades[chave],
    }));
    const secaoFornecedoresEProfessores = secoes[secaoAtual].includes("fornecedores");
    const buscaNormalizada = busca.trim().toLocaleLowerCase("pt-BR");

    function filtrarRegistros(entidade, dados) {
        return dados.filter((registro) =>
            entidade.colunas.some((coluna) =>
                String(obterValor(registro, coluna.chave))
                    .toLocaleLowerCase("pt-BR")
                    .includes(buscaNormalizada)
            )
        );
    }

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} mostrarLinks={true} />
            <main className="gerenciar-entidade-container">
                <div className="gerenciar-entidade-topo">
                    <div className="gerenciar-entidade-titulo-area">
                        <h1 className="gerenciar-entidade-titulo">GERENCIAMENTOS</h1>
                        <div className="linha-laranja" />
                    </div>

                    <div className="gerenciar-entidade-busca">
                        <label htmlFor="busca-entidade">Buscar</label>
                        <div className="gerenciar-entidade-busca-input">
                            <input
                                id="busca-entidade"
                                type="search"
                                placeholder="Pesquisar nos gerenciamentos"
                                value={busca}
                                onChange={(evento) => setBusca(evento.target.value)}
                            />
                            <img src={lupaIcon} alt="" />
                        </div>
                    </div>
                </div>

                <div className={`gerenciar-entidade-secoes${secaoFornecedoresEProfessores ? " gerenciar-entidade-secoes-dupla" : ""}`}>
                    {entidadesVisiveis.map((entidade) => {
                        const registros = filtrarRegistros(entidade, dadosEntidades[entidade.chave] ?? []);
                        const carregando = carregandoEntidades[entidade.chave];
                        const erro = errosEntidades[entidade.chave];

                        return (
                            <section className="gerenciar-entidade-secao" key={entidade.chave}>
                                <div className="gerenciar-entidade-secao-titulo">
                                    <h2>{entidade.titulo}</h2>
                                    <span>{registros.length} registros</span>
                                </div>
                                {carregando ? (
                                    <p className="gerenciar-entidade-vazio">Carregando...</p>
                                ) : erro ? (
                                    <p className="gerenciar-entidade-vazio gerenciar-entidade-erro">{erro}</p>
                                ) : registros.length > 0 ? (
                                    <div className="gerenciar-entidade-lista">
                                        {registros.map((registro) => (
                                            <article
                                                className="gerenciar-entidade-card"
                                                key={entidade.colunas.map((coluna) => obterValor(registro, coluna.chave)).join("-")}
                                            >
                                                {entidade.colunas.map((coluna) => (
                                                    <div className="gerenciar-entidade-campo" key={coluna.chave}>
                                                        <span className="gerenciar-entidade-label">{coluna.titulo}</span>
                                                        <span className="gerenciar-entidade-valor">
                                                            {obterValor(registro, coluna.chave)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </article>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="gerenciar-entidade-vazio">Nenhum registro encontrado.</p>
                                )}
                            </section>
                        );
                    })}
                </div>

                <nav className="gerenciar-entidade-paginacao" aria-label="Seções de gerenciamento">
                    <button
                        type="button"
                        aria-label="Seção anterior"
                        onClick={() => setSecaoAtual((atual) => Math.max(0, atual - 1))}
                        disabled={secaoAtual === 0}
                    >
                        ‹
                    </button>
                    <span>Seção {secaoAtual + 1} de {secoes.length}</span>
                    <button
                        type="button"
                        aria-label="Próxima seção"
                        onClick={() => setSecaoAtual((atual) => Math.min(secoes.length - 1, atual + 1))}
                        disabled={secaoAtual === secoes.length - 1}
                    >
                        ›
                    </button>
                </nav>
            </main>
        </div>
    );
}

export default GerenciarEntidade;