import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useAccessibility } from '../context/AccessibilityContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CinematicDoorIntro({ onComplete, isReplay = false }) {
  const mountRef = useRef(null);
  const { reducedMotion } = useAccessibility();
  const { language } = useLanguage();
  const [stage, setStage] = useState('dark'); // 'dark' -> 'lighting' -> 'opening' -> 'revealed' -> 'complete'
  const [fadingOut, setFadingOut] = useState(false);
  const animRef = useRef({ time: 0, completed: false });

  // Handle immediate skip or completion
  const handleSkip = () => {
    if (animRef.current.completed) return;
    animRef.current.completed = true;
    try {
      sessionStorage.setItem('oorvex_door_intro_seen', 'true');
    } catch (e) {
      // Ignore storage errors
    }
    setFadingOut(true);
    setTimeout(() => {
      onComplete?.();
    }, 600);
  };

  useEffect(() => {
    // If user prefers reduced motion, skip intro immediately
    if (reducedMotion) {
      try {
        sessionStorage.setItem('oorvex_door_intro_seen', 'true');
      } catch (e) {}
      onComplete?.();
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene, Camera, & Depth Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x081714);
    scene.fog = new THREE.FogExp2(0x081714, 0.018);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 36);

    // 2. WebGL Renderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
    } catch (e) {
      // WebGL not available
      handleSkip();
      return;
    }

    // 3. Materials
    // Rich aged Kerala Teakwood
    const teakWoodMat = new THREE.MeshStandardMaterial({
      color: 0x3d2112,
      roughness: 0.72,
      metalness: 0.08,
    });

    const darkTimberMat = new THREE.MeshStandardMaterial({
      color: 0x22130a,
      roughness: 0.85,
    });

    // Antique Brass for Manichithrathazhu and Studs
    const antiqueBrassMat = new THREE.MeshStandardMaterial({
      color: 0xD4A745,
      roughness: 0.32,
      metalness: 0.88,
    });

    const templeStoneMat = new THREE.MeshStandardMaterial({
      color: 0x1A1410,
      roughness: 0.95,
    });

    // 4. Architectural Nalukettu Doorway Structure
    const doorway = new THREE.Group();
    scene.add(doorway);

    // Stone Threshold (Vathilpadi)
    const thresholdGeo = new THREE.BoxGeometry(16, 1.4, 4.5);
    const threshold = new THREE.Mesh(thresholdGeo, templeStoneMat);
    threshold.position.set(0, -5.8, 0);
    threshold.receiveShadow = true;
    doorway.add(threshold);

    // Left & Right Carved Door Frame Pillars (Utharam pillars)
    const pillarGeo = new THREE.BoxGeometry(2.2, 14.5, 2.6);
    const leftPillar = new THREE.Mesh(pillarGeo, teakWoodMat);
    leftPillar.position.set(-6.8, 1.8, 0);
    leftPillar.castShadow = true;
    leftPillar.receiveShadow = true;
    doorway.add(leftPillar);

    const rightPillar = new THREE.Mesh(pillarGeo, teakWoodMat);
    rightPillar.position.set(6.8, 1.8, 0);
    rightPillar.castShadow = true;
    rightPillar.receiveShadow = true;
    doorway.add(rightPillar);

    // Decorative pillar trims (stepped bases & capitals)
    const trimGeo = new THREE.BoxGeometry(2.6, 0.6, 2.9);
    [-5.0, 8.8].forEach((y) => {
      const trimL = new THREE.Mesh(trimGeo, darkTimberMat);
      trimL.position.set(-6.8, y, 0);
      doorway.add(trimL);

      const trimR = new THREE.Mesh(trimGeo, darkTimberMat);
      trimR.position.set(6.8, y, 0);
      doorway.add(trimR);
    });

    // Top Carved Lintel (Mukappu)
    const lintelGeo = new THREE.BoxGeometry(16.5, 2.4, 3.2);
    const lintel = new THREE.Mesh(lintelGeo, teakWoodMat);
    lintel.position.set(0, 9.8, 0);
    lintel.castShadow = true;
    lintel.receiveShadow = true;
    doorway.add(lintel);

    // Traditional Kerala Roof Eaves Canopy (Charthu)
    const eavesGeo = new THREE.ConeGeometry(12, 2.8, 4);
    const eaves = new THREE.Mesh(eavesGeo, darkTimberMat);
    eaves.position.set(0, 11.9, 0);
    eaves.rotation.y = Math.PI / 4;
    doorway.add(eaves);

    // 5. Wooden Door Leaves (with Pivot Hinges)
    const doorLeafGeo = new THREE.BoxGeometry(5.7, 13.8, 0.7);
    
    // Left Door Pivot
    const leftDoorPivot = new THREE.Group();
    leftDoorPivot.position.set(-5.7, 1.8, 0);
    doorway.add(leftDoorPivot);

    const leftDoor = new THREE.Mesh(doorLeafGeo, teakWoodMat);
    leftDoor.position.set(2.85, 0, 0);
    leftDoor.castShadow = true;
    leftDoorPivot.add(leftDoor);

    // Right Door Pivot
    const rightDoorPivot = new THREE.Group();
    rightDoorPivot.position.set(5.7, 1.8, 0);
    doorway.add(rightDoorPivot);

    const rightDoor = new THREE.Mesh(doorLeafGeo, teakWoodMat);
    rightDoor.position.set(-2.85, 0, 0);
    rightDoor.castShadow = true;
    rightDoorPivot.add(rightDoor);

    // Door Panel Carved Reliefs (Vertical Inner Moldings)
    const panelMoldingGeo = new THREE.BoxGeometry(4.6, 5.8, 0.18);
    [-3.2, 3.2].forEach((py) => {
      // Left door moldings
      const moldL = new THREE.Mesh(panelMoldingGeo, darkTimberMat);
      moldL.position.set(2.85, py, 0.4);
      leftDoorPivot.add(moldL);

      // Right door moldings
      const moldR = new THREE.Mesh(panelMoldingGeo, darkTimberMat);
      moldR.position.set(-2.85, py, 0.4);
      rightDoorPivot.add(moldR);
    });

    // 6. Traditional Kerala Brass Lock (Manichithrathazhu Motif)
    // Central ornate brass lock plates on both doors
    const lockPlateGeo = new THREE.BoxGeometry(1.4, 2.6, 0.16);
    const lockL = new THREE.Mesh(lockPlateGeo, antiqueBrassMat);
    lockL.position.set(5.0, 0.6, 0.5);
    leftDoorPivot.add(lockL);

    const lockR = new THREE.Mesh(lockPlateGeo, antiqueBrassMat);
    lockR.position.set(-5.0, 0.6, 0.5);
    rightDoorPivot.add(lockR);

    // Brass Hanging Pull Rings
    const ringGeo = new THREE.TorusGeometry(0.55, 0.12, 16, 32);
    const ringL = new THREE.Mesh(ringGeo, antiqueBrassMat);
    ringL.position.set(4.4, 0.6, 0.68);
    leftDoorPivot.add(ringL);

    const ringR = new THREE.Mesh(ringGeo, antiqueBrassMat);
    ringR.position.set(-4.4, 0.6, 0.68);
    rightDoorPivot.add(ringR);

    // Brass Decorative Studs along the stiles
    const studGeo = new THREE.SphereGeometry(0.18, 12, 12);
    for (let y = -4.5; y <= 5.5; y += 2.2) {
      const studL1 = new THREE.Mesh(studGeo, antiqueBrassMat);
      studL1.position.set(0.9, y, 0.45);
      leftDoorPivot.add(studL1);

      const studL2 = new THREE.Mesh(studGeo, antiqueBrassMat);
      studL2.position.set(4.8, y, 0.45);
      leftDoorPivot.add(studL2);

      const studR1 = new THREE.Mesh(studGeo, antiqueBrassMat);
      studR1.position.set(-0.9, y, 0.45);
      rightDoorPivot.add(studR1);

      const studR2 = new THREE.Mesh(studGeo, antiqueBrassMat);
      studR2.position.set(-4.8, y, 0.45);
      rightDoorPivot.add(studR2);
    }

    // 7. Nilavilakku (Traditional Oil Lamp) & Lighting Sequence
    // Ambient baseline (starts nearly dark)
    const ambientLight = new THREE.AmbientLight(0x081714, 0.2);
    scene.add(ambientLight);

    // Foreground Nilavilakku flame point light (glows warm amber/gold)
    const lampLight = new THREE.PointLight(0xFFAA44, 0.05, 45, 1.8);
    lampLight.position.set(0, -3.2, 8.5);
    lampLight.castShadow = true;
    scene.add(lampLight);

    // Volumetric warm sunbeam/inner glow behind the doorway
    const innerLight = new THREE.DirectionalLight(0xF4D06F, 0.01);
    innerLight.position.set(0, 8, -25);
    innerLight.target.position.set(0, 1.8, 0);
    scene.add(innerLight);
    scene.add(innerLight.target);

    // Soft warm golden fill from inside
    const sanctuaryLight = new THREE.PointLight(0xC9A45C, 0.01, 60);
    sanctuaryLight.position.set(0, 3, -8);
    scene.add(sanctuaryLight);

    // Radiant sunbeam cone behind doors
    const beamGeo = new THREE.CylinderGeometry(0.8, 18, 35, 32, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xF4D06F,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const sunBeam = new THREE.Mesh(beamGeo, beamMat);
    sunBeam.position.set(0, 2, -2);
    sunBeam.rotation.x = Math.PI / 2;
    scene.add(sunBeam);

    // 8. Animation Clock and Loop
    const clock = new THREE.Clock();
    let animId;

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // Keyboard listener for Escape key to skip
    const onKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      animRef.current.time = elapsed;

      // Realistic Nilavilakku lamp flicker
      const flicker = 1.0 + Math.sin(elapsed * 12.0) * 0.04 + Math.cos(elapsed * 23.0) * 0.02;

      // STAGE 1: Slowly illuminate the doorway with warm oil lamp glow (0.0s to 1.6s)
      if (elapsed < 1.6) {
        const lightProgress = Math.min(elapsed / 1.4, 1.0);
        // Smooth exponential ramp
        lampLight.intensity = (0.1 + lightProgress * 3.2) * flicker;
        ambientLight.intensity = 0.2 + lightProgress * 0.6;
        if (stage !== 'lighting') setStage('lighting');
      } 
      // STAGE 2: Doors swing open outward in 3D perspective (1.6s to 4.2s)
      else if (elapsed >= 1.6 && elapsed < 4.2) {
        const doorProgress = Math.min((elapsed - 1.6) / 2.3, 1.0);
        // Smooth cubic ease-in-out
        const ease = doorProgress < 0.5 
          ? 4 * doorProgress * doorProgress * doorProgress 
          : 1 - Math.pow(-2 * doorProgress + 2, 3) / 2;

        leftDoorPivot.rotation.y = -ease * 1.55; // Open outward/backwards
        rightDoorPivot.rotation.y = ease * 1.55;

        // Inner sanctuary golden light pours through
        innerLight.intensity = ease * 3.8;
        sanctuaryLight.intensity = ease * 2.8;
        beamMat.opacity = ease * 0.24;

        // Camera smoothly tracks closer to threshold
        camera.position.z = 36 - ease * 11.0;
        camera.position.y = 1.2 + ease * 0.6;

        if (doorProgress > 0.35 && stage !== 'opening') {
          setStage('opening');
        }
      }
      // STAGE 3: Title and Tagline revealed inside the light (4.2s to 5.6s)
      else if (elapsed >= 4.2 && elapsed < 5.8) {
        if (stage !== 'revealed') setStage('revealed');
        // Gentle continued camera glide
        camera.position.z -= 0.035;
        beamMat.opacity = 0.24 + Math.sin(elapsed * 2.0) * 0.04;
      }
      // STAGE 4: Smooth transition to main homepage
      else if (elapsed >= 5.8) {
        handleSkip();
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKeyDown);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      thresholdGeo.dispose();
      pillarGeo.dispose();
      trimGeo.dispose();
      lintelGeo.dispose();
      eavesGeo.dispose();
      doorLeafGeo.dispose();
      panelMoldingGeo.dispose();
      lockPlateGeo.dispose();
      ringGeo.dispose();
      studGeo.dispose();
      beamGeo.dispose();
      beamMat.dispose();
      teakWoodMat.dispose();
      darkTimberMat.dispose();
      antiqueBrassMat.dispose();
      templeStoneMat.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#081714] flex items-center justify-center overflow-hidden transition-opacity duration-700 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      aria-label="Ancient Kerala Nalukettu Doorway Opening Experience"
      role="region"
    >
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Cinematic Golden Ambient Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-[#081714]/40 to-[#081714]/90" />

      {/* Skip Intro Button (Kasavu Gold with Blur) */}
      <div className="absolute top-6 right-6 z-30">
        <button
          onClick={handleSkip}
          className="px-4 py-2 rounded-full bg-[#103B30]/85 hover:bg-[#31543E] border border-[#C9A45C]/70 text-[#F6F0E4] hover:text-[#C9A45C] text-xs font-sans font-semibold tracking-wider uppercase transition-all backdrop-blur-md shadow-kasavu flex items-center space-x-2 group"
          title="Skip intro to enter OORVEX directly"
        >
          <span>{language === 'ml' ? 'ആമുഖം ഒഴിവാക്കുക' : 'Skip Intro'}</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#C9A45C] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Replay Indicator / Keyboard Hint */}
      <div className="absolute bottom-6 left-6 z-30 hidden sm:block text-[11px] text-[#F6F0E4]/60 font-sans tracking-wide">
        <span>{language === 'ml' ? 'സ്കിപ്പ് ചെയ്യാൻ Esc അല്ലെങ്കിൽ ബട്ടൺ അമർത്തുക' : 'Press Esc or click Skip to enter'}</span>
      </div>

      {/* Title & Tagline Emergence Through the Open Doorway */}
      {(stage === 'opening' || stage === 'revealed') && (
        <div className="relative z-20 text-center max-w-3xl mx-auto px-4 pointer-events-none animate-fadeIn space-y-4">
          
          {/* Sacred Lamp Emblem */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#103B30]/80 border border-[#C9A45C]/50 text-[#C9A45C] text-xs font-serif shadow-lg backdrop-blur-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span className="tracking-widest uppercase">
              {language === 'ml' ? 'കേരള സാംസ്കാരിക പ്രപഞ്ചം' : 'Ancient Kerala Cultural Sanctuary'}
            </span>
          </div>

          {/* Majestic Golden Title with Light Reveal */}
          <h1 className="font-serif font-black text-6xl sm:text-8xl md:text-9xl tracking-widest text-[#F6F0E4] drop-shadow-[0_10px_35px_rgba(201,164,92,0.45)]">
            <span className="bg-gradient-to-b from-[#FFFDF6] via-[#F4D06F] to-[#C9A45C] bg-clip-text text-transparent">
              OORVEX
            </span>
          </h1>

          {/* Revealed Tagline */}
          <div className="space-y-1">
            <p className="font-serif italic text-xl sm:text-3xl text-[#C9A45C] font-semibold tracking-wide drop-shadow-md">
              Mapping Heritage. Connecting Generations.
            </p>
            <p className="text-xs sm:text-sm text-[#F6F0E4]/85 font-malayalam tracking-wider pt-1">
              {language === 'ml'
                ? 'പൈതൃകത്തെ അടയാളപ്പെടുത്തുന്നു. തലമുറകളെ കൂട്ടിയിണക്കുന്നു.'
                : 'The Living Digital Culture Map of Kerala'}
            </p>
          </div>

          {/* Enter Button Prompt */}
          <div className="pt-6 pointer-events-auto">
            <button
              onClick={handleSkip}
              className="px-8 py-3.5 rounded-full bg-[#C9A45C] hover:bg-[#B28E46] text-[#103B30] font-sans font-bold text-xs tracking-widest uppercase shadow-kasavu transition-all transform hover:scale-105 inline-flex items-center space-x-2"
            >
              <span>{language === 'ml' ? 'പൈതൃകത്തിലേക്ക് കടക്കാം' : 'Enter the Heritage'}</span>
              <ArrowRight className="w-4 h-4 text-[#103B30]" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
