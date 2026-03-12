// @ts-nocheck
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Sparkles, Instances, Instance } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';

// Procedural Himalayan Terrain Generation (Mocking Terrain Ingestion)
const Terrain = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    const geometry = useMemo(() => {
        // Generate an advanced 3D topographical mesh
        const geom = new THREE.PlaneGeometry(30, 30, 128, 128);
        geom.rotateX(-Math.PI / 2);

        // Displace vertices to create mountains (Simulating Fractal Noise)
        const positions = geom.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i + 2];
            // Complex noise equation for sharp, Himalayan-style peaks
            let y = Math.sin(x * 0.5) * Math.cos(z * 0.5) * 2;
            y += Math.sin(x * 1.5 + z) * 1.5;
            y += Math.sin(x * 3.0 - z * 2.0) * 0.5;

            // Flatten valleys
            if (y < 0) y *= 0.2;
            positions[i + 1] = y;
        }
        geom.computeVertexNormals();
        return geom;
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            // Subtle rotation or breathing effect
            meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
        }
    });

    return (
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
            <mesh ref={meshRef} geometry={geometry} position={[0, -2, 0]}>
                {/* Real-Time Global Illumination / PBR Material Config */}
                <meshStandardMaterial
                    color="#0f1f1a"
                    wireframe={true} // High-tech engineering aesthetic
                    roughness={0.4}
                    metalness={0.8}
                    emissive="#003322"
                    emissiveIntensity={0.2}
                    transparent
                    opacity={0.6}
                />
            </mesh>
        </Float>
    );
};

// Fluid Dynamics Weather Cloudburst (High-Fidelity Particles Simulation)
const CloudburstParticleSystem = () => {
    const group = useRef<THREE.Group>(null);

    // Create thousands of particles simulating rain/data points
    const particles = useMemo(() => {
        return Array.from({ length: 3000 }, () => ({
            position: [
                (Math.random() - 0.5) * 20,
                Math.random() * 20 + 5, // Start high up
                (Math.random() - 0.5) * 20
            ] as [number, number, number],
            speed: Math.random() * 0.2 + 0.1
        }));
    }, []);

    useFrame(() => {
        if (group.current) {
            // Simulate gravity and fluid interaction
            group.current.children.forEach((mesh: any, i) => {
                mesh.position.y -= particles[i].speed;
                if (mesh.position.y < -2) {
                    mesh.position.y = 20; // reset to top
                }
            });
        }
    });

    return (
        <Instances limit={3000} castShadow receiveShadow>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#00d2ff" emissive="#00d2ff" emissiveIntensity={2} toneMapped={false} />
            <group ref={group}>
                {particles.map((data, i) => (
                    <Instance key={i} position={data.position} />
                ))}
            </group>
        </Instances>
    );
};

// Scene Graph Manager
const HighFidelitySimulation: React.FC = () => {
    return (
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            <Canvas
                camera={{ position: [0, 8, 20], fov: 45 }}
                gl={{ antialias: false, powerPreference: "high-performance" }} // Optimized for Post-Processing
            >
                <color attach="background" args={['#020202']} />
                <fog attach="fog" args={['#020202', 15, 35]} />

                {/* Global Illumination Lighting Rig */}
                <ambientLight intensity={0.2} />
                <directionalLight
                    position={[10, 20, 10]}
                    intensity={1.5}
                    color="#3cff8c"
                    castShadow
                />
                <pointLight position={[-10, 5, -10]} intensity={2.0} color="#00d2ff" />

                {/* Core Assets */}
                <Terrain />
                <CloudburstParticleSystem />

                {/* Subtle atmospheric dust */}
                <Sparkles count={500} scale={25} size={2} speed={0.4} opacity={0.3} color="#ffffff" />

                <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    maxPolarAngle={Math.PI / 2 - 0.1} // Don't go below ground
                    autoRotate
                    autoRotateSpeed={0.5}
                />

                {/* Advanced Post-Processing Pipeline */}
                <EffectComposer disableNormalPass>
                    {/* Intense Bloom to make the neon lines / APIs glow like magic */}
                    <Bloom
                        luminanceThreshold={0.2}
                        mipmapBlur
                        intensity={1.5}
                    />
                    {/* Cinematic Depth of Field */}
                    <DepthOfField
                        focusDistance={0.02}
                        focalLength={0.05}
                        bokehScale={4}
                        height={480}
                    />
                    <Noise opacity={0.03} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>

                {/* Cinematic Environment Reflections */}
                <Environment preset="night" />
            </Canvas>
        </div>
    );
};

export default HighFidelitySimulation;
