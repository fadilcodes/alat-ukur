'use client';

import React, { useRef, Suspense, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, PerspectiveCamera, useGLTF } from '@react-three/drei';
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

// Preload models for instant rendering
useGLTF.preload('/kampas-rem.glb');
useGLTF.preload('/baut.glb');

const FallbackComponent = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#10B981" wireframe />
  </mesh>
);

interface IsolatedCanvas3DProps {
  selectedObject: Object3DType;
  isDragging?: boolean;
}

function IsolatedCanvas3DInner({ selectedObject, isDragging }: IsolatedCanvas3DProps) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 font-bold text-xs"><p>Loading 3D...</p></div>}>
      <Canvas shadows frameloop="demand">
        <PerspectiveCamera makeDefault position={[0, 0.8, 3.5]} fov={45} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 8, 5]} intensity={2.0} castShadow />
        <directionalLight position={[-5, -5, -5]} intensity={0.8} />
        <pointLight position={[0, 2, 2]} intensity={0.6} color="#38bdf8" />

        <Suspense fallback={<FallbackComponent />}>
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
  );
}

// Memoized R3F Canvas Container
const IsolatedCanvas3D = memo(IsolatedCanvas3DInner, (prev, next) => {
  return prev.selectedObject === next.selectedObject && prev.isDragging === next.isDragging;
});

export default IsolatedCanvas3D;


