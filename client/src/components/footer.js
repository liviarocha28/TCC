import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#cdd8c8" }} className="py-4">
      <div className="container text-center">

        <h4 className="mb-2">EquilibraPro</h4>

        <p className="mb-1">
          Visualize receitas, organize sua alimentação e compartilhe sua jornada.
        </p>

        <p className="mb-1">
          MongoDB + Express + React + Node.js = MERN
        </p>

        <div className="d-flex justify-content-center gap-3">
          <a
            href="livialdarocha@gmail.com"
            className="text-dark"
            target="_blank"
            rel="noopener noreferrer"
          >
            E-mail
          </a>

          <a
            href="https://www.instagram.com/equilibraprobr"
            className="text-dark"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>

        </div>

        <p style={{ fontSize: "12px", marginTop: "10px", color: "#555" }}>
          © {new Date().getFullYear()} EquilibraPro
        </p>

      </div>
    </footer>
  );
}