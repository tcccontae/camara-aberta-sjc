# Testes de acessibilidade e celular (Etapa 6)

## O que já foi verificado

| Teste | Como | Resultado |
|---|---|---|
| Verificação automática (axe-core 4.10, regras WCAG 2.2 AA + boas práticas) | 5 telas + janela de ajuda | 0 problemas |
| Celular pequeno (320 px de largura) | Emulação no navegador | Sem rolagem lateral |
| Celular deitado (812 × 375) | Emulação | Aviso rola junto (não cobre a tela), abas fixas |
| Texto a 200% | Fonte da página dobrada | Sem rolagem lateral; abas crescem sem cortar texto |
| Só teclado | Tab, Enter, Esc | Ordem lógica, contorno visível, Esc fecha a ajuda |
| Contraste do contorno de foco | Cálculo WCAG | 12,8:1 (fundo claro) e 7,3:1 (fundo escuro); mínimo 3:1 |
| Contraste dos textos | Cálculo WCAG | Todos acima de 4,5:1 (o cinza `#8A8F98` só aparece em bordas) |
| Troca de tela | Leitor de tela e teclado | Título da aba muda; foco vai para o título da tela |
| Alto contraste do Windows | Revisão do CSS | Barras usam cores do sistema |

## Roteiro no seu celular

### 1. Abrir o site no celular (mesmo Wi-Fi do computador)

1. No computador, na pasta do projeto: `python -m http.server 8000`
2. Se o Windows perguntar sobre o firewall, permita só em **redes privadas**.
3. Descubra o IP do computador com `ipconfig` (linha "Endereço IPv4", ex.: `192.168.0.15`).
4. No celular, abra `http://192.168.0.15:8000`.

(Depois da Etapa 7, basta abrir o link do GitHub Pages.)

### 2. O que conferir

- [ ] O aviso "Protótipo independente…" aparece no topo de todas as telas.
- [ ] Dá para tocar em todos os botões (?) sem acertar o vizinho.
- [ ] A janela de ajuda abre e fecha ("Entendi", X e toque fora).
- [ ] Os gráficos mostram o valor ao tocar numa barra.
- [ ] Celular deitado: dá para ler e navegar.
- [ ] **Letra grande:** aumente a fonte nas configurações do celular
      (Android: Acessibilidade > Tamanho da fonte; iPhone: Tela e Brilho >
      Tamanho do Texto). Nada pode ficar cortado ou sobreposto.
- [ ] **Leitor de tela:** ligue o TalkBack (Android) ou VoiceOver (iPhone),
      deslize o dedo para a direita para ir item a item. Ele deve:
  - ler o aviso;
  - dizer "botão, O que é verba de gabinete?" nos (?);
  - anunciar "lista" no ranking;
  - ler o título da tela ao trocar de aba.
- [ ] Internet lenta: no Chrome do computador, F12 > Network > "Slow 4G".
      Deve aparecer "Carregando dados…" e depois o conteúdo.

## Limitações conhecidas

- **Aviso fixo:** fica grudado no topo só quando a tela tem pelo menos
  40em de altura (640 px com letra padrão). Com celular deitado ou letra
  muito grande ele rola junto com a página, para não cobrir metade da tela.
- **Tooltip dos gráficos:** só abre com toque ou mouse. Pelo teclado e no
  leitor de tela, os mesmos números estão na tabela "Ver os valores em tabela".
- **Modo escuro:** o site usa sempre o tema claro da paleta.
- **Internet:** os ícones (Lucide) e os gráficos (Chart.js) vêm de um CDN.
  Sem internet, a página abre, mas sem ícones e com só a tabela dos meses.
