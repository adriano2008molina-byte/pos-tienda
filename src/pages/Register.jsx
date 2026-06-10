import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword
} from "firebase/auth";

import {
  doc,
  setDoc
} from "firebase/firestore";

import { auth, db } from "../firebase";

export default function Register() {

  const navigate = useNavigate();

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

      await setDoc(
        doc(db, "users", user.uid),
        {
          email,
          role: "admin",
          createdAt: new Date()
        }
      );

      alert("Cuenta creada correctamente");

      navigate("/");

    } catch (error) {

      alert(error.message);

    }

  };

  return (

    <div className="container">
 <img
  src="https://cdn-icons-png.flaticon.com/512/415/415733.png"
  className="floating1"
  alt=""
/>

<img
  src="https://cdn-icons-png.flaticon.com/512/2909/2909763.png"
  className="floating2"
  alt=""
/>

<img
  src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png"
  className="floating3"
  alt=""
/>
      <div className="card registerCard">

      

       <h1 className="tituloRegistro">
  Registro
</h1>

<h2 className="subtituloRegistro">
  TIENDA JEROMY
</h2>

        <input
          className="input"
          placeholder="Correo"
          value={email}
          onChange={(e)=>
            setEmail(e.target.value)
          }
        />

        <input
          className="input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e)=>
            setPassword(e.target.value)
          }
        />

        <button
          className="button"
          onClick={register}
        >
          Crear Cuenta
        </button>

        <button
          className="backBtn"
          style={{
            width:"100%",
            marginTop:"10px"
          }}
          onClick={()=>
            navigate("/")
          }
        >
          Volver al Login
        </button>

      </div>

    </div>

  );

}