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
        const idDocumento = Number(doc.idDocumento);
        const idStatusAtual = Number((doc.status && doc.status.idStatus) || 0);
        const protocolo = escapeHtml(doc.protocolo || '-');
        const tipo = escapeHtml((doc.tipo && doc.tipo.nomeTipo) || '-');
        const remetente = escapeHtml(doc.remetente || '-');
        const dataEntrada = formatarData(doc.dataEntrada);
        const statusNomeBruto =
          (doc.status && doc.status.nomeStatus) || 'Recebido';
        const statusNome = escapeHtml(statusNomeBruto);
        const statusClasse = obterClasseStatus(statusNomeBruto);

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
                data-action="historico"
                data-documento-id="${idDocumento}"
                data-protocolo="${protocolo}"
              >
                <i class="bi bi-clock-history"></i>
              </button>
              <button
                class="btn btn-sm btn-outline-secondary"
                title="Alterar Status"
                data-action="alterar-status"
                data-documento-id="${idDocumento}"
                data-status-id="${idStatusAtual}"
                data-protocolo="${protocolo}"
              >
                <i class="bi bi-pencil-square"></i>
              </button>
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
    const button = event.target.closest('button[data-action]');
    if (!button) {
      return;
    }

    const acao = button.getAttribute('data-action');
    const documentoId = Number(button.getAttribute('data-documento-id'));
    const protocolo = button.getAttribute('data-protocolo') || 'Documento';

    if (!documentoId) {
      return;
    }

    if (acao === 'historico') {
      await abrirModalHistorico(documentoId, protocolo);
      return;
    }

    if (acao === 'alterar-status') {
      const statusAtualId = Number(button.getAttribute('data-status-id'));
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

void carregarTiposDocumentoFiltro();
