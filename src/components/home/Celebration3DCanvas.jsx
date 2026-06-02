import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Celebration3DCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    
    // Transparent background
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xe8c97a, 1.2);
    dirLight2.position.set(-5, -3, 2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xc9a84c, 2.5, 15);
    pointLight.position.set(0, 1, 3);
    scene.add(pointLight);

    // --- Helper for 3D Star shape ---
    function createStarShape(innerRadius, outerRadius, pointsCount) {
      const shape = new THREE.Shape();
      const step = Math.PI / pointsCount;
      for (let i = 0; i < 2 * pointsCount; i++) {
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = i * step - Math.PI / 2;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) {
          shape.moveTo(x, y);
        } else {
          shape.lineTo(x, y);
        }
      }
      shape.closePath();
      return shape;
    }

    // --- Main Celebration Group ---
    const celebrationGroup = new THREE.Group();
    scene.add(celebrationGroup);

    // --- Objects arrays for animations ---
    const floatingObjects = [];

    // Materials definition
    const colors = [
      0xc9a84c, // Brand Gold
      0x162032, // Navy
      0xe8c97a, // Light Gold / Champagne
      0xd97706, // Bronze/Amber
      0x6b7a8d  // Silver-blue
    ];

    const balloonMaterials = colors.map(color => new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.85,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    }));

    const starMaterial = new THREE.MeshStandardMaterial({
      color: 0xc9a84c,
      metalness: 0.95,
      roughness: 0.12,
    });

    const stringMaterial = new THREE.LineBasicMaterial({
      color: 0x888888,
      transparent: true,
      opacity: 0.35
    });

    // --- Generate Balloons ---
    const balloonRadius = 0.55;
    const sphereGeo = new THREE.SphereGeometry(balloonRadius, 32, 32);
    const tieGeo = new THREE.ConeGeometry(0.06, 0.1, 8);
    
    // Prebuild string points (wavy line)
    const stringPoints = [];
    for (let j = 0; j <= 18; j++) {
      const y = -j * 0.12;
      const x = Math.sin(j * 0.6) * 0.03;
      stringPoints.push(new THREE.Vector3(x, y, 0));
    }
    const stringGeo = new THREE.BufferGeometry().setFromPoints(stringPoints);

    // Build 6 balloons clustered and floating
    const balloonPositions = [
      { x: -0.9, y: 0.5, z: 0.5, speed: 1.1, rotOffset: 0, matIndex: 0 },
      { x: 0.9, y: 0.8, z: 0.2, speed: 0.9, rotOffset: Math.PI / 3, matIndex: 2 },
      { x: -0.2, y: -0.6, z: 0.8, speed: 1.3, rotOffset: Math.PI / 2, matIndex: 1 },
      { x: 0.3, y: 0.3, z: -0.5, speed: 0.8, rotOffset: Math.PI, matIndex: 0 },
      { x: -1.2, y: -0.8, z: -0.2, speed: 1.2, rotOffset: Math.PI * 1.5, matIndex: 3 },
      { x: 1.1, y: -0.5, z: 0.6, speed: 1.0, rotOffset: Math.PI * 0.7, matIndex: 4 }
    ];

    balloonPositions.forEach((pos, idx) => {
      const group = new THREE.Group();
      group.position.set(pos.x, pos.y, pos.z);

      // Balloon body (Sphere scaled vertically to look like ellipsoid)
      const balloonBody = new THREE.Mesh(sphereGeo, balloonMaterials[pos.matIndex]);
      balloonBody.scale.set(1, 1.28, 1);
      group.add(balloonBody);

      // Balloon tie at bottom
      const tie = new THREE.Mesh(tieGeo, balloonMaterials[pos.matIndex]);
      tie.position.y = -balloonRadius * 1.28;
      tie.rotation.x = Math.PI;
      group.add(tie);

      // Balloon string
      const string = new THREE.Line(stringGeo, stringMaterial);
      string.position.y = -balloonRadius * 1.28 - 0.05;
      group.add(string);

      celebrationGroup.add(group);
      
      floatingObjects.push({
        type: "balloon",
        mesh: group,
        baseY: pos.y,
        speed: pos.speed,
        offset: pos.rotOffset,
        rotSpeed: (Math.random() - 0.5) * 0.15
      });
    });

    // --- Generate 3D Stars ---
    const starShape = createStarShape(0.09, 0.24, 5);
    const extrudeSettings = {
      depth: 0.05,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.015,
      bevelThickness: 0.015
    };
    const starGeo = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
    // Center geometry pivot point
    starGeo.center();

    const starPositions = [
      { x: -2.0, y: 1.4, z: -1.0, speed: 0.6 },
      { x: 2.2, y: 1.6, z: -0.8, speed: 0.7 },
      { x: -1.8, y: -1.4, z: 0.5, speed: 0.8 },
      { x: 1.8, y: -1.2, z: -0.5, speed: 0.5 },
      { x: 0.0, y: 1.8, z: 0.8, speed: 0.9 }
    ];

    starPositions.forEach((pos, idx) => {
      const star = new THREE.Mesh(starGeo, starMaterial);
      star.position.set(pos.x, pos.y, pos.z);
      celebrationGroup.add(star);

      floatingObjects.push({
        type: "star",
        mesh: star,
        baseY: pos.y,
        speed: pos.speed,
        offset: idx * 2.2,
        rotSpeedX: 0.4 + Math.random() * 0.6,
        rotSpeedY: 0.3 + Math.random() * 0.5,
        rotSpeedZ: 0.1 + Math.random() * 0.4
      });
    });

    // --- Generate Confetti pieces ---
    const confettiCount = 35;
    const confettiGeo = new THREE.BoxGeometry(0.04, 0.09, 0.01);
    const confettiList = [];

    for (let i = 0; i < confettiCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const mat = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.8,
        roughness: 0.25,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(confettiGeo, mat);
      
      const x = (Math.random() - 0.5) * 6;
      const y = (Math.random() - 0.5) * 5;
      const z = (Math.random() - 0.5) * 3;
      
      mesh.position.set(x, y, z);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      
      scene.add(mesh);
      confettiList.push({
        mesh: mesh,
        speedY: 0.015 + Math.random() * 0.02,
        speedRotX: 0.02 + Math.random() * 0.04,
        speedRotY: 0.01 + Math.random() * 0.03,
        swaySpeed: 1 + Math.random() * 2,
        swayAmp: 0.005 + Math.random() * 0.008,
        offsetX: Math.random() * 100
      });
    }

    // --- Mouse Parallax variables ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      // Calculate normalized mouse positions (-1 to 1)
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = event.clientX - rect.left;
      const relativeY = event.clientY - rect.top;

      targetX = (relativeX / rect.width) * 2 - 1;
      targetY = -(relativeY / rect.height) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // --- Animation loop ---
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerping
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;

      // Apply mouse rotation to celebration group
      celebrationGroup.rotation.y = mouseX * 0.32;
      celebrationGroup.rotation.x = -mouseY * 0.22;

      // Animate balloons and stars (floating)
      floatingObjects.forEach((obj) => {
        const timeFactor = elapsedTime * obj.speed + obj.offset;
        
        // Up & down floating motion
        obj.mesh.position.y = obj.baseY + Math.sin(timeFactor) * 0.18;

        if (obj.type === "balloon") {
          // Slow sway rotation
          obj.mesh.rotation.z = Math.sin(timeFactor) * 0.06;
          obj.mesh.rotation.y += obj.rotSpeed * 0.03;
        } else if (obj.type === "star") {
          // Rotate stars in 3D
          obj.mesh.rotation.x += obj.rotSpeedX * 0.008;
          obj.mesh.rotation.y += obj.rotSpeedY * 0.008;
          obj.mesh.rotation.z += obj.rotSpeedZ * 0.005;
        }
      });

      // Animate falling confetti
      confettiList.forEach((conf) => {
        // Fall down
        conf.mesh.position.y -= conf.speedY;

        // Sway left and right
        conf.mesh.position.x += Math.sin(elapsedTime * conf.swaySpeed + conf.offsetX) * conf.swayAmp;

        // Rotate
        conf.mesh.rotation.x += conf.speedRotX;
        conf.mesh.rotation.y += conf.speedRotY;

        // Reset confetti position when it falls below viewport limits
        if (conf.mesh.position.y < -3.5) {
          conf.mesh.position.y = 3.5;
          conf.mesh.position.x = (Math.random() - 0.5) * 6;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // --- Resize Handler ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      
      // Dispose materials and geometries
      sphereGeo.dispose();
      tieGeo.dispose();
      stringGeo.dispose();
      starGeo.dispose();
      confettiGeo.dispose();
      
      balloonMaterials.forEach(m => m.dispose());
      starMaterial.dispose();
      stringMaterial.dispose();

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="canvas-3d-container" 
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        overflow: "hidden",
        pointerEvents: "auto",
        zIndex: 3
      }} 
    />
  );
}
