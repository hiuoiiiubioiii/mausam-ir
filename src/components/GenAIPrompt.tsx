import React, { useState, useEffect, useRef } from 'react';
import { Send, Cpu, Zap, Box } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    isCode?: boolean;
}

const GenAIPrompt: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Meta Llama 3 (NVIDIA Modulus Fine-Tuned) initialized. Describe the atmospheric topology and target region for the PINN (Physics-Informed Neural Network).' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!inputMessage.trim()) return;

        // Add user message
        setMessages(prev => [...prev, { role: 'user', content: inputMessage }]);
        setInputMessage('');
        setIsTyping(true);

        // Simulate AI thinking and generating PyTorch code
        setTimeout(() => {
            const responses: Message[] = [
                { role: 'assistant', content: 'Analyzing parameters across Earth-2 API... Generating PyTorch Navier-Stokes physics constraints mapped to Himalayan terrain data.' },
                {
                    role: 'assistant',
                    isCode: true,
                    content: `import torch
import torch.nn as nn
from modulus.models.fno import FNO

class HimalayanMeshPINN(nn.Module):
    # Navier-Stokes constraints for flash flood simulation
    def __init__(self, in_channels=4, out_channels=2):
        super().__init__()
        self.fno = FNO(
            in_channels=in_channels,
            out_channels=out_channels,
            decoder_layers=2,
            decoder_layer_size=128,
            dimension=3, # 3D OpenUSD mapping
            latent_channels=32,
            num_fno_layers=4,
            num_fno_modes=16,
            padding=9
        )
        
    def forward(self, terrain_sdf, era5_wind, imd_rain):
        # Physics-informed localized prediction
        x = torch.cat([terrain_sdf, era5_wind, imd_rain], dim=1)
        velocity_field = self.fno(x)
        return velocity_field

# Initialize model for Compiler Trace
pinn_model = HimalayanMeshPINN()
print("[Modulus] PINN graph ready for LLVM Lowering.")`
                }
            ];

            setMessages(prev => [...prev, responses[0]]);

            setTimeout(() => {
                setMessages(prev => [...prev, responses[1]]);
                setIsTyping(false);
            }, 1500);

        }, 800);
    };

    return (
        <div className="component-container" style={{ height: '500px' }}>
            <div className="terminal-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', background: 'linear-gradient(90deg, rgba(60,255,140,0.1) 0%, rgba(0,0,0,0) 100%)' }}>
                <Zap size={16} className="glow-green" />
                <span className="terminal-title">META LLAMA V3 // NVIDIA MODULUS CODEGEN</span>
            </div>

            <div
                ref={scrollRef}
                style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%'
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.5rem',
                            color: msg.role === 'user' ? 'var(--neon-blue)' : 'var(--neon-green)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            textTransform: 'uppercase'
                        }}>
                            {msg.role === 'user' ? <Cpu size={12} /> : <Box size={12} />}
                            {msg.role}
                        </div>

                        {msg.isCode ? (
                            <div style={{
                                background: '#0d1117',
                                padding: '1rem',
                                borderRadius: '6px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.85rem',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#e6edf3',
                                whiteSpace: 'pre-wrap',
                                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
                            }}>
                                {msg.content}
                            </div>
                        ) : (
                            <div style={{
                                background: msg.role === 'user' ? 'rgba(0, 210, 255, 0.1)' : 'rgba(255,255,255,0.05)',
                                border: msg.role === 'user' ? '1px solid rgba(0, 210, 255, 0.3)' : '1px solid rgba(255,255,255,0.1)',
                                padding: '1rem',
                                borderRadius: '8px',
                                borderTopRightRadius: msg.role === 'user' ? 0 : '8px',
                                borderTopLeftRadius: msg.role === 'assistant' ? 0 : '8px',
                                lineHeight: 1.5,
                                color: 'var(--text-main)'
                            }}>
                                {msg.content}
                            </div>
                        )}
                    </motion.div>
                ))}

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ alignSelf: 'flex-start', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.8rem' }}
                    >
                        <span className="glow-green">_</span> generating tensors...
                    </motion.div>
                )}
            </div>

            <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="E.g., Map fluid dynamics for a 200mm/hr cloudburst over Kedarnath valley coordinates..."
                        style={{
                            flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '4px', padding: '0.75rem 1rem', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', outline: 'none'
                        }}
                    />
                    <button
                        className="primary-btn"
                        onClick={handleSend}
                        style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenAIPrompt;
