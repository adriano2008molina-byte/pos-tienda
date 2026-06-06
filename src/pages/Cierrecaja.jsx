import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  addDoc
} from "firebase/firestore";

import { db } from "../firebase";

import Sidebar from "../components/Sidebar";

import BotonRegresar from "../components/BotonRegresar";

export default function CierreCaja() {

  const [ventas,setVentas] = useState([]);

  const [montoInicial,setMontoInicial] =
    useState("");

  const [efectivoContado,setEfectivoContado] =
    useState("");

  useEffect(()=>{

    const unsubscribe = onSnapshot(

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

  const totalVentas =

    ventas.reduce(

      (acc,v)=>

        acc +
        Number(v.total || 0),

      0

    );

  const subtotal =

    ventas.reduce(

      (acc,v)=>

        acc +
        Number(v.subtotal || 0),

      0

    );

  const iva =

    ventas.reduce(

      (acc,v)=>

        acc +
        Number(v.iva || 0),

      0

    );

  const cantidadVentas =
    ventas.length;

  const cajaEsperada =

    Number(montoInicial || 0) +

    Number(totalVentas);

  const diferencia =

    Number(efectivoContado || 0) -

    cajaEsperada;

  const cerrarCaja = async()=>{

    await addDoc(

      collection(
        db,
        "cierresCaja"
      ),

      {

        fecha:new Date(),

        ventas:
          cantidadVentas,

        totalVentas,

        subtotal,

        iva,

        montoInicial:
          Number(
            montoInicial
          ),

        efectivoContado:
          Number(
            efectivoContado
          ),

        cajaEsperada,

        diferencia

      }

    );

    alert(
      "Caja cerrada correctamente"
    );

    setMontoInicial("");

    setEfectivoContado("");

  };

  return(

    <div className="layout">

      <Sidebar/>

      <div className="content">

        <BotonRegresar/>

        <h1>
          🔒 Cierre de Caja
        </h1>

        <div className="card">

          <h2
            style={{
              marginBottom:"20px"
            }}
          >
            Apertura y Conteo
          </h2>

          <input
            className="input"
            type="number"
            placeholder="Monto Inicial Caja"
            value={montoInicial}
            onChange={(e)=>
              setMontoInicial(
                e.target.value
              )
            }
          />

          <input
            className="input"
            type="number"
            placeholder="Efectivo Contado"
            value={efectivoContado}
            onChange={(e)=>
              setEfectivoContado(
                e.target.value
              )
            }
          />

        </div>

        <div className="statsGrid">

          <div className="statCard">

            <h2>
              🧾 Ventas
            </h2>

            <p>
              {cantidadVentas}
            </p>

          </div>

          <div className="statCard">

            <h2>
              💰 Total
            </h2>

            <p>
              ${totalVentas.toFixed(2)}
            </p>

          </div>

          <div className="statCard">

            <h2>
              📄 Subtotal
            </h2>

            <p>
              ${subtotal.toFixed(2)}
            </p>

          </div>

          <div className="statCard">

            <h2>
              🏛 IVA
            </h2>

            <p>
              ${iva.toFixed(2)}
            </p>

          </div>

        </div>

        <div
          className="card"
          style={{
            marginTop:"25px"
          }}
        >

          <h2
            style={{
              marginBottom:"20px"
            }}
          >
            Resumen de Caja
          </h2>

          <p
            style={{
              fontSize:"18px",
              marginBottom:"10px"
            }}
          >
            💵 Caja Esperada:
            ${cajaEsperada.toFixed(2)}
          </p>

          <p
            style={{
              color:
                diferencia < 0
                ? "#ef4444"
                : "#22c55e",

              fontWeight:"bold",

              fontSize:"22px",

              marginBottom:"20px"
            }}
          >
            Diferencia:
            ${diferencia.toFixed(2)}
          </p>

          <button
            className="button"
            style={{
              width:"100%"
            }}
            onClick={cerrarCaja}
          >
            🔒 Cerrar Caja
          </button>

        </div>

      </div>

    </div>

  );

}