import "./GerenciarMovimentacoes.css";
import NavBar from "../components/NavBar";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const movimentacoesMock = [
    {
        id: 1,
        acao: "Entrada",
        tipo: "entrada",
        material: "Cartolina Azul",
        categoria: "Papéis",
        motivo: "Pais",
        data: "2026-05-15",
        dataFormatada: "15/05/2026 - 13h30",
        quantidade: 40,
        responsavel: "Matheus Torres",
    },
    {
        id: 2,
        acao: "Devolução",
        tipo: "devolucao",
        material: "Pincel Atômico",
        categoria: "Pincéis",
        motivo: "Atividade Avaliativa",
        data: "2026-05-15",
        dataFormatada: "15/05/2026 - 11h20",
        quantidade: 12,
        responsavel: "Matheus Torres",
    },
    {
        id: 3,
        acao: "Entrada",
        tipo: "entrada",
        material: "Tinta Guache Azul",
        categoria: "Tintas",
        motivo: "Reposição de estoque",
        data: "2026-05-14",
        dataFormatada: "14/05/2026 - 10h00",
        quantidade: 24,
        responsavel: "Papelaria Xingu",
    },
    {
        id: 4,
        acao: "Retirada",
        tipo: "retirada",
        material: "Folha de Isopor",
        categoria: "Isopor",
        motivo: "Feira de Ciências",
        data: "2026-05-13",
        dataFormatada: "13/05/2026 - 15h10",
        quantidade: 8,
        responsavel: "Ana Beatriz",
    },
    {
        id: 5,
        acao: "Entrada",
        tipo: "entrada",
        material: "Papel Sulfite A4",
        categoria: "Papéis",
        motivo: "Reposição de estoque",
        data: "2026-05-12",
        dataFormatada: "12/05/2026 - 09h45",
        quantidade: 500,
        responsavel: "Papelaria Xingu",
    },
    {
        id: 6,
        acao: "Entrada",
        tipo: "entrada",
        material: "Pincel Escolar",
        categoria: "Pincéis",
        motivo: "Reposição de estoque",
        data: "2026-05-11",
        dataFormatada: "11/05/2026 - 14h00",
        quantidade: 30,
        responsavel: "Papelaria Xingu",
    },
];

const categorias = ["Papéis", "Pincéis", "Tintas", "Isopor"];

function GerenciarMovimentacoes() {
    const navigate = useNavigate();
    const [filtroData, setFiltroData] = useState("");
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
    const [mostrarFiltroData, setMostrarFiltroData] = useState(false);
    const [mostrarCategorias, setMostrarCategorias] = useState(false);

    function alternarCategoria(categoria) {
        setCategoriasSelecionadas((categoriasAtuais) =>
            categoriasAtuais.includes(categoria)
                ? categoriasAtuais.filter((item) => item !== categoria)
                : [...categoriasAtuais, categoria]
        );
    }

    const movimentacoesFiltradas = movimentacoesMock.filter((movimentacao) => {
        const dataCombina = !filtroData || movimentacao.data === filtroData;
        const categoriaCombina =
            categoriasSelecionadas.length === 0 ||
            categoriasSelecionadas.includes(movimentacao.categoria);

        return dataCombina && categoriaCombina;
    });

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} mostrarLinks={true} onVoltar={() => navigate(-1)} />

            <main className="movimentacoes-container">
                <div className="movimentacoes-breadcrumb">
                    <Link to="/menu">Menu de opções</Link>
                    <span> &gt; </span>
                    <span>Gerenciar Movimentações</span>
                </div>

                <div className="movimentacoes-topo">
                    <div className="movimentacoes-titulo-area">
                        <h1 className="titulo-movimentacoes">MOVIMENTAÇÕES</h1>
                        <div className="linha-laranja"></div>
                    </div>

                    <div className="movimentacoes-filtros">
                        <div className="filtro-data-wrapper">
                            <button
                                type="button"
                                className="filtro-movimentacoes filtro-data-btn"
                                onClick={() => setMostrarFiltroData((valorAtual) => !valorAtual)}
                            >
                                Filtrar por<br />Data
                            </button>

                            {mostrarFiltroData && (
                                <input
                                    type="date"
                                    className="filtro-data-input"
                                    value={filtroData}
                                    onChange={(event) => setFiltroData(event.target.value)}
                                    aria-label="Filtrar por data"
                                />
                            )}
                        </div>

                        <div className="filtro-categoria-wrapper">
                            <button
                                type="button"
                                className="filtro-movimentacoes filtro-categoria-btn"
                                onClick={() => setMostrarCategorias((valorAtual) => !valorAtual)}
                            >
                                Filtrar por<br />Categoria
                            </button>

                            {mostrarCategorias && (
                                <div className="categorias-lista">
                                    {categorias.map((categoria) => (
                                        <label key={categoria} className="categoria-opcao">
                                            <input
                                                type="checkbox"
                                                checked={categoriasSelecionadas.includes(categoria)}
                                                onChange={() => alternarCategoria(categoria)}
                                            />
                                            <span>{categoria}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="movimentacoes-lista">
                    {movimentacoesFiltradas.map((movimentacao) => (
                        <article className="card-movimentacao" key={movimentacao.id}>
                            <div className="movimentacao-campo">
                                <span>Ação:</span>
                                <strong className={`movimentacao-acao acao-${movimentacao.tipo}`}>
                                    + {movimentacao.acao}
                                </strong>
                            </div>
                            <div className="movimentacao-campo">
                                <span>Material:</span>
                                <p>{movimentacao.material}</p>
                            </div>
                            <div className="movimentacao-campo">
                                <span>Motivo</span>
                                <p>{movimentacao.motivo}</p>
                            </div>
                            <div className="movimentacao-campo">
                                <span>Data da Movimentação</span>
                                <p>{movimentacao.dataFormatada}</p>
                            </div>
                            <div className="movimentacao-campo">
                                <span>Quantidade:</span>
                                <p>{movimentacao.quantidade}</p>
                            </div>
                            <div className="movimentacao-campo">
                                <span>Fornecedor/Solicitante</span>
                                <p>{movimentacao.responsavel}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default GerenciarMovimentacoes;
