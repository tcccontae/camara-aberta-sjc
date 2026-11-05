// Tela de gabinetes: ranking do mais econômico ao mais caro, com busca.
import { rankingGabinetes, custoMedioGabinete } from "../dados.js";
import { moedaCurta, escapar, normalizar } from "../formatar.js";
import { avatar, ajuda } from "../componentes.js";

export const telaGabinetes = { html, aoMostrar };

let ultimaBusca = ""; // lembra o que foi digitado ao voltar do detalhe

function html(dados) {
  const ranking = rankingGabinetes(dados);
  const maisCaro = ranking[ranking.length - 1].total;

  const itens = ranking.map(({ gabinete, total, posicao }) => `
    <li data-busca="${escapar(normalizar(gabinete.nome))}">
      <a class="item-gabinete" href="#/gabinete/${encodeURIComponent(gabinete.id)}">
        <span class="posicao">${posicao}º</span>
        ${avatar(gabinete.nome)}
        <span class="item-meio">
          <span class="item-nome">${escapar(gabinete.nome)}</span>
          <span class="trilho" aria-hidden="true">
            <span class="preenchimento" style="width: ${((total / maisCaro) * 100).toFixed(1)}%"></span>
          </span>
        </span>
        <span class="item-valor">${moedaCurta(total)}</span>
      </a>
    </li>`).join("");

  return `
    <h1>Gabinetes ${ajuda("gabinete", "O que é um gabinete?")}</h1>
    <p class="apoio">
      Do mais econômico ao mais caro em ${dados.meta.ano}.
      ${ajuda("ranking", "Gastar menos é sempre melhor?")}
      Em média, um gabinete custou <b>${moedaCurta(custoMedioGabinete(dados))}</b>.
    </p>

    <div class="busca">
      <label for="campo-busca">Buscar gabinete</label>
      <div class="campo">
        <i data-lucide="search" aria-hidden="true"></i>
        <input id="campo-busca" type="search" placeholder="Ex.: Vereador F"
          autocomplete="off" aria-describedby="contagem">
      </div>
    </div>
    <p id="contagem" class="apoio" aria-live="polite"></p>

    <ol class="ranking">${itens}</ol>
    <p id="sem-resultado" class="erro" hidden>Nenhum gabinete encontrado com esse nome.</p>
  `;
}

function aoMostrar() {
  const campo = document.getElementById("campo-busca");
  const itens = [...document.querySelectorAll(".ranking li")];
  const contagem = document.getElementById("contagem");
  const semResultado = document.getElementById("sem-resultado");

  function filtrar() {
    ultimaBusca = campo.value;
    const termo = normalizar(campo.value.trim());
    let visiveis = 0;
    for (const li of itens) {
      const achou = li.dataset.busca.includes(termo);
      li.hidden = !achou;
      if (achou) visiveis++;
    }
    contagem.textContent = visiveis === 1 ? "1 gabinete" : `${visiveis} gabinetes`;
    semResultado.hidden = visiveis > 0;
  }

  campo.value = ultimaBusca;
  campo.addEventListener("input", filtrar);
  filtrar();
}
