// Pedaços de tela usados em mais de um lugar.
import { moeda, moedaCurta, moedaEixo, porcentagem, nomeMes, mesCurto, escapar } from "./formatar.js";

// ===== Avatar genérico: círculo com a inicial (nunca foto) =====

// "Vereador A" → "A" · "Vereadora Maria Souza" → "MS"
function iniciais(nome) {
  const palavras = nome.split(/\s+/).filter((p) => !/^vereador(a)?$/i.test(p));
  return palavras.slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "?";
}

export function avatar(nome, grande = false) {
  return `<span class="avatar${grande ? " avatar-grande" : ""}" aria-hidden="true">${escapar(iniciais(nome))}</span>`;
}

// ===== Barras por categoria (ícone, nome, valor e fatia) =====

export function listaCategorias(itens) {
  const linhas = itens.map(({ categoria, total, fatia }) => `
    <li>
      <div class="barra-topo">
        <span class="icone-peq" aria-hidden="true"><i data-lucide="${escapar(categoria.icone)}"></i></span>
        <span class="barra-nome">${escapar(categoria.nome)}</span>
        <span class="barra-valor">${moedaCurta(total)} <small>${porcentagem(fatia)}</small></span>
      </div>
      <div class="trilho" aria-hidden="true">
        <div class="preenchimento" style="width: ${(fatia * 100).toFixed(1)}%"></div>
      </div>
    </li>`).join("");
  return `<ul class="barras">${linhas}</ul>`;
}

// ===== Gráfico de barras por mês + destaque + tabela =====

const COR_BARRA = "#1F2A44";    // marinho
const COR_DESTAQUE = "#E4B23B"; // dourado: só para o mês mais caro
const COR_GRADE = "#E2E1DA";
const COR_TEXTO = "#555A63";

let graficoAtual = null; // só existe um gráfico por tela; apagamos o anterior

function mesMaisCaro(meses) {
  return meses.reduce((maior, m) => (m.total > maior.total ? m : maior));
}

// HTML do bloco. "descricao" completa a frase do leitor de tela.
export function blocoMeses(meses, descricao) {
  const maisCaro = mesMaisCaro(meses);
  const linhasTabela = meses.map((m) => `
    <tr${m === maisCaro ? ' class="mais-caro"' : ""}>
      <th scope="row">${nomeMes(m.mes)}</th><td>${moeda(m.total)}</td>
    </tr>`).join("");
  const nota13 = maisCaro.mes.endsWith("-12")
    ? " Em dezembro é pago o 13º salário, por isso a conta de pessoal quase dobra."
    : "";

  return `
    <p class="apoio">Toque numa barra para ver o valor exato.</p>
    <div class="area-grafico">
      <canvas id="grafico-meses" role="img"
        aria-label="Gráfico de barras dos gastos de cada mês ${escapar(descricao)}. O mês mais caro foi ${nomeMes(maisCaro.mes)}, com ${moedaCurta(maisCaro.total)}. Os valores estão na tabela logo abaixo.">
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
    </details>`;
}

// Desenha o gráfico no <canvas id="grafico-meses"> criado por blocoMeses().
export function desenharMeses(meses) {
  graficoAtual?.destroy();
  graficoAtual = null;
  const canvas = document.getElementById("grafico-meses");
  if (!window.Chart || !canvas) return; // sem Chart.js, a tabela continua lá

  const maior = mesMaisCaro(meses).total;
  const ehMaisCaro = meses.map((m) => m.total === maior);
  const semAnimacao = matchMedia("(prefers-reduced-motion: reduce)").matches;

  graficoAtual = new Chart(canvas, {
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
          ticks: { color: COR_TEXTO, autoSkip: false, maxRotation: 0, font: { size: 11 } },
        },
        y: {
          beginAtZero: true,
          grid: { color: COR_GRADE },
          border: { display: false },
          ticks: { color: COR_TEXTO, callback: (v) => moedaEixo(v), maxTicksLimit: 5 },
        },
      },
    },
  });
}
