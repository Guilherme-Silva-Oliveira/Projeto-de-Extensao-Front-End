import "./CardDashboard.css";

function CardDashboard({ children, className = "" }) {
  return (
    <div className={`card-dashboard ${className}`}>
      {children}
    </div>
  );
}

export default CardDashboard;