"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function Particles({ count = 6000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.04;
      ref.current.rotation.y = state.clock.elapsedTime * 0.06;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#818cf8"
        size={0.018}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

function WireframeIcosahedron() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.25;
    ref.current.rotation.y = state.clock.elapsedTime * 0.35;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.25;
  });

  return (
    <mesh ref={ref} position={[1.8, 0, 0]}>
      <icosahedronGeometry args={[1.1, 1]} />
      <meshStandardMaterial
        color="#a78bfa"
        wireframe
        transparent
        opacity={0.25}
        emissive="#7c3aed"
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

function WireframeOctahedron() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.18;
    ref.current.rotation.z = state.clock.elapsedTime * 0.28;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.65 + 2) * 0.3;
  });

  return (
    <mesh ref={ref} position={[-2.5, 0.3, -0.5]}>
      <octahedronGeometry args={[0.85]} />
      <meshStandardMaterial
        color="#22d3ee"
        wireframe
        transparent
        opacity={0.2}
        emissive="#0891b2"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function WireframeTorus() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.3;
    ref.current.rotation.y = state.clock.elapsedTime * 0.15;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.4 + 1) * 0.2;
  });

  return (
    <mesh ref={ref} position={[0, -1.5, -2]}>
      <torusGeometry args={[0.8, 0.2, 8, 24]} />
      <meshStandardMaterial
        color="#f472b6"
        wireframe
        transparent
        opacity={0.15}
        emissive="#db2777"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function MouseReactiveCamera() {
  const { camera } = useThree();

  useFrame((state) => {
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      state.mouse.x * 0.6,
      0.04
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      state.mouse.y * 0.4,
      0.04
    );
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 70 }}
      style={{ background: "transparent" }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[8, 8, 8]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-8, -8, -8]} intensity={0.6} color="#a855f7" />
      <pointLight position={[0, 5, -5]} intensity={0.4} color="#06b6d4" />
      <Particles />
      <WireframeIcosahedron />
      <WireframeOctahedron />
      <WireframeTorus />
      <MouseReactiveCamera />
    </Canvas>
  );
}
