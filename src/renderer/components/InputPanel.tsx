import React, { useState, useRef, useEffect } from 'react';

interface InputPanelProps {
  onSendPrompt: (prompt: string) => void;
  isProcessing: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({ onSendPrompt, isProcessing }) => {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [prompt]);

  const handleSubmit = () => {
    if (prompt.trim() && !isProcessing) {
      onSendPrompt(prompt);
      setPrompt('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-dark-border p-4">
      <div className="max-w-4xl mx-auto flex items-end space-x-3">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Descreva o que você quer construir... (Shift+Enter para nova linha)"
          className="flex-1 px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-dark-text placeholder-dark-text-secondary resize-none focus:outline-none focus:border-accent-blue transition-colors"
          rows={1}
          disabled={isProcessing}
        />
        <button
          onClick={handleSubmit}
          disabled={isProcessing || !prompt.trim()}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isProcessing || !prompt.trim()
              ? 'bg-dark-surface text-dark-text-secondary cursor-not-allowed'
              : 'bg-accent-blue text-white hover:bg-blue-600'
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </span>
          ) : (
            'Enviar'
          )}
        </button>
      </div>
      <div className="max-w-4xl mx-auto mt-2 text-xs text-dark-text-secondary text-center">
        O agente planejará e executará sua solicitação autonomamente
      </div>
    </div>
  );
};

export default InputPanel;
