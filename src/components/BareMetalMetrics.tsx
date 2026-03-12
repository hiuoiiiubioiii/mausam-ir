import React from 'react';
import { Cpu, Microchip, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const BareMetalMetrics: React.FC = () => {
    return (
        <div className="component-container">
            <div className="terminal-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Microchip size={16} style={{ color: '#ff5f56' }} />
                <span className="terminal-title" style={{ color: '#ff5f56' }}>LLM EVALUATION METRICS // EDGE DEPLOYMENT</span>
            </div>

            <div style={{ padding: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>

                    {/* Target MCU Info */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Cpu size={16} color="var(--neon-blue)" /> Edge GenAI Hardware Profile
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>MCU:</span>
                                <span style={{ color: '#fff' }}>ESP32-S3 / Cortex-M0</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Cost:</span>
                                <span className="glow-green">$2.40 USD</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Power Source:</span>
                                <span style={{ color: '#ffbd2e' }}>Solar / Li-ion</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Network:</span>
                                <span style={{ color: 'var(--neon-blue)' }}>LoRaWAN (Long Range)</span>
                            </div>
                        </div>
                    </div>

                    {/* Compiled Binary Metrics */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(60, 255, 140, 0.2)' }}>
                        <h3 style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={16} color="var(--neon-green)" /> Inference & Eval Trace
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Compressed Model Size (GGUF):</span>
                                <span style={{ color: '#fff' }}>18.2 MB <span style={{ color: 'var(--neon-green)', fontSize: '0.7rem' }}>[4-bit Quant]</span></span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Token Generation Latency:</span>
                                <span style={{ color: '#fff' }}>14.2 Tokens/sec</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>BLEU / ROUGE-L Precision:</span>
                                <span style={{ color: 'var(--neon-blue)' }}>89.4% / 0.88</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Context Window Limit:</span>
                                <span style={{ color: '#ffbd2e' }}>2048 Tokens</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            background: 'transparent',
                            border: '2px solid var(--neon-red)',
                            color: '#ff5f56',
                            padding: '1rem 3rem',
                            borderRadius: '30px',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 'bold',
                            letterSpacing: '2px',
                            cursor: 'pointer',
                            textShadow: '0 0 10px rgba(255, 95, 86, 0.5)',
                            boxShadow: '0 0 20px rgba(255, 95, 86, 0.2) inset'
                        }}
                    >
                        TRIGGER EDGE LLM OTA Sideload // KEDARNATH-NODE-01
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default BareMetalMetrics;
