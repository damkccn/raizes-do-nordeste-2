function fmt(v) { return 'R$ ' + v.toFixed(2).replace('.',','); }

function carregarResumo() {
  const raw = localStorage.getItem('pedido');
  const itens = raw ? JSON.parse(raw) : [];
  const container = document.getElementById('resumo-itens');
  if (!itens.length) { container.innerHTML = '<p>Vazio</p>'; document.getElementById('btn-pagar').disabled = true; return; }
  
  let total = 0;
  container.innerHTML = itens.map(i => { 
    total += (i.preco * i.qty); 
    return `<div class="order-item"><span>${i.emoji} ${i.nome} × ${i.qty}</span><span class="order-item-price">${fmt(i.preco * i.qty)}</span></div>`; 
  }).join('');
  
  document.getElementById('resumo-total').textContent = fmt(total);
  document.getElementById('pontos-ganhar').textContent = Math.floor(total) + ' pontos';

  // Gerenciamento adaptativo da interface de logística
  const un = localStorage.getItem('unidadeSelecionada') || 'recreio';
  const cardLogistica = document.getElementById('card-logistica-entrega');
  const txtRetirada = document.getElementById('texto-logistica-retirada');
  const formDelivery = document.getElementById('formulario-endereco-delivery');

  if (un === 'campo-grande') {
    cardLogistica.querySelector('.card-title').textContent = 'Endereço de Entrega 🛵';
    txtRetirada.style.display = 'none'; 
    formDelivery.style.display = 'flex';
  } else {
    cardLogistica.querySelector('.card-title').textContent = 'Forma de Entrega: Retirada';
    formDelivery.style.display = 'none'; 
    txtRetirada.style.display = 'block';
    
    const mapas = {
      'recreio': '📍 <strong>Unidade Recreio — RJ</strong><br>Av. Lúcio Costa, 12000<br><br>⏱ Preparo: 15–20 min<br>🏷 Retire no balcão / totem.',
      'centro': '📍 <strong>Unidade Centro — RJ</strong><br>Av. Rio Branco, 500<br><br>⏱ Preparo: 5–10 min<br>🏷 Retire no balcão / totem.'
    };
    txtRetirada.innerHTML = mapas[un];
  }
}

function selecionarMetodo(m) {
  document.querySelectorAll('.method-opt').forEach(el => el.classList.remove('selected'));
  document.getElementById('opt-' + m).classList.add('selected');
  document.getElementById('campos-cartao').classList.toggle('visible', m !== 'pix');
  document.getElementById('pix-info').style.display = m === 'pix' ? 'block' : 'none';
}

function mascaraCartao(el) { let v = el.value.replace(/\D/g,'').substring(0,16); el.value = v.replace(/(.{4})/g,'$1 ').trim(); }
function mascaraValidade(el) { let v = el.value.replace(/\D/g,'').substring(0,4); if (v.length > 2) v = v.slice(0,2) + '/' + v.slice(2); el.value = v; }

function iniciarPagamento() {
  const un = localStorage.getItem('unidadeSelecionada') || 'recreio';
  let strEndereco = 'Retirada em Loja';

  if (un === 'campo-grande') {
    const r = document.getElementById('deliv-rua').value.trim();
    const n = document.getElementById('deliv-num').value.trim();
    const b = document.getElementById('deliv-bairro').value.trim();
    if (!r || !n || !b) { alert('Atenção: Os campos Rua, Número e Bairro são obrigatórios para realizarmos o envio residencial.'); return; }
    strEndereco = `${r}, nº ${n} - ${b}`;
  }

  document.getElementById('processing').classList.add('show');
  
  setTimeout(() => {
    const finalizado = {
      itens: JSON.parse(localStorage.getItem('pedido') || '[]'),
      codigo: 'RN' + Math.floor(10000 + Math.random() * 90000),
      hora: new Date().toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'}),
      enderecoEntrega: strEndereco
    };
    localStorage.setItem('pedidoConfirmado', JSON.stringify(finalizado));
    window.location.href = 'confirmacao.html';
  }, 2500);
}

// Inicializa o resumo ao rodar o arquivo externo
carregarResumo();
