import React, { useState, useEffect, useRef } from 'react';
import { Bot, FlaskConical, Cpu, ShieldCheck, ArrowRight, Send, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentMessage {
    agent: string;
    role: 'data_scientist' | 'physics_architect' | 'compiler_engineer' | 'swarm_supervisor';
    content: string;
    isCode?: boolean;
    timestamp: string;
    status: 'thinking' | 'done';
}

const AGENTS = [
    { key: 'data_scientist', label: 'Data Scientist', icon: FlaskConical, color: '#3b82f6', shortLabel: 'DS-01' },
    { key: 'physics_architect', label: 'Physics Architect', icon: Bot, color: '#f97316', shortLabel: 'PA-01' },
    { key: 'compiler_engineer', label: 'Compiler Eng.', icon: Cpu, color: '#a855f7', shortLabel: 'CE-01' },
    { key: 'swarm_supervisor', label: 'Swarm Supervisor', icon: ShieldCheck, color: '#22c55e', shortLabel: 'SV-01' },
];

const SCENARIOS = [
    { label: 'Kedarnath Flash Flood', region: '30.73°N, 79.06°E', risk: 'CRITICAL' },
    { label: 'Brahmaputra Cloudburst', region: '27.10°N, 93.62°E', risk: 'HIGH' },
    { label: 'Chamoli Glacier Surge', region: '30.42°N, 79.93°E', risk: 'EXTREME' },
];

const SWARM_DIALOGUES: AgentMessage[][] = [
    [
        {
            agent: 'Swarm Supervisor', role: 'swarm_supervisor', status: 'done', timestamp: 'T+0.0s',
            content: '[TASK DISPATCH] Routing Kedarnath extreme weather event. Assigning sub-tasks to swarm agents. Target: 6-hour predictive horizon. Accuracy threshold: BLEU > 0.88.'
        },
        {
            agent: 'Data Scientist', role: 'data_scientist', status: 'done', timestamp: 'T+0.4s',
            content: 'Querying Qdrant vector DB for Uttarakhand sector embeddings... Retrieving 42 spatially similar cloudburst events from ISRO MOSDAC archive (2013–2024). PyTorch DataLoader ready.'
        },
        {
            agent: 'Data Scientist', role: 'data_scientist', status: 'done', timestamp: 'T+1.1s', isCode: true,
            content: `# DataLoader construction for PINN training
loader = DataLoader(
  HimalayanClimateDataset(
    grid_bounds=(30.5, 31.0, 78.8, 79.4),  # Kedarnath sector
    temporal_window='6H',
    sources=['MOSDAC', 'EarthData', 'IMD_Gridded'],
    vector_dim=768,
  ),
  batch_size=16, shuffle=True, num_workers=4
)
# Retrieved 847 spatial chunks · 42.8 GB climatological tensors` },
        {
            agent: 'Physics Architect', role: 'physics_architect', status: 'done', timestamp: 'T+1.8s',
            content: 'Translating Himalayan topography (SRTM DEM 30m) into Navier-Stokes boundary conditions. Modelling terrain as no-slip walls. Atmospheric density ρ = 0.87 kg/m³ at 3.5km elevation.'
        },
        {
            agent: 'Physics Architect', role: 'physics_architect', status: 'done', timestamp: 'T+2.4s', isCode: true,
            content: `# NVIDIA Modulus — Physics-Informed Loss
class MausamPINNLoss(nn.Module):
  def __init__(self, λ=0.7, γ=0.3):
    super().__init__()
    self.λ, self.γ = λ, γ  # physics & boundary weights

  def forward(self, pred, gt, terrain_sdf):
    # L_data: MSE against NASA/ISRO ground truth
    L_data = F.mse_loss(pred, gt)
    # L_physics: Navier-Stokes residual (mass conservation)
    du = torch.autograd.grad(pred[:,0], inputs, create_graph=True)[0]
    L_physics = (du[:,0] + du[:,1] + du[:,2]).pow(2).mean()
    # L_boundary: penalise flow through solid terrain
    L_boundary = (pred * (terrain_sdf < 0).float()).abs().mean()
    return L_data + self.λ*L_physics + self.γ*L_boundary` },
        {
            agent: 'Compiler Engineer', role: 'compiler_engineer', status: 'done', timestamp: 'T+3.1s',
            content: 'PINN graph captured. Lowering PyTorch IR → Mausam-IR MLIR dialect. Applying LoRA adapters (rank=8) for Kedarnath valley specialisation. Model ready for INT4 quantization pass.'
        },
        {
            agent: 'Swarm Supervisor', role: 'swarm_supervisor', status: 'done', timestamp: 'T+3.9s',
            content: '[VALIDATION] Chain-of-Thought trace evaluated. BLEU: 0.912 ✓ · ROUGE-L: 0.891 ✓ · Physics residual < 1e-4 ✓. All agents PASS. Routing to Mausam-IR compilation pipeline.'
        },
    ],
    [
        {
            agent: 'Swarm Supervisor', role: 'swarm_supervisor', status: 'done', timestamp: 'T+0.0s',
            content: '[TASK DISPATCH] Brahmaputra cloudburst scenario activated. 27.10°N, 93.62°E. Monsoon amplification detected. Initiating swarm orchestration cycle #2.'
        },
        {
            agent: 'Data Scientist', role: 'data_scientist', status: 'done', timestamp: 'T+0.6s',
            content: 'ISRO MOSDAC cloud-top temperature anomaly: −68°C (convective threshold breached). Fetching 6-hourly ERA5 reanalysis frames. Tensor shape: (8, 256, 256, 7). Loading into PINN trainer.'
        },
        {
            agent: 'Physics Architect', role: 'physics_architect', status: 'done', timestamp: 'T+1.4s',
            content: 'Brahmaputra valley channel: steep hydraulic gradient 0.004 m/m. Froude number Fr > 1 → supercritical flow. Encoding subcritical→supercritical transition as hard boundary constraint in PINN loss.'
        },
        {
            agent: 'Compiler Engineer', role: 'compiler_engineer', status: 'done', timestamp: 'T+2.1s', isCode: true,
            content: `// Mausam-IR MLIR lowering for Brahmaputra sector
func.func @brahmaputra_pinn(
  %terrain : tensor<256x256xf32>,
  %era5    : tensor<8x256x256x7xf32>
) -> tensor<2x256x256xf32> {
  %0 = "mausam.rag_retrieve"(%era5) {k=42} : ...
  %1 = "mausam.lora_forward"(%0) {rank=8} : ...
  %2 = "mausam.physics_residual"(%1, %terrain) : ...
  return %2
}
// LoRA adapter: Assam-sector weights, 680KB delta` },
        {
            agent: 'Swarm Supervisor', role: 'swarm_supervisor', status: 'done', timestamp: 'T+3.2s',
            content: '[VALIDATION] Prediction horizon: 6h · MAE: 3.2mm/hr · BLEU: 0.897 ✓ · Boundary loss: 2.3e-5 ✓. Swarm consensus reached. Dispatching to edge compilation.'
        },
    ],
];

const GenAIPrompt: React.FC = () => {
    const [messages, setMessages] = useState<AgentMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [activeAgents, setActiveAgents] = useState<string[]>([]);
    const [selectedScenario, setSelectedScenario] = useState(0);
    const [dialogueSet, setDialogueSet] = useState(0);
    const [supervisorScore, setSupervisorScore] = useState({ bleu: 0, rouge: 0, physics: 0 });
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const runSwarm = (_scenarioIdx?: number) => {
        setMessages([]);
        setIsRunning(true);
        setActiveAgents([]);
        setSupervisorScore({ bleu: 0, rouge: 0, physics: 0 });
        const dialogue = SWARM_DIALOGUES[dialogueSet % SWARM_DIALOGUES.length];
        setDialogueSet(d => d + 1);

        dialogue.forEach((msg, i) => {
            setTimeout(() => {
                setActiveAgents(prev => [...new Set([...prev, msg.role])]);
                setMessages(prev => [...prev, msg]);
                if (i === dialogue.length - 1) {
                    setIsRunning(false);
                    setSupervisorScore({ bleu: 0.89 + Math.random() * 0.05, rouge: 0.87 + Math.random() * 0.05, physics: Math.random() * 1e-4 });
                }
            }, i * 900 + 200);
        });
    };

    const agentColors: Record<string, string> = {
        data_scientist: '#3b82f6', physics_architect: '#f97316',
        compiler_engineer: '#a855f7', swarm_supervisor: '#22c55e',
    };

    return (
        <div className="component-container" style={{ height: '580px', overflow: 'hidden' }}>
            <div className="terminal-header" style={{ borderBottom: '1px solid rgba(34,197,94,0.2)', background: 'linear-gradient(90deg, rgba(34,197,94,0.06), transparent)' }}>
                <Zap size={15} className="glow-green" />
                <span className="terminal-title" style={{ color: '#22c55e' }}>MULTI-AGENT SWARM // LangChain Graph · Meta Llama 3.1 · NVIDIA Modulus</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', height: 'calc(100% - 44px)' }}>

                {/* LEFT: Agent Status Panel */}
                <div style={{ borderRight: '1px solid rgba(255,255,255,0.06)', padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Swarm Agents</div>
                    {AGENTS.map(agent => {
                        const Icon = agent.icon;
                        const isActive = activeAgents.includes(agent.key);
                        return (
                            <motion.div key={agent.key} animate={{ borderColor: isActive ? agent.color : 'rgba(255,255,255,0.07)', background: isActive ? `${agent.color}11` : 'transparent' }}
                                style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '0.6rem 0.8rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <motion.div animate={{ opacity: isActive ? [1, 0.3, 1] : 0.4 }} transition={{ repeat: Infinity, duration: 0.9 }}>
                                        <Icon size={14} color={isActive ? agent.color : 'var(--text-muted)'} />
                                    </motion.div>
                                    <div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: isActive ? '#fff' : 'var(--text-muted)' }}>{agent.label}</div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: agent.color, opacity: 0.8 }}>{agent.shortLabel}</div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Scenario select */}
                    <div style={{ marginTop: 'auto' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Scenario</div>
                        {SCENARIOS.map((s, i) => (
                            <div key={s.label} onClick={() => setSelectedScenario(i)}
                                style={{ cursor: 'pointer', padding: '0.4rem 0.5rem', borderRadius: '5px', marginBottom: '0.25rem', background: selectedScenario === i ? 'rgba(34,197,94,0.1)' : 'transparent', border: `1px solid ${selectedScenario === i ? '#22c55e44' : 'transparent'}` }}>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: selectedScenario === i ? '#22c55e' : 'var(--text-muted)' }}>{s.label}</div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: s.risk === 'EXTREME' ? '#ef4444' : s.risk === 'CRITICAL' ? '#f97316' : '#eab308' }}>{s.risk}</div>
                            </div>
                        ))}
                    </div>

                    {/* BLEU/ROUGE scores */}
                    {supervisorScore.bleu > 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '6px', padding: '0.6rem' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>SV VALIDATION ✓</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#22c55e' }}>BLEU: {supervisorScore.bleu.toFixed(3)}</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#22c55e' }}>ROUGE-L: {supervisorScore.rouge.toFixed(3)}</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#3b82f6' }}>L_physics: {supervisorScore.physics.toExponential(2)}</div>
                        </motion.div>
                    )}
                </div>

                {/* RIGHT: Chat + Input */}
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div ref={scrollRef} style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {messages.length === 0 && !isRunning && (
                            <div style={{ textAlign: 'center', paddingTop: '3rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                                <Zap size={28} color="#22c55e" style={{ margin: '0 auto 1rem', display: 'block' }} />
                                Select a scenario and launch the swarm orchestration.
                            </div>
                        )}
                        <AnimatePresence>
                            {messages.map((msg, idx) => {
                                const agent = AGENTS.find(a => a.key === msg.role);
                                const color = agentColors[msg.role];
                                const Icon = agent?.icon || Bot;
                                return (
                                    <motion.div key={idx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                        style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: `${color}22`, border: `1px solid ${color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Icon size={14} color={color} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color, fontWeight: 700 }}>{msg.agent}</span>
                                                <ArrowRight size={10} color="var(--text-muted)" />
                                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>{msg.timestamp}</span>
                                            </div>
                                            {msg.isCode ? (
                                                <div style={{ background: '#080c10', border: `1px solid ${color}33`, borderRadius: '6px', padding: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#e2e8f0', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                                    {msg.content}
                                                </div>
                                            ) : (
                                                <div style={{ background: `${color}0a`, border: `1px solid ${color}22`, borderRadius: '6px', padding: '0.6rem 0.8rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-main)', lineHeight: 1.65 }}>
                                                    {msg.content}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                        {isRunning && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                    <Zap size={13} color="#22c55e" />
                                </motion.div>
                                Swarm orchestrating...
                            </motion.div>
                        )}
                    </div>

                    {/* Input Bar */}
                    <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.4)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                            <input value={inputText} onChange={e => setInputText(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && !isRunning) { runSwarm(selectedScenario); setInputText(''); } }}
                                placeholder={`Run swarm for: ${SCENARIOS[selectedScenario].label}...`}
                                style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '0.6rem 0.85rem', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', outline: 'none' }} />
                            <button className="primary-btn" disabled={isRunning} onClick={() => { runSwarm(selectedScenario); setInputText(''); }}
                                style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: isRunning ? 0.5 : 1 }}>
                                <Send size={14} />
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>LAUNCH</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenAIPrompt;
