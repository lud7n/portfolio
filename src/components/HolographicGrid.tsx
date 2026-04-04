"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const COLS = 20;
const ROWS = 26;
const HALF_W = 70;
const DEPTH = 110;
const ROW_SPACING = DEPTH / ROWS;

const V_SHADER = `
  varying float vDist;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vDist = length(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const F_SHADER = `
  varying float vDist;
  void main() {
    float fade = smoothstep(12.0, 22.0, vDist) * (1.0 - smoothstep(72.0, 110.0, vDist));
    float t = clamp((vDist - 18.0) / 70.0, 0.0, 1.0);
    vec3 col = mix(vec3(0.47, 0.41, 0.98), vec3(0.10, 0.75, 0.95), t);
    gl_FragColor = vec4(col, fade * 0.45);
  }
`;

export default function HolographicGrid() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth || window.innerWidth;
    const H = mount.clientHeight || window.innerHeight * 0.55;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, W / H, 0.1, 400);
    const BASE = new THREE.Vector3(0, 10, 16);
    const LOOK = new THREE.Vector3(0, 0, -18);
    camera.position.copy(BASE);
    camera.lookAt(LOOK);

    const makeMat = () =>
      new THREE.ShaderMaterial({
        vertexShader: V_SHADER,
        fragmentShader: F_SHADER,
        transparent: true,
        depthWrite: false,
      });

    // ── Column lines (static, run to depth) ──
    const colArr: number[] = [];
    for (let i = 0; i <= COLS; i++) {
      const x = -HALF_W + (HALF_W * 2 / COLS) * i;
      colArr.push(x, 0, 2,  x, 0, -DEPTH);
    }
    const colGeo = new THREE.BufferGeometry();
    colGeo.setAttribute("position", new THREE.Float32BufferAttribute(colArr, 3));
    const colMat = makeMat();
    scene.add(new THREE.LineSegments(colGeo, colMat));

    // ── Row lines (animated, flow toward camera) ──
    const rowArr = new Float32Array(ROWS * 6);
    for (let i = 0; i < ROWS; i++) {
      const z = -(i * ROW_SPACING);
      rowArr[i * 6]     = -HALF_W; rowArr[i * 6 + 1] = 0; rowArr[i * 6 + 2] = z;
      rowArr[i * 6 + 3] =  HALF_W; rowArr[i * 6 + 4] = 0; rowArr[i * 6 + 5] = z;
    }
    const rowGeo = new THREE.BufferGeometry();
    rowGeo.setAttribute("position", new THREE.BufferAttribute(rowArr, 3));
    const rowMat = makeMat();
    scene.add(new THREE.LineSegments(rowGeo, rowMat));

    // ── Input handlers ──
    let mx = 0, my = 0, smx = 0, smy = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * -8;
      my = (e.clientY / window.innerHeight - 0.5) *  5;
    };
    window.addEventListener("mousemove", onMouse);

    let scrollVel = 0, lastSY = window.scrollY;
    const onScroll = () => {
      scrollVel += (window.scrollY - lastSY) * 0.05;
      lastSY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ──
    let raf = 0;
    let flow = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);

      // Smooth camera shift from mouse
      smx += (mx - smx) * 0.05;
      smy += (my - smy) * 0.05;
      camera.position.set(BASE.x + smx, BASE.y + smy, BASE.z);
      camera.lookAt(LOOK);

      // Row flow (base speed + scroll boost)
      scrollVel *= 0.88;
      flow += 0.018 + scrollVel;

      const arr = rowGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < ROWS; i++) {
        let z = -(i * ROW_SPACING) + flow;
        // Seamless wrap: keep z in (-DEPTH, +2)
        if (z >= 2)     z -= DEPTH;
        if (z < -DEPTH) z += DEPTH;
        arr[i * 6 + 2] = z;
        arr[i * 6 + 5] = z;
      }
      rowGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      colGeo.dispose(); colMat.dispose();
      rowGeo.dispose(); rowMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "55%",
        zIndex: 2,
        pointerEvents: "none",
      }}
    />
  );
}
