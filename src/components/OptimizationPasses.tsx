import React, { useState, useEffect, useMemo } from 'react';
import { TerminalSquare, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Pass {
    id: string;
    cmd: string;
    label: string;
    detail: string;
    color: string;
    sizeBefore: string;
    sizeAfter: string;
    reduction: string;
    metric: string;
}

const OptimizationPasses: React.FC = () => {
    const [currentPass, setCurrentPass] = useState(-1);
    const [logs, setLogs] = useState<{ text: string; color: string }[]>([]);
    const [complete, setComplete] = useState(false);
    const [lossData, setLossData] = useState<number[]>([]);

    const passes: Pass[] = useMemo(() => [
        { id: 'p0', cmd: '--analyze-graph', label: 'Graph Analysis', detail: 'Tracing PINN computation graph — 47 ops, 213 edges, 8.2M parameters', color: '#3b82f6', sizeBefore: '7.2 GB (FP32)', sizeAfter: '7.2 GB', reduction: '—', metric: 'Params: 8.24M' },
        { id: 'p1', cmd: '--prune-heads', label: 'Attention Head Pruning', detail: 'Magnitude-based pruning · threshold=1e-4 · removing 104 dead attention pathways', color: '#f97316', sizeBefore: '7.2 GB', sizeAfter: '3.8 GB', reduction: '47%↓', metric: 'Sparsity: 0.52' },
        { id: 'p2', cmd: '--fuse-lora rank=8', label: 'LoRA Adapter Fusion', detail: 'Merging rank-8 Kedarnath sector adapters (680 KB delta) into base weights', color: '#a855f7', sizeBefore: '3.8 GB', sizeAfter: '3.8 GB', reduction: '+680 KB', metric: 'Delta: r=8, α=16' },
        { id: 'p3', cmd: '--cast fp32→fp16', label: 'Mixed Precision (FP16)', detail: 'Converting all weight tensors FP32→FP16 — BFloat16 for activations', color: '#eab308', sizeBefore: '3.8 GB', sizeAfter: '1.9 GB', reduction: '50%↓', metric: 'BF16 activations' },
        { id: 'p4', cmd: '--awq-quant int4', label: 'INT4 AWQ Quantization', detail: 'Activation-aware Weight Quantization — group_size=128, zero-point calibrated on ISRO data', color: '#22c55e', sizeBefore: '1.9 GB', sizeAfter: '420 MB', reduction: '78%↓', metric: 'BLEU: 0.912 (±0.3%)' },
        { id: 'p5', cmd: '--gguf-pack', label: 'GGUF Packing', detail: 'Packing quantized tensors into llama.cpp-compatible GGUF binary format', color: '#ef4444', sizeBefore: '420 MB', sizeAfter: '18.2 MB', reduction: '96%↓', metric: 'GGUF v3 spec' },
        { id: 'p6', cmd: '-march=armv7m -O3', label: 'ARM Cortex-M0 Compile', detail: 'Final IR → ARM Thumb-2 assembly via llama.cpp · ESP32-S3 target binary', color: '#22c55e', sizeBefore: '18.2 MB', sizeAfter: '18.2 MB (flash)', reduction: 'FINAL', metric: '14.2 tok/s' },
    ], []);

    useEffect(() => {
        setLogs([
            { text: '╔══════════════════════════════════════════════════╗', color: '#22c55e' },
            { text: '║  Mausam-IR Optimization Engine v2.4 (llama.cpp)  ║', color: '#22c55e' },
            { text: '║  Target: ESP32-S3 (ARM Cortex-M0, 512KB SRAM)    ║', color: '#3b82f6' },
            { text: '╚══════════════════════════════════════════════════╝', color: '#22c55e' },
            { text: '', color: '' },
            { text: '>> Input: MausamPINN (NVIDIA Modulus, FP32, 8.2M params)', color: 'var(--text-muted)' },
            { text: '>> Running 7-pass optimization pipeline...', color: 'var(--text-muted)' },
        ]);
        // Simulate loss curve
        const initialLoss = Array.from({ length: 5 }, (_, i) => 2.8 - i * 0.15 + Math.random() * 0.1);
        setLossData(initialLoss);

        let idx = 0;
        const interval = setInterval(() => {
            if (idx >= passes.length) {
                clearInterval(interval);
                setTimeout(() => {
                    setLogs(prev => [
                        ...prev,
                        { text: '', color: '' },
                        { text: '══════════════════════════════════════════════════', color: '#22c55e' },
                        { text: '[✓] PIPELINE COMPLETE — ESP32 binary ready to flash', color: '#22c55e' },
                        { text: '[✓] SRAM footprint: 18.2 MB / 8MB flash · Fits ✓', color: '#22c55e' },
                        { text: '[✓] Inference: 14.2 tokens/sec  |  Power: 180 mW', color: '#22c55e' },
                        { text: '[✓] BLEU: 0.912 · ROUGE-L: 0.891 · L_phys: 1.2e-4', color: '#3b82f6' },
                    ]);
                    setComplete(true);
                }, 600);
                return;
            }
            const p = passes[idx];
            setCurrentPass(idx);
            setLogs(prev => [
                ...prev,
                { text: '', color: '' },
                { text: `[PASS ${idx}] $ mausam-opt ${p.cmd}`, color: p.color },
                { text: `  ↪ ${p.detail}`, color: 'var(--text-muted)' },
                { text: `  ↪ ${p.sizeBefore} → ${p.sizeAfter}  (${p.reduction})`, color: '#fff' },
                { text: `  ↪ Metric: ${p.metric}`, color: p.color },
            ]);
            setLossData(prev => [...prev, Math.max(0.1, prev[prev.length - 1] - 0.2 - Math.random() * 0.15)].slice(-20));
            idx++;
        }, 1300);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const maxLoss = Math.max(...lossData, 0.1);

    return (
        <div className="component-container" style={{ height: '580px', overflow: 'hidden' }}>
            <div className="terminal-header" style={{ borderBottom: '1px solid rgba(34,197,94,0.2)', background: 'linear-gradient(90deg, rgba(34,197,94,0.06), transparent)' }}>
                <TerminalSquare size={15} className="glow-green" />
                <span className="terminal-title" style={{ color: '#22c55e' }}>MODEL COMPRESSION // LoRA + AWQ INT4 + GGUF Pack → ARM Cortex Flash</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', height: 'calc(100% - 44px)' }}>

                {/* LEFT: Terminal Log */}
                <div style={{ padding: '0.75rem 1rem', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.67rem', background: '#050507', borderRight: '1px solid rgba(255,255,255,0.06)', lineHeight: 1.7 }}>
                    <AnimatePresence>
                        {logs.map((log, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                                style={{ color: log.color || 'transparent', minHeight: log.text ? 'auto' : '0.5rem' }}>
                                {log.text}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {!complete && (
                        <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7 }} style={{ color: '#22c55e' }}>█</motion.span>
                    )}
                </div>

                {/* RIGHT: Progress Visualization */}
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
                    {/* Loss Curve */}
                    <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.75rem' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>MODEL SIZE REDUCTION CURVE</div>
                        <div style={{ height: '60px', display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
                            {lossData.map((v, i) => (
                                <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(v / maxLoss) * 100}%` }}
                                    style={{ flex: 1, background: `rgba(34,197,94,${0.3 + (i / lossData.length) * 0.7})`, borderRadius: '2px 2px 0 0', transition: 'height 0.3s ease' }} />
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            <span>7.2 GB</span><span>→</span><span style={{ color: '#22c55e' }}>18.2 MB</span>
                        </div>
                    </div>

                    {/* Pass Progress */}
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Optimization Passes</div>
                    {passes.map((p, i) => (
                        <motion.div key={p.id} animate={{ borderColor: i === currentPass ? p.color : i < currentPass ? `${p.color}55` : 'rgba(255,255,255,0.07)', background: i === currentPass ? `${p.color}12` : 'rgba(255,255,255,0.02)' }}
                            style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '0.45rem 0.65rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    {i < currentPass ? (
                                        <span style={{ fontSize: '0.7rem', color: p.color }}>✓</span>
                                    ) : i === currentPass ? (
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                            <Zap size={11} color={p.color} />
                                        </motion.div>
                                    ) : (
                                        <div style={{ width: '11px', height: '11px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }} />
                                    )}
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: i <= currentPass ? '#fff' : 'var(--text-muted)' }}>{p.label}</span>
                                </div>
                                {i <= currentPass && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: p.color }}>{p.reduction}</span>}
                            </div>
                        </motion.div>
                    ))}

                    {/* Final Summary */}
                    {complete && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            style={{ background: 'rgba(34,197,94,0.08)', border: '2px solid rgba(34,197,94,0.4)', borderRadius: '8px', padding: '0.75rem', marginTop: '0.25rem' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#22c55e', fontWeight: 700, marginBottom: '0.4rem' }}>✓ COMPILATION COMPLETE</div>
                            {[['Size', '7.2 GB → 18.2 MB (99.75%↓)'], ['Speed', '14.2 tok/s on Cortex-M0'], ['BLEU', '0.912 (target: >0.880 ✓)'], ['Power', '180 mW (solar viable)']].map(([k, v]) => (
                                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>{k}:</span>
                                    <span style={{ color: '#22c55e' }}>{v}</span>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OptimizationPasses;
