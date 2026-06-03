import Sidebar from "../components/Sidebar";

import "../styles/auth.css";

export default function Dashboard(){

  return(

    <div className="layout">

      <Sidebar />

      <div className="content">

        <h1>
          Dashboard
        </h1>

        <div className="statsGrid">

          <div className="statCard">

            <h2>
              💰 Ventas
            </h2>

            <p>
              Sistema activo
            </p>

          </div>

          <div className="statCard">

            <h2>
              📦 Inventario
            </h2>

            <p>
              Gestión completa
            </p>

          </div>

          <div className="statCard">

            <h2>
              👥 Clientes
            </h2>

            <p>
              Base de datos
            </p>

          </div>

          <div className="statCard">

            <h2>
              ☁ Firebase
            </h2>

            <p>
              Tiempo real
            </p>

          </div>

        </div>

        <div
          className="card"
          style={{
            marginTop:"30px"
          }}
        >

          <h2>
            Bienvenido a POS TIENDA
          </h2>

          <p
            style={{
              marginTop:"15px",
              color:"#cbd5e1",
              lineHeight:"1.7"
            }}
          >
            Sistema profesional de ventas,
            inventario, clientes,
            estadísticas y facturación.
          </p>

        </div>

      </div>

    </div>

  );

}