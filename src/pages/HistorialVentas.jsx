import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot
} from "firebase/firestore";

import { db } from "../firebase";

import Sidebar from "../components/Sidebar";

import BotonRegresar from "../components/BotonRegresar";

import jsPDF from "jspdf";

import "../styles/auth.css";

export default function HistorialVentas() {

  const [ventas,setVentas]=useState([]);

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

  const imprimirTicket = (venta)=>{

    const doc = new jsPDF();

    doc.setFontSize(22);

    doc.text("POS TIENDA",65,20);

    doc.setFontSize(14);

    doc.text("FACTURA",80,30);

    doc.line(20,40,190,40);

    doc.setFontSize(11);

    doc.text(
      `Fecha: ${
        venta.fecha?.toDate
        ? venta.fecha.toDate()
        .toLocaleString()
        : ""
      }`,
      20,
      55
    );

    doc.text(
      `ID: ${venta.id}`,
      20,
      65
    );

    doc.line(20,75,190,75);

    let y=90;

    venta.productos?.forEach((p,index)=>{

      doc.text(
        `${index+1}. ${p.nombre}`,
        20,
        y
      );

      doc.text(
        `x${p.cantidad}`,
        120,
        y
      );

      doc.text(
        `$${p.precioVenta}`,
        160,
        y
      );

      y += 12;

    });

    doc.line(20,y+5,190,y+5);

    doc.setFontSize(18);

    doc.text(
      `TOTAL: $${venta.total}`,
      20,
      y+20
    );

    doc.setFontSize(12);

    doc.text(
      "Gracias por su compra",
      60,
      y+40
    );

    doc.save(
      `Factura-${venta.id}.pdf`
    );

  };

  return(

    <div className="layout">

      <Sidebar />

      <div className="content">

        <BotonRegresar />

        <h1>
          Historial Ventas
        </h1>

        <div className="productosGrid">

          {ventas.map((venta)=>(

            <div
              className="productoCard"
              key={venta.id}
            >

              <h2>
                Venta
              </h2>

              <p>
                💰 Total:
                ${venta.total}
              </p>

              <p>
                📅 {
                  venta.fecha?.toDate
                  ? venta.fecha.toDate()
                  .toLocaleString()
                  : ""
                }
              </p>

              <hr
                style={{
                  margin:"15px 0"
                }}
              />

              {venta.productos?.map(
                (p,index)=>(

                  <div
                    key={index}
                  >

                    <p>
                      {p.nombre}
                    </p>

                    <p>
                      Cant:
                      {p.cantidad}
                    </p>

                  </div>

                )
              )}

              <button
                className="button"
                style={{
                  marginTop:"15px"
                }}
                onClick={()=>
                  imprimirTicket(venta)
                }
              >
                Imprimir Ticket
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}