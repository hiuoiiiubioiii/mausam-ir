import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Radio, AlertTriangle, CheckCircle2, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface LiveMetric {
    name: string;
    value: number;
    unit: string;
    target: number;
    color: string;
    history: number[];
}

const BareMetalMetrics: React.FC = () => {
    const [tick, setTick] = useState(0);
    const [alertFired, setAlertFired] = useState(false);
    const [inferenceLog, setInferenceLog] = useState<string[]>([]);
    const [metrics, setMetrics] = useState<LiveMetric[]>([
        { name: 'Token Latency', value: 14.2, unit: 'tok/s', target: 12.0, color: '#22c55e', history: [10, 11, 12, 13, 14] },
        { name: 'BLEU Score', value: 0.912, unit: '', target: 0.880, color: '#3b82f6', history: [0.85, 0.87, 0.89, 0.9, 0.912] },
        { name: 'ROUGE-L', value: 0.891, unit: '', target: 0.850, color: '#a855f7', history: [0.82, 0.84, 0.86, 0.88, 0.891] },
        { name: 'SRAM Usage', value: 312, unit: 'KB', target: 512, color: '#f97316', history: [340, 330, 325, 315, 312] },
        { name: 'Power Draw', value: 178, unit: 'mW', target: 250, color: '#eab308', history: [210, 200, 190, 183, 178] },
        { name: 'L_physics', value: 1.23e-4, unit: '', target: 1e-3, color: '#22c55e', history: [8e-4, 5e-4, 3e-4, 2e-4, 1.23e-4] },
    ]);
    const logRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setTick(t => t + 1);
            setMetrics(prev => prev.map(m => {
                const noise = (Math.random() - 0.5) * 0.04 * m.value;
                const newVal = m.name === 'L_physics'
                    ? Math.max(5e-5, m.value + (Math.random() - 0.5) * 5e-6)
                    : Math.max(0, m.value + noise);
                return { ...m, value: newVal, history: [...m.history, newVal].slice(-20) };
            }));

            if (Math.random() > 0.7 && !alertFired) setAlertFired(true);

            const logLines = [
                `[${new Date().toISOString().split('T')[1].slice(0, 12)}] Node KEDARNATH-01: inference cycle complete · latency 71ms`,
                `[${new Date().toISOString().split('T')[1].slice(0, 12)}] IMU: wind_speed=47.3km/h · rain_δ=+2.1mm/15min`,
                `[${new Date().toISOString().split('T')[1].slice(0, 12)}] LoRaWAN TX: alert_packet dispatched (6 bytes) · RSSI −87 dBm`,
                `[${new Date().toISOString().split('T')[1].slice(0, 12)}] Prediction horizon T+6h: P(flash_flood)=0.84 → ⚠ ALERT`,
                `[${new Date().toISOString().split('T')[1].slice(0, 12)}] L_physics residual: 1.2e-4 · momentum conserved ✓`,
            ];
            setInferenceLog(prev => [...prev, logLines[Math.floor(Math.random() * logLines.length)]].slice(-8));
        }, 1200);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [inferenceLog]);

    const formatVal = (m: LiveMetric) => {
        if (m.name === 'L_physics') return m.value.toExponential(2);
        if (m.name === 'BLEU Score' || m.name === 'ROUGE-L') return m.value.toFixed(3);
        return Math.round(m.value).toString();
    };

    return (
        <div className="component-container" style={{ height: '580px', overflow: 'hidden' }}>
            <div className="terminal-header" style={{ borderBottom: '1px solid rgba(239,68,68,0.25)', background: 'linear-gradient(90deg, rgba(239,68,68,0.06), transparent)' }}>
                <Cpu size={15} style={{ color: '#ef4444' }} />
                <span className="terminal-title" style={{ color: '#ef4444' }}>EDGE DEPLOYMENT METRICS // ESP32-S3 KEDARNATH-01 · LLM Eval Online</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        <Radio size={12} color="#22c55e" />
                    </motion.div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#22c55e' }}>LoRaWAN LIVE</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: 'calc(100% - 44px)' }}>

                {/* TOP-LEFT: MCU Profile + Live metrics */}
                <div style={{ padding: '1rem', borderRight: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                    {/* MCU Header */}
                    <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#ef4444', fontWeight: 700 }}>TARGET HARDWARE</span>
                            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
                            </motion.div>
                        </div>
                        {[
                            ['MCU', 'ESP32-S3 / ARM Cortex-M0'],
                            ['Flash', '8 MB · Model: 18.2 MB (GGUF)'],
                            ['SRAM', '512 KB · Used: 312 KB'],
                            ['Cost', '$2.40 USD'],
                            ['Network', 'LoRaWAN 915 MHz · Range: 15 km'],
                            ['Power', 'Solar + Li-ion · 180 mW avg'],
                        ].map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.67rem', marginBottom: '3px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                                <span style={{ color: '#fff' }}>{v}</span>
                            </div>
                        ))}
                    </div>

                    {/* Alert */}
                    {alertFired && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.5)', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 0.6 }}>
                                <AlertTriangle size={18} color="#ef4444" />
                            </motion.div>
                            <div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#ef4444', fontWeight: 700, marginBottom: '3px' }}>⚠ FLASH FLOOD ALERT — KEDARNATH</div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: 'var(--text-muted)' }}>P(flood, T+6h) = 0.84 · Threshold: 0.75</div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: '#f97316' }}>LoRaWAN alert dispatched to 14 downstream nodes</div>
                            </div>
                        </motion.div>
                    )}

                    {/* LLM Eval Scores */}
                    <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LLM Evaluation Scores</div>
                        {[
                            { label: 'BLEU Score', value: metrics[1].value, max: 1, color: '#3b82f6', target: 0.880 },
                            { label: 'ROUGE-L', value: metrics[2].value, max: 1, color: '#a855f7', target: 0.850 },
                            { label: 'L_physics residual', value: 1 - (metrics[5].value / 1e-3), max: 1, color: '#22c55e', target: null },
                        ].map(s => (
                            <div key={s.label} style={{ marginBottom: '0.6rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', marginBottom: '3px' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                                    <span style={{ color: s.color }}>{s.label === 'L_physics residual' ? metrics[5].value.toExponential(2) : s.value.toFixed(3)}</span>
                                </div>
                                <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                                    <motion.div animate={{ width: `${Math.min(s.value / s.max * 100, 100)}%` }}
                                        style={{ height: '100%', background: s.color, borderRadius: '2px', boxShadow: `0 0 6px ${s.color}` }} />
                                </div>
                                {s.target && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text-muted)', marginTop: '2px' }}>Target: {s.target} {s.value >= s.target ? '✓' : '✗'}</div>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Live Metric Graphs + Inference Log */}
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ padding: '1rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Activity size={11} /> Live Telemetry — KEDARNATH-NODE-01
                        </div>
                        {metrics.slice(0, 5).map(m => {
                            const pct = m.name === 'L_physics' ? 0 : Math.min((m.value / m.target) * 100, 100);
                            const ok = m.name === 'SRAM Usage' || m.name === 'Power Draw' ? m.value < m.target : m.value >= m.target;
                            return (
                                <div key={m.name} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '7px', padding: '0.6rem 0.75rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>{m.name}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <motion.span key={tick} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: m.color, fontWeight: 700 }}>
                                                {formatVal(m)}{m.unit ? ' ' + m.unit : ''}
                                            </motion.span>
                                            {ok ? <CheckCircle2 size={11} color="#22c55e" /> : <AlertTriangle size={11} color="#f97316" />}
                                        </div>
                                    </div>
                                    {/* Sparkline */}
                                    <div style={{ height: '32px', display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
                                        {m.history.map((v, i) => {
                                            const maxH = Math.max(...m.history, 0.001);
                                            const h = Math.max(2, (v / maxH) * 32);
                                            return (
                                                <div key={i} style={{ flex: 1, height: `${h}px`, background: i === m.history.length - 1 ? m.color : `${m.color}55`, borderRadius: '2px 2px 0 0', transition: 'height 0.3s' }} />
                                            );
                                        })}
                                    </div>
                                    <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', marginTop: '4px' }}>
                                        <motion.div animate={{ width: `${pct}%` }} style={{ height: '100%', background: m.color, borderRadius: '2px' }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Inference Log */}
                    <div ref={logRef} style={{ height: '140px', padding: '0.6rem 0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto', background: 'rgba(0,0,0,0.35)', fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>
                        <div style={{ color: 'var(--text-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', fontSize: '0.57rem' }}>Node Inference Log</div>
                        {inferenceLog.map((line, i) => (
                            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                style={{ color: line.includes('⚠') ? '#ef4444' : line.includes('✓') ? '#22c55e' : 'var(--text-muted)', marginBottom: '2px' }}>
                                {line}
                            </motion.div>
                        ))}
                        <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ color: '#ef4444' }}>█</motion.span>
                    </div>

                    {/* Deploy Button */}
                    <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            style={{ width: '100%', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.5)', color: '#ef4444', padding: '0.65rem', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '1px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Zap size={14} />
                            OTA FIRMWARE FLASH → KEDARNATH-NODE-01
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BareMetalMetrics;
