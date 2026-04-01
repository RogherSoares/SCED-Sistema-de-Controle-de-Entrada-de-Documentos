(function () {
  function safeJsonParse(value) {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  function normalizePerfil(perfil) {
    const valor = (perfil || 'operador').toString().trim().toLowerCase();
    if (valor === 'administrador') {
      return 'admin';
    }
    return valor || 'operador';
  }

  function normalizeAuthPayload(payload) {
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const usuario =
      payload.usuario && typeof payload.usuario === 'object'
        ? payload.usuario
        : payload;

    const idUsuario = Number(usuario.idUsuario || 0);
    if (!idUsuario) {
      return null;
    }

    return {
      idUsuario,
      nome: (usuario.nome || '').toString(),
      email: (usuario.email || '').toString(),
      perfil: normalizePerfil(usuario.perfil),
      accessToken: (
        payload.accessToken ||
        usuario.accessToken ||
        ''
      ).toString(),
      tokenType: (payload.tokenType || 'Bearer').toString(),
    };
  }

  function getCurrentUser() {
    const raw = sessionStorage.getItem('scedUser');
    if (!raw) {
      return null;
    }

    const parsed = safeJsonParse(raw);
    const normalized = normalizeAuthPayload(parsed);

    if (!normalized) {
      sessionStorage.removeItem('scedUser');
      return null;
    }

    if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
      sessionStorage.setItem('scedUser', JSON.stringify(normalized));
    }

    return normalized;
  }

  function setCurrentUser(payload) {
    const normalized = normalizeAuthPayload(payload);
    if (!normalized) {
      throw new Error('Resposta de autenticacao invalida.');
    }

    sessionStorage.setItem('scedUser', JSON.stringify(normalized));
    return normalized;
  }

  function clearSession() {
    sessionStorage.removeItem('scedUser');
  }

  function getToken() {
    const user = getCurrentUser();
    return user && user.accessToken ? user.accessToken : '';
  }

  function isSameOrigin(input) {
    const urlValue =
      typeof input === 'string' ? input : (input && input.url) || '';
    if (!urlValue || urlValue.startsWith('/')) {
      return true;
    }

    try {
      const url = new URL(urlValue, window.location.origin);
      return url.origin === window.location.origin;
    } catch {
      return true;
    }
  }

  function isLoginRequest(input) {
    const urlValue =
      typeof input === 'string' ? input : (input && input.url) || '';
    return urlValue.includes('/usuarios/login');
  }

  const nativeFetch = window.fetch.bind(window);

  window.fetch = async function (input, init) {
    const options = init ? { ...init } : {};
    const headers = new Headers(options.headers || {});

    const token = getToken();
    if (token && isSameOrigin(input) && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    options.headers = headers;

    const response = await nativeFetch(input, options);

    if (response.status === 401 && !isLoginRequest(input)) {
      clearSession();
      if (!window.location.pathname.endsWith('/login.html')) {
        window.location.href = 'login.html';
      }
    }

    return response;
  };

  window.scedAuth = {
    getCurrentUser,
    setCurrentUser,
    clearSession,
    getToken,
  };
})();
