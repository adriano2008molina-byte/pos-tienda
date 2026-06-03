import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";

import { db } from "../firebase";

import Sidebar from "../components/Sidebar";

import BotonRegresar from "../components/BotonRegresar";

import "../styles/auth.css";

export default function Clientes() {

  const [nombre, setNombre] = useState("");

  const [telefono, setTelefono] = useState("");

  const [direccion, setDireccion] = useState("");

  const [clientes, setClientes] = useState([]);

  // ===== GUARDAR =====

  const guardarCliente = async () => {

    if (!nombre) {
      return alert("Ingrese nombre");
    }

    await addDoc(
      collection(db, "clientes"),
      {
        nombre,
        telefono,
        direccion
      }
    );

    setNombre("");
    setTelefono("");
    setDireccion("");

    alert("Cliente agregado");

  };

  // ===== CARGAR =====

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "clientes"),
      (snapshot) => {

        const lista = [];

        snapshot.forEach((docu) => {

          lista.push({
            id: docu.id,
            ...docu.data()
          });

        });

        setClientes(lista);

      }
    );

    return () => unsubscribe();

  }, []);

  // ===== ELIMINAR =====

  const eliminarCliente = async (id) => {

    await deleteDoc(
      doc(db, "clientes", id)
    );

  };

  return (

    <div className="layout">

      <Sidebar />

      <div className="content">

        <BotonRegresar />

        <h1>Clientes</h1>

        {/* ===== FORMULARIO ===== */}

        <div className="card">

          <input
            className="input"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) =>
              setNombre(e.target.value)
            }
          />

          <input
            className="input"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) =>
              setTelefono(e.target.value)
            }
          />

          <input
            className="input"
            placeholder="Dirección"
            value={direccion}
            onChange={(e) =>
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

        {/* ===== LISTA ===== */}

        <div className="productosGrid">

          {clientes.map((cliente) => (

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
                onClick={() =>
                  eliminarCliente(
                    cliente.id
                  )
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