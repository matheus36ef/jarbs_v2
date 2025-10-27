import React, { useEffect, useRef } from 'react';
import { Message, TerminalOutput } from '../App';

interface ChatPanelProps {
  messages: Message[];
  terminalOutputs: TerminalOutput[];
  onToggleTerminal: (index: number) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  terminalOutputs,
  onToggleTerminal
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, terminalOutputs]);

  const renderMessage = (message: Message, index: number) => {
    let bgColor = '';
    let textColor = 'text-dark-text';
    let icon = '';

    switch (message.type) {
      case 'user':
        bgColor = 'bg-dark-surface';
        icon = '👤';
        break;
      case 'thought':
        textColor = 'text-dark-text-secondary';
        icon = '💭';
        break;
      case 'plan':
        bgColor = 'bg-dark-surface';
        textColor = 'text-accent-blue';
        icon = '📋';
        break;
      case 'action':
        textColor = 'text-accent-green';
        icon = '⚙️';
        break;
      case 'result':
        textColor = 'text-dark-text-secondary';
        icon = '✓';
        break;
      case 'error':
        textColor = 'text-accent-red';
        icon = '❌';
        break;
    }

    return (
      <div key={index} className={`p-4 ${bgColor}`}>
        <div className="flex items-start space-x-3">
          <span className="text-lg">{icon}</span>
          <div className="flex-1">
            <div className={`text-sm ${textColor} whitespace-pre-wrap`}>
              {message.content}
            </div>
            <div className="text-xs text-dark-text-secondary mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTerminalOutput = (output: TerminalOutput, index: number) => {
    let statusColor = '';
    let statusIcon = '';

    switch (output.status) {
      case 'running':
        statusColor = 'text-yellow-500';
        statusIcon = '⟳';
        break;
      case 'success':
        statusColor = 'text-accent-green';
        statusIcon = '✓';
        break;
      case 'error':
        statusColor = 'text-accent-red';
        statusIcon = '✗';
        break;
    }

    return (
      <div key={index} className="mx-4 my-2 border border-dark-border rounded overflow-hidden">
        <div
          className="bg-dark-surface p-3 cursor-pointer hover:bg-opacity-80 flex items-center justify-between"
          onClick={() => onToggleTerminal(index)}
        >
          <div className="flex items-center space-x-3 flex-1">
            <span className={`text-lg ${statusColor}`}>{statusIcon}</span>
            <code className="text-sm text-dark-text">$ {output.command}</code>
          </div>
          <span className={`text-sm ${statusColor}`}>
            {output.status === 'running' ? 'Executando...' : output.status === 'success' ? 'Sucesso' : 'Falha'}
          </span>
        </div>
        
        {output.expanded && (output.output || output.error) && (
          <div className="bg-black p-3 border-t border-dark-border">
            {output.output && (
              <pre className="text-xs text-green-400 mb-2">
                {output.output}
              </pre>
            )}
            {output.error && (
              <pre className="text-xs text-red-400">
                {output.error}
              </pre>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.length === 0 && terminalOutputs.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-light text-dark-text mb-2">
              Agente-Codificador
            </h2>
            <p className="text-dark-text-secondary text-sm">
              Descreva seu objetivo e eu construirei para você
            </p>
          </div>
        </div>
      ) : (
        <div>
          {messages.map((message, index) => {
            // Insert terminal outputs at appropriate positions
            const terminalsBefore = terminalOutputs.filter((_, i) => i === index);
            return (
              <React.Fragment key={`msg-${index}`}>
                {terminalsBefore.map((terminal, i) => renderTerminalOutput(terminal, i))}
                {renderMessage(message, index)}
              </React.Fragment>
            );
          })}
          {/* Render remaining terminal outputs */}
          {terminalOutputs.slice(messages.length).map((terminal, i) => 
            renderTerminalOutput(terminal, messages.length + i)
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatPanel;
