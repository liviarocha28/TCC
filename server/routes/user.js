const express = require("express")
const userRoutes = express.Router()
const dbo = require("../db/conn")
const ObjectId = require("mongodb").ObjectId
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const JWT_SECRET = "secret-key"



// LOGIN

userRoutes.route('/user/login').post(async function (req, res) {

    const db_connect = dbo.getDb()

    const { email, senha } = req.body;

    try {

        const usuario = await db_connect
            .collection("users")
            .findOne({ email })

        if (!usuario) {

            return res.status(400).json({
                mensagem: 'Usuário não encontrado'
            });
        }

        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaValida) {

            return res.status(400).json({
                mensagem: 'Senha incorreta'
            });
        }

        const token = jwt.sign(
            {
                userId: usuario._id,
                role: usuario.role
            },
            JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        res.json({
            mensagem: 'Login bem-sucedido',
            token,
            role: usuario.role,
            usuario: usuario.name,
            userId: usuario._id.toString()
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro no servidor'
        });
    }
});



// CADASTRO

userRoutes.route('/user/register').post(async function (req, res) {

    const db_connect = dbo.getDb()

    const {
        name,
        email,
        senha
    } = req.body;

    try {

        const userExistente = await db_connect
            .collection("users")
            .findOne({ email })

        if (userExistente) {

            return res.status(400).json({
                mensagem: 'Usuário já cadastrado'
            });
        }

        const salt = await bcrypt.genSalt(10);

        const senhaHash = await bcrypt.hash(
            senha,
            salt
        );



        // DEFINE SE É ADMIN OU USER

        const role =
            email === "SEUEMAIL@gmail.com"
                ? "admin"
                : "user";



        const novoUsuario = {

            name,
            email,
            senha: senhaHash,
            role

        };

        const result = await db_connect
            .collection("users")
            .insertOne(novoUsuario);

        console.log(
            "Usuário cadastrado com sucesso:",
            result.insertedId
        );

        return res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso'
        });

    } catch (error) {

        console.error(
            "Erro ao cadastrar usuário:",
            error
        );

        return res.status(500).json({
            mensagem: 'Erro ao cadastrar usuário',
            erro: error.message
        });
    }
});



// LISTAR TODOS USUÁRIOS

userRoutes.route("/user").get(async function (req, res) {

    const db_connect = dbo.getDb()

    try {

        const result = await db_connect
            .collection("users")
            .find({})
            .toArray()

        res.status(200).json(result)

    } catch (error) {

        res.status(404).json({
            message: error.message
        })
    }
})



// BUSCAR USUÁRIO POR ID

userRoutes.route("/user/:id").get(async function (req, res) {

    const db_connect = dbo.getDb()

    const myquery = {
        _id: new ObjectId(req.params.id)
    }

    try {

        const result = await db_connect
            .collection("users")
            .findOne(myquery)

        res.status(200).json(result)

    } catch (error) {

        res.status(404).json({
            message: error.message
        })
    }
})



// ADICIONAR USUÁRIO

userRoutes.route("/user/add").post(async function (req, res) {

    const db_connect = dbo.getDb()

    const myobj = {

        name: req.body.name,
        email: req.body.email,
        role: req.body.role || "user"

    }

    try {

        const result = await db_connect
            .collection("users")
            .insertOne(myobj)

        console.log("1 document created")

        res.status(201).json(result)

    } catch (error) {

        res.status(409).json({
            message: error.message
        })
    }
})



// UPDATE USUÁRIO

userRoutes.route("/update/:id").post(async function (req, res) {

    const db_connect = dbo.getDb()

    const myquery = {
        _id: new ObjectId(req.params.id)
    }

    const newvalues = {

        $set: {

            name: req.body.name,
            email: req.body.email,
            role: req.body.role

        }
    }

    try {

        const result = await db_connect
            .collection("users")
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

userRoutes.route("/:id").delete(async function (req, res) {

    const db_connect = dbo.getDb()

    const myquery = {
        _id: new ObjectId(req.params.id)
    }

    try {

        const result = await db_connect
            .collection("users")
            .deleteOne(myquery)

        console.log("1 document deleted")

        res.status(200).json(result)

    } catch {

        res.status(204).json({
            message: "It is gone!"
        })
    }
})



// SALVAR PERFIL DO USUÁRIO (CADASTRO)

userRoutes.route("/user/cadastro/:id").post(async function (req, res) {

    const db_connect = dbo.getDb()

    const myquery = {
        _id: new ObjectId(req.params.id)
    }

    const newvalues = {
        $set: {
            dataNascimento: req.body.dataNascimento,
            idade: req.body.idade,
            genero: req.body.genero,
            peso: req.body.peso,
            altura: req.body.altura,
            atividade: req.body.atividade,
            objetivo: req.body.objetivo,
            restricoes: req.body.restricoes || [],
            condicoes: req.body.condicoes || []
        }
    }

    try {
        const result = await db_connect
            .collection("users")
            .updateOne(myquery, newvalues)

        console.log("Perfil do usuário atualizado")
        res.status(200).json(result)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})



// BUSCAR USUÁRIO POR ID (inclui dados do perfil)

userRoutes.route("/user/perfil/:id").get(async function (req, res) {

    const db_connect = dbo.getDb()

    const myquery = {
        _id: new ObjectId(req.params.id)
    }

    try {
        const result = await db_connect
            .collection("users")
            .findOne(myquery)

        if (!result) {
            return res.status(404).json({ message: "Usuário não encontrado" })
        }

        res.status(200).json(result)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})



module.exports = userRoutes