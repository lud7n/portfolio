"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const ACCENT_COLORS: [number, number, number][] = [
  [0.388, 0.400, 0.945], // indigo  #6366f1
  [0.063, 0.725, 0.506], // emerald #10b981
  [0.961, 0.620, 0.043], // amber   #f59e0b
  [0.545, 0.361, 0.965], // violet  #8b5cf6
];
const DEFAULT_COLOR: [number, number, number] = [0.12, 0.14, 0.22];

function lerpVec3(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

const VERT = `
uniform float uTime;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.3; a *= 0.48; }
  return v;
}

varying float vElevation;
varying vec3 vWorldPos;

void main() {
  // 時間でゆっくりうごめく地形
  vec2 uv = vec2(position.x * 0.38, position.z * 0.38) + uTime * 0.018;
  float e = fbm(uv) * 3.2 - 1.6;
  e += fbm(uv * 1.8 + 5.3) * 0.6;
  vElevation = e;

  vec3 pos = position;
  pos.y += e;

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPos = worldPos.xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const FRAG = `
uniform vec3 uColor;

varying float vElevation;
varying vec3 vWorldPos;

void main() {
  // dFdxでフラットシェーディング（ローポリ感の肝）
  vec3 dx = dFdx(vWorldPos);
  vec3 dy = dFdy(vWorldPos);
  vec3 faceNormal = normalize(cross(dx, dy));

  // ライティング
  vec3 lightDir = normalize(vec3(1.5, 3.0, 2.0));
  float diffuse  = max(dot(faceNormal, lightDir), 0.0);
  float ambient  = 0.35;
  float light    = ambient + diffuse * 0.65;

  // 高さで色をブレンド
  float t = clamp((vElevation + 1.8) / 3.6, 0.0, 1.0);
  vec3 dark = vec3(0.03, 0.04, 0.08);
  vec3 col  = mix(dark, uColor, pow(t, 1.4) * 0.9);
  col *= light;

  // 距離フェード（奥ほど消える）
  float dist = length(vWorldPos.xz);
  float fade = 1.0 - smoothstep(10.0, 20.0, dist);

  float alpha = mix(0.08, 0.65, t) * fade;

  gl_FragColor = vec4(col, alpha);
}
`;

export default function ProjectsLowPoly({ hoveredIndex }: { hoveredIndex: number | null }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const currentCol = useRef<[number, number, number]>([...DEFAULT_COLOR]);
  const targetCol  = useRef<[number, number, number]>([...DEFAULT_COLOR]);

  useEffect(() => {
    targetCol.current = hoveredIndex !== null
      ? [...ACCENT_COLORS[hoveredIndex]]
      : [...DEFAULT_COLOR];
  }, [hoveredIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 7, 11);
    camera.lookAt(0, 0, -3);

    // ローポリ感を出すために意図的にセグメント数を抑える
    const geo = new THREE.PlaneGeometry(38, 38, 160, 160);
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
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, -2.5, -3);
    scene.add(mesh);

    // エッジライン（輪郭をシャープに見せる）
    const edgeGeo = new THREE.EdgesGeometry(geo, 15); // 15度以上の角のみ
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.06,
    });
    const edges = new THREE.LineSegments(edgeGeo, edgeMat);
    edges.position.copy(mesh.position);
    scene.add(edges);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      uniforms.uTime.value = elapsed;

      // カラー補間
      currentCol.current = lerpVec3(currentCol.current, targetCol.current, 0.04);
      uniforms.uColor.value.setRGB(...currentCol.current);
      (edgeMat.color as THREE.Color).setRGB(...currentCol.current);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geo.dispose();
      edgeGeo.dispose();
      mat.dispose();
      edgeMat.dispose();
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
