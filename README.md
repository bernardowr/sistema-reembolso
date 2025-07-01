# Sistema de Reembolso

Este é um sistema desktop para controle e geração de relatórios de despesas para reembolso, desenvolvido com Electron e JavaScript puro, utilizando o padrão de arquitetura MVC.

## Funcionalidades

- Cadastro de colaborador, empresa e período do relatório.
- Lançamento de despesas por tipo:
  - **Km Rodado** (cálculo automático do valor com base na quilometragem)
  - **Alimentação**
  - **Outras Despesas**
- Edição e exclusão de lançamentos de reembolso.
- Cálculo automático do total de despesas.
- Campo para observações gerais.
- Geração de relatório pronto para impressão, incluindo campos para assinaturas.
- Interface amigável, responsiva e otimizada para impressão.

## Tecnologias Utilizadas

- [Electron](https://www.electronjs.org/) (desktop)
- HTML5, CSS3, JavaScript (padrão MVC)

## Como Executar Localmente

1. **Pré-requisitos:**
   - [Node.js](https://nodejs.org/) instalado
   - [npm](https://www.npmjs.com/) instalado

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Inicie o sistema:**

   ```bash
   npm start
   ```

O sistema será aberto em uma janela desktop.

## Estrutura do Projeto

- `main.js`: Inicialização do Electron e da janela principal
- `app.js`: Lógica do sistema (MVC)
- `index.html`: Interface do usuário
- `style.css`: Estilos visuais e otimização para impressão

## Observações

- O valor do reembolso por Km rodado é calculado automaticamente (R$ 1,50 por km).
- O sistema é totalmente offline e não armazena dados após o fechamento.
- O relatório gerado pode ser impresso diretamente pelo botão "Imprimir".

---

Desenvolvido para facilitar o controle de despesas e reembolsos de colaboradores de forma simples e eficiente. 