import { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";

import { db } from "../firebase";

import Sidebar from "../components/Sidebar";

import "../styles/auth.css";

export default function Clientes() {

  const [nombre,setNombre] =
    useState("");

  const [telefono,setTelefono] =
    useState("");

  const [direccion,setDireccion] =
    useState("");

  const [clientes,setClientes] =
    useState([]);

  const guardarCliente = async () => {

    if(
      !nombre ||
      !telefono ||
      !direccion
    ){
      return alert(
        "Completa todos los campos"
      );
    }

    await addDoc(
      collection(db,"clientes"),
      {
        nombre,
        telefono,
        direccion,
        fecha:new Date()
      }
    );

    setNombre("");
    setTelefono("");
    setDireccion("");

  };

  useEffect(()=>{

    const unsubscribe =
      onSnapshot(
        collection(db,"clientes"),
        (snapshot)=>{

          const lista=[];

          snapshot.forEach((doc)=>{

            lista.push({
              id:doc.id,
              ...doc.data()
            });

          });

          setClientes(lista);

        }
      );

    return ()=>unsubscribe();

  },[]);

  const eliminarCliente =
    async(id)=>{

      await deleteDoc(
        doc(db,"clientes",id)
      );

    };

  return (

    <div className="layout">

      <Sidebar />

      <div className="content">

        <h1>Clientes</h1>

        <br />

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
            placeholder="Teléfono"
            value={telefono}
            onChange={(e)=>
              setTelefono(e.target.value)
            }
          />

          <input
            className="input"
            placeholder="Dirección"
            value={direccion}
            onChange={(e)=>
              setDireccion(e.target.value)
            }
          />

          <button
            className="button"
            onClick={guardarCliente}
          >
            Guardar Cliente
          </button>

        </div>

        <br />

        <div className="productosGrid">

          {clientes.map((cliente)=>(

            <div
              className="productoCard"
              key={cliente.id}
            >

              <h2>
                {cliente.nombre}
              </h2>

              <p>
                📞 {cliente.telefono}
              </p>

              <p>
                📍 {cliente.direccion}
              </p>

              <button
                className="deleteBtn"
                onClick={()=>
                  eliminarCliente(cliente.id)
                }
              >
                Eliminar
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}