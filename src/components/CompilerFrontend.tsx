import React, { useState, useEffect, useMemo } from 'react';
import { Network, ArrowRight, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface IRNode {
    id: string;
    op: string;
    type: string;
    shape: string;
    level: number;
    color: string;
    status: 'pending' | 'active' | 'done';
}

interface CoTStep {
    ts: string;
    text: string;
    kind: 'reason' | 'rag' | 'physics' | 'code' | 'done';
}

const CompilerFrontend: React.FC = () => {
    const [cotSteps, setCotSteps] = useState<CoTStep[]>([]);
    const [irNodes, setIrNodes] = useState<IRNode[]>([]);
    const [activeNode, setActiveNode] = useState(-1);

    const COT_SEQUENCE: CoTStep[] = useMemo(() => [
        { ts: 'T+0.0s', kind: 'reason', text: '[TOKENIZE] Input prompt → BPE token stream (vocab: 32k, ctx: 8192)' },
        { ts: 'T+0.3s', kind: 'rag', text: '[RAG RETRIEVE] k=42 spatial nearest-neighbours from Qdrant embedding space' },
        { ts: 'T+0.7s', kind: 'reason', text: '[COT-1] Hypothesis: terrain slope > 0.004 → Froude number Fr > 1 (supercritical flow)' },
        { ts: 'T+1.1s', kind: 'physics', text: '[NAVIER-STOKES] Applying ρ(∂u/∂t + u·∇u) = −∇p + μ∇²u + f to Himalayan mesh' },
        { ts: 'T+1.4s', kind: 'physics', text: '[BOUNDARY] No-slip wall condition encoded for SRTM terrain SDF colliders' },
        { ts: 'T+1.8s', kind: 'code', text: '[AST BUILD] Capturing torch.nn.Module computational graph for lowering' },
        { ts: 'T+2.1s', kind: 'code', text: '[MLIR LOWER] PyTorch FX → torch-mlir → Mausam-IR dialect (5 passes)' },
        { ts: 'T+2.5s', kind: 'code', text: '[LORA INJECT] Merging rank-8 Kedarnath adapter weights into base graph' },
        { ts: 'T+3.0s', kind: 'done', text: '[EMIT] Mausam-IR MLIR ready for optimization pipeline ✓' },
    ], []);

    const IR_NODES: IRNode[] = useMemo(() => [
        { id: 'N0', op: 'module @MausamPINN', type: 'Module', shape: '—', level: 0, color: '#3b82f6', status: 'pending' },
        { id: 'N1', op: 'rag.vector_lookup', type: 'Retrieval', shape: 'f32[42,768]', level: 1, color: '#a855f7', status: 'pending' },
        { id: 'N2', op: 'linalg.matmul', type: 'Linear', shape: 'f32[4,128,128]', level: 2, color: '#f97316', status: 'pending' },
        { id: 'N3', op: 'mausam.lora_fusion', type: 'LoRA', shape: 'f32[4,128,128]', level: 2, color: '#eab308', status: 'pending' },
        { id: 'N4', op: 'mausam.ns_residual', type: 'Physics', shape: 'f32[3,128,128]', level: 3, color: '#22c55e', status: 'pending' },
        { id: 'N5', op: 'affine.apply', type: 'Quantize', shape: 'i8[3,128,128]', level: 4, color: '#ef4444', status: 'pending' },
        { id: 'N6', op: 'func.return', type: 'Output', shape: 'i8[2,128,128]', level: 5, color: '#22c55e', status: 'pending' },
    ], []);

    useEffect(() => {
        // Stream CoT steps
        COT_SEQUENCE.forEach((step, _i) => {
            setTimeout(() => setCotSteps(prev => [...prev, step]), _i * 700 + 300);
        });
        // Animate IR nodes
        IR_NODES.forEach((_node, i) => {
            setTimeout(() => {
                setActiveNode(i);
                setIrNodes(_prev => {
                    const next = [...IR_NODES].map((n, j) => ({
                        ...n, status: j < i ? 'done' : j === i ? 'active' : 'pending'
                    } as IRNode));
                    return next;
                });
            }, i * 900 + 500);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="component-container" style={{ height: '580px', overflow: 'hidden' }}>
            <div className="terminal-header" style={{ borderBottom: '1px solid rgba(255, 190, 50, 0.25)', background: 'linear-gradient(90deg, rgba(255,190,50,0.06), transparent)' }}>
                <Network size={15} style={{ color: '#eab308' }} />
                <span className="terminal-title" style={{ color: '#eab308' }}>CHAIN-OF-THOUGHT → MLIR LOWERING // Mausam-IR AST Compiler v2.4</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', height: 'calc(100% - 44px)' }}>

                {/* LEFT: Chain-of-Thought Trace */}
                <div style={{ padding: '1rem', borderRight: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LLM Reasoning Trace</div>

                    {/* Navier-Stokes equation display */}
                    <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.5rem' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>PHYSICS CONSTRAINT (Navier-Stokes):</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#22c55e', letterSpacing: '0.5px' }}>
                            ρ(∂<b>u</b>/∂t + <b>u</b>·∇<b>u</b>) = −∇p + μ∇²<b>u</b> + <b>f</b>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            𝓛_total = 𝓛_data + λ·𝓛_physics + γ·𝓛_boundary
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            {[['λ', '0.70', '#f97316'], ['γ', '0.30', '#3b82f6'], ['ρ', '0.87 kg/m³', '#a855f7']].map(([k, v, c]) => (
                                <span key={k} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: c as string }}>{k}={v}</span>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <AnimatePresence>
                            {cotSteps.map((step, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                                    style={{
                                        display: 'flex', gap: '0.5rem', padding: '0.35rem 0.5rem', borderRadius: '5px',
                                        background: step.kind === 'done' ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.02)',
                                        border: `1px solid ${step.kind === 'physics' ? 'rgba(34,197,94,0.25)' : step.kind === 'rag' ? 'rgba(168,85,247,0.2)' : step.kind === 'code' ? 'rgba(234,179,8,0.2)' : step.kind === 'done' ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.05)'}`
                                    }}>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', flexShrink: 0 }}>{step.ts}</span>
                                    <span style={{
                                        fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                                        color: step.kind === 'physics' ? '#22c55e' : step.kind === 'rag' ? '#a855f7' : step.kind === 'code' ? '#eab308' : step.kind === 'done' ? '#22c55e' : 'var(--text-main)'
                                    }}>
                                        {step.text}
                                    </span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {cotSteps.length < COT_SEQUENCE.length && (
                            <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7 }}
                                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#eab308' }}>█ reasoning...</motion.span>
                        )}
                    </div>
                </div>

                {/* RIGHT: MLIR IR Graph */}
                <div style={{ padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Code2 size={12} /> Mausam-IR MLIR Dialect <ArrowRight size={10} /> ARM Cortex
                    </div>

                    {/* IR Node Graph */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                        {irNodes.map((node, _i) => (
                            <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: `${node.level * 16}px`, flexShrink: 0 }} />
                                {node.level > 0 && <div style={{ width: '12px', height: '1px', background: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />}
                                <motion.div animate={{ borderColor: node.status === 'active' ? node.color : node.status === 'done' ? `${node.color}88` : 'rgba(255,255,255,0.08)', background: node.status === 'active' ? `${node.color}18` : node.status === 'done' ? `${node.color}0a` : 'rgba(255,255,255,0.02)' }}
                                    style={{ flex: 1, border: '1px solid rgba(255,255,255,0.08)', borderRadius: '5px', padding: '0.4rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <motion.div animate={{ opacity: node.status === 'active' ? [1, 0.2, 1] : 1 }} transition={{ repeat: Infinity, duration: 0.6 }}
                                        style={{ width: '7px', height: '7px', borderRadius: '50%', background: node.status === 'pending' ? 'rgba(255,255,255,0.2)' : node.color, flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: node.status !== 'pending' ? '#fff' : 'var(--text-muted)' }}>{node.op}</div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)' }}>{node.type} · {node.shape}</div>
                                    </div>
                                    <motion.div animate={{ opacity: node.status === 'done' ? 1 : 0 }} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#22c55e' }}>✓</motion.div>
                                </motion.div>
                            </div>
                        ))}
                    </div>

                    {/* Generated MLIR code block */}
                    <div style={{ background: '#060a0f', border: '1px solid rgba(234,179,8,0.2)', borderRadius: '7px', padding: '0.85rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#e2e8f0', flex: 1, overflowY: 'auto', lineHeight: 1.7 }}>
                        {activeNode >= 0 && <div style={{ color: '#3b82f6' }}>module @MausamPINN {'{'}</div>}
                        {activeNode >= 1 && <div style={{ paddingLeft: '1rem' }}>{'  '}func.func @forward_pass(</div>}
                        {activeNode >= 1 && <div style={{ paddingLeft: '2rem', color: '#a855f7' }}>%context : tensor{'<'}4x128x128xf32{'>'}</div>}
                        {activeNode >= 1 && <div style={{ paddingLeft: '1rem' }}>) -{'>'} tensor{'<'}2x128x128xi8{'>'} {'{'}</div>}
                        {activeNode >= 2 && <div style={{ paddingLeft: '2rem', color: '#a855f7' }}>{'  '}%0 = "rag.vector_lookup"(%context) {'{'}k = 42{'}'}{'>'}</div>}
                        {activeNode >= 3 && <div style={{ paddingLeft: '2rem', color: '#f97316' }}>{'  '}%1 = "linalg.matmul"(%0, %lora_A) : ...</div>}
                        {activeNode >= 4 && <div style={{ paddingLeft: '2rem', color: '#eab308' }}>{'  '}%2 = "mausam.lora_fusion"(%1, %lora_B) {'{'} rank = 8 {'}'}</div>}
                        {activeNode >= 5 && <div style={{ paddingLeft: '2rem', color: '#22c55e' }}>{'  '}%3 = "mausam.ns_residual"(%2, %terrain_sdf)</div>}
                        {activeNode >= 6 && <div style={{ paddingLeft: '2rem', color: '#ef4444' }}>{'  '}%4 = "affine.quantize"(%3) {'{'} bits = 4 {'}'}</div>}
                        {activeNode >= 7 && <div style={{ paddingLeft: '2rem' }}>{'  '}return %4</div>}
                        {activeNode >= 7 && <div style={{ paddingLeft: '1rem' }}>{'}'}</div>}
                        {activeNode >= 7 && <div style={{ color: '#3b82f6' }}>{'}'}</div>}
                        {activeNode < 7 && (
                            <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7 }} style={{ color: '#eab308' }}>█</motion.span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompilerFrontend;
