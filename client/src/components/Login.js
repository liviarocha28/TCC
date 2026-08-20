import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const REACT_APP_YOUR_HOSTNAME =
    'http://localhost:5051';

export default function Login({ onLogin }) {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const goToRegister = () => {
        navigate('/register');
    };



    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            const response = await fetch(
                `${REACT_APP_YOUR_HOSTNAME}/user/login`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        email: email,
                        senha: password
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setError(
                    data.mensagem || 'Erro no login'
                );

                return;
            }



            // SALVA TOKEN

            localStorage.setItem(
                'token',
                data.token
            );



            // SALVA ROLE

            localStorage.setItem(
                'role',
                data.role
            );



            // SALVA NOME

            localStorage.setItem(
                'usuario',
                data.usuario
            );



            // SALVA USERID

            localStorage.setItem(
                'userId',
                data.userId
            );



            onLogin(data.token);



            // REDIRECIONA ADMIN

            if (data.role === "admin") {

                navigate('/admin');

            } else {

                navigate('/home');
            }

        } catch (error) {

            setError(
                'Erro na conexão com o servidor'
            );
        }
    }



    return (

        <div className="container w-50">

            <h2>Login</h2>

            {error && (
                <p className="text-danger">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label>Email</label>

                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                </div>

                <div className="mb-3">

                    <label>Senha</label>

                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                </div>

                <div className="mb-3">

                    <button className="btn btn-primary">
                        Entrar
                    </button>

                </div>

            </form>

            <button
                className="btn btn-secondary"
                onClick={goToRegister}
            >
                Quero me registrar!
            </button>

        </div>
    )
}