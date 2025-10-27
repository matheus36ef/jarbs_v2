# Tech Context - Agente-Codificador

## Technology Stack

### Core Technologies

#### Electron 38.4.0
- **Purpose**: Desktop application framework
- **Why**: Cross-platform desktop apps with web technologies
- **Main Process**: Node.js runtime for system operations
- **Renderer Process**: Chromium for UI rendering
- **IPC**: Inter-process communication between main and renderer

#### React 19.2.0
- **Purpose**: UI library
- **Why**: Component-based architecture, strong ecosystem
- **Key Changes in v19**:
  - New `createRoot` API (replaced `ReactDOM.render`)
  - Improved concurrent rendering
  - Better TypeScript support

#### TypeScript 5.9.3
- **Purpose**: Static typing
- **Why**: Better DX, fewer runtime errors, better IDE support
- **Configuration**: Strict mode enabled
- **Target**: ES2020

#### Tailwind CSS v4.1.16
- **Purpose**: Utility-first CSS framework
- **Why**: Rapid styling, consistent design system
- **Breaking Change in v4**: Requires `@tailwindcss/postcss` plugin
- **Configuration**: Custom dark theme colors

### Build Tools

#### Webpack 5.102.1
- **Purpose**: Module bundler
- **Configuration**: Dual build (main + renderer)
- **Loaders**:
  - `ts-loader`: TypeScript compilation
  - `babel-loader`: JSX transformation
  - `css-loader`: CSS processing
  - `postcss-loader`: Tailwind CSS processing
  - `style-loader`: CSS injection

#### Babel
- **Presets**:
  - `@babel/preset-react`: JSX support
  - `@babel/preset-typescript`: TS support

#### PostCSS
- **Plugins**:
  - `@tailwindcss/postcss`: Tailwind CSS v4 support
  - `autoprefixer`: Vendor prefix automation

### Development Tools

#### electron-builder 26.0.12
- **Purpose**: Package app for distribution
- **Configuration**: Windows NSIS installer
- **Output**: `release/` directory

## Development Setup

### Prerequisites
```bash
Node.js >= 16.0.0
npm >= 8.0.0
```

### Installation
```bash
npm install
```

### Build Commands
```bash
npm run build     # Production build
npm run dev       # Dev build + start
npm start         # Run built app
npm run package   # Create Windows installer
```

## Project Structure

```
jarbs_v2/
├── src/
│   ├── main/              # Electron main process
│   │   └── main.ts        # Entry point, IPC setup
│   ├── agent/             # Agent core logic
│   │   └── agent-core.ts  # Tools, planning, execution
│   └── renderer/          # React UI
│       ├── components/    # UI components
│       │   ├── FileExplorer.tsx
│       │   ├── ChatPanel.tsx
│       │   └── InputPanel.tsx
│       ├── App.tsx        # Root component
│       ├── index.tsx      # Renderer entry
│       └── styles.css     # Global styles + Tailwind
├── public/
│   └── index.html         # HTML template
├── dist/                  # Build output
│   ├── main.js           # Compiled main process
│   ├── renderer.js       # Compiled renderer
│   └── index.html        # Processed HTML
├── node_modules/          # Dependencies (gitignored)
├── memory-bank/           # Project documentation
├── webpack.config.js      # Build configuration
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind theme
├── postcss.config.js      # PostCSS plugins
├── .babelrc              # Babel presets
├── .gitignore            # Git ignore rules
└── package.json          # Project metadata
```

## Dependencies

### Production Dependencies
```json
{
  "react": "^19.2.0",           // UI library
  "react-dom": "^19.2.0"        // React DOM bindings
}
```

### Development Dependencies
```json
{
  "electron": "^38.4.0",                    // Desktop framework
  "typescript": "^5.9.3",                   // Type system
  "@types/node": "^24.9.1",                // Node types
  "@types/react": "^19.2.2",               // React types
  "@types/react-dom": "^19.2.2",           // React DOM types
  "webpack": "^5.102.1",                    // Bundler
  "webpack-cli": "^6.0.1",                 // Webpack CLI
  "ts-loader": "^9.5.4",                   // TS → JS
  "babel-loader": "^10.0.0",               // Babel integration
  "@babel/core": "^7.28.5",                // Babel core
  "@babel/preset-react": "^7.28.5",        // JSX support
  "@babel/preset-typescript": "^7.28.5",   // TS support
  "html-webpack-plugin": "^5.6.4",         // HTML generation
  "css-loader": "^7.1.2",                  // CSS loading
  "style-loader": "^4.0.0",                // CSS injection
  "postcss": "^8.5.6",                     // CSS processing
  "postcss-loader": "^8.2.0",              // PostCSS integration
  "tailwindcss": "^4.1.16",                // CSS framework
  "@tailwindcss/postcss": "^4.0.0",        // Tailwind v4 plugin
  "autoprefixer": "^10.4.21",              // CSS prefixing
  "electron-builder": "^26.0.12"           // Packaging
}
```

## Technical Constraints

### Electron Constraints
- **Main Process**: Full Node.js access, no DOM
- **Renderer Process**: Browser environment, limited Node.js
- **IPC Required**: For main ↔ renderer communication
- **Security**: `nodeIntegration: true` used (prototype only)
  - **Production Note**: Should use preload scripts + contextIsolation

### TypeScript Configuration
```json
{
  "target": "ES2020",          // Modern JS features
  "module": "commonjs",        // Node.js compatibility
  "jsx": "react",              // React JSX
  "strict": true,              // Strict type checking
  "esModuleInterop": true,     // CommonJS interop
  "skipLibCheck": true         // Speed up compilation
}
```

### Webpack Configuration
- **Mode**: Production/Development
- **Entry Points**: 
  - Main: `src/main/main.ts`
  - Renderer: `src/renderer/index.tsx`
- **Output**: `dist/` directory
- **Target**: 
  - Main: `electron-main`
  - Renderer: `electron-renderer`

### Tailwind Configuration
- **Content**: Scans `src/renderer/**/*.{js,jsx,ts,tsx}`
- **Custom Colors**: GitHub dark theme palette
- **Dark Mode**: Default (always dark)

## File System Operations

### Node.js APIs Used
```typescript
import * as fs from 'fs';           // File operations
import * as path from 'path';        // Path manipulation
import { exec } from 'child_process'; // Terminal commands
import { promisify } from 'util';    // Promise wrappers
```

### Key Functions
- `fs.readFileSync()`: Synchronous file read
- `fs.writeFileSync()`: Synchronous file write
- `fs.mkdirSync()`: Create directories
- `fs.readdirSync()`: List directory contents
- `fs.statSync()`: Get file stats
- `exec()`: Execute shell commands

## IPC Architecture

### Message Protocol
```typescript
// Message types
interface AgentMessage {
  type: 'thought' | 'action' | 'result' | 'user' | 'plan' | 'error';
  content: string;
  timestamp: number;
}

// Terminal output
interface TerminalOutput {
  command: string;
  status: 'running' | 'success' | 'error';
  output?: string;
  error?: string;
}

// File system change
interface FileSystemChange {
  type: 'create' | 'modify' | 'delete';
  path: string;
}
```

### IPC Channels
- `agent:send-prompt`: Send user request
- `agent:message`: Broadcast agent message
- `agent:terminal-output`: Terminal command result
- `agent:file-change`: File system modification
- `agent:get-project-files`: Request file tree
- `agent:read-file`: Request file content
- `agent:stop`: Stop agent execution

## Environment Variables

Currently none required. Future additions might include:
- `OPENAI_API_KEY`: For LLM integration
- `NODE_ENV`: Development/production mode
- `ELECTRON_DISABLE_SANDBOX`: For development

## Build Process

### Development Build
1. Webpack compiles TypeScript → JavaScript
2. Babel transforms JSX
3. PostCSS processes Tailwind CSS
4. Output to `dist/`
5. Electron loads from `dist/`

### Production Build
1. Same as dev but with minification
2. Source maps generated
3. Electron-builder packages app
4. Creates installer in `release/`

## Known Issues & Workarounds

### 1. Tailwind CSS v4
- **Issue**: Requires separate PostCSS plugin
- **Solution**: Install `@tailwindcss/postcss`
- **Config**: Use `'@tailwindcss/postcss': {}` in postcss.config.js

### 2. React 19 API Changes
- **Issue**: `ReactDOM.render` deprecated
- **Solution**: Use `createRoot` from 'react-dom/client'

### 3. Electron Sandbox (CI/GitHub Actions)
- **Issue**: Sandbox requires root ownership
- **Workaround**: Run with `--no-sandbox` flag in CI
- **Note**: Not an issue on user machines

### 4. Context Isolation
- **Issue**: Using `nodeIntegration: true` is insecure
- **Current**: Acceptable for prototype
- **Future**: Implement preload script with contextBridge

## Tool Usage Patterns

### Running Shell Commands
```typescript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const { stdout, stderr } = await execAsync(command, { cwd: projectPath });
```

### File Operations
```typescript
// Read
const content = fs.readFileSync(fullPath, 'utf-8');

// Write
fs.writeFileSync(fullPath, content, 'utf-8');

// Ensure directory exists
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// List files
const files = fs.readdirSync(fullPath);

// Check if file/directory
const stats = fs.statSync(fullPath);
if (stats.isDirectory()) { /* ... */ }
```

### Building File Tree
Recursive traversal with filtering:
- Exclude hidden files (starting with '.')
- Exclude node_modules
- Include file metadata (size, type)

## Future Technical Considerations

### LLM Integration
- Need API key management
- Consider streaming responses
- Rate limiting/error handling
- Cost monitoring

### Code Editor Enhancement
- Syntax highlighting (Monaco Editor?)
- Code completion
- Multi-tab support

### Performance Optimization
- Virtual scrolling for large file trees
- Message list pagination
- Lazy load file contents

### Security Hardening
- Implement context isolation
- Use preload scripts
- Validate IPC messages
- Sanitize file paths

### Testing
- Unit tests (Jest)
- E2E tests (Playwright)
- IPC testing
- Agent tool testing
