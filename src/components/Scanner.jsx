import { Html5QrcodeScanner } from "html5-qrcode";

import { useEffect } from "react";

export default function Scanner({ onScan }) {

  useEffect(() => {

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 5,
        qrbox: 250
      },
      false
    );

    scanner.render(
      (decodedText) => {

        onScan(decodedText);

      },
      (error) => {
        console.log(error);
      }
    );

  }, []);

  return (
    <div id="reader"></div>
  );

}