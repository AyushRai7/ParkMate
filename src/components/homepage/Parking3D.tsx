"use client";

import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Simple low-poly car component
function Car({ position, color, delay = 0 }: { position: [number, number, number]; color: string; delay?: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const startTime = useRef(Date.now() + delay * 1000);

  useFrame(() => {
    if (!meshRef.current) return;
    const elapsed = (Date.now() - startTime.current) / 1000;
    
    // Smooth parking animation
    if (elapsed > 0 && elapsed < 2) {
      const progress = Math.min(elapsed / 2, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      meshRef.current.position.z = position[2] + 8 * (1 - eased);
      meshRef.current.visible = true;
    } else if (elapsed >= 2 && elapsed < 6) {
      meshRef.current.position.z = position[2];
    } else if (elapsed >= 6 && elapsed < 8) {
      const progress = (elapsed - 6) / 2;
      const eased = progress * progress * progress;
      meshRef.current.position.z = position[2] - 8 * eased;
    } else if (elapsed >= 8) {
      startTime.current = Date.now();
      meshRef.current.position.z = position[2] + 8;
    }
  });

  return (
    <group ref={meshRef} position={position} visible={false}>
      {/* Car body */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.8, 0.3, 1.6]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Car cabin */}
      <mesh position={[0, 0.45, -0.1]}>
        <boxGeometry args={[0.7, 0.25, 0.8]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Windows */}
      <mesh position={[0, 0.45, -0.1]}>
        <boxGeometry args={[0.72, 0.2, 0.6]} />
        <meshStandardMaterial color="#1a2744" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Wheels */}
      {[[-0.35, 0.1, 0.5], [0.35, 0.1, 0.5], [-0.35, 0.1, -0.5], [0.35, 0.1, -0.5]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {/* Headlights */}
      <mesh position={[0.25, 0.2, 0.81]}>
        <boxGeometry args={[0.15, 0.08, 0.02]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.25, 0.2, 0.81]}>
        <boxGeometry args={[0.15, 0.08, 0.02]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// Parking slot
function ParkingSlot({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Slot floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[1.2, 2.2]} />
        <meshStandardMaterial color="#0d1525" />
      </mesh>
      {/* Slot lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.55, 0.02, 0]}>
        <planeGeometry args={[0.05, 2.2]} />
        <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.55, 0.02, 0]}>
        <planeGeometry args={[0.05, 2.2]} />
        <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 1.05]}>
        <planeGeometry args={[1.1, 0.05]} />
        <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

// Parking grid
function ParkingGrid() {
  const carColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
  
  const slots = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 4; col++) {
        positions.push([(col - 1.5) * 1.4, 0, (row - 0.5) * 2.6]);
      }
    }
    return positions;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#080d15" />
      </mesh>

      {/* Parking slots */}
      {slots.map((pos, i) => (
        <ParkingSlot key={i} position={pos} />
      ))}

      {/* Animated cars - only some slots have cars */}
      <Car position={[slots[0][0], 0, slots[0][2]]} color={carColors[0]} delay={0} />
      <Car position={[slots[2][0], 0, slots[2][2]]} color={carColors[1]} delay={2} />
      <Car position={[slots[5][0], 0, slots[5][2]]} color={carColors[2]} delay={4} />
      <Car position={[slots[7][0], 0, slots[7][2]]} color={carColors[3]} delay={6} />
    </group>
  );
}

// Ambient particles
function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 50;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = Math.random() * 5 + 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#2dd4bf"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}


function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#2dd4bf" />
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <ParkingGrid />
      </Float>
      <Particles />
    </>
  );
}

export default function ParkingScene3D() {
  return (
    <div className="absolute inset-0 opacity-60">
      <Canvas
        camera={{ position: [6, 6, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
