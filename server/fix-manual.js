const { MongoClient } = require("mongodb");
const Db = 'mongodb+srv://livia:120501@cluster0.qk4xuno.mongodb.net/?appName=Cluster0';

async function corrigir() {
  const client = new MongoClient(Db);
  await client.connect();
  const db = client.db("tcc");
  const col = db.collection("receitas");

  const fixes = [
    // Escondidinho de Frango - frango estava 0.5g (errado), e batata em unidade
    { nome: "Escondidinho de Frango", ing: "Frango", qtd: "200", med: "g" },
    { nome: "Escondidinho de Frango", ing: "Batata", qtd: "500", med: "g" },

    // Quibe - trigo estava 1g, deve ser 120g
    { nome: "Quibe de Carne", ing: "Trigo para quibe", qtd: "120", med: "g" },

    // Salada de Grão-de-Bico - 2g errado, deve ser 240g (1.5 xicaras)
    { nome: "Salada de Grão-de-Bico", ing: "Grão-de-bico", qtd: "240", med: "g" },

    // Muffin - Ovo era 120g (2 unidades, ok)
    // Risoto - Caldo 960g em ml ficou ok

    // Lasanha - berinjela 600g (2 unidades) ok
    // Mingau - ok
    // Pão de Queijo - ok
    // Panqueca - ok
  ];

  for (const f of fixes) {
    await col.updateOne(
      { nome: f.nome, "ingredientes.nome": f.ing },
      { $set: { "ingredientes.$.quantidade": f.qtd, "ingredientes.$.medida": f.med } }
    );
    console.log(`${f.nome} > ${f.ing}: ${f.qtd} ${f.med}`);
  }

  console.log("\nCorrecoes manuais concluidas!");
  await client.close();
}

corrigir();
