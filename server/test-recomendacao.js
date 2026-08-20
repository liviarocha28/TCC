const { MongoClient } = require("mongodb");
const Db = 'mongodb+srv://livia:120501@cluster0.qk4xuno.mongodb.net/?appName=Cluster0';
async function test() {
  const client = new MongoClient(Db);
  await client.connect();
  const db = client.db("tcc");
  
  const users = await db.collection("users").find({}).toArray();
  console.log("Users:", users.length);
  users.forEach(u => console.log("  " + u.name + " | " + u.email + " | objetivo: " + (u.objetivo || "N/A") + " | restricoes: " + JSON.stringify(u.restricoes || [])));
  
  const ingredientes = await db.collection("ingredientes").find({ tags: { $exists: true, $ne: [] } }).toArray();
  console.log("\nIngredientes com tags:", ingredientes.length);
  ingredientes.forEach(i => console.log("  " + i.nome + ": [" + i.tags.join(", ") + "]"));
  
  const receitas = await db.collection("receitas").find({}).toArray();
  console.log("\nReceitas:", receitas.length);
  
  await client.close();
}
test();
