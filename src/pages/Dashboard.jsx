import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  return (
    <div className="layout">
      <Sidebar />

      <div className="content">

        <h1>Dashboard</h1>

        <div className="cards">

          <div className="statCard">
            <h2>POS</h2>
            <p>Sistema activo</p>
          </div>

          <div className="statCard">
            <h2>Ventas</h2>
            <p>En tiempo real</p>
          </div>

          <div className="statCard">
            <h2>Inventario</h2>
            <p>Control total</p>
          </div>

          <div className="statCard">
            <h2>Firebase</h2>
            <p>Conectado</p>
          </div>

        </div>

      </div>
    </div>
  );
}