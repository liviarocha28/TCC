const { MongoClient } = require("mongodb");
const Db = 'mongodb+srv://livia:120501@cluster0.qk4xuno.mongodb.net/?appName=Cluster0';

// Conversoes aproximadas para gramas
const conversoes = {
  "colher de sopa": 10,
  "colher de chá": 3,
  "unidade": null,  // varia por ingrediente
  "fatia": 30,
  "folha": 1,
  "copo": 200,
};

// Peso medio por ingrediente quando medida = "unidade"
const pesoUnidade = {
  "Banana": 120,
  "Ovo": 60,
  "Cebola": 110,
  "Cebola roxa": 110,
  "Alho": 5,
  "Limão": 80,
  "Abobrinha": 200,
  "Cenoura": 100,
  "Berinjela": 300,
  "Pimentão vermelho": 150,
  "Pimentão amarelo": 150,
  "Wrap integral": 60,
  "Tomate (unidade)": 120,
};

async function corrigir() {
  const client = new MongoClient(Db);
  await client.connect();
  const db = client.db("tcc");
  const col = db.collection("receitas");

  const receitas = await col.find({}).toArray();

  for (const r of receitas) {
    let mudou = false;
    const novosIngredientes = [];

    for (const ing of (r.ingredientes || [])) {
      const med = ing.medida;
      const qtd = parseFloat(ing.quantidade);
      let novaQtd = qtd;
      let novaMed = med;

      if (med === "colher de sopa" && qtd) {
        novaQtd = String(qtd * 10);
        novaMed = "g";
        mudou = true;
      } else if (med === "colher de chá" && qtd) {
        novaQtd = String(qtd * 3);
        novaMed = "g";
        mudou = true;
      } else if (med === "unidade" && qtd) {
        const peso = pesoUnidade[ing.nome];
        if (peso) {
          novaQtd = String(qtd * peso);
          novaMed = "g";
          mudou = true;
        }
      } else if (med === "fatia" && qtd) {
        novaQtd = String(qtd * 30);
        novaMed = "g";
        mudou = true;
      } else if (med === "folha" && qtd) {
        novaQtd = String(qtd * 1);
        novaMed = "g";
        mudou = true;
      } else if (med === "copo" && qtd) {
        novaQtd = String(qtd * 200);
        novaMed = "ml";
        mudou = true;
      }

      novosIngredientes.push({
        nome: ing.nome,
        quantidade: novaQtd,
        medida: novaMed
      });
    }

    if (mudou) {
      await col.updateOne({ _id: r._id }, { $set: { ingredientes: novosIngredientes } });
      console.log(r.nome + " atualizada:");
      novosIngredientes.forEach(i => console.log("  " + i.quantidade + " " + i.medida + " " + i.nome));
    }
  }

  console.log("\nConversoes concluidas!");
  await client.close();
}

corrigir();
