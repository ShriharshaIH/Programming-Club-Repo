import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginComp from "./loginComp";
import AdminDashboard from './AdminDashboard';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LoginComp />} /> {/* Corrected path */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* New route for AdminDashboard */}
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
