const { MongoClient } = require("mongodb");
const Db = 'mongodb+srv://livia:120501@cluster0.qk4xuno.mongodb.net/?appName=Cluster0';

async function fix() {
  const client = new MongoClient(Db);
  await client.connect();
  const db = client.db("tcc");
  const col = db.collection("receitas");

  const receitas = await col.find({}).toArray();
  let total = 0;

  for (const r of receitas) {
    let mudou = false;
    for (const ing of (r.ingredientes || [])) {
      if (ing.medida === "100g") {
        ing.medida = "g";
        mudou = true;
        total++;
      }
      if (ing.medida === "100ml") {
        ing.medida = "ml";
        mudou = true;
        total++;
      }
    }
    if (mudou) {
      await col.updateOne({ _id: r._id }, { $set: { ingredientes: r.ingredientes } });
    }
  }

  console.log(total + " medidas corrigidas nas receitas!");
  await client.close();
}

fix();
