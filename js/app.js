// "Maestro" do site: carrega os dados uma vez e mostra a tela certa
// de acordo com o endereço depois do # (ex.: #/inicio, #/gabinetes).
import { carregarDados } from "./dados.js";
import { telaInicio } from "./telas/inicio.js";
import { telaGraficos } from "./telas/graficos.js";
import { telaGabinetes } from "./telas/gabinetes.js";
import { telaDetalhe } from "./telas/detalhe.js";

const conteudo = document.getElementById("conteudo");

// Cada tela é um objeto com:
//   html(dados, parametro)      → devolve o HTML da tela
//   aoMostrar(dados, parametro) → (opcional) roda depois que o HTML está na
//                                 página, por exemplo para desenhar gráficos
//   aba                         → (opcional) qual aba fica acesa
const rotas = {
  inicio: telaInicio,
  graficos: telaGraficos,
  gabinetes: telaGabinetes,
  gabinete: telaDetalhe, // #/gabinete/gab-a → parametro = "gab-a"
};

function mostrarTela(dados) {
  const [nome, parametro] = location.hash.replace(/^#\/?/, "").split("/");
  const tela = rotas[nome] || rotas.inicio;
  conteudo.innerHTML = tela.html(dados, parametro);
  tela.aoMostrar?.(dados, parametro);

  // Destaca a aba atual (leitores de tela anunciam "página atual").
  const abaAtual = tela.aba || (rotas[nome] ? nome : "inicio");
  document.querySelectorAll(".abas a").forEach((a) => {
    if (a.dataset.aba === abaAtual) a.setAttribute("aria-current", "page");
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
