"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// 浮遊する小粒子（プランクトン・塵）
function FloatingParticles({ count = 2500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      speeds[i]  = Math.random() * 0.006 + 0.001;
      offsets[i] = Math.random() * Math.PI * 2;
    }
    return { positions, speeds, offsets };
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i];
      pos[i * 3]     += Math.sin(state.clock.elapsedTime * 0.25 + offsets[i]) * 0.001;
      if (pos[i * 3 + 1] > 8) pos[i * 3 + 1] = -8;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00d4ff"
        size={0.015}
        sizeAttenuation
        depthWrite={false}
        opacity={0.65}
      />
    </Points>
  );
}

// 上昇する泡
function Bubbles({ count = 60 }: { count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  const bubbles = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 14,
      y: (Math.random() - 0.5) * 16,
      z: (Math.random() - 0.5) * 6,
      speed: Math.random() * 0.018 + 0.004,
      size: Math.random() * 0.055 + 0.012,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.7 + 0.3,
    })), [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!ref.current) return;
    bubbles.forEach((b, i) => {
      b.y += b.speed;
      if (b.y > 8) {
        b.y = -8;
        b.x = (Math.random() - 0.5) * 14;
      }
      const wobbleX = Math.sin(state.clock.elapsedTime * b.wobbleSpeed + b.wobble) * 0.07;
      dummy.position.set(b.x + wobbleX, b.y, b.z);
      dummy.scale.setScalar(b.size);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#a8e6ff"
        transparent
        opacity={0.22}
        roughness={0}
        metalness={0.1}
      />
    </instancedMesh>
  );
}

// 水面からの光のカーテン
function LightRays() {
  const rays = useMemo(() =>
    Array.from({ length: 8 }, () => ({
      x: (Math.random() - 0.5) * 14,
      z: (Math.random() - 0.5) * 4,
      tilt: (Math.random() - 0.5) * 0.3,
      width: Math.random() * 0.22 + 0.06,
      opacity: Math.random() * 0.07 + 0.04,
    })), []);

  return (
    <>
      {rays.map((ray, i) => (
        <mesh key={i} position={[ray.x, 1, ray.z]} rotation={[0, 0, ray.tilt]}>
          <planeGeometry args={[ray.width, 18]} />
          <meshBasicMaterial
            color="#00d4ff"
            transparent
            opacity={ray.opacity}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

function MouseReactiveCamera() {
  const { camera } = useThree();

  useFrame((state) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, state.mouse.x * 0.5, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, state.mouse.y * 0.35, 0.04);
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
      <fog attach="fog" args={["#001a3d", 10, 22]} />
      <ambientLight intensity={0.5} color="#00b4d8" />
      <pointLight position={[0, 8, 0]} intensity={2.5} color="#00d4ff" />
      <pointLight position={[-6, 3, -3]} intensity={0.8} color="#0096c7" />
      <pointLight position={[6, -4, 2]} intensity={0.5} color="#0077b6" />
      <FloatingParticles />
      <Bubbles />
      <LightRays />
      <MouseReactiveCamera />
    </Canvas>
  );
}
