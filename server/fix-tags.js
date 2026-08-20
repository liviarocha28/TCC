const { MongoClient } = require("mongodb");
const Db = 'mongodb+srv://livia:120501@cluster0.qk4xuno.mongodb.net/?appName=Cluster0';

async function corrigir() {
  const client = new MongoClient(Db);
  await client.connect();
  const db = client.db("tcc");
  const col = db.collection("ingredientes");

  const correcoes = {
    "Farinha de Aveia": [],
    "Farinha de amêndoas": [],
    "Frutas vermelhas": [],
    "Pimentão vermelho": [],
    "Pimentão amarelo": [],
    "Bebida vegetal": [],
    "Goma de tapioca hidratada": [],
  };

  for (const [nome, tags] of Object.entries(correcoes)) {
    await col.updateOne({ nome }, { $set: { tags } });
    console.log(`${nome}: [${tags.join(", ")}]`);
  }

  console.log("\nCorrecoes feitas!");
  await client.close();
}

corrigir();
