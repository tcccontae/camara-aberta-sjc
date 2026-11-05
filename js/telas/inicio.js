// Tela inicial: total gasto no ano + 3 destaques + dúvidas comuns.
import { totalGeral, mediaMensal, totalPorCategoria, totalPorMes, custoMedioGabinete } from "../dados.js";
import { moedaCurta, porcentagem, nomeMes } from "../formatar.js";
import { ajuda } from "../componentes.js";
import { EXPLICACOES } from "../explicacoes.js";

export const telaInicio = { html };

function html(dados) {
  const ano = dados.meta.ano;
  const pessoal = totalPorCategoria(dados).find((c) => c.categoria.id === "pessoal");
  const mesMaisCaro = totalPorMes(dados).reduce((maior, m) => (m.total > maior.total ? m : maior));
  const gabineteMedio = custoMedioGabinete(dados);
  const ajudaMes = mesMaisCaro.mes.endsWith("-12") ? ajuda("decimo-terceiro", "Por que dezembro custa mais?") : "";

  const duvidas = Object.entries(EXPLICACOES).map(([id, { titulo }]) => `
    <li><button class="pergunta" type="button" data-ajuda="${id}">
      <i data-lucide="circle-help" aria-hidden="true"></i> ${titulo}
    </button></li>`).join("");

  return `
    <section class="resumo" aria-labelledby="titulo-total">
      <h1 id="titulo-total">Quanto a Câmara gastou em ${ano} ${ajuda("gasto-total", "O que entra no gasto total?")}</h1>
      <strong class="total">${moedaCurta(totalGeral(dados))}</strong>
      <p class="mensal">Em média, <b>${moedaCurta(mediaMensal(dados))}</b> por mês.</p>
    </section>

    <h2 class="sr-only">Destaques</h2>
    <ul class="destaques">
      <li class="destaque">
        <span class="icone" aria-hidden="true"><i data-lucide="users"></i></span>
        <div>
          <strong>${porcentagem(pessoal.fatia)} em salários ${ajuda("pessoal", "O que são gastos com pessoal?")}</strong>
          <p>A maior parte do dinheiro paga servidores e assessores.</p>
        </div>
      </li>
      <li class="destaque">
        <span class="icone" aria-hidden="true"><i data-lucide="building-2"></i></span>
        <div>
          <strong>${moedaCurta(gabineteMedio)} por gabinete ${ajuda("verba-gabinete", "O que é verba de gabinete?")}</strong>
          <p>É o custo médio de um gabinete no ano (${moedaCurta(gabineteMedio / 12)} por mês).</p>
        </div>
      </li>
      <li class="destaque">
        <span class="icone" aria-hidden="true"><i data-lucide="calendar"></i></span>
        <div>
          <strong>Mês mais caro: ${nomeMes(mesMaisCaro.mes)} ${ajudaMes}</strong>
          <p>Foram ${moedaCurta(mesMaisCaro.total)} gastos nesse mês.</p>
        </div>
      </li>
    </ul>

    <a class="botao" href="#/gabinetes">
      Ver ranking dos gabinetes <i data-lucide="arrow-right" aria-hidden="true"></i>
    </a>

    <section class="cartao duvidas" aria-labelledby="titulo-duvidas">
      <h2 id="titulo-duvidas">Dúvidas comuns</h2>
      <ul>${duvidas}</ul>
    </section>

    <p class="rodape-dados">Fonte: dados simulados · atualizado em ${dados.meta.atualizadoEm.split("-").reverse().join("/")}</p>
  `;
}
