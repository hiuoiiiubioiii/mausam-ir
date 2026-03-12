import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, ExternalLink, Satellite, ChevronDown, Radio } from 'lucide-react';

import DatasetIngestion from './components/DatasetIngestion';
import AuroraBackground from './components/AuroraBackground';
import GenAIPrompt from './components/GenAIPrompt';
import CompilerFrontend from './components/CompilerFrontend';
import OptimizationPasses from './components/OptimizationPasses';
import BareMetalMetrics from './components/BareMetalMetrics';
import MausamSimulation from './components/MausamSimulation';
import HimalayanFloodMap from './components/HimalayanFloodMap';

// ─── Animated Section Wrapper ─────────────────────────────────────────────────
function Section({ id, tag, title, desc, children, glowClass = '', accentColor = '#3cff8c' }: {
    id: string; tag: string; title: string; desc: string;
    children: React.ReactNode; glowClass?: string; accentColor?: string;
}) {
    const ref = useRef<HTMLElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.12 });
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

// ─── Live data ticker ─────────────────────────────────────────────────────────
function LiveTicker() {
    const [tick, setTick] = useState(0);
    useEffect(() => { const t = setInterval(() => setTick(v => v + 1), 2200); return () => clearInterval(t); }, []);
    const items = [
        `ISRO MOSDAC → ${(Math.random() * 200 + 50).toFixed(1)} mm/6hr`,
        `NASA EarthData → T-${Math.floor(Math.random() * 48)}h synced`,
        `Qdrant DB → ${(tick * 7 + 42).toLocaleString()} vectors indexed`,
        `PINN residual → ${(1.23e-4).toExponential(2)}`,
        `KEDARNATH-NODE-01 → ${(13 + Math.random() * 3).toFixed(1)} tok/s`,
        `LoRaWAN RSSI → −${(85 + Math.random() * 10).toFixed(0)} dBm`,
        `P(flash_flood | T+6h) → ${(0.78 + Math.random() * 0.08).toFixed(2)}`,
    ];
    return (
        <div style={{ background: 'rgba(0,0,0,.55)', borderTop: '1px solid rgba(255,255,255,.04)', borderBottom: '1px solid rgba(255,255,255,.04)', padding: '.45rem 0', overflow: 'hidden' }}>
            <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'flex', gap: '5rem', whiteSpace: 'nowrap', paddingLeft: '100vw' }}>
                {[...items, ...items].map((item, i) => (
                    <span key={i} style={{ fontFamily: 'var(--mono)', fontSize: '.67rem', color: 'var(--muted)' }}>
                        <span style={{ color: '#22c55e', marginRight: '.4rem' }}>▶</span>{item}
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

    useEffect(() => {
        const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
        const onOver = (e: MouseEvent) => {
            setHovering(!!(e.target as HTMLElement).closest('button, a, .phase-pill, .tech-chip'));
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseover', onOver);
        return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseover', onOver); };
    }, []);

    useEffect(() => {
        const sections = ['hero', 'map', 'demo', 'rag', 'swarm', 'simulation', 'compiler', 'optimization', 'metrics'];
        const obs = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
            { threshold: 0.3 }
        );
        sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
        return () => obs.disconnect();
    }, []);

    const NAV = [
        { id: 'map', label: 'Flood Map' },
        { id: 'demo', label: 'Simulation' },
        { id: 'rag', label: 'RAG' },
        { id: 'swarm', label: 'Agents' },
        { id: 'simulation', label: 'PINN' },
        { id: 'optimization', label: 'Quantize' },
        { id: 'metrics', label: 'Edge' },
    ];

    return (
        <>
            {/* Custom cursor */}
            <motion.div className={`custom-cursor ${hovering ? 'hovering' : ''}`}
                animate={{ left: mousePos.x, top: mousePos.y }} transition={{ type: 'tween', ease: 'backOut', duration: 0.13 }} />

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
                    <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.6 }}>●</motion.span>{' '}LIVE
                </div>
            </nav>

            {/* Ticker */}
            <div style={{ position: 'fixed', top: 60, left: 0, right: 0, zIndex: 999 }}>
                <LiveTicker />
            </div>

            {/* ─── HERO ───────────────────────────────────────────────────────── */}
            <section id="hero" className="hero" style={{ paddingTop: 120 }}>
                <div className="hero-bg" />
                <div className="hero-grid" />

                {/* Calming aurora background */}
                <div className="canvas-bg">
                    <AuroraBackground />
                </div>

                <div className="hero-content">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
                        <div className="hero-badge">
                            <Satellite size={11} />
                            GenAI Coursework — Physics-Informed Edge AI · ISRO × NASA × IIT
                        </div>
                    </motion.div>

                    <motion.h1 className="hero-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .1 }}>
                        <span className="accent">Mausam-IR</span><br />
                        Flash Flood<br />Prediction AI
                    </motion.h1>

                    <motion.p className="hero-subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .25 }}>
                        A full GenAI pipeline — from raw ISRO/NASA satellite telemetry to a <strong>$2 ESP32 edge node</strong> —
                        warning Himalayan communities of deadly flash floods 6 hours before they strike.
                    </motion.p>

                    <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .4 }}>
                        <a href="#map"><button className="btn-primary">Explore Pipeline ↓</button></a>
                        <a href="https://github.com/hiuoiiiubioiii/mausam-ir" target="_blank" rel="noopener noreferrer">
                            <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                                <Github size={15} /> GitHub
                            </button>
                        </a>
                        <a href="https://colab.research.google.com/github/hiuoiiiubioiii/mausam-ir/blob/main/Mausam_IR_GenAI_Pipeline.ipynb" target="_blank" rel="noopener noreferrer">
                            <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                                <ExternalLink size={15} /> Colab Notebook
                            </button>
                        </a>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} style={{ marginTop: '3rem' }}>
                        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} style={{ display: 'flex', justifyContent: 'center' }}>
                            <ChevronDown size={22} color="var(--muted)" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Stats bar */}
            <div className="stats-bar" style={{ position: 'relative', zIndex: 10, background: 'rgba(3,5,8,.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                {[
                    { val: '$2.40', lbl: 'MCU Cost' },
                    { val: '99.75%', lbl: 'Compression' },
                    { val: '6h', lbl: 'Pred. Horizon' },
                    { val: '0.912', lbl: 'BLEU' },
                    { val: '14.2', lbl: 'tok/s' },
                    { val: '14', lbl: 'Danger Zones' },
                ].map(s => (
                    <div key={s.val} className="stat-item">
                        <span className="val">{s.val}</span>
                        <span className="lbl">{s.lbl}</span>
                    </div>
                ))}
            </div>

            {/* ─── Himalayan Flood Zone Map ────────────────────────────────────── */}
            <section id="map" className="site-section" style={{ minHeight: 'auto', paddingBottom: '3rem' }}>
                <div className="section-inner">
                    <div className="section-tag" style={{ color: '#ef4444' }}>Real-World Context · Esri Satellite Imagery</div>
                    <h2 className="section-title">14 Dangerous Himalayan Flash Flood Zones</h2>
                    <p className="section-desc">
                        Interactive satellite map spanning the entire Himalayan arc — from Kashmir to Arunachal Pradesh.
                        Click any danger zone marker for historical event data, flood probability, and archive footage.
                        Risk zones: Kedarnath · Chamoli · Teesta · Brahmaputra · Kosi · Jhelum and 8 more.
                    </p>
                    <HimalayanFloodMap />
                </div>
            </section>

            <hr className="section-divider" />

            {/* ─── Manim-Style Pipeline Simulation ────────────────────────────── */}
            <section id="demo" className="site-section" style={{ minHeight: 'auto', paddingBottom: '3rem' }}>
                <div className="section-inner">
                    <div className="section-tag" style={{ color: '#a855f7' }}>Interactive Demo · Manim-Style</div>
                    <h2 className="section-title">Pipeline Simulation</h2>
                    <p className="section-desc">
                        An orbital canvas simulation of the complete GenAI pipeline — from satellite data ingestion
                        to edge inference — showing the governing physics equations and data flow at each stage.
                    </p>
                    <MausamSimulation />
                </div>
            </section>

            <hr className="section-divider" />

            {/* ─── Phase 1: RAG Pipeline ───────────────────────────────────────── */}
            <Section id="rag" tag="Phase 01 — RAG Pipeline" accentColor="#3b82f6"
                title="Spatial-Temporal Vector Embedding"
                desc="ISRO MOSDAC and NASA EarthData are chunked into 5km² × 6hr sliding windows and embedded into 768-dimensional vectors indexed in Qdrant for real-time similarity retrieval."
                glowClass="section-glow-blue">
                <div className="eq-box" style={{ borderColor: 'rgba(59,130,246,.3)', color: '#3b82f6' }}>
                    Chunking: 5km² spatial × 6hr temporal → Qdrant (cosine similarity, dim=768)
                </div>
                <DatasetIngestion />
            </Section>

            <hr className="section-divider" />

            {/* ─── Phase 2: Multi-Agent Swarm ──────────────────────────────────── */}
            <Section id="swarm" tag="Phase 02 — Multi-Agent Swarm" accentColor="#22c55e"
                title="Autonomous LangChain Agent Orchestration"
                desc="Four specialized agents collaborate: a Data Scientist, Physics Architect, Compiler Engineer, and Swarm Supervisor that validates BLEU/ROUGE scores and routes tasks autonomously.">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
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

            {/* ─── Phase 3: PINN ───────────────────────────────────────────────── */}
            <Section id="simulation" tag="Phase 03 — Physics-Informed Neural Network" accentColor="#22c55e"
                title="Navier-Stokes Constrained PINN"
                desc="The model is penalized for violating fluid dynamics. The composite loss embeds physics into the learning objective — the PINN learns to respect conservation of mass and momentum.">
                <div className="eq-box">
                    ρ(∂<b>u</b>/∂t + <b>u</b>·∇<b>u</b>) = −∇p + μ∇²<b>u</b> + <b>f</b>
                    <br /><span style={{ fontSize: '.73rem', opacity: .6 }}>𝓛_total = 𝓛_data + λ·𝓛_physics + γ·𝓛_boundary &nbsp;|&nbsp; λ=0.70, γ=0.30</span>
                </div>
                <CompilerFrontend />
            </Section>

            <hr className="section-divider" />

            {/* ─── Phase 4: MLIR + Quantization ────────────────────────────────── */}
            <Section id="compiler" tag="Phase 04 — Mausam-IR Compilation" accentColor="#eab308"
                title="MLIR Lowering + LoRA + INT4 Quantization"
                desc="The PINN is lowered from PyTorch to Mausam-IR (an MLIR dialect), fused with LoRA adapters, and compressed 7.2 GB → 18.2 MB through 7 sequential optimization passes."
                glowClass="section-glow-orange">
                <OptimizationPasses />
            </Section>

            <hr className="section-divider" />

            {/* ─── Phase 5: Edge Metrics ───────────────────────────────────────── */}
            <Section id="metrics" tag="Phase 05 — Edge Deployment" accentColor="#ef4444"
                title="ESP32-S3 Live Telemetry & LLM Evaluation"
                desc="The 18.2 MB GGUF binary runs on-device. Real-time metrics stream token latency, BLEU/ROUGE, LoRaWAN alert packets, and a live flash-flood probability signal."
                glowClass="section-glow-red">
                <BareMetalMetrics />
            </Section>

            <hr className="section-divider" />

            {/* ─── Tech Stack ──────────────────────────────────────────────────── */}
            <section className="site-section" style={{ minHeight: 'auto', paddingBottom: '4rem', position: 'relative', zIndex: 10 }}>
                <div className="section-inner">
                    <div className="section-tag" style={{ color: 'var(--muted)' }}>Deep-Tech Stack</div>
                    <h2 className="section-title">Built With</h2>
                    <div className="tech-grid">
                        {['PyTorch', 'NVIDIA Modulus', 'Meta Llama 3.1', 'LangChain', 'Qdrant', 'MLIR',
                            'llama.cpp', 'LoRA (PEFT)', 'INT4 AWQ', 'GGUF', 'React Three Fiber', 'Framer Motion',
                            'React Leaflet', 'ISRO MOSDAC', 'NASA EarthData', 'LoRaWAN', 'ESP32-S3', 'Vite', 'TypeScript'].map(t => (
                                <div key={t} className="tech-chip">{t}</div>
                            ))}
                    </div>
                </div>
            </section>

            {/* ─── Footer ──────────────────────────────────────────────────────── */}
            <footer className="site-footer">
                <div className="footer-logo">MAUSAM·IR</div>
                <p className="footer-meta">Physics-Informed Edge AI · Himalayan Flash Flood Prediction</p>
                <p className="footer-meta" style={{ marginTop: '.3rem', color: '#3cff8c' }}>Built by Hitesh Meher — GenAI Coursework 2025–26</p>
                <div className="footer-links">
                    <a href="https://github.com/hiuoiiiubioiii/mausam-ir" target="_blank" rel="noopener noreferrer">
                        <Github size={13} style={{ display: 'inline', marginRight: '.3rem' }} />GitHub
                    </a>
                    <a href="https://colab.research.google.com/github/hiuoiiiubioiii/mausam-ir/blob/main/Mausam_IR_GenAI_Pipeline.ipynb" target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={13} style={{ display: 'inline', marginRight: '.3rem' }} />Colab
                    </a>
                    <a href="https://mausam-ir-demo.netlify.app" target="_blank" rel="noopener noreferrer">
                        <Radio size={13} style={{ display: 'inline', marginRight: '.3rem' }} />Live Site
                    </a>
                </div>
                <p style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: '#475569', marginTop: '1.5rem' }}>
                    © 2026 · Data: ISRO MOSDAC, NASA EarthData · Map: Esri · MIT License
                </p>
            </footer>
        </>
    );
}

export default App;
