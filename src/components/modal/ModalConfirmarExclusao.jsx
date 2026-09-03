import Modal from "./Modal";
import MainButton from "../forms/MainButton";
import "./ModalConfirmarExclusao.css";

function ModalConfirmarExclusao({ almoxarife, onConfirmar, onCancelar }) {
    return (
        <Modal onFechar={onCancelar}>
            <div className="modal-exclusao-caixa">
                <div className="modal-exclusao-icone">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18A2 2 0 0 0 3.55 21H20.45A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z"
                            stroke="#d9534f"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <p className="modal-exclusao-texto">
                    Você está excluindo o almoxarife{" "}
                    <span className="modal-exclusao-nome">{almoxarife.nome}</span>
                </p>
                <p className="modal-exclusao-subtexto">
                    Tem certeza que deseja prosseguir?
                </p>

                <div className="modal-actions">
                    <MainButton texto="Ok" cor="#0A086B" onClick={onConfirmar} />
                    <MainButton texto="Cancelar" cor="#FF4B09" onClick={onCancelar} />
                </div>
            </div>
        </Modal>
    );
}

export default ModalConfirmarExclusao;