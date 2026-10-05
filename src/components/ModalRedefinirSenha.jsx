import Modal from "./Modal";
import InputForm from "./InputForm";
import MainButton from "./MainButton";
import ModalConfirmarAlteracao from "./ModalConfirmarAlteracao";
import { useState } from "react";

function ModalRedefinirSenha({ almoxarife, onSalvar, onCancelar }) {
    const [senhaAntiga, setSenhaAntiga] = useState("");
    const [senhaNova, setSenhaNova] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erro, setErro] = useState("");
    const [confirmando, setConfirmando] = useState(false);
    const [salvando, setSalvando] = useState(false);

    function handleSalvar() {
        if (!senhaAntiga || !senhaNova || !confirmarSenha) {
            setErro("Preencha todos os campos.");
            return;
        }
        if (senhaNova.length < 6) {
            setErro("A nova senha deve ter no mínimo 6 caracteres.");
            return;
        }
        if (senhaNova !== confirmarSenha) {
            setErro("A nova senha e a confirmação não coincidem.");
            return;
        }
        if (senhaNova === senhaAntiga) {
            setErro("A nova senha deve ser diferente da antiga.");
            return;
        }
        setErro("");
        setConfirmando(true);
    }

    async function handleConfirmar() {
        if (salvando) return;
        setSalvando(true);
        try {
            await onSalvar({ almoxarifeId: almoxarife.id, senhaAntiga, senhaNova });
        } catch (error) {
            setConfirmando(false);
            setErro(
                error.response?.status === 400
                    ? "Senha antiga incorreta."
                    : "Não foi possível redefinir a senha."
            );
        } finally {
            setSalvando(false);
        }
    }

    return (
        <>
            <Modal titulo="Redefinir Senha" onFechar={onCancelar}>
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

            {confirmando && (
                <ModalConfirmarAlteracao
                    descricao="Você está redefinindo a senha do almoxarife"
                    nome={almoxarife.nome}
                    onConfirmar={handleConfirmar}
                    onCancelar={() => setConfirmando(false)}
                />
            )}
        </>
    );
}

export default ModalRedefinirSenha;