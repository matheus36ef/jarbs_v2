# System Patterns - Agente-Codificador

## Architecture Overview

The system follows a three-layer architecture:
1. **Main Process** (Electron): Process management, IPC coordination
2. **Agent Core** (Backend): Business logic, tool execution
3. **Renderer Process** (React UI): User interface, state management

```
┌─────────────────────────────────────────────────────────┐
│                    Electron Main Process                 │
│  ┌───────────────────────────────────────────────────┐  │
│  │              main.ts (Entry Point)                 │  │
│  │  - Window creation                                 │  │
│  │  - IPC handlers                                    │  │
│  │  - Agent instantiation                             │  │
│  └───────────────────────────────────────────────────┘  │
│                            │                             │
│                            │ IPC                         │
│                            │                             │
│  ┌───────────────────────────────────────────────────┐  │
│  │         agent-core.ts (Business Logic)            │  │
│  │  - Plan generation                                 │  │
│  │  - Tool execution                                  │  │
│  │  - File operations                                 │  │
│  │  - Terminal commands                               │  │
│  │  - Message broadcasting                            │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            │ IPC Messages
                            │
┌─────────────────────────────────────────────────────────┐
│               Electron Renderer Process                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │              App.tsx (Root Component)              │  │
│  │  - State management                                │  │
│  │  - IPC listeners                                   │  │
│  │  - Component orchestration                         │  │
│  └───────────────────────────────────────────────────┘  │
│          │                │               │              │
│  ┌───────┴───┐    ┌──────┴─────┐   ┌────┴─────┐       │
│  │FileExplorer│    │ ChatPanel  │   │InputPanel│       │
│  └────────────┘    └────────────┘   └──────────┘       │
└─────────────────────────────────────────────────────────┘
```

## Key Technical Decisions

### 1. Electron vs. Tauri
**Decision**: Use Electron
**Rationale**:
- Easier development with familiar Node.js ecosystem
- Better community support and documentation
- Faster prototyping
- Native Node.js integration (no need for Rust)

**Trade-offs**:
- Larger bundle size (~150MB vs. ~10MB for Tauri)
- Higher memory usage
- Acceptable for prototype phase

### 2. React vs. Svelte
**Decision**: Use React
**Rationale**:
- Larger ecosystem and component libraries
- Better TypeScript support
- Familiar to most developers
- Easier to find contributors

### 3. Tailwind CSS v4
**Decision**: Use Tailwind v4 with @tailwindcss/postcss
**Rationale**:
- Rapid styling without custom CSS
- Dark theme utilities built-in
- Consistent design system
- Note: v4 requires separate PostCSS plugin

### 4. Webpack vs. Vite
**Decision**: Use Webpack
**Rationale**:
- Better Electron integration
- More mature tooling for multi-process builds
- Separate bundles for main and renderer processes

## Component Architecture

### Main Process Components

#### main.ts
- **Responsibility**: Application lifecycle, window management
- **Key Functions**:
  - `createWindow()`: Initialize main window
  - IPC handler setup
  - Agent core instantiation

#### agent-core.ts
- **Responsibility**: Agent business logic
- **Key Classes**:
  - `AgentCore`: Main agent orchestrator
- **Key Methods**:
  - `processPrompt()`: Main entry point for user requests
  - `generatePlan()`: Create execution plan
  - `executePlan()`: Execute plan steps
  - Tool methods: `readFile()`, `writeFile()`, etc.
- **Message Types**:
  - `thought`: Agent reasoning
  - `action`: Tool invocation
  - `result`: Tool result
  - `plan`: Generated plan
  - `error`: Error messages

### Renderer Process Components

#### App.tsx
- **Responsibility**: Root component, state management
- **State**:
  - `messages`: Chat message history
  - `terminalOutputs`: Terminal command results
  - `fileTree`: Project file structure
  - `selectedFile`: Currently viewed file
  - `isProcessing`: Agent execution status

#### FileExplorer.tsx
- **Responsibility**: File tree and code viewer
- **Features**:
  - Recursive file tree rendering
  - Directory expansion/collapse
  - File selection
  - Code display
  - Flash animation on changes

#### ChatPanel.tsx
- **Responsibility**: Message display
- **Features**:
  - Message type formatting
  - Terminal output boxes
  - Auto-scroll to latest
  - Expandable terminal details

#### InputPanel.tsx
- **Responsibility**: User input
- **Features**:
  - Auto-expanding textarea
  - Multi-line support
  - Loading state
  - Submit on Enter (Shift+Enter for newline)

## Communication Patterns

### IPC Messages

#### Main → Renderer
```typescript
// Agent messages
'agent:message' → AgentMessage
// Terminal outputs
'agent:terminal-output' → TerminalOutput
// File system changes
'agent:file-change' → FileSystemChange
// User questions
'agent:ask-user' → string
```

#### Renderer → Main
```typescript
// Send user prompt
'agent:send-prompt' → Promise<void>
// Get file tree
'agent:get-project-files' → Promise<FileNode>
// Read file content
'agent:read-file' → Promise<string>
// Stop agent
'agent:stop' → Promise<void>
```

## Data Flow

### User Prompt Flow
```
User types prompt
    ↓
InputPanel.handleSendPrompt()
    ↓
IPC: 'agent:send-prompt'
    ↓
main.ts IPC handler
    ↓
AgentCore.processPrompt()
    ↓
├─ generatePlan()
│   ↓
│   Send 'agent:message' (type: plan)
│
├─ executePlan()
│   ↓
│   ├─ Tool execution (e.g., writeFile)
│   │   ↓
│   │   Send 'agent:message' (type: action)
│   │   ↓
│   │   Perform operation
│   │   ↓
│   │   Send 'agent:message' (type: result)
│   │   ↓
│   │   Send 'agent:file-change'
│   │
│   └─ Terminal execution
│       ↓
│       Send 'agent:terminal-output' (status: running)
│       ↓
│       Execute command
│       ↓
│       Send 'agent:terminal-output' (status: success/error)
│
└─ Complete
```

### File Tree Update Flow
```
User sets project path
    ↓
FileExplorer.handleSetProjectPath()
    ↓
App.handleProjectPathChange()
    ↓
IPC: 'agent:get-project-files'
    ↓
AgentCore.getProjectFiles()
    ↓
Recursive directory scan
    ↓
Return FileNode tree
    ↓
App updates state
    ↓
FileExplorer re-renders
```

## Critical Implementation Paths

### File Change Animation
When agent modifies a file:
1. Agent calls `writeFile()`
2. Emits 'agent:file-change' with file path
3. App adds path to `flashFiles` set
4. FileExplorer applies `flash-animation` class
5. After 1 second, path removed from set
6. Animation completes

### Terminal Output Expansion
1. Agent runs terminal command
2. Emits 'agent:terminal-output' with `expanded: false`
3. ChatPanel renders collapsed terminal box
4. User clicks box
5. `onToggleTerminal()` called
6. State updated with `expanded: true`
7. Output/error displayed

### Message Filtering
- Agent sends ALL messages via 'agent:message'
- ChatPanel renders based on message type
- Code content never included in messages
- Agent instead says "Writing code to file.js"
- Actual code only visible in FileExplorer

## Design Patterns Used

### 1. Observer Pattern
- Agent broadcasts events via IPC
- UI components listen and react
- Decoupled communication

### 2. Command Pattern
- Each tool is a command
- Structured execution and logging
- Easy to add new tools

### 3. State Management
- App.tsx as single source of truth
- Props drilling for now (can migrate to Context/Redux if needed)

### 4. Component Composition
- Small, focused components
- Clear responsibilities
- Reusable pieces

## Performance Considerations

### File Tree
- Only render visible nodes (expansion controlled)
- Filter out node_modules and hidden files
- Lazy load large directories (future)

### Message List
- Auto-scroll can be expensive
- Limit message history (future)
- Virtual scrolling for large lists (future)

### Terminal Output
- Collapsed by default
- Lazy render output text
- Truncate very large outputs (future)

## Error Handling

### Agent Errors
- Try-catch in all tool methods
- Send error messages to UI
- Continue execution when possible
- Ask user for help if stuck

### UI Errors
- React error boundaries (to be added)
- Graceful degradation
- User-friendly error messages

### IPC Errors
- All IPC calls return error objects
- UI checks for errors in responses
- Fallback behaviors defined
