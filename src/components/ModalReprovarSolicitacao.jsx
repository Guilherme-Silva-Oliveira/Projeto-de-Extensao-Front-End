import Modal from "./Modal";
import MainButton from "./MainButton";
import { useState } from "react";
import "./ModalReprovarSolicitacao.css";

const LIMITE_MOTIVO = 500;

function ModalReprovarSolicitacao({ solicitante, onConfirmar, onCancelar }) {
    const [motivo, setMotivo] = useState("");
    const [erro, setErro] = useState("");
    const [salvando, setSalvando] = useState(false);

    async function handleConfirmar() {
        if (salvando) return;

        const motivoLimpo = motivo.trim();
        if (!motivoLimpo) {
            setErro("Informe o motivo da reprovação.");
            return;
        }

        setErro("");
        setSalvando(true);
        try {
            // o componente pai fecha o modal quando der certo
            await onConfirmar(motivoLimpo);
        } catch (error) {
            console.error("Erro ao reprovar solicitação:", error);
            setErro("Não foi possível reprovar a solicitação. Tente novamente.");
            setSalvando(false);
        }
    }

    return (
        <Modal titulo="Reprovar Solicitação" onFechar={onCancelar}>
            <div className="modal-corpo">
                <p className="modal-reprovar-texto">
                    Você está reprovando a solicitação do professor{" "}
                    <span className="modal-reprovar-nome">{solicitante}</span>.
                    Essa ação não pode ser desfeita.
                </p>

                <div className="modal-reprovar-campo">
                    <label htmlFor="motivo-reprovacao" className="modal-reprovar-label">
                        Motivo da reprovação:
                    </label>
                    <textarea
                        id="motivo-reprovacao"
                        className="modal-reprovar-textarea"
                        placeholder="Explique por que a solicitação foi reprovada"
                        maxLength={LIMITE_MOTIVO}
                        rows={4}
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                    />
                    <span className="modal-reprovar-contador">
                        {motivo.length}/{LIMITE_MOTIVO}
                    </span>
                </div>

                {erro && <p className="modal-erro">{erro}</p>}

                <div className="modal-actions">
                    <MainButton texto="Reprovar" cor="#0A086B" onClick={handleConfirmar} />
                    <MainButton texto="Cancelar" cor="#FF4B09" onClick={onCancelar} />
                </div>
            </div>
        </Modal>
    );
}

export default ModalReprovarSolicitacao;
