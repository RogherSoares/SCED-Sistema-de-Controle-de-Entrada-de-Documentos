function escapeHtml(valor) {
  return String(valor)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

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

  // Compatibilidade com registros antigos que salvaram somente o nome do arquivo.
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

let statusDocumentoConsultaCache = [];

function obterFiltrosConsulta() {
  const protocoloEl = document.getElementById('consultaFiltroProtocolo');
  const remetenteEl = document.getElementById('consultaFiltroRemetente');
  const statusEl = document.getElementById('consultaFiltroStatus');

  return {
    protocolo: (protocoloEl && protocoloEl.value.trim()) || '',
    remetente: (remetenteEl && remetenteEl.value.trim()) || '',
    idStatus: (statusEl && statusEl.value.trim()) || '',
  };
}

async function carregarStatusConsulta() {
  const statusEl = document.getElementById('consultaFiltroStatus');
  if (!statusEl) {
    return;
  }

  try {
    const response = await fetch('/status-documento');
    if (!response.ok) {
      throw new Error('Falha ao carregar status');
    }

    const status = await response.json();
    if (!Array.isArray(status)) {
      throw new Error('Resposta invalida para status');
    }

    const options = status
      .map((item) => {
        const id = escapeHtml(item.idStatus ?? '');
        const nome = escapeHtml(item.nomeStatus ?? 'Sem nome');
        return `<option value="${id}">${nome}</option>`;
      })
      .join('');

    statusEl.innerHTML =
      '<option selected value="">Todos os Status</option>' + options;
  } catch {
    statusEl.innerHTML = '<option selected value="">Todos os Status</option>';
  }
}

async function carregarTabelaConsulta() {
  const tableBody = document.getElementById('consultaDocumentosBody');
  if (!tableBody) {
    return;
  }

  const filtros = obterFiltrosConsulta();

  try {
    const params = new URLSearchParams();
    if (filtros.protocolo) {
      params.set('protocolo', filtros.protocolo);
    }
    if (filtros.remetente) {
      params.set('remetente', filtros.remetente);
    }
    if (filtros.idStatus) {
      params.set('idStatus', filtros.idStatus);
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

    tableBody.innerHTML = documentos
      .map((doc) => {
        const protocoloBruto = (doc.protocolo || '-').toString();
        const protocolo = escapeHtml(protocoloBruto);
        const dataEntrada = formatarData(doc.dataEntrada);
        const remetente = escapeHtml(doc.remetente || '-');
        const tipo = escapeHtml((doc.tipo && doc.tipo.nomeTipo) || '-');
        const statusNomeBruto =
          (doc.status && doc.status.nomeStatus) || 'Recebido';
        const statusNome = escapeHtml(statusNomeBruto);
        const statusClasse = obterClasseStatus(statusNomeBruto);
        const idDocumento = Number(doc.idDocumento ?? doc.id_documento ?? 0);
        const idStatusAtual = Number(
          (doc.status && (doc.status.idStatus ?? doc.status.id_status)) || 0,
        );
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
            <td>${dataEntrada}</td>
            <td>${remetente}</td>
            <td>${tipo}</td>
            <td><span class="badge ${statusClasse} status-badge">${statusNome}</span></td>
            <td class="text-center">
              <button
                class="btn btn-sm btn-outline-primary"
                title="Ver Historico"
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
  } catch {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4 text-muted">Nao foi possivel carregar os documentos.</td>
      </tr>
    `;
  }
}

async function carregarStatusDocumentoConsulta() {
  try {
    const response = await fetch('/status-documento');
    if (!response.ok) {
      throw new Error('Falha ao carregar status');
    }

    const status = await response.json();
    statusDocumentoConsultaCache = Array.isArray(status) ? status : [];
  } catch {
    statusDocumentoConsultaCache = [];
  }
}

function preencherSelectStatusConsulta(selectedStatusId) {
  const select = document.getElementById('alterarStatusSelectConsulta');
  if (!select) {
    return;
  }

  const options = statusDocumentoConsultaCache
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

function mostrarErroAlteracaoStatusConsulta(message) {
  const erroEl = document.getElementById('alterarStatusErroConsulta');
  if (!erroEl) {
    return;
  }

  erroEl.textContent = message;
  erroEl.classList.remove('d-none');
}

function esconderErroAlteracaoStatusConsulta() {
  const erroEl = document.getElementById('alterarStatusErroConsulta');
  if (!erroEl) {
    return;
  }

  erroEl.textContent = '';
  erroEl.classList.add('d-none');
}

async function abrirModalHistoricoConsulta(documentoId, protocolo) {
  const modalEl = document.getElementById('modalHistoricoDocumentoConsulta');
  const titleEl = document.getElementById('historicoModalTitleConsulta');
  const bodyEl = document.getElementById('historicoDocumentoBodyConsulta');

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

async function abrirModalAlterarStatusConsulta(
  documentoId,
  statusAtualId,
  protocolo,
) {
  const modalEl = document.getElementById('modalAlterarStatusConsulta');
  const titleEl = document.getElementById('alterarStatusModalTitleConsulta');
  const documentoIdEl = document.getElementById(
    'alterarStatusDocumentoIdConsulta',
  );
  const observacaoEl = document.getElementById(
    'alterarStatusObservacaoConsulta',
  );

  if (!modalEl || !titleEl || !documentoIdEl || !observacaoEl) {
    return;
  }

  if (statusDocumentoConsultaCache.length === 0) {
    await carregarStatusDocumentoConsulta();
  }

  preencherSelectStatusConsulta(statusAtualId);
  esconderErroAlteracaoStatusConsulta();

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

async function processarAlteracaoStatusConsulta(event) {
  event.preventDefault();

  const documentoIdEl = document.getElementById(
    'alterarStatusDocumentoIdConsulta',
  );
  const statusSelectEl = document.getElementById('alterarStatusSelectConsulta');
  const observacaoEl = document.getElementById(
    'alterarStatusObservacaoConsulta',
  );
  const salvarBtn = document.getElementById('alterarStatusSalvarBtnConsulta');

  if (!documentoIdEl || !statusSelectEl || !observacaoEl || !salvarBtn) {
    return;
  }

  const usuarioConsultaSessao = sessionStorage.getItem('scedUser');
  const usuarioConsulta = usuarioConsultaSessao
    ? JSON.parse(usuarioConsultaSessao)
    : null;
  const idUsuario = Number((usuarioConsulta && usuarioConsulta.idUsuario) || 0);

  const documentoId = Number(documentoIdEl.value);
  const idStatus = Number(statusSelectEl.value);
  const observacao = observacaoEl.value.trim();

  if (!documentoId || !idStatus) {
    mostrarErroAlteracaoStatusConsulta('Selecione um status valido.');
    return;
  }

  if (!idUsuario) {
    mostrarErroAlteracaoStatusConsulta(
      'Usuario invalido na sessao. Faca login novamente.',
    );
    return;
  }

  esconderErroAlteracaoStatusConsulta();
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

    const modalEl = document.getElementById('modalAlterarStatusConsulta');
    const modal =
      modalEl && window.bootstrap && window.bootstrap.Modal
        ? window.bootstrap.Modal.getOrCreateInstance(modalEl)
        : null;
    if (modal) {
      modal.hide();
    }

    await carregarTabelaConsulta();
  } catch (error) {
    mostrarErroAlteracaoStatusConsulta(
      error.message || 'Falha ao alterar status.',
    );
  } finally {
    salvarBtn.disabled = false;
    salvarBtn.textContent = 'Salvar';
  }
}

function configurarAcoesTabelaConsulta() {
  const tableBody = document.getElementById('consultaDocumentosBody');
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
      await abrirModalHistoricoConsulta(documentoId, protocolo);
      return;
    }

    if (acao === 'alterar-status') {
      const statusAtualId = Number(targetEl.getAttribute('data-status-id'));
      await abrirModalAlterarStatusConsulta(
        documentoId,
        statusAtualId,
        protocolo,
      );
    }
  });
}

const consultaFiltroForm = document.getElementById('consultaFiltroForm');
if (consultaFiltroForm) {
  consultaFiltroForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await carregarTabelaConsulta();
  });
}

const alterarStatusFormConsulta = document.getElementById(
  'alterarStatusFormConsulta',
);
if (alterarStatusFormConsulta) {
  alterarStatusFormConsulta.addEventListener(
    'submit',
    processarAlteracaoStatusConsulta,
  );
}

configurarAcoesTabelaConsulta();

void (async function initConsulta() {
  await carregarStatusConsulta();
  await carregarStatusDocumentoConsulta();
  await carregarTabelaConsulta();
})();
