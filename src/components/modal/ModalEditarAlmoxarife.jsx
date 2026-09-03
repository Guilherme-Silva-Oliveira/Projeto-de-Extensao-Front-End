import Modal from "./Modal";
import InputForm from "../forms/InputForm";
import MainButton from "../forms/MainButton";
import { useState } from "react";

function ModalEditarAlmoxarife({ almoxarife, onSalvar, onCancelar }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [erro, setErro] = useState("");

    function handleSalvar() {
        const dadosAtualizados = {
            ...almoxarife,
            nome: nome.trim() || almoxarife.nome,
            email: email.trim() || almoxarife.email,
            telefone: telefone.trim() || almoxarife.telefone,
        };

        setErro("");
        onSalvar(dadosAtualizados);
    }

    return (
        <Modal titulo="Editar Almoxarife" onFechar={onCancelar}>
            <div className="modal-corpo">
                <InputForm
                    titulo="Nome:"
                    placeholder={almoxarife.nome}
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <InputForm
                    titulo="E-mail:"
                    placeholder={almoxarife.email}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <InputForm
                    titulo="Telefone:"
                    placeholder={almoxarife.telefone}
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
    );
}

export default ModalEditarAlmoxarife;