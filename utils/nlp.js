function extrairDespesa(texto) {
  const regex = /(\d+[.,]?\d*)\s*(reais|r\$)?\s*(em)?\s*(\w+)/i;
  const match = texto.match(regex);

  if (!match) return null;

  return {
    valor: parseFloat(match[1].replace(",", ".")),
    categoria: match[4].toLowerCase(),
  };
}

module.exports = { extrairDespesa };
