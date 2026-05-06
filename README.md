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

- [Guia Rápido (Clone até Primeiro Login)](#guia-rapido-clone-ate-primeiro-login)
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

<a id="guia-rapido-clone-ate-primeiro-login"></a>

## Guia Rápido (Clone até Primeiro Login)


Use este bloco apenas como checklist. O passo a passo está completo nas seções abaixo.

1. Clone e instale as dependências.
2. Suba o PostgreSQL (Docker ou instância local).
3. Configure o ambiente no arquivo .env.
4. Inicie com npm run start:dev.
5. Acesse login.html, crie o primeiro admin e faça login.

Detalhamento:

- Execução: [Como Executar o Projeto](#como-executar-o-projeto)
- Ambiente e HTTPS: [Configuração de Ambiente](#configuração-de-ambiente)
- API e autenticação: [Documentação da API](#documentação-da-api)
- Testes por arquivo REST: [Testes de Rotas com REST Client](#testes-de-rotas-com-rest-client)

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
- PostgreSQL ativo (local) ou Docker Desktop
- Docker Desktop em execução com **Linux Engine** (Windows)

Clone do projeto:

```bash
git clone https://github.com/RogherSoares/SCED-Sistema-de-Controle-de-Entrada-de-Documentos.git
cd SCED-Sistema-de-Controle-de-Entrada-de-Documentos
```

Instalação:

```bash
npm install
```

Execução em desenvolvimento:

```bash
npm run start:dev
```

Ao iniciar, acompanhe o log final para confirmar protocolo e porta em uso.

### Banco com Docker (recomendado)

Suba apenas o PostgreSQL via Docker Compose:

```bash
docker compose up -d db
```

Verifique se o container está saudável:

```bash
docker compose ps
```

Para parar o banco:

```bash
docker compose stop db
```

Para derrubar e remover o container (mantendo volume):

```bash
docker compose down
```

As variáveis de conexão já estão no arquivo `.env`:

- `DB_HOST=localhost`
- `DB_PORT=5433`
- `DB_USER=postgres`
- `DB_PASSWORD=<sua_senha>`
- `DB_NAME=postgres`

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
- `DB_SSL` (`true` para TLS no PostgreSQL)
- `DB_SSL_REJECT_UNAUTHORIZED` (`false` em ambiente de dev com certificado self-signed)
- `JWT_SECRET` (segredo de assinatura do token JWT)
- `JWT_EXPIRES_IN` (padrão: `1d`)
- `BCRYPT_SALT_ROUNDS` (padrão: `12`)
- `HTTPS_ENABLED` (`true` para subir o NestJS com HTTPS)
- `HTTPS_KEY_PATH` (caminho absoluto da chave privada `.key`)
- `HTTPS_CERT_PATH` (caminho absoluto do certificado `.pem`/`.crt`)

Exemplo de `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=sua senha
DB_NAME=postgres
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=true
JWT_SECRET=troque-este-segredo-em-producao
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=12
HTTPS_ENABLED=false
HTTPS_KEY_PATH=
HTTPS_CERT_PATH=
```

Checklist recomendado antes de iniciar:

- Definir `JWT_SECRET` forte em ambiente real.
- Garantir que `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` e `DB_NAME` batem com o PostgreSQL.
- Se for usar Docker para banco, manter `DB_PORT` alinhada com o `docker-compose.yml`.

### HTTPS local sem aviso de "conexao nao segura"

Para o navegador remover o aviso, nao basta ativar HTTPS: o certificado precisa ser confiavel na maquina cliente.

1. Instale o `mkcert` no Windows.
2. Rode `mkcert -install` para instalar a CA local confiavel.
3. Gere certificado com os hosts usados no acesso:

```bash
mkcert localhost 127.0.0.1 ::1
```

Se precisar acessar por outro hostname/IP na rede local, inclua esse endereço explicitamente no comando `mkcert`.

1. Preencha no `.env`:

```env
HTTPS_ENABLED=true
HTTPS_KEY_PATH=certs/local-key.pem
HTTPS_CERT_PATH=certs/local-cert.pem
```

1. Reinicie a aplicacao e acesse por `https://localhost:3000` (ou pelo IP incluido no certificado).

Se acessar por IP/host diferente do certificado, o navegador continuara marcando como nao seguro.

Importante: para acesso em outro computador, a CA do `mkcert` tambem precisa estar instalada nesse computador (`mkcert -install`).

## Documentação da API

[Voltar ao Sumário](#sumario)

Base URL local:

- `http://localhost:3000` quando `HTTPS_ENABLED=false`
- `https://localhost:3000` quando `HTTPS_ENABLED=true`
- Se a porta 3000 estiver ocupada, a aplicação sobe na próxima porta livre (ver log no terminal)

Endpoints principais:

- `GET /` health check
- `POST /usuarios/login` autenticação por email/senha com retorno de token JWT
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
- `POST /documentos/upload` upload de arquivo anexado ao documento
- `DELETE /documentos/upload?arquivoUrl=...` deletar arquivo upload
- `GET /documentos/next-protocolo` gerar próximo protocolo (ano.numero)
- `GET /documentos/metrics/dashboard` métricas para dashboard (recebidos, análise, encaminhados, finalizados)

Autenticação e autorização:

- Rotas protegidas exigem header `Authorization: Bearer <token>`.
- Rotas públicas atuais: `GET /`, `POST /usuarios/login`, `POST /usuarios`.
- As senhas são armazenadas com hash `bcrypt`.
- Front-end envia o token automaticamente após login (via script `assets/js/auth.js`).
- Endpoints de administração de usuários/listagem e remoção exigem perfil `admin`.
- Cadastro/edição/exclusão de tipos e status de documento exigem perfil `admin`.

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
2. Ajustar a base URL (`http` ou `https`) no `client.rest` conforme o protocolo ativo.
3. Executar o login (`POST /usuarios/login`) e copiar o `accessToken` retornado.
4. Enviar `Authorization: Bearer <token>` nas rotas protegidas.
5. Executar as demais requisições na ordem do arquivo.

## Mudanças Recentes

[Voltar ao Sumário](#sumario)

### Sistema de Upload de Arquivos

- **Funcionalidade:** Páginas de registro e consulta agora suportam upload de arquivos anexados ao documento.
- **Formatos suportados:** PDF, Word (DOC, DOCX), PowerPoint (PPT, PPTX), Excel (XLS, XLSX), imagens (JPG, PNG, GIF), arquivos compactados (ZIP, RAR) e texto (TXT).
- **Limite de tamanho:** 15 MB por arquivo.
- **Barra de progresso:** Durante o upload, uma barra visual mostra o progresso em tempo real (0-100%).
- **Armazenamento:** Arquivos são salvos na pasta `/uploads` com nomes únicos (timestamp + sufixo aleatório).
- **Endpoints:**
  - `POST /documentos/upload` - Upload multipart form-data.
  - `DELETE /documentos/upload?arquivoUrl=...` - Remover arquivo enviado.

### Visualização de Arquivos

- **Funcionalidade:** Links para abrir arquivos em nova aba/janela em todas as páginas de listagem (consulta, dashboard).
- **Compatibilidade:** Tratamento automático de URLs legadas (formatos antigos como `anexo://`, nomes simples, barras invertidas).
- **Fallback:** Se arquivo não existir ou URL estiver quebrada, mensagem amigável avisa ao usuário: _"Arquivo não encontrado... faça novo upload..."_.
- **Segurança:** Validação via HEAD request antes de abrir arquivo.

### Operador Menu

- **Funcionalidade:** Card do operador na página de dashboard agora é clicável e abre um menu flutuante.
- **Opções:** Menu contém botão para alteração de senha.
- **Alteração de Senha:**
  - Modal com campos: senha nova, confirmação de senha.
  - Validação obrigatória: mínimo 6 caracteres, confirmação deve corresponder.
  - Endpoint: `PATCH /usuarios/{id}` com payload `{ senha: "nova-senha" }`.

### Página de Consulta (Consulta.html)

- Permite filtrar documentos por protocolo, remetente e status.
- Exibe tabela com documentos registrados e histórico de movimentação.
- Botões interativos para cada documento:
  - **Histórico:** consulta eventos relacionados ao documento.
  - **Alterar Status:** muda status para (Recebido, Em análise, Encaminhado, Finalizado).
  - **Visualizar Arquivo:** abre arquivo em nova aba se disponível.

### Dashboard (Index.html)

- Exibe métricas: total de documentos recebidos, em análise, encaminhados e finalizados.
- Tabela com documentos recentes filtrados por status.
- Card do operador (clicável) com menu de acesso rápido.
- Botão para visualizar arquivos anexados (mesma lógica da consulta).

### Protocolo Automático

- Gerado no formato `AAAA.NUMERO` (ex: 2026.0001).
- Incrementa sequencialmente dentro de cada ano.
- Campo de protocolo é somente leitura no formulário de registro.

### Banco de Dados PostgreSQL

- CRUDs migrados para persistência real em PostgreSQL com TypeORM.
- Módulos e serviços atualizados para uso de repositórios.
- Entidades e relacionamentos definidos para Usuário, Documento, Tipo, Status e Histórico.
- Sincronização de schema automática (synchronize: true).
- Carregamento automático de entidades (autoLoadEntities: true).

### Suporte Docker

- Arquivo `docker-compose.yml` com serviço PostgreSQL 16-Alpine.
- Volume persistente `sced_pgdata` para dados do banco.
- Healthcheck automático (`pg_isready`).
- Porta mapeada: container 5432 → host 5433 (conforme `.env`).
- Variáveis de ambiente pré-configuradas no arquivo `.env`.

### Ajustes Adicionais

- Ajuste no bootstrap para evitar falha por porta ocupada: quando a porta configurada estiver em uso, a aplicação sobe automaticamente na próxima porta livre.

## Solução de Problemas

[Voltar ao Sumário](#sumario)

### Erro: EADDRINUSE (porta já em uso)

- Causa: porta já ocupada por outro processo.
- Situação atual: o sistema já possui fallback automático para próxima porta livre.
- Ação: conferir no log em qual porta a aplicação subiu e atualizar `@port` no `client.rest`.

### Conexão com PostgreSQL Docker

- **Verificar se container está rodando:**

  ```bash
  docker ps
  ```

- **Verificar logs do container:**

  ```bash
  docker compose logs db
  ```

- **Conectar com psql (opcional, para debug):**

  ```bash
  docker compose exec db psql -U postgres
  ```

- **Erros de senha/conexão:**
  - Confirme que a senha no `.env` (DB_PASSWORD) corresponde à senha do container Docker.
  - Se criou container com comando manual, certifique-se da porta: deve ser `-p 5433:5432` (host:container).

- **Remover e recriar container com a senha correta:**

  ```bash
  docker compose down
  docker compose up -d
  ```

### Erros de chave única no banco (409/500)

- Causa: reutilização de email/protocolo/tipo/status já existentes.
- Ação: usar os testes dinâmicos do `client.rest` ou alterar os valores antes de reenviar.

### Arquivo não encontrado ao visualizar

- Mensagem: _"Arquivo não encontrado... faça novo upload..."_
- Causa: arquivo foi deletado ou URL está quebrada (formato legado não encontrado).
- Ação: fazer novo upload do arquivo via página de registro.

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
- **RF02:** Login com autenticação de dois fatores (Confirmação via e-mail).
- **RF03:** Cadastro de tipos de documentos (Exemplo:certificado de cursos, comprovante de residência).
- **RF04:** Registro de entrada de documentos com protocolo automático.
- **RF05:** Consulta por protocolo, remetente, tipo e período.
- **RF06:** Alteração de status (Recebido, Em análise, Encaminhado, Finalizado).
- **RF07:** Histórico de movimentação.
- **RF08:** Relatório simples com filtros.
- **RF09:** Upload de arquivos anexados ao documento com suporte a múltiplos formatos (PDF, Word (DOC, DOCX), PowerPoint (PPT, PPTX), Excel (XLS, XLSX), imagens (JPG, PNG, GIF), arquivos compactados (ZIP, RAR) e texto (TXT)).
- **RF10:** Visualização de arquivos anexados em nova aba.
- **RF11:** Menu de operador para alteração de senha.
- **RF12:** Dashboard com métricas e filtros por status.

## Requisitos Não Funcionais

[Voltar ao Sumário](#sumario)

- **RNF01:** Sistema web responsivo.
- **RNF02:** Controle de acesso por perfil.
- **RNF03:** Banco de dados relacional.
- **RNF04:** Versionamento no GitHub.
- **RNF05:** Interface amigável.
- **RNF06:** Registro de logs.

## Análise de Conformidade entre código e README

[Voltar ao Sumário](#sumario)

- **RF01:** cadastro de usuários está implementado no back-end com criação e proteção por perfil.
- **RF02:** autenticação de dois fatores por e-mail **não está implementada** no código atual; o login usa apenas email/senha e JWT.
- **RF03:** cadastro de tipos de documento está presente e upload aceita muitos formatos de arquivo.
- **RF04:** protocolo automático está implementado em `GET /documentos/next-protocolo` com formato `AAAA.NNNN`.
- **RF05:** consulta por protocolo, remetente, tipo e status está implementada, mas **falta filtro por período** em `GET /documentos`.
- **RF06:** alteração de status está disponível via `PATCH /documentos/:id`.
- **RF07:** histórico de movimentação está implementado no módulo `historico`.
- **RF08:** filtros de relatório existem no serviço de histórico, incluindo data, tipo e status.
- **RF09:** upload de arquivos anexados está implementado com limite de 15 MB e exclusão de arquivo.
- **RF10:** arquivos em `/uploads` podem ser servidos pelo servidor, compatível com visualização em nova aba.
- **RF11:** alteração de senha de operador é possível via `PATCH /usuarios/:id`.
- **RF12:** dashboard de métricas está disponível em `GET /documentos/metrics/dashboard`.

### Observações técnicas

- O controle de acesso por perfil está ativo com `JwtAuthGuard` e `RolesGuard` no módulo principal.
- O banco relacional PostgreSQL está configurado em `src/app/app.module.ts` com TypeORM.
- Logging existe apenas como `console.log`/`console.warn` em `src/main.ts`; não há sistema de logs avançado.
- A funcionalidade de autenticação de dois fatores mencionada no README não está presente e deve ser implementada separadamente.

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

Valores que são possíveis: Recebido, Em análise, Encaminhado e Finalizado.

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

## Conclusões dos Testes

Os testes realizados no sistema SCED confirmaram que as principais funcionalidades estão funcionando corretamente. Aqui estão os destaques:

- **Autenticação e Controle de Acesso**: O sistema redireciona usuários não autenticados para a página de login e restringe o acesso a funcionalidades administrativas para usuários com perfil de administrador.
- **Dashboard**: As métricas são carregadas corretamente e exibem os dados atualizados do sistema.
- **Registro e Consulta de Documentos**: As funcionalidades de registro, consulta e alteração de status de documentos estão operando conforme esperado.
- **Histórico de Movimentação**: O histórico de movimentação dos documentos é exibido corretamente, com todas as informações relevantes.
- **Relatórios**: A geração de relatórios está funcionando e os arquivos são gerados no formato esperado.

Os testes foram realizados tanto de forma manual quanto automatizada, e o sistema demonstrou estabilidade e conformidade com os requisitos definidos.

## Licença

[Voltar ao Sumário](#sumario)

Este projeto está licenciado sob os termos da licença MIT.

Consulte o arquivo `LICENSE` para mais detalhes.
