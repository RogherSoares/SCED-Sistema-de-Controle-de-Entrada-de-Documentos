function escapeHtml(valor) {
  return String(valor)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
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

function montarBadgeStatus(nomeStatusBruto) {
  const nome = escapeHtml(nomeStatusBruto || '-');
  const classe = obterClasseStatus(nomeStatusBruto || '');
  return `<span class="badge ${classe} status-badge">${nome}</span>`;
}

function obterFiltrosRelatorio() {
  const dataInicioEl = document.getElementById('filtroDataInicio');
  const dataFimEl = document.getElementById('filtroDataFim');
  const tipoEl = document.getElementById('filtroRelatorioTipo');
  const statusAtualEl = document.getElementById('filtroRelatorioStatusAtual');

  return {
    dataInicio: (dataInicioEl && dataInicioEl.value.trim()) || '',
    dataFim: (dataFimEl && dataFimEl.value.trim()) || '',
    idTipo: (tipoEl && tipoEl.value.trim()) || '',
    idStatusAtual: (statusAtualEl && statusAtualEl.value.trim()) || '',
  };
}

async function buscarHistoricosRelatorio({ usandoFiltros, filtros, limit }) {
  const params = new URLSearchParams();
  if (Number.isFinite(limit) && limit > 0) {
    params.set('limit', String(limit));
  }

  if (usandoFiltros) {
    if (filtros.dataInicio) {
      params.set('dataInicio', filtros.dataInicio);
    }
    if (filtros.dataFim) {
      params.set('dataFim', filtros.dataFim);
    }
    if (filtros.idTipo) {
      params.set('idTipo', filtros.idTipo);
    }
    if (filtros.idStatusAtual) {
      params.set('idStatusAtual', filtros.idStatusAtual);
    }
  }

  if (!usandoFiltros) {
    params.set('limit', String(limit || 10));
  }

  const endpoint = usandoFiltros
    ? `/historicos/relatorio?${params.toString()}`
    : `/historicos/recentes?${params.toString()}`;

  let response = await fetch(endpoint);
  if (!response.ok && usandoFiltros) {
    response = await fetch('/historicos/recentes?limit=10');
  }

  if (!response.ok) {
    throw new Error('Falha ao carregar historico recente');
  }

  const historicos = await response.json();
  return Array.isArray(historicos) ? historicos : [];
}

async function carregarIndicadoresRelatorio(usandoFiltros = false) {
  const documentosEmDiaEl = document.getElementById('indicadorDocumentosEmDia');
  const tempoMedioEl = document.getElementById('indicadorTempoMedioAnalise');

  if (!documentosEmDiaEl || !tempoMedioEl) {
    return;
  }

  try {
    const filtros = obterFiltrosRelatorio();
    const params = new URLSearchParams();

    if (usandoFiltros) {
      if (filtros.dataInicio) {
        params.set('dataInicio', filtros.dataInicio);
      }
      if (filtros.dataFim) {
        params.set('dataFim', filtros.dataFim);
      }
      if (filtros.idTipo) {
        params.set('idTipo', filtros.idTipo);
      }
      if (filtros.idStatusAtual) {
        params.set('idStatusAtual', filtros.idStatusAtual);
      }
    }

    const endpoint = params.toString()
      ? `/historicos/indicadores?${params.toString()}`
      : '/historicos/indicadores';

    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error('Falha ao carregar indicadores');
    }

    const indicadores = await response.json();
    const percentual = Number(indicadores.percentualDocumentosEmDia ?? 0);
    const tempoMedio = Number(indicadores.tempoMedioAnaliseHoras ?? 0);

    documentosEmDiaEl.textContent = `${Number.isFinite(percentual) ? percentual : 0}%`;
    tempoMedioEl.textContent = `${Number.isFinite(tempoMedio) ? tempoMedio : 0}h`;
  } catch {
    documentosEmDiaEl.textContent = '0%';
    tempoMedioEl.textContent = '0h';
  }
}

function gerarPdfRelatorio(historicos, filtros) {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    throw new Error('Biblioteca de PDF indisponivel.');
  }

  const doc = new window.jspdf.jsPDF({ orientation: 'landscape' });
  const periodoTexto =
    filtros.dataInicio && filtros.dataFim
      ? `${filtros.dataInicio} ate ${filtros.dataFim}`
      : filtros.dataInicio || filtros.dataFim || 'Nao informado';

  doc.setFontSize(14);
  doc.text('SCED - Relatorio de Movimentacoes', 14, 16);
  doc.setFontSize(10);
  doc.text(`Periodo: ${periodoTexto}`, 14, 23);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 29);
  doc.text(`Total de registros: ${historicos.length}`, 14, 35);

  const body = historicos.map((item) => [
    formatarDataHora(item.dataMovimentacao),
    (item.documento && item.documento.protocolo) || '-',
    (item.statusAnterior && item.statusAnterior.nomeStatus) || '-',
    (item.status && item.status.nomeStatus) || '-',
    (item.usuario && item.usuario.nome) || '-',
  ]);

  doc.autoTable({
    head: [
      [
        'Data/Hora',
        'Protocolo',
        'Status Anterior',
        'Novo Status',
        'Responsavel',
      ],
    ],
    body,
    startY: 42,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [30, 64, 175] },
  });

  const nomeArquivo = `relatorio-movimentacoes-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(nomeArquivo);
}

async function carregarHistoricoRecenteRelatorios(usandoFiltros = false) {
  const tableBody = document.getElementById('relatoriosHistoricoBody');
  if (!tableBody) {
    return;
  }

  try {
    const filtros = obterFiltrosRelatorio();
    const historicos = await buscarHistoricosRelatorio({
      usandoFiltros,
      filtros,
      limit: 10,
    });

    if (!Array.isArray(historicos) || historicos.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-4 text-muted">Nenhuma movimentacao encontrada.</td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = historicos
      .map((item) => {
        const data = escapeHtml(formatarDataHora(item.dataMovimentacao));
        const protocolo = escapeHtml(
          (item.documento && item.documento.protocolo) || '-',
        );
        const statusAnterior = montarBadgeStatus(
          item.statusAnterior && item.statusAnterior.nomeStatus,
        );
        const novoStatus = montarBadgeStatus(
          item.status && item.status.nomeStatus,
        );
        const responsavel = escapeHtml(
          (item.usuario && item.usuario.nome) || '-',
        );

        return `
          <tr>
            <td class="ps-3 small">${data}</td>
            <td class="fw-bold">${protocolo}</td>
            <td>${statusAnterior}</td>
            <td>${novoStatus}</td>
            <td class="small">${responsavel}</td>
          </tr>
        `;
      })
      .join('');
  } catch {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-4 text-muted">Nao foi possivel carregar as movimentacoes.</td>
      </tr>
    `;
  }
}

async function carregarTiposRelatorio() {
  const selectTipo = document.getElementById('filtroRelatorioTipo');
  if (!selectTipo) {
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

    selectTipo.innerHTML =
      '<option selected value="">Todos os tipos</option>' + options;
  } catch {
    selectTipo.innerHTML = '<option selected value="">Todos os tipos</option>';
  }
}

async function carregarStatusRelatorio() {
  const selectStatus = document.getElementById('filtroRelatorioStatusAtual');
  if (!selectStatus) {
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

    selectStatus.innerHTML =
      '<option selected value="">Qualquer status</option>' + options;
  } catch {
    selectStatus.innerHTML =
      '<option selected value="">Qualquer status</option>';
  }
}

const relatorioFiltroForm = document.getElementById('relatorioFiltroForm');
if (relatorioFiltroForm) {
  relatorioFiltroForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const filtros = obterFiltrosRelatorio();
    if (!filtros.dataInicio || !filtros.dataFim) {
      window.alert('Selecione o periodo completo (De e Ate) para gerar o PDF.');
      return;
    }

    await carregarHistoricoRecenteRelatorios(true);
    await carregarIndicadoresRelatorio(true);

    try {
      const historicosPdf = await buscarHistoricosRelatorio({
        usandoFiltros: true,
        filtros,
        limit: undefined,
      });

      if (!historicosPdf.length) {
        window.alert(
          'Nenhuma movimentacao encontrada para o periodo selecionado.',
        );
        return;
      }

      gerarPdfRelatorio(historicosPdf, filtros);
    } catch {
      window.alert('Nao foi possivel gerar o PDF do relatorio.');
    }
  });
}

void (async function initRelatorios() {
  await Promise.all([carregarTiposRelatorio(), carregarStatusRelatorio()]);
  await Promise.all([
    carregarHistoricoRecenteRelatorios(false),
    carregarIndicadoresRelatorio(false),
  ]);
})();
