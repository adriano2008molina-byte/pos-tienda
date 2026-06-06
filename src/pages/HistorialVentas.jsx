import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";

import Sidebar from "../components/Sidebar";

import BotonRegresar from "../components/BotonRegresar";

import jsPDF from "jspdf";

import QRCode from "qrcode";

import "../styles/auth.css";

export default function HistorialVentas() {

 const [ventas,setVentas]=useState([]);

const [nombreCliente,setNombreCliente]=
useState("");

const [cedulaCliente,setCedulaCliente]=
useState("");

const [ventaSeleccionada,setVentaSeleccionada]=
useState(null);

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

lista.sort((a,b)=>{

  const fechaA =
    a.fecha?.toDate
      ? a.fecha.toDate()
      : new Date(0);

  const fechaB =
    b.fecha?.toDate
      ? b.fecha.toDate()
      : new Date(0);

  return fechaB - fechaA;

});

setVentas(lista);

        setVentas(lista);

      }
    );

    return ()=>unsubscribe();

  },[]);

 const imprimirTicket = (venta) => {

  const doc = new jsPDF();

  doc.setFont("helvetica","bold");
  doc.setFontSize(22);

  doc.text("TIENDA JEROMY",70,20);

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
    "TIENDA JEROMY",
    80,
    y + 10
  );

  doc.save(
    `Factura-${venta.id}.pdf`
  );

};
const imprimirFacturaConDatos = async (venta)=>{

  const doc = new jsPDF();
  const qrData = `
Factura: ${venta.numeroFactura}
Cliente: ${nombreCliente}
Cedula: ${cedulaCliente}
Total: $${venta.total}
`;

const qrImage = await QRCode.toDataURL(
  qrData
);

  doc.setFontSize(22);

  doc.text("TIENDA JEROMY",65,20);

  doc.setFontSize(14);

  doc.text("FACTURA",80,30);

  doc.line(20,40,190,40);

  doc.setFontSize(11);

  doc.text(
    `Cliente: ${nombreCliente}`,
    20,
    55
  );

  doc.text(
    `Cedula: ${cedulaCliente}`,
    20,
    65
  );
  doc.text(
  `Metodo Pago: ${
    venta.metodoPago || ""
  }`,
  20,
  75
);

  doc.text(
    `Fecha: ${
      venta.fecha?.toDate
      ? venta.fecha.toDate()
      .toLocaleString()
      : ""
    }`,
    20,
    85
  );

  doc.line(20,95,190,95);

  let y = 110;

  venta.productos?.forEach((p,index)=>{

    const subtotal =
      Number(p.precioVenta) *
      Number(p.cantidad);

    doc.text(
      `${index+1}. ${p.nombre}`,
      20,
      y
    );

    doc.text(
      `x${p.cantidad}`,
      110,
      y
    );

    doc.text(
      `$${subtotal.toFixed(2)}`,
      160,
      y
    );

    y += 12;

  });

  doc.line(
    20,
    y+5,
    190,
    y+5
  );

  doc.setFontSize(18);
doc.setFontSize(12);

doc.text(
  `Subtotal: $${Number(
    venta.subtotal || 0
  ).toFixed(2)}`,
  20,
  y + 20
);

doc.text(
  `IVA: $${Number(
    venta.iva || 0
  ).toFixed(2)}`,
  20,
  y + 30
);
doc.text(
  `TOTAL: $${Number(
    venta.total
  ).toFixed(2)}`,
  20,
  y + 45
);
doc.addImage(
  qrImage,
  "PNG",
  140,
  20,
  40,
  40
);
  doc.save(
    `Factura-${venta.id}.pdf`
  );

};

const imprimirTicketTermico = (venta) => {

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [80, 200]
  });

  let y = 10;

  doc.setFontSize(14);
  doc.text("TIENDA JEROMY", 25, y);

  y += 8;

  doc.setFontSize(8);

  doc.text(
    venta.numeroFactura || "",
    5,
    y
  );

  y += 5;

  doc.text(
    venta.fecha?.toDate
      ? venta.fecha.toDate().toLocaleString()
      : "",
    5,
    y
  );

  y += 8;

  doc.line(5, y, 75, y);

  y += 6;

  venta.productos?.forEach((p) => {

    doc.text(
      p.nombre,
      5,
      y
    );

    y += 4;

    doc.text(
      `${p.cantidad} x $${p.precioVenta}`,
      5,
      y
    );

    const subtotal =
      Number(p.cantidad) *
      Number(p.precioVenta);

    doc.text(
      `$${subtotal.toFixed(2)}`,
      55,
      y
    );

    y += 6;

  });

  doc.line(5, y, 75, y);

  y += 8;

  doc.text(
    `Subtotal: $${Number(
      venta.subtotal || 0
    ).toFixed(2)}`,
    5,
    y
  );

  y += 5;

  doc.text(
    `IVA: $${Number(
      venta.iva || 0
    ).toFixed(2)}`,
    5,
    y
  );

  y += 5;

  doc.setFontSize(11);

  doc.text(
    `TOTAL: $${Number(
      venta.total || 0
    ).toFixed(2)}`,
    5,
    y
  );

  y += 8;

  doc.setFontSize(8);

  doc.text(
    "Gracias por su compra",
    15,
    y
  );

  doc.save(
    `Ticket-${venta.numeroFactura}.pdf`
  );

};
const devolverVenta = async (venta) => {

  if (venta.estado === "DEVUELTA") {

    alert(
      "Esta venta ya fue devuelta"
    );

    return;

  }

  const confirmar = window.confirm(
    "¿Desea devolver esta venta?"
  );

  if (!confirmar) return;

  try {

    for (const producto of venta.productos) {

      const productoRef = doc(
        db,
        "productos",
        producto.id
      );

      const productoSnap =
        await getDoc(productoRef);

      if (productoSnap.exists()) {

        const stockActual =
          productoSnap.data().stock || 0;

        await updateDoc(
          productoRef,
          {
            stock:
              stockActual +
              Number(producto.cantidad)
          }
        );

      }

    }

    await updateDoc(
      doc(
        db,
        "ventas",
        venta.id
      ),
      {
        estado: "DEVUELTA"
      }
    );

    alert(
      "Venta devuelta correctamente"
    );

  } catch (error) {

    console.error(error);

    alert(
      "Error al devolver venta"
    );

  }

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
              <p
  style={{
    color:
      venta.estado === "DEVUELTA"
        ? "red"
        : "green",
    fontWeight: "bold"
  }}
>
  Estado:
  {venta.estado || "ACTIVA"}
</p>
              <p>
                📅 {
                  venta.fecha?.toDate
                  ? venta.fecha.toDate()
                  .toLocaleString()
                  : ""
                }
              </p>
<p>
  Subtotal:
  ${venta.subtotal}
</p>

<p>
  IVA:
  ${venta.iva}
</p>

<p>
  Recibido:
  ${venta.recibido}
</p>

<p>
  Cambio:
  ${venta.cambio}
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

<button
  className="button"
  style={{
    marginTop:"10px"
  }}
  onClick={()=>
    setVentaSeleccionada(venta)
  }
>
  Factura con Datos
</button>
<button
  className="deleteBtn"
  style={{
    marginTop:"10px"
  }}
  disabled={
    venta.estado === "DEVUELTA"
  }
  onClick={() =>
    devolverVenta(venta)
  }
>
  {
    venta.estado === "DEVUELTA"
      ? "Devuelta"
      : "Devolver Venta"
  }
</button>
<button
  className="button"
  style={{
    marginTop:"10px"
  }}
  onClick={()=>
    imprimirTicketTermico(
      venta
    )
  }
>
  Ticket Térmico
</button>

            </div>

          ))}

              </div>

        {ventaSeleccionada && (

          <div
            style={{
              position:"fixed",
              top:0,
              left:0,
              width:"100%",
              height:"100%",
              background:"rgba(0,0,0,0.7)",
              display:"flex",
              justifyContent:"center",
              alignItems:"center",
              zIndex:"999"
            }}
          >

            <div
              className="card"
              style={{
                width:"400px"
              }}
            >

              <h2>
                Datos Cliente
              </h2>

              <input
                className="input"
                placeholder="Nombre Completo"
                value={nombreCliente}
                onChange={(e)=>
                  setNombreCliente(
                    e.target.value
                  )
                }
              />

              <input
                className="input"
                placeholder="Cedula"
                value={cedulaCliente}
                onChange={(e)=>
                  setCedulaCliente(
                    e.target.value
                  )
                }
              />

              <button
                className="button"
                onClick={()=>{

                  if(
                    !nombreCliente ||
                    !cedulaCliente
                  ){
                    alert(
                      "Complete todos los datos"
                    );
                    return;
                  }

                  imprimirFacturaConDatos(
                    ventaSeleccionada
                  );

                  setVentaSeleccionada(null);

                  setNombreCliente("");

                  setCedulaCliente("");

                }}
              >
                Generar Factura
              </button>

              <button
                className="deleteBtn"
                style={{
                  marginTop:"10px"
                }}
                onClick={()=>{
                  setVentaSeleccionada(null);
                }}
              >
                Cancelar
              </button>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}