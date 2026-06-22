const express = require("express");
const router = express.Router();

const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

router.get("/ingredientes", async (req, res) => {
  let db = dbo.getDb();
  let data = await db.collection("ingredientes").find({}).toArray();
  res.json(data);
});

router.post("/ingredientes", async (req, res) => {
  let db = dbo.getDb();

  const novo = {
    nome: req.body.nome,
    categoria: req.body.categoria,
    calorias: req.body.calorias,
    proteinas: req.body.proteinas,
    carboidratos: req.body.carboidratos
  };

  let result = await db.collection("ingredientes").insertOne(novo);
  res.json(result);
});

router.put("/ingredientes/:id", async (req, res) => {
  let db = dbo.getDb();

  let query = { _id: new ObjectId(req.params.id) };

  let update = {
    $set: {
      nome: req.body.nome,
      categoria: req.body.categoria,
      calorias: req.body.calorias,
      proteinas: req.body.proteinas,
      carboidratos: req.body.carboidratos
    }
  };

  let result = await db.collection("ingredientes").updateOne(query, update);
  res.json(result);
});

router.delete("/ingredientes/:id", async (req, res) => {
  let db = dbo.getDb();

  let query = { _id: new ObjectId(req.params.id) };

  let result = await db.collection("ingredientes").deleteOne(query);
  res.json(result);
});

router.route("/ingredientes/add").post(async function (req, res) {
    const db_connect = dbo.getDb()
    const myobj = {
        nome: req.body.nome,
        categoria: req.body.categoria,
        medidas: req.body.medidas,
        calorias: req.body.calorias,
        proteinas: req.body.proteinas,
        carboidratos: req.body.carboidratos,
        gorduras: req.body.gorduras,
        fibras: req.body.fibras,
        acucares: req.body.acucares
    }
    try {
        const result = await db_connect
            .collection("ingredientes")
            .insertOne(myobj)
        console.log("1 document created")
        res.status(201).json(result)
    } catch (error) {
        res.status(409).json({
            message: error.message
        })
    }
})


module.exports = router;