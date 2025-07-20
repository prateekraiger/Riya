import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useVoiceStore } from '../store/useVoiceStore';
import { MicIcon, SendIcon } from './icons';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState('');
  const { isLoading } = useChatStore();
  const { isListening, setIsListening } = useVoiceStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [text]);

  const handleSend = useCallback(() => {
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  }, [text, isLoading, onSendMessage]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleMicClick = () => {
    setIsListening(!isListening);
    if(!isListening) {
        console.log("Started listening...");
    } else {
        console.log("Stopped listening...");
    }
  }

  return (
    <div className="flex items-end gap-2 bg-slate-700/50 p-2 rounded-xl border border-slate-600/80 focus-within:border-indigo-500 transition-colors duration-300">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Say something to Riya..."
        rows={1}
        className="flex-1 bg-transparent resize-none focus:outline-none p-2 placeholder-slate-400 disabled:opacity-50 max-h-40"
        disabled={isLoading}
      />
      <button
        onClick={handleMicClick}
        title={isListening ? 'Stop listening' : 'Use voice'}
        className={`p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-pink-500 ${
          isListening ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'
        }`}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        <MicIcon className="w-5 h-5" />
      </button>
      <button
        onClick={handleSend}
        disabled={isLoading || !text.trim()}
        title="Send message"
        className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-500 transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 disabled:scale-100 active:scale-95"
        aria-label="Send message"
      >
        <SendIcon className="w-5 h-5" />
      </button>
    </div>
  );
};