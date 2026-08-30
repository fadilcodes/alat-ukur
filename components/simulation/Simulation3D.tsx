'use client';

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, PerspectiveCamera, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Object3DType } from '@/lib/zustand/useSimulationStore';

interface MeshProps {
  isDragging?: boolean;
}

function KampasRemGLTF({ isDragging = false }: MeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/kampas-rem.glb');

  useFrame((_, delta) => {
    if (groupRef.current && !isDragging) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={0.08}>
      <primitive object={scene.clone()} />
    </group>
  );
}

function BautGLTF({ isDragging = false }: MeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/baut.glb');

  useFrame((_, delta) => {
    if (groupRef.current && !isDragging) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 6]} scale={0.35}>
      <primitive object={scene.clone()} />
    </group>
  );
}

useGLTF.preload('/kampas-rem.glb');
useGLTF.preload('/baut.glb');

const Fallback3D = () => (
  <mesh>
    <boxGeometry args={[0.8, 0.8, 0.8]} />
    <meshStandardMaterial color="#10B981" wireframe />
  </mesh>
);

interface Simulation3DProps {
  selectedObject: Object3DType;
  isDragging?: boolean;
}

export default function Simulation3D({ selectedObject, isDragging }: Simulation3DProps) {
  return (
    <div className="w-full h-full min-h-[160px] relative">
      <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 font-bold text-xs">Loading 3D...</div>}>
        <Canvas shadows frameloop="demand">
          <PerspectiveCamera makeDefault position={[0, 0.8, 3.5]} fov={45} />
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 8, 5]} intensity={2.0} castShadow />
          <directionalLight position={[-5, -5, -5]} intensity={0.8} />
          <pointLight position={[0, 2, 2]} intensity={0.6} color="#38bdf8" />

          <Suspense fallback={<Fallback3D />}>
            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
              {selectedObject === 'kampas_rem' ? (
                <KampasRemGLTF isDragging={isDragging} />
              ) : (
                <BautGLTF isDragging={isDragging} />
              )}
            </Float>
          </Suspense>

          <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 6} />
        </Canvas>
      </Suspense>
    </div>
  );
}
