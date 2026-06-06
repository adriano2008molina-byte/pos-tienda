import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot
} from "firebase/firestore";

import { db } from "../firebase";

import Sidebar from "../components/Sidebar";

import BotonRegresar from "../components/BotonRegresar";

export default function HistorialCierres() {

  const [cierres,setCierres] =
    useState([]);

  useEffect(()=>{

    const unsubscribe =
      onSnapshot(

        collection(
          db,
          "cierresCaja"
        ),

        (snapshot)=>{

          const lista=[];

          snapshot.forEach((docu)=>{

            lista.push({
              id:docu.id,
              ...docu.data()
            });

          });

          lista.sort((a,b)=>{

            const fechaA =
              a.fecha?.toDate
              ? a.fecha.toDate()
              : new Date(0);

            const fechaB =
              b.fecha?.toDate
              ? b.fecha.toDate()
              : new Date(0);

            return fechaB-fechaA;

          });

          setCierres(lista);

        }

      );

    return ()=>unsubscribe();

  },[]);

  return(

    <div className="layout">

      <Sidebar/>

      <div className="content">

        <BotonRegresar/>

        <h1>
          Historial Cierres
        </h1>

        <div
          className="productosGrid"
        >

          {cierres.map((cierre)=>(

            <div
              className="productoCard"
              key={cierre.id}
            >

              <h2>
                Cierre
              </h2>

              <p>
                Fecha:
                {
                  cierre.fecha?.toDate
                  ? cierre.fecha
                    .toDate()
                    .toLocaleString()
                  : ""
                }
              </p>

              <p>
                Ventas:
                {cierre.ventas}
              </p>

              <p>
                Total:
                $
                {
                  Number(
                    cierre.totalVentas || 0
                  ).toFixed(2)
                }
              </p>

              <p>
                Subtotal:
                $
                {
                  Number(
                    cierre.subtotal || 0
                  ).toFixed(2)
                }
              </p>

              <p>
                IVA:
                $
                {
                  Number(
                    cierre.iva || 0
                  ).toFixed(2)
                }
              </p>

              <p>
                Diferencia:
                $
                {
                  Number(
                    cierre.diferencia || 0
                  ).toFixed(2)
                }
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}