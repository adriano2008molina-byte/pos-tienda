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

import Scanner from "../components/Scanner";

export default function Ventas() {

  const [productos, setProductos] = useState([]);

  const [carrito, setCarrito] = useState([]);

  const [cliente,setCliente]=useState("");
const [cedula,setCedula]=useState("");
const [metodoPago,setMetodoPago]=useState("Efectivo");
const [recibido,setRecibido]=useState("");

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

  if (producto.stock <= 0) {

    alert(
      "Este producto no tiene stock disponible"
    );

    return;

  }

  const existe = carrito.find(
    (item) => item.id === producto.id
  );

  if (existe) {

    if (
      existe.cantidad >= producto.stock
    ) {

      alert(
        "No hay más unidades disponibles"
      );

      return;

    }

    const nuevoCarrito = carrito.map(

      (item) =>

        item.id === producto.id
          ? {
              ...item,
              cantidad:
                item.cantidad + 1
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
    Number(item.precioVenta) *
    Number(item.cantidad),

  0

);

 const subtotal = carrito.reduce(

  (acc,item)=>

    acc +

    (
      Number(item.precioVenta) *
      Number(item.cantidad)
    ) /

    (1 + Number(item.iva || 0)/100),

  0

);

const ivaTotal = total - subtotal;

const cambio =

  Number(recibido || 0) -

  Number(total);

  // ===== FINALIZAR VENTA =====

  const finalizarVenta = async () => {

    if (carrito.length === 0) {

      alert("El carrito está vacío");

      return;

    }

    // GUARDAR VENTA

  await addDoc(
  collection(db,"ventas"),
  {
    estado:"ACTIVA",
    cliente:
      cliente || "Consumidor Final",

    cedula:
      cedula || "-",

    metodoPago,

    recibido:
      Number(recibido || 0),

    cambio:
      cambio > 0
      ? cambio
      : 0,
numeroFactura:
  "FAC-" + Date.now(),
    productos: carrito,

    subtotal:
      Number(
        subtotal.toFixed(2)
      ),

    iva:
      Number(
        ivaTotal.toFixed(2)
      ),

    total:
      Number(
        total.toFixed(2)
      ),

    fecha: new Date()
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
<div className="card">

  <input
    className="input"
    placeholder="Nombre Cliente"
    value={cliente}
    onChange={(e)=>
      setCliente(e.target.value)
    }
  />

  <input
    className="input"
    placeholder="Cédula"
    value={cedula}
    onChange={(e)=>
      setCedula(e.target.value)
    }
  />
  <Scanner
  onScan={(codigo)=>{

    const producto = productos.find(
      p => p.codigoBarras === codigo
    );

    if(producto){
      agregarProducto(producto);
    }

  }}
/>

  <select
    className="input"
    value={metodoPago}
    onChange={(e)=>
      setMetodoPago(
        e.target.value
      )
    }
  >
    <option>
      Efectivo
    </option>

    <option>
      Transferencia
    </option>

    <option>
      Tarjeta
    </option>
  </select>

  <input
    className="input"
    type="number"
    placeholder="Dinero Recibido"
    value={recibido}
    onChange={(e)=>
      setRecibido(
        e.target.value
      )
    }
  />

</div>
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
  ${total.toFixed(2)}
</h2>

<p>
  Subtotal:
  ${subtotal.toFixed(2)}
</p>

<p>
  IVA:
  ${ivaTotal.toFixed(2)}
</p>

<p>
  Cambio:
  ${
    cambio > 0
      ? cambio.toFixed(2)
      : "0.00"
  }
</p>

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