const usuario =
  window.scedAuth && window.scedAuth.getCurrentUser
    ? window.scedAuth.getCurrentUser()
    : null;

if (!usuario) {
  window.location.href = 'login.html';
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
    if (window.scedAuth && window.scedAuth.clearSession) {
      window.scedAuth.clearSession();
      return;
    }

    sessionStorage.removeItem('scedUser');
  });
}

function criarModalAlterarSenha() {
  if (document.getElementById('modalAlterarSenhaOperador')) {
    return;
  }

  const modalHtml = `
    <div class="modal fade" id="modalAlterarSenhaOperador" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form id="alterarSenhaOperadorForm">
            <div class="modal-header">
              <h5 class="modal-title fw-bold">Alterar Senha</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="novaSenhaOperador" class="form-label">Nova senha</label>
                <input type="password" id="novaSenhaOperador" class="form-control" minlength="6" required />
              </div>
              <div>
                <label for="confirmarSenhaOperador" class="form-label">Confirmar nova senha</label>
                <input type="password" id="confirmarSenhaOperador" class="form-control" minlength="6" required />
              </div>
              <div id="alterarSenhaOperadorErro" class="text-danger small mt-2 d-none"></div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-primary" id="alterarSenhaOperadorSalvarBtn">Salvar senha</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function configurarMenuOperador() {
  const operadorCard = document.querySelector('.operator-card');
  if (!operadorCard || !usuario || !usuario.idUsuario) {
    return;
  }

  criarModalAlterarSenha();

  let menuEl = document.getElementById('menuOperadorAcoes');
  if (!menuEl) {
    menuEl = document.createElement('div');
    menuEl.id = 'menuOperadorAcoes';
    menuEl.className = 'card shadow-sm d-none';
    menuEl.style.position = 'absolute';
    menuEl.style.zIndex = '1060';
    menuEl.style.minWidth = '180px';
    menuEl.innerHTML = `
      <div class="list-group list-group-flush">
        <button type="button" class="list-group-item list-group-item-action" id="menuOperadorAlterarSenhaBtn">
          <i class="bi bi-key me-2"></i>Alterar senha
        </button>
      </div>
    `;
    document.body.appendChild(menuEl);
  }

  const toggleMenu = () => {
    const rect = operadorCard.getBoundingClientRect();
    menuEl.style.top = `${rect.bottom + window.scrollY + 6}px`;
    menuEl.style.left = `${rect.right + window.scrollX - 180}px`;
    menuEl.classList.toggle('d-none');
  };

  const fecharMenu = () => menuEl.classList.add('d-none');

  operadorCard.style.cursor = 'pointer';
  operadorCard.title = 'Clique para abrir menu do operador';
  operadorCard.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMenu();
  });

  document.addEventListener('click', (event) => {
    if (
      !menuEl.contains(event.target) &&
      !operadorCard.contains(event.target)
    ) {
      fecharMenu();
    }
  });

  const menuAlterarSenhaBtn = document.getElementById(
    'menuOperadorAlterarSenhaBtn',
  );
  if (menuAlterarSenhaBtn) {
    menuAlterarSenhaBtn.addEventListener('click', () => {
      fecharMenu();
      const modalEl = document.getElementById('modalAlterarSenhaOperador');
      const erroEl = document.getElementById('alterarSenhaOperadorErro');
      const novaSenhaEl = document.getElementById('novaSenhaOperador');
      const confirmarSenhaEl = document.getElementById(
        'confirmarSenhaOperador',
      );

      if (erroEl) {
        erroEl.textContent = '';
        erroEl.classList.add('d-none');
      }
      if (novaSenhaEl) {
        novaSenhaEl.value = '';
      }
      if (confirmarSenhaEl) {
        confirmarSenhaEl.value = '';
      }

      const modal =
        modalEl && window.bootstrap && window.bootstrap.Modal
          ? window.bootstrap.Modal.getOrCreateInstance(modalEl)
          : null;
      if (modal) {
        modal.show();
      }
    });
  }

  const alterarSenhaForm = document.getElementById('alterarSenhaOperadorForm');
  if (alterarSenhaForm) {
    alterarSenhaForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const novaSenhaEl = document.getElementById('novaSenhaOperador');
      const confirmarSenhaEl = document.getElementById(
        'confirmarSenhaOperador',
      );
      const erroEl = document.getElementById('alterarSenhaOperadorErro');
      const salvarBtn = document.getElementById(
        'alterarSenhaOperadorSalvarBtn',
      );

      if (!novaSenhaEl || !confirmarSenhaEl || !erroEl || !salvarBtn) {
        return;
      }

      const novaSenha = novaSenhaEl.value.trim();
      const confirmarSenha = confirmarSenhaEl.value.trim();

      if (novaSenha.length < 6) {
        erroEl.textContent = 'A senha deve ter no minimo 6 caracteres.';
        erroEl.classList.remove('d-none');
        return;
      }

      if (novaSenha !== confirmarSenha) {
        erroEl.textContent = 'As senhas nao conferem.';
        erroEl.classList.remove('d-none');
        return;
      }

      erroEl.textContent = '';
      erroEl.classList.add('d-none');
      salvarBtn.disabled = true;
      salvarBtn.textContent = 'Salvando...';

      try {
        const response = await fetch(`/usuarios/${usuario.idUsuario}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ senha: novaSenha }),
        });

        if (!response.ok) {
          throw new Error('Nao foi possivel atualizar a senha.');
        }

        const modalEl = document.getElementById('modalAlterarSenhaOperador');
        const modal =
          modalEl && window.bootstrap && window.bootstrap.Modal
            ? window.bootstrap.Modal.getOrCreateInstance(modalEl)
            : null;
        if (modal) {
          modal.hide();
        }

        window.alert('Senha alterada com sucesso.');
      } catch {
        erroEl.textContent = 'Falha ao alterar senha. Tente novamente.';
        erroEl.classList.remove('d-none');
      } finally {
        salvarBtn.disabled = false;
        salvarBtn.textContent = 'Salvar senha';
      }
    });
  }
}

configurarMenuOperador();

async function carregarMetricasDashboard() {
  const metricTotalRecebidos = document.getElementById('metricTotalRecebidos');
  const metricEmAnalise = document.getElementById('metricEmAnalise');
  const metricEncaminhados = document.getElementById('metricEncaminhados');
  const metricFinalizados = document.getElementById('metricFinalizados');

  if (
    !metricTotalRecebidos ||
    !metricEmAnalise ||
    !metricEncaminhados ||
    !metricFinalizados
  ) {
    return;
  }

  try {
    const response = await fetch('/documentos/metrics/dashboard');
    if (!response.ok) {
      throw new Error('Falha ao carregar metricas');
    }

    const metrics = await response.json();

    metricTotalRecebidos.textContent = String(metrics.totalRecebidos ?? 0);
    metricEmAnalise.textContent = String(metrics.emAnalise ?? 0);
    metricEncaminhados.textContent = String(metrics.encaminhados ?? 0);
    metricFinalizados.textContent = String(metrics.finalizados ?? 0);

    renderizarGraficoDashboard({
  recebidos: metrics.totalRecebidos ?? 0,
  emAnalise: metrics.emAnalise ?? 0,
  encaminhados: metrics.encaminhados ?? 0,
  finalizados: metrics.finalizados ?? 0
});
  } catch {
    metricTotalRecebidos.textContent = '0';
    metricEmAnalise.textContent = '0';
    metricEncaminhados.textContent = '0';
    metricFinalizados.textContent = '0';
  }
}

void carregarMetricasDashboard();

function formatarData(dataIso) {
  if (!dataIso) {
    return '-';
  }

  const data = new Date(dataIso);
  if (Number.isNaN(data.getTime())) {
    return '-';
  }

  return data.toLocaleDateString('pt-BR');
}

function escapeHtml(valor) {
  return String(valor)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function obterClasseStatus(nomeStatus) {
  const status = (nomeStatus || '').toLowerCase();

  if (status.includes('analise') || status.includes('analis')) {
    return 'status-analise';
  }

  if (status.includes('encaminh')) {
    return 'status-encaminhado';
  }

  if (status.includes('finaliz')) {
    return 'status-finalizado';
  }

  return 'status-recebido';
}

function formatarDataHora(dataIso) {
  if (!dataIso) {
    return '-';
  }

  const data = new Date(dataIso);
  if (Number.isNaN(data.getTime())) {
    return '-';
  }

  return data.toLocaleString('pt-BR');
}

function obterUrlArquivoSegura(urlArquivo) {
  const urlOriginal = (urlArquivo || '').toString().trim();
  const url = urlOriginal.replaceAll('\\', '/');
  if (!url) {
    return '';
  }

  if (url.startsWith('/uploads/')) {
    return encodeURI(url);
  }

  if (url.startsWith('uploads/')) {
    return encodeURI(`/${url}`);
  }

  if (url.startsWith('./uploads/')) {
    return encodeURI(`/${url.slice(2)}`);
  }

  if (url.toLowerCase().startsWith('anexo://')) {
    const nomeArquivo = url.slice('anexo://'.length).trim();
    if (!nomeArquivo) {
      return '';
    }

    return encodeURI(`/uploads/${nomeArquivo}`);
  }

  if (url.includes('/uploads/')) {
    const idx = url.lastIndexOf('/uploads/');
    return encodeURI(url.slice(idx));
  }

  const pareceNomeDeArquivo = /^[^/]+\.[a-z0-9]{2,8}$/i.test(url);
  if (pareceNomeDeArquivo) {
    return encodeURI(`/uploads/${url}`);
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return encodeURI(urlOriginal);
  }

  return '';
}

function obterNomeArquivoDeUrl(url) {
  const semQuery = (url || '').split('?')[0].split('#')[0];
  const partes = semQuery.split('/').filter(Boolean);
  return partes[partes.length - 1] || '';
}

async function abrirArquivoComFallback(urlArquivo) {
  const urlPrincipal = obterUrlArquivoSegura(urlArquivo);
  if (!urlPrincipal) {
    window.alert('Este documento nao possui link de arquivo valido.');
    return;
  }

  const candidatos = [urlPrincipal];
  const nomeArquivo = obterNomeArquivoDeUrl(urlPrincipal);
  if (nomeArquivo) {
    candidatos.push(`/${encodeURIComponent(nomeArquivo)}`);
  }

  for (const url of candidatos) {
    try {
      const head = await fetch(url, {
        method: 'HEAD',
        cache: 'no-store',
      });

      if (head.ok) {
        window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }
    } catch {
      // Continua tentando os proximos candidatos.
    }
  }

  window.alert(
    'Arquivo nao encontrado no servidor para este registro antigo. Faca um novo upload do documento para este protocolo.',
  );
}

let statusDocumentoCache = [];
let filtrosDocumentosAtuais = {
  protocolo: '',
  idTipo: '',
  remetente: '',
};

function obterFiltrosDashboard() {
  const protocoloEl = document.getElementById('filtroProtocolo');
  const tipoEl = document.getElementById('filtroTipoDocumento');
  const remetenteEl = document.getElementById('filtroRemetente');

  return {
    protocolo: (protocoloEl && protocoloEl.value.trim()) || '',
    idTipo: (tipoEl && tipoEl.value.trim()) || '',
    remetente: (remetenteEl && remetenteEl.value.trim()) || '',
  };
}

async function carregarTabelaDocumentosDashboard(
  filtros = filtrosDocumentosAtuais,
) {
  const tableBody = document.getElementById('dashboardDocumentosBody');
  if (!tableBody) {
    return;
  }

  filtrosDocumentosAtuais = {
    protocolo: filtros.protocolo || '',
    idTipo: filtros.idTipo || '',
    remetente: filtros.remetente || '',
  };

  try {
    const params = new URLSearchParams();
    if (filtrosDocumentosAtuais.protocolo) {
      params.set('protocolo', filtrosDocumentosAtuais.protocolo);
    }
    if (filtrosDocumentosAtuais.idTipo) {
      params.set('idTipo', filtrosDocumentosAtuais.idTipo);
    }
    if (filtrosDocumentosAtuais.remetente) {
      params.set('remetente', filtrosDocumentosAtuais.remetente);
    }

    const queryString = params.toString();
    const response = await fetch(
      queryString ? `/documentos?${queryString}` : '/documentos',
    );
    if (!response.ok) {
      throw new Error('Falha ao carregar documentos');
    }

    const documentos = await response.json();

    if (!Array.isArray(documentos) || documentos.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4 text-muted">Nenhum documento encontrado.</td>
        </tr>
      `;
      return;
    }

    const linhas = documentos
      .map((doc) => {
        const idDocumento = Number(doc.idDocumento ?? doc.id_documento ?? 0);
        const idStatusAtual = Number(
          (doc.status && (doc.status.idStatus ?? doc.status.id_status)) || 0,
        );
        const protocoloBruto = (doc.protocolo || '-').toString();
        const protocolo = escapeHtml(protocoloBruto);
        const tipo = escapeHtml((doc.tipo && doc.tipo.nomeTipo) || '-');
        const remetente = escapeHtml(doc.remetente || '-');
        const dataEntrada = formatarData(doc.dataEntrada);
        const statusNomeBruto =
          (doc.status && doc.status.nomeStatus) || 'Recebido';
        const statusNome = escapeHtml(statusNomeBruto);
        const statusClasse = obterClasseStatus(statusNomeBruto);
        const arquivoUrlSegura = obterUrlArquivoSegura(doc.arquivoUrl);
        const acaoArquivoHtml = arquivoUrlSegura
          ? `<button
                class="btn btn-sm btn-outline-success"
                title="Abrir Arquivo"
                type="button"
                data-action="abrir-arquivo"
                data-arquivo-url="${escapeHtml(arquivoUrlSegura)}"
              >
                <i class="bi bi-file-earmark-arrow-down"></i>
              </button>`
          : `<button
                class="btn btn-sm btn-outline-success"
                title="Sem arquivo anexado"
                type="button"
                disabled
              >
                <i class="bi bi-file-earmark-arrow-down"></i>
              </button>`;

        return `
          <tr>
            <td class="ps-4 fw-bold">${protocolo}</td>
            <td>${tipo}</td>
            <td>${remetente}</td>
            <td>${dataEntrada}</td>
            <td><span class="badge ${statusClasse} status-badge">${statusNome}</span></td>
            <td class="text-center">
              <button
                class="btn btn-sm btn-outline-primary"
                title="Ver Histórico"
                type="button"
                data-action="historico"
                data-documento-id="${idDocumento}"
                data-protocolo="${protocoloBruto}"
              >
                <i class="bi bi-clock-history"></i>
              </button>
              <button
                class="btn btn-sm btn-outline-secondary"
                title="Alterar Status"
                type="button"
                data-action="alterar-status"
                data-documento-id="${idDocumento}"
                data-status-id="${idStatusAtual}"
                data-protocolo="${protocoloBruto}"
              >
                <i class="bi bi-pencil-square"></i>
              </button>
              ${acaoArquivoHtml}
            </td>
          </tr>
        `;
      })
      .join('');

    tableBody.innerHTML = linhas;
  } catch {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4 text-muted">Nao foi possivel carregar os documentos.</td>
      </tr>
    `;
  }
}

void carregarTabelaDocumentosDashboard();

const dashboardFiltroForm = document.getElementById('dashboardFiltroForm');
if (dashboardFiltroForm) {
  dashboardFiltroForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await carregarTabelaDocumentosDashboard(obterFiltrosDashboard());
  });
}

async function carregarStatusDocumento() {
  try {
    const response = await fetch('/status-documento');
    if (!response.ok) {
      throw new Error('Falha ao carregar status');
    }

    const status = await response.json();
    statusDocumentoCache = Array.isArray(status) ? status : [];
  } catch {
    statusDocumentoCache = [];
  }
}

function preencherSelectStatus(selectedStatusId) {
  const select = document.getElementById('alterarStatusSelect');
  if (!select) {
    return;
  }

  const options = statusDocumentoCache
    .map((status) => {
      const idStatus = Number(status.idStatus);
      const nomeStatus = escapeHtml(status.nomeStatus || 'Sem nome');
      const selected = idStatus === Number(selectedStatusId) ? 'selected' : '';
      return `<option value="${idStatus}" ${selected}>${nomeStatus}</option>`;
    })
    .join('');

  select.innerHTML =
    '<option value="" disabled>Selecione o status</option>' + options;
}

function mostrarErroAlteracaoStatus(message) {
  const erroEl = document.getElementById('alterarStatusErro');
  if (!erroEl) {
    return;
  }

  erroEl.textContent = message;
  erroEl.classList.remove('d-none');
}

function esconderErroAlteracaoStatus() {
  const erroEl = document.getElementById('alterarStatusErro');
  if (!erroEl) {
    return;
  }

  erroEl.textContent = '';
  erroEl.classList.add('d-none');
}

async function abrirModalHistorico(documentoId, protocolo) {
  const modalEl = document.getElementById('modalHistoricoDocumento');
  const titleEl = document.getElementById('historicoModalTitle');
  const bodyEl = document.getElementById('historicoDocumentoBody');

  if (!modalEl || !titleEl || !bodyEl) {
    return;
  }

  titleEl.textContent = `Historico do Documento ${protocolo}`;
  bodyEl.textContent = 'Carregando historico...';

  const modal =
    window.bootstrap && window.bootstrap.Modal
      ? window.bootstrap.Modal.getOrCreateInstance(modalEl)
      : null;

  if (modal) {
    modal.show();
  }

  try {
    const response = await fetch(`/historicos/documento/${documentoId}`);
    if (!response.ok) {
      throw new Error('Falha ao carregar historico');
    }

    const historico = await response.json();
    if (!Array.isArray(historico) || historico.length === 0) {
      bodyEl.innerHTML =
        '<p class="text-muted mb-0">Nenhuma movimentacao registrada para este documento.</p>';
      return;
    }

    const linhas = historico
      .map((item) => {
        const data = escapeHtml(formatarDataHora(item.dataMovimentacao));
        const status = escapeHtml(
          (item.status && item.status.nomeStatus) || '-',
        );
        const usuarioNome = escapeHtml(
          (item.usuario && item.usuario.nome) || '-',
        );
        const observacao = escapeHtml(item.observacao || '-');

        return `
          <tr>
            <td>${data}</td>
            <td>${status}</td>
            <td>${usuarioNome}</td>
            <td>${observacao}</td>
          </tr>
        `;
      })
      .join('');

    bodyEl.innerHTML = `
      <div class="table-responsive">
        <table class="table table-sm table-striped mb-0">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Status</th>
              <th>Responsavel</th>
              <th>Observacao</th>
            </tr>
          </thead>
          <tbody>
            ${linhas}
          </tbody>
        </table>
      </div>
    `;
  } catch {
    bodyEl.innerHTML =
      '<p class="text-danger mb-0">Nao foi possivel carregar o historico.</p>';
  }
}

async function abrirModalAlterarStatus(documentoId, statusAtualId, protocolo) {
  const modalEl = document.getElementById('modalAlterarStatus');
  const titleEl = document.getElementById('alterarStatusModalTitle');
  const documentoIdEl = document.getElementById('alterarStatusDocumentoId');
  const observacaoEl = document.getElementById('alterarStatusObservacao');

  if (!modalEl || !titleEl || !documentoIdEl || !observacaoEl) {
    return;
  }

  if (statusDocumentoCache.length === 0) {
    await carregarStatusDocumento();
  }

  preencherSelectStatus(statusAtualId);
  esconderErroAlteracaoStatus();

  titleEl.textContent = `Alterar Status - ${protocolo}`;
  documentoIdEl.value = String(documentoId);
  observacaoEl.value = '';

  const modal =
    window.bootstrap && window.bootstrap.Modal
      ? window.bootstrap.Modal.getOrCreateInstance(modalEl)
      : null;

  if (modal) {
    modal.show();
  }
}

async function processarAlteracaoStatus(event) {
  event.preventDefault();

  const documentoIdEl = document.getElementById('alterarStatusDocumentoId');
  const statusSelectEl = document.getElementById('alterarStatusSelect');
  const observacaoEl = document.getElementById('alterarStatusObservacao');
  const salvarBtn = document.getElementById('alterarStatusSalvarBtn');

  if (!documentoIdEl || !statusSelectEl || !observacaoEl || !salvarBtn) {
    return;
  }

  const documentoId = Number(documentoIdEl.value);
  const idStatus = Number(statusSelectEl.value);
  const observacao = observacaoEl.value.trim();
  const idUsuario = Number((usuario && usuario.idUsuario) || 0);

  if (!documentoId || !idStatus) {
    mostrarErroAlteracaoStatus('Selecione um status valido.');
    return;
  }

  if (!idUsuario) {
    mostrarErroAlteracaoStatus(
      'Usuario invalido na sessao. Faca login novamente.',
    );
    return;
  }

  esconderErroAlteracaoStatus();
  salvarBtn.disabled = true;
  salvarBtn.textContent = 'Salvando...';

  try {
    const patchResponse = await fetch(`/documentos/${documentoId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idStatus }),
    });

    if (!patchResponse.ok) {
      throw new Error('Nao foi possivel atualizar o status do documento.');
    }

    const historicoPayload = {
      idDocumento: documentoId,
      idStatus,
      idUsuario,
      observacao: observacao || undefined,
    };

    const historicoResponse = await fetch('/historicos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(historicoPayload),
    });

    if (!historicoResponse.ok) {
      throw new Error(
        'Status atualizado, mas nao foi possivel registrar no historico.',
      );
    }

    const modalEl = document.getElementById('modalAlterarStatus');
    const modal =
      modalEl && window.bootstrap && window.bootstrap.Modal
        ? window.bootstrap.Modal.getOrCreateInstance(modalEl)
        : null;
    if (modal) {
      modal.hide();
    }

    await Promise.all([
      carregarMetricasDashboard(),
      carregarTabelaDocumentosDashboard(),
    ]);
  } catch (error) {
    mostrarErroAlteracaoStatus(error.message || 'Falha ao alterar status.');
  } finally {
    salvarBtn.disabled = false;
    salvarBtn.textContent = 'Salvar';
  }
}

function configurarAcoesTabelaDashboard() {
  const tableBody = document.getElementById('dashboardDocumentosBody');
  if (!tableBody) {
    return;
  }

  tableBody.addEventListener('click', async (event) => {
    const targetEl = event.target.closest('[data-action]');
    if (!targetEl) {
      return;
    }

    const acao = targetEl.getAttribute('data-action');

    if (acao === 'abrir-arquivo') {
      const urlArquivo = targetEl.getAttribute('data-arquivo-url') || '';
      await abrirArquivoComFallback(urlArquivo);
      return;
    }

    const documentoId = Number(targetEl.getAttribute('data-documento-id'));
    const protocolo = targetEl.getAttribute('data-protocolo') || 'Documento';

    if (!documentoId) {
      return;
    }

    if (acao === 'historico') {
      await abrirModalHistorico(documentoId, protocolo);
      return;
    }

    if (acao === 'alterar-status') {
      const statusAtualId = Number(targetEl.getAttribute('data-status-id'));
      await abrirModalAlterarStatus(documentoId, statusAtualId, protocolo);
    }
  });
}

const alterarStatusForm = document.getElementById('alterarStatusForm');
if (alterarStatusForm) {
  alterarStatusForm.addEventListener('submit', processarAlteracaoStatus);
}

configurarAcoesTabelaDashboard();
void carregarStatusDocumento();

async function carregarTiposDocumentoFiltro() {
  const filtroTipoDocumento = document.getElementById('filtroTipoDocumento');
  if (!filtroTipoDocumento) {
    return;
  }

  try {
    const response = await fetch('/tipos-documento');
    if (!response.ok) {
      throw new Error('Falha ao carregar tipos de documento');
    }

    const tipos = await response.json();
    if (!Array.isArray(tipos)) {
      throw new Error('Resposta invalida para tipos de documento');
    }

    const options = tipos
      .map((tipo) => {
        const id = escapeHtml(tipo.idTipo ?? '');
        const nome = escapeHtml(tipo.nomeTipo ?? 'Sem nome');
        return `<option value="${id}">${nome}</option>`;
      })
      .join('');

    filtroTipoDocumento.innerHTML =
      '<option selected disabled value="">Tipo de Documento</option>' + options;
  } catch {
    filtroTipoDocumento.innerHTML =
      '<option selected disabled value="">Tipo de Documento</option>';
  }
}
    let graficoInstance = null;

function renderizarGraficoDashboard(dados) {
  const ctx = document.getElementById('graficoDashboard');

  if (!ctx) return;

  if (graficoInstance) {
    graficoInstance.destroy();
  }

  graficoInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Recebidos', 'Em Análise', 'Encaminhados', 'Finalizados'],
      datasets: [
        {
          label: 'Quantidade',
          data: [
            dados.recebidos,
            dados.emAnalise,
            dados.encaminhados,
            dados.finalizados
          ],
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

void carregarTiposDocumentoFiltro();
