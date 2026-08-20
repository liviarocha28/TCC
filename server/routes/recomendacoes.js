const express = require("express");
const router = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

// Mapeamento de restrições do usuário para tags de ingredientes proibidos
const RESTRICAO_TO_TAG = {
  "Intolerância à lactose": ["lactose"],
  "Intolerância ao glúten": ["gluten"],
  "Alergia a amendoim": ["amendoim"],
  "Vegetariano": ["carne", "peixe"],
  "Vegano": ["carne", "peixe", "ovos", "lactose", "derivado_animal", "origem_animal"],
};

// Mapa de restrições do usuário para tags de ingredientes proibidos em receitas
// Inclui variações de nomes
const RESTRICAO_INGREDIENTES = {
  "Intolerância à lactose": [
    "leite", "queijo", "creme de leite", "manteiga", "iogurte",
    "requeijão", "ricota", "leite em pó", "leite condensado",
    "chocolate ao leite", "doce de leite"
  ],
  "Intolerância ao glúten": [
    "farinha de trigo", "pão", "macarrão", "cevada", "centeio",
    "aveia", "farinha integral", "trigo", "wrap", "tortilha"
  ],
  "Alergia a amendoim": [
    "amendoim", "pasta de amendoim", "farinha de amendoim",
    "amendoim torrado"
  ],
  "Vegetariano": [
    "frango", "carne", "peixe", "salmão", "atum", "porco",
    "peito de frango", "costela", "linguiça", "presunto"
  ],
  "Vegano": [
    "frango", "carne", "peixe", "salmão", "ovo", "leite",
    "queijo", "manteiga", "mel", "iogurte", "requeijão",
    "creme de leite", "ricota", "presunto"
  ],
};


// Função: verificar se receita é compatível com restrições do usuário
function ehCompativel(receita, restricoes) {
  if (!restricoes || restricoes.length === 0) return true;

  for (const restricao of restricoes) {

    // 1. Verificar por tags nos ingredientes
    const tagsProibidas = RESTRICAO_TO_TAG[restricao] || [];

    for (const ing of (receita.ingredientes || [])) {
      const nomeIng = (ing.nome || "").toLowerCase();

      // Verificar ingredientes proibidos por nome
      const listaProibidos = RESTRICAO_INGREDIENTES[restricao] || [];
      for (const proibido of listaProibidos) {
        if (nomeIng.includes(proibido.toLowerCase())) {
          return false;
        }
      }
    }

    // 2. Verificar tags da receita
    const tagsReceita = (receita.tags || []).map(t => t.toLowerCase());
    if (restricao === "Vegetariano" && tagsReceita.includes("#vegano")) {
      // Vegano é compatível com vegetariano
    }
    if (restricao === "Vegetariano" && !tagsReceita.includes("#vegetariano")) {
      // Não é vegetariano, verificar ingredientes acima
    }
  }

  return true;
}


// Função: calcular pontuação da receita baseada no objetivo
function calcularPontuacao(receita, objetivo, restricoes, condicoes) {
  let pontos = 0;

  const kcal = Number(receita.kcal) || 0;
  const proteinas = Number(receita.proteinas) || 0;
  const carboidratos = Number(receita.carboidratos) || 0;
  const gorduras = Number(receita.gorduras) || 0;
  const fibras = Number(receita.fibras) || 0;
  const acucares = Number(receita.acucares) || 0;

  // === PONTUAÇÃO POR OBJETIVO ===

  switch (objetivo) {
    case "Emagrecimento":
      // Priorizar menor densidade calórica
      if (kcal > 0 && kcal <= 300) pontos += 10;
      else if (kcal > 300 && kcal <= 500) pontos += 5;
      else if (kcal > 700) pontos -= 5;

      // Priorizar fibras (saciedade)
      if (fibras >= 5) pontos += 8;
      else if (fibras >= 3) pontos += 4;

      // Priorizar proteínas (manutenção muscular)
      if (proteinas >= 20) pontos += 6;
      else if (proteinas >= 10) pontos += 3;

      // Evitar açúcar
      if (acucares <= 5) pontos += 4;
      else if (acucares > 15) pontos -= 3;
      break;

    case "Ganho de massa":
      // Priorizar proteínas
      if (proteinas >= 30) pontos += 10;
      else if (proteinas >= 20) pontos += 6;
      else if (proteinas >= 10) pontos += 3;

      // Calorias adequadas (não muito baixas)
      if (kcal >= 300 && kcal <= 600) pontos += 5;
      else if (kcal > 600) pontos += 3;

      // Carboidratos para energia
      if (carboidratos >= 30) pontos += 4;
      else if (carboidratos >= 15) pontos += 2;
      break;

    case "Manutenção":
      // Priorizar equilíbrio nutricional
      if (kcal >= 250 && kcal <= 500) pontos += 6;
      if (proteinas >= 15) pontos += 4;
      if (fibras >= 3) pontos += 4;
      if (acucares <= 10) pontos += 3;
      break;

    case "Reeducação alimentar":
      // Priorizar alimentos menos processados
      if (fibras >= 5) pontos += 8;
      if (acucares <= 5) pontos += 6;
      if (proteinas >= 15) pontos += 4;
      if (kcal <= 400) pontos += 3;
      break;

    default:
      pontos += 3;
  }

  // === PONTUAÇÃO POR CONDIÇÕES DE SAÚDE ===

  if (condicoes && condicoes.includes("Diabetes")) {
    if (fibras >= 5) pontos += 5;
    if (acucares <= 5) pontos += 5;
    if (acucares > 15) pontos -= 5;
    if (carboidratos > 60) pontos -= 3;
  }

  if (condicoes && condicoes.includes("Hipertensão")) {
    // Sem informação de sódio no banco, mas priorizar vegetais
    const tagsReceita = (receita.tags || []).map(t => t.toLowerCase());
    if (tagsReceita.includes("#baixoemcalorias")) pontos += 3;
  }

  if (condicoes && condicoes.includes("Colesterol alto")) {
    if (gorduras <= 10) pontos += 5;
    if (gorduras > 25) pontos -= 5;
    // Priorizar fibras (ajudam no colesterol)
    if (fibras >= 5) pontos += 3;
  }

  // === BÔNUS POR TAGS COMPATÍVEIS ===

  const tagsReceita = (receita.tags || []).map(t => t.toLowerCase());
  if (tagsReceita.includes("#baixoemcalorias") && objetivo === "Emagrecimento") pontos += 3;
  if (tagsReceita.includes("#altoemproteina") && objetivo === "Ganho de massa") pontos += 3;
  if (tagsReceita.includes("#fibra")) pontos += 2;

  return pontos;
}


// ROTA: GET /recomendacoes/:userId
router.get("/recomendacoes/:userId", async (req, res) => {
  const db = dbo.getDb();

  try {
    // 1. Buscar usuário
    const usuario = await db
      .collection("users")
      .findOne({ _id: new ObjectId(req.params.userId) });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // 2. Se não tem perfil completo, retorna todas as receitas
    if (!usuario.objetivo && (!usuario.restricoes || usuario.restricoes.length === 0)) {
      const todasReceitas = await db.collection("receitas").find({}).toArray();
      return res.status(200).json({
        receitas: todasReceitas,
        mensagem: "Complete seu perfil para receber recomendações personalizadas."
      });
    }

    // 3. Buscar todas as receitas
    const todasReceitas = await db.collection("receitas").find({}).toArray();

    // 4. Filtrar receitas incompatíveis
    const restricoes = usuario.restricoes || [];
    const receitasCompativeis = todasReceitas.filter(r => ehCompativel(r, restricoes));

    // 5. Calcular pontuação para cada receita compatível
    const receitasComPontuacao = receitasCompativeis.map(r => ({
      ...r,
      pontuacao: calcularPontuacao(r, usuario.objetivo, restricoes, usuario.condicoes || [])
    }));

    // 6. Ordenar por pontuação (maior primeiro)
    receitasComPontuacao.sort((a, b) => b.pontuacao - a.pontuacao);

    // 7. Retornar top 10
    const recomendacoes = receitasComPontuacao.slice(0, 10);

    res.status(200).json({
      receitas: recomendacoes,
      total: receitasComPontuacao.length,
      perfil: {
        objetivo: usuario.objetivo,
        restricoes: restricoes,
        condicoes: usuario.condicoes || []
      }
    });

  } catch (error) {
    console.error("Erro na recomendação:", error);
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
