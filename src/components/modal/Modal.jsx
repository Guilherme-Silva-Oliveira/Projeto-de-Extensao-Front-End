import "./Modal.css";

function Modal({ titulo, children, onFechar }) {
    function handleOverlayClick(e) {
        if (e.target === e.currentTarget && onFechar) {
            onFechar();
        }
    }

    return (
        <div className="modal-overlay" onMouseDown={handleOverlayClick}>
            <div className="modal-caixa">
                {titulo && (
                    <>
                        <h2 className="modal-titulo">{titulo}</h2>
                        <div className="modal-linha-laranja"></div>
                    </>
                )}
                {children}
            </div>
        </div>
    );
}

export default Modal;