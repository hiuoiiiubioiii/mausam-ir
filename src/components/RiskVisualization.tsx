import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// ─── All visualization types in one component ──────────────────────────────
// 1. Animated SVG Radar/Spider Chart (5 risk dimensions)
// 2. Animated Canvas Gauge (risk speedometer)
// 3. SVG Sparkline (precipitation time series)
// 4. Canvas Heatmap Bar (risk distribution)

interface RadarProps {
    values: { label: string; value: number }[];  // value 0..1
    color: string;
    size?: number;
}

export const RiskRadarChart: React.FC<RadarProps> = ({ values, color, size = 160 }) => {
    const cx = size / 2, cy = size / 2, r = size * 0.38;
    const n = values.length;
    const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

    const rings = [0.25, 0.5, 0.75, 1.0];
    const ringPts = (frac: number) =>
        values.map((_, i) => {
            const a = angle(i);
            return `${cx + r * frac * Math.cos(a)},${cy + r * frac * Math.sin(a)}`;
        }).join(' ');

    const filledPts = values.map((v, i) => {
        const a = angle(i);
        return `${cx + r * v.value * Math.cos(a)},${cy + r * v.value * Math.sin(a)}`;
    }).join(' ');

    return (
        <svg width={size} height={size} style={{ display: 'block' }}>
            {/* Grid rings */}
            {rings.map(f => (
                <polygon key={f} points={ringPts(f)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            ))}
            {/* Spokes */}
            {values.map((_, i) => (
                <line key={i}
                    x1={cx} y1={cy}
                    x2={cx + r * Math.cos(angle(i))} y2={cy + r * Math.sin(angle(i))}
                    stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            ))}
            {/* Filled area */}
            <motion.polygon
                points={filledPts}
                fill={`${color}28`}
                stroke={color}
                strokeWidth="1.5"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
                transition={{ duration: 0.6, ease: 'backOut' }}
            />
            {/* Data points */}
            {values.map((v, i) => {
                const a = angle(i);
                const px = cx + r * v.value * Math.cos(a);
                const py = cy + r * v.value * Math.sin(a);
                return (
                    <motion.circle key={i} cx={px} cy={py} r={3} fill={color}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.05 }} />
                );
            })}
            {/* Labels */}
            {values.map((v, i) => {
                const a = angle(i);
                const lx = cx + (r + 14) * Math.cos(a);
                const ly = cy + (r + 14) * Math.sin(a);
                return (
                    <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                        style={{ fontFamily: 'monospace', fontSize: '9px', fill: '#64748b' }}>
                        {v.label}
                    </text>
                );
            })}
        </svg>
    );
};

// ─── Gauge / Speedometer ──────────────────────────────────────────────────────
interface GaugeProps {
    value: number;    // 0..1
    color: string;
    label?: string;
    size?: number;
}

export const RiskGauge: React.FC<GaugeProps> = ({ value, color, label = 'RISK', size = 140 }) => {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        const W = canvas.width, H = canvas.height;
        const cx = W / 2, cy = H * 0.62, radius = W * 0.36;

        let animValue = 0;
        let raf = 0;

        const draw = (v: number) => {
            ctx.clearRect(0, 0, W, H);

            // Background arc (grey)
            ctx.beginPath();
            ctx.arc(cx, cy, radius, Math.PI, 0, false);
            ctx.lineWidth = 14;
            ctx.strokeStyle = 'rgba(255,255,255,0.07)';
            ctx.lineCap = 'round';
            ctx.stroke();

            // Color gradient arc
            const grad = ctx.createLinearGradient(cx - radius, 0, cx + radius, 0);
            grad.addColorStop(0, '#3b82f6');
            grad.addColorStop(0.5, '#eab308');
            grad.addColorStop(1, '#ef4444');
            ctx.beginPath();
            ctx.arc(cx, cy, radius, Math.PI, Math.PI + v * Math.PI, false);
            ctx.strokeStyle = color;
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Glow
            ctx.save();
            ctx.shadowBlur = 20;
            ctx.shadowColor = color;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, Math.PI + v * Math.PI - 0.01, Math.PI + v * Math.PI + 0.01, false);
            ctx.strokeStyle = color;
            ctx.lineWidth = 18;
            ctx.stroke();
            ctx.restore();

            // Needle
            const needleAngle = Math.PI + v * Math.PI;
            const nx = cx + (radius - 4) * Math.cos(needleAngle);
            const ny = cy + (radius - 4) * Math.sin(needleAngle);
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(nx, ny);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(cx, cy, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();

            // Value text
            ctx.font = `bold ${W * 0.14}px monospace`;
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.fillText(`${(v * 100).toFixed(0)}%`, cx, cy + 28);
            ctx.font = `${W * 0.07}px monospace`;
            ctx.fillStyle = '#64748b';
            ctx.fillText(label, cx, cy + 44);

            // Tick marks
            for (let t = 0; t <= 10; t++) {
                const ta = Math.PI + (t / 10) * Math.PI;
                const t1r = radius + 8, t2r = radius + (t % 5 === 0 ? 16 : 10);
                ctx.beginPath();
                ctx.moveTo(cx + t1r * Math.cos(ta), cy + t1r * Math.sin(ta));
                ctx.lineTo(cx + t2r * Math.cos(ta), cy + t2r * Math.sin(ta));
                ctx.strokeStyle = 'rgba(255,255,255,0.2)';
                ctx.lineWidth = t % 5 === 0 ? 1.5 : 0.8;
                ctx.stroke();
            }
        };

        const animate = () => {
            if (animValue < value) {
                animValue = Math.min(animValue + 0.012, value);
                draw(animValue);
                raf = requestAnimationFrame(animate);
            } else {
                draw(value);
            }
        };
        animate();
        return () => cancelAnimationFrame(raf);
    }, [value, color, label]);

    return <canvas ref={ref} width={size} height={size * 0.72} style={{ display: 'block' }} />;
};

// ─── Sparkline ────────────────────────────────────────────────────────────────
interface SparklineProps {
    data: number[];
    color: string;
    width?: number;
    height?: number;
    label?: string;
    unit?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({ data, color, width = 200, height = 48, label, unit = '' }) => {
    if (!data.length) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 8) - 4;
        return `${x},${y}`;
    }).join(' ');

    const area = `M0,${height} L${pts.split(' ').map(p => `L${p}`).join(' ')} L${width},${height} Z`;

    return (
        <div>
            {label && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '.6rem', color: '#64748b', marginBottom: '4px' }}>
                    <span>{label}</span>
                    <span style={{ color }}>{data[data.length - 1].toFixed(1)}{unit}</span>
                </div>
            )}
            <svg width={width} height={height} style={{ display: 'block' }}>
                <defs>
                    <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <motion.path d={area} fill="url(#sg)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
                <motion.polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                    style={{ pathLength: 1 }}
                />
                <motion.circle
                    cx={parseFloat(pts.split(' ').at(-1)!.split(',')[0])}
                    cy={parseFloat(pts.split(' ').at(-1)!.split(',')[1])}
                    r={3} fill={color}
                    animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                />
            </svg>
        </div>
    );
};

// ─── Horizontal heatmap risk bar ──────────────────────────────────────────────
interface HeatbarProps {
    segments: { label: string; value: number; color: string }[];
    width?: number;
}

export const RiskHeatbar: React.FC<HeatbarProps> = ({ segments, width = 280 }) => {
    const total = segments.reduce((s, v) => s + v.value, 0);
    let x = 0;
    return (
        <div>
            <svg width={width} height={24} style={{ display: 'block', borderRadius: '4px', overflow: 'hidden' }}>
                {segments.map((seg, i) => {
                    const w = (seg.value / total) * width;
                    const cx = x + w / 2;
                    x += w;
                    return (
                        <motion.rect key={i} x={cx - w / 2} y={0} width={w} height={24} fill={seg.color}
                            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: i * 0.08, duration: 0.4 }}
                            style={{ transformOrigin: `${cx - w / 2}px 12px` }}
                        />
                    );
                })}
            </svg>
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginTop: '5px' }}>
                {segments.map(seg => (
                    <span key={seg.label} style={{ fontFamily: 'monospace', fontSize: '.58rem', color: seg.color, display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: seg.color }} />
                        {seg.label} {seg.value}%
                    </span>
                ))}
            </div>
        </div>
    );
};
