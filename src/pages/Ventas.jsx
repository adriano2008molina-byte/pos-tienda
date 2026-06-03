import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "../firebase";

import Sidebar from "../components/Sidebar";

import BotonRegresar from "../components/BotonRegresar";

import "../styles/auth.css";

export default function Ventas() {

  const [productos, setProductos] = useState([]);

  const [carrito, setCarrito] = useState([]);

  // ===== CARGAR PRODUCTOS =====

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "productos"),
      (snapshot) => {

        const lista = [];

        snapshot.forEach((docu) => {

          lista.push({
            id: docu.id,
            ...docu.data()
          });

        });

        setProductos(lista);

      }
    );

    return () => unsubscribe();

  }, []);

  // ===== AGREGAR PRODUCTOS =====

  const agregar = (producto) => {

    const existe = carrito.find(
      (item) => item.id === producto.id
    );

    if (existe) {

      const nuevoCarrito = carrito.map((item) =>

        item.id === producto.id
          ? {
              ...item,
              cantidad: item.cantidad + 1
            }
          : item

      );

      setCarrito(nuevoCarrito);

    } else {

      setCarrito([
        ...carrito,
        {
          ...producto,
          cantidad: 1
        }
      ]);

    }

  };

  // ===== AUMENTAR =====

  const aumentarCantidad = (id) => {

    const nuevo = carrito.map((item) =>

      item.id === id
        ? {
            ...item,
            cantidad: item.cantidad + 1
          }
        : item

    );

    setCarrito(nuevo);

  };

  // ===== DISMINUIR =====

  const disminuirCantidad = (id) => {

    const nuevo = carrito.map((item) =>

      item.id === id
        ? {
            ...item,
            cantidad:
              item.cantidad > 1
                ? item.cantidad - 1
                : 1
          }
        : item

    );

    setCarrito(nuevo);

  };

  // ===== ELIMINAR =====

  const eliminarProducto = (id) => {

    const nuevo = carrito.filter(
      (item) => item.id !== id
    );

    setCarrito(nuevo);

  };

  // ===== TOTAL =====

  const total = carrito.reduce(

    (acc, item) =>

      acc +
      item.precioVenta * item.cantidad,

    0

  );

  // ===== FINALIZAR VENTA =====

  const finalizarVenta = async () => {

    if (carrito.length === 0) {

      alert("El carrito está vacío");

      return;

    }

    // GUARDAR VENTA

    await addDoc(
      collection(db, "ventas"),
      {
        productos: carrito,
        total,
        fecha: serverTimestamp()
      }
    );

    // ACTUALIZAR STOCK

    for (const item of carrito) {

      const ref = doc(
        db,
        "productos",
        item.id
      );

      await updateDoc(ref, {
        stock:
          item.stock - item.cantidad
      });

    }

    alert("Venta realizada");

    setCarrito([]);

  };

  return (

    <div className="layout">

      <Sidebar />

      <div className="content">

        <BotonRegresar />

        <h1>Ventas</h1>

        {/* ===== PRODUCTOS ===== */}

        <div className="productosGrid">

          {productos.map((producto) => (

            <div
              className="productoCard"
              key={producto.id}
            >

              <h2>
                {producto.nombre}
              </h2>

              <p>
                Stock:
                {producto.stock}
              </p>

              <p>
                Precio:
                ${producto.precioVenta}
              </p>

              <button
                className="button"
                onClick={() =>
                  agregar(producto)
                }
              >
                Agregar
              </button>

            </div>

          ))}

        </div>

        {/* ===== CARRITO ===== */}

        <h2
          style={{
            marginTop:"40px"
          }}
        >
          Carrito
        </h2>

        <div className="productosGrid">

          {carrito.map((item) => (

            <div
              className="productoCard"
              key={item.id}
            >

              <h3>
                {item.nombre}
              </h3>

              <p>
                Precio:
                ${item.precioVenta}
              </p>

              <p>
                Cantidad:
                {item.cantidad}
              </p>

              <p>
                Subtotal:
                $
                {
                  item.precioVenta *
                  item.cantidad
                }
              </p>

              <div
                style={{
                  display:"flex",
                  gap:"10px",
                  marginTop:"10px"
                }}
              >

                <button
                  className="button"
                  onClick={() =>
                    aumentarCantidad(
                      item.id
                    )
                  }
                >
                  +
                </button>

                <button
                  className="button"
                  onClick={() =>
                    disminuirCantidad(
                      item.id
                    )
                  }
                >
                  -
                </button>

                <button
                  className="deleteBtn"
                  onClick={() =>
                    eliminarProducto(
                      item.id
                    )
                  }
                >
                  Eliminar
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* ===== TOTAL ===== */}

        <h2
          style={{
            marginTop:"30px"
          }}
        >
          Total:
          ${total}
        </h2>

        <button
          className="button"
          onClick={finalizarVenta}
        >
          Finalizar Venta
        </button>

      </div>

    </div>

  );

}