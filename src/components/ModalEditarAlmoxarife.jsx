import Modal from "./Modal";
import InputForm from "./InputForm";
import MainButton from "./MainButton";
import ModalConfirmarAlteracao from "./ModalConfirmarAlteracao";
import { useState } from "react";

function ModalEditarAlmoxarife({ almoxarife, onSalvar, onCancelar }) {
    const [nome, setNome] = useState(almoxarife.nome ?? "");
    const [email, setEmail] = useState(almoxarife.email ?? "");
    const [telefone, setTelefone] = useState(almoxarife.telefone ?? "");
    const [erro, setErro] = useState("");
    const [confirmando, setConfirmando] = useState(false);
    const [salvando, setSalvando] = useState(false);

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim();
    const telefoneLimpo = telefone.trim();

    function handleSalvar() {
        if (!nomeLimpo || !emailLimpo || !telefoneLimpo) {
            setErro("Preencha todos os campos.");
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(emailLimpo)) {
            setErro("Informe um e-mail válido.");
            return;
        }
        if (
            nomeLimpo === almoxarife.nome &&
            emailLimpo === almoxarife.email &&
            telefoneLimpo === almoxarife.telefone
        ) {
            onCancelar();
            return;
        }
        setErro("");
        setConfirmando(true);
    }

    async function handleConfirmar() {
        if (salvando) return;
        setSalvando(true);
        try {
            await onSalvar({
                ...almoxarife,
                nome: nomeLimpo,
                email: emailLimpo,
                telefone: telefoneLimpo,
            });
        } catch (error) {
            setConfirmando(false);
            setErro(
                error.response?.status === 409
                    ? "Já existe um almoxarife com esse e-mail."
                    : "Não foi possível salvar as alterações."
            );
        } finally {
            setSalvando(false);
        }
    }

    return (
        <>
            <Modal titulo="Editar Almoxarife" onFechar={onCancelar}>
                <div className="modal-corpo">
                    <InputForm
                        titulo="Nome:"
                        placeholder="Nome do almoxarife"
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                    <InputForm
                        titulo="E-mail:"
                        placeholder="email@exemplo.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputForm
                        titulo="Telefone:"
                        placeholder="(11) 95846-5469"
                        type="text"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
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
                    descricao="Você está editando o almoxarife"
                    nome={almoxarife.nome}
                    onConfirmar={handleConfirmar}
                    onCancelar={() => setConfirmando(false)}
                />
            )}
        </>
    );
}

export default ModalEditarAlmoxarife;