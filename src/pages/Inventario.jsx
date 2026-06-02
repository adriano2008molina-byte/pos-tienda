import { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import Sidebar from "../components/Sidebar";

export default function Inventario() {

  const [nombre,setNombre] = useState("");
  const [precioVenta,setPrecioVenta] = useState("");
  const [stock,setStock] = useState("");
  const [productos,setProductos] = useState([]);

  const guardar = async () => {
    await addDoc(collection(db,"productos"),{
      nombre,
      precioVenta,
      stock
    });

    setNombre("");
    setPrecioVenta("");
    setStock("");
  };

  useEffect(()=>{
    onSnapshot(collection(db,"productos"),(snap)=>{
      const lista=[];
      snap.forEach(d=>lista.push({id:d.id,...d.data()}));
      setProductos(lista);
    });
  },[]);

  const eliminar = async (id)=>{
    await deleteDoc(doc(db,"productos",id));
  };

  return (
    <div className="layout">
      <Sidebar/>

      <div className="content">

        <h1>Inventario</h1>

        <div className="card">

          <input className="input" placeholder="Nombre" value={nombre} onChange={e=>setNombre(e.target.value)} />
          <input className="input" placeholder="Precio compra" value={precioVenta} onChange={e=>setPrecioVenta(e.target.value)} />
          <input className="input" placeholder="Precio venta" value={precioVenta} onChange={e=>setPrecioVenta(e.target.value)} />
          <input className="input" placeholder="Stock" value={stock} onChange={e=>setStock(e.target.value)} />

          <button className="button" onClick={guardar}>Guardar</button>

        </div>

        <div className="productosGrid">

          {productos.map(p=>(
            <div className="productoCard" key={p.id}>
              <h3>{p.nombre}</h3>
              <p>${p.precioVenta}</p>
              <p>Stock: {p.stock}</p>

              <button className="deleteBtn" onClick={()=>eliminar(p.id)}>
                Eliminar
              </button>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}