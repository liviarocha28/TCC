const { MongoClient } = require("mongodb");
const Db = 'mongodb+srv://livia:120501@cluster0.qk4xuno.mongodb.net/?appName=Cluster0';

async function fix() {
  const client = new MongoClient(Db);
  await client.connect();
  const db = client.db("tcc");
  const col = db.collection("ingredientes");

  const ingredientes = await col.find({}).toArray();
  for (const ing of ingredientes) {
    const novasMedidas = (ing.medidas || []).map(m => m === "100g" ? "g" : m);
    if (!novasMedidas.includes("g")) novasMedidas.unshift("g");
    if (!novasMedidas.includes("ml")) novasMedidas.push("ml");
    await col.updateOne({ _id: ing._id }, { $set: { medidas: novasMedidas } });
    console.log(ing.nome + ": " + JSON.stringify(novasMedidas));
  }

  console.log("\nPronto!");
  await client.close();
}

fix();
