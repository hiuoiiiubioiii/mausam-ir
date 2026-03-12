import React, { useState, useEffect, useRef } from 'react';
import { Database, Layers, GitBranch, ArrowRight, CheckCircle2, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DataChunk {
    id: string;
    source: string;
    grid: string;
    window: string;
    dims: string;
    status: 'streaming' | 'chunking' | 'embedding' | 'indexed';
    embedding: number[];
}

interface VectorEntry {
    id: string;
    similarity: number;
    label: string;
}

const SOURCES = [
    { name: 'ISRO MOSDAC', color: '#f97316', desc: 'Cloud top temp / Insolation', endpoint: 'mosdac.gov.in/api/v2' },
    { name: 'NASA EarthData', color: '#3b82f6', desc: 'Precipitation / Soil moisture', endpoint: 'earthdata.nasa.gov/api' },
    { name: 'IMD Gridded', color: '#a855f7', desc: 'Surface rainfall / Wind vectors', endpoint: 'imdpune.gov.in/grid' },
    { name: 'SRTM DEM', color: '#22c55e', desc: 'Himalayan topography mesh', endpoint: 'earthexplorer.usgs.gov' },
];

const randomEmbedding = () => Array.from({ length: 16 }, () => Math.random() * 2 - 1);

const DatasetIngestion: React.FC = () => {
    const [chunks, setChunks] = useState<DataChunk[]>([]);
    const [vectorEntries, setVectorEntries] = useState<VectorEntry[]>([]);
    const [activeSource, setActiveSource] = useState(0);
    const [totalVectors, setTotalVectors] = useState(0);
    const [throughput, setThroughput] = useState(0);
    const [phase, setPhase] = useState<'streaming' | 'chunking' | 'embedding' | 'indexed'>('streaming');
    const logRef = useRef<HTMLDivElement>(null);
    const [logs, setLogs] = useState<{ text: string; type: string }[]>([
        { text: '[INIT] Mausam-IR RAG Ingestion Pipeline v2.4 activated', type: 'info' },
        { text: '[INIT] Target Vector DB: Qdrant (cosine similarity, dim=768)', type: 'info' },
        { text: '[INIT] Chunking strategy: Spatial 5km² × Temporal 6hr sliding window', type: 'info' },
    ]);

    useEffect(() => {
        const phases: typeof phase[] = ['streaming', 'chunking', 'embedding', 'indexed'];
        let phaseIdx = 0;
        const phaseTimer = setInterval(() => {
            phaseIdx = (phaseIdx + 1) % phases.length;
            setPhase(phases[phaseIdx]);
        }, 3500);
        return () => clearInterval(phaseTimer);
    }, []);

    useEffect(() => {
        const sourceTimer = setInterval(() => {
            setActiveSource(p => (p + 1) % SOURCES.length);
        }, 2200);
        return () => clearInterval(sourceTimer);
    }, []);

    useEffect(() => {
        const chunkTimer = setInterval(() => {
            const lat = (27 + Math.random() * 5).toFixed(2);
            const lon = (78 + Math.random() * 8).toFixed(2);
            const chunk: DataChunk = {
                id: `CHK-${Math.floor(Math.random() * 9999).toString(16).toUpperCase()}`,
                source: SOURCES[Math.floor(Math.random() * SOURCES.length)].name,
                grid: `${lat}°N, ${lon}°E [5km²]`,
                window: `T-${Math.floor(Math.random() * 48)}h → T-${Math.floor(Math.random() * 6)}h`,
                dims: `(${[4, 8, 16][Math.floor(Math.random() * 3)]}, 128, 128)`,
                status: phase,
                embedding: randomEmbedding(),
            };
            setChunks(prev => [chunk, ...prev].slice(0, 6));
            setTotalVectors(v => v + 1);
            setThroughput(Math.floor(Math.random() * 400 + 200));

            const logMessages = [
                `[MOSDAC] Fetched chunk ${chunk.id} → grid ${chunk.grid}`,
                `[EMBED] Multimodal encoder processing tensor${chunk.dims}`,
                `[QDRANT] Inserting vector dim=768 cosine-sim index`,
                `[RAG] Spatial window ${chunk.window} ready for retrieval`,
                `[NASA] EarthData precipitation node Δ+${(Math.random() * 3).toFixed(2)}mm/hr`,
            ];
            setLogs(prev => [...prev, { text: logMessages[Math.floor(Math.random() * logMessages.length)], type: 'data' }].slice(-10));

            if (Math.random() > 0.6) {
                const entry: VectorEntry = {
                    id: chunk.id,
                    similarity: 0.85 + Math.random() * 0.14,
                    label: `Himalayan sector ${chunk.grid.split(',')[0]} cloudburst risk`,
                };
                setVectorEntries(prev => [entry, ...prev].slice(0, 5));
            }
        }, 900);
        return () => clearInterval(chunkTimer);
    }, [phase]);

    useEffect(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [logs]);

    const phaseColors: Record<string, string> = {
        streaming: '#3b82f6', chunking: '#f97316', embedding: '#a855f7', indexed: '#22c55e'
    };

    return (
        <div className="component-container" style={{ height: '580px', overflow: 'hidden' }}>
            <div className="terminal-header" style={{ borderBottom: '1px solid rgba(0, 210, 255, 0.25)', background: 'linear-gradient(90deg, rgba(0,100,255,0.08), transparent)' }}>
                <Database size={15} style={{ color: '#3b82f6' }} />
                <span className="terminal-title" style={{ color: '#3b82f6' }}>RAG PIPELINE // SPATIAL-TEMPORAL VECTOR EMBEDDING (Qdrant v1.8)</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                        <Wifi size={12} color="#22c55e" />
                    </motion.div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#22c55e' }}>{throughput} vec/s</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#a855f7' }}>{totalVectors.toLocaleString()} indexed</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 0, height: 'calc(100% - 44px)' }}>

                {/* LEFT: Data Sources + Chunking */}
                <div style={{ padding: '1rem', borderRight: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Source Indicators */}
                    <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Live Data Sources</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {SOURCES.map((src, i) => (
                                <motion.div key={src.name} animate={{ borderColor: i === activeSource ? src.color : 'rgba(255,255,255,0.06)' }}
                                    style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid rgba(255,255,255,0.06)`, borderRadius: '6px', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <motion.div animate={{ opacity: i === activeSource ? [1, 0.3, 1] : 0.3 }} transition={{ repeat: Infinity, duration: 0.8 }}
                                        style={{ width: '7px', height: '7px', borderRadius: '50%', background: src.color, flexShrink: 0 }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: i === activeSource ? '#fff' : 'var(--text-muted)' }}>{src.name}</div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>{src.desc}</div>
                                    </div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: src.color, opacity: 0.7 }}>{src.endpoint}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Pipeline Phase */}
                    <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Pipeline Phase</div>
                        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                            {(['streaming', 'chunking', 'embedding', 'indexed'] as const).map(p => (
                                <motion.div key={p} animate={{ background: phase === p ? `${phaseColors[p]}22` : 'rgba(255,255,255,0.03)', borderColor: phase === p ? phaseColors[p] : 'rgba(255,255,255,0.08)' }}
                                    style={{ border: '1px solid', borderRadius: '4px', padding: '0.25rem 0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: phase === p ? phaseColors[p] : 'var(--text-muted)', textTransform: 'uppercase' }}>
                                    {p === phase ? '▶ ' : ''}{p}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Live Chunk Stream */}
                    <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Spatial Chunk Stream</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            <AnimatePresence mode="popLayout">
                                {chunks.slice(0, 4).map(c => (
                                    <motion.div key={c.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }} layout
                                        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '5px', padding: '0.4rem 0.6rem', fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                                            <span style={{ color: '#a855f7' }}>{c.id}</span>
                                            <span style={{ color: phaseColors[c.status] }}>{c.status}</span>
                                        </div>
                                        <div style={{ color: 'var(--text-muted)' }}>{c.grid} | {c.source}</div>
                                        <div style={{ color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                                            {/* Mini embedding bar */}
                                            <div style={{ display: 'flex', gap: '1px', marginTop: '3px' }}>
                                                {c.embedding.slice(0, 16).map((v, idx) => (
                                                    <div key={idx} style={{ width: '6px', height: `${Math.abs(v) * 12 + 2}px`, background: v > 0 ? '#3b82f6' : '#f97316', borderRadius: '1px', alignSelf: 'flex-end' }} />
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Vector DB + Logs */}
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                    {/* Vector DB State */}
                    <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Layers size={11} /> Qdrant Vector Index — Top Matches
                            </div>
                            <ArrowRight size={11} color="var(--text-muted)" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            <AnimatePresence mode="popLayout">
                                {vectorEntries.map((e, _i) => (
                                    <motion.div key={e.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} layout
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.5rem', background: 'rgba(168,85,247,0.06)', borderRadius: '4px', border: '1px solid rgba(168,85,247,0.15)' }}>
                                        <GitBranch size={10} color="#a855f7" />
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', flex: 1 }}>{e.label}</span>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#22c55e' }}>{(e.similarity * 100).toFixed(1)}%</span>
                                        <div style={{ width: '40px', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                            <div style={{ width: `${e.similarity * 100}%`, height: '100%', background: '#22c55e', borderRadius: '2px' }} />
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Console Logs */}
                    <div ref={logRef} style={{ flex: 1, padding: '0.75rem 1rem', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', background: 'rgba(0,0,0,0.3)' }}>
                        <AnimatePresence mode="popLayout">
                            {logs.map((log, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} layout
                                    style={{ marginBottom: '3px', color: log.type === 'data' ? (log.text.includes('EMBED') ? '#a855f7' : log.text.includes('QDRANT') ? '#22c55e' : log.text.includes('NASA') ? '#3b82f6' : 'var(--text-muted)') : 'var(--neon-blue)' }}>
                                    {log.text}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7 }} style={{ color: '#a855f7' }}>█</motion.span>
                    </div>

                    {/* Stats Bar */}
                    <div style={{ padding: '0.6rem 1rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '1.5rem', background: 'rgba(0,0,0,0.3)' }}>
                        {[
                            { label: 'Vectors Indexed', value: totalVectors.toLocaleString(), color: '#22c55e' },
                            { label: 'Embedding Dim', value: '768', color: '#a855f7' },
                            { label: 'Grid Resolution', value: '5km²', color: '#3b82f6' },
                            { label: 'DB: Qdrant', value: 'ONLINE', color: '#22c55e' },
                        ].map(s => (
                            <div key={s.label} style={{ fontFamily: 'var(--font-mono)' }}>
                                <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{s.label}</div>
                                <div style={{ fontSize: '0.78rem', color: s.color, fontWeight: 600 }}>{s.value}</div>
                            </div>
                        ))}
                        {totalVectors > 15 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <CheckCircle2 size={14} color="#22c55e" />
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#22c55e' }}>RAG Ready</span>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatasetIngestion;
