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

  <img
    src="/logo.png"
    alt="TIENDA JEROMY"
    className="logoLogin"
  />

  <div className="card"></div>
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

<h1 className="logoTitulo">
  TIENDA JEROMY
</h1>
      <div className="card">

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
        <p
  style={{
    textAlign:"center",
    marginTop:"15px"
  }}
>
  ¿No tienes cuenta?
</p>

<button
  className="button"
  style={{
    width:"100%",
    marginTop:"10px",
    background:"#22c55e"
  }}
  onClick={()=>
    navigate("/register")
  }
>
  📝 Registrarme
</button>

      </div>

    </div>
  );
}