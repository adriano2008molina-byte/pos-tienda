import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot
} from "firebase/firestore";

import { db } from "../firebase";

import Sidebar from "../components/Sidebar";

import BotonRegresar from "../components/BotonRegresar";

export default function Reportes() {

  const [ventas,setVentas]=
    useState([]);

  useEffect(()=>{

    const unsubscribe =
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

    return ()=>unsubscribe();

  },[]);

  const hoy = new Date();

  const inicioDia = new Date(
    hoy.getFullYear(),
    hoy.getMonth(),
    hoy.getDate()
  );

  const inicioSemana =
    new Date();

  inicioSemana.setDate(
    hoy.getDate()-7
  );

  const inicioMes =
    new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      1
    );

  const gananciaHoy =
    ventas.reduce((acc,v)=>{

      const fecha =
        v.fecha?.toDate
        ? v.fecha.toDate()
        : new Date(0);

      return fecha >= inicioDia
        ? acc +
          Number(v.ganancia || 0)
        : acc;

    },0);

  const gananciaSemana =
    ventas.reduce((acc,v)=>{

      const fecha =
        v.fecha?.toDate
        ? v.fecha.toDate()
        : new Date(0);

      return fecha >= inicioSemana
        ? acc +
          Number(v.ganancia || 0)
        : acc;

    },0);

  const gananciaMes =
    ventas.reduce((acc,v)=>{

      const fecha =
        v.fecha?.toDate
        ? v.fecha.toDate()
        : new Date(0);

      return fecha >= inicioMes
        ? acc +
          Number(v.ganancia || 0)
        : acc;

    },0);

  return(

    <div className="layout">

      <Sidebar/>

      <div className="content">

        <BotonRegresar/>

        <h1>
          Reporte Ganancias
        </h1>

        <div className="card">

          <h2>
            Hoy
          </h2>

          <p>
            $
            {
              gananciaHoy
              .toFixed(2)
            }
          </p>

        </div>

        <div className="card">

          <h2>
            Semana
          </h2>

          <p>
            $
            {
              gananciaSemana
              .toFixed(2)
            }
          </p>

        </div>

        <div className="card">

          <h2>
            Mes
          </h2>

          <p>
            $
            {
              gananciaMes
              .toFixed(2)
            }
          </p>

        </div>

      </div>

    </div>

  );

}