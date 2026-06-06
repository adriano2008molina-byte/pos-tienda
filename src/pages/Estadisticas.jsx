import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot
} from "firebase/firestore";

import { db } from "../firebase";

import Sidebar from "../components/Sidebar";

import BotonRegresar from "../components/BotonRegresar";

import "../styles/auth.css";

import {
  Bar
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Estadisticas() {

  const [ventas, setVentas] = useState([]);

  const [productos, setProductos] = useState([]);

  // ===== CARGAR VENTAS =====

  useEffect(() => {

    const unsubscribeVentas = onSnapshot(
      collection(db, "ventas"),
      (snapshot) => {

        const lista = [];

        snapshot.forEach((docu) => {

          lista.push({
            id: docu.id,
            ...docu.data()
          });

        });

        setVentas(lista);

      }
    );

    const unsubscribeProductos = onSnapshot(
      collection(db, "productos"),
      (snapshot) => {

        const lista = [];

        snapshot.forEach((docu) => {

          lista.push({
            id: docu.id,
            ...docu.data()
          });

        });

        setProductos(lista);

      }
    );

    return () => {

      unsubscribeVentas();

      unsubscribeProductos();

    };

  }, []);

  // ===== TOTAL VENTAS =====

  const totalVentas = ventas.reduce(

    (acc, venta) => acc + venta.total,

    0

  );

  // ===== DATOS GRÁFICA =====

  const data = {

    labels: [
      "Ventas",
      "Productos"
    ],

    datasets: [

      {
        label: "Estadísticas TIENDA JEROMY",

        data: [
          ventas.length,
          productos.length
        ]
      }

    ]

  };

  return (

    <div className="layout">

      <Sidebar />

      <div className="content">

        <BotonRegresar />

        <h1>Estadísticas</h1>

        {/* ===== TARJETAS ===== */}

        <div className="statsGrid">

          <div className="statCard">

            <h2>
              Ventas Totales
            </h2>

            <p>
              ${totalVentas}
            </p>

          </div>

          <div className="statCard">

            <h2>
              Cantidad Ventas
            </h2>

            <p>
              {ventas.length}
            </p>

          </div>

          <div className="statCard">

            <h2>
              Productos
            </h2>

            <p>
              {productos.length}
            </p>

          </div>

        </div>

        {/* ===== GRAFICA ===== */}

        <div
          className="card"
          style={{
            marginTop:"30px"
          }}
        >

          <Bar data={data} />

        </div>

      </div>

    </div>

  );

}