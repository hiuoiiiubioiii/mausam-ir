import React, { useEffect, useRef } from 'react';

// Pure-canvas calming Aurora Borealis simulation
// No dependencies — silky smooth gradient waves with drifting particles
const AuroraBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        let raf = 0;
        let t = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Aurora curtain bands
        const bands = Array.from({ length: 7 }, (_, i) => ({
            yBase: 0.25 + i * 0.08,
            amp: 40 + Math.random() * 60,
            speed: 0.00018 + Math.random() * 0.00025,
            phase: Math.random() * Math.PI * 2,
            hue: 130 + Math.random() * 80,   // green→cyan→blue
            alpha: 0.04 + Math.random() * 0.07,
            width: 550 + Math.random() * 300,
        }));

        // Floating mist particles
        const particles = Array.from({ length: 120 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 2.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.18,
            vy: -(Math.random() * 0.12 + 0.04),
            a: Math.random() * 0.35 + 0.05,
            hue: 150 + Math.random() * 60,
            life: Math.random(),
        }));

        const draw = () => {
            raf = requestAnimationFrame(draw);
            t += 1;
            const W = canvas.width;
            const H = canvas.height;

            // Deep dark sky background
            ctx.fillStyle = 'rgba(2, 4, 10, 0.18)';
            ctx.fillRect(0, 0, W, H);

            // Aurora curtains — multiple overlapping sine waves
            for (const band of bands) {
                const phase = band.phase + t * band.speed * 1000;
                ctx.save();
                ctx.globalAlpha = band.alpha * (0.7 + 0.3 * Math.sin(t * 0.005 + band.phase));

                const gradient = ctx.createLinearGradient(0, 0, 0, H);
                const yFrac = band.yBase + Math.sin(phase * 0.4) * 0.04;
                gradient.addColorStop(0, 'rgba(0,0,0,0)');
                gradient.addColorStop(0.3, `hsla(${band.hue}, 90%, 55%, 0)`);
                gradient.addColorStop(0.5, `hsla(${band.hue}, 95%, 60%, 1)`);
                gradient.addColorStop(0.7, `hsla(${band.hue + 20}, 80%, 50%, 0.3)`);
                gradient.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.beginPath();
                ctx.moveTo(0, H);
                // Wavy path across the full width
                const steps = 80;
                for (let s = 0; s <= steps; s++) {
                    const x = (s / steps) * W;
                    const wave = Math.sin(phase + s * 0.18) * band.amp
                        + Math.sin(phase * 1.3 + s * 0.07) * band.amp * 0.4;
                    ctx.lineTo(x, H * yFrac + wave);
                }
                ctx.lineTo(W, H);
                ctx.closePath();
                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.restore();
            }

            // Second layer — teal shimmer
            {
                const shimmerGrad = ctx.createRadialGradient(W * 0.5, H * 0.3, 0, W * 0.5, H * 0.3, W * 0.6);
                shimmerGrad.addColorStop(0, `hsla(175, 90%, 50%, ${0.04 + 0.02 * Math.sin(t * 0.007)})`);
                shimmerGrad.addColorStop(1, 'transparent');
                ctx.fillStyle = shimmerGrad;
                ctx.fillRect(0, 0, W, H);
            }

            // Stars
            if (t < 2) {
                // Draw stars once on first frame
                for (let i = 0; i < 200; i++) {
                    const sx = Math.random() * W;
                    const sy = Math.random() * H * 0.55;
                    const sr = Math.random() * 1.2;
                    ctx.beginPath();
                    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.6 + 0.2})`;
                    ctx.fill();
                }
            }

            // Drifting mist particles
            for (const p of particles) {
                p.x += p.vx + Math.sin(t * 0.003 + p.y * 0.01) * 0.08;
                p.y += p.vy;
                p.life += 0.003;
                if (p.y < -10) { p.y = H + 5; p.x = Math.random() * W; p.life = 0; }
                const alpha = p.a * Math.sin(p.life * Math.PI) * 0.8;
                if (alpha <= 0) continue;
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `hsl(${p.hue}, 80%, 70%)`;
                ctx.shadowBlur = 6;
                ctx.shadowColor = `hsl(${p.hue}, 90%, 60%)`;
                ctx.fill();
                ctx.restore();
            }

            // Subtle vignette
            const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.85);
            vignette.addColorStop(0, 'transparent');
            vignette.addColorStop(1, 'rgba(0,0,0,0.55)');
            ctx.fillStyle = vignette;
            ctx.fillRect(0, 0, W, H);
        };

        draw();
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
        />
    );
};

export default AuroraBackground;
