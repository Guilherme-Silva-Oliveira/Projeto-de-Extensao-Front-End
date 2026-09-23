// import "./GerenciarDevolucoes.css";
// import NavBar from "../components/NavBar";
// import CardDevolucao from "../components/CardDevolucao";
// import ModalDevolucao from "../components/ModalDevolucao";
// import { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { api } from "../provider/api.js";

// function GerenciarDevolucoes() {
//     const navigate = useNavigate();

//     const [solicitacoes, setSolicitacoes] = useState([]);
//     const [carregando, setCarregando] = useState(true);

//     const [busca, setBusca] = useState("");
//     const [filtroData, setFiltroData] = useState("");
//     const [mostrarFiltroData, setMostrarFiltroData] = useState(false);

//     // guarda a solicitação que está sendo devolvida no momento
//     const [solicitacaoEmDevolucao, setSolicitacaoEmDevolucao] = useState(null);

//     useEffect(() => {
//         buscarDevolucoes();
//     }, []);

//     async function buscarDevolucoes() {
//         try {
//             setCarregando(true);
//             const response = await api.get("/v1/devolucoes");
//             setSolicitacoes(response.data);
//         } catch (error) {
//             console.error("Erro ao buscar devoluções:", error);
//         } finally {
//             setCarregando(false);
//         }
//     }

//     function abrirModalDevolucao(solicitacao) {
//         setSolicitacaoEmDevolucao(solicitacao);
//     }

//     function fecharModal() {
//         setSolicitacaoEmDevolucao(null);
//     }

//     // Registra a devolução de UM material de UMA solicitação.
//     // Ao confirmar no backend, o material devolvido some do card e,
//     // se não sobrar nenhum material pendente, o card inteiro some da tela.
//     async function confirmarDevolucao(solicitacaoId, nomeMaterial, quantidade) {
//         await api.post(`/v1/devolucoes/${solicitacaoId}/registrar`, {
//             material: nomeMaterial,
//             quantidade: Number(quantidade),
//         });

//         setSolicitacoes((prev) =>
//             prev
//                 .map((s) => {
//                     if (s.id !== solicitacaoId) return s;
//                     const materiaisRestantes = s.materiais.filter(
//                         (m) => m.nome.toLowerCase() !== nomeMaterial.toLowerCase()
//                     );
//                     return { ...s, materiais: materiaisRestantes };
//                 })
//                 .filter((s) => s.materiais.length > 0)
//         );

//         fecharModal();
//     }

//     // Encerra a solicitação inteira (independente de sobrar material) e a remove da tela
//     async function encerrarSolicitacao(solicitacaoId) {
//         await api.put(`/v1/devolucoes/${solicitacaoId}/encerrar`);
//         setSolicitacoes((prev) => prev.filter((s) => s.id !== solicitacaoId));
//     }

//     const solicitacoesFiltradas = solicitacoes.filter((s) => {
//         const nomeCombina = s.solicitante
//             .toLowerCase()
//             .includes(busca.toLowerCase());
//         const dataCombina = !filtroData || (s.dataEntrega || "").startsWith(filtroData);
//         return nomeCombina && dataCombina;
//     });

//     return (
//         <div className="page-container">
//             <NavBar mostrarVoltar={true} onVoltar={() => navigate(-1)} />

//             <main className="devolucoes-container">
//                 <div className="devolucoes-breadcrumb">
//                     <Link to="/dashboard">Menu de opções</Link>
//                     <span> &gt; </span>
//                     <span>Gerenciar Devoluções</span>
//                 </div>

//                 <div className="devolucoes-topo">
//                     <div className="devolucoes-titulo-area">
//                         <h1 className="titulo-devolucoes">DEVOLUÇÕES</h1>
//                         <div className="linha-laranja"></div>
//                     </div>

//                     <div className="devolucoes-filtros">
//                         <div className="filtro-data-wrapper">
//                             <button
//                                 type="button"
//                                 className="filtro-data-btn"
//                                 onClick={() => setMostrarFiltroData((v) => !v)}
//                             >
//                                 Filtrar por Data
//                             </button>
//                             {mostrarFiltroData && (
//                                 <input
//                                     type="date"
//                                     onChange={(e) => setFiltroData(e.target.value)}
//                                 />
//                             )}
//                         </div>

//                             <label className="busca-label">Buscar</label>
//                                 <input
//                                     type="text"
//                                     className="busca-input"
//                                     placeholder="Nome do solicitante"
//                                     value={busca}
//                                     onChange={(e) => setBusca(e.target.value)}
//                                 />
//                                 <span className="busca-icone">🔍</span>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="devolucoes-tabs">
//                         <button type="button" className="tab-btn tab-ativa">
//                             Gerenciar Devoluções
//                         </button>
//                         <button
//                             type="button"
//                             className="tab-btn"
//                             onClick={() => navigate("/gerenciar-solicitacoes")}
//                         >
//                             Gerenciar Solicitações
//                         </button>
//                     </div>
//                 </div>

//                 <div className="devolucoes-lista">
//                     {carregando && (
//                         <p className="devolucoes-status">Carregando devoluções...</p>
//                     )}

//                     {!carregando && solicitacoesFiltradas.length === 0 && (
//                         <p className="devolucoes-status">Nenhuma devolução encontrada.</p>
//                     )}

//                     {!carregando &&
//                         solicitacoesFiltradas.map((solicitacao) => (
//                             <CardDevolucao
//                                 key={solicitacao.id}
//                                 solicitacao={solicitacao}
//                                 onDevolver={() => abrirModalDevolucao(solicitacao)}
//                                 onEncerrar={() => encerrarSolicitacao(solicitacao.id)}
//                             />
//                         ))}
//                 </div>
//             </main>

//             {solicitacaoEmDevolucao && (
//                 <ModalDevolucao
//                     solicitacao={solicitacaoEmDevolucao}
//                     onClose={fecharModal}
//                     onConfirmar={(nomeMaterial, quantidade) =>
//                         confirmarDevolucao(
//                             solicitacaoEmDevolucao.id,
//                             nomeMaterial,
//                             quantidade
//                         )
//                     }
//                 />
//             )}
//         </div>
//     );
// }

// export default GerenciarDevolucoes;


import "./GerenciarDevolucoes.css";
import NavBar from "../components/NavBar";
import CardDevolucao from "../components/CardDevolucao";
import ModalDevolucao from "../components/ModalDevolucao";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../provider/api.js";
import lupaIcon from "../assets/lupa.png";

function normalizarMateriais(materiais, solicitacaoId, catalogoMateriais = []) {
    if (!Array.isArray(materiais)) return [];

    return materiais.map((material, index) => {
        const materialRelacionado = material.material;
        const nomeMaterial =
            materialRelacionado?.nomeMaterial ??
            materialRelacionado?.nome ??
            material.nomeMaterial ??
            material.nome ??
            (typeof materialRelacionado === "string" ? materialRelacionado : "");
        const nomeNormalizado = nomeMaterial.trim().toLowerCase();
        const materialDoCatalogo = catalogoMateriais.find(
            (item) => {
                const nomeCatalogo = String(
                    item.nomeMaterial ?? item.nome ?? ""
                )
                    .trim()
                    .toLowerCase();
                return nomeCatalogo === nomeNormalizado;
            }
        );
        const materialId =
            material.materialId ??
            material.idMaterial ??
            material.idMaterialSolicitado ??
            (typeof materialRelacionado === "object"
                ? materialRelacionado?.id
                : Number.isInteger(Number(materialRelacionado)
                    ? Number(materialRelacionado)
                    : null)) ??
            (Number.isInteger(Number(material.id)) ? Number(material.id) : null) ??
            materialDoCatalogo?.id;

        return {
            ...material,
            id: `${solicitacaoId}-${index}`,
            materialId,
            nome: nomeMaterial || materialDoCatalogo?.nomeMaterial || "--",
            codigo:
                material.codigo ??
                material.codigoBarras ??
                materialDoCatalogo?.codigo ??
                materialDoCatalogo?.codigoBarras ??
                "",
            quantidadeDevolvida: null,
        };
    });
}

function GerenciarDevolucoes() {
    const navigate = useNavigate();

    const [solicitacoes, setSolicitacoes] = useState([]);
    const [catalogoMateriais, setCatalogoMateriais] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const [busca, setBusca] = useState("");
    const [filtroData, setFiltroData] = useState("");
    const [mostrarFiltroData, setMostrarFiltroData] = useState(false);

    // guarda a solicitação (com seus materiais) que está sendo devolvida no momento
    const [solicitacaoEmDevolucao, setSolicitacaoEmDevolucao] = useState(null);

    useEffect(() => {
        async function carregarDevolucoes() {
            try {
                setCarregando(true);
                const response = await api.get("/v1/solicitacoes/devolucoes");
                const alertas = Array.isArray(response.data) ? response.data : [];
                let catalogoMateriais = [];

                try {
                    const materiaisResponse = await api.get("/v1/materiais");
                    catalogoMateriais = Array.isArray(materiaisResponse.data)
                        ? materiaisResponse.data
                        : Array.isArray(materiaisResponse.data?.content)
                            ? materiaisResponse.data.content
                            : [];
                    setCatalogoMateriais(catalogoMateriais);
                } catch (error) {
                    console.error("Erro ao buscar catálogo de materiais:", error);
                }

                const solicitacoesComMateriais = await Promise.all(
                    alertas.map(async (alerta) => {
                        const solicitacaoId = alerta.solicitacao;

                        try {
                            const materiaisResponse = await api.get(
                                `/v1/solicitacoes/materiais/${solicitacaoId}`
                            );

                            return {
                                id: solicitacaoId,
                                solicitante: `Solicitação #${solicitacaoId}`,
                                dataEntrega: "--",
                                dataEncerramento: "--",
                                motivo: "--",
                                materiais: normalizarMateriais(
                                    materiaisResponse.data,
                                    solicitacaoId,
                                    catalogoMateriais
                                ),
                            };
                        } catch (error) {
                            console.error(
                                `Erro ao buscar materiais da solicitação ${solicitacaoId}:`,
                                error
                            );
                            return {
                                id: solicitacaoId,
                                solicitante: `Solicitação #${solicitacaoId}`,
                                dataEntrega: "--",
                                dataEncerramento: "--",
                                motivo: "--",
                                materiais: [],
                            };
                        }
                    })
                );

                setSolicitacoes(solicitacoesComMateriais);
            } catch (error) {
                console.error("Erro ao buscar devoluções:", error);
            } finally {
                setCarregando(false);
            }
        }

        carregarDevolucoes();
    }, []);

    function abrirModalDevolucao(solicitacao) {
        setSolicitacaoEmDevolucao(solicitacao);
    }

    function fecharModal() {
        setSolicitacaoEmDevolucao(null);
    }

    async function confirmarDevolucao(solicitacaoId, itensDevolucao) {
        const solicitacao = solicitacoes.find((item) => item.id === solicitacaoId);

        if (!solicitacao || !Array.isArray(itensDevolucao) || itensDevolucao.length === 0) {
            throw new Error("Dados da devolução inválidos.");
        }

        await Promise.all(
            itensDevolucao.map((itemDevolucao) => {
                const material = solicitacao?.materiais.find(
                    (item) =>
                        String(item.materialId) === String(itemDevolucao.materialId) ||
                        item.nome?.trim().toLowerCase() ===
                            itemDevolucao.materialNome?.trim().toLowerCase()
                );
                const materialDoCatalogo = catalogoMateriais.find(
                    (item) =>
                        String(item.id) === String(itemDevolucao.materialId) ||
                        String(item.nomeMaterial ?? item.nome ?? "")
                            .trim()
                            .toLowerCase() ===
                            itemDevolucao.materialNome?.trim().toLowerCase()
                );
                const materialIdInformado = Number(itemDevolucao.materialId);
                const materialId = Number.isInteger(materialIdInformado) && materialIdInformado > 0
                    ? materialIdInformado
                    : Number(materialDoCatalogo?.id ?? material?.materialId);
                const quantidade = Number(itemDevolucao.quantidade);

                if (!Number.isInteger(materialId) || materialId <= 0) {
                    throw new Error("Material sem ID válido.");
                }
                if (!Number.isInteger(quantidade) || quantidade <= 0) {
                    throw new Error("Quantidade inválida.");
                }

                return api.post("/v1/entradas", {
                    fornecedorId: 1,
                    materialId,
                    quantidade,
                    dataEntrada: new Date().toISOString().slice(0, 19),
                    isDevolucao: true,
                });
            })
        );

        await api.post(
            `/v1/solicitacoes/atualizarStatus/${solicitacaoId}/7`
        );

        setSolicitacoes((prev) =>
            prev.filter((item) => item.id !== solicitacaoId)
        );

        fecharModal();
    }

    // Encerra a solicitação inteira (independente de sobrar material) e a remove da tela
    async function encerrarSolicitacao(solicitacaoId) {
        // MOCK: comentar a chamada de api enquanto não há backend
        // await api.put(`/v1/devolucoes/${solicitacaoId}/encerrar`);

        setSolicitacoes((prev) => prev.filter((s) => s.id !== solicitacaoId));
    }

    const solicitacoesFiltradas = solicitacoes.filter((s) => {
        const nomeCombina = s.solicitante
            .toLowerCase()
            .includes(busca.toLowerCase());
        const dataCombina = !filtroData || (s.dataEntrega || "").startsWith(filtroData);
        return nomeCombina && dataCombina;
    });

    return (
        <div className="page-container">
            <NavBar mostrarVoltar={true} mostrarLinks={true} />

            <main className="devolucoes-container">
                <div className="devolucoes-breadcrumb">
                    <Link to="/dashboard">Menu de opções</Link>
                    <span> &gt; </span>
                    <span>Gerenciar Devoluções</span>
                </div>

                <div className="devolucoes-topo">
                    <div className="devolucoes-titulo-area">
                        <h1 className="titulo-devolucoes">DEVOLUÇÕES</h1>
                        <div className="linha-laranja"></div>
                    </div>

                    <div className="devolucoes-filtros">
                        <div className="filtro-data-wrapper">
                            <button
                                type="button"
                                className="filtro-data-btn"
                                onClick={() => setMostrarFiltroData((v) => !v)}
                            >
                                Filtrar por Data
                            </button>
                            {mostrarFiltroData && (
                                <input
                                    type="date"
                                    className="filtro-data-input"
                                    value={filtroData}
                                    onChange={(e) => setFiltroData(e.target.value)}
                                />
                            )}
                        </div>

                        <div className="busca-wrapper">
                            <label className="busca-label">Buscar</label>
                            <div className="busca-input-wrapper">
                                <input
                                    type="text"
                                    className="busca-input"
                                    placeholder="Nome do solicitante"
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                />
                                <img src={lupaIcon} alt="Buscar" className="busca-icone" />
                            </div>
                        </div>
                    </div>

                    <div className="devolucoes-tabs">
                        <div className="devolucoes-tabs-grupo">
                            <button type="button" className="tab-btn tab-ativa">
                                Gerenciar Devoluções
                            </button>
                            <button
                                type="button"
                                className="tab-btn"
                                onClick={() => navigate("/gerenciar-solicitacoes")}
                            >
                                Gerenciar Solicitações
                            </button>
                        </div>

                        <button
                            type="button"
                            className="tab-btn tab-reprovadas"
                            onClick={() => navigate("/gerenciar-solicitacoes-reprovadas")}
                        >
                            Solicitações Reprovadas
                        </button>
                    </div>
                </div>

                <div className="devolucoes-lista">
                    {carregando && (
                        <p className="devolucoes-status">Carregando devoluções...</p>
                    )}

                    {!carregando && solicitacoesFiltradas.length === 0 && (
                        <p className="devolucoes-status">Nenhuma devolução encontrada.</p>
                    )}

                    {!carregando &&
                        solicitacoesFiltradas.map((solicitacao) => (
                            <CardDevolucao
                                key={solicitacao.id}
                                solicitacao={solicitacao}
                                onDevolver={() => abrirModalDevolucao(solicitacao)}
                                onEncerrar={() => encerrarSolicitacao(solicitacao.id)}
                            />
                        ))}
                </div>
            </main>

            {solicitacaoEmDevolucao && (
                <ModalDevolucao
                    solicitacao={solicitacaoEmDevolucao}
                    onClose={fecharModal}
                    onConfirmar={(itensDevolucao) =>
                        confirmarDevolucao(
                            solicitacaoEmDevolucao.id,
                            itensDevolucao
                        )
                    }
                />
            )}
        </div>
    );
}

export default GerenciarDevolucoes;
