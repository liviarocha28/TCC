const { MongoClient } = require("mongodb");
const Db = 'mongodb+srv://livia:120501@cluster0.qk4xuno.mongodb.net/?appName=Cluster0';

async function corrigir() {
  const client = new MongoClient(Db);
  await client.connect();
  const db = client.db("tcc");
  const col = db.collection("receitas");

  const receitas = await col.find({}).toArray();

  for (const r of receitas) {
    let mudou = false;

    for (const ing of (r.ingredientes || [])) {
      const qtd = parseFloat(ing.quantidade);

      // Corrige quantidades zero ou negativas
      if (isNaN(qtd) || qtd < 0) {
        console.log(`FIX ZERO: ${r.nome} > ${ing.nome} qtd=${ing.quantidade} -> 0`);
        ing.quantidade = "0";
        mudou = true;
      }

      // Corrige "100ml" que deveria ser "100g" ou "ml"
      if (ing.medida === "100ml") {
        console.log(`FIX MEDIDA: ${r.nome} > ${ing.nome} medida=100ml -> ml`);
        ing.medida = "ml";
        mudou = true;
      }

      // Corrige xícara para grãos/léguas que deveriam ser "100g"
      if (ing.medida === "xícara" && ["Grão-de-bico", "Arroz", "Trigo para quibe"].includes(ing.nome)) {
        console.log(`FIX XICARA: ${r.nome} > ${ing.nome} medida=xícara -> 100g`);
        ing.medida = "100g";
        mudou = true;
      }
    }

    if (mudou) {
      await col.updateOne({ _id: r._id }, { $set: { ingredientes: r.ingredientes } });
      console.log(`  -> ${r.nome} atualizada`);
    }
  }

  console.log("\nCorreções concluídas!");
  await client.close();
}

corrigir();
