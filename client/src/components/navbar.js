import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo.png";


export default function Navbar() {

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('usuario');
    localStorage.removeItem('userId');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar navbar-expand-lg p-3" style={{ backgroundColor: "#7fa483" }}>
      
      <NavLink className="navbar-brand d-flex align-items-center" to="/">
        <img 
          src={Logo} 
          alt="Logo" 
          style={{ width: "52px", marginRight: "12px" }} 
        />
        <strong>EquilibraPro</strong>
      </NavLink>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto align-items-center">

          <li className="nav-item">
            <NavLink className="nav-link" to="/home">
              Home
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/receitas">
              Receitas
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/feed">
              Feed
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/lista">
              Lista de Compras
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/perfil">
              Meu Perfil
            </NavLink>
          </li>

          {role === "admin" && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/ingredientes">
                  Ingredientes
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">
                  Admin
                </NavLink>
              </li>
            </>
          )}

          {token ? (
            <li className="nav-item ms-3">
              <button
                className="btn btn-outline-dark"
                onClick={handleLogout}
              >
                Sair
              </button>
            </li>
          ) : (
            <li className="nav-item ms-3">
              <NavLink className="btn btn-outline-dark" to="/login">
                Entrar
              </NavLink>
            </li>
          )}

        </ul>
      </div>
    </nav>
  );
}
