import React, { useState, useEffect } from "react";
import "./lista.css";

export default function Lista() {

  const [itens, setItens] = useState([]);

  useEffect(() => {
    const salvos = JSON.parse(localStorage.getItem('listaCompras')) || [];
    setItens(salvos);
  }, []);

  const marcar = (index) => {
    const novos = [...itens];
    novos[index].comprado = !novos[index].comprado;
    setItens(novos);
    localStorage.setItem('listaCompras', JSON.stringify(novos));
  };

  const remover = (index) => {
    const novos = itens.filter((_, i) => i !== index);
    setItens(novos);
    localStorage.setItem('listaCompras', JSON.stringify(novos));
  };

  const limparTudo = () => {
    if (!window.confirm("Deseja limpar toda a lista?")) return;
    setItens([]);
    localStorage.removeItem('listaCompras');
  };

  const pendentes = itens.filter(i => !i.comprado);
  const comprados = itens.filter(i => i.comprado);

  return (
    <div className="lista-container">

      <div className="lista-header">
        <div>
          <h1>Lista de Compras</h1>
          <p>{pendentes.length} item(ns) pendente(s)</p>
        </div>
        {itens.length > 0 && (
          <button className="btn-limpar" onClick={limparTudo}>
            Limpar tudo
          </button>
        )}
      </div>

      {itens.length === 0 ? (
        <div className="lista-vazia">
          <span className="lista-vazia-icon">🛒</span>
          <p>Sua lista está vazia.</p>
          <p className="lista-vazia-hint">
            Adicione ingredientes pelo botão 🛒 nos cards de ingredientes.
          </p>
        </div>
      ) : (
        <div className="lista-itens">

          {pendentes.map((item, index) => {

            const indexReal = itens.indexOf(item);

            return (
              <div className="lista-item" key={indexReal}>
                <button
                  className="check-btn"
                  onClick={() => marcar(indexReal)}
                >
                  <span className="check-icon">○</span>
                </button>
                <span className="item-nome">{item.nome}</span>
                <button
                  className="btn-remover-item"
                  onClick={() => remover(indexReal)}
                >
                  ✕
                </button>
              </div>
            );

          })}

          {comprados.length > 0 && (
            <div className="lista-separador">
              <span>Comprados ({comprados.length})</span>
            </div>
          )}

          {comprados.map((item, index) => {

            const indexReal = itens.indexOf(item);

            return (
              <div className="lista-item comprado" key={indexReal}>
                <button
                  className="check-btn"
                  onClick={() => marcar(indexReal)}
                >
                  <span className="check-icon">✓</span>
                </button>
                <span className="item-nome">{item.nome}</span>
                <button
                  className="btn-remover-item"
                  onClick={() => remover(indexReal)}
                >
                  ✕
                </button>
              </div>
            );

          })}

        </div>
      )}

    </div>
  );
}
