import "./SelectData.css";
import arrow from "../assets/arrow.png"

function SelectData({
    dataInicio,
        dataFim,
        setDataInicio,
        setDataFim
}) {
    return (
        <div className="periodo-data">
            <div>
                <label>Data início</label>
                <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                />
            </div>
            <img src={arrow} alt="seta" className="seta-periodo"/>
            <div>
                <label>Data fim</label>
                <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                />
            </div>
        </div>
    );
}

export default SelectData;