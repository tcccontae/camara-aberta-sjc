// "Maestro" do site: carrega os dados uma vez e mostra a tela certa
// de acordo com o endereço depois do # (ex.: #/inicio, #/gabinetes).
import { carregarDados } from "./dados.js";
import { telaInicio } from "./telas/inicio.js";

const conteudo = document.getElementById("conteudo");

function emConstrucao(titulo) {
  return () => `<h1>${titulo}</h1><p class="carregando">Em construção. Volte em breve!</p>`;
}

// Cada rota aponta para uma função que recebe os dados e devolve o HTML da tela.
const rotas = {
  inicio: telaInicio,
  graficos: emConstrucao("Gráficos"),
  gabinetes: emConstrucao("Gabinetes"),
};

function mostrarTela(dados) {
  const nome = location.hash.replace("#/", "") || "inicio";
  const tela = rotas[nome] || rotas.inicio;
  conteudo.innerHTML = tela(dados);

  // Destaca a aba atual (leitores de tela anunciam "página atual").
  document.querySelectorAll(".abas a").forEach((a) => {
    if (a.dataset.aba === nome) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });

  window.lucide?.createIcons(); // troca os <i data-lucide> pelos desenhos SVG
  window.scrollTo(0, 0);
}

async function iniciar() {
  try {
    const dados = await carregarDados();
    mostrarTela(dados);
    window.addEventListener("hashchange", () => {
      mostrarTela(dados);
      conteudo.focus(); // leva o foco do teclado para o novo conteúdo
    });
  } catch (erro) {
    conteudo.innerHTML = `
      <p class="erro">Não consegui carregar os dados. ${erro.message}<br>
      Dica: abra o site por um servidor local (no terminal, dentro da pasta do
      projeto: <code>python -m http.server 8000</code>), e não clicando duas
      vezes no index.html.</p>`;
    console.error(erro);
  }
  window.lucide?.createIcons();
}

iniciar();
