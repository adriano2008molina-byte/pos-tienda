import { useState } from "react";

import {
  createUserWithEmailAndPassword
} from "firebase/auth";

import {
  doc,
  setDoc
} from "firebase/firestore";

import { auth, db } from "../firebase";

export default function Register() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const register = async () => {

    try {

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: email,
        role: "admin",
        createdAt: new Date()
      });

      alert("Cuenta creada");

    } catch (error) {

      alert(error.message);

    }

  };

  return (

    <div>

      <h1>Registro POS Tienda</h1>

      <input
        type="email"
        placeholder="Correo"
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br /><br />

      <input
        type="password"
        placeholder="Contraseña"
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br /><br />

      <button onClick={register}>
        Crear Cuenta
      </button>

    </div>

  );

}