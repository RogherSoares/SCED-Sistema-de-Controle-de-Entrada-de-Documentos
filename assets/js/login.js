const loginForm = document.getElementById('loginForm');
const loginAlert = document.getElementById('loginAlert');
const loginButton = document.getElementById('loginButton');

const usuarioLogado = sessionStorage.getItem('scedUser');
if (usuarioLogado) {
  window.location.href = 'index.html';
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  loginAlert.classList.add('d-none');
  loginButton.disabled = true;
  loginButton.textContent = 'Validando...';

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('password').value;

  try {
    const response = await fetch('/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });

    if (!response.ok) {
      throw new Error('Email ou senha invalidos.');
    }

    const usuario = await response.json();
    sessionStorage.setItem('scedUser', JSON.stringify(usuario));
    window.location.href = 'index.html';
  } catch (error) {
    loginAlert.textContent =
      error.message || 'Nao foi possivel realizar o login.';
    loginAlert.classList.remove('d-none');
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = 'Acessar Sistema';
  }
});
