import React, { useState, useEffect, useRef } from 'react';
import FileExplorer from './components/FileExplorer';
import ChatPanel from './components/ChatPanel';
import InputPanel from './components/InputPanel';
import './styles.css';

const { ipcRenderer } = window.require('electron');

export interface Message {
  type: 'thought' | 'action' | 'result' | 'user' | 'plan' | 'error';
  content: string;
  timestamp: number;
}

export interface TerminalOutput {
  command: string;
  status: 'running' | 'success' | 'error';
  output?: string;
  error?: string;
  expanded?: boolean;
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  size?: number;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [terminalOutputs, setTerminalOutputs] = useState<TerminalOutput[]>([]);
  const [projectPath, setProjectPath] = useState<string>('');
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [flashFiles, setFlashFiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Listen for agent messages
    ipcRenderer.on('agent:message', (event: any, message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for terminal outputs
    ipcRenderer.on('agent:terminal-output', (event: any, output: TerminalOutput) => {
      setTerminalOutputs(prev => {
        const existing = prev.find(t => t.command === output.command && t.status === 'running');
        if (existing) {
          return prev.map(t => 
            t.command === output.command && t.status === 'running' 
              ? { ...output, expanded: false } 
              : t
          );
        }
        return [...prev, { ...output, expanded: false }];
      });
    });

    // Listen for file changes
    ipcRenderer.on('agent:file-change', (event: any, change: any) => {
      // Flash the file/directory
      setFlashFiles(prev => new Set(prev).add(change.path));
      setTimeout(() => {
        setFlashFiles(prev => {
          const next = new Set(prev);
          next.delete(change.path);
          return next;
        });
      }, 1000);

      // Refresh file tree
      if (projectPath) {
        refreshFileTree();
      }
    });

    return () => {
      ipcRenderer.removeAllListeners('agent:message');
      ipcRenderer.removeAllListeners('agent:terminal-output');
      ipcRenderer.removeAllListeners('agent:file-change');
    };
  }, [projectPath]);

  const refreshFileTree = async () => {
    if (projectPath) {
      const tree = await ipcRenderer.invoke('agent:get-project-files', projectPath);
      setFileTree(tree);
    }
  };

  const handleSendPrompt = async (prompt: string) => {
    if (!prompt.trim() || isProcessing) return;

    setIsProcessing(true);
    setTerminalOutputs([]);
    
    try {
      await ipcRenderer.invoke('agent:send-prompt', prompt);
    } catch (error) {
      console.error('Error sending prompt:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = async (filePath: string) => {
    setSelectedFile(filePath);
    try {
      const content = await ipcRenderer.invoke('agent:read-file', filePath);
      setFileContent(content);
    } catch (error) {
      console.error('Error reading file:', error);
      setFileContent('// Error reading file');
    }
  };

  const handleProjectPathChange = async (path: string) => {
    setProjectPath(path);
    const tree = await ipcRenderer.invoke('agent:get-project-files', path);
    setFileTree(tree);
  };

  const toggleTerminalOutput = (index: number) => {
    setTerminalOutputs(prev => 
      prev.map((output, i) => 
        i === index ? { ...output, expanded: !output.expanded } : output
      )
    );
  };

  return (
    <div className="flex h-screen bg-dark-bg text-dark-text">
      {/* Left Panel - File Explorer */}
      <div className="w-1/4 border-r border-dark-border flex flex-col">
        <FileExplorer
          fileTree={fileTree}
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onProjectPathChange={handleProjectPathChange}
          projectPath={projectPath}
          fileContent={fileContent}
          flashFiles={flashFiles}
        />
      </div>

      {/* Center Panel - Chat */}
      <div className="flex-1 flex flex-col">
        <ChatPanel
          messages={messages}
          terminalOutputs={terminalOutputs}
          onToggleTerminal={toggleTerminalOutput}
        />
        
        {/* Bottom Input Panel */}
        <InputPanel
          onSendPrompt={handleSendPrompt}
          isProcessing={isProcessing}
        />
      </div>

      {/* Right Panel - Reserved for future (preview, etc.) */}
      <div className="w-16 border-l border-dark-border">
        {/* Intentionally empty - future expansion */}
      </div>
    </div>
  );
};

export default App;
