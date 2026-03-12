import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const DatasetIngestion: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (progress >= 100 && !isComplete) {
            // Delay completion state slightly to avoid synchronous cascade
            const timer = setTimeout(() => {
                setIsComplete(true);
                setLogs((prev) => [...prev, '[SYSTEM] ISRO / NASA Climate Datasets successfully mapped to memory.']);
            }, 50);
            return () => clearTimeout(timer);
        }

        const timer = setTimeout(() => {
            const increment = Math.random() * 15;
            setProgress((prev) => Math.min(prev + increment, 100));

            const newLogs = [
                `[${new Date().toISOString().split('T')[1].slice(0, 12)}] Downloading ISRO MOSDAC satellite chunk 0x${Math.floor(Math.random() * 10000).toString(16)}...`,
                `[${new Date().toISOString().split('T')[1].slice(0, 12)}] Chunking & Embedding NASA EarthData Copernicus node...`,
                `[${new Date().toISOString().split('T')[1].slice(0, 12)}] Storing topography data in High-Dimensional Vector DB...`
            ];
            setLogs((prev) => [...prev, newLogs[Math.floor(Math.random() * newLogs.length)]].slice(-6));

        }, 400);

        return () => clearTimeout(timer);
    }, [progress]);

    return (
        <div className="component-container">
            <div className="terminal-header" style={{ borderBottom: '1px solid rgba(0, 210, 255, 0.2)' }}>
                <Database size={16} className="glow-blue" />
                <span className="terminal-title" style={{ color: 'var(--neon-blue)' }}>RAG PIPELINE // VECTOR DATABASE EMBEDDING</span>
            </div>

            <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Embedding High-Res ISRO & NASA Datasets into Vector Space</span>
                    <span className="glow-blue">{Math.floor(progress)}%</span>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginBottom: '2rem' }}>
                    <motion.div
                        style={{ height: '100%', background: 'var(--neon-blue)', boxShadow: '0 0 10px var(--neon-blue)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear", duration: 0.1 }}
                    />
                </div>

                {/* Console Logs */}
                <div className="terminal-box" style={{ background: 'rgba(0,0,0,0.5)', height: '150px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    {logs.map((log, i) => (
                        <div key={i} style={{ color: log.includes('successfully') ? 'var(--neon-green)' : 'var(--text-muted)' }}>
                            {log}
                        </div>
                    ))}
                    {!isComplete && (
                        <motion.div
                            animate={{ opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            style={{ display: 'inline-block', width: '8px', height: '14px', background: 'var(--neon-blue)', marginTop: '4px' }}
                        />
                    )}
                </div>

                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(60, 255, 140, 0.05)', border: '1px solid rgba(60, 255, 140, 0.2)', borderRadius: '8px' }}
                    >
                        <CheckCircle2 color="var(--neon-green)" />
                        <div>
                            <div style={{ color: 'var(--neon-green)', fontWeight: 600, marginBottom: '4px' }}>RAG Embedding Complete</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>42.8 GB of climate tensor data successfully mapped to Vector Index.</div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default DatasetIngestion;
