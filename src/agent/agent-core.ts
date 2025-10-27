import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { BrowserWindow } from 'electron';

const execAsync = promisify(exec);

export interface AgentMessage {
  type: 'thought' | 'action' | 'result' | 'user' | 'plan' | 'error';
  content: string;
  timestamp: number;
}

export interface TerminalOutput {
  command: string;
  status: 'running' | 'success' | 'error';
  output?: string;
  error?: string;
}

export interface FileSystemChange {
  type: 'create' | 'modify' | 'delete';
  path: string;
}

export class AgentCore {
  private window: BrowserWindow;
  private currentProjectPath: string = '';
  private isRunning: boolean = false;
  private messageHistory: AgentMessage[] = [];

  constructor(window: BrowserWindow) {
    this.window = window;
  }

  async processPrompt(prompt: string): Promise<void> {
    this.isRunning = true;
    
    // Send user message
    this.sendMessage({
      type: 'user',
      content: prompt,
      timestamp: Date.now()
    });

    try {
      // Generate plan
      await this.generatePlan(prompt);
      
      // Execute plan
      await this.executePlan(prompt);
      
    } catch (error: any) {
      this.sendMessage({
        type: 'error',
        content: `Erro: ${error.message}`,
        timestamp: Date.now()
      });
    } finally {
      this.isRunning = false;
    }
  }

  private async generatePlan(prompt: string): Promise<void> {
    this.sendMessage({
      type: 'thought',
      content: 'Analisando sua solicitação...',
      timestamp: Date.now()
    });

    // Simple plan generation (in real implementation, would use LLM)
    const plan = this.createSimplePlan(prompt);
    
    this.sendMessage({
      type: 'plan',
      content: plan,
      timestamp: Date.now()
    });
  }

  private createSimplePlan(prompt: string): string {
    // Basic pattern matching for demo purposes
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('criar') && lowerPrompt.includes('react')) {
      return `Plano:\n1. Criar estrutura de diretórios do projeto\n2. Inicializar package.json\n3. Instalar dependências React\n4. Criar arquivos principais (index.html, App.js)\n5. Configurar webpack/build tools\n6. Criar componentes básicos`;
    } else if (lowerPrompt.includes('criar') && lowerPrompt.includes('html')) {
      return `Plano:\n1. Criar arquivo index.html\n2. Criar arquivo style.css\n3. Vincular CSS ao HTML\n4. Adicionar estrutura básica\n5. Testar no navegador`;
    } else {
      return `Plano:\n1. Analisar requisitos\n2. Identificar arquivos necessários\n3. Criar/modificar arquivos\n4. Testar implementação\n5. Refinar conforme necessário`;
    }
  }

  private async executePlan(prompt: string): Promise<void> {
    this.sendMessage({
      type: 'thought',
      content: 'Executando o plano...',
      timestamp: Date.now()
    });

    // Simulate plan execution for demo
    await this.sleep(500);
    
    this.sendMessage({
      type: 'thought',
      content: 'Plano concluído. Aguardando próximas instruções.',
      timestamp: Date.now()
    });
  }

  // Tool implementations
  async readFile(filePath: string): Promise<string> {
    this.sendMessage({
      type: 'action',
      content: `[ACTION: read_file('${filePath}')]`,
      timestamp: Date.now()
    });

    try {
      const fullPath = path.join(this.currentProjectPath, filePath);
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      this.sendMessage({
        type: 'result',
        content: `[RESULT: Arquivo lido com sucesso]`,
        timestamp: Date.now()
      });

      return content;
    } catch (error: any) {
      this.sendMessage({
        type: 'result',
        content: `[RESULT: Erro ao ler arquivo: ${error.message}]`,
        timestamp: Date.now()
      });
      throw error;
    }
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    this.sendMessage({
      type: 'action',
      content: `[ACTION: write_file('${filePath}', ...)]`,
      timestamp: Date.now()
    });

    try {
      const fullPath = path.join(this.currentProjectPath, filePath);
      const dir = path.dirname(fullPath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(fullPath, content, 'utf-8');
      
      this.sendMessage({
        type: 'result',
        content: `[RESULT: '${filePath}' escrito com sucesso]`,
        timestamp: Date.now()
      });

      // Notify UI of file change
      this.notifyFileChange({
        type: fs.existsSync(fullPath) ? 'modify' : 'create',
        path: filePath
      });
    } catch (error: any) {
      this.sendMessage({
        type: 'result',
        content: `[RESULT: Erro ao escrever arquivo: ${error.message}]`,
        timestamp: Date.now()
      });
      throw error;
    }
  }

  async createDirectory(dirPath: string): Promise<void> {
    this.sendMessage({
      type: 'action',
      content: `[ACTION: create_directory('${dirPath}')]`,
      timestamp: Date.now()
    });

    try {
      const fullPath = path.join(this.currentProjectPath, dirPath);
      fs.mkdirSync(fullPath, { recursive: true });
      
      this.sendMessage({
        type: 'result',
        content: `[RESULT: Diretório '${dirPath}' criado com sucesso]`,
        timestamp: Date.now()
      });

      this.notifyFileChange({
        type: 'create',
        path: dirPath
      });
    } catch (error: any) {
      this.sendMessage({
        type: 'result',
        content: `[RESULT: Erro ao criar diretório: ${error.message}]`,
        timestamp: Date.now()
      });
      throw error;
    }
  }

  async listFiles(dirPath: string = '.'): Promise<string[]> {
    this.sendMessage({
      type: 'action',
      content: `[ACTION: list_files('${dirPath}')]`,
      timestamp: Date.now()
    });

    try {
      const fullPath = path.join(this.currentProjectPath, dirPath);
      const files = fs.readdirSync(fullPath);
      
      this.sendMessage({
        type: 'result',
        content: `[RESULT: ${files.length} arquivo(s) encontrado(s)]`,
        timestamp: Date.now()
      });

      return files;
    } catch (error: any) {
      this.sendMessage({
        type: 'result',
        content: `[RESULT: Erro ao listar arquivos: ${error.message}]`,
        timestamp: Date.now()
      });
      throw error;
    }
  }

  async runTerminal(command: string): Promise<{ stdout: string; stderr: string }> {
    this.sendMessage({
      type: 'action',
      content: `[ACTION: run_terminal('${command}')]`,
      timestamp: Date.now()
    });

    // Notify UI that terminal is running
    this.notifyTerminalStatus({
      command,
      status: 'running'
    });

    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: this.currentProjectPath
      });

      this.sendMessage({
        type: 'result',
        content: `[RESULT: Comando executado com sucesso]`,
        timestamp: Date.now()
      });

      this.notifyTerminalStatus({
        command,
        status: 'success',
        output: stdout,
        error: stderr
      });

      return { stdout, stderr };
    } catch (error: any) {
      this.sendMessage({
        type: 'result',
        content: `[RESULT: Erro no terminal: ${error.message}]`,
        timestamp: Date.now()
      });

      this.notifyTerminalStatus({
        command,
        status: 'error',
        error: error.message
      });

      throw error;
    }
  }

  async askUser(question: string): Promise<string> {
    this.sendMessage({
      type: 'action',
      content: `[ACTION: ask_user('${question}')]`,
      timestamp: Date.now()
    });

    // Send question to UI and wait for response
    return new Promise((resolve) => {
      this.window.webContents.send('agent:ask-user', question);
      
      // Listen for response (simplified - in real app would use proper IPC)
      const listener = (event: any, response: string) => {
        this.sendMessage({
          type: 'result',
          content: `[RESULT: Usuário respondeu: "${response}"]`,
          timestamp: Date.now()
        });
        resolve(response);
      };
      
      // Note: In real implementation, would properly handle IPC response
      setTimeout(() => resolve(''), 100);
    });
  }

  async getProjectFiles(projectPath: string): Promise<any> {
    this.currentProjectPath = projectPath;
    return this.buildFileTree(projectPath);
  }

  private buildFileTree(dirPath: string): any {
    const stats = fs.statSync(dirPath);
    const info: any = {
      name: path.basename(dirPath),
      path: dirPath,
    };

    if (stats.isDirectory()) {
      info.type = 'directory';
      info.children = fs.readdirSync(dirPath)
        .filter(child => !child.startsWith('.') && child !== 'node_modules')
        .map(child => this.buildFileTree(path.join(dirPath, child)));
    } else {
      info.type = 'file';
      info.size = stats.size;
    }

    return info;
  }

  private sendMessage(message: AgentMessage): void {
    this.messageHistory.push(message);
    this.window.webContents.send('agent:message', message);
  }

  private notifyFileChange(change: FileSystemChange): void {
    this.window.webContents.send('agent:file-change', change);
  }

  private notifyTerminalStatus(output: TerminalOutput): void {
    this.window.webContents.send('agent:terminal-output', output);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stop(): void {
    this.isRunning = false;
  }

  setProjectPath(path: string): void {
    this.currentProjectPath = path;
  }
}
