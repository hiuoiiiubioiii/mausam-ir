import React, { useState, useEffect } from 'react';
import { TerminalSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const OptimizationPasses: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);

    const passes = [
        { name: '--mausam-dce', desc: 'Dead Code Elimination: Removing inactive tensor ops' },
        { name: '--mausam-loop-unroll', desc: 'Loop Unrolling: Expanding spatial convolutions for cache locality' },
        { name: '--mausam-fuse-ops', desc: 'Operator Fusion: Combining Conv2D + BatchNorm + ReLU' },
        { name: '--mausam-quantize', desc: 'INT8 Quantization: Compressing FP32 Earth-2 weights for MCU' },
        { name: '--mausam-lower-to-llvm', desc: 'Lowering MLIR to LLVM IR...' },
        { name: 'llc -march=xtensa -O3', desc: 'Generating machine code for ESP32 Target...' }
    ];

    useEffect(() => {
        let currentIndex = 0;

        // Initial banner
        setLogs([
            'Mausam Compiler Toolchain v2.4a (LLVM 17.0.1)',
            'Target: xtensa-esp32-none-elf',
            '==============================================================',
            'Running C++ Optimization Passes...'
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
                    setLogs(prev => [...prev, '  -> Reduced tensor weights from 14.2MB to 3.5MB']);
                } else if (passes[currentIndex].name.includes('dce')) {
                    setLogs(prev => [...prev, '  -> Elided 104 dead nodes from PyTorch graph']);
                }

                currentIndex++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    setLogs(prev => [
                        ...prev,
                        '==============================================================',
                        '[SUCCESS] Model successfully compiled to 18.2 KB binary.',
                        '[SUCCESS] Ready for Bare-Metal Flash.'
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
                <span className="terminal-title" style={{ color: 'var(--neon-green)' }}>C++ LLVM PASSES // COMPILER TRACE</span>
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
