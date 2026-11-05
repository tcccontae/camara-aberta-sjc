// ÚNICO arquivo que conhece o formato de data/gastos.json.
// As telas só chamam as funções daqui. Para usar dados reais, basta gerar
// um gastos.json no mesmo formato (ou adaptar apenas este arquivo).
//
// Quase todas as funções aceitam um gabineteId opcional:
//   totalGeral(dados)          → a Câmara inteira
//   totalGeral(dados, "gab-a") → só o gabinete A

const ARQUIVO = "data/gastos.json";

export async function carregarDados() {
  const resposta = await fetch(ARQUIVO);
  if (!resposta.ok) throw new Error(`Não foi possível ler ${ARQUIVO} (erro ${resposta.status}).`);
  return resposta.json();
}

function lancamentosDe(dados, gabineteId) {
  if (!gabineteId) return dados.lancamentos;
  return dados.lancamentos.filter((l) => l.gabinete === gabineteId);
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

export function totalGeral(dados, gabineteId) {
  return lancamentosDe(dados, gabineteId).reduce((soma, l) => soma + l.valor, 0);
}

// [{ mes: "2025-01", total }, …] em ordem cronológica.
export function totalPorMes(dados, gabineteId) {
  return [...somarPor(lancamentosDe(dados, gabineteId), "mes")]
    .map(([mes, total]) => ({ mes, total }))
    .sort((a, b) => a.mes.localeCompare(b.mes));
}

export function mediaMensal(dados, gabineteId) {
  return totalGeral(dados, gabineteId) / totalPorMes(dados, gabineteId).length;
}

// [{ categoria: {id, nome, icone}, total, fatia }, …] do maior para o menor.
// Categorias sem nenhum gasto ficam de fora.
export function totalPorCategoria(dados, gabineteId) {
  const lancamentos = lancamentosDe(dados, gabineteId);
  const totais = somarPor(lancamentos, "categoria");
  const geral = totalGeral(dados, gabineteId);
  return dados.categorias
    .map((categoria) => {
      const total = totais.get(categoria.id) || 0;
      return { categoria, total, fatia: total / geral };
    })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);
}

export function gabinetePorId(dados, id) {
  return dados.gabinetes.find((g) => g.id === id);
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
