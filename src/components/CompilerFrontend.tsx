import React, { useEffect, useState } from 'react';
import { Network, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CompilerFrontend: React.FC = () => {
    const [nodes, setNodes] = useState<number>(0);
    const [steps, setSteps] = useState<any[]>([]); // To store the completed reasoning steps

    const REASONING_STAGES = [
        { name: '[AST PARSING] Identifying nn.Module constraints', type: 'parse' },
        { name: '[CHAIN-OF-THOUGHT] Tracing Navier-Stokes fluid dependencies', type: 'transform' },
        { name: '[CODEGEN] Building intermediate LLVM topology', type: 'parse' },
        { name: '[RAG FUSION] Injecting ISRO Vector DB bounds', type: 'transform' },
        { name: '[OUTPUT] MLIR Dialect Generation Complete', type: 'success' },
    ];

    useEffect(() => {
        // Simulate parsing the AST
        if (nodes < REASONING_STAGES.length) { // Use REASONING_STAGES.length for condition
            const t = setTimeout(() => {
                setNodes(nodes + 1);
                setSteps((prev) => [...prev, REASONING_STAGES[nodes]]); // Add the current step
            }, 600);
            return () => clearTimeout(t);
        }
    }, [nodes, REASONING_STAGES]); // Add REASONING_STAGES to dependency array

    const astLayers = [
        { name: '[SYSTEM] Activating Mausam-GenAI Protocol', type: 'Prompt Ingestion' },
        { name: 'Retrieve Local Context (Vector DB)', type: 'RAG Lookup' },
        { name: 'Chain-of-Thought: Synthesizing Navier-Stokes Constraints', type: 'Reasoning Trace' },
        { name: 'Abstract Syntax Tree (AST) Generation', type: 'Structure Builder' },
        { name: 'LoRA Adapter Weights Sourced', type: 'Model Loading' }
    ];

    return (
        <div className="component-container" style={{ height: '450px' }}>
            <div className="terminal-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Network size={16} style={{ color: '#ffbd2e' }} />
                <span className="terminal-title" style={{ color: '#ffbd2e' }}>LLM REASONING TRACE // CHAIN-OF-THOUGHT -&gt; AST</span>
            </div>

            <div style={{ display: 'flex', flex: 1, padding: '2rem', gap: '2rem' }}>

                {/* Abstract Syntax Tree (PyTorch) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                        LLM Chain-of-Thought (Reasoning Trace)
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {astLayers.map((layer, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: idx < nodes ? 1 : 0.2, x: 0 }}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    padding: '0.75rem',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '0.8rem'
                                }}
                            >
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                                <div style={{ flex: 1 }}>{layer.name}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>[{layer.type}]</div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Conversion Arrow */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.div
                        animate={{ x: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <ArrowRight size={32} color="var(--text-muted)" />
                    </motion.div>
                </div>

                {/* MLIR Dialect (Mausam-IR) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                        Generated Abstract Syntax Tree (AST Code)
                    </h3>

                    <div className="terminal-box" style={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px' }}>
                        {nodes > 0 && <div className="glow-blue">AST.module @MausamGenAI {'{'}</div>}
                        {nodes > 1 && <div>  func.forward_pass(%context: tensor&lt;4x128x128xf32&gt;) {'{'}</div>}
                        {nodes > 2 && <div style={{ color: '#ffbd2e' }}>    %0 = "rag.vector_lookup"(%context) : ...</div>}
                        {nodes > 3 && <div style={{ color: '#3cff8c' }}>    %1 = "llm.lora_infused_generation"(%0)</div>}
                        {nodes > 4 && <div>    return %1 : tensor&lt;2x128x128xf32&gt;</div>}
                        {nodes > 4 && <div>  {'}'}</div>}
                        {nodes > 4 && <div className="glow-blue">{'}'}</div>}

                        {nodes < REASONING_STAGES.length && (
                            <div style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
                                <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>_</motion.span> Waiting for reasoning trace traversal...
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Steps Live Feed Animation (fixing unused 'steps' variable) */}
            <div style={{ padding: '0 2rem 2rem 2rem' }}>
                <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '1rem' }}>
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.75rem', fontFamily: 'var(--font-mono)' }}>LIVE ADVANCED METRICS // AGENT THOUGHT PROCESS</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ color: step.type === 'success' ? 'var(--neon-green)' : step.type === 'parse' ? 'var(--neon-blue)' : '#ffbd2e' }}
                            >
                                {`[+${(idx * 0.6).toFixed(1)}s] -> ${step.name}`}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompilerFrontend;
