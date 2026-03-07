"use client";

import { useEffect, useRef, useState } from "react";
import type QRCodeStyling from "qr-code-styling";
import { DotType, CornerSquareType } from "qr-code-styling";
import { Sun, Moon, Download, Share2 } from "lucide-react";

export default function QRCodePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [options, setOptions] = useState({
    value: "https://nextjs.org",
    dotsType: "squares" as DotType,
    cornersType: "square" as CornerSquareType,
    color: "#3b82f6", // Ein schönes Blau als Standard
    logo: null as string | null,
  });

  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  // Dark Mode Effekt: Fügt die 'dark' Klasse zum HTML-Tag hinzu
  // Dark Mode Effekt
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      console.log("Dark Mode aktiv"); // Debugging
    } else {
      root.classList.remove("dark");
      console.log("Light Mode aktiv"); // Debugging
    }
  }, [darkMode]);

  // Initialisierung & Update (wie zuvor)
  useEffect(() => {
    import("qr-code-styling").then((Module) => {
      qrCode.current = new Module.default({
        width: 280,
        height: 280,
        data: options.value,
        image: options.logo || "",
        dotsOptions: { color: options.color, type: options.dotsType },
        cornersSquareOptions: {
          color: options.color,
          type: options.cornersType,
        },
        backgroundOptions: { color: "transparent" }, // Transparent ist besser für Dark Mode Previews
        imageOptions: { crossOrigin: "anonymous", margin: 5, excavate: true },
      });
      if (qrRef.current) qrCode.current.append(qrRef.current);
    });
  }, []);

  useEffect(() => {
    qrCode.current?.update({
      data: options.value,
      image: options.logo || "",
      dotsOptions: { color: options.color, type: options.dotsType },
      cornersSquareOptions: { color: options.color, type: options.cornersType },
    });
  }, [options]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 p-4 md:p-10 text-slate-900 dark:text-slate-100">
      {/* Header mit Toggle */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black italic tracking-tighter text-blue-600 dark:text-blue-400">
          QR-Generator
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-md hover:scale-110 transition-transform"
        >
          {darkMode ? (
            <Sun size={20} className="text-yellow-400" />
          ) : (
            <Moon size={20} className="text-slate-600" />
          )}
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200 dark:border-slate-800">
        {/* Sidebar */}
        <div className="w-full md:w-96 p-8 bg-slate-100 dark:bg-slate-800/50 space-y-6">
          <section>
            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              Inhalt - was soll der QR-Code darstellen?
            </label>
            <input
              type="text"
              className="w-full mt-1 p-3 rounded-xl border-none shadow-sm dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
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
                className="w-full mt-1 p-2 rounded-lg bg-white dark:bg-slate-700 border-none shadow-sm text-sm"
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
                Farbe
              </label>
              <input
                type="color"
                className="w-full mt-1 h-9 rounded-lg cursor-pointer border-none bg-transparent"
                value={options.color}
                onChange={(e) =>
                  setOptions((prev) => ({ ...prev, color: e.target.value }))
                }
              />
            </div>
          </section>

          <section>
            <label className="text-xs font-bold uppercase text-slate-500">
              Logo Upload
            </label>
            <div className="mt-1 flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 dark:hover:bg-slate-700 dark:bg-slate-700 hover:bg-slate-100 dark:border-slate-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
                    Bild wählen
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () =>
                        setOptions((prev) => ({
                          ...prev,
                          logo: reader.result as string,
                        }));
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </section>
        </div>

        {/* Preview Area */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center bg-white dark:bg-slate-900">
          <div className="p-8 bg-white rounded-2xl shadow-inner border border-slate-100 dark:border-slate-800">
            <div ref={qrRef} />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-xs">
            <button
              onClick={() =>
                qrCode.current?.download({ name: "qr", extension: "png" })
              }
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
            >
              <Download size={18} /> PNG
            </button>
            <button
              onClick={() =>
                qrCode.current?.download({ name: "qr", extension: "svg" })
              }
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
            >
              SVG
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
