import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import lupaIcon from "../assets/lupa.png";
import "./GerenciarEntidade.css";

const entidades = {
    categorias: {
        titulo: "CATEGORIAS",
        colunas: [
            { chave: "nomeCategoria", titulo: "Nome da Categoria" },
        ],
        dados: [
            { id: 1, nomeCategoria: "Material de limpeza" },
            { id: 2, nomeCategoria: "Papelaria" },
            { id: 3, nomeCategoria: "Equipamentos" },
            { id: 4, nomeCategoria: "Alimentos" },
        ],
    },
    "tipos-fornecedor": {
        titulo: "TIPOS DE FORNECEDOR",
        colunas: [
            { chave: "nomeTipo", titulo: "Tipo de Fornecedor" },
        ],
        dados: [
            { id: 1, nomeTipo: "Material de consumo" },
            { id: 2, nomeTipo: "Material permanente" },
            { id: 3, nomeTipo: "Alimentação" },
        ],
    },
    fornecedores: {
        titulo: "FORNECEDORES",
        colunas: [
            { chave: "nome", titulo: "Nome" },
            { chave: "email", titulo: "Email" },
            { chave: "telefone", titulo: "Telefone" },
            { chave: "tipoFornecedor.nomeTipo", titulo: "Tipo de Fornecedor" },
        ],
        dados: [
            {
                id: 1,
                nome: "Papelaria Central",
                email: "contato@papelariacentral.com.br",
                telefone: "(11) 3456-7890",
                tipoFornecedor: { id: 2, nomeTipo: "Material permanente" },
            },
            {
                id: 2,
                nome: "Suprimentos Escolar",
                email: "vendas@suprimentosescolar.com.br",
                telefone: "(11) 2345-6789",
                tipoFornecedor: { id: 1, nomeTipo: "Material de consumo" },
            },
            {
                id: 3,
                nome: "Alimentos do Vale",
                email: "pedidos@alimentosdovale.com.br",
                telefone: "(11) 4567-8901",
                tipoFornecedor: { id: 3, nomeTipo: "Alimentação" },
            },
        ],
    },
    "setores-estoque": {
        titulo: "SETORES DE ESTOQUE",
        colunas: [
            { chave: "identificadorSetor", titulo: "Identificador do Setor" },
        ],
        dados: [
            { almoxarifadoId: 1, identificadorSetor: "A-01" },
            { almoxarifadoId: 1, identificadorSetor: "A-02" },
            { almoxarifadoId: 2, identificadorSetor: "B-01" },
        ],
    },
    "unidades-medida": {
        titulo: "UNIDADES DE MEDIDA",
        colunas: [
            { chave: "nomeUnidade", titulo: "Unidade de Medida" },
        ],
        dados: [
            { id: 1, nomeUnidade: "Unidade" },
            { id: 2, nomeUnidade: "Caixa" },
            { id: 3, nomeUnidade: "Pacote" },
            { id: 4, nomeUnidade: "Litro" },
        ],
    },
    professores: {
        titulo: "PROFESSORES",
        colunas: [
            { chave: "nome", titulo: "Nome" },
            { chave: "email", titulo: "Email" },
            { chave: "telefone", titulo: "Telefone" },
        ],
        dados: [
            { id: 1, nome: "Ana Martins", email: "ana.martins@escola.edu.br", telefone: "(11) 91234-5678" },
            { id: 2, nome: "Bruno Costa", email: "bruno.costa@escola.edu.br", telefone: "(11) 92345-6789" },
            { id: 3, nome: "Carla Souza", email: "carla.souza@escola.edu.br", telefone: "(11) 93456-7890" },
        ],
    },
    motivos: {
        titulo: "MOTIVOS",
        colunas: [
            { chave: "descricao", titulo: "Descrição" },
        ],
        dados: [
            { id: 1, descricao: "Reposição de material" },
            { id: 2, descricao: "Aula prática" },
            { id: 3, descricao: "Projeto escolar" },
            { id: 4, descricao: "Manutenção" },
        ],
    },
    limites: {
        titulo: "LIMITES",
        colunas: [
            { chave: "limite", titulo: "Limite" },
            { chave: "tipoLimite.nomeTipo", titulo: "Tipo de Limite" },
        ],
        dados: [
            { id: 1, limite: "10", tipoLimite: { id: 1, nomeTipo: "Estoque mínimo" } },
            { id: 2, limite: "50", tipoLimite: { id: 2, nomeTipo: "Estoque máximo" } },
            { id: 3, limite: "5", tipoLimite: { id: 3, nomeTipo: "Alerta de reposição" } },
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

    useEffect(() => {
        setSecaoAtual(encontrarSecao(chaveEntidade));
        setBusca("");
    }, [chaveEntidade]);

    const entidadesVisiveis = secoes[secaoAtual].map((chave) => entidades[chave]);
    const secaoFornecedoresEProfessores = secoes[secaoAtual].includes("fornecedores");
    const buscaNormalizada = busca.trim().toLocaleLowerCase("pt-BR");

    function filtrarRegistros(entidade) {
        return entidade.dados.filter((registro) =>
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
                        const registros = filtrarRegistros(entidade);

                        return (
                            <section className="gerenciar-entidade-secao" key={entidade.titulo}>
                                <div className="gerenciar-entidade-secao-titulo">
                                    <h2>{entidade.titulo}</h2>
                                    <span>{registros.length} registros</span>
                                </div>
                                {registros.length > 0 ? (
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