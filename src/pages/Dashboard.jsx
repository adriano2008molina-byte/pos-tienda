import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

import "../styles/auth.css";

import {
  collection,
  onSnapshot
} from "firebase/firestore";

import { db } from "../firebase";

export default function Dashboard(){
  const [ventas,setVentas] =
useState([]);

const [productos,setProductos] =
useState([]);
useEffect(()=>{

  const unsubVentas =
    onSnapshot(

      collection(db,"ventas"),

      (snapshot)=>{

        const lista=[];

        snapshot.forEach((docu)=>{

          lista.push({
            id:docu.id,
            ...docu.data()
          });

        });

        setVentas(lista);

      }

    );

  const unsubProductos =
    onSnapshot(

      collection(db,"productos"),

      (snapshot)=>{

        const lista=[];

        snapshot.forEach((docu)=>{

          lista.push({
            id:docu.id,
            ...docu.data()
          });

        });

        setProductos(lista);

      }

    );

  return ()=>{

    unsubVentas();

    unsubProductos();

  };

},[]);
const ventasHoy =

  ventas.reduce(

    (acc,v)=>

      acc +
      Number(v.total || 0),

    0

  );

const productosVendidos =

  ventas.reduce(

    (acc,v)=>{

      let cantidad=0;

      v.productos?.forEach(

        (p)=>{

          cantidad +=
            Number(
              p.cantidad
            );

        }

      );

      return acc + cantidad;

    },

    0

  );

const stockBajo =

  productos.filter(

    (p)=>

      Number(p.stock) <= 5

  ).length;

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
      💰 Ventas Totales
    </h2>

    <p>
      ${ventasHoy.toFixed(2)}
    </p>

  </div>

  <div className="statCard">

    <h2>
      🧾 Ventas
    </h2>

    <p>
      {ventas.length}
    </p>

  </div>

  <div className="statCard">

    <h2>
      📦 Productos Vendidos
    </h2>

    <p>
      {productosVendidos}
    </p>

  </div>

  <div className="statCard">

    <h2>
      ⚠ Stock Bajo
    </h2>

    <p>
      {stockBajo}
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
            Bienvenido a TIENDA JEROMY
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