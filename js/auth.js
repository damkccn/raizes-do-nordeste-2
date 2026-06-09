function switchTab(tab) {
  const isLogin = tab === 'login';
  document.getElementById('form-login').style.display = isLogin ? 'block' : 'none';
  document.getElementById('form-cadastro').style.display = isLogin ? 'none' : 'block';
  document.getElementById('tab-login').classList.toggle('active', isLogin);
  document.getElementById('tab-cadastro').classList.toggle('active', !isLogin);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

function submitLogin(e) {
  e.preventDefault();
  const emailEl = document.getElementById('login-email');
  const senhaEl = document.getElementById('login-senha');
  const unidadSel = document.getElementById('select-unidade-login').value;
  let ok = true;

  emailEl.classList.toggle('error', !validateEmail(emailEl.value)); if (!validateEmail(emailEl.value)) ok = false;
  senhaEl.classList.toggle('error', senhaEl.value.length < 6); if (senhaEl.value.length < 6) ok = false;

  if (ok) {
    const dbUser = localStorage.getItem(`user_${emailEl.value.trim().toLowerCase()}`);
    if (!dbUser) {
      alert('Este e-mail ainda não está registrado! Por favor, vá na aba "Criar conta" primeiro e aceite a LGPD.');
      switchTab('cadastro');
      return;
    }

    const dUsuario = JSON.parse(dbUser);
    if(!dUsuario.aceitouLGPD) { alert('Erro cadastral referente aos termos de privacidade.'); return; }

    localStorage.setItem('unidadeSelecionada', unidadSel);
    localStorage.setItem('usuarioLogado', JSON.stringify(dUsuario));
    showToast('Login realizado com sucesso! Redirecionando…');
    setTimeout(() => window.location.href = 'cardapio.html', 1800);
  }
}

function submitCadastro(e) {
  e.preventDefault();
  const nomeEl  = document.getElementById('cad-nome');
  const emailEl = document.getElementById('cad-email');
  const senhaEl = document.getElementById('cad-senha');
  const lgpd    = document.getElementById('lgpd-consent');
  const unidadSel = document.getElementById('select-unidade-cad').value;
  let ok = true;

  nomeEl.classList.toggle('error', nomeEl.value.trim().length < 2);
  emailEl.classList.toggle('error', !validateEmail(emailEl.value));
  senhaEl.classList.toggle('error', senhaEl.value.length < 6);
  if (nomeEl.value.trim().length < 2 || !validateEmail(emailEl.value) || senhaEl.value.length < 6) ok = false;

  if (!lgpd.checked) { alert('Você precisa obrigatoriamente aceitar as diretrizes da LGPD para prosseguir.'); ok = false; return; }

  if (ok) {
    const conta = {
      nome: nomeEl.value.trim(),
      email: emailEl.value.trim().toLowerCase(),
      aceitouLGPD: true,
      data: new Date().toLocaleDateString('pt-BR')
    };
    localStorage.setItem(`user_${conta.email}`, JSON.stringify(conta));
    localStorage.setItem('unidadeSelecionada', unidadSel);
    localStorage.setItem('usuarioLogado', JSON.stringify(conta));

    showToast('Conta criada com sucesso!');
    setTimeout(() => window.location.href = 'cardapio.html', 1800);
  }
}
