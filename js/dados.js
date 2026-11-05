// ÚNICO arquivo que conhece o formato de data/gastos.json.
// As telas só chamam as funções daqui. Para usar dados reais, basta gerar
// um gastos.json no mesmo formato (ou adaptar apenas este arquivo).

const ARQUIVO = "data/gastos.json";

export async function carregarDados() {
  const resposta = await fetch(ARQUIVO);
  if (!resposta.ok) throw new Error(`Não foi possível ler ${ARQUIVO} (erro ${resposta.status}).`);
  return resposta.json();
}

// Soma os valores agrupando por uma "chave" (ex.: mês, categoria, gabinete).
function somarPor(lancamentos, chave) {
  const totais = new Map();
  for (const l of lancamentos) {
    const k = l[chave];
    totais.set(k, (totais.get(k) || 0) + l.valor);
  }
  return totais;
}

export function totalGeral(dados) {
  return dados.lancamentos.reduce((soma, l) => soma + l.valor, 0);
}

// [{ mes: "2025-01", total }, …] em ordem cronológica.
export function totalPorMes(dados) {
  return [...somarPor(dados.lancamentos, "mes")]
    .map(([mes, total]) => ({ mes, total }))
    .sort((a, b) => a.mes.localeCompare(b.mes));
}

export function mediaMensal(dados) {
  return totalGeral(dados) / totalPorMes(dados).length;
}

// [{ categoria: {id, nome, icone}, total, fatia }, …] do maior para o menor.
export function totalPorCategoria(dados) {
  const totais = somarPor(dados.lancamentos, "categoria");
  const geral = totalGeral(dados);
  return dados.categorias
    .map((categoria) => {
      const total = totais.get(categoria.id) || 0;
      return { categoria, total, fatia: total / geral };
    })
    .sort((a, b) => b.total - a.total);
}

// Ranking: [{ gabinete: {id, nome}, total, posicao }, …] do mais econômico ao mais caro.
export function rankingGabinetes(dados) {
  const totais = somarPor(dados.lancamentos.filter((l) => l.gabinete), "gabinete");
  return dados.gabinetes
    .map((gabinete) => ({ gabinete, total: totais.get(gabinete.id) || 0 }))
    .sort((a, b) => a.total - b.total)
    .map((item, i) => ({ ...item, posicao: i + 1 }));
}

export function custoMedioGabinete(dados) {
  const ranking = rankingGabinetes(dados);
  return ranking.reduce((soma, r) => soma + r.total, 0) / ranking.length;
}
