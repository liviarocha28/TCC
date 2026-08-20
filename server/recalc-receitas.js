const { MongoClient } = require("mongodb");
const Db = 'mongodb+srv://livia:120501@cluster0.qk4xuno.mongodb.net/?appName=Cluster0';

async function recalcularTudo() {
  const client = new MongoClient(Db);
  await client.connect();
  const db = client.db("tcc");
  const receitasCol = db.collection("receitas");
  const ingredientesCol = db.collection("ingredientes");

  const ingredientes = await ingredientesCol.find({}).toArray();
  const receitas = await receitasCol.find({}).toArray();

  for (const r of receitas) {
    let kcal = 0, proteinas = 0, carboidratos = 0, gorduras = 0, fibras = 0, acucares = 0;

    for (const ing of (r.ingredientes || [])) {
      const base = ingredientes.find(i => i.nome === ing.nome);
      if (!base) {
        console.log(`  ${r.nome}: ingrediente "${ing.nome}" nao encontrado no banco`);
        continue;
      }

      const qtd = parseFloat(ing.quantidade);
      if (!qtd || qtd <= 0) continue;

      let fator = 1;
      if (ing.medida === "g") fator = qtd / 100;
      else if (ing.medida === "kg") fator = qtd * 10;
      else if (ing.medida === "ml") fator = qtd / 100;
      else fator = qtd;

      kcal += (base.calorias || 0) * fator;
      proteinas += (base.proteinas || 0) * fator;
      carboidratos += (base.carboidratos || 0) * fator;
      gorduras += (base.gorduras || 0) * fator;
      fibras += (base.fibras || 0) * fator;
      acucares += (base.acucares || 0) * fator;
    }

    const valores = {
      kcal: kcal.toFixed(1),
      proteinas: proteinas.toFixed(1),
      carboidratos: carboidratos.toFixed(1),
      gorduras: gorduras.toFixed(1),
      fibras: fibras.toFixed(1),
      acucares: acucares.toFixed(1)
    };

    await receitasCol.updateOne({ _id: r._id }, { $set: valores });
    console.log(`${r.nome}: ${valores.kcal} kcal, ${valores.proteinas}g prot`);
  }

  console.log("\nTodas as receitas recalculadas!");
  await client.close();
}

recalcularTudo();
