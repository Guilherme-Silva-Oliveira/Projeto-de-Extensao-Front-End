import "./CardAlmoxarife.css";
import { useState } from "react";

function CardAlmoxarife({ almoxarife, onEditar, onRedefinirSenha, onExcluir }) {
    const [aberto, setAberto] = useState(false);

    return (
        <div className="almoxarife-card">
            <div className="almoxarife-header" onClick={() => setAberto((v) => !v)}>
                <div className="almoxarife-header-esquerda">
                    <span
                        className={`almoxarife-status-dot ${almoxarife.status === "Ativo" ? "status-ativo" : "status-inativo"
                            }`}
                    ></span>
                    <span className="almoxarife-nome">{almoxarife.nome}</span>
                </div>

                <span className={`almoxarife-chevron ${aberto ? "aberto" : ""}`}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                            d="M4 6L8 10L12 6"
                            stroke="#555"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </div>

            {aberto && (
                <div className="almoxarife-detalhes">
                    <div className="almoxarife-detalhe-item">
                        <span className="almoxarife-detalhe-label">Nome: </span>
                        {almoxarife.nome}
                    </div>
                    <div className="almoxarife-detalhe-item">
                        <span className="almoxarife-detalhe-label">Matrícula: </span>
                        {almoxarife.matricula}
                    </div>
                    <div className="almoxarife-detalhe-item">
                        <span className="almoxarife-detalhe-label">Data e Hora da Criação: </span>
                        {almoxarife.dataCriacao}
                    </div>
                    <div className="almoxarife-detalhe-item">
                        <span className="almoxarife-detalhe-label">Último Acesso: </span>
                        {almoxarife.ultimoAcesso}
                    </div>
                    <div className="almoxarife-detalhe-item">
                        <span className="almoxarife-detalhe-label">E-mail Institucional: </span>
                        {almoxarife.email}
                    </div>
                    <div className="almoxarife-detalhe-item">
                        <span className="almoxarife-detalhe-label">Telefone: </span>
                        {almoxarife.telefone}
                    </div>
                    <div className="almoxarife-detalhe-item">
                        <span className="almoxarife-detalhe-label">Status: </span>
                        {almoxarife.status}
                    </div>

                    <div className="almoxarife-acoes-detalhe">
                        <div className="almoxarife-acoes-esquerda">
                            <button
                                type="button"
                                className="almoxarife-btn-editar"
                                onClick={() => onEditar && onEditar(almoxarife)}
                            >
                                Editar
                            </button>
                            <button
                                type="button"
                                className="almoxarife-btn-senha"
                                onClick={() => onRedefinirSenha && onRedefinirSenha(almoxarife)}
                            >
                                Redefinir Senha
                            </button>
                        </div>

                        <button
                            type="button"
                            className="almoxarife-btn-excluir"
                            onClick={() => onExcluir && onExcluir(almoxarife)}
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CardAlmoxarife;