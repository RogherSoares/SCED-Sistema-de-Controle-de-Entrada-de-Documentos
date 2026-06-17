function escapeHtml(valor) {
  return String(valor)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function mostrarFeedbackRegistro(mensagem, tipo = 'danger') {
  const feedbackEl = document.getElementById('registroFeedback');
  if (!feedbackEl) {
    return;
  }

  feedbackEl.className = `alert alert-${tipo} py-2 mb-0`;
  feedbackEl.textContent = mensagem;
  feedbackEl.classList.remove('d-none');
}

function limparFeedbackRegistro() {
  const feedbackEl = document.getElementById('registroFeedback');
  if (!feedbackEl) {
    return;
  }

  feedbackEl.textContent = '';
  feedbackEl.className = 'small d-none';
}

async function carregarProximoProtocolo() {
  const protocoloEl = document.getElementById('registroProtocolo');
  if (!protocoloEl) {
    return;
  }

  protocoloEl.value = 'GERANDO...';

  try {
    const response = await fetch('/documentos/next-protocolo');
    if (!response.ok) {
      throw new Error('Falha ao gerar protocolo');
    }

    const data = await response.json();
    protocoloEl.value = data.protocolo || 'AUTOMATICO';
  } catch {
    protocoloEl.value = 'AUTOMATICO';
  }
}

async function carregarTiposDocumentoRegistro() {
  const selectTipo = document.getElementById('registroTipoDocumento');
  if (!selectTipo) {
    return;
  }

  try {
    const response = await fetch('/tipos-documento');
    if (!response.ok) {
      throw new Error('Falha ao carregar tipos');
    }

    const tipos = await response.json();
    if (!Array.isArray(tipos)) {
      throw new Error('Resposta invalida para tipos');
    }

    const options = tipos
      .map((tipo) => {
        const id = escapeHtml(tipo.idTipo ?? '');
        const nome = escapeHtml(tipo.nomeTipo ?? 'Sem nome');
        return `<option value="${id}">${nome}</option>`;
      })
      .join('');

    selectTipo.innerHTML =
      '<option value="" selected disabled>Selecione o tipo ...</option>' +
      options;
  } catch {
    selectTipo.innerHTML =
      '<option value="" selected disabled>Nao foi possivel carregar tipos</option>';
  }
}

async function obterStatusInicialRegistro() {
  try {
    const response = await fetch('/status-documento');
    if (!response.ok) {
      throw new Error('Falha ao carregar status');
    }

    const status = await response.json();
    if (!Array.isArray(status) || status.length === 0) {
      return null;
    }

    const recebido = status.find((item) => {
      const nome = (item.nomeStatus || '').toString().toLowerCase();
      return nome.includes('receb');
    });

    return Number((recebido || status[0]).idStatus) || null;
  } catch {
    return null;
  }
}

function atualizarBarraUploadRegistro(exibir, percentual = 0) {
  const uploadLineEl = document.getElementById('registroUploadLine');
  const uploadProgressEl = document.getElementById(
    'registroUploadLineProgress',
  );

  if (!uploadLineEl || !uploadProgressEl) {
    return;
  }

  if (exibir) {
    uploadLineEl.classList.remove('d-none');
    const percentualNormalizado = Math.max(0, Math.min(100, percentual));
    uploadProgressEl.style.width = `${percentualNormalizado}%`;
    return;
  }

  uploadProgressEl.style.width = '0%';
  uploadLineEl.classList.add('d-none');
}

function enviarArquivoComProgresso(arquivo) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('arquivo', arquivo);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/documentos/upload');

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }

      const percentual = Math.round((event.loaded / event.total) * 100);
      atualizarBarraUploadRegistro(true, percentual);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const resposta = JSON.parse(xhr.responseText || '{}');
          resolve(resposta);
        } catch {
          reject(new Error('Resposta invalida no upload do arquivo.'));
        }
        return;
      }

      try {
        const erro = JSON.parse(xhr.responseText || '{}');
        const msg =
          erro.message || erro.error || 'Nao foi possivel enviar o arquivo.';
        reject(new Error(Array.isArray(msg) ? msg.join(', ') : msg));
      } catch {
        reject(new Error('Nao foi possivel enviar o arquivo.'));
      }
    };

    xhr.onerror = () => reject(new Error('Erro de rede durante o upload.'));
    xhr.onabort = () => reject(new Error('Upload cancelado.'));
    xhr.send(formData);
  });
}

async function removerArquivoNoServidor(arquivoUrl) {
  if (!arquivoUrl || !arquivoUrl.startsWith('/uploads/')) {
    return;
  }

  await fetch(
    `/documentos/upload?arquivoUrl=${encodeURIComponent(arquivoUrl)}`,
    {
      method: 'DELETE',
    },
  );
}

async function limparArquivoSelecionado(
  { removerNoServidor, mostrarMensagem } = {
    removerNoServidor: false,
    mostrarMensagem: false,
  },
) {
  const inputArquivoEl = document.getElementById('registroArquivoInput');
  const arquivoUrlEl = document.getElementById('registroArquivoUrl');
  const arquivoInfoEl = document.getElementById('registroArquivoInfo');
  const removerBtnEl = document.getElementById('registroArquivoRemoverBtn');

  if (!inputArquivoEl || !arquivoUrlEl || !arquivoInfoEl || !removerBtnEl) {
    return;
  }

  const arquivoUrl = arquivoUrlEl.value.trim();
  if (removerNoServidor && arquivoUrl) {
    try {
      await removerArquivoNoServidor(arquivoUrl);
    } catch {
      // Se falhar a exclusao no servidor, ainda limpamos o estado local para o usuario continuar.
    }
  }

  inputArquivoEl.value = '';
  arquivoUrlEl.value = '';
  arquivoInfoEl.textContent = 'Anexe um arquivo.';
  removerBtnEl.classList.add('d-none');
  atualizarBarraUploadRegistro(false);

  if (mostrarMensagem) {
    mostrarFeedbackRegistro('Arquivo removido do registro.', 'info');
  }
}

function configurarBotaoArquivoRegistro() {
  const btn = document.getElementById('registroArquivoBtn');
  const inputArquivoEl = document.getElementById('registroArquivoInput');
  const arquivoUrlEl = document.getElementById('registroArquivoUrl');
  const arquivoInfoEl = document.getElementById('registroArquivoInfo');
  const removerBtnEl = document.getElementById('registroArquivoRemoverBtn');

  if (
    !btn ||
    !inputArquivoEl ||
    !arquivoUrlEl ||
    !arquivoInfoEl ||
    !removerBtnEl
  ) {
    return;
  }

  btn.addEventListener('click', () => {
    inputArquivoEl.click();
  });

  removerBtnEl.addEventListener('click', async () => {
    await limparArquivoSelecionado({
      removerNoServidor: true,
      mostrarMensagem: true,
    });
  });

  inputArquivoEl.addEventListener('change', async () => {
    const arquivo = inputArquivoEl.files && inputArquivoEl.files[0];

    if (!arquivo) {
      await limparArquivoSelecionado();
      return;
    }

    limparFeedbackRegistro();

    const arquivoAnteriorUrl = arquivoUrlEl.value.trim();
    if (arquivoAnteriorUrl) {
      await removerArquivoNoServidor(arquivoAnteriorUrl);
    }

    const tamanhoKb = Math.max(1, Math.round(arquivo.size / 1024));
    arquivoInfoEl.textContent = `Enviando arquivo: ${arquivo.name} (${tamanhoKb} KB)...`;
    removerBtnEl.classList.add('d-none');
    atualizarBarraUploadRegistro(true, 0);

    try {
      const data = await enviarArquivoComProgresso(arquivo);
      arquivoUrlEl.value = data.arquivoUrl || '';

      if (!arquivoUrlEl.value) {
        throw new Error('Upload concluido sem URL do arquivo.');
      }

      arquivoInfoEl.textContent = `Arquivo anexado: ${arquivo.name} (${tamanhoKb} KB)`;
      removerBtnEl.classList.remove('d-none');
      atualizarBarraUploadRegistro(false);
      limparFeedbackRegistro();
    } catch (error) {
      await limparArquivoSelecionado();
      mostrarFeedbackRegistro(error.message || 'Falha no upload do arquivo.');
    }
  });
}

function configurarResetFormularioRegistro() {
  const form = document.getElementById('registroDocumentoForm');
  const dataEl = document.getElementById('registroDataEntrada');

  if (!form) {
    return;
  }

  form.addEventListener('reset', () => {
    setTimeout(() => {
      limparFeedbackRegistro();

      if (dataEl) {
        dataEl.valueAsDate = new Date();
      }

      void limparArquivoSelecionado();

      void carregarProximoProtocolo();
    }, 0);
  });
}

async function processarRegistroDocumento(event) {
  event.preventDefault();
  limparFeedbackRegistro();

  const form = document.getElementById('registroDocumentoForm');
  const submitBtn = form && form.querySelector('button[type="submit"]');

  const protocoloEl = document.getElementById('registroProtocolo');
  const dataEntradaEl = document.getElementById('registroDataEntrada');
  const tipoEl = document.getElementById('registroTipoDocumento');
  const remetenteEl = document.getElementById('registroRemetente');
  const descricaoEl = document.getElementById('registroDescricao');
  const arquivoUrlEl = document.getElementById('registroArquivoUrl');

  if (
    !form ||
    !submitBtn ||
    !protocoloEl ||
    !dataEntradaEl ||
    !tipoEl ||
    !remetenteEl ||
    !descricaoEl ||
    !arquivoUrlEl
  ) {
    return;
  }

  const protocolo = protocoloEl.value.trim();
  const dataEntrada = dataEntradaEl.value;
  const idTipo = Number(tipoEl.value);
  const remetente = remetenteEl.value.trim();
  const descricao = descricaoEl.value.trim();
  const arquivoUrl = arquivoUrlEl.value.trim();

  if (!protocolo || protocolo === 'AUTOMATICO' || protocolo === 'GERANDO...') {
    mostrarFeedbackRegistro(
      'Aguarde a geracao do protocolo e tente novamente.',
    );
    return;
  }

  if (!dataEntrada || !idTipo || !remetente) {
    mostrarFeedbackRegistro('Preencha todos os campos obrigatorios.');
    return;
  }

  const idStatusInicial = await obterStatusInicialRegistro();
  if (!idStatusInicial) {
    mostrarFeedbackRegistro('Nao foi possivel definir status inicial.');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Salvando...';

  try {
    const payload = {
      protocolo,
      dataEntrada,
      idTipo,
      remetente,
      descricao: descricao || undefined,
      arquivoUrl: arquivoUrl || undefined,
      idStatus: idStatusInicial,
    };

    const response = await fetch('/documentos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        (errorData && (errorData.message || errorData.error)) ||
        'Nao foi possivel registrar o documento.';
      throw new Error(
        Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage,
      );
    }

    const documentoCriado = await response.json();
    const usuarioSessao = sessionStorage.getItem('scedUser');
    const usuario = usuarioSessao ? JSON.parse(usuarioSessao) : null;
    const idUsuario = Number((usuario && usuario.idUsuario) || 0);

    if (idUsuario && documentoCriado && documentoCriado.idDocumento) {
      await fetch('/historicos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idDocumento: Number(documentoCriado.idDocumento),
          idStatus: idStatusInicial,
          idUsuario,
          observacao: 'Registro inicial de documento',
        }),
      });
    }

    mostrarFeedbackRegistro('Documento registrado com sucesso.', 'success');
    form.reset();
  } catch (error) {
    mostrarFeedbackRegistro(error.message || 'Falha ao registrar documento.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML =
      '<i class="bi bi-check-lg me-1"></i> Finalizar Registro';
  }
}

function configurarFormularioRegistro() {
  const form = document.getElementById('registroDocumentoForm');
  const dataEl = document.getElementById('registroDataEntrada');

  if (!form) {
    return;
  }

  form.addEventListener('submit', processarRegistroDocumento);

  if (dataEl && !dataEl.value) {
    dataEl.valueAsDate = new Date();
  }
}

void (async function initRegistro() {
  configurarFormularioRegistro();
  configurarBotaoArquivoRegistro();
  configurarResetFormularioRegistro();

  await Promise.all([
    carregarTiposDocumentoRegistro(),
    carregarProximoProtocolo(),
  ]);
})();
