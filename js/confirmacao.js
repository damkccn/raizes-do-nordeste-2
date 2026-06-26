const unAtiva = localStorage.getItem('unidadeSelecionada') || 'recreio';

function fmt(v) { return 'R$ ' + v.toFixed(2).replace('.',','); }

function carregarConfirmacao() {
  const raw = localStorage.getItem('pedidoConfirmado');
  if (!raw) return;
  const p = JSON.parse(raw);
  document.getElementById('codigo-pedido').textContent = p.codigo;
  document.getElementById('hora-pedido').textContent = p.hora;

  let total = 0;
  document.getElementById('itens-lista').innerHTML = p.itens.map(i => {
    total += (i.preco * i.qty);
    return `<div class="item-row"><span>${i.emoji} ${i.nome} × ${i.qty}</span><span>${fmt(i.preco * i.qty)}</span></div>`;
  }).join('');
  
  document.getElementById('total-pago').textContent = fmt(total);
  document.getElementById('pontos-valor').textContent = Math.floor(total);

  const localizacaoCard = document.querySelector('.unidade-card');
  
  if(unAtiva === 'campo-grande') {
    document.getElementById('instrucao-retirada-dinamica').textContent = "Rota de entrega iniciada";
    document.getElementById('nome-status-pronto').textContent = "Saiu para entrega";
    document.getElementById('sub-status-pronto').textContent = "O motoqueiro está a caminho";
    document.getElementById('dot-pronto').textContent = "🛵";
    document.getElementById('nome-status-final').textContent = "Entregue";

    localizacaoCard.innerHTML = `
      <h3>🛵 Destino de Envio</h3>
      <p style="margin-top:0.5rem; font-size:0.9rem; color:var(--text-muted); line-height:1.5;">
        <strong>Endereço:</strong> ${p.enderecoEntrega || 'Não capturado'}<br>
        <strong>Origem:</strong> Hub Campo Grande
      </p>
    `;
  } else {
    document.getElementById('instrucao-retirada-dinamica').textContent = "Mostre o código no balcão";
    const mapas = {
      'recreio': '📍 <strong>Unidade Recreio — RJ</strong><br>Av. Lúcio Costa, 12000 · Rio de Janeiro/RJ<br>⏱ Retirada balcão / Totem.',
      'centro': '📍 <strong>Unidade Centro — RJ</strong><br>Av. Rio Branco, 500 · Rio de Janeiro/RJ<br>⏱ Retirada balcão / Totem.'
    };
    localizacaoCard.innerHTML = mapas[unAtiva];
  }
}

function simularStatus() {
  setTimeout(() => {
    document.getElementById('st-preparo').classList.remove('active');
    document.getElementById('st-preparo').classList.add('done');
    document.getElementById('st-preparo').querySelector('.status-dot').textContent = '✓';
    document.getElementById('st-pronto').classList.add('active');
  }, 5000);

  setTimeout(() => {
    document.getElementById('st-pronto').classList.remove('active');
    document.getElementById('st-pronto').classList.add('done');
    document.getElementById('st-pronto').querySelector('.status-dot').textContent = '✓';
    document.getElementById('st-retirado').classList.add('active');
  }, 12000);
}

carregarConfirmacao();
simularStatus();
