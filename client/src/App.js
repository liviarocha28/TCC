import { useState } from 'react';
import {
    Route,
    Routes,
    Navigate
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



const App = () => {

    const [token, setToken] = useState(
        localStorage.getItem('token')
    );

    const role = localStorage.getItem('role');



    return (

        <div className="d-flex flex-column min-vh-100">

            <Navbar />

            <main className="flex-fill container my-4">

                <Routes>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/home"
                        element={<Home />}
                    />


                    <Route
                        path="/login"
                        element={
                            <Login
                                onLogin={(token) => {

                                    localStorage.setItem(
                                        'token',
                                        token
                                    );

                                    setToken(token);

                                }}
                            />
                        }
                    />


                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/cadastro"
                        element={<Cadastro />}
                    />



                    <Route
                        path="/receitas"
                        element={<Receitas />}
                    />

                    <Route
                        path="/feed"
                        element={<Feed />}
                    />

                    <Route
                        path="/lista"
                        element={<Lista />}
                    />



                    <Route
                        path="/ingredientes"
                        element={<Ingredientes />}
                    />



                    <Route
                        path="/users"
                        element={
                            role === "admin"
                                ? <UserList />
                                : <Navigate to="/" replace />
                        }
                    />



                    <Route
                        path="/edit/:id"
                        element={
                            role === "admin"
                                ? <Edit />
                                : <Navigate to="/" replace />
                        }
                    />



                    <Route
                        path="/create"
                        element={
                            role === "admin"
                                ? <Create />
                                : <Navigate to="/" replace />
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            role === "admin"
                                ? (
                                    <div>

                                        <h1>
                                            Painel Administrativo
                                        </h1>

                                        <p>
                                            Bem-vinda ao painel do administrador.
                                        </p>

                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "repeat(auto-fit, minmax(220px, 1fr))",
                                                gap: "20px",
                                                marginTop: "30px"
                                            }}
                                        >

                                            <div
                                                style={{
                                                    background: "#f4f4f0",
                                                    padding: "25px",
                                                    borderRadius: "15px"
                                                }}
                                            >
                                                <h3>
                                                    Usuários
                                                </h3>

                                                <p>
                                                    Gerencie todos os usuários cadastrados.
                                                </p>
                                            </div>

                                            <div
                                                style={{
                                                    background: "#f4f4f0",
                                                    padding: "25px",
                                                    borderRadius: "15px"
                                                }}
                                            >
                                                <h3>
                                                    Ingredientes
                                                </h3>

                                                <p>
                                                    Controle ingredientes e informações nutricionais.
                                                </p>
                                            </div>

                                            <div
                                                style={{
                                                    background: "#f4f4f0",
                                                    padding: "25px",
                                                    borderRadius: "15px"
                                                }}
                                            >
                                                <h3>
                                                    Receitas
                                                </h3>

                                                <p>
                                                    Adicione, edite e exclua receitas.
                                                </p>
                                            </div>

                                            <div
                                                style={{
                                                    background: "#f4f4f0",
                                                    padding: "25px",
                                                    borderRadius: "15px"
                                                }}
                                            >
                                                <h3>
                                                    Feed
                                                </h3>

                                                <p>
                                                    Visualize todas as postagens da comunidade.
                                                </p>
                                            </div>

                                        </div>

                                    </div>
                                )
                                : <Navigate to="/" replace />
                        }
                    />


                    <Route
                        path="*"
                        element={<Navigate to="/" replace />}
                    />

                </Routes>

            </main>

            <Footer />

        </div>
    );
};

export default App;