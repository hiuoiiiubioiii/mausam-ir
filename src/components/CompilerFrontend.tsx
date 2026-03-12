import React, { useEffect, useState } from 'react';
import { Network, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CompilerFrontend: React.FC = () => {
    const [nodes, setNodes] = useState<number>(0);

    useEffect(() => {
        // Simulate parsing the AST
        if (nodes < 5) {
            const t = setTimeout(() => setNodes(nodes + 1), 600);
            return () => clearTimeout(t);
        }
    }, [nodes]);

    const astLayers = [
        { name: 'torch.nn.Module (HimalayanMeshPINN)', type: 'EntryPoint' },
        { name: 'FNO (Fourier Neural Operator)', type: 'SubGraph' },
        { name: 'aten::cat (dim=1)', type: 'TensorOp' },
        { name: 'aten::matmul', type: 'MathOp' },
        { name: 'aten::relu_', type: 'Activation' }
    ];

    return (
        <div className="component-container" style={{ height: '450px' }}>
            <div className="terminal-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Network size={16} style={{ color: '#ffbd2e' }} />
                <span className="terminal-title" style={{ color: '#ffbd2e' }}>LLVM GRAPH LOWERING // PYTORCH -&gt; MAUSAM-IR</span>
            </div>

            <div style={{ display: 'flex', flex: 1, padding: '2rem', gap: '2rem' }}>

                {/* Abstract Syntax Tree (PyTorch) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                        PyTorch JIT Trace (High-Level AST)
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
                        Mausam-IR (MLIR Dialect)
                    </h3>

                    <div className="terminal-box" style={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px' }}>
                        {nodes > 0 && <div className="glow-blue">module @MausamCompiler {'{'}</div>}
                        {nodes > 1 && <div>  func.func @forward(%arg0: tensor&lt;4x128x128xf32&gt;) -&gt; tensor&lt;2x128x128xf32&gt; {'{'}</div>}
                        {nodes > 2 && <div style={{ color: '#ffbd2e' }}>    %0 = "mausam.fno_layer"(%arg0) : ...</div>}
                        {nodes > 3 && <div style={{ color: '#3cff8c' }}>    %1 = "mausam.fluid_dynamic_constraint"(%0)</div>}
                        {nodes > 4 && <div>    return %1 : tensor&lt;2x128x128xf32&gt;</div>}
                        {nodes > 4 && <div>  {'}'}</div>}
                        {nodes > 4 && <div className="glow-blue">{'}'}</div>}

                        {nodes < 5 && (
                            <div style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
                                Waiting for graph traversal...
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CompilerFrontend;
