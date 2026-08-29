import "./SelectData.css";
import arrow from "../assets/arrow.png";

function SelectData({
    dataInicio,
    dataFim,
    setDataInicio,
    setDataFim,
    onBuscar
}) {
    return (
        <div className="periodo-data">
            <div className="campo-data">
                <label>Data início</label>
                <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                />
            </div>
            <img src={arrow} alt="seta" className="seta-periodo"/>
            <div className="wrapper-data-fim">
                <div className="campo-data">
                    <label>Data fim</label>
                    <input
                        type="date"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                    />
                </div>
                <button type="button" className="btn-check-data" onClick={onBuscar} title="Buscar">
                    <span className="material-symbols-outlined">check</span>
                </button>
            </div>
        </div>
    );
}

export default SelectData;