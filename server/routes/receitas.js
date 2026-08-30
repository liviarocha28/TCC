const express = require("express")
const receitasRoutes = express.Router()
const dbo = require("../db/conn")
const ObjectId = require("mongodb").ObjectId
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const path = require("path")
const fs = require("fs")
const multer = require("multer")

const JWT_SECRET = "secret-key"

const uploadDir = path.join(__dirname, "..", "uploads")
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname) || ".jpg"
        cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext)
    }
})

const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } })

// ENDPOINT DE UPLOAD DE IMAGEM
receitasRoutes.route("/upload").post(upload.single("file"), function (req, res) {
    if (!req.file) {
        return res.status(400).json({ message: "Nenhum arquivo enviado" })
    }
    res.status(200).json({ caminho: "/uploads/" + req.file.filename })
})




// LISTAR TODOS receitas

receitasRoutes.route("/receitas").get(async function (req, res) {

    const db_connect = dbo.getDb()

    try {

        const result = await db_connect
            .collection("receitas")
            .find({})
            .toArray()

        res.status(200).json(result)

    } catch (error) {

        res.status(404).json({
            message: error.message
        })
    }
})


receitasRoutes.route("/receitasLimit").get(async function (req, res) {

    const db_connect = dbo.getDb()

    try {

        const result = await db_connect
            .collection("receitas")
            .find({})
            .limit(10)
            .toArray()

        res.status(200).json(result)

    } catch (error) {

        res.status(404).json({
            message: error.message
        })
    }
})

// BUSCAR receita POR ID

receitasRoutes.route("/receita/:id").get(async function (req, res) {

    const db_connect = dbo.getDb()

    const myquery = {
        _id: new ObjectId(req.params.id)
    }

    try {

        const result = await db_connect
            .collection("receitas")
            .findOne(myquery)

        res.status(200).json(result)

    } catch (error) {

        res.status(404).json({
            message: error.message
        })
    }
})



// ADICIONAR receita

receitasRoutes.route("/receita/add").post(async function (req, res) {

    const db_connect = dbo.getDb()

    console.log(req.body)

    const myobj = {

        nome: req.body.nome,
        descricao: req.body.descricao,
        foto: req.body.foto,
        tags: req.body.tags || [],
        ingredientes: req.body.ingredientes || [],
        kcal: req.body.kcal,
        proteinas: req.body.proteinas,
        carboidratos: req.body.carboidratos,
        gorduras: req.body.gorduras,
        fibras: req.body.fibras,
        acucares: req.body.acucares
    }

    try {

        const result = await db_connect
            .collection("receitas")
            .insertOne(myobj)

        console.log("1 document created")

        res.status(201).json(result)

    } catch (error) {

        res.status(409).json({
            message: error.message
        })
    }
})



// UPDATE receitas

receitasRoutes.route("/receita/:id").post(async function (req, res) {

    const db_connect = dbo.getDb()

    const myquery = {
        _id: new ObjectId(req.params.id)
    }
    console.log(req.body)
    const newvalues = {

        $set: {

            nome: req.body.nome,
            descricao: req.body.descricao,
            foto: req.body.foto,
            tags: req.body.tags || [],
            ingredientes: req.body.ingredientes || [],
            kcal: req.body.kcal,
            proteinas: req.body.proteinas,
            carboidratos: req.body.carboidratos,
            gorduras: req.body.gorduras,
            fibras: req.body.fibras,
            acucares: req.body.acucares

        }
    }

    try {

        const result = await db_connect
            .collection("receitas")
            .updateOne(myquery, newvalues)

        console.log("1 document updated")

        res.status(200).json(result)

    } catch (error) {

        res.status(409).json({
            message: error.message
        })
    }
})



// DELETAR USUÁRIO

receitasRoutes.route("/del/:id").delete(async function (req, res) {

    const db_connect = dbo.getDb()

    const myquery = {
        _id: new ObjectId(req.params.id)
    }

    try {

        const result = await db_connect
            .collection("receitas")
            .deleteOne(myquery)

        console.log("1 document deleted")

        res.status(200).json(result)

    } catch {

        res.status(204).json({
            message: "It is gone!"
        })
    }
})



module.exports = receitasRoutes