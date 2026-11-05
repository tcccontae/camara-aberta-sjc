// Detalhe de um gabinete: #/gabinete/gab-a
import { gabinetePorId, rankingGabinetes, custoMedioGabinete, totalPorCategoria, totalPorMes } from "../dados.js";
import { moedaCurta, porcentagem, escapar } from "../formatar.js";
import { avatar, listaCategorias, blocoMeses, desenharMeses, ajuda } from "../componentes.js";

export const telaDetalhe = { html, aoMostrar, aba: "gabinetes" };

const linkVoltar = `
  <a class="voltar" href="#/gabinetes">
    <i data-lucide="arrow-left" aria-hidden="true"></i> Voltar ao ranking
  </a>`;

function html(dados, id) {
  const gabinete = gabinetePorId(dados, id);
  if (!gabinete) {
    return `${linkVoltar}
      <h1>Gabinete não encontrado</h1>
      <p class="erro">Não existe gabinete com esse endereço. Volte ao ranking e escolha um da lista.</p>`;
  }

  const ano = dados.meta.ano;
  const ranking = rankingGabinetes(dados);
  const { total, posicao } = ranking.find((r) => r.gabinete.id === id);
  const media = custoMedioGabinete(dados);
  const diferenca = total / media - 1;
  const comparacao = Math.abs(diferenca) < 0.005
    ? { icone: "equal", texto: "Igual à média dos gabinetes" }
    : diferenca < 0
      ? { icone: "trending-down", texto: `${porcentagem(-diferenca)} abaixo da média dos gabinetes` }
      : { icone: "trending-up", texto: `${porcentagem(diferenca)} acima da média dos gabinetes` };
  const nome = escapar(gabinete.nome);

  return `
    ${linkVoltar}

    <section class="resumo resumo-gabinete" aria-labelledby="titulo-gabinete">
      <div class="identidade">
        ${avatar(gabinete.nome, true)}
        <div>
          <h1 id="titulo-gabinete">${nome}</h1>
          <p>${posicao}º mais econômico de ${ranking.length}
            ${ajuda("ranking", "Gastar menos é sempre melhor?")}</p>
        </div>
      </div>
      <dl class="numeros">
        <div><dt>Total em ${ano}</dt><dd>${moedaCurta(total)}</dd></div>
        <div><dt>Média por mês</dt><dd>${moedaCurta(total / 12)}</dd></div>
      </dl>
      <p class="comparacao">
        <i data-lucide="${comparacao.icone}" aria-hidden="true"></i>
        <span>${comparacao.texto} (${moedaCurta(media)}).
        ${ajuda("media", "Como a média é calculada?")}</span>
      </p>
    </section>

    <section class="cartao" aria-labelledby="titulo-cat-gab">
      <h2 id="titulo-cat-gab">Em que o gabinete gastou</h2>
      <p class="apoio">Fatia de cada categoria no total do gabinete.</p>
      ${listaCategorias(totalPorCategoria(dados, id))}
    </section>

    <section class="cartao" aria-labelledby="titulo-meses-gab">
      <h2 id="titulo-meses-gab">Gastos por mês</h2>
      ${blocoMeses(totalPorMes(dados, id), `do ${gabinete.nome} em ${ano}`)}
    </section>
  `;
}

function aoMostrar(dados, id) {
  if (gabinetePorId(dados, id)) desenharMeses(totalPorMes(dados, id));
}
