'use client';

import { useState, FormEvent } from 'react';
import { Send, MoreVertical, X } from 'lucide-react';
import { Input } from '@/src/components/ui/Input';

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isOwn?: boolean;
}

const mockMessages: Message[] = [
  { id: '1', sender: 'Liam', text: 'Hi team, just wanted to quickly go over the project timeline.', time: '10:01 AM' },
  { id: '2', sender: 'Sophia', text: "Sounds good, Liam. I'm ready.", time: '10:02 AM' },
  { id: '3', sender: 'You', text: "Great. Let's start with the initial milestones.", time: '10:03 AM', isOwn: true },
];

interface ChatSidebarProps {
  onClose: () => void;
}

export function ChatSidebar({ onClose }: ChatSidebarProps) {
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // TODO: Send message logic
      console.log('Send message:', message);
      setMessage('');
    }
  };

  return (
    <div className="w-80 bg-[#1a1f2e] h-full flex flex-col border-l border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h3 className="text-white font-semibold">Meeting chat</h3>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mockMessages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-sm font-medium text-white">{msg.sender}</span>
              <span className="text-xs text-gray-500">{msg.time}</span>
            </div>
            <div
              className={`max-w-[85%] px-3 py-2 rounded-lg ${
                msg.isOwn
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-200'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 text-sm"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
}
