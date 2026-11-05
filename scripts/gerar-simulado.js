// Gera data/gastos.json com dados SIMULADOS (fictícios).
// Uso: node scripts/gerar-simulado.js
//
// Os números são sorteados com uma "semente" fixa: rodar de novo gera
// exatamente o mesmo arquivo. Mude SEMENTE para obter outros números.

const fs = require("fs");
const path = require("path");

const SEMENTE = 2025;
const ANO = 2025;

// Sorteio reproduzível (algoritmo mulberry32): devolve números entre 0 e 1.
function criarSorteio(semente) {
  let s = semente >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const sortear = criarSorteio(SEMENTE);
const entre = (min, max) => min + sortear() * (max - min);
const centavos = (v) => Math.round(v * 100) / 100;

const categorias = [
  { id: "pessoal", nome: "Pessoal (salários)", icone: "users" },
  { id: "diarias", nome: "Diárias e viagens", icone: "plane" },
  { id: "combustivel", nome: "Combustível", icone: "fuel" },
  { id: "material", nome: "Material de escritório", icone: "paperclip" },
  { id: "servicos", nome: "Serviços contratados", icone: "briefcase" },
  { id: "telefonia", nome: "Telefone e internet", icone: "phone" },
  { id: "outros", nome: "Outros (energia, água, manutenção)", icone: "circle-ellipsis" },
];

// 21 gabinetes fictícios: Vereador A … Vereador U.
const letras = "ABCDEFGHIJKLMNOPQRSTU".split("");
const gabinetes = letras.map((l) => ({ id: "gab-" + l.toLowerCase(), nome: "Vereador " + l }));

const meses = Array.from({ length: 12 }, (_, i) => `${ANO}-${String(i + 1).padStart(2, "0")}`);
// Dezembro tem 13º salário: a folha quase dobra.
const fatorFolha = (mes) => (mes.endsWith("-12") ? 1.85 : 1);

const lancamentos = [];
const lancar = (mes, gabinete, categoria, valor) => {
  if (valor > 0) lancamentos.push({ mes, gabinete, categoria, valor: centavos(valor) });
};

// Gastos de cada gabinete. "perfil" deixa uns mais econômicos que outros.
for (const g of gabinetes) {
  const perfil = entre(0.75, 1.3);
  const folhaBase = entre(68000, 92000) * perfil;
  for (const mes of meses) {
    lancar(mes, g.id, "pessoal", folhaBase * entre(0.98, 1.03) * fatorFolha(mes));
    lancar(mes, g.id, "diarias", sortear() < 0.35 ? entre(400, 3200) * perfil : 0);
    lancar(mes, g.id, "combustivel", entre(500, 1700) * perfil);
    lancar(mes, g.id, "material", entre(120, 650) * perfil);
    lancar(mes, g.id, "telefonia", entre(280, 620));
    lancar(mes, g.id, "servicos", sortear() < 0.25 ? entre(800, 4500) * perfil : 0);
  }
}

// Gastos gerais da Câmara (gabinete = null): servidores administrativos,
// contratos de limpeza, segurança, TI, contas do prédio etc.
for (const mes of meses) {
  lancar(mes, null, "pessoal", entre(3100000, 3350000) * fatorFolha(mes));
  lancar(mes, null, "servicos", entre(1050000, 1400000));
  lancar(mes, null, "outros", entre(160000, 230000));
  lancar(mes, null, "material", entre(40000, 85000));
  lancar(mes, null, "telefonia", entre(38000, 52000));
  lancar(mes, null, "combustivel", entre(18000, 30000));
  lancar(mes, null, "diarias", entre(3000, 14000));
}

const dados = {
  meta: {
    fonte: "simulado",
    ano: ANO,
    atualizadoEm: "2026-11-05",
    aviso: "Protótipo independente com dados simulados. Não é um sistema oficial.",
  },
  categorias,
  gabinetes,
  lancamentos,
};

// Uma linha por lançamento: arquivo menor e fácil de ler/comparar no Git.
const { lancamentos: _, ...cabecalho } = dados;
const inicio = JSON.stringify(cabecalho, null, 2).slice(0, -2);
const corpo = lancamentos.map((l) => "    " + JSON.stringify(l)).join(",\n");
const json = `${inicio},\n  "lancamentos": [\n${corpo}\n  ]\n}\n`;

const destino = path.join(__dirname, "..", "data", "gastos.json");
fs.mkdirSync(path.dirname(destino), { recursive: true });
fs.writeFileSync(destino, json, "utf8");
console.log(`Gerado ${destino} com ${lancamentos.length} lançamentos.`);
