import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where
} from "firebase/firestore";

import { db,auth } from "../firebase";

import Sidebar from "../components/Sidebar";

import BotonRegresar from "../components/BotonRegresar";

import "../styles/auth.css";

import Scanner from "../components/Scanner";

export default function Inventario() {

  const [nombre,setNombre]=useState("");
  const [categoria,setCategoria]=useState("");
  const [imagen,setImagen]=useState("");
  const [stock,setStock]=useState("");
  const [precioCompra,setPrecioCompra]=useState("");
  const [precioVenta,setPrecioVenta]=useState("");
  const [codigoBarras,setCodigoBarras]=useState("");
const [iva,setIva]=useState("15");
const [stockMinimo,setStockMinimo]=useState("5");
const [proveedor,setProveedor]=useState("");
const [descripcion,setDescripcion]=useState("");
  const [busqueda,setBusqueda]=useState("");

  const [productos,setProductos]=useState([]);

  const [editando,setEditando]=useState(null);

  const guardarProducto = async () => {

    const ganancia =
      Number(precioVenta) -
      Number(precioCompra);

    if(editando){

await updateDoc(
  doc(db,"productos",editando),
  {
    nombre,
    categoria,
    imagen,
    codigoBarras,
    iva:Number(iva),
    stockMinimo:Number(stockMinimo),
    proveedor,
    descripcion,
    stock:Number(stock),
    precioCompra:Number(precioCompra),
    precioVenta:Number(precioVenta),
    ganancia
  }
);
      setEditando(null);

    }else{

await addDoc(
  collection(db,"productos"),
  {
    userId: auth.currentUser?.uid || "",
    nombre,
    categoria,
    imagen,
    codigoBarras,
    iva:Number(iva),
    stockMinimo:Number(stockMinimo),
    proveedor,
    descripcion,
    stock:Number(stock),
    precioCompra:Number(precioCompra),
    precioVenta:Number(precioVenta),
    ganancia
  }
);

    }

    limpiar();

  };

  const limpiar = () => {

    setNombre("");
    setCategoria("");
    setImagen("");
    setStock("");
    setPrecioCompra("");
    setPrecioVenta("");

  };

  useEffect(() => {

  if (!auth.currentUser) return;

  const q = query(
    collection(db, "productos"),
    where(
      "userId",
      "==",
      auth.currentUser.uid
    )
  );

  const unsubscribe = onSnapshot(
    q,
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

  const eliminarProducto = async(id)=>{

    await deleteDoc(
      doc(db,"productos",id)
    );

  };

  const editarProducto = (producto)=>{

    setNombre(producto.nombre);
    setCategoria(producto.categoria);
    setImagen(producto.imagen);
    setStock(producto.stock);
    setPrecioCompra(producto.precioCompra);
    setPrecioVenta(producto.precioVenta);

    setEditando(producto.id);

  };

  const productosFiltrados =
    productos.filter((p)=>

      p.nombre
      ?.toLowerCase()
      .includes(busqueda.toLowerCase())

    );

  return(

    <div className="layout">

      <Sidebar />

      <div className="content">

        <BotonRegresar />

        <h1>Inventario</h1>

        <div className="card">

          <input
            className="input"
            placeholder="Nombre"
            value={nombre}
            onChange={(e)=>
              setNombre(e.target.value)
            }
          />

          <input
            className="input"
            placeholder="Categoría"
            value={categoria}
            onChange={(e)=>
              setCategoria(e.target.value)
            }
          />

          <input
            className="input"
            placeholder="URL Imagen"
            value={imagen}
            onChange={(e)=>
              setImagen(e.target.value)
            }
          />

          <input
            className="input"
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e)=>
              setStock(e.target.value)
            }
          />

          <input
            className="input"
            type="number"
            placeholder="Precio Compra"
            value={precioCompra}
            onChange={(e)=>
              setPrecioCompra(e.target.value)
            }
          />

          <input
            className="input"
            type="number"
            placeholder="Precio Venta"
            value={precioVenta}
            onChange={(e)=>
              setPrecioVenta(e.target.value)
            }
          />
          <input
  className="input"
  placeholder="Código de barras"
  value={codigoBarras}
  onChange={(e)=>setCodigoBarras(e.target.value)}
/>
<Scanner
  onScan={(codigo)=>{
    setCodigoBarras(codigo);
  }}
/>

          <button
            className="button"
            onClick={guardarProducto}
          >
            {
              editando
              ? "Actualizar"
              : "Guardar Producto"
            }
          </button>

        </div>

        <input
          className="input"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e)=>
            setBusqueda(e.target.value)
          }
        />

        <div className="productosGrid">

          {productosFiltrados.map((producto)=>(

            <div
              className="productoCard"
              key={producto.id}
            >

              <img
                src={
                  producto.imagen ||
                  "https://via.placeholder.com/300"
                }
                alt=""
                style={{
                  width:"100%",
                  height:"180px",
                  objectFit:"cover",
                  borderRadius:"12px",
                  marginBottom:"15px"
                }}
              />

              <h2>
                {producto.nombre}
              </h2>

              <p>
                📦 Stock:
                {producto.stock}
              </p>

              <p>
                🏷 {producto.categoria}
              </p>

              <p>
                💵 Compra:
                ${producto.precioCompra}
              </p>

              <p>
                💰 Venta:
                ${producto.precioVenta}
              </p>

              <p>
                📈 Ganancia:
                ${producto.ganancia}
              </p>

              {producto.stock <= 5 && (

                <p
                  style={{
                    color:"red",
                    fontWeight:"bold"
                  }}
                >
                  ⚠ Poco stock
                </p>

              )}

              <div
                style={{
                  display:"flex",
                  gap:"10px",
                  marginTop:"15px"
                }}
              >

                <button
                  className="button"
                  onClick={()=>
                    editarProducto(producto)
                  }
                >
                  Editar
                </button>

                <button
                  className="deleteBtn"
                  onClick={()=>
                    eliminarProducto(producto.id)
                  }
                >
                  Eliminar
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}