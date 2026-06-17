function escapeHtml(valor) {
  return String(valor)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatarPerfil(perfil) {
  const perfilNormalizado = (perfil || 'operador').toString().toLowerCase();

  if (perfilNormalizado === 'admin' || perfilNormalizado === 'administrador') {
    return {
      texto: 'Administrador',
      classe: 'user-role-badge user-role-admin',
    };
  }

  return {
    texto: 'Operador',
    classe: 'user-role-badge',
  };
}

let usuariosCache = [];
let tiposDocumentoCache = [];
const SENHA_PADRAO_NOVO_USUARIO = 'senha123';

function mostrarFeedback(tipo, mensagem) {
  const feedback = document.getElementById('usuariosFeedback');
  if (!feedback) {
    return;
  }

  feedback.className = `alert alert-${tipo}`;
  feedback.textContent = mensagem;
  feedback.classList.remove('d-none');
}

function abrirModalUsuario() {
  const modalEl = document.getElementById('modalNovoUsuario');
  if (!modalEl || !window.bootstrap || !window.bootstrap.Modal) {
    return null;
  }

  return window.bootstrap.Modal.getOrCreateInstance(modalEl);
}

function abrirModalTipoDocumento() {
  const modalEl = document.getElementById('modalTipoDocumento');
  if (!modalEl || !window.bootstrap || !window.bootstrap.Modal) {
    return null;
  }

  return window.bootstrap.Modal.getOrCreateInstance(modalEl);
}

function limparErroFormularioUsuario() {
  const erro = document.getElementById('usuarioFormErro');
  if (!erro) {
    return;
  }

  erro.textContent = '';
  erro.classList.add('d-none');
}

function mostrarErroFormularioUsuario(mensagem) {
  const erro = document.getElementById('usuarioFormErro');
  if (!erro) {
    return;
  }

  erro.textContent = mensagem;
  erro.classList.remove('d-none');
}

function normalizarMensagemErroApi(payload, fallback) {
  if (!payload) {
    return fallback;
  }

  if (typeof payload.message === 'string') {
    return payload.message;
  }

  if (Array.isArray(payload.message) && payload.message.length > 0) {
    return payload.message.join(' | ');
  }

  return fallback;
}

function limparErroTipoDocumento() {
  const erroEl = document.getElementById('tipoDocumentoFormErro');
  if (!erroEl) {
    return;
  }

  erroEl.textContent = '';
  erroEl.classList.add('d-none');
}

function mostrarErroTipoDocumento(mensagem) {
  const erroEl = document.getElementById('tipoDocumentoFormErro');
  if (!erroEl) {
    return;
  }

  erroEl.textContent = mensagem;
  erroEl.classList.remove('d-none');
}

function resetFormularioTipoDocumento() {
  const idEl = document.getElementById('tipoDocumentoId');
  const nomeEl = document.getElementById('tipoDocumentoNome');
  const descricaoEl = document.getElementById('tipoDocumentoDescricao');
  const tituloEl = document.getElementById('tipoDocumentoModalTitulo');
  const salvarBtn = document.getElementById('tipoDocumentoSalvarBtn');
  const cancelarBtn = document.getElementById('tipoDocumentoCancelarBtn');

  if (
    !idEl ||
    !nomeEl ||
    !descricaoEl ||
    !tituloEl ||
    !salvarBtn ||
    !cancelarBtn
  ) {
    return;
  }

  idEl.value = '';
  nomeEl.value = '';
  descricaoEl.value = '';
  tituloEl.textContent = 'Novo Tipo de Documento';
  salvarBtn.textContent = 'Salvar';
  salvarBtn.classList.remove('btn-primary');
  salvarBtn.classList.add('btn-success');
  salvarBtn.title = 'Salvar tipo de documento';
  cancelarBtn.classList.add('d-none');
  limparErroTipoDocumento();
}

function prepararFormularioEditarTipoDocumento(idTipo) {
  const tipo = tiposDocumentoCache.find(
    (item) => Number(item.idTipo) === Number(idTipo),
  );

  if (!tipo) {
    mostrarErroTipoDocumento('Tipo de documento nao encontrado para edicao.');
    return;
  }

  const idEl = document.getElementById('tipoDocumentoId');
  const nomeEl = document.getElementById('tipoDocumentoNome');
  const descricaoEl = document.getElementById('tipoDocumentoDescricao');
  const tituloEl = document.getElementById('tipoDocumentoModalTitulo');
  const salvarBtn = document.getElementById('tipoDocumentoSalvarBtn');
  const cancelarBtn = document.getElementById('tipoDocumentoCancelarBtn');

  if (
    !idEl ||
    !nomeEl ||
    !descricaoEl ||
    !tituloEl ||
    !salvarBtn ||
    !cancelarBtn
  ) {
    return;
  }

  idEl.value = String(tipo.idTipo);
  nomeEl.value = tipo.nomeTipo || '';
  descricaoEl.value = tipo.descricao || '';
  tituloEl.textContent = `Editar Tipo #${tipo.idTipo}`;
  salvarBtn.textContent = 'Atualizar';
  salvarBtn.classList.remove('btn-success');
  salvarBtn.classList.add('btn-primary');
  salvarBtn.title = `Salvar alteracoes do tipo #${tipo.idTipo}`;
  cancelarBtn.classList.remove('d-none');
  limparErroTipoDocumento();

  const modal = abrirModalTipoDocumento();
  if (modal) {
    modal.show();
  }
}

function configurarToggleSenha() {
  const botoesToggle = document.querySelectorAll('button[data-target-input]');

  botoesToggle.forEach((botao) => {
    botao.addEventListener('click', () => {
      const inputId = botao.getAttribute('data-target-input');
      const input = inputId ? document.getElementById(inputId) : null;
      const icone = botao.querySelector('i');

      if (!input || !icone) {
        return;
      }

      const exibindoTexto = input.type === 'text';
      input.type = exibindoTexto ? 'password' : 'text';
      icone.classList.toggle('bi-eye', exibindoTexto);
      icone.classList.toggle('bi-eye-slash', !exibindoTexto);
    });
  });
}

function validarFormularioUsuario({
  nome,
  emailLocal,
  senha,
  confirmarSenha,
  perfil,
  edicao,
}) {
  if (!nome || nome.length < 3) {
    return 'Informe o nome completo com pelo menos 3 caracteres.';
  }

  if (!emailLocal || !/^[a-zA-Z0-9._-]+$/.test(emailLocal)) {
    return 'Informe um e-mail institucional valido (somente a parte antes de @sced.com).';
  }

  if (perfil !== 'admin' && perfil !== 'operador') {
    return 'Selecione um perfil valido.';
  }

  if (!edicao && senha.length < 6) {
    return 'A senha inicial deve ter no minimo 6 caracteres.';
  }

  if (edicao && senha && senha.length < 6) {
    return 'A nova senha deve ter no minimo 6 caracteres.';
  }

  if ((!edicao && !confirmarSenha) || (senha && senha !== confirmarSenha)) {
    return 'A confirmacao de senha nao confere.';
  }

  return '';
}

function extrairEmailLocal(emailCompleto) {
  const valor = (emailCompleto || '').toString().trim().toLowerCase();

  if (!valor) {
    return '';
  }

  if (valor.endsWith('@sced.com')) {
    return valor.slice(0, -'@sced.com'.length);
  }

  return valor.split('@')[0] || '';
}

function prepararFormularioNovoUsuario() {
  const titulo = document.getElementById('usuarioModalTitulo');
  const idEl = document.getElementById('usuarioId');
  const nomeEl = document.getElementById('usuarioNome');
  const emailLocalEl = document.getElementById('usuarioEmailLocal');
  const senhaEl = document.getElementById('usuarioSenha');
  const confirmarSenhaEl = document.getElementById('usuarioConfirmarSenha');
  const perfilEl = document.getElementById('usuarioPerfil');
  const senhaLabelEl = document.getElementById('usuarioSenhaLabel');
  const confirmarSenhaLabelEl = document.getElementById(
    'usuarioConfirmarSenhaLabel',
  );
  const senhaHintEl = document.getElementById('usuarioSenhaHint');

  if (
    !titulo ||
    !idEl ||
    !nomeEl ||
    !emailLocalEl ||
    !senhaEl ||
    !confirmarSenhaEl ||
    !perfilEl ||
    !senhaLabelEl ||
    !confirmarSenhaLabelEl ||
    !senhaHintEl
  ) {
    return;
  }

  titulo.textContent = 'Cadastrar Usuário';
  idEl.value = '';
  nomeEl.value = '';
  emailLocalEl.value = '';
  senhaEl.value = '';
  confirmarSenhaEl.value = '';
  senhaEl.value = SENHA_PADRAO_NOVO_USUARIO;
  confirmarSenhaEl.value = SENHA_PADRAO_NOVO_USUARIO;
  senhaEl.required = true;
  confirmarSenhaEl.required = true;
  senhaEl.disabled = true;
  confirmarSenhaEl.disabled = true;
  perfilEl.value = 'operador';
  senhaLabelEl.textContent = 'Senha Inicial (padrao)';
  confirmarSenhaLabelEl.textContent = 'Confirmar Senha';
  senhaHintEl.textContent = 'Senha padrao fixa para novos usuarios: senha123.';

  limparErroFormularioUsuario();
}

function prepararFormularioEditarUsuario(usuarioId) {
  const usuario = usuariosCache.find(
    (item) => Number(item.idUsuario) === Number(usuarioId),
  );
  if (!usuario) {
    mostrarFeedback('warning', 'Usuario nao encontrado para edicao.');
    return;
  }

  const titulo = document.getElementById('usuarioModalTitulo');
  const idEl = document.getElementById('usuarioId');
  const nomeEl = document.getElementById('usuarioNome');
  const emailLocalEl = document.getElementById('usuarioEmailLocal');
  const senhaEl = document.getElementById('usuarioSenha');
  const confirmarSenhaEl = document.getElementById('usuarioConfirmarSenha');
  const perfilEl = document.getElementById('usuarioPerfil');
  const senhaLabelEl = document.getElementById('usuarioSenhaLabel');
  const confirmarSenhaLabelEl = document.getElementById(
    'usuarioConfirmarSenhaLabel',
  );
  const senhaHintEl = document.getElementById('usuarioSenhaHint');

  if (
    !titulo ||
    !idEl ||
    !nomeEl ||
    !emailLocalEl ||
    !senhaEl ||
    !confirmarSenhaEl ||
    !perfilEl ||
    !senhaLabelEl ||
    !confirmarSenhaLabelEl ||
    !senhaHintEl
  ) {
    return;
  }

  titulo.textContent = `Editar Usuario #${usuario.idUsuario}`;
  idEl.value = String(usuario.idUsuario);
  nomeEl.value = usuario.nome || '';
  emailLocalEl.value = extrairEmailLocal(usuario.email);
  senhaEl.value = '';
  confirmarSenhaEl.value = '';
  senhaEl.required = false;
  confirmarSenhaEl.required = false;
  senhaEl.disabled = false;
  confirmarSenhaEl.disabled = false;
  perfilEl.value = (usuario.perfil || 'operador').toLowerCase();
  senhaLabelEl.textContent = 'Nova Senha';
  confirmarSenhaLabelEl.textContent = 'Confirmar Nova Senha';
  senhaHintEl.textContent =
    'Opcional. Preencha apenas se desejar alterar a senha.';

  limparErroFormularioUsuario();
}

async function carregarUsuariosTabela() {
  const tableBody = document.getElementById('usuariosTableBody');
  if (!tableBody) {
    return;
  }

  try {
    const response = await fetch('/usuarios');
    if (!response.ok) {
      throw new Error('Falha ao carregar usuarios');
    }

    const usuarios = await response.json();
    usuariosCache = Array.isArray(usuarios) ? usuarios : [];

    if (usuariosCache.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center py-4 text-muted">Nenhum usuario cadastrado.</td>
        </tr>
      `;
      return;
    }

    const linhas = usuariosCache
      .map((usuario) => {
        const nome = escapeHtml(usuario.nome || '-');
        const email = escapeHtml(usuario.email || '-');
        const perfilInfo = formatarPerfil(usuario.perfil);
        const idUsuario = Number(usuario.idUsuario);

        return `
          <tr>
            <td class="ps-3 fw-bold">${nome}</td>
            <td>${email}</td>
            <td class="perfil-coluna">
              <span class="${perfilInfo.classe}">${perfilInfo.texto}</span>
            </td>
            <td class="text-center">
              <button
                class="btn btn-sm btn-outline-primary"
                title="Editar usuario"
                data-action="editar-usuario"
                data-usuario-id="${idUsuario}"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                title="Remover usuario"
                data-action="excluir-usuario"
                data-usuario-id="${idUsuario}"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        `;
      })
      .join('');

    tableBody.innerHTML = linhas;
  } catch {
    usuariosCache = [];
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center py-4 text-muted">Nao foi possivel carregar os usuarios.</td>
      </tr>
    `;
  }
}

async function salvarUsuario(event) {
  event.preventDefault();

  const idEl = document.getElementById('usuarioId');
  const nomeEl = document.getElementById('usuarioNome');
  const emailLocalEl = document.getElementById('usuarioEmailLocal');
  const senhaEl = document.getElementById('usuarioSenha');
  const confirmarSenhaEl = document.getElementById('usuarioConfirmarSenha');
  const perfilEl = document.getElementById('usuarioPerfil');
  const salvarBtn = document.getElementById('usuarioSalvarBtn');

  if (
    !idEl ||
    !nomeEl ||
    !emailLocalEl ||
    !senhaEl ||
    !confirmarSenhaEl ||
    !perfilEl ||
    !salvarBtn
  ) {
    return;
  }

  const idUsuario = idEl.value.trim();
  const emEdicao = Boolean(idUsuario);
  const nome = nomeEl.value.trim();
  const emailLocal = emailLocalEl.value.trim().toLowerCase();
  const email = `${emailLocal}@sced.com`;
  const senha = emEdicao ? senhaEl.value.trim() : SENHA_PADRAO_NOVO_USUARIO;
  const confirmarSenha = emEdicao
    ? confirmarSenhaEl.value.trim()
    : SENHA_PADRAO_NOVO_USUARIO;
  const perfil = perfilEl.value;

  const erroValidacao = validarFormularioUsuario({
    nome,
    emailLocal,
    senha,
    confirmarSenha,
    perfil,
    edicao: emEdicao,
  });

  if (erroValidacao) {
    mostrarErroFormularioUsuario(erroValidacao);
    return;
  }

  const payload = {
    nome,
    email,
    perfil,
  };

  if (senha) {
    payload.senha = senha;
  }

  limparErroFormularioUsuario();
  salvarBtn.disabled = true;
  salvarBtn.textContent = 'Salvando...';

  try {
    const metodo = idUsuario ? 'PATCH' : 'POST';
    const url = idUsuario ? `/usuarios/${idUsuario}` : '/usuarios';

    const response = await fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const erroApi = await response.json().catch(() => null);
      throw new Error(
        normalizarMensagemErroApi(
          erroApi,
          'Nao foi possivel salvar o usuario.',
        ),
      );
    }

    const modal = abrirModalUsuario();
    if (modal) {
      modal.hide();
    }

    await carregarUsuariosTabela();
    mostrarFeedback(
      'success',
      idUsuario
        ? 'Usuario atualizado com sucesso.'
        : 'Usuario cadastrado com sucesso.',
    );
  } catch (error) {
    mostrarErroFormularioUsuario(error.message || 'Falha ao salvar usuario.');
  } finally {
    salvarBtn.disabled = false;
    salvarBtn.textContent = 'Salvar';
  }
}

async function excluirUsuario(usuarioId) {
  const usuario = usuariosCache.find(
    (item) => Number(item.idUsuario) === Number(usuarioId),
  );
  const nomeUsuario = usuario ? usuario.nome : `#${usuarioId}`;

  const confirmar = window.confirm(
    `Deseja realmente excluir o usuario ${nomeUsuario}?`,
  );
  if (!confirmar) {
    return;
  }

  try {
    const response = await fetch(`/usuarios/${usuarioId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Nao foi possivel excluir o usuario.');
    }

    await carregarUsuariosTabela();
    mostrarFeedback('success', 'Usuario excluido com sucesso.');
  } catch {
    mostrarFeedback('danger', 'Falha ao excluir usuario.');
  }
}

async function carregarTiposDocumentoLista() {
  const listaEl = document.getElementById('tiposDocumentoLista');
  if (!listaEl) {
    return;
  }

  try {
    const response = await fetch('/tipos-documento');
    if (!response.ok) {
      throw new Error('Falha ao carregar tipos de documento');
    }

    const tipos = await response.json();
    tiposDocumentoCache = Array.isArray(tipos) ? tipos : [];

    if (tiposDocumentoCache.length === 0) {
      listaEl.innerHTML =
        '<li class="list-group-item text-muted">Nenhum tipo de documento cadastrado.</li>';
      return;
    }

    const linhas = tiposDocumentoCache
      .map((tipo) => {
        const nomeTipo = escapeHtml(tipo.nomeTipo || 'Sem nome');
        const descricao = escapeHtml(tipo.descricao || 'Sem descrição');
        const idTipo = escapeHtml(tipo.idTipo || '-');

        return `
          <li class="list-group-item d-flex justify-content-between align-items-start gap-2">
            <div class="me-2">
              <div class="fw-semibold">${nomeTipo}</div>
              <small class="text-muted">${descricao}</small>
            </div>
            <div class="d-flex align-items-center gap-2">
              <span class="badge bg-light text-muted">ID: ${idTipo}</span>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary"
                title="Editar tipo de documento"
                data-action="editar-tipo"
                data-tipo-id="${idTipo}"
              >
                <i class="bi bi-pencil"></i>
              </button>
            </div>
          </li>
        `;
      })
      .join('');

    listaEl.innerHTML = linhas;
  } catch {
    tiposDocumentoCache = [];
    listaEl.innerHTML =
      '<li class="list-group-item text-muted">Nao foi possivel carregar os tipos de documento.</li>';
  }
}

async function salvarTipoDocumento(event) {
  event.preventDefault();

  const nomeEl = document.getElementById('tipoDocumentoNome');
  const idEl = document.getElementById('tipoDocumentoId');
  const descricaoEl = document.getElementById('tipoDocumentoDescricao');
  const salvarBtn = document.getElementById('tipoDocumentoSalvarBtn');

  if (!nomeEl || !idEl || !descricaoEl || !salvarBtn) {
    return;
  }

  const idTipo = idEl.value.trim();
  const nomeTipo = nomeEl.value.trim();
  const descricao = descricaoEl.value.trim();

  if (nomeTipo.length < 2) {
    mostrarErroTipoDocumento(
      'Informe o nome do tipo com pelo menos 2 caracteres.',
    );
    return;
  }

  if (descricao.length > 255) {
    mostrarErroTipoDocumento('A descricao deve ter no maximo 255 caracteres.');
    return;
  }

  limparErroTipoDocumento();
  salvarBtn.disabled = true;

  try {
    const metodo = idTipo ? 'PATCH' : 'POST';
    const url = idTipo ? `/tipos-documento/${idTipo}` : '/tipos-documento';

    const response = await fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nomeTipo,
        descricao: descricao || undefined,
      }),
    });

    if (!response.ok) {
      const erroApi = await response.json().catch(() => null);
      throw new Error(
        normalizarMensagemErroApi(
          erroApi,
          'Nao foi possivel cadastrar o tipo de documento.',
        ),
      );
    }

    resetFormularioTipoDocumento();
    const modal = abrirModalTipoDocumento();
    if (modal) {
      modal.hide();
    }
    await carregarTiposDocumentoLista();
    mostrarFeedback(
      'success',
      idTipo
        ? 'Tipo de documento atualizado com sucesso.'
        : 'Tipo de documento cadastrado com sucesso.',
    );
  } catch (error) {
    mostrarErroTipoDocumento(
      error.message || 'Falha ao cadastrar tipo de documento.',
    );
  } finally {
    salvarBtn.disabled = false;
  }
}

function configurarAcoesTiposDocumento() {
  const listaEl = document.getElementById('tiposDocumentoLista');
  if (!listaEl) {
    return;
  }

  listaEl.addEventListener('click', (event) => {
    const botao = event.target.closest('button[data-action="editar-tipo"]');
    if (!botao) {
      return;
    }

    const idTipo = Number(botao.getAttribute('data-tipo-id'));
    if (!idTipo) {
      return;
    }

    prepararFormularioEditarTipoDocumento(idTipo);
  });
}

function configurarAcoesUsuarios() {
  const tableBody = document.getElementById('usuariosTableBody');
  if (!tableBody) {
    return;
  }

  tableBody.addEventListener('click', async (event) => {
    const botao = event.target.closest('button[data-action]');
    if (!botao) {
      return;
    }

    const usuarioId = Number(botao.getAttribute('data-usuario-id'));
    if (!usuarioId) {
      return;
    }

    const acao = botao.getAttribute('data-action');
    if (acao === 'editar-usuario') {
      prepararFormularioEditarUsuario(usuarioId);
      const modal = abrirModalUsuario();
      if (modal) {
        modal.show();
      }
      return;
    }

    if (acao === 'excluir-usuario') {
      await excluirUsuario(usuarioId);
    }
  });
}

const usuarioForm = document.getElementById('usuarioForm');
if (usuarioForm) {
  usuarioForm.addEventListener('submit', salvarUsuario);
}

const novoUsuarioBtn = document.getElementById('novoUsuarioBtn');
if (novoUsuarioBtn) {
  novoUsuarioBtn.addEventListener('click', prepararFormularioNovoUsuario);
}

const tipoDocumentoForm = document.getElementById('tipoDocumentoForm');
if (tipoDocumentoForm) {
  tipoDocumentoForm.addEventListener('submit', salvarTipoDocumento);
}

const tipoDocumentoCancelarBtn = document.getElementById(
  'tipoDocumentoCancelarBtn',
);
if (tipoDocumentoCancelarBtn) {
  tipoDocumentoCancelarBtn.addEventListener('click', () => {
    resetFormularioTipoDocumento();
    const modal = abrirModalTipoDocumento();
    if (modal) {
      modal.hide();
    }
  });
}

const tipoDocumentoNovoBtn = document.getElementById('tipoDocumentoNovoBtn');
if (tipoDocumentoNovoBtn) {
  tipoDocumentoNovoBtn.addEventListener('click', () => {
    resetFormularioTipoDocumento();
    const modal = abrirModalTipoDocumento();
    if (modal) {
      modal.show();
    }
  });
}

void carregarUsuariosTabela();
void carregarTiposDocumentoLista();
configurarAcoesUsuarios();
configurarAcoesTiposDocumento();
configurarToggleSenha();
resetFormularioTipoDocumento();
