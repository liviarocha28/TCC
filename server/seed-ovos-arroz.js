const { MongoClient } = require("mongodb");

const Db = 'mongodb+srv://livia:120501@cluster0.qk4xuno.mongodb.net/?appName=Cluster0';

const novosIngredientes = [
  {
    nome: "Ovo",
    categoria: "Proteína",
    medidas: ["unidade"],
    calorias: 78,
    proteinas: 6.3,
    carboidratos: 0.6,
    gorduras: 5.3,
    fibras: 0,
    acucares: 0.4
  },
  {
    nome: "Arroz",
    categoria: "Grãos",
    medidas: ["100g"],
    calorias: 205,
    proteinas: 4.3,
    carboidratos: 44.5,
    gorduras: 0.4,
    fibras: 0.6,
    acucares: 0.1
  }
];

async function inserir() {
  const client = new MongoClient(Db);

  try {
    await client.connect();
    const db = client.db("tcc");
    const collection = db.collection("ingredientes");

    const existentes = await collection.find({}).toArray();
    const nomesExistentes = existentes.map(e => e.nome);

    const novos = novosIngredientes.filter(i => !nomesExistentes.includes(i.nome));

    if (novos.length === 0) {
      console.log("Todos os ingredientes já existem no banco.");
      return;
    }

    const result = await collection.insertMany(novos);
    console.log(`${result.insertedCount} ingredientes inseridos com sucesso!`);

  } catch (error) {
    console.error("Erro:", error);
  } finally {
    await client.close();
  }
}

inserir();
