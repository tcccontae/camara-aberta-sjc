// Textos de ajuda do botão (?). Linguagem simples, frases curtas.
// Para corrigir ou acrescentar uma explicação, mexa só aqui.
// "texto" pode ter HTML simples (<p>, <ul>, <a>), pois é escrito por nós.

export const EXPLICACOES = {
  "dados-simulados": {
    titulo: "O que são dados simulados?",
    texto: `
      <p>Os números deste site foram <b>inventados</b> para testar o protótipo.
      Eles não são os gastos reais da Câmara.</p>
      <p>Os nomes "Vereador A", "Vereador B"… também são fictícios. Não
      representam nenhum vereador de verdade.</p>
      <p>Os dados reais ficam no
      <a href="https://portal.camarasjc.sp.gov.br/" target="_blank" rel="noopener">Portal da Transparência da Câmara</a>.</p>`,
  },
  "gasto-total": {
    titulo: "O que entra no gasto total?",
    texto: `
      <p>É tudo o que a Câmara pagou no ano, somando duas partes:</p>
      <ul>
        <li><b>Gabinetes</b>: o que é ligado a cada vereador e à equipe dele.</li>
        <li><b>Gastos gerais</b>: o funcionamento da Câmara como um todo, como
        servidores administrativos, o prédio, limpeza, segurança e sistemas.</li>
      </ul>
      <p>Os gastos gerais são a maior parte.</p>`,
  },
  pessoal: {
    titulo: "O que são gastos com pessoal?",
    texto: `
      <p>São os <b>salários</b> de quem trabalha na Câmara: servidores e os
      assessores dos gabinetes. Entram também encargos, férias e 13º salário.</p>
      <p>Na maioria das câmaras, esse é de longe o maior gasto.</p>`,
  },
  gabinete: {
    titulo: "O que é um gabinete?",
    texto: `
      <p>É o escritório de cada vereador, com a equipe que trabalha para ele
      (os <b>assessores</b>).</p>
      <p>Neste site, o <b>custo do gabinete</b> soma os salários da equipe e
      despesas como combustível, telefone, material e viagens.</p>`,
  },
  "verba-gabinete": {
    titulo: "O que é verba de gabinete?",
    texto: `
      <p>Em algumas cidades, cada vereador recebe todo mês um valor fixo para
      pagar despesas do gabinete, como material, combustível e telefone. Esse
      valor se chama <b>verba de gabinete</b>.</p>
      <p>Nem toda câmara tem essa verba. Um relatório do Tribunal de Contas do
      Estado (TCE-SP) de 2018 informou que a Câmara de São José dos Campos
      <b>não pagava</b> verba de gabinete. Nesse caso, as despesas aparecem
      como gastos da própria Câmara.</p>
      <p>Por isso, aqui falamos em <b>custo do gabinete</b>, e não em verba.</p>`,
  },
  categorias: {
    titulo: "O que é cada categoria?",
    texto: `
      <ul>
        <li><b>Pessoal</b>: salários, encargos, férias e 13º.</li>
        <li><b>Serviços contratados</b>: empresas pagas para limpeza,
        segurança, sistemas, manutenção etc.</li>
        <li><b>Outros</b>: contas do prédio, como energia e água.</li>
        <li><b>Material de escritório</b>: papel, impressão, itens do dia a dia.</li>
        <li><b>Telefone e internet</b>: linhas e conexão.</li>
        <li><b>Combustível</b>: abastecimento de veículos usados no trabalho.</li>
        <li><b>Diárias e viagens</b>: ajuda para comida e hospedagem em
        viagens a trabalho, além de passagens.</li>
      </ul>`,
  },
  diarias: {
    titulo: "O que são diárias?",
    texto: `
      <p>Quando alguém viaja a trabalho, recebe um valor por dia para pagar
      <b>comida e hospedagem</b>. Esse valor se chama diária.</p>
      <p>Passagens de ônibus ou avião também entram nesta categoria.</p>`,
  },
  "decimo-terceiro": {
    titulo: "Por que dezembro custa mais?",
    texto: `
      <p>Em dezembro é pago o <b>13º salário</b>: quem tem carteira ou é
      servidor recebe um salário a mais no fim do ano.</p>
      <p>Como a maior parte do gasto é com salários, a conta do mês quase dobra.</p>`,
  },
  ranking: {
    titulo: "Gastar menos é sempre melhor?",
    texto: `
      <p><b>Não necessariamente.</b> O ranking mostra só quanto cada gabinete
      custou, não a qualidade do trabalho.</p>
      <p>Um gabinete pode gastar mais porque atende mais pessoas, faz mais
      visitas aos bairros ou tem uma equipe maior por bons motivos.</p>
      <p>Use o ranking como ponto de partida para fazer perguntas, não como
      nota final.</p>`,
  },
  media: {
    titulo: "Como a média é calculada?",
    texto: `
      <p>Somamos o custo de todos os gabinetes no ano e dividimos pelo número
      de gabinetes.</p>
      <p>"9% acima da média" quer dizer que o gabinete custou 9% a mais que
      esse valor médio.</p>`,
  },
};
