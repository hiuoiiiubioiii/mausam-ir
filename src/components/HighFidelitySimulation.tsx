import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Sparkles, Html, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, DepthOfField, Scanline } from '@react-three/postprocessing';
import * as THREE from 'three';

// ─── Mathematical Annotations (Manim-Style) ──────────────────────────────────
const MathOverlay = () => {
    return (
        <group position={[0, 5, 0]}>
            <Html transform distanceFactor={10} position={[-8, 6, 0]}>
                <div style={{
                    fontFamily: 'var(--mono)',
                    color: '#3cff8c',
                    background: 'rgba(0,0,0,0.8)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #3cff8c',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 0 20px rgba(60, 255, 140, 0.2)'
                }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>NAVIER-STOKES · CLOUDBURST DYNAMICS</div>
                    <code style={{ fontSize: '1.2rem' }}>∂u/∂t + (u·∇)u = -1/ρ ∇p + ν∇²u + g</code>
                    <div style={{ fontSize: '0.6rem', color: '#888', marginTop: '0.5rem' }}>SIMULATING TURBULENCE & SATURATION LEVELS</div>
                </div>
            </Html>

            <Html transform distanceFactor={10} position={[8, -2, 4]}>
                <div style={{
                    fontFamily: 'var(--mono)',
                    color: '#00d2ff',
                    background: 'rgba(0,0,0,0.8)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #00d2ff',
                    whiteSpace: 'nowrap'
                }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>LATENT SPACE PROJECTION</div>
                    <code style={{ fontSize: '1.2rem' }}>z ~ q_φ(z | x, y)</code>
                    <div style={{ fontSize: '0.6rem', color: '#888', marginTop: '0.5rem' }}>EDGE EVALUATION: 98.4% PRECISION</div>
                </div>
            </Html>
        </group>
    );
};

// ─── Procedural Himalayan Terrain ───────────────────────────────────────────
const Terrain = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    const geometry = useMemo(() => {
        const geom = new THREE.PlaneGeometry(50, 50, 256, 256);
        geom.rotateX(-Math.PI / 2);

        const positions = geom.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i + 2];

            let y = Math.sin(x * 0.25) * Math.cos(z * 0.25) * 4;
            y += Math.sin(x * 0.8 + z * 0.5) * 2;
            y += Math.sin(x * 2.0 - z * 1.5) * 0.8;
            y += (Math.random() - 0.5) * 0.1;

            const riverDist = Math.abs(x + Math.sin(z * 0.3) * 5);
            if (riverDist < 3) {
                y -= (3 - riverDist) * 1.5;
            }

            positions[i + 1] = y;
        }
        geom.computeVertexNormals();
        return geom;
    }, []);

    return (
        <mesh ref={meshRef} geometry={geometry} position={[0, -2, 0]} receiveShadow>
            <meshStandardMaterial
                color="#0a1a15"
                wireframe={false}
                roughness={0.7}
                metalness={0.2}
                emissive="#001108"
                emissiveIntensity={0.5}
            />
            <mesh geometry={geometry} position={[0, 0.01, 0]}>
                <meshStandardMaterial color="#3cff8c" wireframe transparent opacity={0.1} />
            </mesh>
        </mesh>
    );
};

// ─── Cloudburst Particle System ─────────────────────────────────────────────
const CloudburstSystem = () => {
    const count = 4000;
    const particles = useMemo(() => {
        return Array.from({ length: count }, () => {
            const x = (Math.random() - 0.5) * 30;
            const z = (Math.random() - 0.5) * 30;
            const y = 15 + Math.random() * 10;
            return {
                startPos: new THREE.Vector3(x, y, z),
                speed: 0.1 + Math.random() * 0.2,
                drift: (Math.random() - 0.5) * 0.02
            };
        });
    }, []);

    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.elapsedTime;

        particles.forEach((p, i) => {
            const yPos = 15 - ((time * p.speed * 10 + i) % 20);
            dummy.position.set(p.startPos.x + Math.sin(time + i) * 0.1, yPos, p.startPos.z);
            dummy.scale.setScalar(0.5 + Math.sin(time * 2 + i) * 0.2);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial
                color="#00d2ff"
                emissive="#00d2ff"
                emissiveIntensity={4}
                transparent
                opacity={0.8}
                toneMapped={false}
            />
        </instancedMesh>
    );
};

// ─── NVIDIA Omniverse / USD Placeholder ───────────────────────────────────
const USDPipelineAsset = () => {
    return (
        <group position={[5, 2, -5]}>
            <mesh castShadow>
                <boxGeometry args={[2, 4, 2]} />
                <meshStandardMaterial color="#3cff8c" emissive="#3cff8c" emissiveIntensity={0.5} wireframe />
            </mesh>
            <Html position={[0, 3, 0]} center>
                <div style={{ color: '#3cff8c', fontFamily: 'var(--mono)', fontSize: '0.5rem', background: '#000', padding: '2px 5px', border: '1px solid #3cff8c' }}>
                    USD_IOT_SENSOR_V2.usda
                </div>
            </Html>
        </group>
    );
};

// ─── Main Scene Graph ───────────────────────────────────────────────────────
const HighFidelitySimulation: React.FC = () => {
    const [viewMode, setViewMode] = useState<'satellite' | 'ground' | 'detail'>('satellite');
    const [usdLoading, setUsdLoading] = useState(false);

    const simulateUSDImport = () => {
        setUsdLoading(true);
        setTimeout(() => setUsdLoading(false), 2000);
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: '#010101' }}>
            <Canvas
                shadows
                gl={{ antialias: false, stencil: false, depth: true, powerPreference: "high-performance" }}
            >
                <PerspectiveCamera makeDefault position={viewMode === 'satellite' ? [-30, 25, 30] : viewMode === 'ground' ? [-15, 8, 15] : [0, 15, 10]} fov={viewMode === 'satellite' ? 35 : 50} />
                <color attach="background" args={['#010101']} />
                <fog attach="fog" args={['#010101', 10, 60]} />

                <ambientLight intensity={0.1} />
                <pointLight position={[0, 15, 0]} intensity={300} color="#00d2ff" distance={50} decay={2} />
                <directionalLight
                    position={[10, 20, 10]}
                    intensity={2}
                    color="#3cff8c"
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />

                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                    <group>
                        <Terrain />
                        <CloudburstSystem />
                        <MathOverlay />
                        <USDPipelineAsset />
                    </group>
                </Float>

                <Sparkles count={400} scale={40} size={1} speed={0.3} opacity={0.2} color="#ffffff" />

                <EffectComposer enableNormalPass={false}>
                    <Bloom intensity={1.2} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
                    <Noise opacity={0.03} />
                    <Scanline opacity={0.05} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                    <DepthOfField focusDistance={0.01} focalLength={0.02} bokehScale={2} height={480} />
                </EffectComposer>

                <Environment preset="night" />

                <OrbitControls
                    enablePan={false}
                    maxPolarAngle={Math.PI / 2.1}
                    minDistance={10}
                    maxDistance={40}
                    autoRotate
                    autoRotateSpeed={0.4}
                    enableDamping
                />
            </Canvas>

            <div style={{ position: 'absolute', top: '2rem', left: '2rem', pointerEvents: 'none', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>
                <div style={{ color: '#3cff8c', fontSize: '0.6rem', letterSpacing: '4px', marginBottom: '0.5rem' }}>SIMULATION CORE :: ACTIVE</div>
                <div style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 900, textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>HIMALAYAN CLOUDBURST</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.55rem', marginTop: '0.2rem' }}>PINN ENGINE V4.2 // TEMPORAL STEP: 0.002s</div>
            </div>

            <div style={{
                position: 'absolute',
                top: '2rem',
                right: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                background: 'rgba(0,0,0,0.6)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{ color: 'var(--muted)', fontSize: '0.55rem', fontFamily: 'var(--mono)', marginBottom: '0.2rem' }}>VIEW_CONTROLS</div>
                {(['satellite', 'ground', 'detail'] as const).map(mode => (
                    <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        style={{
                            background: viewMode === mode ? 'rgba(60, 255, 140, 0.1)' : 'transparent',
                            border: `1px solid ${viewMode === mode ? '#3cff8c' : 'rgba(255,255,255,0.2)'}`,
                            color: viewMode === mode ? '#3cff8c' : '#888',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '4px',
                            fontSize: '0.6rem',
                            cursor: 'pointer',
                            fontFamily: 'var(--mono)',
                            textTransform: 'uppercase'
                        }}
                    >
                        {mode} mode {viewMode === mode && '●'}
                    </button>
                ))}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0.3rem 0' }} />
                <button
                    onClick={simulateUSDImport}
                    disabled={usdLoading}
                    style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid #3b82f6',
                        color: '#60a5fa',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '4px',
                        fontSize: '0.6rem',
                        cursor: 'pointer',
                        fontFamily: 'var(--mono)',
                        opacity: usdLoading ? 0.5 : 1
                    }}
                >
                    {usdLoading ? 'SYNCING OMNIVERSE...' : 'IMPORT USD ASSETS'}
                </button>
            </div>

            <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', pointerEvents: 'none', fontFamily: 'var(--mono)', textAlign: 'right' }}>
                <div style={{ color: '#00d2ff', fontSize: '0.6rem', marginBottom: '0.2rem' }}>THREAT LEVEL: CRITICAL</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.5rem' }}>GEOGRAPHIC SCAN: KEDARNATH VALLEY (W-HIM)</div>
            </div>
        </div>
    );
};

export default HighFidelitySimulation;
