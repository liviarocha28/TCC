const { MongoClient } = require("mongodb");

const Db = 'mongodb+srv://livia:120501@cluster0.qk4xuno.mongodb.net/?appName=Cluster0';

const receitas = [
  {
    nome: "Cookies de Aveia",
    descricao: "Cookies caseiros de aveia e banana, com toque de chocolate, ideais para um lanche simples.",
    foto: "",
    tags: ["#facil", "#lanche", "#fibra"],
    ingredientes: [
      { nome: "Aveia em flocos", quantidade: "1", medida: "xícara" },
      { nome: "Banana", quantidade: "1", medida: "unidade" },
      { nome: "Ovo", quantidade: "1", medida: "unidade" },
      { nome: "Açúcar mascavo", quantidade: "0.25", medida: "xícara" },
      { nome: "Fermento em pó", quantidade: "1", medida: "colher de chá" },
      { nome: "Chocolate meio amargo", quantidade: "0", medida: "100g" }
    ],
    calorias: 180, proteinas: 5.5, carboidratos: 28, gorduras: 5.5, fibras: 3.5, acucares: 10
  },
  {
    nome: "Escondidinho de Frango",
    descricao: "Preparação cremosa de frango desfiado com batata, molho de tomate e queijo.",
    foto: "",
    tags: ["#almoco", "#jantar", "#altoemproteina", "#fibra"],
    ingredientes: [
      { nome: "Frango", quantidade: "500", medida: "100g" },
      { nome: "Batata", quantidade: "3", medida: "unidade" },
      { nome: "Requeijão light", quantidade: "2", medida: "colher de sopa" },
      { nome: "Cebola", quantidade: "1", medida: "unidade" },
      { nome: "Alho", quantidade: "2", medida: "unidade" },
      { nome: "Molho de tomate", quantidade: "1", medida: "xícara" },
      { nome: "Azeite de oliva", quantidade: "1", medida: "colher de sopa" }
    ],
    calorias: 380, proteinas: 32, carboidratos: 25, gorduras: 14, fibras: 4, acucares: 5
  },
  {
    nome: "Mousse de Cacau Saudável",
    descricao: "Sobremesa cremosa à base de iogurte e cacau, com preparo rápido e poucos ingredientes.",
    foto: "",
    tags: ["#facil", "#rapido", "#sobremesa", "#calcio"],
    ingredientes: [
      { nome: "Iogurte desnatado", quantidade: "200", medida: "100g" },
      { nome: "Cacau em pó 100%", quantidade: "2", medida: "colher de sopa" },
      { nome: "Adoçante culinário", quantidade: "2", medida: "colher de sopa" }
    ],
    calorias: 120, proteinas: 10, carboidratos: 12, gorduras: 3, fibras: 3, acucares: 5
  },
  {
    nome: "Muffin Salgado de Legumes",
    descricao: "Muffin salgado com ovos, aveia, cenoura e abobrinha, ótimo para variar os lanches.",
    foto: "",
    tags: ["#facil", "#lanche", "#fibra", "#ferro"],
    ingredientes: [
      { nome: "Ovo", quantidade: "2", medida: "unidade" },
      { nome: "Aveia em flocos", quantidade: "4", medida: "colher de sopa" },
      { nome: "Azeite de oliva", quantidade: "1", medida: "colher de sopa" },
      { nome: "Cenoura", quantidade: "0.5", medida: "unidade" },
      { nome: "Abobrinha", quantidade: "0.5", medida: "unidade" },
      { nome: "Fermento em pó", quantidade: "1", medida: "colher de chá" }
    ],
    calorias: 220, proteinas: 10, carboidratos: 18, gorduras: 12, fibras: 3, acucares: 2
  },
  {
    nome: "Risoto de Frango com Legumes",
    descricao: "Risoto cremoso preparado com frango, arroz e diferentes legumes.",
    foto: "",
    tags: ["#almoco", "#jantar", "#altoemproteina", "#fibra"],
    ingredientes: [
      { nome: "Frango", quantidade: "300", medida: "100g" },
      { nome: "Abobrinha", quantidade: "1", medida: "unidade" },
      { nome: "Cenoura", quantidade: "1", medida: "unidade" },
      { nome: "Cebola", quantidade: "1", medida: "unidade" },
      { nome: "Alho", quantidade: "2", medida: "unidade" },
      { nome: "Azeite de oliva", quantidade: "2", medida: "colher de sopa" },
      { nome: "Caldo de legumes", quantidade: "4", medida: "xícara" },
      { nome: "Requeijão light", quantidade: "2", medida: "colher de sopa" }
    ],
    calorias: 420, proteinas: 35, carboidratos: 30, gorduras: 15, fibras: 4, acucares: 5
  },
  {
    nome: "Salada de Grão-de-Bico",
    descricao: "Salada fresca de grão-de-bico com tomate, cebola, ervas e limão.",
    foto: "",
    tags: ["#facil", "#rapido", "#fibra", "#potassio"],
    ingredientes: [
      { nome: "Grão-de-bico", quantidade: "2", medida: "xícara" },
      { nome: "Cebola roxa", quantidade: "0.5", medida: "unidade" },
      { nome: "Limão", quantidade: "0.5", medida: "unidade" },
      { nome: "Azeite de oliva", quantidade: "1", medida: "colher de sopa" }
    ],
    calorias: 350, proteinas: 14, carboidratos: 45, gorduras: 12, fibras: 12, acucares: 8
  },
  {
    nome: "Smoothie de Banana e Morango",
    descricao: "Bebida cremosa de banana, morango, iogurte e leite, com opção de adicionar espinafre.",
    foto: "",
    tags: ["#rapido", "#facil", "#cafe_da_manha", "#lanche", "#calcio"],
    ingredientes: [
      { nome: "Banana", quantidade: "1", medida: "unidade" },
      { nome: "Morango", quantidade: "1", medida: "xícara" },
      { nome: "Iogurte grego", quantidade: "0.5", medida: "xícara" },
      { nome: "Leite", quantidade: "0.5", medida: "xícara" },
      { nome: "Espinafre", quantidade: "1", medida: "folha" }
    ],
    calorias: 250, proteinas: 12, carboidratos: 38, gorduras: 5, fibras: 4, acucares: 20
  },
  {
    nome: "Tapioca Recheada",
    descricao: "Tapioca recheada com frango, requeijão light e tomate, com temperos a gosto.",
    foto: "",
    tags: ["#facil", "#rapido", "#cafe_da_manha", "#lanche", "#altoemproteina"],
    ingredientes: [
      { nome: "Goma de tapioca hidratada", quantidade: "3", medida: "colher de sopa" },
      { nome: "Frango", quantidade: "100", medida: "100g" },
      { nome: "Requeijão light", quantidade: "1", medida: "colher de sopa" },
      { nome: "Molho de tomate", quantidade: "2", medida: "colher de sopa" }
    ],
    calorias: 280, proteinas: 22, carboidratos: 25, gorduras: 8, fibras: 1, acucares: 2
  },
  {
    nome: "Wrap Integral de Frango",
    descricao: "Wrap recheado com frango, creme de ricota ou requeijão, alface, tomate e cenoura.",
    foto: "",
    tags: ["#facil", "#rapido", "#almoco", "#lanche", "#altoemproteina"],
    ingredientes: [
      { nome: "Wrap integral", quantidade: "1", medida: "unidade" },
      { nome: "Frango", quantidade: "100", medida: "100g" },
      { nome: "Requeijão light", quantidade: "2", medida: "colher de sopa" },
      { nome: "Cenoura", quantidade: "2", medida: "colher de sopa" }
    ],
    calorias: 350, proteinas: 28, carboidratos: 25, gorduras: 10, fibras: 4, acucares: 3
  },
  {
    nome: "Arroz com Legumes",
    descricao: "Arroz preparado com cenoura, abobrinha, ervilha ou milho e temperos simples.",
    foto: "",
    tags: ["#facil", "#almoco", "#jantar", "#fibra"],
    ingredientes: [
      { nome: "Cenoura", quantidade: "0.5", medida: "xícara" },
      { nome: "Abobrinha", quantidade: "0.5", medida: "xícara" },
      { nome: "Ervilha", quantidade: "0.5", medida: "xícara" },
      { nome: "Cebola", quantidade: "0.5", medida: "unidade" },
      { nome: "Alho", quantidade: "2", medida: "unidade" },
      { nome: "Azeite de oliva", quantidade: "1", medida: "colher de sopa" }
    ],
    calorias: 200, proteinas: 5, carboidratos: 35, gorduras: 5, fibras: 3, acucares: 3
  },
  {
    nome: "Bolo de Abobrinha com Chocolate",
    descricao: "Bolo de chocolate com abobrinha, cacau e farinhas de aveia e amêndoas.",
    foto: "",
    tags: ["#sobremesa", "#lanche", "#fibra"],
    ingredientes: [
      { nome: "Abobrinha", quantidade: "1.5", medida: "xícara" },
      { nome: "Ovo", quantidade: "3", medida: "unidade" },
      { nome: "Óleo de coco", quantidade: "0.5", medida: "xícara" },
      { nome: "Açúcar mascavo", quantidade: "1", medida: "xícara" },
      { nome: "Cacau em pó 100%", quantidade: "0.75", medida: "xícara" },
      { nome: "Farinha de amêndoas", quantidade: "0.5", medida: "xícara" },
      { nome: "Fermento em pó", quantidade: "1", medida: "colher de sopa" },
      { nome: "Bicarbonato de sódio", quantidade: "1", medida: "colher de chá" }
    ],
    calorias: 280, proteinas: 8, carboidratos: 30, gorduras: 16, fibras: 4, acucares: 12
  },
  {
    nome: "Bolo de Banana",
    descricao: "Bolo simples de banana e aveia, aromatizado com canela e adoçado principalmente pelas bananas.",
    foto: "",
    tags: ["#facil", "#lanche", "#cafe_da_manha", "#fibra", "#calcio"],
    ingredientes: [
      { nome: "Banana", quantidade: "4", medida: "unidade" },
      { nome: "Ovo", quantidade: "3", medida: "unidade" },
      { nome: "Aveia em flocos", quantidade: "1", medida: "xícara" },
      { nome: "Fermento em pó", quantidade: "1", medida: "colher de sopa" }
    ],
    calorias: 220, proteinas: 9, carboidratos: 32, gorduras: 6, fibras: 4, acucares: 14
  },
  {
    nome: "Bolo de Maçã com Chocolate",
    descricao: "Bolo de maçã e cacau com opção de acrescentar chocolate 70% na cobertura.",
    foto: "",
    tags: ["#sobremesa", "#lanche", "#fibra"],
    ingredientes: [
      { nome: "Ovo", quantidade: "2", medida: "unidade" },
      { nome: "Cacau em pó 100%", quantidade: "0.33", medida: "xícara" },
      { nome: "Fermento em pó", quantidade: "1", medida: "colher de sopa" },
      { nome: "Chocolate meio amargo", quantidade: "45", medida: "100g" }
    ],
    calorias: 250, proteinas: 7, carboidratos: 25, gorduras: 15, fibras: 4, acucares: 8
  },
  {
    nome: "Empada de Frango",
    descricao: "Empada de frango com massa de batata-doce e farinha de aveia, recheada com frango cremoso.",
    foto: "",
    tags: ["#lanche", "#altoemproteina", "#fibra", "#ferro"],
    ingredientes: [
      { nome: "Batata-doce", quantidade: "150", medida: "100g" },
      { nome: "Ovo", quantidade: "1", medida: "unidade" },
      { nome: "Farinha de amêndoas", quantidade: "1", medida: "xícara" },
      { nome: "Frango", quantidade: "300", medida: "100g" },
      { nome: "Azeite de oliva", quantidade: "1", medida: "colher de sopa" },
      { nome: "Cebola", quantidade: "0.5", medida: "unidade" },
      { nome: "Alho", quantidade: "1", medida: "unidade" },
      { nome: "Requeijão light", quantidade: "2", medida: "colher de sopa" }
    ],
    calorias: 350, proteinas: 28, carboidratos: 20, gorduras: 18, fibras: 3, acucares: 4
  },
  {
    nome: "Quibe de Carne",
    descricao: "Quibe assado preparado com carne moída, trigo para quibe, hortelã e temperos.",
    foto: "",
    tags: ["#almoco", "#jantar", "#altoemproteina", "#ferro"],
    ingredientes: [
      { nome: "Trigo para quibe", quantidade: "1", medida: "xícara" },
      { nome: "Cebola", quantidade: "1", medida: "unidade" },
      { nome: "Alho", quantidade: "2", medida: "unidade" },
      { nome: "Hortelã", quantidade: "0.5", medida: "xícara" },
      { nome: "Azeite de oliva", quantidade: "1", medida: "colher de sopa" }
    ],
    calorias: 380, proteinas: 30, carboidratos: 20, gorduras: 18, fibras: 3, acucares: 2
  },
  {
    nome: "Lasanha de Berinjela com Carne Moída",
    descricao: "Lasanha em camadas de berinjela, carne moída, molho de tomate e muçarela.",
    foto: "",
    tags: ["#almoco", "#jantar", "#altoemproteina", "#fibra", "#potassio"],
    ingredientes: [
      { nome: "Berinjela", quantidade: "2", medida: "unidade" },
      { nome: "Molho de tomate", quantidade: "340", medida: "100g" },
      { nome: "Cebola", quantidade: "0.5", medida: "unidade" },
      { nome: "Alho", quantidade: "2", medida: "unidade" },
      { nome: "Azeite de oliva", quantidade: "2", medida: "colher de sopa" }
    ],
    calorias: 350, proteinas: 25, carboidratos: 18, gorduras: 20, fibras: 5, acucares: 8
  },
  {
    nome: "Mingau de Aveia com Banana",
    descricao: "Mingau cremoso de aveia e leite com banana, canela e opção de mel.",
    foto: "",
    tags: ["#cafe_da_manha", "#lanche", "#facil", "#rapido", "#fibra", "#calcio"],
    ingredientes: [
      { nome: "Leite", quantidade: "200", medida: "100g" },
      { nome: "Aveia em flocos", quantidade: "3", medida: "colher de sopa" },
      { nome: "Banana", quantidade: "1", medida: "unidade" }
    ],
    calorias: 250, proteinas: 9, carboidratos: 40, gorduras: 6, fibras: 4, acucares: 14
  },
  {
    nome: "Omelete com Legumes",
    descricao: "Omelete de ovos com abobrinha, cenoura e tomate, temperado com orégano.",
    foto: "",
    tags: ["#facil", "#rapido", "#cafe_da_manha", "#altoemproteina", "#fibra"],
    ingredientes: [
      { nome: "Ovo", quantidade: "2", medida: "unidade" },
      { nome: "Abobrinha", quantidade: "0.5", medida: "unidade" },
      { nome: "Cenoura", quantidade: "0.5", medida: "unidade" },
      { nome: "Cebola", quantidade: "2", medida: "colher de sopa" },
      { nome: "Azeite de oliva", quantidade: "1", medida: "colher de chá" }
    ],
    calorias: 200, proteinas: 14, carboidratos: 6, gorduras: 14, fibras: 2, acucares: 3
  },
  {
    nome: "Panqueca de Espinafre com Carne Moída",
    descricao: "Panquecas com massa de espinafre e aveia, recheadas com carne moída temperada.",
    foto: "",
    tags: ["#almoco", "#jantar", "#altoemproteina", "#ferro", "#fibra"],
    ingredientes: [
      { nome: "Ovo", quantidade: "2", medida: "unidade" },
      { nome: "Leite", quantidade: "1", medida: "xícara" },
      { nome: "Espinafre", quantidade: "2", medida: "xícara" },
      { nome: "Farinha de amêndoas", quantidade: "1", medida: "xícara" },
      { nome: "Azeite de oliva", quantidade: "1", medida: "colher de sopa" },
      { nome: "Cebola", quantidade: "0.5", medida: "unidade" },
      { nome: "Alho", quantidade: "2", medida: "unidade" },
      { nome: "Molho de tomate", quantidade: "1", medida: "xícara" }
    ],
    calorias: 380, proteinas: 28, carboidratos: 18, gorduras: 22, fibras: 5, acucares: 4
  },
  {
    nome: "Pão de Queijo",
    descricao: "Pão de queijo simples preparado com queijo minas ou muçarela e requeijão light.",
    foto: "",
    tags: ["#lanche", "#cafe_da_manha", "#facil", "#calcio"],
    ingredientes: [
      { nome: "Goma de tapioca hidratada", quantidade: "1", medida: "xícara" },
      { nome: "Requeijão light", quantidade: "3", medida: "colher de sopa" },
      { nome: "Ovo", quantidade: "1", medida: "unidade" }
    ],
    calorias: 220, proteinas: 12, carboidratos: 20, gorduras: 10, fibras: 0, acucares: 1
  },
  {
    nome: "Sanduíche Natural",
    descricao: "Sanduíche simples com frango, creme de ricota ou requeijão, cenoura, alface e tomate.",
    foto: "",
    tags: ["#facil", "#rapido", "#lanche", "#altoemproteina"],
    ingredientes: [
      { nome: "Pão", quantidade: "2", medida: "fatia" },
      { nome: "Frango", quantidade: "100", medida: "100g" },
      { nome: "Requeijão light", quantidade: "1", medida: "colher de sopa" },
      { nome: "Cenoura", quantidade: "1", medida: "colher de sopa" }
    ],
    calorias: 300, proteinas: 24, carboidratos: 22, gorduras: 8, fibras: 2, acucares: 3
  },
  {
    nome: "Frango Cremoso com Milho e Requeijão",
    descricao: "Frango cremoso combinado com milho, leite e requeijão light, finalizado com temperos.",
    foto: "",
    tags: ["#almoco", "#jantar", "#altoemproteina", "#fibra"],
    ingredientes: [
      { nome: "Frango", quantidade: "500", medida: "100g" },
      { nome: "Milho verde", quantidade: "1", medida: "100g" },
      { nome: "Requeijão light", quantidade: "2", medida: "colher de sopa" },
      { nome: "Leite desnatado", quantidade: "200", medida: "100ml" },
      { nome: "Cebola", quantidade: "0.5", medida: "unidade" },
      { nome: "Alho", quantidade: "2", medida: "unidade" },
      { nome: "Azeite de oliva", quantidade: "1", medida: "colher de sopa" }
    ],
    calorias: 400, proteinas: 40, carboidratos: 18, gorduras: 16, fibras: 2, acucares: 4
  },
  {
    nome: "Frango Assado com Batata-Doce e Legumes",
    descricao: "Frango assado acompanhado de batata-doce, cenoura, abobrinha e cebola.",
    foto: "",
    tags: ["#almoco", "#jantar", "#altoemproteina", "#fibra", "#potassio"],
    ingredientes: [
      { nome: "Frango", quantidade: "700", medida: "100g" },
      { nome: "Batata-doce", quantidade: "600", medida: "100g" },
      { nome: "Cenoura", quantidade: "150", medida: "100g" },
      { nome: "Abobrinha", quantidade: "200", medida: "100g" },
      { nome: "Cebola roxa", quantidade: "1", medida: "unidade" },
      { nome: "Alho", quantidade: "3", medida: "unidade" },
      { nome: "Azeite de oliva", quantidade: "2", medida: "colher de sopa" }
    ],
    calorias: 450, proteinas: 42, carboidratos: 30, gorduras: 15, fibras: 5, acucares: 8
  },
  {
    nome: "Frango Xadrez Saudável",
    descricao: "Frango em cubos com pimentões, cenoura e molho shoyu, finalizado com amendoim e cebolinha.",
    foto: "",
    tags: ["#almoco", "#jantar", "#altoemproteina", "#fibra"],
    ingredientes: [
      { nome: "Frango", quantidade: "500", medida: "100g" },
      { nome: "Azeite de oliva", quantidade: "1", medida: "colher de sopa" },
      { nome: "Alho", quantidade: "2", medida: "unidade" },
      { nome: "Gengibre", quantidade: "1", medida: "colher de chá" },
      { nome: "Pimentão vermelho", quantidade: "0.5", medida: "unidade" },
      { nome: "Pimentão amarelo", quantidade: "0.5", medida: "unidade" },
      { nome: "Cenoura", quantidade: "1", medida: "unidade" },
      { nome: "Molho shoyu light", quantidade: "0.25", medida: "xícara" },
      { nome: "Amido de milho", quantidade: "1", medida: "colher de sopa" },
      { nome: "Amendoim torrado sem sal", quantidade: "0.33", medida: "xícara" }
    ],
    calorias: 420, proteinas: 40, carboidratos: 18, gorduras: 20, fibras: 3, acucares: 5
  },
  {
    nome: "Hambúrguer Caseiro de Frango",
    descricao: "Hambúrguer caseiro de frango com aveia e cenoura, temperado com alho, cebola e páprica.",
    foto: "",
    tags: ["#facil", "#rapido", "#almoco", "#lanche", "#altoemproteina", "#fibra"],
    ingredientes: [
      { nome: "Frango", quantidade: "150", medida: "100g" },
      { nome: "Aveia em flocos", quantidade: "2", medida: "colher de sopa" },
      { nome: "Cenoura", quantidade: "2", medida: "colher de sopa" },
      { nome: "Alho", quantidade: "0.5", medida: "unidade" },
      { nome: "Cebola", quantidade: "1", medida: "colher de sopa" },
      { nome: "Azeite de oliva", quantidade: "1", medida: "colher de sopa" }
    ],
    calorias: 280, proteinas: 25, carboidratos: 12, gorduras: 14, fibras: 2, acucares: 2
  }
];

async function inserir() {
  const client = new MongoClient(Db);

  try {
    await client.connect();
    const db = client.db("tcc");
    const collection = db.collection("receitas");

    const existentes = await collection.find({}, { projection: { nome: 1 } }).toArray();
    const nomesExistentes = existentes.map(e => e.nome);

    const novas = receitas.filter(r => !nomesExistentes.includes(r.nome));

    if (novas.length === 0) {
      console.log("Todas as receitas já existem no banco.");
      return;
    }

    const result = await collection.insertMany(novas);
    console.log(`${result.insertedCount} receitas inseridas com sucesso!`);
    console.log(`(${receitas.length - novas.length} já existiam e foram ignoradas)`);

    const ingredientesNaoEncontrados = new Set();
    const ingredientesBanco = await db.collection("ingredientes").find({}, { projection: { nome: 1 } }).toArray();
    const nomesIngredientes = new Set(ingredientesBanco.map(i => i.nome));

    novas.forEach(r => {
      r.ingredientes.forEach(ing => {
        if (!nomesIngredientes.has(ing.nome)) {
          ingredientesNaoEncontrados.add(ing.nome);
        }
      });
    });

    if (ingredientesNaoEncontrados.size > 0) {
      console.log("\nIngredientes usados nas receitas mas NÃO cadastrados no banco:");
      ingredientesNaoEncontrados.forEach(nome => console.log(`  - ${nome}`));
    }

  } catch (error) {
    console.error("Erro:", error);
  } finally {
    await client.close();
  }
}

inserir();
