import React, { useState } from 'react';
import { FileNode } from '../App';

interface FileExplorerProps {
  fileTree: FileNode | null;
  selectedFile: string | null;
  onFileSelect: (path: string) => void;
  onProjectPathChange: (path: string) => void;
  projectPath: string;
  fileContent: string;
  flashFiles: Set<string>;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  fileTree,
  selectedFile,
  onFileSelect,
  onProjectPathChange,
  projectPath,
  fileContent,
  flashFiles
}) => {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [showProjectInput, setShowProjectInput] = useState(true);
  const [tempPath, setTempPath] = useState('');

  const toggleDirectory = (path: string) => {
    setExpandedDirs(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleSetProjectPath = () => {
    if (tempPath) {
      onProjectPathChange(tempPath);
      setShowProjectInput(false);
    }
  };

  const renderFileTree = (node: FileNode, level: number = 0): React.ReactNode => {
    const isExpanded = expandedDirs.has(node.path);
    const isFlashing = flashFiles.has(node.path);
    const isSelected = selectedFile === node.path;

    return (
      <div key={node.path} className={isFlashing ? 'flash-animation' : ''}>
        <div
          className={`flex items-center py-1 px-2 cursor-pointer hover:bg-dark-surface ${
            isSelected ? 'bg-dark-surface' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'directory') {
              toggleDirectory(node.path);
            } else {
              onFileSelect(node.path);
            }
          }}
        >
          {node.type === 'directory' && (
            <span className="mr-2 text-dark-text-secondary">
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          <span className={node.type === 'directory' ? 'text-accent-blue' : 'text-dark-text'}>
            {node.name}
          </span>
        </div>
        {node.type === 'directory' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderFileTree(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Project Path Input */}
      {showProjectInput ? (
        <div className="p-4 border-b border-dark-border">
          <label className="block text-sm text-dark-text-secondary mb-2">
            Caminho do Projeto:
          </label>
          <input
            type="text"
            value={tempPath}
            onChange={(e) => setTempPath(e.target.value)}
            placeholder="/path/to/project"
            className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded text-dark-text text-sm focus:outline-none focus:border-accent-blue"
            onKeyPress={(e) => e.key === 'Enter' && handleSetProjectPath()}
          />
          <button
            onClick={handleSetProjectPath}
            className="mt-2 w-full px-3 py-2 bg-accent-blue text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            Carregar Projeto
          </button>
        </div>
      ) : (
        <div className="p-4 border-b border-dark-border flex items-center justify-between">
          <div className="text-sm text-dark-text-secondary truncate flex-1">
            {projectPath}
          </div>
          <button
            onClick={() => setShowProjectInput(true)}
            className="ml-2 text-accent-blue hover:text-blue-400 text-xs"
          >
            Alterar
          </button>
        </div>
      )}

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto">
        {fileTree ? (
          renderFileTree(fileTree)
        ) : (
          <div className="p-4 text-center text-dark-text-secondary text-sm">
            Nenhum projeto carregado
          </div>
        )}
      </div>

      {/* Code Editor */}
      {selectedFile && (
        <div className="h-1/2 border-t border-dark-border flex flex-col">
          <div className="px-4 py-2 bg-dark-surface border-b border-dark-border text-sm text-dark-text-secondary">
            {selectedFile.split('/').pop()}
          </div>
          <div className="flex-1 overflow-y-auto">
            <pre className="p-4 text-xs">
              <code className="text-dark-text">{fileContent}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
