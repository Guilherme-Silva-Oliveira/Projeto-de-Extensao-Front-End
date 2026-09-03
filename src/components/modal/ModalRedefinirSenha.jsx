import Modal from "./Modal";
import InputForm from "../forms/InputForm";
import MainButton from "../forms/MainButton";
import { useState } from "react";

function ModalRedefinirSenha({ almoxarife, onSalvar, onCancelar }) {
    const [senhaAntiga, setSenhaAntiga] = useState("");
    const [senhaNova, setSenhaNova] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erro, setErro] = useState("");

    function handleSalvar() {
        if (!senhaAntiga || !senhaNova || !confirmarSenha) {
            setErro("Preencha todos os campos.");
            return;
        }
        if (senhaNova !== confirmarSenha) {
            setErro("A nova senha e a confirmação não coincidem.");
            return;
        }
        onSalvar({ almoxarifeId: almoxarife.id, senhaAntiga, senhaNova });
    }

    return (
        <Modal titulo={`Redefinir Senha`} onFechar={onCancelar}>
            <div className="modal-corpo">
                <InputForm
                    titulo="Senha Antiga:"
                    type="password"
                    value={senhaAntiga}
                    onChange={(e) => setSenhaAntiga(e.target.value)}
                />
                <InputForm
                    titulo="Nova Senha:"
                    type="password"
                    value={senhaNova}
                    onChange={(e) => setSenhaNova(e.target.value)}
                />
                <InputForm
                    titulo="Confirmar Nova Senha:"
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                />

                {erro && <p className="modal-erro">{erro}</p>}

                <div className="modal-actions">
                    <MainButton texto="Salvar" cor="#0A086B" onClick={handleSalvar} />
                    <MainButton texto="Cancelar" cor="#FF4B09" onClick={onCancelar} />
                </div>
            </div>
        </Modal>
    );
}

export default ModalRedefinirSenha;