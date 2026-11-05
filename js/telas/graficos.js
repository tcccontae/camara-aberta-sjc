// Tela de gráficos: gastos por categoria e por mês da Câmara inteira.
import { totalPorCategoria, totalPorMes } from "../dados.js";
import { listaCategorias, blocoMeses, desenharMeses } from "../componentes.js";

export const telaGraficos = { html, aoMostrar };

function html(dados) {
  const ano = dados.meta.ano;
  return `
    <h1>Para onde vai o dinheiro</h1>

    <section class="cartao" aria-labelledby="titulo-categorias">
      <h2 id="titulo-categorias">Gastos por categoria em ${ano}</h2>
      <p class="apoio">Cada barra mostra a fatia do total gasto no ano.</p>
      ${listaCategorias(totalPorCategoria(dados))}
    </section>

    <section class="cartao" aria-labelledby="titulo-meses">
      <h2 id="titulo-meses">Gastos por mês em ${ano}</h2>
      ${blocoMeses(totalPorMes(dados), `da Câmara em ${ano}`)}
    </section>
  `;
}

function aoMostrar(dados) {
  desenharMeses(totalPorMes(dados));
}
