import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import App from "./App";

const basePath = import.meta.env.VITE_BASE_PATH || "";
console.log(basePath);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={basePath}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
