import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useAccessibility } from '../context/AccessibilityContext';

export default function Hero3DCanvas({ onEnterClick }) {
  const mountRef = useRef(null);
  const { reducedMotion } = useAccessibility();
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch (e) {
      setWebGLSupported(false);
      return;
    }

    if (reducedMotion || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x123B32); // Deep green #123B32
    scene.fog = new THREE.FogExp2(0x123B32, 0.015);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 2, 42);

    // 2. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Lighting (Atmospheric golden sunlight pouring through doorway)
    const ambientLight = new THREE.AmbientLight(0x244238, 1.2);
    scene.add(ambientLight);

    // Golden sunbeam from beyond the doorway
    const sunLight = new THREE.DirectionalLight(0xF4D06F, 3.5);
    sunLight.position.set(0, 15, -25);
    sunLight.target.position.set(0, 2, 0);
    scene.add(sunLight);
    scene.add(sunLight.target);

    // Front soft fill light
    const fillLight = new THREE.PointLight(0xC6A15B, 1.8, 60);
    fillLight.position.set(0, 4, 18);
    scene.add(fillLight);

    // 4. Architectural Kerala Nalukettu Doorway
    const doorwayGroup = new THREE.Group();
    scene.add(doorwayGroup);

    // Materials
    const teakWoodMaterial = new THREE.MeshStandardMaterial({
      color: 0x4A2E1B,
      roughness: 0.75,
      metalness: 0.1,
    });

    const darkTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0x2C1810,
      roughness: 0.85,
    });

    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xD4AA50,
      roughness: 0.35,
      metalness: 0.8,
    });

    // Outer Door Frame Pillars (Carved Teakwood)
    const pillarGeo = new THREE.BoxGeometry(2.2, 16, 2.5);
    const leftPillar = new THREE.Mesh(pillarGeo, teakWoodMaterial);
    leftPillar.position.set(-7.5, 5, 0);
    doorwayGroup.add(leftPillar);

    const rightPillar = new THREE.Mesh(pillarGeo, teakWoodMaterial);
    rightPillar.position.set(7.5, 5, 0);
    doorwayGroup.add(rightPillar);

    // Top Carved Lintel Beam (Nalukettu Mukappu)
    const lintelGeo = new THREE.BoxGeometry(18, 2.8, 3.2);
    const lintel = new THREE.Mesh(lintelGeo, teakWoodMaterial);
    lintel.position.set(0, 14, 0);
    doorwayGroup.add(lintel);

    // Ornamental Roof Eaves (Traditional Kerala Charthu)
    const eavesGeo = new THREE.ConeGeometry(13, 3, 4);
    const eaves = new THREE.Mesh(eavesGeo, darkTrimMaterial);
    eaves.position.set(0, 16.5, 0);
    eaves.rotation.y = Math.PI / 4;
    doorwayGroup.add(eaves);

    // Threshold Stone (Vathilpadi)
    const thresholdGeo = new THREE.BoxGeometry(17, 1.2, 4);
    const threshold = new THREE.Mesh(thresholdGeo, darkTrimMaterial);
    threshold.position.set(0, -3.4, 0);
    doorwayGroup.add(threshold);

    // Left Door Leaf (with Hinge Pivot)
    const leftDoorPivot = new THREE.Group();
    leftDoorPivot.position.set(-6.4, 5, 0);
    doorwayGroup.add(leftDoorPivot);

    const doorLeafGeo = new THREE.BoxGeometry(6.3, 14.8, 0.7);
    const leftDoorMesh = new THREE.Mesh(doorLeafGeo, teakWoodMaterial);
    leftDoorMesh.position.set(3.15, 0, 0);
    leftDoorPivot.add(leftDoorMesh);

    // Right Door Leaf (with Hinge Pivot)
    const rightDoorPivot = new THREE.Group();
    rightDoorPivot.position.set(6.4, 5, 0);
    doorwayGroup.add(rightDoorPivot);

    const rightDoorMesh = new THREE.Mesh(doorLeafGeo, teakWoodMaterial);
    rightDoorMesh.position.set(-3.15, 0, 0);
    rightDoorPivot.add(rightDoorMesh);

    // Brass Studs & Ring Handles on Wooden Doors
    const studGeo = new THREE.SphereGeometry(0.22, 12, 12);
    for (let y = -5; y <= 5; y += 2.5) {
      // Left door brass studs
      const studL = new THREE.Mesh(studGeo, brassMaterial);
      studL.position.set(5.2, y, 0.45);
      leftDoorPivot.add(studL);

      // Right door brass studs
      const studR = new THREE.Mesh(studGeo, brassMaterial);
      studR.position.set(-5.2, y, 0.45);
      rightDoorPivot.add(studR);
    }

    // Door Knocker Rings (Manichithrathazhu motif)
    const knockerGeo = new THREE.TorusGeometry(0.65, 0.14, 16, 32);
    const knockerL = new THREE.Mesh(knockerGeo, brassMaterial);
    knockerL.position.set(4.8, 0, 0.55);
    leftDoorPivot.add(knockerL);

    const knockerR = new THREE.Mesh(knockerGeo, brassMaterial);
    knockerR.position.set(-4.8, 0, 0.55);
    rightDoorPivot.add(knockerR);

    // Golden Sunlight Ray Cone radiating from inside
    const rayGeo = new THREE.CylinderGeometry(0.5, 14, 30, 32, 1, true);
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0xF4D06F,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const rayCone = new THREE.Mesh(rayGeo, rayMat);
    rayCone.position.set(0, 5, 5);
    rayCone.rotation.x = Math.PI / 2;
    scene.add(rayCone);

    // 5. Floating Golden Dust Particles (Atmospheric Sunlight Motes)
    const particleCount = 350;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30 + 5;
      positions[i * 3 + 2] = Math.random() * 40 - 10;
      scales[i] = Math.random() * 2 + 0.8;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const particleMat = new THREE.PointsMaterial({
      color: 0xF4D06F,
      size: 1.8,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const dustParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(dustParticles);

    // 6. Interactive Parallax & Animation Loop
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gracefully swing open the wooden doors over the first 5 seconds
      const doorOpenProgress = Math.min(elapsed / 3.8, 1.0);
      // Smooth cubic easing for door opening
      const easeDoor = 1 - Math.pow(1 - doorOpenProgress, 3);
      leftDoorPivot.rotation.y = -easeDoor * 1.45; // Swing inwards/backwards
      rightDoorPivot.rotation.y = easeDoor * 1.45;

      // Camera slowly glides towards the entrance
      const targetZ = 42 - easeDoor * 10;
      camera.position.z += (targetZ - camera.position.z) * 0.03;

      // Mouse parallax
      camera.position.x += (mouseX * 4 - camera.position.x) * 0.04;
      camera.position.y += ((mouseY * 2.5 + 2) - camera.position.y) * 0.04;
      camera.lookAt(0, 4.5, 0);

      // Subtle pulse on sunlight rays
      rayMat.opacity = 0.16 + Math.sin(elapsed * 1.5) * 0.05;

      // Gentle drift of dust motes
      const posAttr = particleGeo.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        let y = posAttr.getY(i);
        y += 0.025;
        if (y > 22) y = -8;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      teakWoodMaterial.dispose();
      darkTrimMaterial.dispose();
      brassMaterial.dispose();
      particleMat.dispose();
      particleGeo.dispose();
      rayMat.dispose();
      rayGeo.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  if (reducedMotion || !webGLSupported) {
    return (
      <div className="absolute inset-0 bg-[#123B32] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#123B32] via-[#1a4a40] to-[#123B32]" />
        <div className="relative z-10 text-center p-8 space-y-4 max-w-lg">
          <div className="text-6xl mb-2">🪔</div>
          <h2 className="font-serif font-black text-3xl text-[#F7F0DF] tracking-widest">
            THE NALUKETTU ENTRANCE
          </h2>
          <p className="text-xs text-[#F7F0DF]/80 font-sans leading-relaxed">
            Step through the threshold of God’s Own Country into the living universe of Kerala’s heritage.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ touchAction: 'none' }}
      aria-hidden="true"
    />
  );
}
