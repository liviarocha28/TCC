import React, { useState, useEffect } from "react";
import "./ingredientes.css";

const REACT_APP_YOUR_HOSTNAME = 'http://localhost:5051'; // IP do Servidor

export default function Ingredientes() {

  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoIndex, setEditandoIndex] = useState(null);

  const ingredientesPadrao = [
    {
      nome: "Ovo",
      categoria: "Proteína",
      medidas: ["100g", "unidade"],
      calorias: 72,
      proteinas: 6.3,
      carboidratos: 0.4,
      gorduras: 5,
      fibras: 0,
      acucares: 0.2
    },
    {
      nome: "Frango",
      categoria: "Proteína",
      medidas: ["100g", "kg"],
      calorias: 165,
      proteinas: 31,
      carboidratos: 0,
      gorduras: 3.6,
      fibras: 0,
      acucares: 0
    },
    {
      nome: "Tapioca",
      categoria: "Carboidrato",
      medidas: ["100g"],
      calorias: 330,
      proteinas: 0.6,
      carboidratos: 82,
      gorduras: 0,
      fibras: 1,
      acucares: 3
    },
    {
      nome: "Aveia",
      categoria: "Grãos",
      medidas: ["100g", "colher"],
      calorias: 389,
      proteinas: 17,
      carboidratos: 66,
      gorduras: 7,
      fibras: 10,
      acucares: 1
    },
    {
      nome: "Banana",
      categoria: "Fruta",
      medidas: ["100g", "unidade"],
      calorias: 89,
      proteinas: 1.1,
      carboidratos: 23,
      gorduras: 0.3,
      fibras: 2.6,
      acucares: 12
    },
    
{
  nome: "Brócolis",
  categoria: "Verdura",
  medidas: ["100g", "xícara"],
  calorias: 34,
  proteinas: 2.8,
  carboidratos: 7,
  gorduras: 0.4,
  fibras: 2.6,
  acucares: 1.7
},
{
  nome: "Alface",
  categoria: "Verdura",
  medidas: ["100g", "folha"],
  calorias: 15,
  proteinas: 1.4,
  carboidratos: 2.9,
  gorduras: 0.2,
  fibras: 1.3,
  acucares: 0.8
},
{
  nome: "Maçã",
  categoria: "Fruta",
  medidas: ["100g", "unidade"],
  calorias: 52,
  proteinas: 0.3,
  carboidratos: 14,
  gorduras: 0.2,
  fibras: 2.4,
  acucares: 10
},
{
  nome: "Abacate",
  categoria: "Fruta",
  medidas: ["100g", "unidade"],
  calorias: 160,
  proteinas: 2,
  carboidratos: 9,
  gorduras: 15,
  fibras: 7,
  acucares: 0.7
},
{
  nome: "Salmão",
  categoria: "Proteína",
  medidas: ["100g"],
  calorias: 208,
  proteinas: 20,
  carboidratos: 0,
  gorduras: 13,
  fibras: 0,
  acucares: 0
},
{
  nome: "Iogurte Natural",
  categoria: "Laticínios",
  medidas: ["100g", "copo"],
  calorias: 63,
  proteinas: 5.3,
  carboidratos: 7,
  gorduras: 1.5,
  fibras: 0,
  acucares: 7
},
{
  nome: "Castanha-do-Pará",
  categoria: "Sementes",
  medidas: ["100g", "unidade"],
  calorias: 656,
  proteinas: 14,
  carboidratos: 12,
  gorduras: 66,
  fibras: 8,
  acucares: 2.3
},
{
  nome: "Tomate",
  categoria: "Verdura",
  medidas: ["100g", "unidade"],
  calorias: 18,
  proteinas: 0.9,
  carboidratos: 3.9,
  gorduras: 0.2,
  fibras: 1.2,
  acucares: 2.6
},
{
  nome: "Queijo Branco",
  categoria: "Laticínios",
  medidas: ["100g", "fatia"],
  calorias: 264,
  proteinas: 17,
  carboidratos: 3,
  gorduras: 21,
  fibras: 0,
  acucares: 1
}
  ];

  const grupos = [
    "Proteína",
    "Carboidrato",
    "Grãos",
    "Verdura",
    "Fruta",
    "Laticínios",
    "Sementes"
  ];

  const role = localStorage.getItem('role');

  const adicionarLista = (nome) => {
    const lista = JSON.parse(localStorage.getItem('listaCompras')) || [];
    if (lista.find(i => i.nome === nome)) {
      alert('Ingrediente já está na lista!');
      return;
    }
    lista.push({ nome, comprado: false });
    localStorage.setItem('listaCompras', JSON.stringify(lista));
    alert(`${nome} adicionado à lista de compras!`);
  };

      const [ingredientes, setIngredientes] = useState([])
  
      useEffect(() => {
          async function getIngredientes() {
              const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/ingredientes/`)
  
              if (!response.ok) {
                  const message = `An error occurred: ${response.statusText}`
                  window.alert(message)
                  return
              }
  
              const listaIngredientes = await response.json()
              setIngredientes(listaIngredientes)
          }
  
          getIngredientes()
  
          return
      }, [ingredientes.length])
  
/*  const [ingredientes, setIngredientes] = useState(() => {

    try {
      const dados = localStorage.getItem("ingredientes");
      if (!dados) return ingredientesPadrao;

      const parse = JSON.parse(dados);

      return parse.map((item) => ({
        ...item,
        medidas: Array.isArray(item.medidas) ? item.medidas : [],
        gorduras: Number(item.gorduras) || 0,
        fibras: Number(item.fibras) || 0,
        acucares: Number(item.acucares) || 0
      }));

    } catch {

      return ingredientesPadrao;
    }
  });
*/
  const [novo, setNovo] = useState({
    nome: "",
    categoria: "",
    medidas: [],
    calorias: "",
    proteinas: "",
    carboidratos: "",
    gorduras: "",
    fibras: "",
    acucares: ""
  });
/*
  useEffect(() => {

    localStorage.setItem(
      "ingredientes",
      JSON.stringify(ingredientes)
    );

  }, [ingredientes]);
*/
  const filtrados = ingredientes
    .filter((item) => {

      const nomeOk = item.nome
        .toLowerCase()
        .includes(busca.toLowerCase());

      const categoriaOk =
        categoriaFiltro === "Todas" ||
        item.categoria === categoriaFiltro;

      return nomeOk && categoriaOk;
    })
    .sort((a, b) =>
      a.nome.localeCompare(b.nome)
    );

  const limpar = () => {

    setNovo({
      nome: "",
      categoria: "",
      medidas: [],
      calorias: "",
      proteinas: "",
      carboidratos: "",
      gorduras: "",
      fibras: "",
      acucares: ""
    });

    setEditandoIndex(null);
    setMostrarForm(false);
  };

  const salvar_antigo = () => {

    if (
      !novo.nome ||
      !novo.categoria ||
      novo.medidas.length === 0
    ) {
      alert("Preencha nome, categoria e medidas.");
      return;
    }

    const itemSalvo = {
      ...novo,
      calorias: Number(novo.calorias),
      proteinas: Number(novo.proteinas),
      carboidratos: Number(novo.carboidratos),
      gorduras: Number(novo.gorduras),
      fibras: Number(novo.fibras),
      acucares: Number(novo.acucares)
    };

    if (editandoIndex !== null) {

      const lista = [...ingredientes];

      lista[editandoIndex] = itemSalvo;

      setIngredientes(lista);

    } else {

      setIngredientes([
        ...ingredientes,
        itemSalvo
      ]);
    }

    limpar();
  };

  async function salvar() {

    if (
      !novo.nome ||
      !novo.categoria ||
      novo.medidas.length === 0
    ) {
      alert("Preencha nome, categoria e medidas.");
      return;
    }
    const itemSalvo = {
      ...novo,
      calorias: Number(novo.calorias),
      proteinas: Number(novo.proteinas),
      carboidratos: Number(novo.carboidratos),
      gorduras: Number(novo.gorduras),
      fibras: Number(novo.fibras),
      acucares: Number(novo.acucares)
    };
     const response = await fetch(`${REACT_APP_YOUR_HOSTNAME}/ingredientes/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(itemSalvo)
        })

        if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`
            window.alert(message)
            return
        }

/*    if (editandoIndex !== null) {
      const lista = [...ingredientes];
      lista[editandoIndex] = itemSalvo;
      setIngredientes(lista);
    } else {
      setIngredientes([
        ...ingredientes,
        itemSalvo
      ]);
    }*/
    setIngredientes([...ingredientes, itemSalvo]);
    limpar();
  };

  const editar = (index) => {

    setNovo({
      ...ingredientes[index]
    });

    setEditandoIndex(index);
    setMostrarForm(true);
  };

  const excluir = async (index) => {

    if (!window.confirm("Deseja excluir?")) return;

    const item = ingredientes[index];

    try {
      await fetch(
        `${REACT_APP_YOUR_HOSTNAME}/ingredientes/${item._id}`,
        { method: "DELETE" }
      );
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }

    const lista = ingredientes.filter(
      (_, i) => i !== index
    );

    setIngredientes(lista);
  };

  const toggleMedida = (medida) => {

    if (novo.medidas.includes(medida)) {

      setNovo({
        ...novo,
        medidas: novo.medidas.filter(
          (m) => m !== medida
        )
      });

    } else {

      setNovo({
        ...novo,
        medidas: [...novo.medidas, medida]
      });
    }
  };

  return (

    <div className="ingredientes-container">

      <div className="top-header">

        <h1>Ingredientes</h1>

        <button
          className="btn-add"
          onClick={() => {
            limpar();
            setMostrarForm(true);
          }}
        >
          + Adicionar Ingrediente
        </button>

      </div>

      <div className="barra-filtros">

        <input
          className="search-input"
          placeholder="Pesquisar ingrediente..."
          value={busca}
          onChange={(e) =>
            setBusca(e.target.value)
          }
        />

        <select
          className="select-filtro"
          value={categoriaFiltro}
          onChange={(e) =>
            setCategoriaFiltro(e.target.value)
          }
        >

          <option value="Todas">
            Todas Categorias
          </option>

          {grupos.map((grupo, index) => (

            <option
              key={index}
              value={grupo}
            >
              {grupo}
            </option>

          ))}

        </select>

      </div>

      {mostrarForm && (
        <div className="overlay">
          <div className="form-modal">
            <h2>
              {editandoIndex !== null
                ? "Editar Ingrediente"
                : "Novo Ingrediente"}
            </h2>
            <input
              placeholder="Nome"
              value={novo.nome}
              onChange={(e) =>
                setNovo({
                  ...novo,
                  nome: e.target.value
                })
              }
            />
            <select
              value={novo.categoria}
              onChange={(e) =>
                setNovo({
                  ...novo,
                  categoria: e.target.value
                })
              }
            >

              <option value="">
                Categoria
              </option>

              {grupos.map((grupo, index) => (

                <option
                  key={index}
                  value={grupo}
                >
                  {grupo}
                </option>

              ))}

            </select>

            <div className="medidas-box">

              <p>Medidas disponíveis</p>

              {[
                "100g",
                "unidade",
                "kg",
                "ml",
                "colher de sopa",
                "colher de chá",
                "xícara",
                "fatia",
                "copo",
                "folha"
              ].map((medida, index) => (

                <label key={index}>

                  <input
                    type="checkbox"
                    checked={novo.medidas.includes(medida)}
                    onChange={() =>
                      toggleMedida(medida)
                    }
                  />

                  {medida}

                </label>

              ))}

            </div>

            <input
              type="number"
              placeholder="Calorias (kcal)"
              value={novo.calorias}
              onChange={(e) =>
                setNovo({
                  ...novo,
                  calorias: e.target.value
                })
              }
            />

            <input
              type="number"
              placeholder="Proteínas (g)"
              value={novo.proteinas}
              onChange={(e) =>
                setNovo({
                  ...novo,
                  proteinas: e.target.value
                })
              }
            />

            <input
              type="number"
              placeholder="Carboidratos (g)"
              value={novo.carboidratos}
              onChange={(e) =>
                setNovo({
                  ...novo,
                  carboidratos: e.target.value
                })
              }
            />

            <input
              type="number"
              placeholder="Gorduras (g)"
              value={novo.gorduras}
              onChange={(e) =>
                setNovo({
                  ...novo,
                  gorduras: e.target.value
                })
              }
            />

            <input
              type="number"
              placeholder="Fibras (g)"
              value={novo.fibras}
              onChange={(e) =>
                setNovo({
                  ...novo,
                  fibras: e.target.value
                })
              }
            />

            <input
              type="number"
              placeholder="Açúcares (g)"
              value={novo.acucares}
              onChange={(e) =>
                setNovo({
                  ...novo,
                  acucares: e.target.value
                })
              }
            />

            <div className="form-buttons">

              <button
                className="save-btn"
                onClick={salvar}
              >
                Salvar
              </button>

              <button
                className="cancel-btn"
                onClick={limpar}
              >
                Cancelar
              </button>

            </div>

          </div>

        </div>

      )}

      {grupos.map((grupo) => {

        if (
          categoriaFiltro !== "Todas" &&
          categoriaFiltro !== grupo
        ) {
          return null;
        }

        const itens = filtrados.filter(
          (item) =>
            item.categoria === grupo
        );

        if (itens.length === 0) return null;

        return (

          <section
            key={grupo}
            className="grupo-section"
          >

            <h2 className="grupo-titulo">
              {grupo}
            </h2>

            <div className="grid-ingredientes">

              {itens.map((item, index) => {

                const indexOriginal =
                  ingredientes.indexOf(item);

                return (

                  <div
                    className="card-ingrediente"
                    key={index}
                  >

                    <div className="card-top">

                      <h3>{item.nome}</h3>

                      <span className="tag-categoria">
                        {item.categoria}
                      </span>

                    </div>

                    <p className="medida-info">

                      Medidas:
                      {" "}
                      {Array.isArray(item.medidas)
                        ? item.medidas.join(", ")
                        : item.medidas}

                    </p>

                    <div className="nutri-grid">

                      <div>
                        <strong>{item.calorias}</strong>
                        <span>kcal</span>
                      </div>

                      <div>
                        <strong>{item.proteinas}</strong>
                        <span>Prot.</span>
                      </div>

                      <div>
                        <strong>{item.carboidratos}</strong>
                        <span>Carb.</span>
                      </div>

                      <div>
                        <strong>{item.gorduras}</strong>
                        <span>Gord.</span>
                      </div>

                      <div>
                        <strong>{item.fibras}</strong>
                        <span>Fibra</span>
                      </div>

                      <div>
                        <strong>{item.acucares}</strong>
                        <span>Açúcar</span>
                      </div>

                    </div>

                    <div className="card-actions">

                      {role === "admin" ? (
                        <>
                          <button
                            className="btn-edit"
                            onClick={() =>
                              editar(indexOriginal)
                            }
                          >
                            Editar
                          </button>

                          <button
                            className="btn-delete"
                            onClick={() =>
                              excluir(indexOriginal)
                            }
                          >
                            Excluir
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn-cart"
                          onClick={() => adicionarLista(item.nome)}
                        >
                          🛒 Adicionar à lista
                        </button>
                      )}

                    </div>

                  </div>

                );
              })}

            </div>

          </section>

        );
      })}

    </div>
  );
}