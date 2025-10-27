import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { AgentCore } from '../agent/agent-core';

let mainWindow: BrowserWindow | null = null;
let agentCore: AgentCore | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    backgroundColor: '#0d1117',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },
    frame: true,
    title: 'Agente-Codificador'
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  agentCore = new AgentCore(mainWindow!);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handlers
ipcMain.handle('agent:send-prompt', async (event, prompt: string) => {
  if (agentCore) {
    return await agentCore.processPrompt(prompt);
  }
  return { error: 'Agent not initialized' };
});

ipcMain.handle('agent:get-project-files', async (event, projectPath: string) => {
  if (agentCore) {
    return await agentCore.getProjectFiles(projectPath);
  }
  return { error: 'Agent not initialized' };
});

ipcMain.handle('agent:read-file', async (event, filePath: string) => {
  if (agentCore) {
    return await agentCore.readFile(filePath);
  }
  return { error: 'Agent not initialized' };
});

ipcMain.handle('agent:stop', async () => {
  if (agentCore) {
    agentCore.stop();
  }
});
