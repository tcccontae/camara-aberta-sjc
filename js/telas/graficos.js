// Tela de gráficos: gastos por categoria (barras em HTML) e por mês (Chart.js).
import { totalPorCategoria, totalPorMes } from "../dados.js";
import { moeda, moedaCurta, moedaEixo, porcentagem, nomeMes, mesCurto } from "../formatar.js";

export const telaGraficos = { html, aoMostrar };

const COR_BARRA = "#1F2A44";   // marinho
const COR_DESTAQUE = "#E4B23B"; // dourado: só para o mês mais caro
const COR_GRADE = "#E2E1DA";

let graficoMeses = null; // guardamos para apagar ao sair da tela

function html(dados) {
  const ano = dados.meta.ano;
  const categorias = totalPorCategoria(dados);
  const meses = totalPorMes(dados);
  const maisCaro = meses.reduce((maior, m) => (m.total > maior.total ? m : maior));

  const linhasCategorias = categorias.map(({ categoria, total, fatia }) => `
    <li>
      <div class="barra-topo">
        <span class="icone-peq" aria-hidden="true"><i data-lucide="${categoria.icone}"></i></span>
        <span class="barra-nome">${categoria.nome}</span>
        <span class="barra-valor">${moedaCurta(total)} <small>${porcentagem(fatia)}</small></span>
      </div>
      <div class="trilho" aria-hidden="true">
        <div class="preenchimento" style="width: ${(fatia * 100).toFixed(1)}%"></div>
      </div>
    </li>`).join("");

  const linhasTabela = meses.map((m) => `
    <tr${m === maisCaro ? ' class="mais-caro"' : ""}>
      <th scope="row">${nomeMes(m.mes)}</th><td>${moeda(m.total)}</td>
    </tr>`).join("");

  const nota13 = maisCaro.mes.endsWith("-12")
    ? " Em dezembro é pago o 13º salário, por isso a conta de pessoal quase dobra."
    : "";

  return `
    <h1>Para onde vai o dinheiro</h1>

    <section class="cartao" aria-labelledby="titulo-categorias">
      <h2 id="titulo-categorias">Gastos por categoria em ${ano}</h2>
      <p class="apoio">Cada barra mostra a fatia do total gasto no ano.</p>
      <ul class="barras">${linhasCategorias}</ul>
    </section>

    <section class="cartao" aria-labelledby="titulo-meses">
      <h2 id="titulo-meses">Gastos por mês em ${ano}</h2>
      <p class="apoio">Toque numa barra para ver o valor exato.</p>
      <div class="area-grafico">
        <canvas id="grafico-meses" role="img"
          aria-label="Gráfico de barras dos gastos de cada mês de ${ano}. O mês mais caro foi ${nomeMes(maisCaro.mes)}, com ${moedaCurta(maisCaro.total)}. Os valores estão na tabela logo abaixo.">
        </canvas>
      </div>
      <p class="legenda-destaque">
        <span class="amostra" aria-hidden="true"></span>
        <span>Mais caro: <b>${nomeMes(maisCaro.mes)}</b> (${moedaCurta(maisCaro.total)}).${nota13}</span>
      </p>
      <details>
        <summary>Ver os valores em tabela</summary>
        <table>
          <thead><tr><th scope="col">Mês</th><th scope="col">Total gasto</th></tr></thead>
          <tbody>${linhasTabela}</tbody>
        </table>
      </details>
    </section>
  `;
}

function aoMostrar(dados) {
  graficoMeses?.destroy();
  if (!window.Chart) return; // se o Chart.js não carregou, a tabela continua lá

  const meses = totalPorMes(dados);
  const maior = Math.max(...meses.map((m) => m.total));
  const ehMaisCaro = meses.map((m) => m.total === maior);
  const semAnimacao = matchMedia("(prefers-reduced-motion: reduce)").matches;

  graficoMeses = new Chart(document.getElementById("grafico-meses"), {
    type: "bar",
    data: {
      labels: meses.map((m) => mesCurto(m.mes)),
      datasets: [{
        label: "Total gasto",
        data: meses.map((m) => m.total),
        backgroundColor: ehMaisCaro.map((d) => (d ? COR_DESTAQUE : COR_BARRA)),
        borderColor: COR_BARRA,
        borderWidth: ehMaisCaro.map((d) => (d ? 2 : 0)),
        borderRadius: 4,
        maxBarThickness: 28,
      }],
    },
    options: {
      maintainAspectRatio: false,
      animation: semAnimacao ? false : undefined,
      plugins: {
        legend: { display: false }, // uma série só: o título já diz o que é
        tooltip: {
          callbacks: {
            title: (itens) => nomeMes(meses[itens[0].dataIndex].mes),
            label: (item) => moeda(item.raw),
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          // mostra os 12 meses, sem inclinar o texto
          ticks: { color: "#555A63", autoSkip: false, maxRotation: 0, font: { size: 11 } },
        },
        y: {
          beginAtZero: true,
          grid: { color: COR_GRADE },
          border: { display: false },
          ticks: { color: "#555A63", callback: (v) => moedaEixo(v), maxTicksLimit: 5 },
        },
      },
    },
  });
}
