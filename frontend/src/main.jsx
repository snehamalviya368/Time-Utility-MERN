import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./styles/style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              background: "#1e293b",
              color: "#f1f5f9",
              fontSize: "14px",
              padding: "12px 16px"
            },
            success: {
              iconTheme: { primary: "#22c55e", secondary: "#f1f5f9" }
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#f1f5f9" }
            }
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);