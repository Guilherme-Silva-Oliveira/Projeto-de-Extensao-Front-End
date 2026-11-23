import { useEffect, useMemo, useState } from "react";
import NavBar from "../components/NavBar.jsx";
import { api } from "../provider/api.js";
import "./MapaMateriais.css";

const ITENS_POR_PAGINA = 7;
const LIMITE_TOP_MATERIAIS = 10;

async function carregarTodos(endpoint, signal) {
    const primeiraResposta = await api.get(endpoint, {
        params: { page: 0, size: 100 },
        signal,
    });

    if (Array.isArray(primeiraResposta.data)) {
        return primeiraResposta.data;
    }

    const primeiraPagina = Array.isArray(primeiraResposta.data?.content)
        ? primeiraResposta.data.content
        : [];
    const totalPaginas = Math.max(1, Number(primeiraResposta.data?.totalPages) || 1);
    const paginasRestantes = await Promise.all(
        Array.from({ length: totalPaginas - 1 }, (_, indice) =>
            api.get(endpoint, {
                params: { page: indice + 1, size: 100 },
                signal,
            })
        )
    );

    return [
        ...primeiraPagina,
        ...paginasRestantes.flatMap((resposta) =>
            Array.isArray(resposta.data)
                ? resposta.data
                : Array.isArray(resposta.data?.content)
                    ? resposta.data.content
                    : []
        ),
    ];
}

function normalizarSetor(setor, indice) {
    const nome = String(
        setor.identificadorSetor ?? setor.nomeSetor ?? setor.nome ?? `Setor ${indice + 1}`
    ).trim();
    const almoxarifadoId = setor.almoxarifadoId ?? setor.almoxarifado?.id ?? "";
    const id = setor.id ?? setor.setorId ??
        `${almoxarifadoId}::${nome.toLocaleLowerCase("pt-BR")}`;

    return {
        ...setor,
        id: String(id),
        almoxarifadoId: String(almoxarifadoId),
        nome,
    };
}

function obterNomeSetor(material) {
    const setor = material.setor ?? material.setorEstoque ?? material.estoqueSetor;
    return String(
        setor?.identificadorSetor ??
        setor?.nomeSetor ??
        setor?.nome ??
        (typeof material.setorEstoque === "string" ? material.setorEstoque : undefined) ??
        material.identificadorSetor ??
        material.nomeSetor ??
        ""
    );
}

function obterIdSetor(material) {
    const setor = material.setor ?? material.setorEstoque ?? material.estoqueSetor;
    const id = material.setorId ?? material.idSetor ?? setor?.id ?? setor?.setorId;
    return id == null ? "" : String(id);
}

function obterIdAlmoxarifado(material) {
    const setor = material.setor ?? material.estoqueSetor;
    const id = material.almoxarifadoId ?? material.almoxarifado?.id ??
        setor?.almoxarifadoId ?? setor?.almoxarifado?.id;
    return id == null ? "" : String(id);
}

function normalizarMaterial(material, indice, setoresPorNome, setoresPorId, setoresPorAlmoxarifadoENome) {
    const setorNome = obterNomeSetor(material);
    const setorIdRecebido = obterIdSetor(material);
    const almoxarifadoId = obterIdAlmoxarifado(material);
    const chaveNomeSetor = setorNome.trim().toLocaleLowerCase("pt-BR");
    const setorCorrespondente = setoresPorId.get(setorIdRecebido) ??
        setoresPorAlmoxarifadoENome.get(`${almoxarifadoId}::${chaveNomeSetor}`) ??
        setoresPorNome.get(chaveNomeSetor);

    return {
        ...material,
        chaveMapa: String(material.id ?? `material-${indice}`),
        nome: material.nomeMaterial ?? material.nome ?? "Material sem nome",
        quantidade: Number(material.quantidade) || 0,
        unidade: material.unidadeMedida?.nomeUnidade ?? material.unidadeMedida?.nome ?? "",
        setorId: setorCorrespondente?.id ?? "",
        setorNome: setorNome || setorCorrespondente?.nome || "",
    };
}

function MapaMateriais() {
    const [setores, setSetores] = useState([]);
    const [materiais, setMateriais] = useState([]);
    const [page, setPage] = useState(0);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [tentativa, setTentativa] = useState(0);
    const [setorEmFoco, setSetorEmFoco] = useState("");
    const [materialEmFoco, setMaterialEmFoco] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function carregarDados() {
            setCarregando(true);
            setErro("");

            try {
                const [setoresRecebidos, materiaisRecebidos] = await Promise.all([
                    carregarTodos("/v1/setores", controller.signal),
                    carregarTodos("/v1/materiais", controller.signal),
                ]);
                const setoresNormalizados = setoresRecebidos
                    .map(normalizarSetor)
                    .sort((a, b) =>
                        a.nome.localeCompare(b.nome, "pt-BR", {
                            numeric: true,
                            sensitivity: "base",
                        })
                    );
                const setoresPorNome = new Map(
                    setoresNormalizados.map((setor) => [
                        setor.nome.trim().toLocaleLowerCase("pt-BR"),
                        setor,
                    ])
                );
                const setoresPorId = new Map(
                    setoresNormalizados.map((setor) => [setor.id, setor])
                );
                const setoresPorAlmoxarifadoENome = new Map(
                    setoresNormalizados.map((setor) => [
                        `${setor.almoxarifadoId}::${setor.nome.trim().toLocaleLowerCase("pt-BR")}`,
                        setor,
                    ])
                );

                setSetores(setoresNormalizados);
                setMateriais(
                    materiaisRecebidos.map((material, indice) =>
                        normalizarMaterial(
                            material,
                            indice,
                            setoresPorNome,
                            setoresPorId,
                            setoresPorAlmoxarifadoENome
                        )
                    )
                );
                setPage(0);
            } catch (errorCarregamento) {
                if (controller.signal.aborted) return;
                console.error("Erro ao carregar mapa de materiais:", errorCarregamento);
                setErro("Não foi possível carregar os setores e materiais do estoque.");
            } finally {
                if (!controller.signal.aborted) setCarregando(false);
            }
        }

        carregarDados();
        return () => controller.abort();
    }, [tentativa]);

    const estoquePorSetor = useMemo(() => {
        const estoque = new Map();
        materiais.forEach((material) => {
            if (material.setorId) {
                const atual = estoque.get(material.setorId) ?? {
                    quantidadeMateriais: 0,
                    quantidadeTotal: 0,
                };
                atual.quantidadeMateriais += 1;
                atual.quantidadeTotal += material.quantidade;
                estoque.set(material.setorId, atual);
            }
        });
        return estoque;
    }, [materiais]);
    const maiorQuantidadePorSetor = Math.max(
        0,
        ...Array.from(estoquePorSetor.values(), (estoque) => estoque.quantidadeTotal)
    );

    const topMateriais = useMemo(
        () =>
            [...materiais]
                .sort((a, b) => b.quantidade - a.quantidade)
                .slice(0, LIMITE_TOP_MATERIAIS),
        [materiais]
    );
    const totalPages = Math.max(1, Math.ceil(materiais.length / ITENS_POR_PAGINA));
    const materiaisVisiveis = materiais.slice(
        page * ITENS_POR_PAGINA,
        (page + 1) * ITENS_POR_PAGINA
    );
    const setoresPorColuna = Math.ceil(setores.length / 3);
    const colunasSetores = Array.from({ length: 3 }, (_, indice) =>
        setores.slice(indice * setoresPorColuna, (indice + 1) * setoresPorColuna)
    );

    function focarMaterial(material) {
        setMaterialEmFoco(material.chaveMapa);
        setSetorEmFoco(material.setorId);
    }

    function limparFoco() {
        setSetorEmFoco("");
        setMaterialEmFoco("");
    }

    return (
        <div className="page-container mapa-materiais-page">
            <NavBar mostrarVoltar={true} mostrarLinks={true} />

            <main className="mapa-materiais-container">
                <header className="mapa-materiais-cabecalho">
                    <div>
                        <h1>MAPA DE MATERIAIS</h1>
                        <div className="linha-laranja" />
                    </div>
                    <p>Passe o cursor sobre um setor ou material para ver a relação entre eles.</p>
                </header>

                {erro && (
                    <div className="mapa-materiais-erro" role="alert">
                        <span>{erro}</span>
                        <button type="button" onClick={() => setTentativa((valor) => valor + 1)}>
                            Tentar novamente
                        </button>
                    </div>
                )}

                <div className="mapa-materiais-paineis">
                    <section className="mapa-painel mapa-painel-setores" aria-labelledby="titulo-setores">
                        <div className="mapa-painel-cabecalho">
                            <h2 id="titulo-setores">Setores do estoque</h2>
                            <span>{setores.length} setores</span>
                        </div>
                        <div className="mapa-setores-legenda" aria-label="Escala de quantidade em estoque">
                            <span>Menor</span>
                            <div className="mapa-setores-legenda-barra" aria-hidden="true" />
                            <span>Maior</span>
                        </div>
                        {carregando ? (
                            <p className="mapa-materiais-vazio">Carregando setores...</p>
                        ) : setores.length > 0 ? (
                            <div className="mapa-setores-grade">
                                {colunasSetores.map((coluna, indiceColuna) => (
                                    <div
                                        className="mapa-setor-fileira"
                                        key={`fileira-${indiceColuna}`}
                                        aria-label={`Fileira ${indiceColuna + 1}`}
                                    >
                                        {coluna.map((setor) => {
                                            const ativo = setorEmFoco === setor.id;
                                            const estoque = estoquePorSetor.get(setor.id);
                                            const quantidadeTotal = estoque?.quantidadeTotal ?? 0;
                                            const intensidade = maiorQuantidadePorSetor > 0
                                                ? Math.max(
                                                    1,
                                                    Math.ceil((quantidadeTotal / maiorQuantidadePorSetor) * 4)
                                                )
                                                : 0;
                                            const percentual = maiorQuantidadePorSetor > 0
                                                ? Math.min(
                                                    100,
                                                    (quantidadeTotal / maiorQuantidadePorSetor) * 100
                                                )
                                                : 0;
                                            return (
                                                <button
                                                    type="button"
                                                    key={setor.id}
                                                    className={`mapa-setor mapa-setor-nivel-${intensidade}${ativo ? " mapa-setor-ativo" : ""}`}
                                                    title={`${estoque?.quantidadeMateriais ?? 0} materiais; quantidade somada: ${quantidadeTotal}`}
                                                    onMouseEnter={() => {
                                                        setSetorEmFoco(setor.id);
                                                        setMaterialEmFoco("");
                                                    }}
                                                    onMouseLeave={limparFoco}
                                                    onFocus={() => {
                                                        setSetorEmFoco(setor.id);
                                                        setMaterialEmFoco("");
                                                    }}
                                                    onBlur={limparFoco}
                                                >
                                                    <span className="mapa-setor-nome">{setor.nome}</span>
                                                    <span className="mapa-setor-contagem">
                                                        {estoque?.quantidadeMateriais ?? 0} materiais · {quantidadeTotal} qtd.
                                                    </span>
                                                    <span
                                                        className="mapa-setor-barra"
                                                        role="meter"
                                                        aria-label={`Quantidade total em estoque no ${setor.nome}`}
                                                        aria-valuemin={0}
                                                        aria-valuemax={maiorQuantidadePorSetor || 1}
                                                        aria-valuenow={quantidadeTotal}
                                                    >
                                                        <span style={{ width: `${percentual}%` }} />
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mapa-materiais-vazio">Nenhum setor cadastrado.</p>
                        )}
                    </section>

                    <section className="mapa-painel mapa-painel-lista" aria-labelledby="titulo-lista-materiais">
                        <div className="mapa-painel-cabecalho">
                            <h2 id="titulo-lista-materiais">Materiais</h2>
                            <span>{materiais.length} itens</span>
                        </div>
                        {carregando ? (
                            <p className="mapa-materiais-vazio">Carregando materiais...</p>
                        ) : materiais.length > 0 ? (
                            <div className="mapa-materiais-lista">
                                {materiaisVisiveis.map((material) => {
                                    const ativo = setorEmFoco && material.setorId === setorEmFoco;
                                    const emFoco = materialEmFoco === material.chaveMapa;
                                    return (
                                        <article
                                            className={`mapa-material${ativo ? " mapa-material-setor-ativo" : ""}${emFoco ? " mapa-material-ativo" : ""}`}
                                            key={material.chaveMapa}
                                            onMouseEnter={() => focarMaterial(material)}
                                            onMouseLeave={limparFoco}
                                            onFocus={() => focarMaterial(material)}
                                            onBlur={limparFoco}
                                            tabIndex={0}
                                        >
                                            <div className="mapa-material-info">
                                                <h3>{material.nome}</h3>
                                                <span>{material.setorNome || "Setor não informado"}</span>
                                            </div>
                                            <div className="mapa-material-detalhe">
                                                <strong>{material.quantidade}</strong>
                                                <span>{material.unidade || "un."}</span>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="mapa-materiais-vazio">Nenhum material cadastrado.</p>
                        )}
                        {!carregando && totalPages > 1 && (
                            <nav className="mapa-materiais-paginacao" aria-label="Paginação dos materiais do mapa">
                                <button
                                    type="button"
                                    aria-label="Página anterior"
                                    onClick={() => setPage((pagina) => Math.max(0, pagina - 1))}
                                    disabled={page === 0}
                                >
                                    ‹
                                </button>
                                <span>Página {page + 1} de {totalPages}</span>
                                <button
                                    type="button"
                                    aria-label="Próxima página"
                                    onClick={() =>
                                        setPage((pagina) => Math.min(totalPages - 1, pagina + 1))
                                    }
                                    disabled={page >= totalPages - 1}
                                >
                                    ›
                                </button>
                            </nav>
                        )}
                    </section>

                    <section className="mapa-painel mapa-painel-top" aria-labelledby="titulo-top-materiais">
                        <div className="mapa-painel-cabecalho">
                            <h2 id="titulo-top-materiais">Top 10 em estoque</h2>
                            <span>maiores quantidades</span>
                        </div>
                        {carregando ? (
                            <p className="mapa-materiais-vazio">Carregando ranking...</p>
                        ) : topMateriais.length > 0 ? (
                            <ol className="mapa-top-lista">
                                {topMateriais.map((material, indice) => (
                                    <li key={material.chaveMapa}>
                                        <span className="mapa-top-posicao">{indice + 1}</span>
                                        <div className="mapa-top-info">
                                            <strong>{material.nome}</strong>
                                            <span>{material.setorNome || "Setor não informado"}</span>
                                        </div>
                                        <span className="mapa-top-quantidade">
                                            {material.quantidade} <small>{material.unidade || "un."}</small>
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        ) : (
                            <p className="mapa-materiais-vazio">Nenhum material para exibir.</p>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

export default MapaMateriais;
