'use strict';

/*
  Cantina Jovens e Adolescentes — painel do administrador, sem login.
  HTML, CSS e JavaScript puros. Os dados ficam no navegador (localStorage).
*/

// Chaves usadas para guardar os dados no navegador
const CHAVES = {
  cardapioCustom: 'cantina2.cardapio.custom',
  cardapioEditados: 'cantina2.cardapio.editados',
  cardapioExcluidos: 'cantina2.cardapio.excluidos',
  cardapioEstoque: 'cantina2.cardapio.estoque',
  contas: 'cantina2.contas',
  carrinho: 'cantina2.carrinho',
  tema: 'cantina2.tema'
};

// Cardápio inicial. Os itens extras aparecem porque foram citados nas contas já cadastradas.
const CARDAPIO_PADRAO = [
  { id: 'prod-1', nome: 'Amendoim', descricao: 'Pacotinho de amendoim — R$ 2,50', preco: 2.5, categoria: 'Salgados', emoji: '🥜', estoque: 50 },
  { id: 'prod-2', nome: 'Paçoquinha com chocolate', descricao: 'R$ 1,50', preco: 1.5, categoria: 'Doces', emoji: '🍫', estoque: 50 },
  { id: 'prod-3', nome: 'Paçoquinha sem chocolate', descricao: 'R$ 1,00', preco: 1, categoria: 'Doces', emoji: '🍬', estoque: 50 },
  { id: 'prod-4', nome: 'Bala banana', descricao: 'R$ 0,75', preco: 0.75, categoria: 'Doces', emoji: '🍌', estoque: 50 },
  { id: 'prod-5', nome: 'Paçoquinha 0call', descricao: 'R$ 1,50', preco: 1.5, categoria: 'Doces', emoji: '🍪', estoque: 50 },
  { id: 'prod-6', nome: 'Biz', descricao: '3 por R$ 1,00', preco: 1, categoria: 'Doces', emoji: '🍫', estoque: 50 },
  { id: 'prod-7', nome: 'Pingo de leite pequeno', descricao: 'R$ 1,00', preco: 1, categoria: 'Doces', emoji: '🥛', estoque: 50 },
  { id: 'prod-8', nome: 'Doce de leite xupxup', descricao: 'R$ 2,50', preco: 2.5, categoria: 'Doces', emoji: '🍮', estoque: 50 },
  { id: 'prod-9', nome: 'Sorvete milho verde e chocolate', descricao: 'R$ 5,00', preco: 5, categoria: 'Sorvetes', emoji: '🍦', estoque: 50 },
  { id: 'prod-10', nome: 'Sorvete de frutas — Brasileirinho', descricao: 'R$ 3,00 cada — leve 2 sorvetes de frutas por R$ 5,00', preco: 3, categoria: 'Sorvetes', emoji: '🍧', estoque: 50, promo: { qtd: 2, preco: 5, grupo: 'sorvete-frutas' } },
  { id: 'prod-17', nome: 'Sorvete de frutas — Mini saia', descricao: 'R$ 3,00 cada — leve 2 sorvetes de frutas por R$ 5,00', preco: 3, categoria: 'Sorvetes', emoji: '🍨', estoque: 50, promo: { qtd: 2, preco: 5, grupo: 'sorvete-frutas' } },

  // Produtos citados nas contas antigas, para dar suporte a elas e a novos pedidos.
  { id: 'prod-11', nome: 'Amendoim alho', descricao: 'Pacotinho de amendoim com alho', preco: 2.5, categoria: 'Salgados', emoji: '🧄', estoque: 50 },
  { id: 'prod-12', nome: 'Caixa de Bis', descricao: 'Caixa com vários biscoitos — R$ 8,00', preco: 8, categoria: 'Doces', emoji: '📦', estoque: 50 },
  { id: 'prod-16', nome: 'Sorvete milho pequeno', descricao: 'Milho verde pequeno', preco: 5, categoria: 'Sorvetes', emoji: '🌽', estoque: 50 }
];

/*
  Contas já cadastradas. Nomes repetidos foram agrupados na mesma conta
  ("Tia Sueli"/"Sueli", "Tio Phe", "Tio Anderson", "Tio Altair"/"Altair", "Pastor").
  Produtos repetidos dentro de uma mesma conta também foram agrupados.
*/
function contasIniciais() {
  return [
    {
      id: 'conta-paulinho', nome: 'Paulinho', itens: [
        { nome: 'Pizza Q/P', quantidade: 1, preco: 30, pago: true }
      ]
    },
    {
      id: 'conta-sueli', nome: 'Tia Sueli', itens: [
        { nome: 'Pizza grande Q/P', quantidade: 1, preco: 30, pago: true },
        { nome: 'Paçoquinha sem chocolate', quantidade: 4, preco: 1.5, pago: false }
      ]
    },
    {
      id: 'conta-anderson', nome: 'Tio Anderson', itens: [
        { nome: '2 pizzas Frango e Catupiry + milho pequeno', quantidade: 1, preco: 36, pago: true },
        { nome: 'Saldo da semana passada', quantidade: 1, preco: 4, pago: true },
        { nome: 'Doce de leite xupxup', quantidade: 1, preco: 2.5, pago: false },
        { nome: 'Paçoquinha sem chocolate', quantidade: 1, preco: 1.5, pago: false }
      ]
    },
    {
      id: 'conta-phe', nome: 'Tio Phe', itens: [
        { nome: 'Amendoim alho', quantidade: 1, preco: 2.5, pago: false },
        { nome: 'Paçoquinha sem chocolate', quantidade: 1, preco: 1, pago: false },
        { nome: '2 pizzas grandes Q/P e milho', quantidade: 1, preco: 40, pago: false }
      ]
    },
    {
      id: 'conta-altair', nome: 'Tio Altair', itens: [
        { nome: 'Amendoim alho', quantidade: 2, preco: 2.5, pago: false },
        { nome: 'Doce de leite xupxup', quantidade: 1, preco: 2.5, pago: false },
        { nome: 'Paçoquinha sem chocolate', quantidade: 2, preco: 1.5, pago: false }
      ]
    },
    {
      id: 'conta-mauro', nome: 'Filha do Mauro', itens: [
        { nome: 'Pizza grande Q/P', quantidade: 1, preco: 35, pago: true }
      ]
    },
    {
      id: 'conta-pastor', nome: 'Pastor', itens: [
        { nome: 'Pizza grande Q/P', quantidade: 1, preco: 30, pago: false },
        { nome: 'Doce de leite xupxup', quantidade: 2, preco: 2.5, pago: false }
      ]
    },
    {
      id: 'conta-marcelo', nome: 'Marcelo', itens: [
        { nome: 'Pizza grande Q/P', quantidade: 1, preco: 58, pago: true },
        { nome: '3 sorvetes mini (cada sabor)', quantidade: 1, preco: 8, pago: true }
      ]
    },
    {
      id: 'conta-zeila', nome: 'Tia Zéila', itens: [
        { nome: 'Doce de leite xupxup', quantidade: 2, preco: 2.5, pago: false }
      ]
    },
    {
      id: 'conta-audrey', nome: 'Audrey', itens: [
        { nome: 'Paçoquinha sem chocolate', quantidade: 3, preco: 1.5, pago: false },
        { nome: 'Caixa de Bis', quantidade: 1, preco: 8, pago: false }
      ]
    }
  ];
}

const $ = (seletor) => document.querySelector(seletor);

const el = {
  contador: $('#contador-carrinho'),
  botaoTema: $('#alternar-tema'),
  abrirCarrinho: $('#abrir-carrinho'),
  fecharCarrinho: $('#fechar-carrinho'),
  carrinho: $('#carrinho'),
  fundo: $('#fundo-carrinho'),
  filtros: $('#filtros'),
  grade: $('#grade-cardapio'),
  itensCarrinho: $('#itens-carrinho'),
  total: $('#total-carrinho'),
  formPedido: $('#form-pedido'),
  nome: $('#nome-cliente'),
  listaNomes: $('#lista-nomes'),
  btnFinalizar: $('#btn-finalizar'),
  filtrosContas: $('#filtros-contas'),
  listaContas: $('#lista-contas'),
  resumoContas: $('#resumo-contas'),
  secaoAdmin: $('#admin'),
  adminConteudo: $('#admin-conteudo'),
  formItem: $('#form-item'),
  itemNome: $('#item-nome'),
  itemDescricao: $('#item-descricao'),
  itemPreco: $('#item-preco'),
  itemEstoque: $('#item-estoque'),
  itemCategoria: $('#item-categoria'),
  itemEmoji: $('#item-emoji'),
  btnSalvarItem: $('#btn-salvar-item'),
  btnCancelarEdicao: $('#btn-cancelar-edicao'),
  listaAdmin: $('#lista-admin'),
  btnLimpar: $('#btn-limpar'),
  toast: $('#toast')
};

// ---------- Funções auxiliares ----------

function ler(chave, valorPadrao) {
  try {
    const dado = localStorage.getItem(chave);
    return dado === null ? valorPadrao : JSON.parse(dado);
  } catch (erro) {
    console.warn('Não foi possível ler os dados salvos:', erro);
    return valorPadrao;
  }
}

function salvar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    console.warn('Não foi possível salvar os dados:', erro);
  }
}

function escapar(texto) {
  return String(texto).replace(/[&<>"']/g, (caractere) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[caractere]));
}

function dinheiro(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor) || 0);
}

// Agrupa variações de nome: "Tio Phe"/"tio phe", "Tia Sueli"/"Sueli", "Altair"/"Tio Altair".
function normalizarNome(nome) {
  return String(nome || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\b(tio|tia)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

let timerToast;
function mostrarMensagem(texto) {
  el.toast.textContent = texto;
  el.toast.classList.add('visivel');
  clearTimeout(timerToast);
  timerToast = setTimeout(() => el.toast.classList.remove('visivel'), 3200);
}

// ---------- Estado ----------
let cardapioCustom = ler(CHAVES.cardapioCustom, []);
let cardapioEditados = ler(CHAVES.cardapioEditados, {});
let cardapioExcluidos = ler(CHAVES.cardapioExcluidos, []);
let cardapioEstoque = ler(CHAVES.cardapioEstoque, {});
let contas = ler(CHAVES.contas, null);
let carrinho = ler(CHAVES.carrinho, {}); // { "id-do-item": quantidade }
let tema = ler(CHAVES.tema, 'claro');
let editandoId = null;
let filtroAtual = 'Todos';
let filtroContas = 'todas';
let contaDestaqueId = null;
let timerDestaque = null;

if (!Array.isArray(cardapioCustom)) cardapioCustom = [];
if (!cardapioEditados || typeof cardapioEditados !== 'object') cardapioEditados = {};
if (!Array.isArray(cardapioExcluidos)) cardapioExcluidos = [];
if (!cardapioEstoque || typeof cardapioEstoque !== 'object') cardapioEstoque = {};
if (!Array.isArray(contas)) {
  contas = contasIniciais();
  salvar(CHAVES.contas, contas);
}
if (!carrinho || typeof carrinho !== 'object' || Array.isArray(carrinho)) carrinho = {};

// ---------- Cardápio ----------

function montarCardapio() {
  const itens = [...CARDAPIO_PADRAO, ...cardapioCustom]
    .filter((item) => !cardapioExcluidos.includes(item.id));

  return itens.map((item) => {
    const editado = cardapioEditados[item.id] || {};
    const final = { ...item, ...editado };
    if (Object.prototype.hasOwnProperty.call(cardapioEstoque, item.id)) {
      final.estoque = cardapioEstoque[item.id];
    }
    return { ...final, estoque: Number(final.estoque) || 0 };
  });
}

let cardapio = montarCardapio();

function salvarCardapio() {
  salvar(CHAVES.cardapioCustom, cardapioCustom);
  salvar(CHAVES.cardapioEditados, cardapioEditados);
  salvar(CHAVES.cardapioExcluidos, cardapioExcluidos);
  salvar(CHAVES.cardapioEstoque, cardapioEstoque);
}

function recarregarCardapio() {
  cardapio = montarCardapio();
}

function darBaixaNoEstoque(itens) {
  itens.forEach(({ item, quantidade }) => {
    const atual = Number(cardapioEstoque[item.id] ?? item.estoque) || 0;
    cardapioEstoque[item.id] = Math.max(0, atual - quantidade);
  });
  salvar(CHAVES.cardapioEstoque, cardapioEstoque);
  recarregarCardapio();
}

// Promoção "leve 2 sorvetes de frutas por R$ 5,00", válida entre os dois sabores.
function quantidadesPorGrupo(itens) {
  const grupos = {};
  itens.forEach(({ item, quantidade }) => {
    if (!item.promo || !item.promo.grupo) return;
    const chave = item.promo.grupo;
    grupos[chave] = (grupos[chave] || 0) + (Number(quantidade) || 0);
  });
  return grupos;
}

function precoUnitarioItem(item, quantidadeGrupo) {
  const q = Number(quantidadeGrupo) || 0;
  if (item.promo && q > 0) {
    const blocos = Math.floor(q / item.promo.qtd);
    const resto = q % item.promo.qtd;
    return (blocos * item.promo.preco + resto * item.preco) / q;
  }
  return item.preco;
}

function precoTotalItem(item, quantidade, quantidadeGrupo = quantidade) {
  return precoUnitarioItem(item, quantidadeGrupo) * (Number(quantidade) || 0);
}

function renderizarFiltros() {
  const categorias = ['Todos', ...new Set(cardapio.map((item) => item.categoria))];
  el.filtros.innerHTML = categorias.map((categoria) => `
    <button type="button" class="filtro ${categoria === filtroAtual ? 'ativo' : ''}"
            data-acao="filtrar" data-categoria="${escapar(categoria)}">
      ${escapar(categoria)}
    </button>
  `).join('');
}

function renderizarCardapio() {
  const itens = filtroAtual === 'Todos'
    ? cardapio
    : cardapio.filter((item) => item.categoria === filtroAtual);

  if (itens.length === 0) {
    el.grade.innerHTML = '<p class="vazio">Nenhum item nessa categoria ainda.</p>';
    return;
  }

  el.grade.innerHTML = itens.map((item) => {
    const estoque = Number(item.estoque) || 0;
    const esgotado = estoque === 0;
    return `
    <article class="item-card">
      <div class="item-emoji">${escapar(item.emoji)}</div>
      <div class="item-info">
        <span class="item-categoria">${escapar(item.categoria)}</span>
        <h3>${escapar(item.nome)}</h3>
        <p>${escapar(item.descricao)}</p>
      </div>
      <div class="item-bottom">
        <div>
          <strong class="preco">${dinheiro(item.preco)}</strong>
          ${item.promo ? `<span class="promo">Leve ${item.promo.qtd} por ${dinheiro(item.promo.preco)}</span>` : ''}
          <span class="item-estoque ${esgotado ? 'esgotado' : ''}">${esgotado ? 'Esgotado' : `Estoque: ${estoque}`}</span>
        </div>
        <button type="button" class="botao-primario botao-pequeno"
                data-acao="adicionar" data-id="${escapar(item.id)}" ${esgotado ? 'disabled' : ''}>${esgotado ? 'Esgotado' : 'Adicionar +'}</button>
      </div>
    </article>`;
  }).join('');
}

// ---------- Carrinho ----------

function itensDoCarrinho() {
  const itens = Object.entries(carrinho)
    .map(([id, quantidade]) => {
      const item = cardapio.find((produto) => produto.id === id);
      return item ? { item, quantidade } : null;
    })
    .filter(Boolean);
  const grupos = quantidadesPorGrupo(itens);

  return itens.map(({ item, quantidade }) => ({
    item,
    quantidade,
    quantidadeGrupo: item.promo && item.promo.grupo
      ? (grupos[item.promo.grupo] || 0)
      : quantidade
  }));
}

function totalCarrinho() {
  return itensDoCarrinho()
    .reduce((total, { item, quantidade, quantidadeGrupo }) => total + precoTotalItem(item, quantidade, quantidadeGrupo), 0);
}

function renderizarCarrinho() {
  const itens = itensDoCarrinho();
  const quantidadeTotal = itens.reduce((soma, entry) => soma + entry.quantidade, 0);

  el.contador.textContent = quantidadeTotal;
  el.total.textContent = dinheiro(totalCarrinho());
  el.btnFinalizar.disabled = itens.length === 0;

  if (itens.length === 0) {
    el.itensCarrinho.innerHTML = '<p class="vazio">Seu carrinho está vazio. Escolha algo no cardápio! 🍽️</p>';
    return;
  }

  el.itensCarrinho.innerHTML = itens.map(({ item, quantidade, quantidadeGrupo }) => `
    <div class="item-carrinho">
      <div class="emoji">${escapar(item.emoji)}</div>
      <div>
        <h4>${escapar(item.nome)}</h4>
        <small>${dinheiro(precoUnitarioItem(item, quantidadeGrupo))} cada${item.promo ? ` • leve ${item.promo.qtd} por ${dinheiro(item.promo.preco)}` : ''}<br><strong>${dinheiro(precoTotalItem(item, quantidade, quantidadeGrupo))}</strong></small>
      </div>
      <div class="controles">
        <button type="button" data-acao="diminuir" data-id="${escapar(item.id)}" aria-label="Diminuir quantidade">−</button>
        <span class="quantidade">${quantidade}</span>
        <button type="button" data-acao="aumentar" data-id="${escapar(item.id)}" aria-label="Aumentar quantidade" ${quantidade >= (Number(item.estoque) || 0) ? 'disabled' : ''}>+</button>
        <button type="button" class="remover" data-acao="remover" data-id="${escapar(item.id)}" aria-label="Remover item">✕</button>
      </div>
    </div>
  `).join('');
}

function alterarQuantidade(id, delta) {
  const item = cardapio.find((produto) => produto.id === id);
  const novaQuantidade = (carrinho[id] || 0) + delta;

  if (item && novaQuantidade > (Number(item.estoque) || 0)) {
    mostrarMensagem(`Só há ${item.estoque} unidades de ${item.nome} no estoque.`);
    return;
  }

  if (novaQuantidade <= 0) delete carrinho[id];
  else carrinho[id] = novaQuantidade;

  salvar(CHAVES.carrinho, carrinho);
  renderizarCarrinho();
}

function abrirCarrinho() {
  el.carrinho.classList.add('aberto');
  el.carrinho.setAttribute('aria-hidden', 'false');
  el.fundo.classList.add('visivel');
}

function fecharCarrinho() {
  el.carrinho.classList.remove('aberto');
  el.carrinho.setAttribute('aria-hidden', 'true');
  el.fundo.classList.remove('visivel');
}

// ---------- Contas ----------

function salvarContas() {
  salvar(CHAVES.contas, contas);
}

function totalConta(conta) {
  return conta.itens.reduce((total, item) => total + (Number(item.preco) || 0) * (Number(item.quantidade) || 0), 0);
}

function statusConta(conta) {
  if (!conta.itens.length) return 'aberto';
  const pagos = conta.itens.filter((item) => item.pago).length;
  if (pagos === conta.itens.length) return 'pago';
  if (pagos === 0) return 'aberto';
  return 'parcial';
}

function buscarConta(nome) {
  const chave = normalizarNome(nome);
  return contas.find((conta) => normalizarNome(conta.nome) === chave);
}

function textoAtualizacao(conta) {
  const data = new Date(conta.atualizadoEm);
  if (!conta.atualizadoEm || Number.isNaN(data.getTime())) return '';

  const minutos = Math.floor((Date.now() - data.getTime()) / 60000);
  if (minutos < 1) return 'Atualizada agora';
  if (minutos < 60) return `Atualizada há ${minutos} min`;

  return 'Atualizada em '
    + new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(data);
}

// Destaca a conta que recebeu o pedido para a atualização ficar visível de imediato.
function destacarConta(conta, mensagem) {
  contaDestaqueId = conta.id;

  const status = statusConta(conta);
  if ((filtroContas === 'paga' && status !== 'pago') || (filtroContas === 'aberta' && status === 'pago')) {
    filtroContas = 'todas';
  }

  renderizarFiltrosContas();
  renderizarContas();

  const cartao = document.querySelector(`[data-conta-card="${conta.id}"]`);
  if (cartao) cartao.scrollIntoView({ behavior: 'smooth', block: 'center' });

  mostrarMensagem(mensagem);

  clearTimeout(timerDestaque);
  timerDestaque = setTimeout(() => {
    contaDestaqueId = null;
    renderizarContas();
  }, 6000);
}

function registrarPedido(nome, itens) {
  if (!nome || !itens.length) return null;

  let conta = buscarConta(nome);
  const novaConta = !conta;
  if (!conta) {
    conta = { id: 'conta-' + Date.now(), nome: nome.trim(), itens: [] };
    contas.push(conta);
  }

  const valorAdicionado = itens.reduce((total, { item, quantidade, quantidadeGrupo }) =>
    total + precoTotalItem(item, quantidade, quantidadeGrupo || quantidade), 0);

  itens.forEach(({ item, quantidade, quantidadeGrupo }) => {
    const precoUnitario = precoUnitarioItem(item, quantidadeGrupo || quantidade);
    const existing = conta.itens.find((linha) =>
      linha.nome === item.nome && Number(linha.preco) === precoUnitario);
    if (existing) {
      existing.quantidade = (Number(existing.quantidade) || 0) + quantidade;
      existing.pago = false;
    } else {
      conta.itens.push({
        nome: item.nome,
        quantidade,
        preco: precoUnitario,
        pago: false
      });
    }
  });

  conta.atualizadoEm = Date.now();
  salvarContas();
  return { conta, valorAdicionado, novaConta };
}

function renderizarNomes() {
  const nomes = contas.map((conta) => conta.nome).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  el.listaNomes.innerHTML = nomes.map((nome) => `<option value="${escapar(nome)}"></option>`).join('');
}

function renderizarFiltrosContas() {
  el.filtrosContas.querySelectorAll('[data-acao="filtrar-conta"]').forEach((botao) => {
    const ativo = botao.dataset.status === filtroContas;
    botao.classList.toggle('ativa', ativo);
    botao.setAttribute('aria-pressed', String(ativo));
  });
}

function renderizarContas() {
  const todas = [...contas].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  const pagas = todas.filter((conta) => statusConta(conta) === 'pago').length;
  el.resumoContas.textContent = todas.length
    ? `${todas.length} ${todas.length === 1 ? 'conta cadastrada' : 'contas cadastradas'} • ${pagas} ${pagas === 1 ? 'paga' : 'pagas'} • total ${dinheiro(todas.reduce((soma, conta) => soma + totalConta(conta), 0))}`
    : 'Nenhuma conta ainda.';

  const visiveis = todas.filter((conta) => {
    const status = statusConta(conta);
    if (filtroContas === 'paga') return status === 'pago';
    if (filtroContas === 'aberta') return status !== 'pago';
    return true;
  });

  if (visiveis.length === 0) {
    el.listaContas.innerHTML = '<p class="vazio">Nenhuma conta nesse filtro.</p>';
    return;
  }

  const opcoesProdutos = cardapio.map((item) =>
    `<option value="${escapar(item.id)}">${escapar(item.nome)} — ${dinheiro(item.preco)}</option>`).join('');

  el.listaContas.innerHTML = visiveis.map((conta) => {
    const status = statusConta(conta);
    const statusTexto = status === 'pago' ? '✅ Pago' : status === 'parcial' ? '🟡 Parcial' : '⏳ Em aberto';
    const pagoTotal = conta.itens.every((item) => item.pago);

    const linhas = conta.itens.map((item, indice) => `
      <div class="conta-item ${item.pago ? 'item-pago' : 'item-aberto'}">
        <span class="nome-item"><strong>${Number(item.quantidade)}× ${escapar(item.nome)}</strong>
          <small>${dinheiro(item.preco)} cada${item.pago ? ' • pago' : ' • em aberto'}</small>
        </span>
        <span class="valor-item">${dinheiro((Number(item.preco) || 0) * (Number(item.quantidade) || 0))}</span>
        <span class="item-acoes">
          <input type="checkbox" class="pago-check" data-acao="toggle-pago"
                 data-conta="${escapar(conta.id)}" data-index="${indice}"
                 ${item.pago ? 'checked' : ''} title="Marcar como pago">
          <button type="button" class="remover-item" data-acao="remover-item-conta"
                  data-conta="${escapar(conta.id)}" data-index="${indice}" title="Remover item">✕</button>
        </span>
      </div>`).join('');

    const atualizacao = textoAtualizacao(conta);

    return `
      <article class="conta-card ${contaDestaqueId === conta.id ? 'conta-atualizada' : ''}"
               data-conta-card="${escapar(conta.id)}">
        <div class="conta-topo">
          <div>
            <h3>👤 ${escapar(conta.nome)}</h3>
            ${atualizacao ? `<small class="conta-atualizacao">🕒 ${escapar(atualizacao)}</small>` : ''}
          </div>
          <span class="conta-status status-${status}">${statusTexto}</span>
        </div>
        <div class="conta-itens">${linhas || '<p class="secao-sub">Conta sem itens.</p>'}</div>
        <div class="conta-rodape">
          <span class="conta-total">Total: <strong>${dinheiro(totalConta(conta))}</strong></span>
          <span class="conta-acoes">
            ${pagoTotal
              ? '<button type="button" class="botao-secundario" data-acao="despagar-tudo" data-conta="' + escapar(conta.id) + '">Desmarcar pagamento</button>'
              : '<button type="button" class="botao-secundario" data-acao="pagar-tudo" data-conta="' + escapar(conta.id) + '">Marcar tudo pago</button>'}
            <button type="button" class="botao-texto" data-acao="excluir-conta" data-conta="${escapar(conta.id)}">Excluir conta</button>
          </span>
        </div>
        <details class="conta-detalhes">
          <summary>➕ Adicionar item à conta</summary>
          <div class="form-add-conta">
            <label class="campo">Produto
              <select data-produto-conta="${escapar(conta.id)}">${opcoesProdutos}</select>
            </label>
            <label class="campo">Qtd.
              <input type="number" min="1" step="1" value="1" data-qtd-conta="${escapar(conta.id)}">
            </label>
            <button type="button" class="botao-primario" data-acao="add-item-conta" data-conta="${escapar(conta.id)}">Adicionar</button>
          </div>
        </details>
      </article>`;
  }).join('');
}

function finalizarPedido(evento) {
  evento.preventDefault();

  const itens = itensDoCarrinho();
  if (!itens.length) return;

  for (const { item, quantidade } of itens) {
    if (quantidade > (Number(item.estoque) || 0)) {
      mostrarMensagem(`Sem estoque suficiente de ${item.nome}.`);
      return;
    }
  }

  const nome = el.nome.value.trim();
  if (!nome) {
    mostrarMensagem('Informe o nome da pessoa.');
    return;
  }

  const pedido = registrarPedido(nome, itens);
  darBaixaNoEstoque(itens);
  carrinho = {};
  salvar(CHAVES.carrinho, carrinho);

  renderizarTudo();
  fecharCarrinho();

  const acao = pedido.novaConta ? 'Conta criada' : 'Conta atualizada';
  destacarConta(pedido.conta,
    `${acao} para ${pedido.conta.nome}: + ${dinheiro(pedido.valorAdicionado)} • total ${dinheiro(totalConta(pedido.conta))}.`);
}

// ---------- Tema ----------

function aplicarTema() {
  const escuro = tema === 'escuro';
  document.body.classList.toggle('tema-escuro', escuro);
  el.botaoTema.textContent = escuro ? '☀️' : '🌙';
  el.botaoTema.setAttribute('aria-label', escuro ? 'Mudar para o fundo claro' : 'Mudar para o fundo escuro');
}

// ---------- Gerenciamento de produtos ----------

function resetarFormItem() {
  editandoId = null;
  el.formItem.reset();
  el.itemEstoque.value = 20;
  el.btnSalvarItem.textContent = 'Adicionar item';
  el.btnCancelarEdicao.hidden = true;
}

function renderizarListaAdmin() {
  if (cardapio.length === 0) {
    el.listaAdmin.innerHTML = '<p class="vazio">Nenhum produto cadastrado.</p>';
    return;
  }

  el.listaAdmin.innerHTML = cardapio.map((item) => {
    const estoque = Number(item.estoque) || 0;
    return `
      <div class="produto-admin">
        <div>
          <strong>${escapar(item.emoji)} ${escapar(item.nome)}</strong>
          <small>${escapar(item.categoria)} • ${dinheiro(item.preco)}${item.promo ? ` • leve ${item.promo.qtd} por ${dinheiro(item.promo.preco)}` : ''}</small>
        </div>
        <div class="produto-admin-acoes">
          <span class="estoque ${estoque === 0 ? 'estoque-zero' : ''}">Estoque: ${estoque}</span>
          <button type="button" class="botao-secundario" data-acao="editar-item" data-id="${escapar(item.id)}">Editar</button>
          <button type="button" class="botao-texto" data-acao="excluir-item" data-id="${escapar(item.id)}">Excluir</button>
        </div>
      </div>`;
  }).join('');
}

function salvarItemAdmin(evento) {
  evento.preventDefault();

  const nome = el.itemNome.value.trim();
  const preco = Number(el.itemPreco.value);
  const estoque = Number(el.itemEstoque.value);

  if (!nome || !Number.isFinite(preco) || preco <= 0) {
    mostrarMensagem('Informe um nome e um preço válidos.');
    return;
  }
  if (!Number.isInteger(estoque) || estoque < 0) {
    mostrarMensagem('Informe um estoque válido (número inteiro, pode ser 0).');
    return;
  }

  const dados = {
    nome,
    descricao: el.itemDescricao.value.trim() || 'Item do cardápio',
    preco,
    estoque,
    categoria: el.itemCategoria.value,
    emoji: el.itemEmoji.value.trim() || '🍽️'
  };

  if (editandoId) {
    cardapioEditados[editandoId] = { ...(cardapioEditados[editandoId] || {}), ...dados };
    cardapioEstoque[editandoId] = estoque;
    mostrarMensagem('Produto atualizado!');
  } else {
    const id = 'custom-' + Date.now();
    cardapioCustom.push({ id, ...dados });
    cardapioEstoque[id] = estoque;
    filtroAtual = 'Todos';
    mostrarMensagem('Produto adicionado ao cardápio!');
  }

  salvarCardapio();
  recarregarCardapio();
  resetarFormItem();
  renderizarTudo();
}

function prepararEdicao(id) {
  const item = cardapio.find((produto) => produto.id === id);
  if (!item) return;

  editandoId = id;
  el.itemNome.value = item.nome;
  el.itemDescricao.value = item.descricao || '';
  el.itemPreco.value = item.preco;
  el.itemEstoque.value = Number(item.estoque) || 0;
  el.itemCategoria.value = item.categoria;
  el.itemEmoji.value = item.emoji || '🍽️';
  el.btnSalvarItem.textContent = 'Salvar alterações';
  el.btnCancelarEdicao.hidden = false;
  el.formItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.itemNome.focus();
}

function excluirItem(id) {
  const item = cardapio.find((produto) => produto.id === id);
  if (!item) return;
  if (!confirm(`Excluir "${item.nome}" do cardápio?`)) return;

  cardapioCustom = cardapioCustom.filter((produto) => produto.id !== id);
  if (!cardapioExcluidos.includes(id)) cardapioExcluidos.push(id);
  delete cardapioEditados[id];
  delete cardapioEstoque[id];
  delete carrinho[id];

  if (editandoId === id) resetarFormItem();

  salvarCardapio();
  salvar(CHAVES.carrinho, carrinho);
  recarregarCardapio();
  renderizarTudo();
  mostrarMensagem(`${item.nome} foi excluído.`);
}

// ---------- Renderização geral ----------

function renderizarTudo() {
  renderizarFiltros();
  renderizarCardapio();
  renderizarCarrinho();
  renderizarFiltrosContas();
  renderizarContas();
  renderizarNomes();
  renderizarListaAdmin();
}

// ---------- Eventos ----------

document.addEventListener('click', (evento) => {
  const botao = evento.target.closest('[data-acao]');
  if (!botao || botao.tagName === 'INPUT') return;

  const acao = botao.dataset.acao;
  const id = botao.dataset.id;
  const idConta = botao.dataset.conta;
  const indice = Number(botao.dataset.index);
  const conta = contas.find((item) => item.id === idConta);

  if (acao === 'filtrar') {
    filtroAtual = botao.dataset.categoria;
    renderizarFiltros();
    renderizarCardapio();
  }

  if (acao === 'adicionar') {
    const item = cardapio.find((produto) => produto.id === id);
    if (!item) return;
    const quantidade = (carrinho[id] || 0) + 1;
    if (quantidade > (Number(item.estoque) || 0)) {
      mostrarMensagem(`Só há ${item.estoque} unidades de ${item.nome} no estoque.`);
      return;
    }
    carrinho[id] = quantidade;
    salvar(CHAVES.carrinho, carrinho);
    renderizarCarrinho();
    mostrarMensagem('Adicionado ao carrinho!');
  }

  if (acao === 'aumentar') alterarQuantidade(id, 1);
  if (acao === 'diminuir') alterarQuantidade(id, -1);

  if (acao === 'remover') {
    delete carrinho[id];
    salvar(CHAVES.carrinho, carrinho);
    renderizarCarrinho();
  }

  if (acao === 'filtrar-conta') {
    filtroContas = botao.dataset.status;
    renderizarFiltrosContas();
    renderizarContas();
  }

  if (acao === 'pagar-tudo' && conta) {
    conta.itens.forEach((item) => { item.pago = true; });
    salvarContas();
    renderizarContas();
    mostrarMensagem(`Conta de ${conta.nome} marcada como paga.`);
  }

  if (acao === 'despagar-tudo' && conta) {
    conta.itens.forEach((item) => { item.pago = false; });
    salvarContas();
    renderizarContas();
    mostrarMensagem(`Pagamento da conta de ${conta.nome} desmarcado.`);
  }

  if (acao === 'remover-item-conta' && conta && conta.itens[indice]) {
    const removido = conta.itens.splice(indice, 1)[0];
    salvarContas();
    renderizarContas();
    mostrarMensagem(`${removido.nome} removido da conta de ${conta.nome}.`);
  }

  if (acao === 'excluir-conta' && conta) {
    if (!confirm(`Excluir a conta de ${conta.nome}?`)) return;
    contas = contas.filter((item) => item.id !== conta.id);
    salvarContas();
    renderizarTudo();
    mostrarMensagem(`Conta de ${conta.nome} excluída.`);
  }

  if (acao === 'add-item-conta' && conta) {
    const idProduto = document.querySelector(`[data-produto-conta="${conta.id}"]`)?.value;
    const quantidade = Number(document.querySelector(`[data-qtd-conta="${conta.id}"]`)?.value) || 0;
    const produto = cardapio.find((item) => item.id === idProduto);

    if (!produto || quantidade < 1) {
      mostrarMensagem('Escolha um produto e uma quantidade válida.');
      return;
    }

    const precoUnitario = precoUnitarioItem(produto, quantidade);
    const existing = conta.itens.find((item) => item.nome === produto.nome && Number(item.preco) === precoUnitario);
    if (existing) {
      existing.quantidade += quantidade;
      existing.pago = false;
    } else {
      conta.itens.push({
        nome: produto.nome,
        quantidade,
        preco: precoUnitario,
        pago: false
      });
    }

    conta.atualizadoEm = Date.now();
    salvarContas();
    destacarConta(conta, `${produto.nome} adicionado à conta de ${conta.nome} • total ${dinheiro(totalConta(conta))}.`);
  }

  if (acao === 'editar-item') prepararEdicao(id);
  if (acao === 'excluir-item') excluirItem(id);
});

document.addEventListener('change', (evento) => {
  const check = evento.target.closest('[data-acao="toggle-pago"]');
  if (!check) return;

  const conta = contas.find((item) => item.id === check.dataset.conta);
  const item = conta?.itens[Number(check.dataset.index)];
  if (!item) return;

  item.pago = check.checked;
  salvarContas();
  renderizarContas();
});

el.botaoTema.addEventListener('click', () => {
  tema = tema === 'escuro' ? 'claro' : 'escuro';
  salvar(CHAVES.tema, tema);
  aplicarTema();
});

el.abrirCarrinho.addEventListener('click', abrirCarrinho);
el.fecharCarrinho.addEventListener('click', fecharCarrinho);
el.fundo.addEventListener('click', fecharCarrinho);
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') fecharCarrinho();
});

el.formPedido.addEventListener('submit', finalizarPedido);
el.formItem.addEventListener('submit', salvarItemAdmin);
el.btnCancelarEdicao.addEventListener('click', resetarFormItem);

el.btnLimpar.addEventListener('click', () => {
  if (!confirm('Restaurar produtos e contas originais? Carrinho, alterações e contas criadas serão apagados.')) return;

  Object.values(CHAVES).forEach((chave) => localStorage.removeItem(chave));
  cardapioCustom = [];
  cardapioEditados = {};
  cardapioExcluidos = [];
  cardapioEstoque = {};
  contas = contasIniciais();
  carrinho = {};
  tema = 'claro';
  filtroAtual = 'Todos';
  filtroContas = 'todas';

  salvar(CHAVES.contas, contas);
  el.formPedido.reset();
  resetarFormItem();
  recarregarCardapio();
  aplicarTema();
  renderizarTudo();
  mostrarMensagem('Dados originais restaurados.');
});

// Mantém as contas atualizadas se o pedido for registrado em outra aba.
window.addEventListener('storage', (evento) => {
  if (evento.key !== CHAVES.contas) return;
  const novasContas = ler(CHAVES.contas, contas);
  if (!Array.isArray(novasContas)) return;

  contas = novasContas;
  renderizarContas();
  renderizarNomes();
  mostrarMensagem('Contas atualizadas.');
});

// ---------- Início ----------
aplicarTema();
renderizarTudo();
