import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Sidebar from "../components/Sidebar";
import "../styles/auth.css";

export default function HistorialVentas() {

  const [ventas, setVentas] = useState([]);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "ventas"),
      (snapshot) => {

        const lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            ...doc.data()
          });
        });

        setVentas(lista);

      }
    );

    return () => unsubscribe();

  }, []);

  return (
    <div className="layout">
      <Sidebar />

      <div className="content">

        <h1>Historial de Ventas</h1>

        <div className="productosGrid">

          {ventas.map((venta) => (

            <div className="productoCard" key={venta.id}>

              <h3>Total: ${venta.total}</h3>

              <p>
                Fecha:{" "}
                {venta.fecha?.toDate
                  ? venta.fecha.toDate().toString()
                  : "Sin fecha"}
              </p>

              <p>
                Productos: {venta.productos?.length}
              </p>

            </div>

          ))}

        </div>

      </div>
    </div>
  );
}