let pontos = 342;
let recompensaAtual = null;

const listaLojas = {
  'recreio': 'Recreio',
  'centro': 'Centro',
  'campo-grande': 'Campo Grande'
};

const filial = localStorage.getItem('unidadeSelecionada') || 'recreio';
const nomeLoja = listaLojas[filial];

const dadosPedido = localStorage.getItem('pedidoConfirmado');
if (dadosPedido) {
  const p = JSON.parse(dadosPedido);
  const itens = p.itens || [];
  const total = itens.reduce((s, i) => s + i.preco * i.qty, 0);
  const novosPontos = Math.floor(total);
  pontos += novosPontos;

  const campoDesc = document.querySelector('#historico-lista .historico-item:first-child .hist-desc');
  if (campoDesc && p.codigo) {
    campoDesc.textContent = `Pedido ${p.codigo} — ${nomeLoja}`;
    document.querySelector('#historico-lista .historico-item:first-child .hist-pts').textContent = `+${novosPontos} pts`;
  }
}

document.getElementById('saldo-pontos').textContent = pontos;
document.getElementById('saldo-reais').textContent = 'R$ ' + (pontos * 0.01).toFixed(2).replace('.',',');

const meta = 500;
const pct = Math.min(Math.round((pontos / meta) * 100), 100);
const falta = Math.max(meta - pontos, 0);
document.getElementById('prog-pct').textContent = pct + '%';
document.getElementById('prog-falta').textContent = falta + ' pontos';
document.getElementById('pts-proximo').textContent = falta > 0 ? falta + ' pts para Ouro' : 'Ouro atingido';
setTimeout(() => { document.getElementById('prog-fill').style.width = pct + '%'; }, 200);

function abrirModal(nome, custo) {
  if (pontos < custo) { showToast('Pontos insuficientes para este resgate.'); return; }
  recompensaAtual = { nome, custo };
  document.getElementById('modal-titulo').textContent = 'Resgatar: ' + nome;
  document.getElementById('modal-desc').textContent = 'Serão descontados ' + custo + ' pontos (' + pontos + ' disponíveis).';
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
  showToast('Resgatado com sucesso');
  recompensaAtual = null;
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
