# Agente-Codificador

Um assistente de desenvolvimento de software autônomo e minimalista para Windows.

## 📋 Descrição

**Agente-Codificador** é um programa de desktop que atua como um Engenheiro de Software Sênior autônomo. Ele recebe objetivos de alto nível do usuário (ex: "Crie um site de portfólio usando React") e decompõe essa tarefa em um plano executável, operando em um loop autônomo de Planejar-Executar-Refletir até que o objetivo seja alcançado.

## ✨ Características

### Arquitetura do Sistema

- **Backend Agent**: Sistema de IA com ciclo Planejar-Executar-Refletir
- **Ferramentas (Tools)**: 
  - `read_file(path)` - Lê o conteúdo de um arquivo
  - `write_file(path, content)` - Cria ou sobrescreve um arquivo
  - `create_directory(path)` - Cria uma nova pasta
  - `list_files(path)` - Lista o conteúdo de um diretório
  - `run_terminal(command)` - Executa comandos de shell/terminal
  - `ask_user(question)` - Solicita entrada do usuário

### Interface do Usuário

A aplicação possui uma interface minimalista e sofisticada dividida em três seções:

1. **Painel Esquerdo** - Explorador de arquivos e editor de código
   - Exibe a estrutura de arquivos do projeto em árvore
   - Editor de código integrado
   - Atualização em tempo real quando o agente modifica arquivos
   - Animação visual para mudanças de arquivo

2. **Painel Central** - Chat e status
   - Conversa filtrada entre usuário e agente
   - Pensamentos e explicações da IA (sem blocos de código)
   - Caixas de status de terminal expansíveis
   - Indicadores de progresso

3. **Painel Inferior** - Campo de entrada
   - Campo de texto expansível
   - Suporte para múltiplas linhas (Shift+Enter)
   - Design minimalista

## 🚀 Instalação

### Pré-requisitos

- Node.js 16+ 
- npm ou yarn

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/matheus36ef/jarbs_v2.git
cd jarbs_v2
```

2. Instale as dependências:
```bash
npm install
```

3. Build o projeto:
```bash
npm run build
```

## 💻 Uso

### Modo Desenvolvimento

```bash
npm run dev
```

### Modo Produção

```bash
npm start
```

### Criar Executável Windows

```bash
npm run package
```

O executável será criado na pasta `release/`.

## 🛠️ Tecnologias Utilizadas

- **Electron** - Framework para aplicações desktop
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização
- **Webpack** - Bundler
- **Node.js** - Runtime backend

## 📝 Como Usar

1. **Inicie a aplicação**
2. **Defina o caminho do projeto** no painel esquerdo
3. **Digite seu objetivo** no campo de entrada inferior
   - Exemplo: "Crie um site de portfólio usando React"
4. **O agente irá**:
   - Gerar um plano passo a passo
   - Executar cada etapa autonomamente
   - Criar/modificar arquivos conforme necessário
   - Executar comandos de terminal quando necessário
   - Refletir sobre resultados e ajustar conforme necessário

## 🎨 Design

O design segue uma estética:
- **Minimalista** - Sem desordem visual
- **Futurista** - Interface moderna e limpa
- **Sofisticada** - Tons escuros, fontes nítidas
- **Funcional** - Espaço negativo para expansões futuras

### Tema de Cores

- Background: `#0d1117` (GitHub dark)
- Surface: `#161b22`
- Border: `#30363d`
- Text: `#c9d1d9`
- Accent Blue: `#58a6ff`
- Accent Green: `#3fb950`
- Accent Red: `#f85149`

## 🏗️ Estrutura do Projeto

```
jarbs_v2/
├── src/
│   ├── main/           # Electron main process
│   │   └── main.ts
│   ├── agent/          # AI agent core
│   │   └── agent-core.ts
│   └── renderer/       # React UI
│       ├── components/
│       │   ├── FileExplorer.tsx
│       │   ├── ChatPanel.tsx
│       │   └── InputPanel.tsx
│       ├── App.tsx
│       ├── index.tsx
│       └── styles.css
├── public/
│   └── index.html
├── dist/               # Build output
├── webpack.config.js
├── tsconfig.json
├── tailwind.config.js
└── package.json
```

## 🔮 Roadmap

- [ ] Integração com LLMs (OpenAI, Claude, etc.)
- [ ] Preview web em painel direito
- [ ] Histórico de conversas
- [ ] Suporte para múltiplos projetos
- [ ] Configurações personalizáveis
- [ ] Temas customizáveis
- [ ] Plugins e extensões

## 📄 Licença

ISC

## 👥 Contribuindo

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do repositório.

---

Desenvolvido com ❤️ usando GitHub Copilot
