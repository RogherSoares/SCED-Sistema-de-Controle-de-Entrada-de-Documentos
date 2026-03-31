const usuarioSession = sessionStorage.getItem('scedUser');
let usuario = null;

if (!usuarioSession) {
  window.location.href = 'login.html';
} else {
  usuario = JSON.parse(usuarioSession);
}

const operatorName = document.getElementById('operatorName');
const operatorPerfil = document.getElementById('operatorPerfil');
const perfil = ((usuario && usuario.perfil) || 'operador').toString();
const perfilNormalizado = perfil.toLowerCase();
const isAdmin =
  perfilNormalizado === 'admin' || perfilNormalizado === 'administrador';

document.querySelectorAll('a[href="usuarios.html"]').forEach((link) => {
  if (!isAdmin) {
    const navItem = link.closest('.nav-item');
    if (navItem) {
      navItem.style.display = 'none';
    }
  }
});

const paginaAtual = window.location.pathname.split('/').pop();
if (paginaAtual === 'usuarios.html' && !isAdmin) {
  window.location.href = 'index.html';
}

if (operatorName && usuario) {
  operatorName.textContent = usuario.nome || 'Operador';
}

if (operatorPerfil && usuario) {
  operatorPerfil.textContent = perfil;

  if (isAdmin) {
    operatorPerfil.classList.add('operator-badge-admin');
  } else {
    operatorPerfil.classList.remove('operator-badge-admin');
  }
}

const logoutLink = document.getElementById('logoutLink');
if (logoutLink) {
  logoutLink.addEventListener('click', () => {
    sessionStorage.removeItem('scedUser');
  });
}
