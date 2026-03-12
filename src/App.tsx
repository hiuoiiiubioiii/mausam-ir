import { useState, useEffect } from 'react';
import { Activity, Cpu, Database, Network, TerminalSquare, Zap } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Import Components
import DatasetIngestion from './components/DatasetIngestion';
import HighFidelitySimulation from './components/HighFidelitySimulation';
import GenAIPrompt from './components/GenAIPrompt';
import CompilerFrontend from './components/CompilerFrontend';
import OptimizationPasses from './components/OptimizationPasses';
import BareMetalMetrics from './components/BareMetalMetrics';

const STAGES = [
    { id: 'ingestion', label: 'RAG Pipeline & Vector DB', icon: Database },
    { id: 'simulation', label: 'OpenUSD 3D Simulation', icon: Activity },
    { id: 'genai', label: 'Autonomous Agent Swarm', icon: Zap },
    { id: 'frontend', label: 'Chain-of-Thought & AST Parsing', icon: Network },
    { id: 'passes', label: 'Model Quantization & LoRA', icon: TerminalSquare },
    { id: 'baremetal', label: 'LLM Evaluation & Edge Metrics', icon: Cpu },
];

function App() {
    const [activeStage, setActiveStage] = useState(0);

    // Sheryians Custom Cursor State
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('button, .stage-item, a, .glow-green, .glow-blue')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <div className="app-container">
            {/* Sheryians Custom Dynamic Cursor */}
            <motion.div
                className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
                animate={{ left: mousePos.x, top: mousePos.y }}
                transition={{ type: 'tween', ease: 'backOut', duration: 0.15 }}
            />
            {/* 3D Canvas Background Layer */}
            <div className="canvas-container">
                <HighFidelitySimulation />
            </div>

            {/* UI Overlay Layer */}
            <header>
                <div className="brand">
                    <div className="reveal-text-container">
                        <h1 className="reveal-text">MAUSAM<span className="glow-green">-GEN AI</span></h1>
                    </div>
                    <div className="subtitle">
                        <div className="reveal-text-container"><span className="reveal-text" style={{ animationDelay: '0.1s' }}>Gen-AI Coursework Project</span></div> <br />
                        <div className="reveal-text-container"><span className="reveal-text" style={{ animationDelay: '0.2s' }}>Physics-Informed Edge LLM</span></div>
                    </div>
                </div>
                <div className="status-indicator">
                    <span className="glow-blue" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                        SYSTEM: ONLINE | SECURE CONNECTION ESTABLISHED
                    </span>
                </div>
                <div className="author-credit" style={{ position: 'absolute', top: '1rem', right: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    BUILT BY <span style={{ color: 'var(--neon-green)', fontWeight: 'bold' }}>HITESH MEHER</span>
                </div>
            </header>

            <div className="main-content">
                <aside className="sidebar glass-panel" style={{ margin: '2rem 0 2rem 2rem', borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
                    <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
                        Deployment Pipeline
                    </h3>

                    <div className="stages-list">
                        {STAGES.map((stage, index) => {
                            const Icon = stage.icon;
                            const isActive = index === activeStage;
                            const isPast = index < activeStage;

                            return (
                                <div
                                    key={stage.id}
                                    className={`stage-item ${isActive ? 'active' : ''}`}
                                    onClick={() => setActiveStage(index)}
                                    style={{ opacity: isPast || isActive ? 1 : 0.5 }}
                                >
                                    <div className="stage-number">0{index + 1}</div>
                                    <Icon size={18} color={isActive ? 'var(--neon-green)' : 'var(--text-muted)'} />
                                    <div className="stage-label" style={{ color: isActive ? '#fff' : 'var(--text-main)' }}>
                                        {stage.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                        <button
                            className="primary-btn"
                            style={{ width: '100%' }}
                            onClick={() => setActiveStage((prev) => Math.min(prev + 1, STAGES.length - 1))}
                        >
                            {activeStage === STAGES.length - 1 ? 'DEPLOY ALGORITHM' : 'EXECUTE NEXT PHASE'}
                        </button>
                    </div>
                </aside>

                <main className="content-area">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStage}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                        >
                            {/* Components will render here over the 3D background */}
                            {activeStage === 0 && <DatasetIngestion />}
                            {activeStage === 1 && <div className="component-container" style={{ background: 'rgba(0,0,0,0.4)', boxShadow: 'none', border: 'none' }}>
                                {/* Simulation runs mostly in the background, but we can put overlay controls here */}
                                <div style={{ padding: '2rem', textAlign: 'center' }}>
                                    <h2 className="glow-blue">Mausam-IR High-Fidelity 3D Visualizer Active (Powered by NVIDIA Omniverse)</h2>
                                    <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
                                        Processing complex fluid dynamics and topographical meshes via Real-Time WebGL.
                                    </p>
                                </div>
                            </div>}
                            {activeStage === 2 && <GenAIPrompt />}
                            {activeStage === 3 && <CompilerFrontend />}
                            {activeStage === 4 && <OptimizationPasses />}
                            {activeStage === 5 && <BareMetalMetrics />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

export default App;
