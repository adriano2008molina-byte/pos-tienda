import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      // 🔥 AQUÍ ESTÁ LO IMPORTANTE
      navigate("/dashboard");

    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="container">

      <div className="card">

        <h1>POS TIENDA</h1>

        <input
          className="input"
          placeholder="Correo"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="button" onClick={login}>
          Iniciar sesión
        </button>

      </div>

    </div>
  );
}