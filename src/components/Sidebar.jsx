import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">

      <h2>POS TIENDA</h2>

      <Link to="/dashboard">Dashboard</Link>
      <Link to="/inventario">Inventario</Link>
      <Link to="/ventas">Ventas</Link>
      <Link to="/clientes">Clientes</Link>
      <Link to="/estadisticas">Estadísticas</Link>
      <Link to="/historial">Historial</Link>

      <button className="logoutBtn">
        Cerrar sesión
      </button>

    </div>
  );
}