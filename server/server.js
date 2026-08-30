const express = require("express")
const app = express()
const cors = require("cors")
const path = require("path")

const port = 5051

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use(require("./routes/user")) // cria as rotas para manipulação de usuários
app.use(require("./routes/ingredientes")) // cria as rotas para manipulação de ingredientes
app.use(require("./routes/receitas")) // cria as rotas para manipulação de receitas
app.use(require("./routes/recomendacoes")) // cria as rotas para recomendação nutricional

const dbo = require("./db/conn")

app.get("/", function(req, res) {
    res.send("App is running")
})

dbo.connectToMongoDB(function (error) {
    if (error) throw error

    app.listen(port, () => {
        console.log("Servidor rodando na porta: " + port)
    })
})