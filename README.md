# Sistema de Controle de Entrada de Documentos (SCED)

<p>
  <img alt="Status" src="https://img.shields.io/badge/status-em%20desenvolvimento-1f6feb" />
  <img alt="Disciplina" src="https://img.shields.io/badge/disciplina-F%C3%A1brica%20de%20Software-0a7ea4" />
  <img alt="Instituição" src="https://img.shields.io/badge/institui%C3%A7%C3%A3o-Unicesumar%20Londrina-2e7d32" /><br />
  <img alt="Versão" src="https://img.shields.io/badge/version-1.0.0-6f42c1" />
</p>

Projeto acadêmico voltado ao controle de entrada, acompanhamento e rastreabilidade de documentos em instituições públicas e privadas.

## Informações do Projeto


**Projeto:** Sistema de Controle de Entrada de Documentos (SCED)  
**Disciplina:** Fábrica de Software  
**Instituição:** Unicesumar Londrina

<a id="sumario"></a>

## Sumário

- [Integrantes do Grupo](#integrantes-do-grupo)
- [Objetivo](#objetivo)
- [Contexto e Problema](#contexto-e-problema)
- [Proposta de Solução](#proposta-de-solução)
- [Escopo do Sistema](#escopo-do-sistema)
- [Stakeholders](#stakeholders)
- [Arquitetura Atual](#arquitetura-atual)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Executar o Projeto](#como-executar-o-projeto)
- [Configuração de Ambiente](#configuração-de-ambiente)
- [Documentação da API](#documentação-da-api)
- [Testes de Rotas com REST Client](#testes-de-rotas-com-rest-client)
- [Mudanças Recentes](#mudanças-recentes)
- [Solução de Problemas](#solução-de-problemas)
- [Perfis de Usuário](#perfis-de-usuário)
- [Requisitos Funcionais](#requisitos-funcionais)
- [Requisitos Não Funcionais](#requisitos-não-funcionais)
- [Requisitos de Interface](#requisitos-de-interface)
- [Critérios de Sucesso](#critérios-de-sucesso)
- [Casos de Uso](#casos-de-uso)
- [Modelo Entidade-Relacionamento (MER)](#modelo-entidade-relacionamento-mer)
- [Protótipo de Telas](#protótipo-de-telas)
- [Licença](#licença)

## Integrantes do Grupo


<table border="1" cellspacing="0" cellpadding="6">
  <thead>
    <tr>
      <th>RA</th>
      <th>Nome Completo</th>
      <th>Papel no Projeto</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>24055201-2</td>
      <td>João Vinicius</td>
      <td>QA / Testes</td>
    </tr>
    <tr>
      <td>24485768-2</td>
      <td>Mateus Yano</td>
      <td>Scrum Master</td>
    </tr>
    <tr>
      <td>24263225-2</td>
      <td>Rogher Adriano</td>
      <td>Desenvolvedor / Documentação</td>
    </tr>
    <tr>
      <td>24498523-2</td>
      <td>Thiago Emed</td>
      <td>Documentação / QA</td>
    </tr>
  </tbody>
</table>

## Objetivo

[Voltar ao Sumário](#sumario)

Desenvolver um sistema web para controlar a entrada de documentos, permitindo registrar, consultar e acompanhar documentos recebidos por uma instituição.

O SCED busca melhorar a organização, a rastreabilidade e a segurança das informações, substituindo processos manuais e planilhas.

## Contexto e Problema

[Voltar ao Sumário](#sumario)

Instituições públicas e privadas recebem diariamente documentos como:

- Ofícios
- Memorandos
- Contratos
- Requerimentos
- Notificações

Em muitos cenários, o controle ainda é feito por planilhas ou registros manuais, gerando problemas como:

- Perda de documentos
- Falta de histórico de movimentação
- Dificuldade para localizar documentos
- Falta de controle de status
- Baixa confiabilidade das informações

## Proposta de Solução

[Voltar ao Sumário](#sumario)

O SCED propõe um sistema web para controle de entrada e acompanhamento de documentos com:

- Registro de documentos com número de protocolo
- Consulta rápida por diferentes critérios
- Controle de status
- Histórico de movimentação
- Geração de relatórios
- Controle de usuários e permissões

## Escopo do Sistema

[Voltar ao Sumário](#sumario)

**O sistema permitirá:**

- Cadastro de usuários
- Registro de documentos recebidos
- Consulta de documentos cadastrados
- Alteração de status dos documentos
- Histórico de movimentação
- Relatórios simples de documentos

**O sistema não incluirá:**

- Assinatura digital
- Integração com outros sistemas
- Armazenamento de documentos físicos digitalizados

## Stakeholders

[Voltar ao Sumário](#sumario)

<table border="1" cellspacing="0" cellpadding="6">
  <thead>
    <tr>
      <th>Stakeholder</th>
      <th>Interesse</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Funcionários da instituição</td>
      <td>Registrar e consultar documentos</td>
    </tr>
    <tr>
      <td>Administradores do sistema</td>
      <td>Gerenciar usuários e permissões</td>
    </tr>
    <tr>
      <td>Setores internos</td>
      <td>Acompanhar andamento de documentos</td>
    </tr>
    <tr>
      <td>Equipe de desenvolvimento</td>
      <td>Implementar e manter o sistema</td>
    </tr>
  </tbody>
</table>

## Arquitetura Atual

[Voltar ao Sumário](#sumario)

O projeto está estruturado em duas camadas principais:

- Front-end estático com páginas HTML, CSS e JavaScript em `assets/`.
- Back-end em NestJS com TypeORM e PostgreSQL para persistência real dos dados.

Módulos de domínio no back-end:

- Usuários
- Tipos de Documento
- Status de Documento
- Documentos
- Histórico

Todos os CRUDs acima já estão conectados ao banco de dados via repositórios TypeORM.

## Tecnologias Utilizadas

[Voltar ao Sumário](#sumario)

  <img alt="Camada Front-end" src="https://img.shields.io/badge/Camada-Front--end-0A7EA4?style=flat-square" />
<p>
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=111111" />
  <img alt="Bootstrap" src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" />
  <img alt="Figma" src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" />
</p>

  <img alt="Camada Back-end" src="https://img.shields.io/badge/Camada-Back--end-1F6FEB?style=flat-square" />
<p>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img alt="NestJS" src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img alt="TypeORM" src="https://img.shields.io/badge/TypeORM-FE6D73?style=for-the-badge" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>

## Como Executar o Projeto

[Voltar ao Sumário](#sumario)

Pré-requisitos:

- Node.js 20+
- NPM 10+
- PostgreSQL ativo

Instalação:

```bash
npm install
```

Execução em desenvolvimento:

```bash
npm run start:dev
```

Build de produção:

```bash
npm run build
npm run start:prod
```

Scripts úteis:

- `npm run start`: inicia sem watch.
- `npm run start:debug`: inicia com debug/watch.
- `npm run lint`: executa lint com correções automáticas.
- `npm run test`: executa testes unitários.

## Configuração de Ambiente

[Voltar ao Sumário](#sumario)

Variáveis de ambiente suportadas:

- `PORT` (padrão: 3000)
- `DB_HOST` (padrão: localhost)
- `DB_PORT` (padrão: 5433)
- `DB_USER` (padrão: postgres)
- `DB_PASSWORD` (padrão: sua senha)
- `DB_NAME` (padrão: postgres)

Exemplo de `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=sua senha
DB_NAME=postgres
```

## Documentação da API

[Voltar ao Sumário](#sumario)

Base URL local:

- `http://localhost:3000` (ou próxima porta livre, quando 3000 estiver ocupada)

Endpoints principais:

- `GET /` health check
- `POST /usuarios/login` autenticação simples por email/senha
- `POST /usuarios` criar usuário
- `GET /usuarios` listar usuários
- `GET /usuarios/:id` buscar usuário
- `PATCH /usuarios/:id` atualizar usuário
- `DELETE /usuarios/:id` remover usuário
- `POST /tipos-documento` criar tipo
- `GET /tipos-documento` listar tipos
- `GET /tipos-documento/:id` buscar tipo
- `PATCH /tipos-documento/:id` atualizar tipo
- `DELETE /tipos-documento/:id` remover tipo
- `POST /status-documento` criar status
- `GET /status-documento` listar status
- `GET /status-documento/:id` buscar status
- `PATCH /status-documento/:id` atualizar status
- `DELETE /status-documento/:id` remover status
- `POST /documentos` criar documento
- `GET /documentos` listar documentos
- `GET /documentos/:id` buscar documento
- `PATCH /documentos/:id` atualizar documento
- `DELETE /documentos/:id` remover documento
- `POST /historicos` criar histórico
- `GET /historicos` listar históricos
- `GET /historicos/:id` buscar histórico
- `PATCH /historicos/:id` atualizar histórico
- `DELETE /historicos/:id` remover histórico

Validações implementadas:

- DTOs com class-validator em todos os cadastros.
- ValidationPipe global com `whitelist` e `transform`.
- Restrições de unicidade para email, protocolo, nome de tipo e nome de status.

## Testes de Rotas com REST Client

[Voltar ao Sumário](#sumario)

O arquivo `client.rest` contém cenários completos para validar todos os módulos.

Melhorias recentes no arquivo de testes:

- Variável de porta (`@port`) para alinhar com a porta real em execução.
- Dados dinâmicos com timestamp para evitar conflito de unicidade.
- Encadeamento de requisições com captura de IDs retornados.

Fluxo recomendado:

1. Iniciar o back-end com `npm run start:dev`.
2. Ajustar a variável `@port` no `client.rest` se necessário.
3. Executar as requisições na ordem do arquivo.

## Mudanças Recentes

[Voltar ao Sumário](#sumario)

- CRUDs migrados para persistência real em PostgreSQL com TypeORM.
- Módulos e serviços atualizados para uso de repositórios.
- Entidades e relacionamentos definidos para Usuário, Documento, Tipo, Status e Histórico.
- Validação de payloads habilitada globalmente.
- Login de usuário em `POST /usuarios/login`.
- Ajuste no bootstrap para evitar falha por porta ocupada:
  - Quando a porta configurada estiver em uso, a aplicação sobe automaticamente na próxima porta livre.

## Solução de Problemas

[Voltar ao Sumário](#sumario)

### Erro: EADDRINUSE (porta já em uso)

- Causa: porta já ocupada por outro processo.
- Situação atual: o sistema já possui fallback automático para próxima porta livre.
- Ação: conferir no log em qual porta a aplicação subiu e atualizar `@port` no `client.rest`.

### Erros de chave única no banco (409/500)

- Causa: reutilização de email/protocolo/tipo/status já existentes.
- Ação: usar os testes dinâmicos do `client.rest` ou alterar os valores antes de reenviar.

## Perfis de Usuário

[Voltar ao Sumário](#sumario)

**Administrador**  
Responsável pela administração do sistema.

Funções:

- Cadastrar usuários
- Cadastrar tipos de documentos
- Gerenciar permissões

**Operador**  
Responsável pela operação diária do sistema.

Funções:

- Registrar documentos
- Consultar documentos
- Atualizar status
- Gerar relatórios

## Requisitos Funcionais

[Voltar ao Sumário](#sumario)

- **RF01:** Cadastro de usuários (Administrador e Operador).
- **RF02:** Login com autenticação.
- **RF03:** Cadastro de tipos de documentos.
- **RF04:** Registro de entrada de documentos com protocolo automático.
- **RF05:** Consulta por protocolo, remetente, tipo e período.
- **RF06:** Alteração de status (Recebido, Em análise, Encaminhado, Finalizado).
- **RF07:** Histórico de movimentação.
- **RF08:** Relatório simples com filtros.

## Requisitos Não Funcionais

[Voltar ao Sumário](#sumario)

- **RNF01:** Sistema web responsivo.
- **RNF02:** Controle de acesso por perfil.
- **RNF03:** Banco de dados relacional.
- **RNF04:** Versionamento no GitHub.
- **RNF05:** Interface amigável.
- **RNF06:** Registro de logs.

## Requisitos de Interface

[Voltar ao Sumário](#sumario)

O sistema deverá possuir as seguintes telas:

- Tela de login
- Tela de cadastro de usuários
- Tela de cadastro de tipos de documentos
- Tela de registro de documentos
- Tela de consulta de documentos
- Tela de alteração de status
- Tela de relatórios

O protótipo das telas será desenvolvido na segunda entrega do projeto.

## Critérios de Sucesso

[Voltar ao Sumário](#sumario)

O projeto será considerado bem-sucedido se:

- O sistema permitir registrar documentos corretamente
- As consultas funcionarem de forma rápida
- O controle de status estiver funcionando
- O histórico de movimentação for registrado
- O sistema possuir autenticação de usuários

## Casos de Uso

[Voltar ao Sumário](#sumario)

![Casos de Uso](assets/img/Caso%20de%20Uso%20SCED.png)

### Atores do Sistema

**Administrador**

- Cadastrar usuários
- Cadastrar tipos de documentos
- Gerenciar permissões

**Operador**

- Registrar documentos
- Consultar documentos
- Alterar status
- Gerar relatórios
- Visualizar histórico

### Lista de Casos de Uso

- **UC01 - Realizar Login:** permite que usuários autenticados acessem o sistema.
- **UC02 - Cadastrar Usuários:** administrador cadastra novos usuários.
- **UC03 - Cadastrar Tipos de Documento:** administrador define categorias de documentos.
- **UC04 - Registrar Documento:** operador registra entrada de documento e gera protocolo.
- **UC05 - Consultar Documento:** busca por protocolo, remetente, tipo e período.
- **UC06 - Alterar Status do Documento:** atualizar status para Recebido, Em análise, Encaminhado e Finalizado.
- **UC07 - Visualizar Histórico:** consultar movimentações realizadas.
- **UC08 - Gerar Relatórios:** gerar relatório com filtros.

## Modelo Entidade-Relacionamento (MER)

[Voltar ao Sumário](#sumario)

![MER](<assets/img/Modelo%20Entidade-Relacionamento%20(MER)%20SCED.png>)

O MER representa a estrutura de dados do SCED e define as entidades principais (Usuário, Documento, TipoDocumento, StatusDocumento e Histórico) e seus relacionamentos.

### Tabela: Usuário

<table border="1" cellspacing="0" cellpadding="6">
  <thead>
    <tr>
      <th>Campo</th>
      <th>Tipo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>id_usuario</td>
      <td>int (PK)</td>
    </tr>
    <tr>
      <td>nome</td>
      <td>varchar</td>
    </tr>
    <tr>
      <td>email</td>
      <td>varchar</td>
    </tr>
    <tr>
      <td>senha</td>
      <td>varchar</td>
    </tr>
    <tr>
      <td>perfil</td>
      <td>varchar (admin / operador)</td>
    </tr>
  </tbody>
</table>

### Tabela: TipoDocumento

<table border="1" cellspacing="0" cellpadding="6">
  <thead>
    <tr>
      <th>Campo</th>
      <th>Tipo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>id_tipo</td>
      <td>int (PK)</td>
    </tr>
    <tr>
      <td>nome_tipo</td>
      <td>varchar</td>
    </tr>
    <tr>
      <td>descricao</td>
      <td>varchar</td>
    </tr>
  </tbody>
</table>

### Tabela: Documento

<table border="1" cellspacing="0" cellpadding="6">
  <thead>
    <tr>
      <th>Campo</th>
      <th>Tipo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>id_documento</td>
      <td>int (PK)</td>
    </tr>
    <tr>
      <td>protocolo</td>
      <td>varchar</td>
    </tr>
    <tr>
      <td>remetente</td>
      <td>varchar</td>
    </tr>
    <tr>
      <td>data_entrada</td>
      <td>date</td>
    </tr>
    <tr>
      <td>id_tipo</td>
      <td>int (FK)</td>
    </tr>
  </tbody>
</table>

### Tabela: StatusDocumento

<table border="1" cellspacing="0" cellpadding="6">
  <thead>
    <tr>
      <th>Campo</th>
      <th>Tipo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>id_status</td>
      <td>int (PK)</td>
    </tr>
    <tr>
      <td>nome_status</td>
      <td>varchar</td>
    </tr>
  </tbody>
</table>

Valores possíveis: Recebido, Em análise, Encaminhado e Finalizado.

### Tabela: Histórico

<table border="1" cellspacing="0" cellpadding="6">
  <thead>
    <tr>
      <th>Campo</th>
      <th>Tipo</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>id_historico</td>
      <td>int (PK)</td>
    </tr>
    <tr>
      <td>id_documento</td>
      <td>int (FK)</td>
    </tr>
    <tr>
      <td>id_status</td>
      <td>int (FK)</td>
    </tr>
    <tr>
      <td>data_movimentacao</td>
      <td>datetime</td>
    </tr>
    <tr>
      <td>id_usuario</td>
      <td>int (FK)</td>
    </tr>
  </tbody>
</table>

### Relacionamentos

- **Usuário 1:N Histórico:** um usuário pode aparecer em vários históricos e cada histórico pertence a um usuário.
- **Documento 1:N Histórico:** um documento pode aparecer em vários históricos e cada histórico pertence a um documento.
- **Documento N:1 TipoDocumento:** vários documentos podem ter um mesmo tipo.
- **Documento N:1 StatusDocumento:** vários registros podem compartilhar um mesmo status.

## Protótipo de Telas

[Voltar ao Sumário](#sumario)

[![Abrir Protótipo no Figma](https://img.shields.io/badge/Abrir%20Prot%C3%B3tipo%20no%20Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/proto/uZ6IFe5GIKS7Eq1wjR0BBx/SCED?page-id=0%3A1&node-id=35-344&viewport=952%2C281%2C0.25&t=sRN9LcDoM4l3ZRbf-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=10%3A130)

![Login](assets/img/Tela%20Login%20SCED.png)
![Dashboard](assets/img/Dashboard%20SCED.png)
![Cadastro de Documento](assets/img/Registro%20Documento%20SCED.png)
![Consulta de Documentos](assets/img/Consulta%20SCED.png)
![Relatório](assets/img/Relatorios%20SCED.png)
![Gerenciamento de Usuários](assets/img/Gerenciamento%20Usuarios%20SCED.png)

## Licença

[Voltar ao Sumário](#sumario)

Este projeto está licenciado sob os termos da licença MIT.

Consulte o arquivo `LICENSE` para mais detalhes.
