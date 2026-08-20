import { useState } from 'react';
import {
    Route,
    Routes,
    Navigate,
    useLocation
} from "react-router-dom";

import Navbar from "./components/navbar";
import Footer from "./components/footer";

import Home from "./components/home/home";
import Login from "./components/Login";
import Register from "./components/Register";
import Cadastro from "./components/cadastro/cadastro";

import UserList from "./components/userList";
import Edit from "./components/edit";
import Create from "./components/create";

import Receitas from "./components/receitas/receitas";
import Feed from "./components/feed/feed";
import Lista from "./components/lista/lista";
import Ingredientes from "./components/ingredientes/ingredientes";
import Perfil from "./components/perfil/perfil";



const ProtectedRoute = ({ children, requireAdmin = false }) => {

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && role !== "admin") {
        return <Navigate to="/home" replace />;
    }

    return children;
};



const App = () => {

    const [token, setToken] = useState(
        localStorage.getItem('token')
    );

    const role = localStorage.getItem('role');
    const location = useLocation();

    const isAuthPage =
        location.pathname === '/login' ||
        location.pathname === '/register';



    return (

        <div className="d-flex flex-column min-vh-100">

            {!isAuthPage && <Navbar />}

            <main className="flex-fill container my-4">

                <Routes>

                    <Route
                        path="/login"
                        element={
                            token
                                ? <Navigate to={
                                    role === "admin"
                                        ? "/admin"
                                        : "/home"
                                  } replace />
                                : <Login
                                    onLogin={(tok) => {
                                        localStorage.setItem('token', tok);
                                        setToken(tok);
                                    }}
                                  />
                        }
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/receitas"
                        element={
                            <ProtectedRoute>
                                <Receitas />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/feed"
                        element={
                            <ProtectedRoute>
                                <Feed />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/lista"
                        element={
                            <ProtectedRoute>
                                <Lista />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/perfil"
                        element={
                            <ProtectedRoute>
                                <Perfil />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/ingredientes"
                        element={
                            <ProtectedRoute requireAdmin>
                                <Ingredientes />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/cadastro"
                        element={
                            <ProtectedRoute>
                                <Cadastro />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute requireAdmin>
                                <UserList />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/edit/:id"
                        element={
                            <ProtectedRoute requireAdmin>
                                <Edit />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/create"
                        element={
                            <ProtectedRoute requireAdmin>
                                <Create />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute requireAdmin>
                                <div>
                                    <h1>Painel Administrativo</h1>
                                    <p>Bem-vinda ao painel do administrador.</p>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                                        gap: "20px",
                                        marginTop: "30px"
                                    }}>
                                        <div style={{ background: "#f4f4f0", padding: "25px", borderRadius: "15px" }}>
                                            <h3>Usuários</h3>
                                            <p>Gerencie todos os usuários cadastrados.</p>
                                        </div>
                                        <div style={{ background: "#f4f4f0", padding: "25px", borderRadius: "15px" }}>
                                            <h3>Ingredientes</h3>
                                            <p>Controle ingredientes e informações nutricionais.</p>
                                        </div>
                                        <div style={{ background: "#f4f4f0", padding: "25px", borderRadius: "15px" }}>
                                            <h3>Receitas</h3>
                                            <p>Adicione, edite e exclua receitas.</p>
                                        </div>
                                        <div style={{ background: "#f4f4f0", padding: "25px", borderRadius: "15px" }}>
                                            <h3>Feed</h3>
                                            <p>Visualize todas as postagens da comunidade.</p>
                                        </div>
                                    </div>
                                </div>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="*"
                        element={<Navigate to="/" replace />}
                    />

                </Routes>

            </main>

            {!isAuthPage && <Footer />}

        </div>
    );
};

export default App;
