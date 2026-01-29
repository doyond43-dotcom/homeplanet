import React from "react";

import './global.css';
import { AuthProvider } from "./auth/AuthProvider";
import ReactDOM from "react-dom/client";
import App from "./App";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider><App /></AuthProvider>
  </React.StrictMode>
);



