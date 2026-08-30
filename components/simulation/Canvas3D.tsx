'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Object3DType, HitboxZone } from '@/lib/zustand/useSimulationStore';

interface KampasRemMeshProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isDragging?: boolean;
}

function KampasRemMesh({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, isDragging = false }: KampasRemMeshProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current && !isDragging) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      {/* Steel Backing Plate */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 1.2, 0.25]} />
        <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Friction Pad Material */}
      <mesh position={[0, 0, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.9, 0.35]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Mounting Ears / Holes */}
      <mesh position={[-1.2, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.26, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[1.2, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.26, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.7} />
      </mesh>
    </group>
  );
}

interface BautMeshProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isDragging?: boolean;
}

function BautMesh({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, isDragging = false }: BautMeshProps) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current && !isDragging) {
      meshRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      {/* Hex Bolt Head */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.55, 0.4, 6]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Washer Collar */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.65, 0.1, 32]} />
        <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Threaded Shaft Body */}
      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.32, 2.4, 32]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Spiral Threads Rings */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[0, -1.4 + i * 0.15, 0]} castShadow>
          <torusGeometry args={[0.33, 0.03, 8, 24]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.4} metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

interface Canvas3DProps {
  selectedObject: Object3DType;
  snapState: 'idle' | 'snapped' | 'bounced' | 'success' | 'error';
  onDropToHitbox?: (hitbox: HitboxZone) => void;
}

export default function Canvas3D({ selectedObject, snapState }: Canvas3DProps) {
  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border border-slate-700 shadow-md">
      {/* 3D Canvas Tag */}
      <div className="absolute top-3 left-3 z-10 bg-slate-800/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-700 text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        Rendering 3D Realtime (R3F)
      </div>

      {/* Status Overlay */}
      {snapState === 'bounced' && (
        <div className="absolute top-3 right-3 z-10 bg-red-600/90 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg animate-bounce flex items-center gap-1.5">
          <span>⚠️ Posisi Salah! Auto-Bounce</span>
        </div>
      )}

      {snapState === 'snapped' && (
        <div className="absolute top-3 right-3 z-10 bg-emerald-600/90 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1.5">
          <span>✅ Snapped to Tool Jaw!</span>
        </div>
      )}

      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 1.5, 4.5]} fov={50} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
        <pointLight position={[-5, -2, -5]} intensity={0.5} color="#38bdf8" />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          {selectedObject === 'kampas_rem' ? (
            <KampasRemMesh scale={1.2} />
          ) : (
            <BautMesh scale={1.1} rotation={[0, 0, Math.PI / 6]} />
          )}
        </Float>

        <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 6} />
      </Canvas>
    </div>
  );
}
