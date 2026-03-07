"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodePage() {
  // States für die QR-Konfiguration
  const [value, setValue] = useState("https://nextjs.org");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [logo, setLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(50);

  // Hilfsfunktion für den Logo-Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Download-Funktion
  const downloadQRCode = () => {
    const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qrcode-generator.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-gray-900">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100 flex flex-col md:flex-row gap-8">
        {/* Linke Seite: Einstellungen */}
        <div className="flex-1 space-y-6">
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            QR Generator
          </h1>

          <div className="space-y-4">
            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Inhalt / URL
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none border-gray-200"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="https://deine-seite.de"
              />
            </div>

            {/* Design Optionen */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Farbe
                </label>
                <input
                  type="color"
                  className="w-full h-10 border rounded-lg cursor-pointer p-1"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Größe (px)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-lg border-gray-200"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Logo (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              {logo && (
                <div className="mt-2 flex items-center gap-4">
                  <label className="text-xs text-gray-500 whitespace-nowrap">
                    Logo Größe:
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={logoSize}
                    onChange={(e) => setLogoSize(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <button
                    onClick={() => setLogo(null)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Entfernen
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rechte Seite: Preview & Action */}
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-xl p-6 border border-gray-100 border-dashed">
          <div className="bg-white p-4 shadow-md rounded-lg">
            <QRCodeCanvas
              id="qr-canvas"
              value={value || " "}
              size={size}
              fgColor={fgColor}
              level={"H"}
              includeMargin={true}
              imageSettings={
                logo
                  ? {
                      src: logo,
                      height: logoSize,
                      width: logoSize,
                      excavate: true,
                    }
                  : undefined
              }
            />
          </div>

          <button
            onClick={downloadQRCode}
            disabled={!value}
            className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 active:scale-95"
          >
            Download PNG
          </button>
          <p className="mt-4 text-xs text-gray-400 text-center">
            Tipp: Nutze helle Logos auf dunklen QR-Farben für optimalen
            Kontrast.
          </p>
        </div>
      </div>
    </main>
  );
}
