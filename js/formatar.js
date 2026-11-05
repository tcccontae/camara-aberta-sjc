// Transforma números e datas em texto fácil de ler (padrão brasileiro).

const reais = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const umaCasa = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

// 1234.5 → "R$ 1.234,50"
export function moeda(valor) {
  return reais.format(valor);
}

// 83679262 → "R$ 83,7 milhões" · 95300 → "R$ 95,3 mil"
export function moedaCurta(valor) {
  if (valor >= 1e9) return `R$ ${umaCasa.format(valor / 1e9)} bi`;
  if (valor >= 2e6) return `R$ ${umaCasa.format(valor / 1e6)} milhões`;
  if (valor >= 1e6) return `R$ ${umaCasa.format(valor / 1e6)} milhão`;
  if (valor >= 1e3) return `R$ ${umaCasa.format(valor / 1e3)} mil`;
  return moeda(valor);
}

// 0.7812 → "78%"
export function porcentagem(fatia) {
  return `${Math.round(fatia * 100)}%`;
}

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
  "agosto", "setembro", "outubro", "novembro", "dezembro"];

// "2025-12" → "dezembro"
export function nomeMes(anoMes) {
  return MESES[Number(anoMes.slice(5, 7)) - 1];
}
