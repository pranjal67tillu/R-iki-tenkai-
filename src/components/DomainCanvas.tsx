/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { DomainDefinition } from '../data/domains';

interface DomainCanvasProps {
  domain: DomainDefinition;
  barrierExpanded: boolean;
  barrierRadius: number; // 5 to 200
  showBarrierShell: boolean;
  sureHitTriggered: boolean;
  cameraPreset: 'orbit' | 'inside' | 'cinematic' | 'top';
  onCanvasReady?: () => void;
}

export const DomainCanvas: React.FC<DomainCanvasProps> = ({
  domain,
  barrierExpanded,
  barrierRadius,
  showBarrierShell,
  sureHitTriggered,
  cameraPreset,
  onCanvasReady
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    domain,
    barrierExpanded,
    barrierRadius,
    showBarrierShell,
    sureHitTriggered,
    cameraPreset
  });

  // Keep stateRef in sync without triggering full Three.js scene remount
  stateRef.current = {
    domain,
    barrierExpanded,
    barrierRadius,
    showBarrierShell,
    sureHitTriggered,
    cameraPreset
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL per Three.js guidelines
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(domain.palette.ambient);
    scene.fog = new THREE.FogExp2(domain.palette.ambient, 0.015);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 15, 38);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Warm Key Light & Cool Fill Light
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(25, 45, 20);
    dirLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 150;
      dirLight.shadow.camera.left = -30;
      dirLight.shadow.camera.right = 30;
      dirLight.shadow.camera.top = 30;
      dirLight.shadow.camera.bottom = -30;
      dirLight.shadow.bias = -0.0005;
    }
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(
      new THREE.Color(domain.palette.primary).multiplyScalar(0.8),
      new THREE.Color(domain.palette.ambient),
      1.2
    );
    scene.add(hemiLight);

    // Dynamic Domain Root Group
    const domainGroup = new THREE.Group();
    scene.add(domainGroup);

    // Barrier Spherical / Cylindrical Boundary Mesh
    const barrierGeo = new THREE.SphereGeometry(1, 32, 24);
    const barrierMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(domain.palette.primary),
      emissive: new THREE.Color(domain.palette.primary),
      emissiveIntensity: 0.35,
      metalness: 0.1,
      roughness: 0.2,
      transparent: true,
      opacity: 0.35,
      wireframe: true,
      depthWrite: false
    });
    const barrierMesh = new THREE.Mesh(barrierGeo, barrierMat);
    barrierMesh.position.set(0, 0, 0);
    domainGroup.add(barrierMesh);

    // Internal Domain Specific Groups
    let specificContentGroup = new THREE.Group();
    domainGroup.add(specificContentGroup);

    // Procedural Particle System (Cursed energy particles)
    const particleCount = isSoftwareGl ? 300 : 1200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 5 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = Math.random() * 20 - 2;
      particlePositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      particleSpeeds[i] = 0.2 + Math.random() * 0.8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(domain.palette.accent),
      size: 0.35,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    domainGroup.add(particles);

    // Slashes group for Malevolent Shrine
    const slashLinesGroup = new THREE.Group();
    domainGroup.add(slashLinesGroup);

    // Build specific domain geometries
    function buildDomainInterior(currentDomain: DomainDefinition) {
      // Clean previous content
      while (specificContentGroup.children.length > 0) {
        const obj = specificContentGroup.children[0];
        specificContentGroup.remove(obj);
        if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
      }

      scene.background = new THREE.Color(currentDomain.palette.ambient);
      scene.fog = new THREE.FogExp2(currentDomain.palette.ambient, 0.015);
      barrierMat.color.set(currentDomain.palette.primary);
      barrierMat.emissive.set(currentDomain.palette.primary);
      particleMat.color.set(currentDomain.palette.accent);
      hemiLight.color.set(new THREE.Color(currentDomain.palette.primary).multiplyScalar(0.8));

      const preset = currentDomain.preset3D;

      if (preset === 'unlimited_void') {
        // Unlimited Void: Central black hole singularity, cosmic concentric rings, eye of infinity
        const coreGeo = new THREE.SphereGeometry(3.5, 32, 32);
        const coreMat = new THREE.MeshBasicMaterial({ color: 0x010204 });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        coreMesh.position.set(0, 10, 0);
        specificContentGroup.add(coreMesh);

        // Accretion rings
        for (let r = 0; r < 5; r++) {
          const ringGeo = new THREE.TorusGeometry(5 + r * 3, 0.12, 16, 64);
          const ringMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(currentDomain.palette.primary),
            transparent: true,
            opacity: 0.65 - r * 0.1
          });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          ring.position.set(0, 10, 0);
          ring.rotation.x = Math.PI / 2 + (r * 0.25);
          ring.rotation.y = r * 0.4;
          specificContentGroup.add(ring);
        }

        // Void Floor Horizon Grid
        const gridHelper = new THREE.GridHelper(80, 40, new THREE.Color(currentDomain.palette.primary), 0x1e293b);
        gridHelper.position.y = -0.1;
        specificContentGroup.add(gridHelper);

      } else if (preset === 'malevolent_shrine') {
        // Malevolent Shrine: Demonic Pavilion temple, blood water lake, horned skull altars
        // Dark crimson water plane
        const waterGeo = new THREE.PlaneGeometry(120, 120, 32, 32);
        const waterMat = new THREE.MeshStandardMaterial({
          color: 0x220303,
          roughness: 0.1,
          metalness: 0.8
        });
        const water = new THREE.Mesh(waterGeo, waterMat);
        water.rotation.x = -Math.PI / 2;
        water.position.y = 0;
        specificContentGroup.add(water);

        // Procedural Shrine Structure Group
        const shrineGroup = new THREE.Group();
        shrineGroup.position.set(0, 0, -8);

        // Stone Base Foundation
        const baseGeo = new THREE.BoxGeometry(16, 2.5, 12);
        const stoneMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });
        const base = new THREE.Mesh(baseGeo, stoneMat);
        base.position.y = 1.25;
        shrineGroup.add(base);

        // Timber Columns
        const columnGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 12);
        const columnMat = new THREE.MeshStandardMaterial({ color: 0x450a0a, roughness: 0.7 });
        const colCoords = [
          [-6.5, -4.5], [6.5, -4.5], [-6.5, 4.5], [6.5, 4.5],
          [-2.2, -4.5], [2.2, -4.5], [-2.2, 4.5], [2.2, 4.5]
        ];
        colCoords.forEach(([cx, cz]) => {
          const col = new THREE.Mesh(columnGeo, columnMat);
          col.position.set(cx, 6.5, cz);
          shrineGroup.add(col);
        });

        // Curved Tiered Roofs
        const roofGeo = new THREE.ConeGeometry(13, 4, 4);
        const roofMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.6 });
        const roof1 = new THREE.Mesh(roofGeo, roofMat);
        roof1.rotation.y = Math.PI / 4;
        roof1.position.y = 12.5;
        shrineGroup.add(roof1);

        // Horned Beast Altars
        const hornGeo = new THREE.ConeGeometry(0.8, 5, 8);
        const hornMat = new THREE.MeshStandardMaterial({ color: 0x7f1d1d, metalness: 0.4 });
        [-7, 7].forEach(hx => {
          const horn = new THREE.Mesh(hornGeo, hornMat);
          horn.position.set(hx, 14, 0);
          horn.rotation.z = hx > 0 ? -0.5 : 0.5;
          shrineGroup.add(horn);
        });

        // Torii gate silhouette in front
        const toriiGroup = new THREE.Group();
        toriiGroup.position.set(0, 0, 8);
        const postGeo = new THREE.CylinderGeometry(0.4, 0.4, 9, 8);
        const p1 = new THREE.Mesh(postGeo, columnMat);
        p1.position.set(-5, 4.5, 0);
        const p2 = new THREE.Mesh(postGeo, columnMat);
        p2.position.set(5, 4.5, 0);
        const beamGeo = new THREE.BoxGeometry(13, 0.8, 0.8);
        const beam = new THREE.Mesh(beamGeo, columnMat);
        beam.position.set(0, 8.8, 0);
        toriiGroup.add(p1, p2, beam);
        shrineGroup.add(toriiGroup);

        specificContentGroup.add(shrineGroup);

      } else if (preset === 'shadow_garden') {
        // Chimera Shadow Garden: Pitch black undulating liquid floor and rising shadow spires
        const shadowPlaneGeo = new THREE.PlaneGeometry(100, 100, 24, 24);
        const shadowMat = new THREE.MeshStandardMaterial({
          color: 0x050914,
          roughness: 0.1,
          metalness: 0.95
        });
        const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowMat);
        shadowPlane.rotation.x = -Math.PI / 2;
        specificContentGroup.add(shadowPlane);

        // Shadow Spikes / Tendrils
        const spikeGeo = new THREE.ConeGeometry(1.2, 12, 6);
        const spikeMat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          roughness: 0.4,
          emissive: 0x1e1b4b,
          emissiveIntensity: 0.3
        });
        for (let i = 0; i < 18; i++) {
          const angle = (i / 18) * Math.PI * 2;
          const dist = 8 + (i % 3) * 5;
          const spike = new THREE.Mesh(spikeGeo, spikeMat);
          spike.position.set(Math.cos(angle) * dist, 6, Math.sin(angle) * dist);
          spike.rotation.x = (Math.random() - 0.5) * 0.4;
          spike.rotation.z = (Math.random() - 0.5) * 0.4;
          specificContentGroup.add(spike);
        }

      } else if (preset === 'mutual_love') {
        // Authentic Mutual Love: Misty stone terrain with countless stabbed katanas
        const groundGeo = new THREE.PlaneGeometry(100, 100, 16, 16);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x11071f, roughness: 0.9 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        specificContentGroup.add(ground);

        // Procedural Katanas stabbed in earth
        const bladeGeo = new THREE.BoxGeometry(0.12, 4.5, 0.4);
        const hiltGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.4, 8);
        const guardGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 8);
        const steelMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });
        const hiltMat = new THREE.MeshStandardMaterial({ color: 0x6b21a8, roughness: 0.6 });

        for (let k = 0; k < 36; k++) {
          const katanaGroup = new THREE.Group();
          const angle = Math.random() * Math.PI * 2;
          const dist = 3 + Math.random() * 22;
          katanaGroup.position.set(Math.cos(angle) * dist, 2.2, Math.sin(angle) * dist);
          katanaGroup.rotation.z = (Math.random() - 0.5) * 0.5;
          katanaGroup.rotation.x = (Math.random() - 0.5) * 0.5;

          const blade = new THREE.Mesh(bladeGeo, steelMat);
          const guard = new THREE.Mesh(guardGeo, steelMat);
          guard.position.y = 2.25;
          const hilt = new THREE.Mesh(hiltGeo, hiltMat);
          hilt.position.y = 3.0;

          katanaGroup.add(blade, guard, hilt);
          specificContentGroup.add(katanaGroup);
        }

        // Floating Auroral Ribbons
        const ribbonGeo = new THREE.TorusGeometry(18, 0.4, 8, 48);
        const ribbonMat = new THREE.MeshBasicMaterial({
          color: 0xc084fc,
          wireframe: true,
          transparent: true,
          opacity: 0.4
        });
        const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
        ribbon.position.set(0, 12, 0);
        ribbon.rotation.x = 0.8;
        specificContentGroup.add(ribbon);

      } else if (preset === 'embodiment_perfection') {
        // Self-Embodiment of Perfection: Giant spherical cage of intertwined hands
        for (let h = 0; h < 24; h++) {
          const handCluster = new THREE.Group();
          const phi = (h / 24) * Math.PI;
          const theta = h * 2.4;
          const r = 16;

          handCluster.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            8 + r * Math.cos(phi) * 0.6,
            r * Math.sin(phi) * Math.sin(theta)
          );
          handCluster.lookAt(0, 8, 0);

          // Arm and fingers assembly
          const armGeo = new THREE.CylinderGeometry(0.6, 0.9, 5, 8);
          const skinMat = new THREE.MeshStandardMaterial({
            color: 0x34d399,
            roughness: 0.5,
            emissive: 0x064e3b,
            emissiveIntensity: 0.2
          });
          const arm = new THREE.Mesh(armGeo, skinMat);
          arm.rotation.x = Math.PI / 2;
          handCluster.add(arm);

          // 5 fingers
          for (let f = 0; f < 5; f++) {
            const fingerGeo = new THREE.BoxGeometry(0.2, 0.2, 1.4);
            const finger = new THREE.Mesh(fingerGeo, skinMat);
            finger.position.set((f - 2) * 0.3, 0, 3.2);
            finger.rotation.x = -0.3;
            handCluster.add(finger);
          }

          specificContentGroup.add(handCluster);
        }

      } else if (preset === 'iron_mountain') {
        // Coffin of the Iron Mountain: Volcanic crater, lava fissures
        const groundGeo = new THREE.CylinderGeometry(30, 25, 4, 24);
        const rockMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.95 });
        const ground = new THREE.Mesh(groundGeo, rockMat);
        ground.position.y = -2;
        specificContentGroup.add(ground);

        // Glowing Magma Core
        const magmaGeo = new THREE.CylinderGeometry(14, 14, 0.4, 24);
        const magmaMat = new THREE.MeshStandardMaterial({
          color: 0xf97316,
          emissive: 0xef4444,
          emissiveIntensity: 1.2,
          roughness: 0.2
        });
        const magma = new THREE.Mesh(magmaGeo, magmaMat);
        magma.position.y = 0.1;
        specificContentGroup.add(magma);

        // Volcanic Rock Pillars
        for (let p = 0; p < 12; p++) {
          const angle = (p / 12) * Math.PI * 2;
          const pillarGeo = new THREE.ConeGeometry(2 + Math.random(), 14, 5);
          const pillar = new THREE.Mesh(pillarGeo, rockMat);
          pillar.position.set(Math.cos(angle) * 20, 6, Math.sin(angle) * 20);
          pillar.rotation.y = Math.random();
          pillar.rotation.z = (Math.random() - 0.5) * 0.3;
          specificContentGroup.add(pillar);
        }

      } else {
        // Courtroom / Deadly Sentencing / Default
        const courtFloorGeo = new THREE.BoxGeometry(40, 1, 40);
        const woodMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.4 });
        const floor = new THREE.Mesh(courtFloorGeo, woodMat);
        floor.position.y = -0.5;
        specificContentGroup.add(floor);

        // Judge Podium
        const benchGeo = new THREE.BoxGeometry(14, 5, 4);
        const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
        const bench = new THREE.Mesh(benchGeo, darkWoodMat);
        bench.position.set(0, 2.5, -12);
        specificContentGroup.add(bench);

        // Towering Scales of Judgeman
        const scalePoleGeo = new THREE.CylinderGeometry(0.3, 0.3, 16, 8);
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.9, roughness: 0.2 });
        const pole = new THREE.Mesh(scalePoleGeo, goldMat);
        pole.position.set(0, 10, -12);
        const beamGeo = new THREE.BoxGeometry(10, 0.4, 0.4);
        const beam = new THREE.Mesh(beamGeo, goldMat);
        beam.position.set(0, 17, -12);
        specificContentGroup.add(pole, beam);
      }
    }

    // Build initial interior
    buildDomainInterior(domain);

    // Mouse Drag orbit controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0.3;
    let currentRotationY = 0;
    let currentRotationX = 0.3;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotationY += deltaX * 0.008;
      targetRotationX = Math.max(-0.2, Math.min(1.2, targetRotationX + deltaY * 0.008));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch controls for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        targetRotationY += deltaX * 0.01;
        targetRotationX = Math.max(-0.2, Math.min(1.2, targetRotationX + deltaY * 0.01));
      }
    };

    const canvasDom = renderer.domElement;
    canvasDom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvasDom.addEventListener('touchstart', onTouchStart, { passive: true });
    canvasDom.addEventListener('touchmove', onTouchMove, { passive: true });

    // Animation & Pacing Loop
    let animationFrameId = 0;
    let lastDomainId = domain.id;
    let targetBarrierScale = barrierExpanded ? Math.max(8, barrierRadius * 0.3) : 0.01;
    let currentBarrierScale = targetBarrierScale;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const status = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (status === gl.UNSIGNALED) {
          animationFrameId = window.setTimeout(poll, 6);
        } else {
          gl.deleteSync(sync);
          animationFrameId = window.setTimeout(cb, 80);
        }
      };
      animationFrameId = window.setTimeout(poll, 6);
    }

    let clock = new THREE.Clock();

    function tick() {
      const delta = Math.min(0.1, clock.getDelta());
      const elapsed = clock.getElapsedTime();
      const { domain: curDomain, barrierExpanded: isExp, barrierRadius: curRad, showBarrierShell: showShell, sureHitTriggered: isSureHit, cameraPreset: preset } = stateRef.current;

      // Check if domain changed
      if (curDomain.id !== lastDomainId) {
        lastDomainId = curDomain.id;
        buildDomainInterior(curDomain);
      }

      // Smooth camera presets
      let targetCamX = 0;
      let targetCamY = 16;
      let targetCamZ = 38;

      if (preset === 'inside') {
        targetCamX = 0;
        targetCamY = 6;
        targetCamZ = 12;
      } else if (preset === 'top') {
        targetCamX = 0;
        targetCamY = 48;
        targetCamZ = 1;
      } else if (preset === 'cinematic') {
        targetCamX = Math.sin(elapsed * 0.3) * 32;
        targetCamY = 12 + Math.cos(elapsed * 0.2) * 6;
        targetCamZ = Math.cos(elapsed * 0.3) * 32;
      }

      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 3.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 3.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 3.5, delta);

      // Smooth mouse rotation
      currentRotationY = THREE.MathUtils.damp(currentRotationY, targetRotationY, 8.0, delta);
      currentRotationX = THREE.MathUtils.damp(currentRotationX, targetRotationX, 8.0, delta);
      domainGroup.rotation.y = currentRotationY;
      domainGroup.rotation.x = currentRotationX;

      // Barrier Shell scaling
      targetBarrierScale = isExp ? (curDomain.barrierType === 'compressed' ? 4 : Math.max(10, curRad * 0.3)) : 0.001;
      currentBarrierScale = THREE.MathUtils.damp(currentBarrierScale, targetBarrierScale, 4.0, delta);
      barrierMesh.scale.set(currentBarrierScale, currentBarrierScale, currentBarrierScale);
      barrierMesh.visible = showShell && currentBarrierScale > 0.1;

      // Slow rotation on barrier mesh
      barrierMesh.rotation.y += delta * 0.15;
      barrierMesh.rotation.z += delta * 0.08;

      // Animate particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i] * delta * 2;
        if (positions[i * 3 + 1] > 25) {
          positions[i * 3 + 1] = -2;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // If Sure-hit triggered, trigger dynamic slashes/sparks
      if (isSureHit) {
        dirLight.intensity = 3.5 + Math.sin(elapsed * 40) * 1.5;
      } else {
        dirLight.intensity = THREE.MathUtils.damp(dirLight.intensity, 2.0, 4.0, delta);
      }

      // Look at domain center
      camera.lookAt(0, 5, 0);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        animationFrameId = requestAnimationFrame(tick);
      }
    }

    tick();
    if (onCanvasReady) onCanvasReady();

    // Window resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (isSoftwareGl) {
        clearTimeout(animationFrameId);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', onResize);
      canvasDom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvasDom.removeEventListener('touchstart', onTouchStart);
      canvasDom.removeEventListener('touchmove', onTouchMove);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      barrierGeo.dispose();
      barrierMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
      data-testid="domain-webgl-canvas"
      aria-label={`3D Domain Expansion representation for ${domain.name}`}
    />
  );
};
