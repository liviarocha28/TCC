import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./perfil.css";

const REACT_APP_YOUR_HOSTNAME = 'http://localhost:5051';

export default function Perfil() {

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState("pessoais");

  // Dados pessoais
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  // Dados do cadastro
  const [dataNascimento, setDataNascimento] = useState("");
  const [genero, setGenero] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [atividade, setAtividade] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [restricoes, setRestricoes] = useState([]);
  const [condicoes, setCondicoes] = useState([]);

  // Backup para cancelar edições
  const [backupPessoais, setBackupPessoais] = useState({});
  const [backupCadastro, setBackupCadastro] = useState({});

  const [editandoPessoais, setEditandoPessoais] = useState(false);
  const [editandoCadastro, setEditandoCadastro] = useState(false);

  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    if (!userId || !token) {
      navigate("/login");
      return;
    }

    async function carregarPerfil() {
      try {
        const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/user/perfil/${userId}`);
        if (!response.ok) return;
        const data = await response.json();

        setName(data.name || "");
        setEmail(data.email || "");
        setDataNascimento(data.dataNascimento || "");
        setGenero(data.genero || "");
        setPeso(data.peso || "");
        setAltura(data.altura || "");
        setAtividade(data.atividade || "");
        setObjetivo(data.objetivo || "");
        setRestricoes(data.restricoes || []);
        setCondicoes(data.condicoes || []);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
      setCarregando(false);
    }

    carregarPerfil();
  }, [userId, token, navigate]);

  const handleCheckboxChange = (valor, estado, setEstado) => {
    if (estado.includes(valor)) {
      setEstado(estado.filter((item) => item !== valor));
    } else {
      setEstado([...estado, valor]);
    }
  };

  const iniciarEdicaoPessoais = () => {
    setBackupPessoais({ name, email });
    setEditandoPessoais(true);
    setMensagem("");
  };

  const cancelarEdicaoPessoais = () => {
    setName(backupPessoais.name);
    setEmail(backupPessoais.email);
    setEditandoPessoais(false);
    setMensagem("");
  };

  const iniciarEdicaoCadastro = () => {
    setBackupCadastro({ dataNascimento, genero, peso, altura, atividade, objetivo, restricoes: [...restricoes], condicoes: [...condicoes] });
    setEditandoCadastro(true);
    setMensagem("");
  };

  const cancelarEdicaoCadastro = () => {
    setDataNascimento(backupCadastro.dataNascimento);
    setGenero(backupCadastro.genero);
    setPeso(backupCadastro.peso);
    setAltura(backupCadastro.altura);
    setAtividade(backupCadastro.atividade);
    setObjetivo(backupCadastro.objetivo);
    setRestricoes(backupCadastro.restricoes);
    setCondicoes(backupCadastro.condicoes);
    setEditandoCadastro(false);
    setMensagem("");
  };

  const salvarPessoais = async () => {
    setMensagem("");
    try {
      const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/user/update/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      });

      if (!response.ok) {
        setMensagem("Erro ao salvar dados pessoais");
        return;
      }

      localStorage.setItem('usuario', name);
      setEditandoPessoais(false);
      setMensagem("Dados pessoais salvos com sucesso!");
    } catch (error) {
      setMensagem("Erro ao conectar com o servidor");
    }
  };

  const salvarCadastro = async () => {
    setMensagem("");
    const idadeCalculada = calcularIdade(dataNascimento);

    const dados = {
      dataNascimento,
      idade: idadeCalculada,
      genero,
      peso: Number(peso),
      altura: Number(altura),
      atividade,
      objetivo,
      restricoes,
      condicoes,
    };

    try {
      const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/user/cadastro/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });

      if (!response.ok) {
        setMensagem("Erro ao salvar cadastro");
        return;
      }

      setEditandoCadastro(false);
      setMensagem("Dados do cadastro salvos com sucesso!");
    } catch (error) {
      setMensagem("Erro ao conectar com o servidor");
    }
  };

  const calcularIdade = (data) => {
    if (!data) return 0;
    const hoje = new Date();
    const nascimento = new Date(data);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) idade--;
    return idade;
  };

  const labelGenero = { "Feminino": "Feminino", "Masculino": "Masculino", "Outro": "Outro" };
  const labelAtividade = { "Sedentário": "Sedentário", "Leve": "Leve", "Moderado": "Moderado", "Intenso": "Intenso" };
  const labelObjetivo = { "Emagrecimento": "Emagrecimento", "Ganho de massa": "Ganho de massa", "Manutenção": "Manutenção", "Reeducação alimentar": "Reeducação alimentar" };

  if (carregando) {
    return (
      <div className="perfil-container">
        <div className="perfil-loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="perfil-container">

      <div className="perfil-header">
        <div className="perfil-avatar">
          {name ? name.charAt(0).toUpperCase() : "?"}
        </div>
        <div>
          <h1>{name}</h1>
          <p>{email}</p>
        </div>
      </div>

      <div className="abas-perfil">
        <button
          className={abaAtiva === "pessoais" ? "aba ativa" : "aba"}
          onClick={() => setAbaAtiva("pessoais")}
        >
          Dados Pessoais
        </button>
        <button
          className={abaAtiva === "cadastro" ? "aba ativa" : "aba"}
          onClick={() => setAbaAtiva("cadastro")}
        >
          Perfil Nutricional
        </button>
      </div>

      {mensagem && (
        <div className={mensagem.includes("Erro") ? "msg-erro" : "msg-sucesso"}>
          {mensagem}
        </div>
      )}

      {abaAtiva === "pessoais" && (
        <div className="secao-perfil">
          <div className="secao-header">
            <h2>Dados Pessoais</h2>
            {!editandoPessoais && (
              <button className="btn-editar-perfil" onClick={iniciarEdicaoPessoais}>
                Editar
              </button>
            )}
          </div>

          <div className="campo-perfil">
            <label>Nome</label>
            {editandoPessoais ? (
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            ) : (
              <p className="valor-campo">{name || "—"}</p>
            )}
          </div>

          <div className="campo-perfil">
            <label>Email</label>
            {editandoPessoais ? (
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            ) : (
              <p className="valor-campo">{email || "—"}</p>
            )}
          </div>

          {editandoPessoais && (
            <div className="botoes-acao">
              <button className="btn-salvar-perfil" onClick={salvarPessoais}>
                Salvar
              </button>
              <button className="btn-cancelar-perfil" onClick={cancelarEdicaoPessoais}>
                Cancelar
              </button>
            </div>
          )}
        </div>
      )}

      {abaAtiva === "cadastro" && (
        <div className="secao-perfil">
          <div className="secao-header">
            <h2>Perfil Nutricional</h2>
            {!editandoCadastro && (
              <button className="btn-editar-perfil" onClick={iniciarEdicaoCadastro}>
                Editar
              </button>
            )}
          </div>

          <div className="linha-campos">
            <div className="campo-perfil">
              <label>Data de nascimento</label>
              {editandoCadastro ? (
                <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
              ) : (
                <p className="valor-campo">{dataNascimento || "—"}</p>
              )}
            </div>

            <div className="campo-perfil">
              <label>Genero</label>
              {editandoCadastro ? (
                <select value={genero} onChange={(e) => setGenero(e.target.value)}>
                  <option value="">Selecione</option>
                  <option>Feminino</option>
                  <option>Masculino</option>
                  <option>Outro</option>
                </select>
              ) : (
                <p className="valor-campo">{genero || "—"}</p>
              )}
            </div>
          </div>

          <div className="linha-campos">
            <div className="campo-perfil">
              <label>Peso (kg)</label>
              {editandoCadastro ? (
                <input type="number" value={peso} onChange={(e) => setPeso(e.target.value)} />
              ) : (
                <p className="valor-campo">{peso ? `${peso} kg` : "—"}</p>
              )}
            </div>

            <div className="campo-perfil">
              <label>Altura (cm)</label>
              {editandoCadastro ? (
                <input type="number" value={altura} onChange={(e) => setAltura(e.target.value)} />
              ) : (
                <p className="valor-campo">{altura ? `${altura} cm` : "—"}</p>
              )}
            </div>
          </div>

          <div className="linha-campos">
            <div className="campo-perfil">
              <label>Nivel de atividade fisica</label>
              {editandoCadastro ? (
                <select value={atividade} onChange={(e) => setAtividade(e.target.value)}>
                  <option value="">Selecione</option>
                  <option>Sedentário</option>
                  <option>Leve</option>
                  <option>Moderado</option>
                  <option>Intenso</option>
                </select>
              ) : (
                <p className="valor-campo">{atividade || "—"}</p>
              )}
            </div>

            <div className="campo-perfil">
              <label>Objetivo</label>
              {editandoCadastro ? (
                <select value={objetivo} onChange={(e) => setObjetivo(e.target.value)}>
                  <option value="">Selecione</option>
                  <option>Emagrecimento</option>
                  <option>Ganho de massa</option>
                  <option>Manutenção</option>
                  <option>Reeducação alimentar</option>
                </select>
              ) : (
                <p className="valor-campo">{objetivo || "—"}</p>
              )}
            </div>
          </div>

          <div className="opcoes-perfil">
            <h3>Restricoes alimentares</h3>
            <div className="checkbox-grid">
              {[
                "Intolerância à lactose",
                "Intolerância ao glúten",
                "Alergia a amendoim",
                "Vegetariano",
                "Vegano",
              ].map((item) => (
                <label className="checkbox-item" key={item}>
                  <input
                    type="checkbox"
                    checked={restricoes.includes(item)}
                    disabled={!editandoCadastro}
                    onChange={() => handleCheckboxChange(item, restricoes, setRestricoes)}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <div className="opcoes-perfil">
            <h3>Condicoes de saude</h3>
            <div className="checkbox-grid">
              {[
                "Diabetes",
                "Hipertensão",
                "Colesterol alto",
              ].map((item) => (
                <label className="checkbox-item" key={item}>
                  <input
                    type="checkbox"
                    checked={condicoes.includes(item)}
                    disabled={!editandoCadastro}
                    onChange={() => handleCheckboxChange(item, condicoes, setCondicoes)}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          {editandoCadastro && (
            <div className="botoes-acao">
              <button className="btn-salvar-perfil" onClick={salvarCadastro}>
                Salvar
              </button>
              <button className="btn-cancelar-perfil" onClick={cancelarEdicaoCadastro}>
                Cancelar
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
