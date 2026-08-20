const { MongoClient } = require("mongodb");
const Db = 'mongodb+srv://livia:120501@cluster0.qk4xuno.mongodb.net/?appName=Cluster0';

// Mapeamento de tags por nome do ingrediente
const tagMap = {
  // LACTOSE
  "Leite": ["lactose", "derivado_animal"],
  "Leite desnatado": ["lactose", "derivado_animal"],
  "Iogurte Natural": ["lactose", "derivado_animal"],
  "Iogurte desnatado": ["lactose", "derivado_animal"],
  "Iogurte grego": ["lactose", "derivado_animal"],
  "Queijo mussarela": ["lactose", "derivado_animal"],
  "Queijo minas": ["lactose", "derivado_animal"],
  "Requeijão light": ["lactose", "derivado_animal"],
  "Creme de ricota": ["lactose", "derivado_animal"],
  "Bebida vegetal": [],

  // GLUTEN
  "Farinha integral": ["gluten"],
  "Pão": ["gluten"],
  "Trigo para quibe": ["gluten"],
  "Wrap integral": ["gluten"],

  // AMENDOIM
  "Pasta de amendoim": ["amendoim"],
  "Amendoim torrado sem sal": ["amendoim"],

  // CARNES / ORIGEM ANIMAL
  "Frango": ["carne", "origem_animal"],
  "Salmão": ["peixe", "origem_animal"],
  "Carne moída de patinho": ["carne", "origem_animal"],
  "Ovo": ["ovos", "origem_animal"],
  "Gema de ovo": ["ovos", "origem_animal"],

  // MEL
  "Mel": ["origem_animal"],
};

// Tags por categoria (fallback para ingredientes sem mapeamento)
const categoriaTags = {
  "Laticínios": ["lactose", "derivado_animal"],
  "Proteína": ["carne", "origem_animal"],
};

async function seedTags() {
  const client = new MongoClient(Db);
  await client.connect();
  const db = client.db("tcc");
  const col = db.collection("ingredientes");

  const ingredientes = await col.find({}).toArray();
  let atualizados = 0;

  for (const ing of ingredientes) {
    let tags = [];

    // 1. Busca por nome exato
    if (tagMap[ing.nome]) {
      tags = [...tagMap[ing.nome]];
    }

    // 2. Fallback por categoria
    if (tags.length === 0 && categoriaTags[ing.categoria]) {
      tags = [...categoriaTags[ing.categoria]];
    }

    // 3. Busca parcial no nome (para nomes como "Leite desnatado")
    if (tags.length === 0) {
      const nomeLower = ing.nome.toLowerCase();
      if (nomeLower.includes("leite") || nomeLower.includes("iogurte") || nomeLower.includes("queijo") || nomeLower.includes("ricota") || nomeLower.includes("requeijão")) {
        tags = ["lactose", "derivado_animal"];
      } else if (nomeLower.includes("frango") || nomeLower.includes("carne") || nomeLower.includes("peito")) {
        tags = ["carne", "origem_animal"];
      } else if (nomeLower.includes("peixe") || nomeLower.includes("salmão") || nomeLower.includes("atum")) {
        tags = ["peixe", "origem_animal"];
      } else if (nomeLower.includes("ovo") || nomeLower.includes("gema")) {
        tags = ["ovos", "origem_animal"];
      } else if (nomeLower.includes("amendoim") || nomeLower.includes("pasta de amendoim")) {
        tags = ["amendoim"];
      } else if (nomeLower.includes("trigo") || nomeLower.includes("farinha") || nomeLower.includes("pão") || nomeLower.includes("macarrão")) {
        tags = ["gluten"];
      } else if (nomeLower.includes("mel")) {
        tags = ["origem_animal"];
      }
    }

    // 4. Sempre marca ingredientes de origem animal pela categoria
    if (tags.length === 0) {
      const cat = ing.categoria;
      if (cat === "Laticínios") tags = ["lactose", "derivado_animal"];
      else if (cat === "Proteína") tags = ["carne", "origem_animal"];
    }

    if (tags.length > 0) {
      await col.updateOne({ _id: ing._id }, { $set: { tags } });
      console.log(`${ing.nome}: [${tags.join(", ")}]`);
      atualizados++;
    } else {
      // Ingrediente sem restrição - salva array vazio
      await col.updateOne({ _id: ing._id }, { $set: { tags: [] } });
    }
  }

  console.log(`\n${atualizados} ingredientes atualizados com tags!`);
  await client.close();
}

seedTags();
