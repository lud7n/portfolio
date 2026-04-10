"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// プロジェクトごとのアクセントカラー（RGB 0-1）
const ACCENT_COLORS: [number, number, number][] = [
  [0.388, 0.400, 0.945], // indigo  #6366f1
  [0.063, 0.725, 0.506], // emerald #10b981
  [0.961, 0.620, 0.043], // amber   #f59e0b
  [0.545, 0.361, 0.965], // violet  #8b5cf6
];
const DEFAULT_COLOR: [number, number, number] = [0.12, 0.14, 0.22];

const VERT = `
uniform float uTime;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.1; a *= 0.5; }
  return v;
}

varying float vElevation;

void main() {
  vec2 uv = vec2(position.x * 0.55 + uTime * 0.06, position.z * 0.55 - uTime * 0.04);
  float e = fbm(uv) * 2.2 - 1.1;
  e += fbm(uv * 2.0 + 3.7) * 0.5;
  vElevation = e;

  vec3 pos = position;
  pos.y += e * 1.4;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const FRAG = `
uniform vec3 uColor;
varying float vElevation;

void main() {
  float t = clamp((vElevation + 1.5) / 3.0, 0.0, 1.0);
  vec3 dark = vec3(0.04, 0.05, 0.08);
  vec3 col  = mix(dark, uColor, t * 0.85);
  float alpha = mix(0.12, 0.55, t);
  gl_FragColor = vec4(col, alpha);
}
`;

function lerpVec3(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export default function ProjectsWavePlane({ hoveredIndex }: { hoveredIndex: number | null }) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const hoveredRef  = useRef(hoveredIndex);
  const currentCol  = useRef<[number, number, number]>([...DEFAULT_COLOR]);
  const targetCol   = useRef<[number, number, number]>([...DEFAULT_COLOR]);

  // hoveredIndex が変わったら targetColor を更新
  useEffect(() => {
    hoveredRef.current = hoveredIndex;
    targetCol.current  = hoveredIndex !== null ? [...ACCENT_COLORS[hoveredIndex]] : [...DEFAULT_COLOR];
  }, [hoveredIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Scene / Camera
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 6, 10);
    camera.lookAt(0, 0, -4);

    // Plane
    const geo = new THREE.PlaneGeometry(36, 36, 120, 120);
    geo.rotateX(-Math.PI / 2);

    const uniforms = {
      uTime:  { value: 0 },
      uColor: { value: new THREE.Color(...DEFAULT_COLOR) },
    };

    const mat = new THREE.ShaderMaterial({
      vertexShader:   VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      wireframe:   false,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, -2.5, -4);
    scene.add(mesh);

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1, wireframe: true, transparent: true, opacity: 0.06,
    });
    const wireMesh = new THREE.Mesh(geo, wireMat);
    wireMesh.position.copy(mesh.position);
    scene.add(wireMesh);

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Animation
    let raf = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      uniforms.uTime.value = elapsed;

      // カラー補間
      currentCol.current = lerpVec3(currentCol.current, targetCol.current, 0.03);
      uniforms.uColor.value.setRGB(...currentCol.current);
      wireMat.color.setRGB(...currentCol.current);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      wireMat.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}
