import { useNavigate } from "react-router-dom";

export default function BotonRegresar(){

  const navigate = useNavigate();

  return(

    <button
      className="backBtn"
      onClick={()=>navigate(-1)}
    >
      ← Regresar
    </button>

  );

}