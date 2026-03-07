"use client";

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodePage() {
  const [value, setValue] = useState("https://nextjs.org");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");

  const downloadQRCode = () => {
    const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qrcode.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-gray-900">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          QR Code Generator
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Inhalt (URL oder Text)
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="https://deine-seite.de"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Farbe</label>
              <input
                type="color"
                className="w-full h-10 border rounded-lg cursor-pointer"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Größe (px)
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-lg"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div className="p-4 bg-white border-2 border-dashed border-gray-200 rounded-xl shadow-inner">
            <QRCodeCanvas
              id="qr-canvas"
              value={value || " "}
              size={size}
              fgColor={fgColor}
              level={"H"} // Hohe Fehlerkorrektur
              includeMargin={true}
            />
          </div>

          <button
            onClick={downloadQRCode}
            disabled={!value}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            Download PNG
          </button>
        </div>
      </div>
    </main>
  );
}
