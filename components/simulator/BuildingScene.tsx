"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useSimulatorStore } from "@/store/simulatorStore";

const SCALE = 0.02;
const FLOOR_HEIGHT = 3;

function LandMesh({ landArea }: { landArea: number }) {
  const side = Math.sqrt(landArea) * SCALE;
  return (
    <mesh position={[0, -0.05, 0]} receiveShadow>
      <boxGeometry args={[side, 0.1, side]} />
      <meshStandardMaterial color="#c4a882" roughness={0.9} />
    </mesh>
  );
}

function BuildingMesh({
  buildingArea,
  floors,
  hasError,
}: {
  buildingArea: number;
  floors: number;
  hasError: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetHeight = useRef(floors * FLOOR_HEIGHT * SCALE);
  const currentHeight = useRef(floors * FLOOR_HEIGHT * SCALE);

  const side = Math.sqrt(buildingArea) * SCALE;
  const totalHeight = floors * FLOOR_HEIGHT * SCALE;

  useEffect(() => {
    targetHeight.current = totalHeight;
  }, [totalHeight]);

  useFrame(() => {
    if (!meshRef.current) return;
    currentHeight.current = THREE.MathUtils.lerp(
      currentHeight.current,
      targetHeight.current,
      0.1
    );
    meshRef.current.scale.y = currentHeight.current / totalHeight || 1;
    meshRef.current.position.y = currentHeight.current / 2;
  });

  const color = hasError ? "#ef4444" : "#475569";

  return (
    <mesh ref={meshRef} position={[0, totalHeight / 2, 0]} castShadow>
      <boxGeometry args={[side * 0.95, totalHeight, side * 0.95]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
    </mesh>
  );
}

function FloorLines({
  buildingArea,
  floors,
}: {
  buildingArea: number;
  floors: number;
}) {
  const side = Math.sqrt(buildingArea) * SCALE * 0.96;
  const lines = [];
  for (let i = 1; i < floors; i++) {
    const y = i * FLOOR_HEIGHT * SCALE;
    lines.push(
      <mesh key={i} position={[0, y, 0]}>
        <boxGeometry args={[side, 0.01, side]} />
        <meshStandardMaterial color="#94a3b8" opacity={0.5} transparent />
      </mesh>
    );
  }
  return <>{lines}</>;
}

function Scene() {
  const { results, params } = useSimulatorStore();
  const hasError = results.warnings.some((w) => w.severity === "error");

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <Environment preset="city" />

      <LandMesh landArea={params.landArea} />
      <BuildingMesh
        buildingArea={results.buildingArea}
        floors={params.floors}
        hasError={hasError}
      />
      <FloorLines buildingArea={results.buildingArea} floors={params.floors} />

      <OrbitControls
        enablePan={false}
        minDistance={1}
        maxDistance={15}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.1}
      />
    </>
  );
}

export function BuildingScene() {
  return (
    <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 40 }}
        shadows
        gl={{ antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
