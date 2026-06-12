import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function Scanner({ onScan }) {

  useEffect(() => {
    setTimeout(() => {

  const permiso = document.querySelector(
    "#reader button"
  );

  if(permiso){
    permiso.textContent =
      "📷 Activar Cámara";
  }

  const archivo = document.querySelector(
    "#reader__dashboard_section_swaplink"
  );

  if(archivo){
    archivo.textContent =
      "🖼 Escanear desde Imagen";
  }

},1000);

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250
      },
      false
    );

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };

  }, [onScan]);

  return (
    <div id="reader"></div>
  );
}