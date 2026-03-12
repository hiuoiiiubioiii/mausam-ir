import React, { useState, useEffect } from 'react';
import { TerminalSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const OptimizationPasses: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);

    const passes = [
        { name: '--genai-prune-weights', desc: 'Weight Pruning: Removing inactive LLM attention heads' },
        { name: '--genai-fuse-lora', desc: 'LoRA Fusion: Merging Low-Rank Adapters into Base Model' },
        { name: '--genai-mixed-precision', desc: 'Mixed Precision Casting: FP16 to INT8 for Edge Constraints' },
        { name: '--genai-quantize-4bit', desc: 'AWQ Quantization: Compressing LLM weights to 4-bit for MCU deployment' },
        { name: '--genai-compile-engine', desc: 'Lowering Tensor Graph to Edge Logic...' },
        { name: 'llama.cpp -march=xtensa -O3', desc: 'Generating compact GGUF inference code for ESP32 Target...' }
    ];

    useEffect(() => {
        let currentIndex = 0;

        // Initial banner
        setLogs([
            'Mausam GenAI Orchestrator v4.2 (Llama.cpp Edge)',
            'Target: Edge IoT Native / GGUF Compact',
            '==============================================================',
            'Running Model Compression & LoRA Passes...'
        ]);

        const interval = setInterval(() => {
            if (currentIndex < passes.length) {
                setLogs(prev => [
                    ...prev,
                    '',
                    `>> Executing Pass: ${passes[currentIndex].name}`,
                    `[INFO] ${passes[currentIndex].desc}`
                ]);

                // Add fake metrics based on pass type
                if (passes[currentIndex].name.includes('quantize')) {
                    setLogs(prev => [...prev, '  -> Compressed LLM weights from 7.2GB to 3.5MB']);
                } else if (passes[currentIndex].name.includes('prune')) {
                    setLogs(prev => [...prev, '  -> Elided 104 dead neural pathways from attention graph']);
                }

                currentIndex++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    setLogs(prev => [
                        ...prev,
                        '==============================================================',
                        '[SUCCESS] Local Edge LLM compressed to 18.2 MB footprint.',
                        '[SUCCESS] Inference Engine ready for Bare-Metal Flash.'
                    ]);
                }, 800);
            }
        }, 1200);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="component-container" style={{ height: '500px' }}>
            <div className="terminal-header" style={{ borderBottom: '1px solid rgba(60, 255, 140, 0.2)' }}>
                <TerminalSquare size={16} className="glow-green" />
                <span className="terminal-title" style={{ color: 'var(--neon-green)' }}>MODEL COMPRESSION // LORA & QUANTIZATION TRACE</span>
            </div>

            <div className="terminal-box" style={{ flex: 1, padding: '1.5rem', background: '#050505' }}>
                {logs.map((log, i) => {
                    const isCommand = log.startsWith('>>');
                    const isSuccess = log.includes('[SUCCESS]');
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{
                                color: isCommand ? 'var(--neon-blue)' : isSuccess ? 'var(--neon-green)' : 'var(--text-muted)',
                                marginBottom: '4px'
                            }}
                        >
                            {log}
                        </motion.div>
                    );
                })}
                {logs.length < (passes.length * 3 + 6) && (
                    <motion.div
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        style={{ display: 'inline-block', width: '8px', height: '14px', background: 'var(--neon-green)', marginTop: '4px' }}
                    />
                )}
            </div>
        </div>
    );
};

export default OptimizationPasses;
