# Câmara Aberta SJC — Planejamento (Etapa 1)

> Protótipo independente com dados simulados. Não é um sistema oficial.

## 1. Objetivo

Um cidadão comum, pelo celular, entende em 1 minuto:

- quanto a Câmara gasta por ano e por mês;
- quanto custa cada gabinete;
- em que tipo de coisa o dinheiro vai (pessoal, diárias, combustível…);
- qual gabinete é o mais econômico e qual é o mais caro.

## 2. Estrutura de pastas

```
camara/
├── index.html              ← única página HTML (as "telas" são trocadas por JS)
├── css/
│   └── estilo.css          ← cores da paleta, layout mobile first
├── js/
│   ├── app.js              ← liga tudo: carrega dados e troca de tela (rotas)
│   ├── dados.js            ← ÚNICO arquivo que conhece o formato do JSON
│   ├── formatar.js         ← R$ 1.234,56, nomes de meses etc.
│   └── telas/
│       ├── inicio.js       ← total + 3 destaques
│       ├── graficos.js     ← Chart.js: por categoria e por mês
│       ├── gabinetes.js    ← ranking + busca
│       └── detalhe.js      ← página de um gabinete
├── data/
│   ├── gastos.json         ← dados SIMULADOS (o site lê este arquivo)
│   └── exemplo.csv         ← o mesmo formato em planilha, para testar o script
├── scripts/
│   └── csv-para-json.js    ← converte CSV → data/gastos.json (roda com Node)
├── assets/                 ← imagens suas (logo, prints de referência)
├── docs/
│   └── planejamento.md     ← este arquivo
└── README.md               ← Etapa 8
```

**Por que separar assim?** Cada arquivo tem uma responsabilidade. As telas
nunca leem o JSON direto: elas pedem ao `dados.js` coisas como
`totalPorMes()` ou `rankingGabinetes()`. Quando os dados reais chegarem,
basta gerar um novo `gastos.json` (ou ajustar só o `dados.js`), e as telas
continuam iguais.

## 3. Formato do JSON (`data/gastos.json`)

Usamos uma **lista "plana" de lançamentos**: cada linha diz *quando*,
*quem*, *em quê* e *quanto*. É o mesmo formato de uma planilha, o que deixa
a conversão CSV → JSON trivial e permite calcular qualquer total somando.

```json
{
  "meta": {
    "fonte": "simulado",
    "ano": 2025,
    "atualizadoEm": "2026-11-05",
    "aviso": "Protótipo independente com dados simulados. Não é um sistema oficial."
  },
  "categorias": [
    { "id": "pessoal",     "nome": "Pessoal (salários)",      "icone": "users" },
    { "id": "diarias",     "nome": "Diárias e viagens",       "icone": "plane" },
    { "id": "combustivel", "nome": "Combustível",             "icone": "fuel" },
    { "id": "material",    "nome": "Material de escritório",  "icone": "paperclip" },
    { "id": "servicos",    "nome": "Serviços contratados",    "icone": "briefcase" },
    { "id": "telefonia",   "nome": "Telefone e internet",     "icone": "phone" },
    { "id": "outros",      "nome": "Outros",                  "icone": "circle-ellipsis" }
  ],
  "gabinetes": [
    { "id": "gab-a", "nome": "Vereador A" },
    { "id": "gab-b", "nome": "Vereador B" }
  ],
  "lancamentos": [
    { "mes": "2025-01", "gabinete": "gab-a", "categoria": "pessoal", "valor": 84210.50 },
    { "mes": "2025-01", "gabinete": "gab-a", "categoria": "combustivel", "valor": 1180.00 },
    { "mes": "2025-01", "gabinete": null,    "categoria": "servicos", "valor": 152300.00 }
  ]
}
```

Regras do formato:

| Campo | Regra |
|---|---|
| `mes` | texto `AAAA-MM` (ordena certo e é fácil de agrupar) |
| `gabinete` | `id` de um gabinete, ou `null` = gasto geral da Câmara (administração, prédio) |
| `categoria` | `id` de uma categoria da lista |
| `valor` | número em reais, ponto como separador decimal |

- **21 gabinetes fictícios** ("Vereador A" … "Vereador U"). A Câmara de SJC
  tem 21 cadeiras. Sem nomes, partidos ou fotos reais.
- **Nenhum dado pessoal**: não há CPF, nome de servidor nem de fornecedor.
  Só totais agregados por gabinete e categoria.
- Avatares são gerados (círculo com a letra + ícone genérico), não fotos.

### CSV equivalente (`data/exemplo.csv`)

Separador `;` e vírgula decimal, que é como o Excel em português salva:

```
mes;gabinete;categoria;valor
2025-01;gab-a;pessoal;84210,50
2025-01;;servicos;152300,00
```

`scripts/csv-para-json.js` lê esse CSV e gera o `gastos.json` (as listas de
categorias e gabinetes ficam num arquivo de configuração do próprio script).

## 4. Esboço das telas (celular, ~375 px)

Navegação por **abas fixas embaixo** (fácil de alcançar com o polegar) e
endereço com `#` (`#/inicio`, `#/gabinetes`, `#/gabinete/gab-a`), o que
funciona no GitHub Pages sem servidor.

```
┌─────────────────────────────┐   ┌─────────────────────────────┐
│ ⚠ Protótipo independente com│   │ ⚠ Protótipo independente…   │
│   dados simulados. Não é um │   ├─────────────────────────────┤
│   sistema oficial.          │   │ Gastos por categoria        │
├─────────────────────────────┤   │      ╭───╮                  │
│ Câmara Aberta SJC           │   │     │ ◔  │ rosca           │
│                             │   │      ╰───╯                  │
│ Em 2025 a Câmara gastou     │   │ 👥 Pessoal ....... 78%      │
│   R$ 98,4 milhões           │   │ ✈ Diárias ........  2%      │
│   ≈ R$ 8,2 mi por mês       │   │ ⛽ Combustível ...  1%      │
│                             │   │                             │
│ ┌─────────────────────────┐ │   │ Gastos por mês              │
│ │ 👥 78% vai para salários │ │   │ ▂▃▃▄▃▅▄▃▄▅▆█  barras       │
│ ├─────────────────────────┤ │   │ J F M A M J J A S O N D     │
│ │ 🏛 Gabinete médio:       │ │   │                             │
│ │   R$ 1,1 mi/ano         │ │   │                             │
│ ├─────────────────────────┤ │   │                             │
│ │ 📅 Mês mais caro: dez   │ │   │                             │
│ └─────────────────────────┘ │   │                             │
├─────────────────────────────┤   ├─────────────────────────────┤
│  🏠 Início  📊 Gráficos  👥 │   │  🏠   📊   👥 Gabinetes     │
└─────────────────────────────┘   └─────────────────────────────┘
        Tela 1: Início                   Tela 2: Gráficos

┌─────────────────────────────┐   ┌─────────────────────────────┐
│ ⚠ Protótipo independente…   │   │ ⚠ Protótipo independente…   │
├─────────────────────────────┤   ├─────────────────────────────┤
│ Gabinetes          (?)      │   │ ← Voltar                    │
│ [🔍 Buscar gabinete...    ] │   │  (A)  Vereador A            │
│ Do mais econômico ao mais   │   │       3º mais econômico     │
│ caro:                       │   │                             │
│ 1 (F) Vereador F  R$ 0,8 mi │   │ Total em 2025: R$ 0,9 mi    │
│ 2 (K) Vereador K  R$ 0,9 mi │   │ Média por mês: R$ 75 mil    │
│ 3 (A) Vereador A  R$ 0,9 mi │   │                             │
│ ▓▓▓▓▓▓▓░░░ (barra relativa) │   │ Por categoria  (barras)     │
│ …                           │   │ Por mês        (linha)      │
│ 21 (P) Vereador P R$ 1,4 mi │   │ Comparado à média: +4%      │
├─────────────────────────────┤   ├─────────────────────────────┤
│  🏠   📊   👥 Gabinetes     │   │  🏠   📊   👥 Gabinetes     │
└─────────────────────────────┘   └─────────────────────────────┘
       Tela 3: Gabinetes             Tela 4: Detalhe do gabinete
```

O `(?)` ao lado de termos difíceis abre uma explicação curta (Etapa 5).

### Visual

| Uso | Cor |
|---|---|
| Fundo | branco `#F4F3EE` |
| Texto principal, cabeçalho, abas | azul-marinho `#1F2A44` |
| Texto secundário, bordas | cinza `#8A8F98` (apenas texto grande/ícones, contraste baixo em fundo claro) |
| Cartões, barras dos gráficos | azul-claro `#A9C6E8` |
| Destaques, aviso do topo | dourado `#E4B23B` (com texto marinho por cima) |

- Fonte do sistema, tamanho base 16–18 px, números grandes nos totais.
- Ícones: Lucide (via CDN). Gráficos: Chart.js (via CDN). Versões fixas.

## 5. Como os dados reais são publicados (pesquisa)

O portal oficial é <https://portal.camarasjc.sp.gov.br/>, um sistema da
empresa **Embras**, acessível pelo site da Câmara em "Portal da
Transparência".

- **Telas de consulta**: Despesas pagas por período, Empenhos, Diárias e
  Passagens, Salários de Servidores, Contratos, Licitações.
- **Não encontrei botão de exportar CSV** na tela de despesas.
- **Existe uma API pública** (documentação em
  `/portal-transparencia/api-docs/v1/swagger.json`, 120 endereços). Entre eles:
  - `/execucao/despesas_paga_periodo/despesas_paga_periodo` (`id_entidade`, `ano`, `data_inicial`, `data_final`)
  - `/execucao/empenhos/empenhos` (`id_entidade`, `ano`, `dt_inicio_mes`, `dt_final_mes`)
  - `/execucao/diarias/diarias` (`id_entidade`, `cp_ano`)
  - `/folha/folha/folhas`
  - A entidade "Câmara Municipal de São José dos Campos" tem `id_entidade = 1`.
- Nos meus testes as consultas de despesas e diárias **retornaram erro 500**
  (o formato correto dos parâmetros não está documentado). Por isso **ainda
  não sei os nomes das colunas reais**.
- **Atenção para a etapa dos dados reais**: um relatório do TCE-SP de 2018
  diz que a Câmara de SJC **não pagava "verba de gabinete"**. O custo de um
  gabinete vem principalmente dos **salários dos assessores** lotados nele.
  Montar o custo real por gabinete vai exigir cruzar a folha de pagamento
  com a lotação, e esse cruzamento precisa ser feito sem expor nomes.

Próximo passo possível (fora do MVP): descobrir os parâmetros certos da API
(observando as chamadas que o próprio portal faz) ou pedir os dados em CSV
pela Lei de Acesso à Informação (SIC da Câmara).
