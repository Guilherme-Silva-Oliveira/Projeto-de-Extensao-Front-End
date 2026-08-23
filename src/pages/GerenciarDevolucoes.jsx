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
//                                     className="filtro-data-input"
//                                     value={filtroData}
//                                     onChange={(e) => setFiltroData(e.target.value)}
//                                 />
//                             )}
//                         </div>

//                         <div className="busca-wrapper">
//                             <label className="busca-label">Buscar</label>
//                             <div className="busca-input-wrapper">
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

// ---- MOCK TEMPORÁRIO PARA TESTAR A TELA SEM BACKEND ----
// Quando a API estiver pronta, é só remover isso e voltar a usar buscarDevolucoes()
function gerarSolicitacoesMock() {
    const materiaisPadrao = () => [
        { id: 1, nome: "Cartolina Azul", quantidadeSolicitada: 50, quantidadeDevolvida: null },
        { id: 2, nome: "Cartolina Azul", quantidadeSolicitada: 50, quantidadeDevolvida: null },
        { id: 3, nome: "Cartolina Azul", quantidadeSolicitada: 50, quantidadeDevolvida: null },
        { id: 4, nome: "Cartolina Azul", quantidadeSolicitada: 50, quantidadeDevolvida: null },
    ];

    return Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        solicitante: "Rogério Silva",
        dataEntrega: "08/05/2026 - 13h30",
        dataEncerramento: "15/05/2026 - 13h30",
        motivo: "Atividade Avaliativa",
        materiais: materiaisPadrao(),
    }));
}
// ---------------------------------------------------------

function GerenciarDevolucoes() {
    const navigate = useNavigate();

    const [solicitacoes, setSolicitacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const [busca, setBusca] = useState("");
    const [filtroData, setFiltroData] = useState("");
    const [mostrarFiltroData, setMostrarFiltroData] = useState(false);

    // guarda a solicitação (com seus materiais) que está sendo devolvida no momento
    const [solicitacaoEmDevolucao, setSolicitacaoEmDevolucao] = useState(null);

    useEffect(() => {
        // buscarDevolucoes(); // <- descomentar quando a API tiver integrada

        //simula um carregamento e popula a lista
        setCarregando(true);
        setTimeout(() => {
            setSolicitacoes(gerarSolicitacoesMock());
            setCarregando(false);
        }, 300);
    }, []);

    async function buscarDevolucoes() {
        try {
            setCarregando(true);
            const response = await api.get("/v1/devolucoes");
            setSolicitacoes(response.data);
        } catch (error) {
            console.error("Erro ao buscar devoluções:", error);
        } finally {
            setCarregando(false);
        }
    }

    function abrirModalDevolucao(solicitacao) {
        setSolicitacaoEmDevolucao(solicitacao);
    }

    function fecharModal() {
        setSolicitacaoEmDevolucao(null);
    }

    // Registra a devolução de UM material de UMA solicitação.
    // Ao confirmar no backend, o material devolvido some do card e,
    // se não sobrar nenhum material pendente, o card inteiro some da tela.
    async function confirmarDevolucao(solicitacaoId, nomeMaterial, quantidade) {
        // MOCK: comentar a chamada de api enquanto não há backend
        // await api.post(`/v1/devolucoes/${solicitacaoId}/registrar`, {
        //     material: nomeMaterial,
        //     quantidade: Number(quantidade),
        // });

        setSolicitacoes((prev) =>
            prev
                .map((s) => {
                    if (s.id !== solicitacaoId) return s;
                    const materiaisRestantes = s.materiais.filter(
                        (m) => m.nome.toLowerCase() !== nomeMaterial.toLowerCase()
                    );
                    return { ...s, materiais: materiaisRestantes };
                })
                .filter((s) => s.materiais.length > 0)
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
                    onConfirmar={(nomeMaterial, quantidade) =>
                        confirmarDevolucao(
                            solicitacaoEmDevolucao.id,
                            nomeMaterial,
                            quantidade
                        )
                    }
                />
            )}
        </div>
    );
}

export default GerenciarDevolucoes;