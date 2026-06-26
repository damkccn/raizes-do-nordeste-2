let pontos = 342;
let recompensaAtual = null;

// Dicionário para traduzir a etiqueta interna do localStorage para um nome amigável
const nomesUnidades = {
  'recreio': 'Recreio',
  'centro': 'Centro',
  'campo-grande': 'Campo Grande'
};

const unidadeSelecionada = localStorage.getItem('unidadeSelecionada') || 'recreio';
const nomeFilialAmigavel = nomesUnidades[unidadeSelecionada];

// 1. Carrega e soma pontos do último pedido efetuado
const confirmado = localStorage.getItem('pedidoConfirmado');
if (confirmado) {
  const p = JSON.parse(confirmado);
  const itens = p.itens || [];
  const total = itens.reduce((s, i) => s + i.preco * i.qty, 0);
  const novosPontos = Math.floor(total);
  pontos += novosPontos;

  // Atualiza dinamicamente o primeiro item do histórico com a unidade real utilizada!
  const primeiroItemDesc = document.querySelector('#historico-lista .historico-item:first-child .hist-desc');
  if (primeiroItemDesc && p.codigo) {
    primeiroItemDesc.textContent = `Pedido ${p.codigo} — ${nomeFilialAmigavel}`;
    document.querySelector('#historico-lista .historico-item:first-child .hist-pts').textContent = `+${novosPontos} pts`;
  }
}

// 2. Atualiza os painéis de saldo da interface
document.getElementById('saldo-pontos').textContent = pontos;
document.getElementById('saldo-reais').textContent = 'R$ ' + (pontos * 0.01).toFixed(2).replace('.',',');

// 3. Gerenciamento da régua de metas e barra de progresso
const meta = 500;
const pct = Math.min(Math.round((pontos / meta) * 100), 100);
const falta = Math.max(meta - pontos, 0);
document.getElementById('prog-pct').textContent = pct + '%';
document.getElementById('prog-falta').textContent = falta + ' pontos';
document.getElementById('pts-proximo').textContent = falta > 0 ? falta + ' pts para Ouro' : 'Nível Ouro atingido!';
setTimeout(() => { document.getElementById('prog-fill').style.width = pct + '%'; }, 200);

// 4. Funções do Modal de Resgate e Feedback (Toast)
function abrirModal(nome, custo) {
  if (pontos < custo) { showToast('Pontos insuficientes para este resgate.'); return; }
  recompensaAtual = { nome, custo };
  document.getElementById('modal-titulo').textContent = 'Resgatar: ' + nome;
  document.getElementById('modal-desc').textContent = 'Serão descontados ' + custo + ' pontos do seu saldo (' + pontos + ' pts disponíveis). Deseja confirmar?';
  document.getElementById('modal-overlay').classList.add('show');
}

function fecharModal() {
  document.getElementById('modal-overlay').classList.remove('show');
  recompensaAtual = null;
}

function confirmarResgate() {
  if (!recompensaAtual) return;
  pontos -= recompensaAtual.custo;
  document.getElementById('saldo-pontos').textContent = pontos;
  document.getElementById('saldo-reais').textContent = 'R$ ' + (pontos * 0.01).toFixed(2).replace('.',',');
  fecharModal();
  showToast('Recompensa "' + recompensaAtual.nome + '" resgatada! 🎉');
  recompensaAtual = null;
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
