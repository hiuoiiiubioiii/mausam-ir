import { useState } from 'react';
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
    { id: 'ingestion', label: 'ERA5/IMD Dataset Ingestion', icon: Database },
    { id: 'simulation', label: 'OpenUSD 3D Simulation', icon: Activity },
    { id: 'genai', label: 'Meta Llama x Modulus Architect', icon: Zap },
    { id: 'frontend', label: 'LLVM Graph Frontend', icon: Network },
    { id: 'passes', label: 'C++ Custom Passes', icon: TerminalSquare },
    { id: 'baremetal', label: 'IoT Bare Metal Target', icon: Cpu },
];

function App() {
    const [activeStage, setActiveStage] = useState(0);

    return (
        <div className="app-container">
            {/* 3D Canvas Background Layer */}
            <div className="canvas-container">
                <HighFidelitySimulation />
            </div>

            {/* UI Overlay Layer */}
            <header>
                <div className="brand">
                    <h1>MAUSAM<span className="glow-green">-IR</span></h1>
                    <div className="subtitle">
                        Mission Mausam <br />
                        Physics-Informed Climate Compiler
                    </div>
                </div>
                <div className="status-indicator">
                    <span className="glow-blue" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                        SYSTEM: ONLINE | NVIDIA EARTH-2 CONNECTED
                    </span>
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
                                    <h2 className="glow-blue">NVIDIA OMNIVERSE / OpenUSD Visualizer Active</h2>
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
