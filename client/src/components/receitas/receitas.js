import React, { useState, useEffect } from "react";
import "./receitas.css";

const REACT_APP_YOUR_HOSTNAME = 'http://localhost:5051';

export default function Receitas() {

  const role = localStorage.getItem('role');
  const isAdmin = role === "admin";
  const userId = localStorage.getItem('userId');

  const [receitas, setReceitas] = useState([]);
  const [recomendacoes, setRecomendacoes] = useState([]);
  const [mensagemPerfil, setmensagemPerfil] = useState("");
  const [temPerfil, setTemPerfil] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("todas");

  useEffect(() => {
    async function getReceitas() {
      try {
        const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/receitas/`);
        if (!response.ok) return;
        const listaReceitas = await response.json();
        setReceitas(listaReceitas);
      } catch (e) {
        console.error("Erro ao buscar receitas:", e);
      }
    }
    getReceitas();
  }, []);

  useEffect(() => {
    if (!userId) return;
    async function getRecomendacoes() {
      try {
        const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/recomendacoes/${userId}`);
        if (!response.ok) return;
        const data = await response.json();
        if (data.mensagem) {
          setmensagemPerfil(data.mensagem);
          setTemPerfil(false);
        } else {
          setTemPerfil(true);
        }
        setRecomendacoes(data.receitas || []);
      } catch (e) {
        console.error("Erro ao buscar recomendações:", e);
      }
    }
    getRecomendacoes();
  }, [userId]);

  const [ingredientesBanco, setIngredientesBanco] = useState([]);
  useEffect(() => {
    async function getIngredientes() {
      try {
        const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/ingredientes/`);
        if (!response.ok) return;
        const listaIngredientes = await response.json();
        setIngredientesBanco(listaIngredientes);
      } catch (e) {
        console.error("Erro ao buscar ingredientes:", e);
      }
    }
    getIngredientes();
  }, []);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [receitaExpandida, setReceitaExpandida] = useState(null);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [foto, setFoto] = useState("");
  const [buscaIngrediente, setBuscaIngrediente] = useState("");

  const [ingredientesSelecionados, setIngredientesSelecionados] = useState([]);
  const [tagsSelecionadas, setTagsSelecionadas] = useState([]);
  const [editandoIndex, setEditandoIndex] = useState(null);

  const tags = [
    "#vegetariano", "#vegano", "#baixoemcalorias", "#altoemproteina",
    "#rapido", "#facil", "#semgluten", "#semlactose",
    "#emagrecimento", "#ganhomassa", "#cafe_da_manha", "#lanche",
    "#almoco", "#jantar", "#sobremesa", "#fibra", "#potassio",
    "#ferro", "#calcio"
  ];

  const [curtidas, setCurtidas] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('curtidas')) || {};
    } catch { return {}; }
  });

  const toggleCurtida = (id) => {
    const novasCurtidas = { ...curtidas };
    if (novasCurtidas[id]) delete novasCurtidas[id];
    else novasCurtidas[id] = true;
    setCurtidas(novasCurtidas);
    localStorage.setItem('curtidas', JSON.stringify(novasCurtidas));
  };

  const toggleTag = (tag) => {
    if (tagsSelecionadas.includes(tag)) {
      setTagsSelecionadas(tagsSelecionadas.filter((t) => t !== tag));
    } else {
      setTagsSelecionadas([...tagsSelecionadas, tag]);
    }
  };

  const uploadFoto = (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;
    const reader = new FileReader();
    reader.onloadend = () => setFoto(reader.result);
    reader.readAsDataURL(arquivo);
  };

  const adicionarIngrediente = (nomeIng) => {
    const existe = ingredientesSelecionados.find(i => i.nome === nomeIng);
    if (existe) return;
    const base = ingredientesBanco.find(i => i.nome === nomeIng);
    if (!base) return;
    setIngredientesSelecionados([
      ...ingredientesSelecionados,
      { nome: base.nome, quantidade: "", medida: "g" }
    ]);
    setBuscaIngrediente("");
  };

  const alterarQtd = (index, valor) => {
    const lista = [...ingredientesSelecionados];
    lista[index].quantidade = valor;
    setIngredientesSelecionados(lista);
  };

  const alterarMedida = (index, valor) => {
    const lista = [...ingredientesSelecionados];
    lista[index].medida = valor;
    setIngredientesSelecionados(lista);
  };

  const removerIngrediente = (index) => {
    setIngredientesSelecionados(ingredientesSelecionados.filter((_, i) => i !== index));
  };

  const calcular = () => {
    let kcal = 0, proteinas = 0, carboidratos = 0, gorduras = 0, fibras = 0, acucares = 0;
    ingredientesSelecionados.forEach((item) => {
      const base = ingredientesBanco.find(i => i.nome === item.nome);
      if (!base) return;
      const qtd = Number(item.quantidade);
      if (!qtd) return;
      let fator = 1;
      if (item.medida === "g") fator = qtd / 100;
      else if (item.medida === "kg") fator = qtd * 10;
      else if (item.medida === "ml") fator = qtd / 100;
      else fator = qtd;
      kcal += Number(base.calorias || 0) * fator;
      proteinas += Number(base.proteinas || 0) * fator;
      carboidratos += Number(base.carboidratos || 0) * fator;
      gorduras += Number(base.gorduras || 0) * fator;
      fibras += Number(base.fibras || 0) * fator;
      acucares += Number(base.acucares || 0) * fator;
    });
    return {
      kcal: kcal.toFixed(1),
      proteinas: proteinas.toFixed(1),
      carboidratos: carboidratos.toFixed(1),
      gorduras: gorduras.toFixed(1),
      fibras: fibras.toFixed(1),
      acucares: acucares.toFixed(1)
    };
  };

  const limparCampos = () => {
    setNome("");
    setDescricao("");
    setFoto("");
    setBuscaIngrediente("");
    setTagsSelecionadas([]);
    setIngredientesSelecionados([]);
    setEditandoIndex(null);
  };

  async function salvar() {
    if (!nome.trim()) return;
    const totais = calcular();
    const nova = {
      nome, descricao, foto,
      tags: tagsSelecionadas,
      ingredientes: ingredientesSelecionados,
      ...totais
    };
    if (editandoIndex !== null) {
      const receitaId = receitas[editandoIndex]._id;
      const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/receita/${receitaId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nova)
      });
      if (!response.ok) return;
      const lista = [...receitas];
      lista[editandoIndex] = { ...lista[editandoIndex], ...nova };
      setReceitas(lista);
    } else {
      const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/receita/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nova)
      });
      if (!response.ok) return;
      const res = await response.json();
      setReceitas([...receitas, { ...nova, _id: res.insertedId }]);
    }
    limparCampos();
    setMostrarModal(false);
  }

  const editar = (index) => {
    const r = receitas[index];
    setNome(r.nome);
    setDescricao(r.descricao);
    setFoto(r.foto || "");
    setTagsSelecionadas(r.tags || []);
    setIngredientesSelecionados(r.ingredientes || []);
    setEditandoIndex(index);
    setMostrarModal(true);
  };

  const excluir = async (index) => {
    if (!window.confirm("Deseja excluir esta receita?")) return;
    const receitaId = receitas[index]._id;
    await fetch(`${REACT_APP_YOUR_HOSTNAME}/del/${receitaId}`, { method: "DELETE" });
    setReceitas(receitas.filter((_, i) => i !== index));
  };

  const totais = calcular();

  const sugestoes = ingredientesBanco.filter(item =>
    item.nome.toLowerCase().includes(buscaIngrediente.toLowerCase())
  );

  const abrirReceita = (item) => setReceitaExpandida(item);
  const fecharReceita = () => setReceitaExpandida(null);

  const adicionarLista = (nome) => {
    const lista = JSON.parse(localStorage.getItem('listaCompras')) || [];
    if (lista.find(i => i.nome === nome)) {
      alert('Ingrediente ja esta na lista!');
      return;
    }
    lista.push({ nome, comprado: false });
    localStorage.setItem('listaCompras', JSON.stringify(lista));
    alert(`${nome} adicionado a lista de compras!`);
  };

  const adicionarTodosLista = () => {
    if (!receitaExpandida) return;
    const lista = JSON.parse(localStorage.getItem('listaCompras')) || [];
    let adicionados = 0;
    (receitaExpandida.ingredientes || []).forEach((ing) => {
      if (!lista.find(i => i.nome === ing.nome)) {
        lista.push({ nome: ing.nome, comprado: false });
        adicionados++;
      }
    });
    localStorage.setItem('listaCompras', JSON.stringify(lista));
    if (adicionados > 0) {
      alert(`${adicionados} ingrediente(s) adicionado(s) a lista de compras!`);
    } else {
      alert('Todos os ingredientes ja estao na lista!');
    }
  };

  const receitasParaMostrar = isAdmin
    ? receitas
    : (abaAtiva === "recomendadas" ? recomendacoes : receitas);

  return (
    <div className="receitas-container">

      <div className="topo-receitas">
        <div>
          <h1>Receitas</h1>
          {isAdmin
            ? <p>Gerencie receitas saudaveis do EquilibraPro</p>
            : <p>Explore receitas saudaveis do EquilibraPro</p>
          }
        </div>
        {isAdmin && (
          <button className="btn-nova-receita" onClick={() => { limparCampos(); setMostrarModal(true); }}>
            + Nova Receita
          </button>
        )}
      </div>

      {!isAdmin && (
        <div className="abas-receitas">
          <button
            className={abaAtiva === "todas" ? "aba ativa" : "aba"}
            onClick={() => setAbaAtiva("todas")}
          >
            Todas as Receitas
          </button>
          <button
            className={abaAtiva === "recomendadas" ? "aba ativa" : "aba"}
            onClick={() => setAbaAtiva("recomendadas")}
          >
            Recomendadas para Voce
          </button>
        </div>
      )}

      {!isAdmin && abaAtiva === "recomendadas" && !temPerfil && (
        <div className="aviso-perfil">
          <p>Voce ainda nao completou seu perfil nutricional. <a href="/cadastro">Complete aqui</a> para receber recomendacoes personalizadas!</p>
        </div>
      )}

      <div className="lista-receitas">
        {receitasParaMostrar.length === 0 ? (
          <div className="aviso-perfil">
            <p>Nenhuma receita encontrada.</p>
          </div>
        ) : (
          <div className="grid-receitas">
            {receitasParaMostrar.map((item, index) => (
              <div className="card-receita" key={item._id || index} onClick={() => isAdmin ? null : abrirReceita(item)}>

                {item.foto && <img src={item.foto} alt="" className="foto-card" />}

                <div className="conteudo-card">
                  <h3>{item.nome}</h3>
                  <p>{item.descricao}</p>

                  <div className="tags-card">
                    {item.tags?.map((tag, i) => <span key={i}>{tag}</span>)}
                  </div>

                  <div className="infos">
                    <span>{item.kcal} kcal</span>
                    <span>{item.proteinas}g Prot</span>
                    <span>{item.carboidratos}g Carb</span>
                    <span>{item.gorduras}g Gord</span>
                    <span>{item.fibras}g Fibr</span>
                    <span>{item.acucares}g Acuc</span>
                  </div>

                  <div className="acoes" onClick={(e) => e.stopPropagation()}>
                    {isAdmin ? (
                      <>
                        <button className="btn-editar" onClick={() => editar(index)}>Editar</button>
                        <button className="btn-excluir" onClick={() => excluir(index)}>Excluir</button>
                      </>
                    ) : (
                      <button
                        className={curtidas[item._id] ? "btn-curtida ativa" : "btn-curtida"}
                        onClick={() => toggleCurtida(item._id)}
                      >
                        {curtidas[item._id] ? "Curtido" : "Curtir"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL EXPANSAO RECEITA (user) */}
      {receitaExpandida && (
        <div className="overlay" onClick={fecharReceita}>
          <div className="modal-expandir" onClick={(e) => e.stopPropagation()}>

            <div className="header-modal">
              <h2>{receitaExpandida.nome}</h2>
              <button className="btn-fechar" onClick={fecharReceita}>✕</button>
            </div>

            {receitaExpandida.foto && (
              <img src={receitaExpandida.foto} alt="" className="foto-expandir" />
            )}

            <p className="desc-expandir">{receitaExpandida.descricao}</p>

            <div className="tags-expandir">
              {receitaExpandida.tags?.map((tag, i) => <span key={i}>{tag}</span>)}
            </div>

            <div className="infos-expandir">
              <span>{receitaExpandida.kcal} kcal</span>
              <span>{receitaExpandida.proteinas}g Proteinas</span>
              <span>{receitaExpandida.carboidratos}g Carboidratos</span>
              <span>{receitaExpandida.gorduras}g Gorduras</span>
              <span>{receitaExpandida.fibras}g Fibras</span>
              <span>{receitaExpandida.acucares}g Acucares</span>
            </div>

            <div className="header-ingredientes">
              <h3>Ingredientes</h3>
              <button className="btn-add-todos-lista" onClick={adicionarTodosLista}>
                Adicionar todos a lista
              </button>
            </div>

            <div className="lista-ingredientes-expandir">
              {(receitaExpandida.ingredientes || []).map((ing, i) => (
                <div className="item-ingrediente-expandir" key={i}>
                  <span>{ing.nome}</span>
                  <span className="qtd-ingrediente">{ing.quantidade} {ing.medida}</span>
                  <button
                    className="btn-add-lista"
                    onClick={() => adicionarLista(ing.nome)}
                  >
                    🛒
                  </button>
                </div>
              ))}
            </div>

            <div className="acoes-expandir">
              {curtidas[receitaExpandida._id]
                ? <button className="btn-curtida ativa" onClick={() => toggleCurtida(receitaExpandida._id)}>Curtido</button>
                : <button className="btn-curtida" onClick={() => toggleCurtida(receitaExpandida._id)}>Curtir</button>
              }
            </div>

          </div>
        </div>
      )}

      {/* MODAL NOVA/EDITAR RECEITA (admin) */}
      {mostrarModal && (
        <div className="overlay">
          <div className="modal-receita">

            <div className="header-modal">
              <h2>{editandoIndex !== null ? "Editar Receita" : "Nova Receita"}</h2>
              <button className="btn-fechar" onClick={() => setMostrarModal(false)}>✕</button>
            </div>

            <div className="card-form">
              <input placeholder="Nome da receita" value={nome} onChange={(e) => setNome(e.target.value)} />
              <textarea placeholder="Descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} />

              <label className="upload-box">
                {foto ? "Trocar Foto" : "Adicionar Foto"}
                <input type="file" accept="image/*" hidden onChange={uploadFoto} />
              </label>

              {foto && <img src={foto} alt="" className="preview-img" />}

              <h3>Tags</h3>
              <div className="tags-box">
                {tags.map((tag, index) => (
                  <button type="button" key={index}
                    className={tagsSelecionadas.includes(tag) ? "tag ativa" : "tag"}
                    onClick={() => toggleTag(tag)}
                  >{tag}</button>
                ))}
              </div>

              <h3>Ingredientes</h3>
              <input placeholder="Digite ingrediente..." value={buscaIngrediente} onChange={(e) => setBuscaIngrediente(e.target.value)} />

              {buscaIngrediente && sugestoes.length > 0 && (
                <div className="sugestoes">
                  {sugestoes.map((item, index) => (
                    <div key={index} className="item-sugestao" onClick={() => adicionarIngrediente(item.nome)}>
                      {item.nome}
                    </div>
                  ))}
                </div>
              )}

              {ingredientesSelecionados.map((item, index) => {
                const medidasDisponiveis = ["g", "ml", "unidade", "colher de sopa", "colher de cha", "fatia", "copo", "folha"];
                return (
                  <div className="linha-ingrediente" key={index}>
                    <span>{item.nome}</span>
                    <input type="number" min="0" step="any" placeholder="Qtd" value={item.quantidade}
                      onChange={(e) => alterarQtd(index, e.target.value)} />
                    <select className="select-medida" value={item.medida}
                      onChange={(e) => alterarMedida(index, e.target.value)}>
                      {medidasDisponiveis.map((m, i) => (
                        <option key={i} value={m}>{m}</option>
                      ))}
                    </select>
                    <button type="button" className="btn-remover" onClick={() => removerIngrediente(index)}>X</button>
                  </div>
                );
              })}

              <div className="resumo-modal">
                <div className="box-total"><strong>{totais.kcal}</strong><span>kcal</span></div>
                <div className="box-total"><strong>{totais.proteinas}</strong><span>Proteinas</span></div>
                <div className="box-total"><strong>{totais.carboidratos}</strong><span>Carboidratos</span></div>
                <div className="box-total"><strong>{totais.gorduras}</strong><span>Gorduras</span></div>
                <div className="box-total"><strong>{totais.fibras}</strong><span>Fibras</span></div>
                <div className="box-total"><strong>{totais.acucares}</strong><span>Acucares</span></div>
              </div>

              <button type="button" className="btn-salvar" onClick={salvar}>
                {editandoIndex !== null ? "Atualizar Receita" : "Salvar Receita"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
