import { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Sidebar from "../components/Sidebar";

export default function Ventas(){

  const [productos,setProductos]=useState([]);
  const [carrito,setCarrito]=useState([]);

  useEffect(()=>{
    onSnapshot(collection(db,"productos"),(snap)=>{
      const lista=[];
      snap.forEach(d=>lista.push({id:d.id,...d.data()}));
      setProductos(lista);
    });
  },[]);

  const agregar=(p)=>{
    setCarrito([...carrito,{...p,cantidad:1}]);
  };

  const total=carrito.reduce((a,i)=>a+i.precioVenta*i.cantidad,0);

  const vender=async()=>{

    for(let i of carrito){
      await updateDoc(doc(db,"productos",i.id),{
        stock: Number(i.stock)-i.cantidad
      });
    }

    await addDoc(collection(db,"ventas"),{
      productos:carrito,
      total,
      fecha:new Date()
    });

    setCarrito([]);
  };

  return(
    <div className="layout">
      <Sidebar/>

      <div className="content">

        <h1>Ventas</h1>

        <div className="ventasContainer">

          <div>

            {productos.map(p=>(
              <div className="productoCard" key={p.id}>
                <h3>{p.nombre}</h3>
                <p>${p.precioVenta}</p>
                <button className="button" onClick={()=>agregar(p)}>Agregar</button>
              </div>
            ))}

          </div>

          <div className="carrito">

            {carrito.map((i,idx)=>(
              <p key={idx}>{i.nombre} x {i.cantidad}</p>
            ))}

            <h2>Total: ${total}</h2>

            <button className="button" onClick={vender}>
              Finalizar venta
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}