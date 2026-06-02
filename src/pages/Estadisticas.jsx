import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot
} from "firebase/firestore";

import { db } from "../firebase";

import Sidebar from "../components/Sidebar";

import "../styles/auth.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Estadisticas() {

  const [ventas,setVentas] =
    useState([]);

  const [productos,setProductos] =
    useState([]);

  const [clientes,setClientes] =
    useState([]);

  useEffect(()=>{

    const unsubscribeVentas =
      onSnapshot(
        collection(db,"ventas"),
        (snapshot)=>{

          const lista=[];

          snapshot.forEach((doc)=>{

            lista.push(doc.data());

          });

          setVentas(lista);

        }
      );

    const unsubscribeProductos =
      onSnapshot(
        collection(db,"productos"),
        (snapshot)=>{

          const lista=[];

          snapshot.forEach((doc)=>{

            lista.push(doc.data());

          });

          setProductos(lista);

        }
      );

    const unsubscribeClientes =
      onSnapshot(
        collection(db,"clientes"),
        (snapshot)=>{

          const lista=[];

          snapshot.forEach((doc)=>{

            lista.push(doc.data());

          });

          setClientes(lista);

        }
      );

    return ()=>{

      unsubscribeVentas();
      unsubscribeProductos();
      unsubscribeClientes();

    };

  },[]);

  const totalVentas =
    ventas.reduce(
      (acc,item)=>
        acc + Number(item.total),
      0
    );

  const ganancias =
    productos.reduce(
      (acc,item)=>

        acc +
        Number(item.ganancia),

      0
    );

  const data = {

    labels:[
      "Ventas",
      "Productos",
      "Clientes",
      "Ganancias"
    ],

    datasets:[
      {
        label:"POS Tienda",
        data:[
          totalVentas,
          productos.length,
          clientes.length,
          ganancias
        ],
        backgroundColor:[
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444"
        ]
      }
    ]

  };

  return (

    <div className="layout">

      <Sidebar />

      <div className="content">

        <h1>Estadísticas</h1>

        <br />

        <div className="cards">

          <div className="statCard">

            <h2>
              ${totalVentas}
            </h2>

            <p>
              Ventas Totales
            </p>

          </div>

          <div className="statCard">

            <h2>
              {productos.length}
            </h2>

            <p>
              Productos
            </p>

          </div>

          <div className="statCard">

            <h2>
              {clientes.length}
            </h2>

            <p>
              Clientes
            </p>

          </div>

          <div className="statCard">

            <h2>
              ${ganancias}
            </h2>

            <p>
              Ganancias
            </p>

          </div>

        </div>

        <br />

        <div className="grafica">

          <Bar data={data} />

        </div>

      </div>

    </div>

  );

}