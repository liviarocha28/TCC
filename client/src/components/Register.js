import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const REACT_APP_YOUR_HOSTNAME = 'http://localhost:5051';

export default function Register() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMensagem('');

        try {
            const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/user/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: nome, email, senha })
            });

            const data = await response.json();

            if (!response.ok) {
                return setMensagem(data.message || 'Erro ao registrar');
            }

            setMensagem('Usuario registrado com sucesso!');

            setNome('');
            setEmail('');
            setSenha('');

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            setMensagem('Erro ao conectar com o servidor');
        }
    };

    return (
        <div className="container w-50">
            <form className="form" onSubmit={handleRegister}>

                <h3 className="text-center">Registro</h3>

                {mensagem && <p className="text-danger">{mensagem}</p>}

                <div className="form-group">
                    <label>Nome:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Senha:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group d-flex justify-content-between mt-4">
                    <button className="btn btn-primary">
                        Registrar
                    </button>

                    <button 
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/login")}
                    >
                        Voltar para login
                    </button>
                </div>

            </form>
        </div>
    );
}