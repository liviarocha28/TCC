const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

const Db = 'mongodb+srv://livia:120501@cluster0.qk4xuno.mongodb.net/?appName=Cluster0';

const admins = [
    { email: "livialdarocha@gmail.com", senha: "senhalivia" },
    { email: "agathadaros7@gmail.com", senha: "senhaagatha" }
];

async function fixPasswords() {
    const client = new MongoClient(Db);

    try {
        await client.connect();
        const db = client.db("tcc");
        const collection = db.collection("users");

        for (const admin of admins) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(admin.senha, salt);

            const result = await collection.updateOne(
                { email: admin.email },
                { $set: { senha: hash, role: "admin" } }
            );

            if (result.matchedCount > 0) {
                console.log(`OK: ${admin.email} (senha atualizada + role=admin)`);
            } else {
                console.log(`ERRO: ${admin.email} nao encontrado no banco`);
            }
        }

        console.log("\nPronto! Senhas atualizadas com sucesso.");
    } catch (error) {
        console.error("Erro:", error);
    } finally {
        await client.close();
    }
}

fixPasswords();
