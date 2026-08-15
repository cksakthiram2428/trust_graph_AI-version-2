import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { NetworkData, NetworkNode, CascadeShockResult } from "../types";
import { sound } from "../utils/audio";
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  Radio, 
  Zap, 
  Layers, 
  Filter, 
  Maximize2,
  Sparkles,
  ShieldAlert,
  HelpCircle
} from "lucide-react";

interface Network3DSceneProps {
  networkData: NetworkData;
  onSelectNode: (nodeKey: string) => void;
  selectedNodeKey?: string | null;
  cascadeResult?: CascadeShockResult | null;
  onTriggerCascade?: (supplierId: string) => void;
}

export const Network3DScene: React.FC<Network3DSceneProps> = ({
  networkData,
  onSelectNode,
  selectedNodeKey,
  cascadeResult,
  onTriggerCascade
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [filterTier, setFilterTier] = useState<string>("All");
  const [filterRisk, setFilterRisk] = useState<string>("All");
  const [showHelper, setShowHelper] = useState<boolean>(false);
  const [rotationTelemetry, setRotationTelemetry] = useState<string>("[0.44, 0.92, -0.01]");

  const [sceneReady, setSceneReady] = useState<boolean>(false);

  const autoRotateRef = useRef<boolean>(false);
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // References to keep Three.js state across re-renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const nodeMeshesRef = useRef<Map<number, THREE.Group>>(new Map());
  const edgeLinesRef = useRef<THREE.Line[]>([]);
  const packetSystemRef = useRef<{ curve: THREE.QuadraticBezierCurve3; mesh: THREE.Mesh; progress: number; speed: number }[]>([]);
  const shockwaveRingsRef = useRef<THREE.Mesh[]>([]);
  const isInteractingRef = useRef<boolean>(false);
  const targetCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 70, 220));
  const cameraLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene & Background
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0A0A0C, 0.0028);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 75, 230);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLightCyan = new THREE.PointLight(0x38bdf8, 3, 400);
    pointLightCyan.position.set(0, 50, 0);
    scene.add(pointLightCyan);

    const pointLightBlue = new THREE.PointLight(0x3b82f6, 2, 350);
    pointLightBlue.position.set(-120, -40, 100);
    scene.add(pointLightBlue);

    // 5. Starfield / Cyber Constellation Particles
    const starCount = 600;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 600;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 400;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 600;

      const isCyan = Math.random() > 0.4;
      starColors[i * 3] = isCyan ? 0.22 : 0.6;
      starColors[i * 3 + 1] = isCyan ? 0.74 : 0.6;
      starColors[i * 3 + 2] = isCyan ? 0.97 : 0.9;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.7
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 6. Holographic Floor Grid
    const gridHelper = new THREE.GridHelper(320, 32, 0x0284c7, 0x0f172a);
    gridHelper.position.y = -90;
    scene.add(gridHelper);

    // 7. Concentric Orbit Rings around Core MSME Hub
    const ringRadii = [90, 140, 190];
    ringRadii.forEach((radius, idx) => {
      const ringGeo = new THREE.RingGeometry(radius - 0.3, radius + 0.3, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx === 0 ? 0x38bdf8 : idx === 1 ? 0x0284c7 : 0x0369a1,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      scene.add(ringMesh);
    });

    // Handle Window Resizing
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Mouse Interaction (Orbit / Pan / Tilt)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let spherical = new THREE.Spherical(220, Math.PI / 2.8, 0.4);

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      isInteractingRef.current = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      spherical.theta -= deltaX * 0.005;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi - deltaY * 0.005));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
      setTimeout(() => {
        isInteractingRef.current = false;
      }, 800);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(80, Math.min(380, spherical.radius + e.deltaY * 0.15));
    };

    const canvas = canvasRef.current;
    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Auto rotation when idle
      if (autoRotateRef.current && !isInteractingRef.current) {
        spherical.theta += 0.0025;
      }

      // Update camera position from spherical coordinates
      const camX = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      const camY = spherical.radius * Math.cos(spherical.phi);
      const camZ = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);

      camera.position.x += (camX - camera.position.x) * 0.06;
      camera.position.y += (camY - camera.position.y) * 0.06;
      camera.position.z += (camZ - camera.position.z) * 0.06;
      camera.lookAt(cameraLookAtRef.current);

      // Animate floating starfield
      starField.rotation.y = elapsedTime * 0.02;

      // Animate 3D Nodes (subtle floating breathing & halo rotation)
      nodeMeshesRef.current.forEach((group, id) => {
        const initialY = group.userData.baseY || 0;
        group.position.y = initialY + Math.sin(elapsedTime * 1.5 + id) * 2.2;

        const halo = group.getObjectByName("haloMesh");
        if (halo) {
          halo.rotation.z = elapsedTime * 0.8;
          const pulse = 1 + Math.sin(elapsedTime * 3 + id) * 0.12;
          halo.scale.set(pulse, pulse, pulse);
        }
      });

      // Animate Flow Particles / Packets along 3D Beziers
      packetSystemRef.current.forEach(item => {
        item.progress += item.speed;
        if (item.progress > 1) item.progress = 0;
        const point = item.curve.getPoint(item.progress);
        item.mesh.position.copy(point);
      });

      // Animate Contagion Shockwaves
      shockwaveRingsRef.current.forEach((ring, idx) => {
        const scale = 1 + ((elapsedTime * 2.5 + idx * 0.8) % 3) * 1.8;
        ring.scale.set(scale, scale, scale);
        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, 0.8 - scale * 0.25);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("wheel", onWheel);
      renderer.dispose();
    };
  }, [autoRotate]);

  // Build & Update Graph Nodes & Bezier Connections
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !networkData.nodes.length) return;

    // Clear previous node groups and lines
    nodeMeshesRef.current.forEach(group => scene.remove(group));
    nodeMeshesRef.current.clear();
    edgeLinesRef.current.forEach(line => scene.remove(line));
    edgeLinesRef.current = [];
    packetSystemRef.current.forEach(p => scene.remove(p.mesh));
    packetSystemRef.current = [];
    shockwaveRingsRef.current.forEach(r => scene.remove(r));
    shockwaveRingsRef.current = [];

    // Filter nodes if filters active
    const filteredNodes = networkData.nodes.filter(node => {
      const matchTier = filterTier === "All" || node.tier.includes(filterTier);
      const matchRisk = filterRisk === "All" || node.risk.includes(filterRisk);
      return matchTier && matchRisk || node.key === "HUB";
    });

    const activeNodeIds = new Set(filteredNodes.map(n => n.id));

    // Create 3D Nodes
    filteredNodes.forEach(node => {
      const group = new THREE.Group();
      group.position.set(node.x, node.y, node.z);
      group.userData = { nodeId: node.id, key: node.key, nodeData: node, baseY: node.y };

      const isHub = node.key === "HUB";
      const radius = isHub ? 9 : Math.max(4.5, node.size * 0.45);
      const nodeColorHex = parseInt(node.color.replace("#", "0x"), 16);

      // Core Solid Sphere
      const sphereGeo = new THREE.SphereGeometry(radius, 32, 32);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: nodeColorHex,
        emissive: nodeColorHex,
        emissiveIntensity: isHub ? 0.8 : 0.45,
        roughness: 0.2,
        metalness: 0.6
      });
      const coreMesh = new THREE.Mesh(sphereGeo, sphereMat);
      coreMesh.name = "coreMesh";
      group.add(coreMesh);

      // Outer Glowing Halo Ring / Fresnel Shield
      const haloGeo = new THREE.RingGeometry(radius * 1.35, radius * 1.6, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: nodeColorHex,
        transparent: true,
        opacity: isHub ? 0.6 : 0.4,
        side: THREE.DoubleSide
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.name = "haloMesh";
      group.add(haloMesh);

      // Center Wireframe Ring for Core Hub
      if (isHub) {
        const torusGeo = new THREE.TorusGeometry(radius * 1.8, 0.4, 16, 64);
        const torusMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 });
        const torus = new THREE.Mesh(torusGeo, torusMat);
        torus.rotation.x = Math.PI / 3;
        group.add(torus);
      }

      scene.add(group);
      nodeMeshesRef.current.set(node.id, group);
    });

    // Create 3D Curved Beziers for Edges & Flow Energy Packets
    networkData.edges.forEach(edge => {
      if (!activeNodeIds.has(edge.fromId) || !activeNodeIds.has(edge.toId)) return;

      const fromNode = filteredNodes.find(n => n.id === edge.fromId);
      const toNode = filteredNodes.find(n => n.id === edge.toId);
      if (!fromNode || !toNode) return;

      const start = new THREE.Vector3(fromNode.x, fromNode.y, fromNode.z);
      const end = new THREE.Vector3(toNode.x, toNode.y, toNode.z);

      // Arc midpoint outward for 3D curved tube aesthetic
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const dist = start.distanceTo(end);
      mid.y += dist * 0.18; // Elevated arc

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(36);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

      let lineColor = 0x0284c7; // Default cyan blue
      let lineOpacity = 0.35;

      if (edge.status === "critical") {
        lineColor = 0xef4444; // Red
        lineOpacity = 0.65;
      } else if (edge.status === "warning") {
        lineColor = 0xeab308; // Amber
        lineOpacity = 0.5;
      }

      const lineMat = new THREE.LineBasicMaterial({
        color: lineColor,
        transparent: true,
        opacity: lineOpacity,
        linewidth: edge.status === "critical" ? 2 : 1
      });

      const line = new THREE.Line(curveGeo, lineMat);
      scene.add(line);
      edgeLinesRef.current.push(line);

      // Traveling Light Energy Photon
      const packetGeo = new THREE.SphereGeometry(1.2, 12, 12);
      const packetMat = new THREE.MeshBasicMaterial({
        color: edge.status === "critical" ? 0xff4444 : 0x38bdf8
      });
      const packetMesh = new THREE.Mesh(packetGeo, packetMat);
      scene.add(packetMesh);

      packetSystemRef.current.push({
        curve,
        mesh: packetMesh,
        progress: Math.random(),
        speed: 0.005 + (edge.weight * 0.001)
      });
    });

    // Check if Cascade Simulation is Active -> Spawn 3D Shockwave Rings
    if (cascadeResult) {
      const originGroup = nodeMeshesRef.current.get(cascadeResult.originNodeId);
      if (originGroup) {
        for (let i = 0; i < 3; i++) {
          const ringGeo = new THREE.RingGeometry(8, 10, 32);
          const ringMat = new THREE.MeshBasicMaterial({
            color: 0xef4444,
            transparent: true,
            opacity: 0.7,
            side: THREE.DoubleSide
          });
          const shockRing = new THREE.Mesh(ringGeo, ringMat);
          shockRing.position.copy(originGroup.position);
          shockRing.rotation.x = Math.PI / 2;
          scene.add(shockRing);
          shockwaveRingsRef.current.push(shockRing);
        }
      }
    }
  }, [networkData, filterTier, filterRisk, cascadeResult]);

  // Raycasting for Click and Hover Detection
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || !cameraRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const interactiveObjects: THREE.Object3D[] = [];
    nodeMeshesRef.current.forEach(group => {
      const core = group.getObjectByName("coreMesh");
      if (core) interactiveObjects.push(core);
    });

    const intersects = raycaster.intersectObjects(interactiveObjects);
    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      const group = clickedMesh.parent as THREE.Group;
      if (group && group.userData.key) {
        sound.playTargetLock();
        onSelectNode(group.userData.key);
      }
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || !cameraRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const interactiveObjects: THREE.Object3D[] = [];
    nodeMeshesRef.current.forEach(group => {
      const core = group.getObjectByName("coreMesh");
      if (core) interactiveObjects.push(core);
    });

    const intersects = raycaster.intersectObjects(interactiveObjects);
    if (intersects.length > 0) {
      const hoveredMesh = intersects[0].object;
      const group = hoveredMesh.parent as THREE.Group;
      if (group && group.userData.nodeData) {
        setHoveredNode(group.userData.nodeData);
      }
    } else {
      setHoveredNode(null);
    }
  };

  return (
    <div
      id="3d-network-stage"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      className="relative w-full h-[620px] graph-viewport-box shadow-2xl select-none"
    >
      {/* Three.js Canvas */}
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing block" />

      {/* Cyber HUD Overlay Top Left: Legend & Threat Radar */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none max-w-[calc(100%-8rem)]">
        <div className="flex items-center gap-2 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg bg-[#0A0A0C]/80 backdrop-blur-md border border-sky-400/30 text-[9px] sm:text-xs font-mono text-[#38BDF8] pointer-events-auto whitespace-nowrap overflow-hidden">
          <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#38BDF8] animate-ping" />
          <span className="truncate">3D GRAPH</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">{networkData.nodes.length} N</span>
        </div>

        {/* Tier Hierarchy Indicators */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0A0A0C]/80 backdrop-blur-sm border border-white/10 text-[11px] font-mono text-slate-300 pointer-events-auto">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-400 mr-1" /> Core Hub
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 ml-2 mr-1" /> Tier-1
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 ml-2 mr-1" /> Tier-2
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-400 ml-2 mr-1" /> Tier-3
        </div>
      </div>

      {/* Cyber HUD Top Right: Controls & Filters */}
      <div className="absolute top-4 right-4 z-20 flex flex-wrap justify-end gap-1.5 sm:gap-2 pointer-events-auto max-w-[calc(100%-8rem)]">
        {/* Tier Filter */}
        <div className="relative">
          <select
            id="filter-tier-select"
            value={filterTier}
            onChange={(e) => { sound.playClick(); setFilterTier(e.target.value); }}
            className="px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-[#0A0A0C]/85 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs text-slate-200 focus:outline-none focus:border-[#38BDF8] font-mono cursor-pointer"
          >
            <option value="All">All Tiers</option>
            <option value="Tier-1">Tier-1</option>
            <option value="Tier-2">Tier-2</option>
            <option value="Tier-3">Tier-3</option>
          </select>
        </div>

        {/* Risk Filter */}
        <div>
          <select
            id="filter-risk-select"
            value={filterRisk}
            onChange={(e) => { sound.playClick(); setFilterRisk(e.target.value); }}
            className="px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-700 text-[10px] sm:text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
          >
            <option value="All">All Risks</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Quick Help Guide Button */}
        <button
          id="help-guide-btn"
          onClick={() => { sound.playClick(); setShowHelper(!showHelper); }}
          className="p-1.5 sm:p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs"
          title="3D Navigation Controls"
        >
          <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

      {/* Helper Modal Popup */}
      {showHelper && (
        <div className="absolute top-16 right-4 z-30 w-72 p-4 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 shadow-2xl text-xs text-slate-200 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-mono text-cyan-400 font-semibold">
            <span>3D SPATIAL CONTROLS</span>
            <button onClick={() => setShowHelper(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <ul className="mt-2.5 space-y-2 text-slate-300">
            <li className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-300">Drag Left</span>
              <span>Rotate 360° Knowledge Graph</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-300">Scroll</span>
              <span>Zoom in / out of clusters</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-300">Click Node</span>
              <span>Focus supplier & open deep audit</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-rose-300">Cascade Mode</span>
              <span>Watch disruption propagation waves</span>
            </li>
          </ul>
        </div>
      )}

      {/* Floating Rotation Vector / Telemetry Vector Stamp */}
      <div className="absolute bottom-4 left-4 z-10 font-mono text-[10px] text-zinc-500 bg-[#0A0A0B]/80 px-2.5 py-1 rounded-md border border-white/5 pointer-events-none flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
        <span>ROTATION_VECTOR: [0.44, 0.92, -0.01]</span>
      </div>

      {/* Floating 3D Hover Tooltip HUD */}
      {hoveredNode && (
        <div className="absolute bottom-12 left-4 z-20 pointer-events-none p-3.5 rounded-xl bg-[#0A0A0B]/95 backdrop-blur-xl border border-[#22D3EE]/50 shadow-2xl w-[calc(100vw-2rem)] max-w-80 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <div className="flex items-center gap-2 truncate">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: hoveredNode.color }}
              />
              <span className="font-bold text-sm text-white tracking-wide truncate">{hoveredNode.label}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-[#22D3EE] flex-shrink-0">
              {hoveredNode.score}/100
            </span>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/[0.03] p-1.5 rounded border border-white/5">
              <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block">Hierarchy Tier</span>
              <span className="font-medium text-zinc-200 font-mono">{hoveredNode.tier}</span>
            </div>
            <div className="bg-white/[0.03] p-1.5 rounded border border-white/5">
              <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block">Risk Status</span>
              <span
                className={`font-semibold font-mono ${
                  hoveredNode.score >= 80
                    ? "text-emerald-400"
                    : hoveredNode.score >= 60
                    ? "text-yellow-400"
                    : "text-rose-400"
                }`}
              >
                {hoveredNode.risk}
              </span>
            </div>
          </div>

          <div className="mt-2 text-[11px] text-zinc-400 italic">
            Role: {hoveredNode.role} • Click node to open deep AI telemetry
          </div>
        </div>
      )}

      {/* Active Shockwave Simulation Banner Overlay */}
      {cascadeResult && (
        <div className="absolute bottom-6 right-6 left-6 sm:left-auto z-20 sm:max-w-md p-4 rounded-xl bg-rose-950/85 backdrop-blur-xl border border-rose-500/60 shadow-2xl animate-pulse">
          <div className="flex items-center gap-2 text-rose-300 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-400 animate-bounce flex-shrink-0" />
            <span className="truncate">Contagion Simulation Active</span>
          </div>
          <div className="mt-1 text-xs sm:text-sm font-semibold text-white truncate">
            Origin: {cascadeResult.originSupplier.name}
          </div>
          <p className="mt-1 text-[10px] sm:text-xs text-rose-200 line-clamp-2">
            {cascadeResult.cascadeNarrative}
          </p>
          <div className="mt-2 flex items-center justify-between text-[10px] sm:text-xs font-mono text-rose-300">
            <span>Impact: {cascadeResult.directImpactedNodeIds.length} Nodes</span>
            <span className="font-bold text-rose-100">{cascadeResult.monetaryExposureINR}</span>
          </div>
        </div>
      )}
    </div>
  );
};
