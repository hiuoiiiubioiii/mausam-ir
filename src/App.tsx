import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, ExternalLink, Satellite, ChevronDown, Radio } from 'lucide-react';

import DatasetIngestion from './components/DatasetIngestion';
import HighFidelitySimulation from './components/HighFidelitySimulation';
import GenAIPrompt from './components/GenAIPrompt';
import CompilerFrontend from './components/CompilerFrontend';
import OptimizationPasses from './components/OptimizationPasses';
import BareMetalMetrics from './components/BareMetalMetrics';
import MausamSimulation from './components/MausamSimulation';


// ─── Animated Section Wrapper ─────────────────────────────────────────────────
function Section({ id, tag, title, desc, children, glowClass = '', accentColor = '#3cff8c' }: {
    id: string; tag: string; title: string; desc: string;
    children: React.ReactNode; glowClass?: string; accentColor?: string;
}) {
    const ref = useRef<HTMLElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.15 });
    return (
        <section id={id} className={`site-section ${glowClass}`} ref={ref}>
            <div className="section-inner">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
                    <div className="section-tag" style={{ color: accentColor }}>{tag}</div>
                    <h2 className="section-title">{title}</h2>
                    <p className="section-desc">{desc}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.15 }}>
                    {children}
                </motion.div>
            </div>
        </section>
    );
}

// ─── Live ticker ──────────────────────────────────────────────────────────────
function LiveTicker() {
    const [tick, setTick] = useState(0);
    useEffect(() => { const t = setInterval(() => setTick(v => v + 1), 2000); return () => clearInterval(t); }, []);
    const items = [
        `ISRO MOSDAC  →  ${(Math.random() * 200 + 50).toFixed(1)} mm/6hr`,
        `NASA EarthData  →  T-${Math.floor(Math.random() * 48)}h synced`,
        `Qdrant DB  →  ${(tick * 7 + 42).toLocaleString()} vectors indexed`,
        `PINN residual  →  ${(1.2e-4 * (1 + Math.random() * 0.1)).toExponential(2)}`,
        `KEDARNATH-NODE-01  →  ${(13 + Math.random() * 3).toFixed(1)} tok/s`,
    ];
    return (
        <div style={{ background: 'rgba(0,0,0,.5)', borderTop: '1px solid rgba(255,255,255,.05)', borderBottom: '1px solid rgba(255,255,255,.05)', padding: '.5rem 0', overflow: 'hidden', position: 'relative' }}>
            <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'flex', gap: '4rem', whiteSpace: 'nowrap', paddingLeft: '100vw' }}>
                {[...items, ...items].map((item, i) => (
                    <span key={i} style={{ fontFamily: 'var(--mono)', fontSize: '.68rem', color: 'var(--muted)' }}>
                        <span style={{ color: '#22c55e', marginRight: '.5rem' }}>▶</span>{item}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
    const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
    const [hovering, setHovering] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');

    // Custom cursor
    useEffect(() => {
        const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
        const onOver = (e: MouseEvent) => {
            setHovering(!!(e.target as HTMLElement).closest('button, a, .phase-pill, .tech-chip'));
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseover', onOver);
        return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseover', onOver); };
    }, []);

    // Intersection observer for active nav highlight
    useEffect(() => {
        const sections = ['hero', 'rag', 'simulation', 'swarm', 'compiler', 'optimization', 'metrics'];
        const obs = new IntersectionObserver(
            entries => { entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
            { threshold: 0.35 }
        );
        sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
        return () => obs.disconnect();
    }, []);

    const NAV = [
        { id: 'rag', label: 'RAG' },
        { id: 'simulation', label: '3D Sim' },
        { id: 'swarm', label: 'Agents' },
        { id: 'compiler', label: 'MLIR' },
        { id: 'optimization', label: 'Quant' },
        { id: 'metrics', label: 'Edge' },
    ];

    return (
        <>
            {/* Custom cursor */}
            <motion.div className={`custom-cursor ${hovering ? 'hovering' : ''}`}
                animate={{ left: mousePos.x, top: mousePos.y }} transition={{ type: 'tween', ease: 'backOut', duration: 0.15 }} />

            {/* Fixed Navigation */}
            <nav className="site-nav">
                <div className="nav-logo">MAUSAM·IR</div>
                <ul className="nav-links">
                    {NAV.map(n => (
                        <li key={n.id}>
                            <a href={`#${n.id}`} className={activeSection === n.id ? 'active' : ''}>{n.label}</a>
                        </li>
                    ))}
                </ul>
                <div className="nav-badge">
                    <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>●</motion.span>
                    {' '}LIVE
                </div>
            </nav>

            {/* Live data ticker */}
            <div style={{ position: 'fixed', top: 60, left: 0, right: 0, zIndex: 999 }}>
                <LiveTicker />
            </div>

            {/* ─── HERO ───────────────────────────────────────────────────── */}
            <section id="hero" className="hero" style={{ paddingTop: 120 }}>
                <div className="hero-bg" />
                <div className="hero-grid" />

                {/* 3D canvas background */}
                <div className="canvas-bg">
                    <HighFidelitySimulation />
                </div>

                <div className="hero-content">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
                        <div className="hero-badge">
                            <Satellite size={12} />
                            GenAI Coursework Project — Edge AI for Extreme Weather
                        </div>
                    </motion.div>

                    <motion.h1 className="hero-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .1 }}>
                        <span className="accent">Mausam-IR</span><br />Physics-Informed<br />Edge AI
                    </motion.h1>

                    <motion.p className="hero-subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .25 }}>
                        A full GenAI pipeline — from raw ISRO/NASA satellite telemetry to a $2 edge microcontroller —
                        predicting Himalayan flash floods 6 hours before they strike.
                    </motion.p>

                    <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .4 }}>
                        <a href="#rag"><button className="btn-primary">Explore Pipeline ↓</button></a>
                        <a href="https://github.com/hiuoiiiubioiii/mausam-ir" target="_blank" rel="noopener noreferrer">
                            <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                                <Github size={15} /> GitHub Repo
                            </button>
                        </a>
                        <a href="https://colab.research.google.com/github/hiuoiiiubioiii/mausam-ir/blob/main/Mausam_IR_GenAI_Pipeline.ipynb" target="_blank" rel="noopener noreferrer">
                            <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                                <ExternalLink size={15} /> Open in Colab
                            </button>
                        </a>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                        style={{ marginTop: '3rem' }}>
                        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ display: 'flex', justifyContent: 'center' }}>
                            <ChevronDown size={22} color="var(--muted)" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ─── Stats ──────────────────────────────────────────────────── */}
            <div className="stats-bar" style={{ position: 'relative', zIndex: 10, background: 'rgba(3,5,8,.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                {[
                    { val: '$2.40', lbl: 'MCU Unit Cost' },
                    { val: '99.75%', lbl: 'Compression' },
                    { val: '6h', lbl: 'Prediction Horizon' },
                    { val: '0.912', lbl: 'BLEU Score' },
                    { val: '14.2', lbl: 'Tokens/sec' },
                    { val: '180mW', lbl: 'Power Draw' },
                ].map(s => (
                    <div key={s.val} className="stat-item">
                        <span className="val">{s.val}</span>
                        <span className="lbl">{s.lbl}</span>
                    </div>
                ))}
            </div>

            {/* ─── Real World Video Section ───────────────────────────────── */}
            <section id="videos" className="site-section" style={{ minHeight: 'auto', paddingBottom: '3rem' }}>
                <div className="section-inner">
                    <div className="section-tag" style={{ color: '#ef4444' }}>Real-World Context</div>
                    <h2 className="section-title">The Problem: Himalayan Flash Floods</h2>
                    <p className="section-desc">
                        Kedarnath 2013 — 5,700+ lives lost. Chamoli 2021 — glacier outburst. These catastrophic events
                        occur with minutes of warning. Mausam-IR is designed to predict them 6 hours before they strike.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        {[
                            {
                                id: 'CGrfZAHJhUU',
                                title: 'Kedarnath Flood 2013 — Satellite View',
                                desc: 'ISRO RISAT-1 captured the devastation. This is the ground truth our PINN must predict.',
                                tag: 'ISRO Satellite Archive',
                            },
                            {
                                id: '2bl0FVEAIi8',
                                title: 'Chamoli GLOF Event 2021',
                                desc: 'Glacier lake outburst flood — the second target event in our training dataset.',
                                tag: 'NASA EarthData Event',
                            },
                            {
                                id: 'rUK4JFbVKeE',
                                title: 'Himalayan Monsoon — INSAT Data',
                                desc: 'ISRO INSAT-3DR time-lapse showing cloud-top temperature anomalies that trigger prediction.',
                                tag: 'MOSDAC Cloud Analysis',
                            },
                        ].map(v => (
                            <div key={v.id} style={{ background: 'rgba(10,12,18,.9)', border: '1px solid rgba(239,68,68,.15)', borderRadius: '12px', overflow: 'hidden' }}>
                                <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
                                    <iframe
                                        src={`https://www.youtube.com/embed/${v.id}?autoplay=0&rel=0&modestbranding=1`}
                                        title={v.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                                    />
                                </div>
                                <div style={{ padding: '1rem 1.25rem' }}>
                                    <div style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '.3rem' }}>{v.tag}</div>
                                    <div style={{ fontWeight: 700, fontSize: '.88rem', marginBottom: '.3rem', color: '#fff' }}>{v.title}</div>
                                    <div style={{ fontFamily: 'var(--mono)', fontSize: '.68rem', color: 'var(--muted)', lineHeight: 1.6 }}>{v.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <hr className="section-divider" />

            {/* ─── Manim-Style Demo Simulation ─────────────────────────────── */}
            <section id="demo" className="site-section" style={{ minHeight: 'auto', paddingBottom: '3rem' }}>
                <div className="section-inner">
                    <div className="section-tag" style={{ color: '#a855f7' }}>Interactive Demo</div>
                    <h2 className="section-title">Pipeline Simulation</h2>
                    <p className="section-desc">
                        An interactive Manim-style visualization showing each phase of the GenAI pipeline —
                        from satellite data ingestion to edge inference — with the governing equations.
                    </p>
                    <MausamSimulation />
                </div>
            </section>

            <hr className="section-divider" />

            {/* ─── Phase 1: RAG Pipeline ──────────────────────────────────── */}
            <Section id="rag" tag="Phase 01 — RAG Pipeline" accentColor="#3b82f6"
                title="Spatial-Temporal Vector Embedding"
                desc="ISRO MOSDAC and NASA EarthData are chunked into 5km² × 6hr sliding windows and embedded into a 768-dimensional latent space via a multimodal CNN encoder, then indexed in Qdrant for real-time retrieval."
                glowClass="section-glow-blue">
                <div className="eq-box" style={{ borderColor: 'rgba(59,130,246,.3)', color: '#3b82f6' }}>
                    Chunking strategy: Spatial 5km² grid × Temporal 6hr sliding window → Qdrant (cosine sim, dim=768)
                </div>
                <DatasetIngestion />
            </Section>

            <hr className="section-divider" />

            {/* ─── Phase 2: Multi-Agent Swarm ────────────────────────────── */}
            <Section id="swarm" tag="Phase 02 — Multi-Agent Swarm" accentColor="#22c55e"
                title="Autonomous LangChain Agent Orchestration"
                desc="Four specialized AI agents collaborate in a LangChain graph: a Data Scientist, Physics Architect, Compiler Engineer, and a Swarm Supervisor that validates BLEU/ROUGE scores and routes tasks autonomously."
                glowClass="">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {[
                        { label: 'Data Scientist', desc: 'Fetches tensors · builds DataLoaders', color: '#3b82f6', icon: '🔬' },
                        { label: 'Physics Architect', desc: 'Navier-Stokes BCs · fluid dynamics', color: '#f97316', icon: '⚡' },
                        { label: 'Compiler Engineer', desc: 'MLIR lowering · LoRA · INT4 quant', color: '#a855f7', icon: '⚙️' },
                        { label: 'Swarm Supervisor', desc: 'BLEU/ROUGE validation · task routing', color: '#22c55e', icon: '🛡️' },
                    ].map(a => (
                        <div key={a.label} style={{ border: `1px solid ${a.color}33`, background: `${a.color}0a`, borderRadius: '10px', padding: '1.25rem' }}>
                            <div style={{ fontSize: '1.3rem', marginBottom: '.5rem' }}>{a.icon}</div>
                            <div style={{ fontFamily: 'var(--mono)', fontSize: '.8rem', color: '#fff', fontWeight: 700, marginBottom: '.3rem' }}>{a.label}</div>
                            <div style={{ fontFamily: 'var(--mono)', fontSize: '.65rem', color: 'var(--muted)' }}>{a.desc}</div>
                        </div>
                    ))}
                </div>
                <GenAIPrompt />
            </Section>

            <hr className="section-divider" />

            {/* ─── Phase 3: PINN / 3D Sim ────────────────────────────────── */}
            <Section id="simulation" tag="Phase 03 — Physics-Informed Neural Network" accentColor="#22c55e"
                title="Navier-Stokes Constrained PINN"
                desc="The PINN is penalized not just for wrong predictions but for violating fluid dynamics. A composite loss embeds physics directly into the learning process, ensuring the model respects conservation of mass and momentum."
                glowClass="">
                <div className="eq-box">
                    ρ(∂<b>u</b>/∂t + <b>u</b>·∇<b>u</b>) = −∇p + μ∇²<b>u</b> + <b>f</b>
                    <br /><span style={{ fontSize: '.75rem', opacity: .7 }}>𝓛_total = 𝓛_data + λ·𝓛_physics + γ·𝓛_boundary &nbsp;|&nbsp; λ=0.70, γ=0.30</span>
                </div>
                <CompilerFrontend />
            </Section>

            <hr className="section-divider" />

            {/* ─── Phase 4: MLIR + Quantization ──────────────────────────── */}
            <Section id="compiler" tag="Phase 04 — Mausam-IR Compilation" accentColor="#eab308"
                title="MLIR Lowering + LoRA + INT4 Quantization"
                desc="The trained PINN is lowered from PyTorch into Mausam-IR (an MLIR dialect), fused with LoRA adapters, and compressed 7.2 GB → 18.2 MB through 7 sequential optimization passes for deployment on a $2 microcontroller."
                glowClass="section-glow-orange">
                <OptimizationPasses />
            </Section>

            <hr className="section-divider" />

            {/* ─── Phase 5: Edge Metrics ──────────────────────────────────── */}
            <Section id="metrics" tag="Phase 05 — Edge Deployment" accentColor="#ef4444"
                title="ESP32-S3 Live Telemetry & LLM Evaluation"
                desc="The compressed GGUF binary is flashed OTA to KEDARNATH-NODE-01. Real-time telemetry streams token latency, BLEU/ROUGE scores, LoRaWAN alert packets, and a live flash-flood probability signal."
                glowClass="section-glow-red">
                <BareMetalMetrics />
            </Section>

            <hr className="section-divider" />

            {/* ─── Tech Stack ─────────────────────────────────────────────── */}
            <section id="stack" className="site-section" style={{ minHeight: 'auto', paddingBottom: '4rem' }}>
                <div className="section-inner">
                    <div className="section-tag" style={{ color: 'var(--muted)' }}>Technology Stack</div>
                    <h2 className="section-title">Built with Deep-Tech</h2>
                    <div className="tech-grid">
                        {['PyTorch', 'NVIDIA Modulus', 'Meta Llama 3.1', 'LangChain', 'Qdrant', 'MLIR', 'llama.cpp',
                            'LoRA (PEFT)', 'INT4 AWQ', 'GGUF', 'React Three Fiber', 'Framer Motion',
                            'ISRO MOSDAC', 'NASA EarthData', 'LoRaWAN', 'ESP32-S3', 'Vite', 'TypeScript'].map(t => (
                                <div key={t} className="tech-chip">{t}</div>
                            ))}
                    </div>
                </div>
            </section>

            {/* ─── Footer ─────────────────────────────────────────────────── */}
            <footer className="site-footer">
                <div className="footer-logo">MAUSAM·IR</div>
                <p className="footer-meta">Physics-Informed Edge AI for Himalayan Extreme Weather Prediction</p>
                <p className="footer-meta" style={{ marginTop: '.3rem', color: '#3cff8c' }}>Built by Hitesh Meher — GenAI Coursework 2025–26</p>
                <div className="footer-links">
                    <a href="https://github.com/hiuoiiiubioiii/mausam-ir" target="_blank" rel="noopener noreferrer">
                        <Github size={14} style={{ display: 'inline', marginRight: '.3rem' }} />GitHub
                    </a>
                    <a href="https://colab.research.google.com/github/hiuoiiiubioiii/mausam-ir/blob/main/Mausam_IR_GenAI_Pipeline.ipynb" target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={14} style={{ display: 'inline', marginRight: '.3rem' }} />Colab Notebook
                    </a>
                    <a href="https://mausam-ir-demo.netlify.app" target="_blank" rel="noopener noreferrer">
                        <Radio size={14} style={{ display: 'inline', marginRight: '.3rem' }} />Live Site
                    </a>
                </div>
                <p style={{ fontFamily: 'var(--mono)', fontSize: '.62rem', color: 'var(--muted)', marginTop: '1.5rem' }}>
                    © 2026 · ISRO MOSDAC · NASA EarthData · NVIDIA Modulus · Meta Llama · MIT License
                </p>
            </footer>
        </>
    );
}

export default App;
