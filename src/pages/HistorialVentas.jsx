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

 const imprimirTicket = (venta) => {

  const doc = new jsPDF();

  doc.setFont("helvetica","bold");
  doc.setFontSize(22);

  doc.text("POS TIENDA",70,20);

  doc.setFontSize(12);

  doc.text(
    "Sistema Profesional de Ventas",
    58,
    28
  );

  doc.line(20,35,190,35);

  doc.setFontSize(11);

  doc.text(
    `Factura #: ${venta.id.slice(0,8)}`,
    20,
    48
  );

  doc.text(
    `Fecha: ${
      venta.fecha?.toDate
      ? venta.fecha.toDate().toLocaleString()
      : new Date().toLocaleString()
    }`,
    20,
    58
  );

  doc.line(20,65,190,65);

  doc.setFont("helvetica","bold");

  doc.text("Producto",20,78);
  doc.text("Cant.",110,78);
  doc.text("Precio",140,78);
  doc.text("Subtotal",165,78);

  doc.line(20,82,190,82);

  doc.setFont("helvetica","normal");

  let y = 95;

  venta.productos?.forEach((p)=>{

    const subtotal =
      Number(p.precioVenta) *
      Number(p.cantidad);

    doc.text(
      String(p.nombre).substring(0,22),
      20,
      y
    );

    doc.text(
      String(p.cantidad),
      115,
      y
    );

    doc.text(
      `$${Number(p.precioVenta).toFixed(2)}`,
      140,
      y
    );

    doc.text(
      `$${subtotal.toFixed(2)}`,
      165,
      y
    );

    y += 12;

  });

  doc.line(
    20,
    y,
    190,
    y
  );

  y += 18;

  doc.setFontSize(18);
  doc.setFont("helvetica","bold");

  doc.text(
    `TOTAL: $${Number(venta.total).toFixed(2)}`,
    20,
    y
  );

  y += 25;

  doc.setFontSize(12);
  doc.setFont("helvetica","normal");

  doc.text(
    "Gracias por su compra",
    65,
    y
  );

  doc.text(
    "POS TIENDA",
    80,
    y + 10
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