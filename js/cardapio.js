const lojas = {
  'recreio': { nome: 'Unidade Recreio', texto: 'Horário: 06h às 14h · Atendimento Presencial / Totem / Balcão', delivery: false },
  'campo-grande': { nome: 'Unidade Campo Grande', texto: 'AMBIENTE DIGITAL DELIVERY — Receba em casa com agilidade', delivery: true },
  'centro': { nome: 'Unidade Centro', texto: 'Horário: 07h às 16h · Perfeito para retiradas expressas', delivery: false }
};

const unidade = localStorage.getItem('unidadeSelecionada') || 'recreio';
const config = lojas[unidade];

document.querySelector('.hero h2').textContent = config.nome;
document.querySelector('.hero p').textContent = config.texto;
if(config.delivery) { 
  document.querySelector('.hero').style.background = '#8B4F1D'; 
}

const produtos = [
  { id:1, nome:'Tapioca Nordestina', desc:'Tapioca com manteiga de garrafa, queijo coalho e carne seca.', preco:14.90, cat:'tapioca', badge:'Mais pedida', unidades:['recreio', 'campo-grande', 'centro'], imagem: 'img/tapioca_carne.jpg' },
  { id:2, nome:'Tapioca de Coco', desc:'Tapioca recheada com coco ralado fresco e leite condensado.', preco:12.50, cat:'tapioca', badge:'Novo', unidades:['recreio', 'centro'], imagem: 'img/tapioca_coco.jpg' },
  { id:3, nome:'Tapioca de Frango', desc:'Tapioca com frango desfiado temperado e ervas frescas.', preco:13.90, cat:'tapioca', badge:'', unidades:['recreio', 'campo-grande', 'centro'], imagem: 'img/tapioca_frango.jpg' },
  { id:4, nome:'Cuscuz com Ovo', desc:'Cuscuz nordestino com ovo mexido e manteiga de garrafa.', preco:11.00, cat:'cuscuz', badge:'', unidades:['recreio', 'campo-grande', 'centro'], imagem: 'img/cuscuz_ovo.jpg' },
  { id:5, nome:'Cuscuz Recheado', desc:'Cuscuz com carne seca desfiada, queijo e pimenta biquinho.', preco:16.50, cat:'cuscuz', badge:'Mais pedida', unidades:['recreio', 'campo-grande', 'centro'], imagem: 'img/cuscuz_recheado.jpg' },
  { id:6, nome:'Bolo de Macaxeira', desc:'Bolo úmido de macaxeira com calda de coco. Fatia generosa.', preco:8.00, cat:'bolo', badge:'', unidades:['recreio', 'campo-grande'], imagem: 'img/bolo_de_aipim.jpg' },
  { id:7, nome:'Bolo de Rolo', desc:'Tradicional bolo de rolo pernambucano com goiabada cremosa.', preco:9.50, cat:'bolo', badge:'Junho', unidades:['recreio', 'campo-grande', 'centro'], imagem: 'img/bolo_de_rolo.jpg' },
  { id:8, nome:'Café Passado', desc:'Café coado na hora com grãos selecionados do sertão.', preco:6.00, cat:'cafe', badge:'', unidades:['recreio', 'centro'], imagem: 'img/cafe_passado.jpg' }, 
  { id:9, nome:'Suco de Umbú', desc:'Suco natural de umbú, fruta típica do sertão nordestino.', preco:9.00, cat:'bebida', badge:'Safra', unidades:['recreio', 'campo-grande', 'centro'], imagem: 'img/suco_de_umbu.jpg' },
  { id:10, nome:'Suco de Cajá', desc:'Suco natural de cajá fresquinho, puro e gelado.', preco:8.50, cat:'bebida', badge:'', unidades:['recreio', 'campo-grande', 'centro'], imagem: 'img/suco_de_caja.jpg' },
  { id:11, nome:'Café da Manhã Completo', desc:'Café + tapioca nordestina + bolo de macaxeira. O melhor do dia.', preco:28.90, cat:'cafe', badge:'Combo', esgotado: false, unidades:['recreio'], imagem: 'img/cafe_da_manha.jpg' },
  { id:12, nome:'Beiju de Coco', desc:'Beiju crocante com coco fresco. Somente aos fins de semana.', preco:10.00, cat:'tapioca', badge:'Fim de sem.', esgotado: true, unidades:['recreio', 'centro'], imagem: 'img/beiju_de_coco.jpg' }
];

let carrinho = [];
let catAtual = 'todos';

function formatPreco(v) { return 'R$ ' + v.toFixed(2).replace('.',','); }

function toggleDrawer() { 
  document.getElementById('drawer').classList.toggle('open'); 
  document.getElementById('overlay').classList.toggle('open'); 
}

function irParaPagamento() { 
  localStorage.setItem('pedido', JSON.stringify(carrinho)); 
  window.location.href = 'pagamento.html'; 
}

function showToast(msg) { 
  const t = document.getElementById('toast'); 
  t.textContent = msg; t.classList.add('show'); 
  setTimeout(() => t.classList.remove('show'), 2500); 
}

function filtrar(cat, btn) {
  catAtual = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active'); 
  renderProdutos();
}

function renderDrawer() {
  const container = document.getElementById('drawer-items');
  document.getElementById('total-price').textContent = formatPreco(carrinho.reduce((s, i) => s + i.preco * i.qty, 0));
  document.getElementById('btn-checkout').disabled = carrinho.length === 0;

  if (carrinho.length === 0) { container.innerHTML = '<p class="drawer-empty">Carrinho vazio.</p>'; return; }
  container.innerHTML = carrinho.map(i => `
    <div class="drawer-item">
      <div class="drawer-item-info">
        <div class="drawer-item-name"><img src="${i.imagem}" style="width: 24px; height: 24px; border-radius: 4px; vertical-align: middle; margin-right: 6px;"> ${i.nome}</div>
        <div class="drawer-item-price">${formatPreco(i.preco * i.qty)}</div>
      </div>
      <div class="qty-ctrl">
        <button class="qty-btn" onclick="updateQty(${i.id},-1)">−</button>
        <span class="qty-num">${i.qty}</span>
        <button class="qty-btn" onclick="updateQty(${i.id},1)">+</button>
      </div>
    </div>
  `).join('');
}

function updateQty(id, delta) {
  const idx = carrinho.findIndex(i => i.id === id);
  if (idx === -1) return;
  carrinho[idx].qty += delta;
  if (carrinho[idx].qty <= 0) carrinho.splice(idx, 1);
  document.getElementById('cart-count').textContent = carrinho.reduce((s, i) => s + i.qty, 0);
  renderDrawer();
}

function addCarrinho(id) {
  const prod = produtos.find(p => p.id === id);
  const existente = carrinho.find(i => i.id === id);
  if (existente) { existente.qty++; } else { carrinho.push({ ...prod, qty: 1 }); }
  document.getElementById('cart-count').textContent = carrinho.reduce((s, i) => s + i.qty, 0);
  renderDrawer();
  showToast(`${prod.nome} adicionado`);
}

function renderProdutos() {
  let lista = produtos.filter(p => p.unidades.includes(unidade));
  if (catAtual !== 'todos') { lista = lista.filter(p => p.cat === catAtual); }
  const container = document.getElementById('produtos-container');

  if (lista.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:3rem 0">Sem produtos nesta categoria.</p>';
    return;
  }


container.innerHTML = `
  <h2 class="section-title">${catAtual === 'todos' ? 'Todos os itens' : lista[0].cat.toUpperCase()}</h2>
  <div class="grid">
    ${lista.map(p => `
      <div class="card${p.esgotado ? ' esgotado' : ''}">
        <div class="card-img" style="background: none;"> <img src="${p.imagem}" alt="${p.nome}" style="width: 100%; height: 100%; object-fit: cover;">
          
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
          ${p.esgotado ? '<span class="badge">Esgotado</span>' : ''}
        </div>
        <div class="card-body">
          <div class="card-name">${p.nome}</div>
          <div class="card-desc">${p.desc}</div>
          <div class="card-footer">
            <div class="card-price">${formatPreco(p.preco)}</div>
            <button class="add-btn" onclick="addCarrinho(${p.id})" ${p.esgotado ? 'disabled' : ''}>+</button>
          </div>
        </div>
      </div>
    `).join('')}
  </div>
`;
}

renderProdutos();
