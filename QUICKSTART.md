# Quick Start Guide - Agente-Codificador

## Installation

### Prerequisites
- **Node.js**: Version 16 or higher
- **npm**: Version 8 or higher
- **Windows 10/11**: For full compatibility

### Install Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/matheus36ef/jarbs_v2.git
   cd jarbs_v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   This will install all required packages (~150 MB).

3. **Build the application**
   ```bash
   npm run build
   ```
   This compiles TypeScript and bundles the application.

4. **Start the application**
   ```bash
   npm start
   ```
   The Agente-Codificador window will open.

## First Use

### 1. Set Your Project Path

When you first open the application, you'll see the left panel with a project path input.

```
┌─────────────────────────┐
│ Caminho do Projeto:     │
│ ┌─────────────────────┐ │
│ │ /path/to/project    │ │
│ └─────────────────────┘ │
│ [Carregar Projeto]      │
└─────────────────────────┘
```

Enter the full path to your project directory and click "Carregar Projeto".

**Examples:**
- Windows: `C:\Users\YourName\Projects\my-project`
- macOS/Linux: `/home/username/projects/my-project`

### 2. Give the Agent a Task

Type your request in the input field at the bottom:

**Good Examples:**
- ✅ "Crie um site de portfólio usando React"
- ✅ "Adicione um arquivo README.md ao projeto"
- ✅ "Crie uma estrutura básica de API REST com Express"
- ✅ "Organize os arquivos CSS em uma pasta styles"

**What to Avoid:**
- ❌ Too vague: "Faça algo"
- ❌ Too complex: "Crie uma aplicação completa com 50 features"

### 3. Watch the Agent Work

The agent will:
1. **Think** 💭 - Analyze your request
2. **Plan** 📋 - Create a step-by-step plan
3. **Execute** ⚙️ - Perform actions (create files, run commands)
4. **Report** ✓ - Show results

You can monitor:
- **Left Panel**: See files being created/modified (with flash animation)
- **Center Panel**: Read the agent's thoughts and actions
- **Terminal Boxes**: See command outputs (click to expand)

### 4. Review the Results

After the agent completes:
- Click on files in the left panel to view their contents
- Check the code viewer at the bottom of the left panel
- Review the agent's final thoughts

## Example Session

### User Input
```
Crie um projeto React simples com um componente Hello World
```

### Agent Response (Center Panel)

```
💭 Analisando sua solicitação...

📋 Plano:
1. Criar estrutura de diretórios
2. Criar index.html
3. Criar App.js com componente Hello World
4. Criar arquivo de estilos

⚙️ [ACTION: create_directory('src')]
✓ [RESULT: Diretório 'src' criado com sucesso]

⚙️ [ACTION: write_file('public/index.html', ...)]
✓ [RESULT: 'public/index.html' escrito com sucesso]

⚙️ [ACTION: write_file('src/App.js', ...)]
✓ [RESULT: 'src/App.js' escrito com sucesso]

💭 Plano concluído. Aguardando próximas instruções.
```

### File Tree (Left Panel)
```
📁 my-project/
  📁 public/
    📄 index.html   ← (flashes when created)
  📁 src/
    📄 App.js       ← (flashes when created)
```

## Tips for Best Results

### 1. Be Specific
- ✅ "Crie um componente React chamado Button.js na pasta src/components"
- ❌ "Crie um botão"

### 2. One Task at a Time
Start with small, focused tasks. Build complexity gradually.

### 3. Check the Plan
Read the plan before execution. It shows what the agent will do.

### 4. Monitor File Changes
Watch the left panel for flash animations - they show what's being modified.

### 5. Expand Terminal Outputs
Click on terminal boxes to see detailed output from commands.

### 6. Use the Code Viewer
Click files to inspect their contents before proceeding.

## Common Tasks

### Creating Files
```
Crie um arquivo config.json com configurações básicas
```

### Organizing Project
```
Organize todos os arquivos CSS em uma pasta styles/
```

### Running Commands
```
Instale as dependências do projeto usando npm
```

### Modifying Files
```
Adicione um comentário no topo do arquivo App.js explicando o que ele faz
```

### Creating Components
```
Crie um componente React chamado Header com navegação básica
```

## Troubleshooting

### "Agent not responding"
- Check if the project path is valid
- Restart the application
- Check the console for errors (F12)

### "File not found"
- Ensure the project path is correct
- Verify the file actually exists in the file tree

### "Terminal command failed"
- Expand the terminal box to see error details
- Check if required tools are installed (npm, git, etc.)
- Verify you're in the correct directory

### "Code not showing in viewer"
- Click the file in the tree to load it
- Refresh the file tree by changing project path

### Application won't start
- Verify Node.js is installed: `node --version`
- Try rebuilding: `npm run build`
- Check for error messages in terminal

## Keyboard Shortcuts

- **Enter**: Send message
- **Shift + Enter**: New line in input (multi-line messages)
- **F12**: Open developer tools (for debugging)

## Development Mode

For development with auto-reload:

```bash
npm run dev
```

This will:
1. Build the application
2. Start Electron
3. Open developer tools

You can then make changes to the code and rebuild as needed.

## Advanced Usage

### Multiple Projects
To switch projects:
1. Click "Alterar" button in left panel
2. Enter new project path
3. Click "Carregar Projeto"

### Viewing Large Files
Large files will be scrollable in the code viewer. Use the scrollbar to navigate.

### Complex Plans
For complex tasks, the agent may generate a long plan. Read it carefully to understand what will happen.

### Error Recovery
If the agent encounters an error:
1. Read the error message (shown in red)
2. The agent may ask for your help
3. Respond with clarification or instructions
4. Or try rephrasing your request

## What's Next?

After getting familiar with the basics:

1. **Experiment**: Try different types of tasks
2. **Build**: Create a small project from scratch
3. **Learn**: Watch how the agent structures code
4. **Extend**: Future versions will support LLM integration for smarter responses

## Getting Help

- **Documentation**: See README.md for detailed information
- **Design**: See DESIGN.md for UI/UX details
- **Issues**: Report bugs on GitHub
- **Memory Bank**: Check memory-bank/ folder for architecture docs

## Future Features (Coming Soon)

- 🤖 **LLM Integration**: Real AI planning with GPT/Claude
- 🎨 **Syntax Highlighting**: Monaco Editor integration
- 🔍 **File Search**: Find files quickly
- ⚙️ **Settings Panel**: Customize behavior
- 🌐 **Web Preview**: Live preview for web projects
- 📝 **History**: Save conversation history
- 🔐 **Git Integration**: Commit and push directly

---

**Enjoy building with Agente-Codificador!** 🚀

For questions or feedback, please open an issue on GitHub.
