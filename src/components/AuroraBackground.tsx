"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;

// Smooth noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                 + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
               dot(x12.zw,x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;

  // カーソルによる歪み
  vec2 mouseInfluence = (uMouse - 0.5) * 0.12;
  uv += mouseInfluence * (1.0 - length(uv - 0.5));

  float t = uTime * 0.18;

  // 複数レイヤーのノイズでオーロラ形状を作る
  float n1 = snoise(vec2(uv.x * 1.8 + t * 0.6,  uv.y * 1.2 - t * 0.3));
  float n2 = snoise(vec2(uv.x * 2.4 - t * 0.4,  uv.y * 2.0 + t * 0.5));
  float n3 = snoise(vec2(uv.x * 0.9 + t * 0.2,  uv.y * 3.0 - t * 0.7));

  float noise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

  // オーロラは上部に集中させる
  float aurora = smoothstep(0.0, 1.0, 1.0 - uv.y) * 0.6;
  aurora += smoothstep(0.3, 0.8, uv.y) * 0.15; // 下にも少し
  aurora *= (noise * 0.5 + 0.5);

  // 3色のオーロラ（indigo / violet / cyan）
  vec3 col1 = vec3(0.38, 0.40, 0.98); // indigo
  vec3 col2 = vec3(0.55, 0.36, 0.98); // violet
  vec3 col3 = vec3(0.14, 0.78, 0.95); // cyan

  float blend1 = snoise(vec2(uv.x * 1.5 + t, 0.5)) * 0.5 + 0.5;
  float blend2 = snoise(vec2(uv.x * 1.2 - t * 0.8, 0.8)) * 0.5 + 0.5;

  vec3 auroraColor = mix(col1, col2, blend1);
  auroraColor = mix(auroraColor, col3, blend2 * 0.4);

  // ベース背景色（深い宇宙）
  vec3 bg = vec3(0.04, 0.03, 0.07);

  // vignette
  float vignette = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5) * 1.6);

  vec3 finalColor = bg + auroraColor * aurora * 0.75 * vignette;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export default function AuroraBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime:  { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    // カーソル追従（lerp でなめらかに）
    let targetX = 0.5, targetY = 0.5;
    let currentX = 0.5, currentY = 0.5;
    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX / window.innerWidth;
      targetY = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMouseMove);

    // リサイズ
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      uniforms.uTime.value = clock.getElapsedTime();

      // マウス lerp
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;
      uniforms.uMouse.value.set(currentX, currentY);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
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
