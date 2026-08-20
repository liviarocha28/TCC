const { MongoClient } = require("mongodb");
const Db = 'mongodb+srv://livia:120501@cluster0.qk4xuno.mongodb.net/?appName=Cluster0';

async function corrigir() {
  const client = new MongoClient(Db);
  await client.connect();
  const db = client.db("tcc");
  const col = db.collection("receitas");

  const correcoes = [
    // Tapioca de Frango
    { nome: "Tapioca de Frango", ing: "Frango", qtd: "50", med: "g" },
    { nome: "Tapioca de Frango", ing: "Tomate (gramas)", qtd: "15", med: "g" },

    // Cookies de Aveia
    { nome: "Cookies de Aveia", ing: "Chocolate meio amargo", qtd: "20", med: "g" },

    // Mousse de Cacau
    { nome: "Mousse de Cacau Saudável", ing: "Iogurte desnatado", qtd: "150", med: "g" },

    // Risoto de Frango
    { nome: "Risoto de Frango com Legumes", ing: "Frango", qtd: "250", med: "g" },

    // Tapioca Recheada
    { nome: "Tapioca Recheada", ing: "Frango", qtd: "100", med: "g" },

    // Wrap Integral
    { nome: "Wrap Integral de Frango", ing: "Frango", qtd: "100", med: "g" },

    // Bolo de Maçã com Chocolate
    { nome: "Bolo de Maçã com Chocolate", ing: "Chocolate meio amargo", qtd: "45", med: "g" },

    // Empada de Frango
    { nome: "Empada de Frango", ing: "Batata-doce", qtd: "150", med: "g" },
    { nome: "Empada de Frango", ing: "Frango", qtd: "200", med: "g" },

    // Lasanha
    { nome: "Lasanha de Berinjela com Carne Moída", ing: "Molho de tomate", qtd: "340", med: "g" },

    // Mingau de Aveia
    { nome: "Mingau de Aveia com Banana", ing: "Leite", qtd: "200", med: "ml" },

    // Panqueca
    { nome: "Panqueca de Espinafre com Carne Moída", ing: "Farinha de amêndoas", qtd: "100", med: "g" },

    // Sanduíche
    { nome: "Sanduíche Natural", ing: "Frango", qtd: "100", med: "g" },

    // Frango Cremoso
    { nome: "Frango Cremoso com Milho e Requeijão", ing: "Frango", qtd: "400", med: "g" },
    { nome: "Frango Cremoso com Milho e Requeijão", ing: "Milho verde", qtd: "150", med: "g" },
    { nome: "Frango Cremoso com Milho e Requeijão", ing: "Leite desnatado", qtd: "200", med: "ml" },

    // Frango Assado
    { nome: "Frango Assado com Batata-Doce e Legumes", ing: "Frango", qtd: "500", med: "g" },
    { nome: "Frango Assado com Batata-Doce e Legumes", ing: "Batata-doce", qtd: "400", med: "g" },
    { nome: "Frango Assado com Batata-Doce e Legumes", ing: "Cenoura", qtd: "150", med: "g" },
    { nome: "Frango Assado com Batata-Doce e Legumes", ing: "Abobrinha", qtd: "200", med: "g" },

    // Frango Xadrez
    { nome: "Frango Xadrez Saudável", ing: "Frango", qtd: "400", med: "g" },

    // Hambúrguer
    { nome: "Hambúrguer Caseiro de Frango", ing: "Frango", qtd: "150", med: "g" },
  ];

  for (const c of correcoes) {
    const r = await col.updateOne(
      { nome: c.nome, "ingredientes.nome": c.ing },
      { $set: { "ingredientes.$.quantidade": c.qtd, "ingredientes.$.medida": c.med } }
    );
    console.log(`${c.nome} > ${c.ing}: ${c.qtd} ${c.med} (${r.modifiedCount})`);
  }

  console.log("\nCorreções concluídas!");
  await client.close();
}

corrigir();
