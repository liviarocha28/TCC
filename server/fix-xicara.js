const { MongoClient } = require("mongodb");
const Db = 'mongodb+srv://livia:120501@cluster0.qk4xuno.mongodb.net/?appName=Cluster0';

// Peso em gramas por xícara de cada ingrediente
const pesoXCara = {
  "Aveia em flocos": 80,
  "Açúcar mascavo": 130,
  "Farinha de amêndoas": 96,
  "Cacau em pó 100%": 85,
  "Morango": 150,
  "Iogurte grego": 245,
  "Leite": 240,
  "Espinafre": 30,
  "Goma de tapioca hidratada": 150,
  "Molho de tomate": 240,
  "Caldo de legumes": 240,
  "Óleo de coco": 218,
  "Hortelã": 20,
  "Abobrinha": 130,
  "Cenoura": 110,
  "Ervilha": 140,
  "Molho shoyu light": 240,
  "Amendoim torrado sem sal": 145,
  "Frango": 140,
  "Grão-de-bico": 160,
  "Trigo para quibe": 120,
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
      let novaQtd = ing.quantidade;
      let novaMed = ing.medida;

      if (ing.medida === "xícara") {
        const peso = pesoXCara[ing.nome] || 150;
        const qtd = parseFloat(ing.quantidade);
        if (qtd) {
          novaQtd = String(Math.round(qtd * peso));
          novaMed = "g";
          mudou = true;
        }
      }

      novosIngredientes.push({ nome: ing.nome, quantidade: novaQtd, medida: novaMed });
    }

    if (mudou) {
      await col.updateOne({ _id: r._id }, { $set: { ingredientes: novosIngredientes } });
      console.log(r.nome + ":");
      novosIngredientes.forEach(i => console.log("  " + i.quantidade + " " + i.medida + " " + i.nome));
    }
  }

  console.log("\nConversoes de xícara concluidas!");
  await client.close();
}

corrigir();
