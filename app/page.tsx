"use client";

import { useEffect, useRef, useState } from "react";
import type QRCodeStyling from "qr-code-styling";
import { DotType, CornerSquareType, CornerDotType } from "qr-code-styling";
import {
  Sun,
  Moon,
  Download,
  Settings2,
  Image as ImageIcon,
} from "lucide-react";

export default function QRCodePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [options, setOptions] = useState({
    value: "https://nextjs.org",
    dotsType: "extra-rounded" as DotType,
    cornersSquareType: "extra-rounded" as CornerSquareType,
    cornersDotType: "dot" as CornerDotType,
    color: "#3b82f6",
    logo: null as string | null,
  });

  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  // Dark Mode Logik & Persistenz
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // QR-Code Initialisierung
  useEffect(() => {
    import("qr-code-styling").then((Module) => {
      qrCode.current = new Module.default({
        width: 280,
        height: 280,
        type: "svg",
        data: options.value,
        image: options.logo || "",
        dotsOptions: { color: options.color, type: options.dotsType },
        cornersSquareOptions: {
          color: options.color,
          type: options.cornersSquareType,
        },
        cornersDotOptions: {
          color: options.color,
          type: options.cornersDotType,
        },
        backgroundOptions: { color: "transparent" },
        imageOptions: { crossOrigin: "anonymous", margin: 8, excavate: true },
      });
      if (qrRef.current) qrCode.current.append(qrRef.current);
    });
  }, []);

  // Live-Update bei Änderungen
  useEffect(() => {
    qrCode.current?.update({
      data: options.value,
      image: options.logo || "",
      dotsOptions: { color: options.color, type: options.dotsType },
      cornersSquareOptions: {
        color: options.color,
        type: options.cornersSquareType,
      },
      cornersDotOptions: { color: options.color, type: options.cornersDotType },
    });
  }, [options]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setOptions((prev) => ({ ...prev, logo: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 p-4 md:p-8 text-slate-900 dark:text-slate-100 font-sans">
      {/* Navbar */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            QR
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase dark:text-white">
            Generator
          </h1>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all"
        >
          {darkMode ? (
            <Sun size={20} className="text-yellow-400" />
          ) : (
            <Moon size={20} className="text-slate-600" />
          )}
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Panel (4/12) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <section>
              <div className="flex items-center gap-2 mb-3 text-blue-600 dark:text-blue-400">
                <Settings2 size={18} />
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  Konfiguration
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase">
                    Ziel-URL / Text
                  </label>
                  <input
                    type="text"
                    className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={options.value}
                    onChange={(e) =>
                      setOptions((prev) => ({ ...prev, value: e.target.value }))
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase">
                      Punkt-Form
                    </label>
                    <select
                      className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 text-sm outline-none"
                      value={options.dotsType}
                      onChange={(e) =>
                        setOptions((prev) => ({
                          ...prev,
                          dotsType: e.target.value as DotType,
                        }))
                      }
                    >
                      <option value="squares">Eckig</option>
                      <option value="dots">Punkte</option>
                      <option value="rounded">Abgerundet</option>
                      <option value="extra-rounded">Liquid</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase">
                      Farbe
                    </label>
                    <div className="mt-1 flex gap-2 p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700">
                      <input
                        type="color"
                        className="w-full h-8 rounded-lg cursor-pointer bg-transparent border-none"
                        value={options.color}
                        onChange={(e) =>
                          setOptions((prev) => ({
                            ...prev,
                            color: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase">
                      Ecken-Rahmen
                    </label>
                    <select
                      className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 text-sm outline-none"
                      value={options.cornersSquareType}
                      onChange={(e) =>
                        setOptions((prev) => ({
                          ...prev,
                          cornersSquareType: e.target.value as CornerSquareType,
                        }))
                      }
                    >
                      <option value="square">Eckig</option>
                      <option value="dot">Rund</option>
                      <option value="extra-rounded">Soft</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase">
                      Ecken-Punkt
                    </label>
                    <select
                      className="w-full mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 text-sm outline-none"
                      value={options.cornersDotType}
                      onChange={(e) =>
                        setOptions((prev) => ({
                          ...prev,
                          cornersDotType: e.target.value as CornerDotType,
                        }))
                      }
                    >
                      <option value="square">Eckig</option>
                      <option value="dot">Rund</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3 text-blue-600 dark:text-blue-400">
                <ImageIcon size={18} />
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  Branding
                </h2>
              </div>
              <label className="group relative flex flex-col items-center justify-center w-full h-24 border-2 border-slate-200 dark:border-slate-700 border-dashed rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <span className="text-xs font-medium text-slate-500">
                  Logo hochladen
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
                {options.logo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl text-[10px] text-green-500 font-bold uppercase">
                    Logo geladen ✅
                  </div>
                )}
              </label>
            </section>
          </div>
        </div>

        {/* Preview Panel (8/12) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 min-h-[500px]">
          <div className="relative p-10 bg-white rounded-[2rem] shadow-2xl dark:shadow-blue-900/10 border border-slate-50">
            <div ref={qrRef} />
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4 w-full">
            <button
              onClick={() =>
                qrCode.current?.download({ name: "qr-code", extension: "png" })
              }
              className="group flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none active:scale-95"
            >
              <Download size={20} className="group-hover:bounce" /> PNG Export
            </button>
            <button
              onClick={() =>
                qrCode.current?.download({ name: "qr-code", extension: "svg" })
              }
              className="flex items-center gap-3 px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              SVG Vector
            </button>
          </div>
          <p className="mt-6 text-[11px] text-slate-400 uppercase tracking-widest font-medium">
            Hochenergie-Vorschau aktiviert
          </p>
        </div>
      </div>
    </main>
  );
}
