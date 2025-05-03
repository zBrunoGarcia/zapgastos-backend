const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const { extrairDespesa } = require("./utils/nlp");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.post("/webhook", async (req, res) => {
  const { message, phone } = req.body;

  const despesa = extrairDespesa(message);
  if (!despesa) {
    return res.status(200).send("Não entendi o valor ou a categoria.");
  }

  const { valor, categoria } = despesa;

  const { error } = await supabase.from("despesas").insert([
    {
      telefone: phone,
      valor,
      categoria,
      data: new Date(),
    },
  ]);

  if (error) {
    console.error("Erro ao salvar:", error);
    return res.sendStatus(500);
  }

  return res.status(200).send(`Salvo: R$${valor} em ${categoria}`);
});

app.listen(process.env.PORT, () => {
  console.log("Servidor rodando na porta", process.env.PORT);
});
