import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  signOut
} from "firebase/auth";

import { auth } from "../firebase";

export default function Sidebar(){

  const navigate = useNavigate();

  const cerrarSesion = async()=>{

    await signOut(auth);

    navigate("/");

  };

  return(

    <div className="sidebar">

      <h2>
        POS TIENDA
      </h2>

      <Link to="/dashboard">
        📊 Dashboard
      </Link>

      <Link to="/inventario">
        📦 Inventario
      </Link>

      <Link to="/ventas">
        🛒 Ventas
      </Link>

      <Link to="/clientes">
        👥 Clientes
      </Link>

      <Link to="/historial">
        🧾 Historial
      </Link>

      <Link to="/estadisticas">
        📈 Estadísticas
      </Link>

      <button
        className="logoutBtn"
        onClick={cerrarSesion}
      >
        🚪 Cerrar Sesión
      </button>

    </div>

  );

}