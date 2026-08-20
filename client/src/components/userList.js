import React, { useState, useEffect } from "react"
import "./userList.css"

const REACT_APP_YOUR_HOSTNAME = 'http://localhost:5051';

const UserCard = ({ record, deleteRecord }) => {
    return (
        <div className="user-card">
            <div className="user-info">
                <h4>{record.name}</h4>
                <p>{record.email}</p>
                <span className={`user-role ${record.role === 'admin' ? 'admin' : 'user'}`}>
                    {record.role === 'admin' ? 'Admin' : 'Usuário'}
                </span>
            </div>
            <div className="user-actions">
                {record.role !== 'admin' && (
                    <button
                        className="btn-user-delete"
                        onClick={() => deleteRecord(record._id)}
                    >
                        Excluir
                    </button>
                )}
            </div>
        </div>
    )
}

export default function UserList() {
    const [users, setUsers] = useState([])
    const [busca, setBusca] = useState('')

    useEffect(() => {
        async function getUsers() {
            const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/user/`)
            if (!response.ok) {
                window.alert(`Erro: ${response.statusText}`)
                return
            }
            const users = await response.json()
            setUsers(users)
        }
        getUsers()
    }, [])

    async function deleteRecord(id) {
        const result = window.confirm("Deseja excluir este usuário?")
        if (!result) return

        await fetch(`${REACT_APP_YOUR_HOSTNAME}/${id}`, {
            method: "DELETE"
        })

        setUsers(users.filter((record) => record._id !== id))
    }

    const filtrados = users.filter((u) =>
        u.name?.toLowerCase().includes(busca.toLowerCase()) ||
        u.email?.toLowerCase().includes(busca.toLowerCase())
    )

    return (
        <div className="userlist-container">
            <h2>Usuários Cadastrados</h2>
            <p className="subtitle">{users.length} usuário(s) no sistema</p>

            <input
                className="user-search"
                placeholder="Buscar por nome ou email..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
            />

            <div className="user-grid">
                {filtrados.map((record) => (
                    <UserCard
                        key={record._id}
                        record={record}
                        deleteRecord={deleteRecord}
                    />
                ))}
            </div>

            {filtrados.length === 0 && (
                <p className="no-results">Nenhum usuário encontrado.</p>
            )}
        </div>
    )
}
