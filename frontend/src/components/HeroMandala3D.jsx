import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useAccessibility } from '../context/AccessibilityContext';

export default function HeroMandala3D() {
  const mountRef = useRef(null);
  const { reducedMotion } = useAccessibility();
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    // 1. Check WebGL availability
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
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 2. Three.js Scene & Deep Forest Green Background (#103B30)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x103B30);
    scene.fog = new THREE.FogExp2(0x103B30, 0.016);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 32);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 3. Cinematic Warm Antique Gold & Temple Lighting
    const ambientLight = new THREE.AmbientLight(0x164236, 1.4);
    scene.add(ambientLight);

    // Top warm golden sunlight
    const topSunLight = new THREE.DirectionalLight(0xFDF2B8, 2.4);
    topSunLight.position.set(5, 15, 20);
    scene.add(topSunLight);

    // Dynamic mouse-interactive golden point light that catches 3D petal bevels
    const interactiveLight = new THREE.PointLight(0xE5C378, 2.2, 55);
    interactiveLight.position.set(0, 0, 15);
    scene.add(interactiveLight);

    // Soft rim back-light in temple terracotta
    const rimLight = new THREE.DirectionalLight(0x9E4035, 1.2);
    rimLight.position.set(-15, -10, -5);
    scene.add(rimLight);

    // 4. Procedural 3D Kerala Floral Mandala Construction
    const mandalaMasterGroup = new THREE.Group();
    // Offset slightly upward for optimal hero content balance
    mandalaMasterGroup.position.set(0, 0.8, -2);
    scene.add(mandalaMasterGroup);

    // Materials (Antique Kasavu Gold & Temple Bronze)
    const antiqueGoldMat = new THREE.MeshStandardMaterial({
      color: 0xC9A45C,
      roughness: 0.28,
      metalness: 0.85,
    });

    const polishedGoldMat = new THREE.MeshStandardMaterial({
      color: 0xE8C87A,
      roughness: 0.22,
      metalness: 0.92,
    });

    const bronzeGoldMat = new THREE.MeshStandardMaterial({
      color: 0x967332,
      roughness: 0.42,
      metalness: 0.78,
    });

    // Helper: Create Traditional Kerala Lotus Petal Shape
    const createPetalShape = (length, width, tipCurve = 0.5) => {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      // Left curve to tip
      shape.bezierCurveTo(
        -width * 0.6, length * 0.35,
        -width * tipCurve, length * 0.75,
        0, length
      );
      // Right curve back to base
      shape.bezierCurveTo(
        width * tipCurve, length * 0.75,
        width * 0.6, length * 0.35,
        0, 0
      );
      return shape;
    };

    // LAYER A: Central Bindu & Golden Seed Core
    const coreGroup = new THREE.Group();
    mandalaMasterGroup.add(coreGroup);

    const centerDomeGeo = new THREE.SphereGeometry(1.4, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const centerDome = new THREE.Mesh(centerDomeGeo, polishedGoldMat);
    centerDome.rotation.x = Math.PI / 2;
    centerDome.position.z = 0.4;
    coreGroup.add(centerDome);

    const centerRingGeo = new THREE.TorusGeometry(1.6, 0.12, 16, 32);
    const centerRing = new THREE.Mesh(centerRingGeo, antiqueGoldMat);
    coreGroup.add(centerRing);

    // LAYER B: Inner Ring (8 Ashtadala Padma Lotus Petals)
    const innerRingGroup = new THREE.Group();
    mandalaMasterGroup.add(innerRingGroup);

    const innerPetalShape = createPetalShape(3.8, 1.6, 0.45);
    const innerExtrudeSettings = {
      steps: 1,
      depth: 0.25,
      bevelEnabled: true,
      bevelThickness: 0.14,
      bevelSize: 0.12,
      bevelSegments: 3,
    };
    const innerPetalGeo = new THREE.ExtrudeGeometry(innerPetalShape, innerExtrudeSettings);

    const INNER_COUNT = 8;
    for (let i = 0; i < INNER_COUNT; i++) {
      const angle = (i * Math.PI * 2) / INNER_COUNT;
      const petalMesh = new THREE.Mesh(innerPetalGeo, polishedGoldMat);
      petalMesh.rotation.z = angle - Math.PI / 2;
      // Slight outward dish tilt
      petalMesh.rotation.x = 0.08 * Math.cos(angle);
      petalMesh.rotation.y = 0.08 * Math.sin(angle);
      petalMesh.position.x = Math.cos(angle) * 1.5;
      petalMesh.position.y = Math.sin(angle) * 1.5;
      petalMesh.position.z = 0.2;
      innerRingGroup.add(petalMesh);
    }

    // LAYER C: Middle Ring (16 Filigree Temple Petals & Kasavu Accents)
    const middleRingGroup = new THREE.Group();
    mandalaMasterGroup.add(middleRingGroup);

    const midPetalShape = createPetalShape(5.4, 1.8, 0.35);
    const midExtrudeSettings = {
      steps: 1,
      depth: 0.22,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.1,
      bevelSegments: 3,
    };
    const midPetalGeo = new THREE.ExtrudeGeometry(midPetalShape, midExtrudeSettings);

    const MID_COUNT = 16;
    for (let i = 0; i < MID_COUNT; i++) {
      const angle = (i * Math.PI * 2) / MID_COUNT + Math.PI / MID_COUNT;
      const mat = i % 2 === 0 ? antiqueGoldMat : bronzeGoldMat;
      const petalMesh = new THREE.Mesh(midPetalGeo, mat);
      petalMesh.rotation.z = angle - Math.PI / 2;
      petalMesh.position.x = Math.cos(angle) * 3.6;
      petalMesh.position.y = Math.sin(angle) * 3.6;
      petalMesh.position.z = -0.1;
      middleRingGroup.add(petalMesh);
    }

    // Concentric Beaded Cord (Muthumaala) between Middle & Outer layers
    const beadRingGroup = new THREE.Group();
    mandalaMasterGroup.add(beadRingGroup);

    const beadGeo = new THREE.SphereGeometry(0.18, 12, 12);
    const BEAD_COUNT = 48;
    for (let i = 0; i < BEAD_COUNT; i++) {
      const angle = (i * Math.PI * 2) / BEAD_COUNT;
      const bead = new THREE.Mesh(beadGeo, polishedGoldMat);
      bead.position.set(Math.cos(angle) * 7.4, Math.sin(angle) * 7.4, 0.05);
      beadRingGroup.add(bead);
    }

    // LAYER D: Outer Ring (24 Nalukettu Wooden Rosette Petals & Flourishes)
    const outerRingGroup = new THREE.Group();
    mandalaMasterGroup.add(outerRingGroup);

    const outerPetalShape = createPetalShape(4.8, 1.4, 0.25);
    const outerExtrudeSettings = {
      steps: 1,
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.08,
      bevelSegments: 2,
    };
    const outerPetalGeo = new THREE.ExtrudeGeometry(outerPetalShape, outerExtrudeSettings);

    const OUTER_COUNT = 24;
    for (let i = 0; i < OUTER_COUNT; i++) {
      const angle = (i * Math.PI * 2) / OUTER_COUNT;
      const petalMesh = new THREE.Mesh(outerPetalGeo, antiqueGoldMat);
      petalMesh.rotation.z = angle - Math.PI / 2;
      petalMesh.position.x = Math.cos(angle) * 7.8;
      petalMesh.position.y = Math.sin(angle) * 7.8;
      petalMesh.position.z = -0.3;
      outerRingGroup.add(petalMesh);
    }

    // Outer Concentric Kerala Temple Rings & Kalasam Finial Rays
    const outerTorusGeo1 = new THREE.TorusGeometry(11.2, 0.08, 16, 64);
    const outerTorus1 = new THREE.Mesh(outerTorusGeo1, polishedGoldMat);
    outerTorus1.position.z = -0.4;
    mandalaMasterGroup.add(outerTorus1);

    const outerTorusGeo2 = new THREE.TorusGeometry(12.4, 0.06, 16, 64);
    const outerTorus2 = new THREE.Mesh(outerTorusGeo2, antiqueGoldMat);
    outerTorus2.position.z = -0.45;
    mandalaMasterGroup.add(outerTorus2);

    // 5. Interactive Mouse Parallax & Dynamic Motion
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const onMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseX = nx;
      mouseY = ny;
      targetRotX = -ny * 0.18;
      targetRotY = nx * 0.22;
      interactiveLight.position.x = nx * 14;
      interactiveLight.position.y = ny * 10;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // 6. Animation Loop (Graceful rotation, breathing, zero square particles)
    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Graceful counter-rotations
      innerRingGroup.rotation.z = elapsed * 0.045; // Clockwise
      middleRingGroup.rotation.z = -elapsed * 0.028; // Counter-clockwise
      outerRingGroup.rotation.z = elapsed * 0.018; // Clockwise
      beadRingGroup.rotation.z = -elapsed * 0.015;

      // Subtle 3D breathing wave motion (depth oscillation)
      const breathing = Math.sin(elapsed * 0.9) * 0.35;
      mandalaMasterGroup.position.z = -2 + breathing;

      // Smooth mouse parallax damping
      mandalaMasterGroup.rotation.x += (targetRotX - mandalaMasterGroup.rotation.x) * 0.04;
      mandalaMasterGroup.rotation.y += (targetRotY - mandalaMasterGroup.rotation.y) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      centerDomeGeo.dispose();
      centerRingGeo.dispose();
      innerPetalGeo.dispose();
      midPetalGeo.dispose();
      beadGeo.dispose();
      outerPetalGeo.dispose();
      outerTorusGeo1.dispose();
      outerTorusGeo2.dispose();
      antiqueGoldMat.dispose();
      polishedGoldMat.dispose();
      bronzeGoldMat.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  if (reducedMotion || !webGLSupported) {
    return (
      <div className="absolute inset-0 bg-[#103B30] flex items-center justify-center overflow-hidden">
        {/* Elegant SVG Fallback Mandala */}
        <div className="w-[500px] h-[500px] rounded-full border border-[#C9A45C]/30 flex items-center justify-center opacity-30">
          <div className="w-[360px] h-[360px] rounded-full border border-[#C9A45C]/40 flex items-center justify-center">
            <div className="w-[220px] h-[220px] rounded-full border border-[#C9A45C]/50 flex items-center justify-center">
              <span className="text-6xl text-[#C9A45C]">🪔</span>
            </div>
          </div>
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
