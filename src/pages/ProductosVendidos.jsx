import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot
} from "firebase/firestore";

import { db } from "../firebase";

import Sidebar from "../components/Sidebar";

import BotonRegresar from "../components/BotonRegresar";

export default function ProductosVendidos() {

  const [ranking,setRanking] =
    useState([]);

  useEffect(()=>{

    const unsubscribe =
      onSnapshot(

        collection(db,"ventas"),

        (snapshot)=>{

          const contador = {};

          snapshot.forEach((docu)=>{

            const venta =
              docu.data();

            venta.productos?.forEach(
              (producto)=>{

                if(
                  !contador[
                    producto.nombre
                  ]
                ){

                  contador[
                    producto.nombre
                  ] = 0;

                }

                contador[
                  producto.nombre
                ] += Number(
                  producto.cantidad
                );

              }
            );

          });

          const lista =

            Object.entries(
              contador
            )

            .map(
              ([nombre,cantidad])=>({

                nombre,

                cantidad

              })
            )

            .sort(
              (a,b)=>

                b.cantidad -
                a.cantidad

            );

          setRanking(lista);

        }

      );

    return ()=>unsubscribe();

  },[]);

  return(

    <div className="layout">

      <Sidebar />

      <div className="content">

        <BotonRegresar />

        <h1>
          Productos Más Vendidos
        </h1>

        <div
          className="productosGrid"
        >

          {ranking.map(
            (producto,index)=>(

              <div
                className="productoCard"
                key={index}
              >

                <h2>

                  {
                    index === 0
                    ? "🥇"

                    : index === 1
                    ? "🥈"

                    : index === 2
                    ? "🥉"

                    : "📦"
                  }

                </h2>

                <h3>
                  {
                    producto.nombre
                  }
                </h3>

                <p>

                  Vendidos:

                  {
                    producto.cantidad
                  }

                  unidades

                </p>

              </div>

            )
          )}

        </div>

      </div>

    </div>

  );

}