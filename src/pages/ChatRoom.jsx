import { useState, useEffect } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import api from '../api/axiosConfig';

const ChatRoom = ({ receiverId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const fetchMessages = async () => {
        const res = await api.get(`/messages/history?user1Id=MY_ID&user2Id=${receiverId}`);
        setMessages(res.data);
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        await api.post('/messages/send', { receiverId, content: input });
        setInput('');
        fetchMessages();
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            <header className="p-4 border-b flex items-center gap-4">
                <ArrowLeft onClick={() => window.history.back()} />
                <h2 className="font-bold">Contact Support/Customer</h2>
            </header>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.senderId === 'MY_ID' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-4 rounded-3xl ${
                            m.senderId === 'MY_ID' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
                        }`}>
                            {m.content}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-gray-50 flex items-center gap-2">
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-4 bg-white rounded-2xl outline-none shadow-sm"
                />
                <button onClick={handleSend} className="p-4 bg-indigo-600 text-white rounded-2xl">
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};