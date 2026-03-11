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

## Sumário
- [Integrantes do Grupo](#integrantes-do-grupo)
- [Objetivo](#objetivo)
- [Contexto e Problema](#contexto-e-problema)
- [Proposta de Solução](#proposta-de-solução)
- [Escopo do Sistema](#escopo-do-sistema)
- [Stakeholders](#stakeholders)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
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
Desenvolver um sistema web para controlar a entrada de documentos, permitindo registrar, consultar e acompanhar documentos recebidos por uma instituição.

O SCED busca melhorar a organização, a rastreabilidade e a segurança das informações, substituindo processos manuais e planilhas.

## Contexto e Problema
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
O SCED propõe um sistema web para controle de entrada e acompanhamento de documentos com:
- Registro de documentos com número de protocolo
- Consulta rápida por diferentes critérios
- Controle de status
- Histórico de movimentação
- Geração de relatórios
- Controle de usuários e permissões

## Escopo do Sistema
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

## Tecnologias Utilizadas
<p>
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img alt="Bootstrap" src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" />
  <img alt="Figma" src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" />
</p>

## Perfis de Usuário
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
- **RF01:** Cadastro de usuários (Administrador e Operador).
- **RF02:** Login com autenticação.
- **RF03:** Cadastro de tipos de documentos.
- **RF04:** Registro de entrada de documentos com protocolo automático.
- **RF05:** Consulta por protocolo, remetente, tipo e período.
- **RF06:** Alteração de status (Recebido, Em análise, Encaminhado, Finalizado).
- **RF07:** Histórico de movimentação.
- **RF08:** Relatório simples com filtros.

## Requisitos Não Funcionais
- **RNF01:** Sistema web responsivo.
- **RNF02:** Controle de acesso por perfil.
- **RNF03:** Banco de dados relacional.
- **RNF04:** Versionamento no GitHub.
- **RNF05:** Interface amigável.
- **RNF06:** Registro de logs.

## Requisitos de Interface
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
O projeto será considerado bem-sucedido se:
- O sistema permitir registrar documentos corretamente
- As consultas funcionarem de forma rápida
- O controle de status estiver funcionando
- O histórico de movimentação for registrado
- O sistema possuir autenticação de usuários

## Casos de Uso
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
![MER](assets/img/Modelo%20Entidade-Relacionamento%20(MER)%20SCED.png)

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
[![Abrir Protótipo no Figma](https://img.shields.io/badge/Abrir%20Prot%C3%B3tipo%20no%20Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/proto/uZ6IFe5GIKS7Eq1wjR0BBx/SCED?page-id=0%3A1&node-id=35-344&viewport=952%2C281%2C0.25&t=sRN9LcDoM4l3ZRbf-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=10%3A130)

![Login](assets/img/Tela%20Login%20SCED.png)
![Dashboard](assets/img/Dashboard%20SCED.png)
![Cadastro de Documento](assets/img/Registro%20Documento%20SCED.png)
![Consulta de Documentos](assets/img/Consulta%20SCED.png)
![Relatório](assets/img/Relatorios%20SCED.png)
![Gerenciamento de Usuários](assets/img/Gerenciamento%20Usuarios%20SCED.png)

## Licença
Este projeto está licenciado sob os termos da licença MIT.

Consulte o arquivo `LICENSE` para mais detalhes.