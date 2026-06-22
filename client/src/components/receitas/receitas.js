import React, { useState, useEffect } from "react";
import "./receitas.css";

const REACT_APP_YOUR_HOSTNAME = 'http://localhost:5051'; // IP do Servidor

export default function Receitas() {


  const [receitas, setReceitas] = useState([])
  useEffect(() => {
      async function getReceitas() {
          const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/receitas/`)
          if (!response.ok) {
              const message = `An error occurred: ${response.statusText}`
              window.alert(message)
              return
          }
          const listaReceitas = await response.json()
          setReceitas(listaReceitas)
      }
      getReceitas()
      return
  }, [receitas.length])
  const [ingredientesBanco, setIngredientesBanco] = useState([])

  useEffect(() => {
    async function getIngredientes() {
        const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/ingredientes/`)
        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`
            window.alert(message)
            return
        }
        const listaIngredientes = await response.json()
        setIngredientesBanco(listaIngredientes)
    }
    getIngredientes()
    return
  }, [receitas.length])
     /*   
  const banco = (() => {
    try {
      return JSON.parse(localStorage.getItem("ingredientes")) || [];
    } catch {
      return [];
    }
  })();

  const ingredientesBanco = [...banco].sort((a, b) =>
    a.nome.localeCompare(b.nome)
  );
/*
  const [receitas, setReceitas] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("receitas")) || [];
    } catch {
      return [];
    }
  });
*/
  const [mostrarModal, setMostrarModal] = useState(false);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [foto, setFoto] = useState("");
  const [buscaIngrediente, setBuscaIngrediente] = useState("");

  const [ingredientesSelecionados, setIngredientesSelecionados] = useState([]);
  const [tagsSelecionadas, setTagsSelecionadas] = useState([]);
  const [editandoIndex, setEditandoIndex] = useState(null);

  const tags = [
    "#vegetariano",
    "#vegano",
    "#baixoemcalorias",
    "#altoemproteina",
    "#rapido",
    "#facil",
    "#semgluten",
    "#semlactose",
    "#emagrecimento",
    "#ganhomassa"
  ];

/*  useEffect(() => {
    localStorage.setItem("receitas", JSON.stringify(receitas));
  }, [receitas]);
*/
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

    reader.onloadend = () => {
      setFoto(reader.result);
    };

    reader.readAsDataURL(arquivo);
  };

  const adicionarIngrediente = (nomeIng) => {

    const existe = ingredientesSelecionados.find(
      (i) => i.nome === nomeIng
    );

    if (existe) return;

    const base = ingredientesBanco.find(
      (i) => i.nome === nomeIng
    );

    if (!base) return;

    setIngredientesSelecionados([
      ...ingredientesSelecionados,
      {
        nome: base.nome,
        quantidade: "",
        medida: base.medida || "100g"
      }
    ]);

    setBuscaIngrediente("");
  };

  const alterarQtd = (index, valor) => {

    const lista = [...ingredientesSelecionados];

    lista[index].quantidade = valor;

    setIngredientesSelecionados(lista);
  };

  const removerIngrediente = (index) => {

    setIngredientesSelecionados(
      ingredientesSelecionados.filter((_, i) => i !== index)
    );
  };

  const calcular = () => {

    let kcal = 0;
    let proteinas = 0;
    let carboidratos = 0;
    let gorduras = 0;
    let fibras = 0;
    let acucares = 0;


    ingredientesSelecionados.forEach((item) => {

      const base = ingredientesBanco.find(
        (i) => i.nome === item.nome
      );

      if (!base) return;

      const qtd = Number(item.quantidade);

      if (!qtd) return;

      const fator = item.medida === "100g"
        ? qtd / 100
        : qtd;

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
    setCategoria("");
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
      nome,
      descricao,
      foto,
      tags: tagsSelecionadas,
      ingredientes: ingredientesSelecionados,
      ...totais
    };

    
    if (editandoIndex !== null) {
      const receitaId = receitas[editandoIndex]._id;
      const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/receita/${receitaId}`, {
        method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nova)
        })
        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`
            window.alert(message)
            return
        }
      const lista = [...receitas];
      lista[editandoIndex] = nova;
      setReceitas(lista);
    } else {

    const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/receita/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nova)
        })

        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`
            window.alert(message)
            return
        }

        setReceitas([...receitas, nova]);
    }
    limparCampos();
    setMostrarModal(false);
  };



  const editar = (index) => {

    const r = receitas[index];
    setNome(r.nome);
    setDescricao(r.descricao);
    setCategoria(r.categoria);
    setFoto(r.foto);
    setTagsSelecionadas(r.tags || []);
    setIngredientesSelecionados(r.ingredientes || []);

    setEditandoIndex(index);

    setMostrarModal(true);
  };

  const excluir = (index) => {

    if (!window.confirm("Deseja excluir esta receita?")) return;
    const receitaId = receitas[index]._id;

    const response = fetch(`${REACT_APP_YOUR_HOSTNAME}/del/${receitaId}`, {
            method: "DELETE"
        })

    setReceitas(receitas.filter((_, i) => i !== index));
  };

  const totais = calcular();

  const sugestoes = ingredientesBanco.filter((item) =>
    item.nome.toLowerCase().includes(buscaIngrediente.toLowerCase())
  );

  return (

    <div className="receitas-container">

      <div className="topo-receitas">

        <div>
          <h1>Receitas</h1>
          <p>Gerencie receitas saudáveis do EquilibraPro</p>
        </div>

        <button
          className="btn-nova-receita"
          onClick={() => {
            limparCampos();
            setMostrarModal(true);
          }}
        >
          + Nova Receita
        </button>

      </div>

      <div className="lista-receitas">

        <div className="grid-receitas">

          {receitas.map((item, index) => (

            <div className="card-receita" key={index}>

              {item.foto && (
                <img
                  src={item.foto}
                  alt=""
                  className="foto-card"
                />
              )}

              <div className="conteudo-card">

                <h3>{item.nome}</h3>

                <p>{item.descricao}</p>

                <div className="tags-card">

                  {item.tags?.map((tag, i) => (
                    <span key={i}>{tag}</span>
                  ))}

                </div>

                <div className="infos">
                  <span>{item.kcal} kcal</span>
                  <span>{item.proteinas}g Prot</span>
                  <span>{item.carboidratos}g Carb</span>
                  <span>{item.gorduras}g Gord</span>
                  <span>{item.fibras}g Fibr</span>
                  <span>{item.acucares}g Açuc</span>
                </div>

                <div className="acoes">

                  <button
                    className="btn-editar"
                    onClick={() => editar(index)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn-excluir"
                    onClick={() => excluir(index)}
                  >
                    Excluir
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

      {mostrarModal && (

        <div className="overlay">

          <div className="modal-receita">

            <div className="header-modal">

              <h2>
                {editandoIndex !== null
                  ? "Editar Receita"
                  : "Nova Receita"}
              </h2>

              <button
                className="btn-fechar"
                onClick={() => setMostrarModal(false)}
              >
                ✕
              </button>

            </div>

            <div className="card-form">

              <input
                placeholder="Nome da receita"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />

              <textarea
                placeholder="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />

              <label className="upload-box">

                Adicionar Foto

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={uploadFoto}
                />

              </label>

              {foto && (
                <img
                  src={foto}
                  alt=""
                  className="preview-img"
                />
              )}

              <h3>Tags</h3>

              <div className="tags-box">

                {tags.map((tag, index) => (

                  <button
                    type="button"
                    key={index}
                    className={
                      tagsSelecionadas.includes(tag)
                        ? "tag ativa"
                        : "tag"
                    }
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>

                ))}

              </div>

              <h3>Ingredientes</h3>

              <input
                placeholder="Digite ingrediente..."
                value={buscaIngrediente}
                onChange={(e) =>
                  setBuscaIngrediente(e.target.value)
                }
              />

              {buscaIngrediente && sugestoes.length > 0 && (

                <div className="sugestoes">

                  {sugestoes.map((item, index) => (

                    <div
                      key={index}
                      className="item-sugestao"
                      onClick={() =>
                        adicionarIngrediente(item.nome)
                      }
                    >
                      {item.nome}
                    </div>

                  ))}

                </div>

              )}

              {ingredientesSelecionados.map((item, index) => (

                <div className="linha-ingrediente" key={index}>

                  <span>{item.nome}</span>

                  <input
                    type="number"
                    min="0"
                    value={item.quantidade}
                    onChange={(e) =>
                      alterarQtd(index, e.target.value)
                    }
                  />

                  <small>{item.medida}</small>

                  <button
                    type="button"
                    className="btn-remover"
                    onClick={() =>
                      removerIngrediente(index)
                    }
                  >
                    X
                  </button>

                </div>

              ))}

              <div className="resumo-modal">

                <div className="box-total">
                  <strong>{totais.kcal}</strong>
                  <span>kcal</span>
                </div>

                <div className="box-total">
                  <strong>{totais.proteinas}</strong>
                  <span>Proteínas</span>
                </div>

                <div className="box-total">
                  <strong>{totais.carboidratos}</strong>
                  <span>Carboidratos</span>
                </div>
                <div className="box-total">
                  <strong>{totais.gorduras}</strong>
                  <span>Gorduras</span>
                </div>
                <div className="box-total">
                  <strong>{totais.fibras}</strong>
                  <span>Fibras</span>
                </div>
                <div className="box-total">
                  <strong>{totais.acucares}</strong>
                  <span>Açúcares</span>
                </div>
              </div>

              <button
                type="button"
                className="btn-salvar"
                onClick={salvar}
              >
                {editandoIndex !== null
                  ? "Atualizar Receita"
                  : "Salvar Receita"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}