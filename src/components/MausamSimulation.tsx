import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Manim-style pipeline simulation component ───────────────────────────────
// Shows the full GenAI pipeline as an animated mathematical visualization

interface Particle { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number; }

const PIPELINE_PHASES = [
    {
        id: 'satellite',
        label: '01',
        title: 'Satellite Telemetry',
        subtitle: 'ISRO MOSDAC · NASA EarthData',
        color: '#3b82f6',
        equation: 'T_cloud < −62°C  →  Convective Trigger',
        desc: 'Cloud-top temperature drops signal deep atmospheric convection — a precursor to cloudbursts.',
    },
    {
        id: 'rag',
        label: '02',
        title: 'RAG Embedding',
        subtitle: 'Qdrant DB · dim=768',
        color: '#a855f7',
        equation: 'sim(q, k) = q·kᵀ / (|q|·|k|)',
        desc: 'Spatial chunks embedded into high-dimensional vectors. Cosine similarity retrieves analogous historical events.',
    },
    {
        id: 'navier',
        label: '03',
        title: 'Navier-Stokes PINN',
        subtitle: 'Physics-Informed Neural Network',
        color: '#22c55e',
        equation: 'ρ(∂u/∂t + u·∇u) = −∇p + μ∇²u + f',
        desc: 'The loss function penalizes fluid momentum violations — the model learns to respect physics, not just data.',
    },
    {
        id: 'mlir',
        label: '04',
        title: 'Mausam-IR Lowering',
        subtitle: 'PyTorch → MLIR → ARM Cortex',
        color: '#eab308',
        equation: '7.2 GB → 18.2 MB (99.75%↓)',
        desc: 'INT4 AWQ quantization + LoRA fusion crushes the model 99.75% without meaningful accuracy loss.',
    },
    {
        id: 'edge',
        label: '05',
        title: 'Edge Inference',
        subtitle: 'ESP32-S3 · LoRaWAN · $2.40',
        color: '#ef4444',
        equation: 'P(flood | T+6h) = 0.84 → ALERT ⚠',
        desc: 'The MCU broadcasts a 6-byte LoRa alert packet 15 km across the valley network within 71ms.',
    },
];

const MausamSimulation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activePhase, setActivePhase] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);
    const particlesRef = useRef<Particle[]>([]);
    const animRef = useRef<number>(0);
    const phaseRef = useRef(0);
    const tickRef = useRef(0);

    // Auto-advance phases
    useEffect(() => {
        if (!autoPlay) return;
        const t = setInterval(() => {
            const next = (phaseRef.current + 1) % PIPELINE_PHASES.length;
            phaseRef.current = next;
            setActivePhase(next);
        }, 4000);
        return () => clearInterval(t);
    }, [autoPlay]);

    // Canvas particle animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resize();
        window.addEventListener('resize', resize);

        const spawnParticles = (phase: number) => {
            const color = PIPELINE_PHASES[phase].color;
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            for (let i = 0; i < 18; i++) {
                particlesRef.current.push({
                    x: w * 0.5 + (Math.random() - 0.5) * 200,
                    y: h * 0.5 + (Math.random() - 0.5) * 100,
                    vx: (Math.random() - 0.5) * 2.5,
                    vy: (Math.random() - 0.5) * 1.5 - 0.5,
                    life: 1,
                    color,
                    size: Math.random() * 3 + 1.5,
                });
            }
        };

        const draw = () => {
            animRef.current = requestAnimationFrame(draw);
            tickRef.current++;
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;

            ctx.fillStyle = 'rgba(3,5,8,0.25)';
            ctx.fillRect(0, 0, w, h);

            // Spawn new particles periodically
            if (tickRef.current % 6 === 0) spawnParticles(phaseRef.current);

            // Update + draw particles
            particlesRef.current = particlesRef.current.filter(p => p.life > 0.02);
            for (const p of particlesRef.current) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy -= 0.015; // float upward
                p.life *= 0.97;

                ctx.save();
                ctx.globalAlpha = p.life * 0.85;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.restore();
            }

            // Draw flow lines between phases
            const phase = phaseRef.current;
            const cx = w * 0.5;
            const cy = h * 0.5;
            const t = (tickRef.current % 120) / 120;

            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 160);
            gradient.addColorStop(0, `${PIPELINE_PHASES[phase].color}22`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);

            // Animated ring
            ctx.beginPath();
            ctx.arc(cx, cy, 80 + Math.sin(t * Math.PI * 2) * 8, 0, Math.PI * 2);
            ctx.strokeStyle = `${PIPELINE_PHASES[phase].color}33`;
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(cx, cy, 120 + Math.cos(t * Math.PI * 2) * 12, 0, Math.PI * 2 * t);
            ctx.strokeStyle = `${PIPELINE_PHASES[phase].color}88`;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw connecting line to next phase dot
            const nextPhase = (phase + 1) % PIPELINE_PHASES.length;
            const angle = (phase / PIPELINE_PHASES.length) * Math.PI * 2 - Math.PI / 2;
            const nextAngle = (nextPhase / PIPELINE_PHASES.length) * Math.PI * 2 - Math.PI / 2;
            const radius = 140;
            const x1 = cx + Math.cos(angle) * radius;
            const y1 = cy + Math.sin(angle) * radius;
            const x2 = cx + Math.cos(nextAngle) * radius;
            const y2 = cy + Math.sin(nextAngle) * radius;

            // Animated dot along path
            const tx = x1 + (x2 - x1) * t;
            const ty = y1 + (y2 - y1) * t;
            ctx.beginPath();
            ctx.arc(tx, ty, 4, 0, Math.PI * 2);
            ctx.fillStyle = PIPELINE_PHASES[phase].color;
            ctx.shadowColor = PIPELINE_PHASES[phase].color;
            ctx.shadowBlur = 12;
            ctx.fill();
        };

        draw();
        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener('resize', resize);
        };
    }, []);

    const phase = PIPELINE_PHASES[activePhase];

    return (
        <div style={{ background: 'rgba(3,5,8,.95)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,.07)', background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                    <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                        style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '.75rem', color: '#22c55e', fontWeight: 700 }}>MAUSAM-IR PIPELINE SIMULATION</span>
                </div>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                    <button onClick={() => setAutoPlay(!autoPlay)} style={{
                        background: autoPlay ? 'rgba(34,197,94,.1)' : 'rgba(255,255,255,.04)',
                        border: `1px solid ${autoPlay ? 'rgba(34,197,94,.4)' : 'rgba(255,255,255,.1)'}`,
                        borderRadius: '6px', padding: '.3rem .8rem',
                        fontFamily: 'var(--mono)', fontSize: '.65rem',
                        color: autoPlay ? '#22c55e' : 'var(--muted)', cursor: 'pointer'
                    }}>
                        {autoPlay ? '⏸ PAUSE' : '▶ PLAY'}
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '460px' }}>

                {/* LEFT: Canvas animation */}
                <div style={{ position: 'relative', borderRight: '1px solid rgba(255,255,255,.06)' }}>
                    <canvas ref={canvasRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
                    {/* Phase orbit dots */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                        <div style={{ position: 'relative', width: '320px', height: '320px' }}>
                            {PIPELINE_PHASES.map((p, i) => {
                                const angle = (i / PIPELINE_PHASES.length) * Math.PI * 2 - Math.PI / 2;
                                const r = 140;
                                const x = 160 + Math.cos(angle) * r;
                                const y = 160 + Math.sin(angle) * r;
                                const isActive = i === activePhase;
                                return (
                                    <motion.div key={p.id}
                                        onClick={() => { setActivePhase(i); phaseRef.current = i; setAutoPlay(false); }}
                                        animate={{ scale: isActive ? 1.3 : 1, opacity: isActive ? 1 : 0.4 }}
                                        style={{
                                            position: 'absolute', left: x - 20, top: y - 20, width: 40, height: 40,
                                            background: isActive ? `${p.color}22` : 'rgba(255,255,255,.04)',
                                            border: `1px solid ${isActive ? p.color : 'rgba(255,255,255,.1)'}`,
                                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', pointerEvents: 'auto'
                                        }}>
                                        <span style={{ fontFamily: 'var(--mono)', fontSize: '.62rem', color: isActive ? p.color : 'var(--muted)', fontWeight: 700 }}>{p.label}</span>
                                    </motion.div>
                                );
                            })}
                            {/* Center label */}
                            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                                <div style={{ fontFamily: 'var(--mono)', fontSize: '.65rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Phase</div>
                                <motion.div key={activePhase} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                    style={{ fontFamily: 'var(--mono)', fontSize: '2rem', fontWeight: 900, color: phase.color, lineHeight: 1 }}>
                                    {String(activePhase + 1).padStart(2, '0')}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Phase detail */}
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'rgba(0,0,0,.2)' }}>
                    <AnimatePresence mode="wait">
                        <motion.div key={activePhase} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.35 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>

                            {/* Phase indicator */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                                <div style={{ width: '3px', height: '36px', background: phase.color, borderRadius: '2px', flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontFamily: 'var(--mono)', fontSize: '.65rem', color: phase.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>
                                        Phase {String(activePhase + 1).padStart(2, '0')}
                                    </div>
                                    <div style={{ fontFamily: 'var(--sans)', fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>{phase.title}</div>
                                    <div style={{ fontFamily: 'var(--mono)', fontSize: '.65rem', color: 'var(--muted)' }}>{phase.subtitle}</div>
                                </div>
                            </div>

                            {/* Equation */}
                            <div style={{ background: `${phase.color}0d`, border: `1px solid ${phase.color}33`, borderRadius: '8px', padding: '1rem 1.25rem' }}>
                                <div style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '.5rem' }}>
                                    Key Equation
                                </div>
                                <div style={{ fontFamily: 'var(--mono)', fontSize: '.82rem', color: phase.color, letterSpacing: '.5px', lineHeight: 1.6 }}>
                                    {phase.equation}
                                </div>
                            </div>

                            {/* Description */}
                            <p style={{ fontFamily: 'var(--sans)', fontSize: '.83rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                                {phase.desc}
                            </p>

                            {/* Progress dots */}
                            <div style={{ display: 'flex', gap: '.5rem', marginTop: 'auto' }}>
                                {PIPELINE_PHASES.map((p, i) => (
                                    <motion.div key={p.id}
                                        onClick={() => { setActivePhase(i); phaseRef.current = i; setAutoPlay(false); }}
                                        animate={{ width: i === activePhase ? '28px' : '8px', background: i === activePhase ? p.color : 'rgba(255,255,255,.15)' }}
                                        style={{ height: '4px', borderRadius: '4px', cursor: 'pointer' }} />
                                ))}
                            </div>

                            {/* Phase nav */}
                            <div style={{ display: 'flex', gap: '.5rem' }}>
                                <button onClick={() => { const p = (activePhase - 1 + PIPELINE_PHASES.length) % PIPELINE_PHASES.length; setActivePhase(p); phaseRef.current = p; setAutoPlay(false); }}
                                    style={{ flex: 1, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '6px', padding: '.5rem', fontFamily: 'var(--mono)', fontSize: '.68rem', color: 'var(--muted)', cursor: 'pointer' }}>
                                    ← Prev
                                </button>
                                <button onClick={() => { const p = (activePhase + 1) % PIPELINE_PHASES.length; setActivePhase(p); phaseRef.current = p; setAutoPlay(false); }}
                                    style={{ flex: 1, background: `${phase.color}18`, border: `1px solid ${phase.color}44`, borderRadius: '6px', padding: '.5rem', fontFamily: 'var(--mono)', fontSize: '.68rem', color: phase.color, cursor: 'pointer' }}>
                                    Next →
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Phase tabs bar */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex' }}>
                {PIPELINE_PHASES.map((p, i) => (
                    <button key={p.id} onClick={() => { setActivePhase(i); phaseRef.current = i; setAutoPlay(false); }}
                        style={{
                            flex: 1, padding: '.75rem .5rem', background: i === activePhase ? `${p.color}12` : 'transparent',
                            borderRight: '1px solid rgba(255,255,255,.04)', border: 'none', borderTop: `2px solid ${i === activePhase ? p.color : 'transparent'}`,
                            cursor: 'pointer', transition: 'all .2s'
                        }}>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: '.58rem', color: i === activePhase ? p.color : 'var(--muted)', textTransform: 'uppercase' }}>
                            {p.label}
                        </div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: '.62rem', color: i === activePhase ? '#fff' : 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.title}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MausamSimulation;
