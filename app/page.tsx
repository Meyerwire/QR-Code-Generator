"use client";

import { useEffect, useRef, useState } from "react";
import type QRCodeStyling from "qr-code-styling";
import { DotType, CornerSquareType, CornerDotType } from "qr-code-styling";

export default function QRCodePage() {
  const [options, setOptions] = useState({
    value: "https://nextjs.org",
    dotsType: "squares" as DotType,
    cornersType: "square" as CornerSquareType,
    color: "#000000",
    logo: null as string | null,
  });

  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  // Dynamischer Import der Library (wichtig für Next.js SSR)
  useEffect(() => {
    import("qr-code-styling").then((Module) => {
      qrCode.current = new Module.default({
        width: 300,
        height: 300,
        type: "svg",
        data: options.value,
        image: options.logo || "",
        dotsOptions: { color: options.color, type: options.dotsType },
        cornersSquareOptions: {
          color: options.color,
          type: options.cornersType,
        },
        backgroundOptions: { color: "#ffffff" },
        imageOptions: { crossOrigin: "anonymous", margin: 5, excavate: true },
      });

      if (qrRef.current) {
        qrCode.current.append(qrRef.current);
      }
    });
  }, []);

  // Update-Effekt bei jeder Änderung der Stats
  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({
        data: options.value,
        image: options.logo || "",
        dotsOptions: { color: options.color, type: options.dotsType },
        cornersSquareOptions: {
          color: options.color,
          type: options.cornersType,
        },
      });
    }
  }, [options]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOptions((prev) => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const download = (ext: "png" | "svg") => {
    qrCode.current?.download({ name: "qr-code", extension: ext });
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-900">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar: Controls */}
        <div className="w-full md:w-96 p-8 bg-slate-100 space-y-6">
          <h1 className="text-2xl font-black italic tracking-tighter text-blue-600">
            QR-DESIGNER
          </h1>

          <div className="space-y-4">
            <section>
              <label className="text-xs font-bold uppercase text-slate-500">
                Inhalt
              </label>
              <input
                type="text"
                className="w-full mt-1 p-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-blue-500"
                value={options.value}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, value: e.target.value }))
                }
              />
            </section>

            <section className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">
                  Punkt-Stil
                </label>
                <select
                  className="w-full mt-1 p-2 rounded-lg bg-white border-none shadow-sm text-sm"
                  value={options.dotsType}
                  onChange={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      dotsType: e.target.value as DotType,
                    }))
                  }
                >
                  <option value="squares">Klassisch</option>
                  <option value="dots">Punkte</option>
                  <option value="rounded">Abgerundet</option>
                  <option value="extra-rounded">Liquid</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">
                  Ecken-Stil
                </label>
                <select
                  className="w-full mt-1 p-2 rounded-lg bg-white border-none shadow-sm text-sm"
                  value={options.cornersType}
                  onChange={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      cornersType: e.target.value as CornerSquareType,
                    }))
                  }
                >
                  <option value="square">Eckig</option>
                  <option value="dot">Rund</option>
                  <option value="extra-rounded">Soft</option>
                </select>
              </div>
            </section>

            <section>
              <label className="text-xs font-bold uppercase text-slate-500">
                Farbe
              </label>
              <input
                type="color"
                className="w-full mt-1 h-10 rounded-lg cursor-pointer border-none shadow-sm"
                value={options.color}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, color: e.target.value }))
                }
              />
            </section>

            <section>
              <label className="text-xs font-bold uppercase text-slate-500">
                Logo
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full mt-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white"
                onChange={handleLogoUpload}
              />
            </section>
          </div>
        </div>

        {/* Main Area: Preview */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center space-y-8 bg-white">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div
              ref={qrRef}
              className="relative bg-white p-6 rounded-xl shadow-inner border border-slate-100"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => download("png")}
              className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
            >
              PNG Export
            </button>
            <button
              onClick={() => download("svg")}
              className="px-8 py-3 bg-white border-2 border-slate-900 text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95"
            >
              SVG Vector
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
