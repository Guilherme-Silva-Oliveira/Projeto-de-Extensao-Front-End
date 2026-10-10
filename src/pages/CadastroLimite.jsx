import "./CadastroProfessor.css";
import "../components/SelectForm.css";
import NavBar from "../components/NavBar.jsx";
import InputForm from "../components/InputForm.jsx";
import MainButton from "../components/MainButton.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../provider/api.js";

function CadastroLimite() {
    const navigate = useNavigate();

    const [descLimite, setDescLimite] = useState("");
    const [limite, setLimite] = useState("");
    const [materiais, setMateriais] = useState([]);
    const [idMaterial, setIdMaterial] = useState("");
    const [carregandoMateriais, setCarregandoMateriais] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        async function carregarMateriais() {
            try {
                setCarregandoMateriais(true);
                setErroCarregamento("");

                const primeiraResposta = await api.get("/v1/materiais", {
                    params: { page: 0, size: 100 },
                });
                const primeiraPagina = Array.isArray(primeiraResposta.data)
                    ? primeiraResposta.data
                    : Array.isArray(primeiraResposta.data?.content)
                        ? primeiraResposta.data.content
                        : [];
                const totalPaginas = Array.isArray(primeiraResposta.data)
                    ? 1
                    : Math.max(1, primeiraResposta.data?.totalPages ?? 1);
                const paginasRestantes = await Promise.all(
                    Array.from({ length: totalPaginas - 1 }, (_, indice) =>
                        api.get("/v1/materiais", {
                            params: { page: indice + 1, size: 100 },
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
                ];

                setMateriais(materiaisRecebidos);
            } catch (error) {
                console.error("Erro ao buscar materiais para o limite:", error);
                setErroCarregamento(
                    "Não foi possível carregar os materiais. Verifique a conexão com o servidor e tente novamente."
                );
            } finally {
                setCarregandoMateriais(false);
            }
        }

        carregarMateriais();
    }, []);

    async function handleCadastrar() {
        const descricaoNormalizada = descLimite.trim();
        const valorLimite = Number(limite);
        const materialId = Number(idMaterial);

        if (!descricaoNormalizada) {
            setMensagem("Informe a descrição do limite.");
            return;
        }

        if (limite === "" || !Number.isFinite(valorLimite)) {
            setMensagem("Informe um valor válido para o limite.");
            return;
        }

        if (!materialId) {
            setMensagem("Selecione um material para associar ao limite.");
            return;
        }

        if (materiais.length === 0) {
            setMensagem("Cadastre um material antes de criar um limite.");
            return;
        }

        try {
            setEnviando(true);
            setMensagem("");

            await api.post("/v1/limites", {
                descLimite: descricaoNormalizada,
                limite: valorLimite,
                idMaterial: materialId,
            });

            navigate("/gerenciamentos/limites");
        } catch (error) {
            console.error("Erro ao cadastrar limite:", error);
            if (error.response?.status === 401) {
                setMensagem("Sessão expirada ou não autenticada. Faça login novamente.");
            } else if (error.response?.data?.message) {
                setMensagem(error.response.data.message);
            } else {
                setMensagem("Não foi possível cadastrar o limite. Verifique os dados e tente novamente.");
            }
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="page-container">
            <NavBar mostrarLinks={true} mostrarVoltar={true} />
                
            <main className="cadastro-container">
                <h1 className="titulo-cadastro">CADASTRO DE LIMITE</h1>
                <div className="linha-laranja"></div>

                <div className="cadastro-form">

                    <div className="cadastro-field">
                        <InputForm
                            titulo="Descrição do limite"
                            placeholder="Limite mínimo"
                            type="text"
                            value={descLimite}
                            onChange={(e) => setDescLimite(e.target.value)}
                            required
                        />
                    </div>

                    <div className="cadastro-field">
                        <InputForm
                            titulo="Valor do limite"
                            placeholder="10.0"
                            type="number"
                            value={limite}
                            onChange={(e) => setLimite(e.target.value)}
                            required
                        />
                    </div>

                    <div className="cadastro-field select-container">
                        <label className="select-label" htmlFor="material-limite">
                            Material
                        </label>
                        <div className="select-wrapper">
                            <select
                                id="material-limite"
                                className="select-form"
                                value={idMaterial}
                                onChange={(e) => setIdMaterial(e.target.value)}
                                disabled={carregandoMateriais || materiais.length === 0}
                                required
                            >
                                <option value="">
                                    {carregandoMateriais
                                        ? "Carregando materiais..."
                                        : materiais.length === 0
                                            ? "Nenhum material disponível"
                                            : "Selecione um material"}
                                </option>
                                {materiais.map((material) => (
                                    <option key={material.id} value={material.id}>
                                        {material.nomeMaterial ?? material.nome ?? `Material ${material.id}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {(erroCarregamento || mensagem) && (
                        <p
                            role="alert"
                            style={{
                                color: "#d9534f",
                                fontSize: "14px",
                                margin: "-5px 0 0",
                                fontFamily: "'Inter', sans-serif",
                                textAlign: "center",
                            }}
                        >
                            {erroCarregamento || mensagem}
                        </p>
                    )}

                    <div className="cadastro-actions">
                        <MainButton
                            texto={enviando ? "Cadastrando..." : "Cadastrar"}
                            cor="#0A086B"
                            disabled={enviando || carregandoMateriais || materiais.length === 0}
                            onClick={handleCadastrar}
                        />
                        <MainButton
                            texto="Cancelar"
                            cor="#FF4B09"
                            disabled={enviando}
                            onClick={() => navigate(-1)}
                        />
                    </div>

                </div>
            </main>
        </div>
    );
}

export default CadastroLimite;