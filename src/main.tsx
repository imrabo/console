import React from "react";
import ReactDOM from "react-dom/client";
import "maplibre-gl/dist/maplibre-gl.css";
import "@/styles/globals.css";
import AppRoutes from "@/route";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>,
);
