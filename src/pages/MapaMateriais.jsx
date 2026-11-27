import { useEffect, useMemo, useState } from "react";
import NavBar from "../components/NavBar.jsx";
import { api } from "../provider/api.js";
import "./MapaMateriais.css";

const ITENS_POR_PAGINA = 8;
const AREAS_PLANTA = [
    { id: "itens-pequenos", nome: "Itens Pequenos", aliases: ["itens pequenos", "item pequeno"] },
    { id: "festas", nome: "Festas", aliases: ["festas", "festa"] },
    { id: "tecidos", nome: "Tecidos", aliases: ["tecidos", "tecido"] },
    {
        id: "papeis-cartolinas",
        nome: "Papéis e Cartolinas",
        aliases: ["papeis e cartolinas", "papel e cartolina"],
    },
    { id: "tintas", nome: "Tintas", aliases: ["tintas", "tinta"] },
    { id: "papeis", nome: "Papéis", aliases: ["papeis", "papel"] },
    {
        id: "cartazes-barbantes",
        nome: "Cartazes e Barbantes",
        aliases: ["cartazes e barbantes", "cartaz e barbante"],
    },
    {
        id: "cestas-fitas",
        nome: "Cestas e Fitas",
        aliases: ["cestas e fitas", "cesta e fita"],
    },
    { id: "outros", nome: "Outros", aliases: ["outros", "outro"] },
];

function normalizarNomeChave(nome) {
    return String(nome)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

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
    const [setorSelecionado, setSetorSelecionado] = useState("");
    const [buscaMaterial, setBuscaMaterial] = useState("");
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
    const setoresPorArea = useMemo(() => {
        return new Map(
            AREAS_PLANTA.map((area) => [
                area.id,
                setores.filter((setor) =>
                    area.aliases.includes(normalizarNomeChave(setor.nome))
                ),
            ])
        );
    }, [setores]);
    const idsSetoresPosicionados = new Set(
        Array.from(setoresPorArea.values()).flat().map((setor) => setor.id)
    );
    const setorSelecionadoSemPosicao = setores.find(
        (setor) => setor.id === setorSelecionado && !idsSetoresPosicionados.has(setor.id)
    );
    const buscaNormalizada = normalizarNomeChave(buscaMaterial);
    const materiaisFiltrados = useMemo(
        () =>
            materiais
                .filter((material) =>
                    (!setorSelecionado || material.setorId === setorSelecionado) &&
                    normalizarNomeChave(material.nome).includes(buscaNormalizada)
                )
                .sort((a, b) => b.quantidade - a.quantidade),
        [materiais, setorSelecionado, buscaNormalizada]
    );
    const totalPages = Math.max(1, Math.ceil(materiaisFiltrados.length / ITENS_POR_PAGINA));
    const materiaisVisiveis = materiaisFiltrados.slice(
        page * ITENS_POR_PAGINA,
        (page + 1) * ITENS_POR_PAGINA
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
                    <section className="mapa-painel mapa-painel-planta" aria-labelledby="titulo-setores">
                        <div className="mapa-painel-cabecalho">
                            <h2 id="titulo-setores">Planta do almoxarifado</h2>
                            <span>{setores.length} setores</span>
                        </div>
                        {carregando ? (
                            <p className="mapa-materiais-vazio">Carregando setores...</p>
                        ) : setores.length > 0 ? (
                            <>
                                <div className="mapa-planta-controles">
                                    <div className="mapa-setores-legenda" aria-label="Escala de quantidade em estoque">
                                        <span>Menor</span>
                                        <div className="mapa-setores-legenda-barra" aria-hidden="true" />
                                        <span>Maior</span>
                                    </div>
                                    <label className="mapa-planta-select-label" htmlFor="mapa-filtro-setor">
                                        Selecionar setor
                                        <select
                                            id="mapa-filtro-setor"
                                            value={setorSelecionado}
                                            onChange={(event) => {
                                                setSetorSelecionado(event.target.value);
                                                setSetorEmFoco("");
                                                setMaterialEmFoco("");
                                                setPage(0);
                                            }}
                                        >
                                            <option value="">Todos os setores</option>
                                            {setores.map((setor) => (
                                                <option key={setor.id} value={setor.id}>
                                                    {setor.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                                <div className="mapa-planta-grade-viewport">
                                    <div
                                        className="mapa-planta-grade"
                                        aria-label="Planta dos setores do almoxarifado"
                                    >
                                        <div className="mapa-planta-comodo mapa-planta-entrada">
                                            <span>Entrada</span>
                                        </div>
                                        {AREAS_PLANTA.map((area) => {
                                            const setoresDaArea = area.id === "outros" && setorSelecionadoSemPosicao
                                                ? [setorSelecionadoSemPosicao]
                                                : setoresPorArea.get(area.id) ?? [];
                                            return (
                                                <div
                                                    className={`mapa-planta-comodo mapa-planta-${area.id}`}
                                                    key={area.id}
                                                >
                                                    {setoresDaArea.length > 0 ? (
                                                        setoresDaArea.map((setor) => {
                                                            const ativo =
                                                                setorEmFoco === setor.id ||
                                                                setorSelecionado === setor.id;
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
                                                                    className={`mapa-planta-setor mapa-setor-nivel-${intensidade}${ativo ? " mapa-setor-ativo" : ""}`}
                                                                    title={`${estoque?.quantidadeMateriais ?? 0} materiais; quantidade somada: ${quantidadeTotal}`}
                                                                    aria-pressed={setorSelecionado === setor.id}
                                                                    onClick={() => {
                                                                        setSetorSelecionado((atual) =>
                                                                            atual === setor.id ? "" : setor.id
                                                                        );
                                                                        setMaterialEmFoco("");
                                                                        setPage(0);
                                                                    }}
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
                                                        })
                                                    ) : (
                                                        <span className="mapa-planta-setor-vazio">{area.nome}</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p className="mapa-materiais-vazio">Nenhum setor cadastrado.</p>
                        )}
                    </section>

                    <section className="mapa-painel mapa-painel-lista" aria-labelledby="titulo-lista-materiais">
                        <div className="mapa-painel-cabecalho">
                            <h2 id="titulo-lista-materiais">Materiais</h2>
                            <label className="mapa-busca-material">
                                <input
                                    type="search"
                                    aria-label="Pesquisar material pelo nome"
                                    placeholder="Pesquisar material"
                                    value={buscaMaterial}
                                    onChange={(event) => {
                                        setBuscaMaterial(event.target.value);
                                        setPage(0);
                                    }}
                                />
                            </label>
                            <span>
                                {materiaisFiltrados.length}
                                {setorSelecionado ? " itens no setor" : " itens"}
                            </span>
                        </div>
                        {carregando ? (
                            <p className="mapa-materiais-vazio">Carregando materiais...</p>
                        ) : materiaisFiltrados.length > 0 ? (
                            <div className="mapa-materiais-lista">
                                {materiaisVisiveis.map((material) => {
                                    const setorAtivo = setorEmFoco || setorSelecionado;
                                    const ativo = setorAtivo && material.setorId === setorAtivo;
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
                            <p className="mapa-materiais-vazio">
                                {buscaMaterial.trim()
                                    ? "Nenhum material encontrado."
                                    : setorSelecionado
                                        ? "Nenhum material cadastrado neste setor."
                                        : "Nenhum material cadastrado."}
                            </p>
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

                </div>
            </main>
        </div>
    );
}

export default MapaMateriais;
