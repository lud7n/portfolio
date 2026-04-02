"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const STAR_COUNT = 3000;

export default function WarpBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 0;

    // 星をランダムに配置（Z: -2000 〜 0）
    const positions = new Float32Array(STAR_COUNT * 3);
    const colors    = new Float32Array(STAR_COUNT * 3);
    const sizes     = new Float32Array(STAR_COUNT);

    const palette = [
      new THREE.Color(0xa5b4fc), // indigo-300
      new THREE.Color(0xc4b5fd), // violet-300
      new THREE.Color(0x67e8f9), // cyan-300
      new THREE.Color(0xf8f8f6), // white
      new THREE.Color(0xf8f8f6),
      new THREE.Color(0xf8f8f6),
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      const r = Math.random() * 400 + 20;
      const theta = Math.random() * Math.PI * 2;
      positions[i3]     = Math.cos(theta) * r;
      positions[i3 + 1] = Math.sin(theta) * r;
      positions[i3 + 2] = -(Math.random() * 2000);

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i3]     = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      sizes[i] = Math.random() * 2.5 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color",    new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size",     new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float uWarp;
        void main() {
          vColor = color;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          // ワープ時に星を引き伸ばして光速感を出す
          float stretch = 1.0 + uWarp * (-mvPos.z / 500.0) * 3.0;
          gl_PointSize = size * stretch * (300.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.1, d);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      uniforms: {
        uWarp: { value: 0 },
      },
      vertexColors: true,
      transparent: true,
      depthWrite: false,
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);

    // スクロール量・速度をトラッキング
    let scrollProgress = 0; // 0〜1（カメラ位置用）
    let scrollVelocity = 0; // スクロール速度（渦・ワープ用）
    let lastScrollY = window.scrollY;
    let currentZ = 0;
    let currentWarp = 0;

    const onScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      scrollProgress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
      scrollVelocity = Math.min(Math.abs(window.scrollY - lastScrollY) * 0.015, 1.5);
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // リサイズ
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // カメラZ位置: スクロールに合わせて前進（0 → -1600）
      const targetZ = -scrollProgress * 1600;
      currentZ += (targetZ - currentZ) * 0.06;
      camera.position.z = currentZ;

      // ワープ・渦強度: スクロール速度ベース（止まるとゼロへ減衰）
      scrollVelocity *= 0.85;
      const targetWarp = scrollVelocity;
      currentWarp += (targetWarp - currentWarp) * 0.08;
      material.uniforms.uWarp.value = currentWarp;

      // C: 渦巻き — 各星をZ軸周りに少し回転させる
      const pos = geometry.attributes.position.array as Float32Array;
      const swirlAngle = currentWarp * 0.012; // ワープ強度で渦の強さが変わる
      for (let i = 0; i < STAR_COUNT; i++) {
        const i3 = i * 3;
        const x = pos[i3];
        const y = pos[i3 + 1];
        const z = pos[i3 + 2];

        // カメラからの相対距離で渦速度を変える（近いほど速く回る）
        const relZ = z - camera.position.z;
        const depthFactor = Math.max(0, 1 - relZ / -2000); // 近い星ほど大きく
        const angle = swirlAngle * (1 + depthFactor * 2);

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        pos[i3]     = x * cos - y * sin;
        pos[i3 + 1] = x * sin + y * cos;

        // 通過した星を前方に再配置
        if (z > camera.position.z + 50) {
          const r = Math.random() * 400 + 20;
          const theta = Math.random() * Math.PI * 2;
          pos[i3]     = Math.cos(theta) * r;
          pos[i3 + 1] = Math.sin(theta) * r;
          pos[i3 + 2] = camera.position.z - 2000;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
