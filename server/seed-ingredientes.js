const { MongoClient } = require("mongodb");

const Db = 'mongodb+srv://livia:120501@cluster0.qk4xuno.mongodb.net/?appName=Cluster0';

const ingredientes = [
  { nome: "Aveia em flocos", categoria: "Grãos", medidas: ["100g"], calorias: 394, proteinas: 13.9, carboidratos: 66.6, gorduras: 8.5, fibras: 9.1, acucares: 0.9 },
  { nome: "Farelo de aveia", categoria: "Grãos", medidas: ["100g"], calorias: 246, proteinas: 17.3, carboidratos: 66.2, gorduras: 7, fibras: 15.4, acucares: 1.5 },
  { nome: "Pasta de amendoim", categoria: "Sementes", medidas: ["colher de sopa"], calorias: 94, proteinas: 4, carboidratos: 3.2, gorduras: 8, fibras: 1.3, acucares: 1.5 },
  { nome: "Gema de ovo", categoria: "Proteína", medidas: ["unidade"], calorias: 55, proteinas: 2.7, carboidratos: 0.6, gorduras: 4.5, fibras: 0, acucares: 0.1 },
  { nome: "Açúcar mascavo", categoria: "Carboidrato", medidas: ["100g"], calorias: 380, proteinas: 0.1, carboidratos: 97, gorduras: 0, fibras: 0, acucares: 97 },
  { nome: "Açúcar de coco", categoria: "Carboidrato", medidas: ["100g"], calorias: 375, proteinas: 1.1, carboidratos: 92, gorduras: 0, fibras: 1.1, acucares: 88 },
  { nome: "Fermento em pó", categoria: "Carboidrato", medidas: ["colher de chá"], calorias: 5, proteinas: 0, carboidratos: 1.2, gorduras: 0, fibras: 0, acucares: 0 },
  { nome: "Chocolate meio amargo", categoria: "Carboidrato", medidas: ["100g"], calorias: 535, proteinas: 7.8, carboidratos: 59, gorduras: 30, fibras: 7, acucares: 48 },
  { nome: "Cacau em pó 100%", categoria: "Carboidrato", medidas: ["colher de sopa"], calorias: 23, proteinas: 1.2, carboidratos: 3.1, gorduras: 1.4, fibras: 1.8, acucares: 0.1 },
  { nome: "Adoçante culinário", categoria: "Carboidrato", medidas: ["colher de sopa"], calorias: 20, proteinas: 0, carboidratos: 5, gorduras: 0, fibras: 0, acucares: 0 },
  { nome: "Adoçante natural", categoria: "Carboidrato", medidas: ["colher de chá"], calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0, fibras: 0, acucares: 0 },
  { nome: "Xarope natural", categoria: "Carboidrato", medidas: ["colher de sopa"], calorias: 52, proteinas: 0, carboidratos: 13, gorduras: 0, fibras: 0, acucares: 12 },
  { nome: "Batata", categoria: "Carboidrato", medidas: ["100g"], calorias: 52, proteinas: 1.2, carboidratos: 11.9, gorduras: 0.1, fibras: 1.3, acucares: 0.8 },
  { nome: "Batata-doce", categoria: "Carboidrato", medidas: ["100g"], calorias: 118, proteinas: 1.3, carboidratos: 28.2, gorduras: 0.1, fibras: 2.6, acucares: 5.5 },
  { nome: "Requeijão light", categoria: "Laticínios", medidas: ["colher de sopa"], calorias: 40, proteinas: 2.5, carboidratos: 1.5, gorduras: 2.8, fibras: 0, acucares: 1 },
  { nome: "Creme de ricota", categoria: "Laticínios", medidas: ["colher de sopa"], calorias: 35, proteinas: 2.2, carboidratos: 1, gorduras: 2.5, fibras: 0, acucares: 0.5 },
  { nome: "Iogurte desnatado", categoria: "Laticínios", medidas: ["100g"], calorias: 41, proteinas: 3.8, carboidratos: 5.8, gorduras: 0.3, fibras: 0, acucares: 5.8 },
  { nome: "Iogurte grego", categoria: "Laticínios", medidas: ["100g"], calorias: 97, proteinas: 9, carboidratos: 3.9, gorduras: 5, fibras: 0, acucares: 3.9 },
  { nome: "Leite", categoria: "Laticínios", medidas: ["100g"], calorias: 61, proteinas: 3.2, carboidratos: 4.8, gorduras: 3.3, fibras: 0, acucares: 4.8 },
  { nome: "Leite desnatado", categoria: "Laticínios", medidas: ["100g"], calorias: 35, proteinas: 3.4, carboidratos: 5, gorduras: 0.2, fibras: 0, acucares: 5 },
  { nome: "Bebida vegetal", categoria: "Laticínios", medidas: ["100ml"], calorias: 40, proteinas: 1, carboidratos: 4, gorduras: 2, fibras: 0.5, acucares: 2 },
  { nome: "Cebola", categoria: "Verdura", medidas: ["100g"], calorias: 39, proteinas: 1.7, carboidratos: 8.9, gorduras: 0.1, fibras: 1.7, acucares: 4.2 },
  { nome: "Cebola roxa", categoria: "Verdura", medidas: ["100g"], calorias: 40, proteinas: 1.1, carboidratos: 9.3, gorduras: 0.1, fibras: 1.7, acucares: 4.2 },
  { nome: "Alho", categoria: "Verdura", medidas: ["unidade"], calorias: 5, proteinas: 0.3, carboidratos: 1, gorduras: 0, fibras: 0.1, acucares: 0 },
  { nome: "Molho de tomate", categoria: "Verdura", medidas: ["100g"], calorias: 29, proteinas: 1.4, carboidratos: 5.5, gorduras: 0.2, fibras: 1.5, acucares: 3.8 },
  { nome: "Azeite de oliva", categoria: "Sementes", medidas: ["colher de sopa"], calorias: 119, proteinas: 0, carboidratos: 0, gorduras: 13.5, fibras: 0, acucares: 0 },
  { nome: "Sal", categoria: "Carboidrato", medidas: ["colher de chá"], calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0, fibras: 0, acucares: 0 },
  { nome: "Cenoura", categoria: "Verdura", medidas: ["100g"], calorias: 34, proteinas: 1.3, carboidratos: 7.7, gorduras: 0.2, fibras: 3.2, acucares: 3.4 },
  { nome: "Abobrinha", categoria: "Verdura", medidas: ["100g"], calorias: 17, proteinas: 1.2, carboidratos: 3.1, gorduras: 0.3, fibras: 1, acucares: 2.5 },
  { nome: "Caldo de legumes", categoria: "Verdura", medidas: ["100ml"], calorias: 10, proteinas: 0.5, carboidratos: 1.5, gorduras: 0.2, fibras: 0.3, acucares: 0.5 },
  { nome: "Grão-de-bico", categoria: "Grãos", medidas: ["100g"], calorias: 164, proteinas: 8.9, carboidratos: 27.4, gorduras: 2.6, fibras: 7.6, acucares: 4.8 },
  { nome: "Limão", categoria: "Fruta", medidas: ["unidade"], calorias: 17, proteinas: 0.6, carboidratos: 5.4, gorduras: 0.2, fibras: 1.6, acucares: 1.5 },
  { nome: "Morango", categoria: "Fruta", medidas: ["100g"], calorias: 30, proteinas: 0.9, carboidratos: 6.5, gorduras: 0.3, fibras: 1.7, acucares: 4.9 },
  { nome: "Frutas vermelhas", categoria: "Fruta", medidas: ["100g"], calorias: 50, proteinas: 1, carboidratos: 12, gorduras: 0.4, fibras: 4, acucares: 7 },
  { nome: "Espinafre", categoria: "Verdura", medidas: ["folha"], calorias: 1, proteinas: 0.1, carboidratos: 0.1, gorduras: 0, fibras: 0.1, acucares: 0 },
  { nome: "Goma de tapioca hidratada", categoria: "Carboidrato", medidas: ["colher de sopa"], calorias: 24, proteinas: 0, carboidratos: 6, gorduras: 0, fibras: 0, acucares: 0 },
  { nome: "Açafrão", categoria: "Carboidrato", medidas: ["colher de chá"], calorias: 9, proteinas: 0.3, carboidratos: 2, gorduras: 0.1, fibras: 0.7, acucares: 0.1 },
  { nome: "Wrap integral", categoria: "Grãos", medidas: ["unidade"], calorias: 170, proteinas: 5, carboidratos: 29, gorduras: 4, fibras: 4, acucares: 2 },
  { nome: "Pão", categoria: "Grãos", medidas: ["fatia"], calorias: 65, proteinas: 2.5, carboidratos: 12, gorduras: 1, fibras: 0.7, acucares: 1.5 },
  { nome: "Vagem", categoria: "Verdura", medidas: ["100g"], calorias: 31, proteinas: 1.8, carboidratos: 7, gorduras: 0.1, fibras: 3.4, acucares: 3.3 },
  { nome: "Ervilha", categoria: "Verdura", medidas: ["100g"], calorias: 81, proteinas: 5.4, carboidratos: 14.5, gorduras: 0.4, fibras: 5.1, acucares: 5.7 },
  { nome: "Milho verde", categoria: "Grãos", medidas: ["100g"], calorias: 96, proteinas: 3.4, carboidratos: 21, gorduras: 1.5, fibras: 2.4, acucares: 4.5 },
  { nome: "Óleo de coco", categoria: "Sementes", medidas: ["colher de sopa"], calorias: 121, proteinas: 0, carboidratos: 0, gorduras: 13.5, fibras: 0, acucares: 0 },
  { nome: "Farinha de amêndoas", categoria: "Sementes", medidas: ["100g"], calorias: 571, proteinas: 21.2, carboidratos: 21.4, gorduras: 50, fibras: 10.7, acucares: 4.4 },
  { nome: "Farinha integral", categoria: "Grãos", medidas: ["100g"], calorias: 340, proteinas: 13, carboidratos: 72, gorduras: 2.5, fibras: 10.7, acucares: 0.4 },
  { nome: "Bicarbonato de sódio", categoria: "Carboidrato", medidas: ["colher de chá"], calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0, fibras: 0, acucares: 0 },
  { nome: "Trigo para quibe", categoria: "Grãos", medidas: ["100g"], calorias: 342, proteinas: 12.5, carboidratos: 75, gorduras: 1.3, fibras: 12.5, acucares: 0.4 },
  { nome: "Hortelã", categoria: "Verdura", medidas: ["folha"], calorias: 1, proteinas: 0.1, carboidratos: 0.2, gorduras: 0, fibras: 0.1, acucares: 0 },
  { nome: "Berinjela", categoria: "Verdura", medidas: ["100g"], calorias: 20, proteinas: 1, carboidratos: 4.4, gorduras: 0.2, fibras: 2.9, acucares: 2.4 },
  { nome: "Milho", categoria: "Grãos", medidas: ["100g"], calorias: 96, proteinas: 3.4, carboidratos: 21, gorduras: 1.5, fibras: 2.4, acucares: 4.5 },
  { nome: "Pimentão vermelho", categoria: "Verdura", medidas: ["100g"], calorias: 31, proteinas: 1, carboidratos: 6, gorduras: 0.3, fibras: 2.1, acucares: 4.2 },
  { nome: "Pimentão amarelo", categoria: "Verdura", medidas: ["100g"], calorias: 27, proteinas: 1, carboidratos: 6.3, gorduras: 0.2, fibras: 0.9, acucares: 4.2 },
  { nome: "Gengibre", categoria: "Verdura", medidas: ["100g"], calorias: 80, proteinas: 1.8, carboidratos: 17.8, gorduras: 0.8, fibras: 2, acucares: 1.7 },
  { nome: "Molho shoyu light", categoria: "Carboidrato", medidas: ["colher de sopa"], calorias: 8, proteinas: 1.2, carboidratos: 0.8, gorduras: 0, fibras: 0, acucares: 0.4 },
  { nome: "Amido de milho", categoria: "Carboidrato", medidas: ["colher de sopa"], calorias: 31, proteinas: 0, carboidratos: 7.5, gorduras: 0, fibras: 0, acucares: 0 },
  { nome: "Amendoim torrado sem sal", categoria: "Sementes", medidas: ["100g"], calorias: 606, proteinas: 22.5, carboidratos: 18.7, gorduras: 54, fibras: 7.8, acucares: 4.2 },
  { nome: "Alecrim", categoria: "Verdura", medidas: ["folha"], calorias: 1, proteinas: 0.1, carboidratos: 0.2, gorduras: 0, fibras: 0.1, acucares: 0 }
];

async function inserir() {
  const client = new MongoClient(Db);

  try {
    await client.connect();
    const db = client.db("tcc");
    const collection = db.collection("ingredientes");

    const existentes = await collection.find({}).toArray();
    const nomesExistentes = existentes.map(e => e.nome);

    const novos = ingredientes.filter(i => !nomesExistentes.includes(i.nome));

    if (novos.length === 0) {
      console.log("Todos os ingredientes já existem no banco.");
      return;
    }

    const result = await collection.insertMany(novos);
    console.log(`${result.insertedCount} ingredientes inseridos com sucesso!`);
    console.log(`(${ingredientes.length - novos.length} já existiam e foram ignorados)`);

  } catch (error) {
    console.error("Erro:", error);
  } finally {
    await client.close();
  }
}

inserir();
