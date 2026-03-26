import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

export default function NeuralBackground({allowClick = true}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance" 
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimasi performa
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // --- BLOOM EFFECT (GLOW) ---
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.8, 0.5, 0.1
    );
    composer.addPass(bloomPass);

    // --- PARTICLES SETUP ---
    const nodeCount = 150;
    const positions = new Float32Array(nodeCount * 3);
    const velocities = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      velocities[i * 3] = (Math.random() - 0.5) * 0.2;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.8,
      color: 0x00f2ff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- LINES SETUP ---
    const lineMat = new THREE.LineBasicMaterial({ color: 0x0044ff, transparent: true, opacity: 0.3 });
    const lineGeo = new THREE.BufferGeometry();
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineMesh);

    // --- INTERACTION LOGIC ---
    const mouse = new THREE.Vector2();
    const targetMouse = new THREE.Vector2();

    const handleMouseMove = (e) => {
      targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleMouseDown = () => {
      if (!allowClick) return;
      // Efek Ledakan: Tambah kecepatan secara instan
      const pos = geometry.attributes.position.array;
      for (let i = 0; i < nodeCount; i++) {
        velocities[i * 3] += (Math.random() - 0.5) * 2;
        velocities[i * 3 + 1] += (Math.random() - 0.5) * 2;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);

    // --- ANIMATION ---
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Smooth Camera Movement
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;
      camera.position.x += (mouse.x * 15 - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 15 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      const pos = geometry.attributes.position.array;
      const lines = [];

      for (let i = 0; i < nodeCount; i++) {
        const i3 = i * 3;
        
        // Update Posisi
        pos[i3] += velocities[i3];
        pos[i3+1] += velocities[i3+1];
        pos[i3+2] += velocities[i3+2];

        // Friction (agar ledakan melambat kembali)
        velocities[i3] *= 0.98;
        velocities[i3+1] *= 0.98;
        velocities[i3+2] *= 0.98;

        // Boundary (Tetap di dalam area)
        if (Math.abs(pos[i3]) > 60) velocities[i3] *= -1;
        if (Math.abs(pos[i3+1]) > 60) velocities[i3+1] *= -1;

        // Cari tetangga untuk tarik garis
        for (let j = i + 1; j < nodeCount; j++) {
          const j3 = j * 3;
          const dist = Math.hypot(pos[i3]-pos[j3], pos[i3+1]-pos[j3+1], pos[i3+2]-pos[j3+2]);
          if (dist < 15) {
            lines.push(pos[i3], pos[i3+1], pos[i3+2], pos[j3], pos[j3+1], pos[j3+2]);
          }
        }
      }

      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3));
      geometry.attributes.position.needsUpdate = true;
      composer.render();
    };

    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [allowClick]);

  return <div ref={mountRef} className="fixed inset-0 w-full h-full bg-black block" />;
}