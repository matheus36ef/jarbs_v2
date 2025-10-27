# Project Brief - Agente-Codificador

## Overview
Agente-Codificador is a functional prototype desktop application for Windows that serves as an autonomous software development assistant. It's a minimalist, sophisticated tool designed to help developers by autonomously planning, executing, and reflecting on software development tasks.

## Core Requirements

### 1. Autonomous AI Agent
- Acts as a Senior Software Engineer
- Operates in a Plan-Execute-Reflect continuous loop
- Full awareness of project file/folder structure
- Capable of reading any file for context
- Autonomous debugging and error handling

### 2. Tool System
The agent has access to 6 essential tools:
- `read_file(path)` - Read file contents
- `write_file(path, content)` - Create or overwrite files
- `create_directory(path)` - Create directories
- `list_files(path)` - List directory contents
- `run_terminal(command)` - Execute shell commands with output capture
- `ask_user(question)` - Pause execution for user input

### 3. Structured Communication
The agent communicates in structured format:
- **Thought/Prose**: Normal text explaining what it's doing
- **Action**: Structured tool calls (e.g., `[ACTION: write_file('app.js', '...')]`)
- **Result**: Execution results (e.g., `[RESULT: 'app.js' written successfully]`)

### 4. User Interface Requirements

#### Three-Panel Layout:
1. **Left Panel** - Live Code View
   - File/folder tree structure
   - Integrated code editor
   - Real-time updates when agent modifies files
   - Visual flash animation on file changes
   - Code is NEVER shown in central chat

2. **Center Panel** - Chat and Status
   - User prompts display
   - AI thoughts and explanations
   - Code blocks are FILTERED OUT
   - Special terminal output boxes:
     - Show command being executed
     - Status indicator (Running/Success/Fail)
     - Expandable/collapsible stdout/stderr

3. **Bottom Panel** - Input Field
   - Single text input field
   - Vertically expandable (grows upward)
   - Multi-line support (Shift+Enter)
   - Minimalist design

#### Design Aesthetic:
- Clean, minimalist, futuristic, sophisticated
- Dark tones, sharp fonts, no visual clutter
- Intentional negative space for future expansion

### 5. Technology Stack
- **Backend/Agent**: Node.js with TypeScript
- **Frontend**: Electron (Node.js + Chromium)
- **UI Framework**: React
- **Styling**: Tailwind CSS v4
- **Build Tool**: Webpack

## Project Goals
1. Create a working prototype that demonstrates the autonomous agent concept
2. Implement a clean, usable UI that follows the specified design
3. Establish a foundation for future enhancements (LLM integration, etc.)
4. Maintain minimalist and sophisticated design principles

## Out of Scope (for initial prototype)
- LLM API integration (simulated for now)
- Advanced code intelligence/autocomplete
- Multi-project workspace
- Plugin system
- User preferences/settings UI

## Success Criteria
1. Application builds and runs on Windows
2. All three panels render correctly
3. Agent can execute basic Plan-Execute-Reflect cycle
4. All 6 tools are functional
5. File tree updates in real-time
6. Terminal outputs display correctly
7. Code filtering works (no code in chat)
8. Dark theme is properly applied
