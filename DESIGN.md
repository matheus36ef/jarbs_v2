# Agente-Codificador - Visual Layout

## Application Window

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  Agente-Codificador                                                        ⊡ □ ✕    │
├────────────────┬────────────────────────────────────────────────────────┬────────────┤
│                │                                                        │            │
│  FILE TREE     │               CHAT PANEL                              │   FUTURE   │
│                │                                                        │   SPACE    │
│  📁 src/       │   Welcome Screen:                                     │            │
│    📁 main/    │                                                        │            │
│    📁 agent/   │     Agente-Codificador                                │            │
│    📁 renderer/│     Descreva seu objetivo e eu construirei para você  │            │
│      📄 App.tsx│                                                        │            │
│      📄 *.tsx  │   After user input:                                   │            │
│                │                                                        │            │
│  📁 public/    │   👤 User: "Crie um site com React"                   │            │
│    📄 index.html│                                                       │            │
│                │   💭 AI: Analisando sua solicitação...               │            │
│  📄 package.json│                                                       │            │
│  📄 README.md  │   📋 AI (Plan):                                       │            │
│                │   Plano:                                               │            │
│  [CODE VIEWER] │   1. Criar estrutura de diretórios                    │            │
│  ┌────────────┐│   2. Inicializar package.json                         │            │
│  │import React││   3. Instalar React                                   │            │
│  │from 'react'││   4. Criar index.html                                 │            │
│  │            ││   5. Criar App.js                                     │            │
│  │const App = ││                                                       │            │
│  │  () => {   ││   ⚙️ AI: [ACTION: create_directory('src')]          │            │
│  │   return ( ││   ✓ AI: [RESULT: Diretório criado com sucesso]      │            │
│  │     <div>  ││                                                       │            │
│  │       ...  ││   ┌──────────────────────────────────────────────┐  │            │
│  │     </div> ││   │ ⟳ $ npm install react                       │  │            │
│  │   );       ││   │ Executando...                                │  │            │
│  │ }          ││   └──────────────────────────────────────────────┘  │            │
│  │            ││   (click to expand/collapse output)                  │            │
│  │export...   ││                                                       │            │
│  └────────────┘│   💭 AI: Plano concluído. Aguardando próximas...    │            │
│                │                                                        │            │
│  25% width    │                  60% width                            │ 15% width │
│                │                                                        │            │
│                │                                                        │            │
│                │                                                        │            │
│                │                                                        │            │
├────────────────┴────────────────────────────────────────────────────────┴────────────┤
│  INPUT PANEL (Bottom - Full Width)                                                   │
│  ┌───────────────────────────────────────────────────────────────────┬────────────┐ │
│  │ Descreva o que você quer construir...                             │   Enviar   │ │
│  │ (Shift+Enter para nova linha)                                     │            │ │
│  └───────────────────────────────────────────────────────────────────┴────────────┘ │
│  O agente planejará e executará sua solicitação autonomamente                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## Color Scheme (Dark Theme)

- **Background**: #0d1117 (Dark charcoal)
- **Surface**: #161b22 (Slightly lighter)
- **Borders**: #30363d (Subtle gray)
- **Text**: #c9d1d9 (Light gray)
- **Text Secondary**: #8b949e (Muted gray)
- **Accent Blue**: #58a6ff (Links, active items)
- **Accent Green**: #3fb950 (Success, actions)
- **Accent Red**: #f85149 (Errors)

## Key UI Features

### Left Panel - File Explorer
1. **Project Path Input** (top)
   - Text input for project directory
   - "Carregar Projeto" button
   - Can switch between projects

2. **File Tree** (middle)
   - Hierarchical display
   - Click folders to expand/collapse
   - Click files to view in code viewer
   - Flash animation when agent modifies files

3. **Code Viewer** (bottom)
   - Read-only code display
   - Line numbers
   - Filename shown at top
   - Scrollable for large files

### Center Panel - Chat
1. **Message Types**
   - 👤 User messages (light background)
   - 💭 AI thoughts (italic, muted)
   - 📋 Plans (blue accent)
   - ⚙️ Actions (green)
   - ✓ Results (muted)
   - ❌ Errors (red)

2. **Terminal Boxes**
   - Command shown with `$` prefix
   - Status indicator (⟳ Running, ✓ Success, ✗ Failure)
   - Click to expand/collapse output
   - Stdout in green, stderr in red

3. **Auto-scroll**
   - Automatically scrolls to latest message
   - Smooth animation

### Bottom Panel - Input
1. **Textarea**
   - Auto-expands as user types
   - Max height ~200px
   - Multi-line support with Shift+Enter
   - Placeholder text guides user

2. **Send Button**
   - Disabled when empty or processing
   - Shows loading spinner during execution
   - Blue accent color

3. **Helper Text**
   - Small text below explaining agent behavior

### Right Panel - Future Space
- Intentionally empty
- Reserved for future features:
  - Web preview panel
  - Settings/preferences
  - Documentation viewer
  - Git integration panel

## Animations

### Flash Animation (File Changes)
```css
@keyframes flash {
  0%, 100% { background-color: transparent; }
  50% { background-color: rgba(88, 166, 255, 0.2); }
}
```
Duration: 1 second
Effect: Brief blue glow on modified file/folder

### Loading Spinner (Send Button)
- Rotating circle when processing
- "Processando..." text
- Replaces "Enviar" text

### Auto-scroll
- Smooth scroll to bottom
- Triggered on new messages
- ~300ms transition

## Responsive Behavior

### Panel Widths
- Left: 25% (min 250px)
- Center: 60% (flexible)
- Right: 15% (min 64px)

### Text Input
- Starts at 1 row
- Grows up to ~5 rows
- Scrollable beyond that

### File Tree
- Scrollable vertically
- Horizontal overflow hidden (truncate long names)

## Interaction Patterns

### File Tree Navigation
1. Click folder → Expand/collapse
2. Click file → Load in code viewer
3. Flash effect on agent modifications
4. Project path change → Refresh entire tree

### Message Flow
1. User types and sends prompt
2. Agent shows "Analyzing..." thought
3. Agent shows plan with steps
4. Agent executes each step:
   - Shows action
   - Shows result
   - Updates file tree if file operation
5. Terminal commands show in special boxes
6. Agent shows completion thought

### Terminal Interaction
1. Terminal box appears when command runs
2. Initially collapsed with status
3. Click to expand and see output
4. Can collapse again to reduce clutter

## Keyboard Shortcuts

- **Enter**: Send message
- **Shift+Enter**: New line in input
- **Esc**: (Future) Stop agent execution

## Future Enhancements

### Monaco Editor
- Syntax highlighting
- Code folding
- Find/replace
- Multi-cursor
- IntelliSense

### Settings Panel
- Theme customization
- API key configuration
- Agent behavior settings
- Keyboard shortcuts config

### Web Preview
- Live preview of web projects
- Iframe in right panel
- Auto-refresh on file changes

### Git Integration
- Show git status in file tree
- Commit/push buttons
- Branch viewer
- Diff viewer

---

This visual guide shows the complete layout and interaction patterns of the Agente-Codificador application.
