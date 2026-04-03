"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useSimulatorStore } from "@/store/simulatorStore";

const SCALE = 0.02;
const FLOOR_HEIGHT = 3;

// --- 대지 ---
function LandMesh({ landArea }: { landArea: number }) {
  const side = Math.sqrt(landArea) * SCALE;
  const landRef = useRef<THREE.Group>(null);

  return (
    <group ref={landRef}>
      {/* 메인 대지 */}
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <boxGeometry args={[side, 0.04, side]} />
        <meshStandardMaterial color="#8B9467" roughness={0.95} />
      </mesh>
      {/* 대지 경계선 */}
      <lineSegments position={[0, 0.01, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(side, 0.001, side)]} />
        <lineBasicMaterial color="#D4A574" linewidth={1} />
      </lineSegments>
      {/* 주변 도로 */}
      <mesh position={[0, -0.04, side / 2 + 0.15]} receiveShadow>
        <boxGeometry args={[side + 0.6, 0.02, 0.3]} />
        <meshStandardMaterial color="#555555" roughness={0.8} />
      </mesh>
      {/* 도로 중앙선 */}
      <mesh position={[0, -0.02, side / 2 + 0.15]}>
        <boxGeometry args={[side + 0.4, 0.001, 0.02]} />
        <meshStandardMaterial color="#CCCC00" />
      </mesh>
      {/* 인도 */}
      <mesh position={[0, -0.03, side / 2 + 0.02]} receiveShadow>
        <boxGeometry args={[side + 0.3, 0.03, 0.08]} />
        <meshStandardMaterial color="#AAAAAA" roughness={0.9} />
      </mesh>
      {/* 조경 포인트 (소형 나무 표현) */}
      {side > 0.3 && (
        <>
          <Tree position={[-side / 2 + 0.1, 0, -side / 2 + 0.1]} scale={0.5} />
          <Tree position={[side / 2 - 0.1, 0, -side / 2 + 0.1]} scale={0.4} />
        </>
      )}
    </group>
  );
}

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* 나무 줄기 */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.01, 0.015, 0.16, 6]} />
        <meshStandardMaterial color="#8B6914" roughness={0.9} />
      </mesh>
      {/* 나무 잎 */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.08, 8, 6]} />
        <meshStandardMaterial color="#2D8B2D" roughness={0.8} />
      </mesh>
    </group>
  );
}

// --- 건물 (용도별 다른 형태) ---
function BuildingMesh({
  buildingArea,
  floors,
  hasError,
  usageCategory,
}: {
  buildingArea: number;
  floors: number;
  hasError: boolean;
  usageCategory: "residential" | "commercial" | "industrial";
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetHeight = useRef(floors * FLOOR_HEIGHT * SCALE);
  const currentHeight = useRef(floors * FLOOR_HEIGHT * SCALE);
  const side = Math.sqrt(buildingArea) * SCALE;
  const totalHeight = floors * FLOOR_HEIGHT * SCALE;

  useEffect(() => {
    targetHeight.current = totalHeight;
  }, [totalHeight]);

  useFrame(() => {
    if (!groupRef.current) return;
    const lerped = THREE.MathUtils.lerp(currentHeight.current, targetHeight.current, 0.08);
    currentHeight.current = lerped;
    const s = totalHeight > 0 ? lerped / totalHeight : 1;
    groupRef.current.scale.y = s;
    groupRef.current.position.y = (lerped - totalHeight) / 2;
  });

  const baseColor = hasError ? "#EF4444" : usageCategory === "commercial" ? "#4A7AB5" : usageCategory === "industrial" ? "#7A8B6F" : "#6B7B8D";
  const accentColor = hasError ? "#FF6B6B" : usageCategory === "commercial" ? "#7FB5E0" : usageCategory === "industrial" ? "#A0B090" : "#8BA0B5";

  if (usageCategory === "commercial") {
    return <CommercialBuilding ref={groupRef} side={side} totalHeight={totalHeight} floors={floors} baseColor={baseColor} accentColor={accentColor} />;
  }
  if (usageCategory === "industrial") {
    return <IndustrialBuilding ref={groupRef} side={side} totalHeight={totalHeight} floors={floors} baseColor={baseColor} accentColor={accentColor} />;
  }
  return <ResidentialBuilding ref={groupRef} side={side} totalHeight={totalHeight} floors={floors} baseColor={baseColor} accentColor={accentColor} />;
}

// 주거용: 세트백 형태 (상층부 안쪽으로)
const ResidentialBuilding = ({ ref, side, totalHeight, floors, baseColor, accentColor }: { ref: React.RefObject<THREE.Group | null>; side: number; totalHeight: number; floors: number; baseColor: string; accentColor: string }) => {
  const setbackFloor = Math.max(1, Math.floor(floors * 0.7));
  const lowerHeight = setbackFloor * FLOOR_HEIGHT * SCALE;
  const upperHeight = totalHeight - lowerHeight;
  const upperSide = side * 0.8;

  return (
    <group ref={ref} position={[0, totalHeight / 2, 0]}>
      {/* 하부 */}
      <mesh position={[0, -totalHeight / 2 + lowerHeight / 2, 0]} castShadow>
        <boxGeometry args={[side * 0.93, lowerHeight, side * 0.93]} />
        <meshStandardMaterial color={baseColor} roughness={0.3} metalness={0.15} />
      </mesh>
      {/* 상부 세트백 */}
      {upperHeight > 0 && (
        <mesh position={[0, -totalHeight / 2 + lowerHeight + upperHeight / 2, 0]} castShadow>
          <boxGeometry args={[upperSide * 0.93, upperHeight, upperSide * 0.93]} />
          <meshStandardMaterial color={baseColor} roughness={0.3} metalness={0.15} />
        </mesh>
      )}
      {/* 창문 그리드 */}
      <WindowGrid side={side * 0.93} height={lowerHeight} floors={setbackFloor} offset={-totalHeight / 2} color={accentColor} />
      {upperHeight > 0 && (
        <WindowGrid side={upperSide * 0.93} height={upperHeight} floors={floors - setbackFloor} offset={-totalHeight / 2 + lowerHeight} color={accentColor} />
      )}
      {/* 옥상 구조물 */}
      <mesh position={[0, totalHeight / 2 + 0.02, 0]}>
        <boxGeometry args={[side * 0.3, 0.04, side * 0.3]} />
        <meshStandardMaterial color="#888888" roughness={0.5} />
      </mesh>
    </group>
  );
};

// 상업용: 커튼월(유리벽) 스타일
const CommercialBuilding = ({ ref, side, totalHeight, floors, baseColor, accentColor }: { ref: React.RefObject<THREE.Group | null>; side: number; totalHeight: number; floors: number; baseColor: string; accentColor: string }) => {
  return (
    <group ref={ref} position={[0, totalHeight / 2, 0]}>
      {/* 메인 바디 */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[side * 0.93, totalHeight, side * 0.93]} />
        <meshStandardMaterial color={baseColor} roughness={0.1} metalness={0.5} />
      </mesh>
      {/* 유리 커튼월 효과 — 전면 */}
      <mesh position={[0, 0, side * 0.47]}>
        <planeGeometry args={[side * 0.9, totalHeight * 0.95]} />
        <meshStandardMaterial color={accentColor} roughness={0.05} metalness={0.7} transparent opacity={0.6} />
      </mesh>
      {/* 유리 커튼월 — 측면 */}
      <mesh position={[side * 0.47, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[side * 0.9, totalHeight * 0.95]} />
        <meshStandardMaterial color={accentColor} roughness={0.05} metalness={0.7} transparent opacity={0.6} />
      </mesh>
      {/* 층 구분 라인 */}
      {Array.from({ length: floors - 1 }, (_, i) => {
        const y = (i + 1) * FLOOR_HEIGHT * SCALE - totalHeight / 2;
        return (
          <mesh key={i} position={[0, y, 0]}>
            <boxGeometry args={[side * 0.95, 0.008, side * 0.95]} />
            <meshStandardMaterial color="#2A3A4A" metalness={0.3} />
          </mesh>
        );
      })}
      {/* 옥상 헬리패드 느낌 */}
      <mesh position={[0, totalHeight / 2 + 0.01, 0]}>
        <cylinderGeometry args={[side * 0.2, side * 0.2, 0.01, 16]} />
        <meshStandardMaterial color="#CCCCCC" roughness={0.5} />
      </mesh>
    </group>
  );
};

// 공업용: 평평한 지붕 + 환기구
const IndustrialBuilding = ({ ref, side, totalHeight, floors, baseColor, accentColor }: { ref: React.RefObject<THREE.Group | null>; side: number; totalHeight: number; floors: number; baseColor: string; accentColor: string }) => {
  return (
    <group ref={ref} position={[0, totalHeight / 2, 0]}>
      {/* 메인 바디 — 약간 넓적한 형태 */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[side * 0.95, totalHeight, side * 0.75]} />
        <meshStandardMaterial color={baseColor} roughness={0.7} metalness={0.05} />
      </mesh>
      {/* 창문 — 큰 산업용 창 */}
      <WindowGrid side={side * 0.95} height={totalHeight} floors={floors} offset={-totalHeight / 2} color={accentColor} windowScale={1.5} />
      {/* 옥상 환기구 */}
      {[0.2, -0.2].map((xOff) => (
        <mesh key={xOff} position={[side * xOff, totalHeight / 2 + 0.04, 0]}>
          <cylinderGeometry args={[0.02, 0.025, 0.08, 8]} />
          <meshStandardMaterial color="#999999" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}
      {/* 옥상 장비 */}
      <mesh position={[0, totalHeight / 2 + 0.02, side * 0.15]}>
        <boxGeometry args={[side * 0.4, 0.04, side * 0.15]} />
        <meshStandardMaterial color="#777777" roughness={0.5} />
      </mesh>
    </group>
  );
};

// 창문 그리드 — 4면에 배치
function WindowGrid({
  side,
  height,
  floors,
  offset,
  color,
  windowScale = 1,
}: {
  side: number;
  height: number;
  floors: number;
  offset: number;
  color: string;
  windowScale?: number;
}) {
  const windows = useMemo(() => {
    const result: { pos: [number, number, number]; rot: [number, number, number]; w: number; h: number }[] = [];
    const cols = Math.max(2, Math.min(6, Math.floor(side / (0.08 * windowScale))));
    const floorH = FLOOR_HEIGHT * SCALE;
    const winW = (side * 0.7) / cols;
    const winH = floorH * 0.5 * windowScale;

    for (let f = 0; f < floors; f++) {
      const y = offset + floorH * (f + 0.55);
      for (let c = 0; c < cols; c++) {
        const x = -side * 0.35 + winW * (c + 0.5);
        // 전면
        result.push({ pos: [x, y, side / 2 + 0.001], rot: [0, 0, 0], w: winW * 0.7, h: winH });
        // 후면
        result.push({ pos: [x, y, -side / 2 - 0.001], rot: [0, Math.PI, 0], w: winW * 0.7, h: winH });
      }
      for (let c = 0; c < Math.max(1, cols - 1); c++) {
        const z = -side * 0.3 + (side * 0.6 / Math.max(1, cols - 1)) * (c + 0.5);
        // 좌측
        result.push({ pos: [-side / 2 - 0.001, y, z], rot: [0, -Math.PI / 2, 0], w: winW * 0.7, h: winH });
        // 우측
        result.push({ pos: [side / 2 + 0.001, y, z], rot: [0, Math.PI / 2, 0], w: winW * 0.7, h: winH });
      }
    }
    return result;
  }, [side, height, floors, offset, windowScale]);

  if (floors === 0 || side < 0.05) return null;

  return (
    <>
      {windows.map((w, i) => (
        <mesh key={i} position={w.pos} rotation={w.rot}>
          <planeGeometry args={[w.w, w.h]} />
          <meshStandardMaterial color={color} roughness={0.1} metalness={0.3} transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  );
}

// --- 씬 ---
function Scene() {
  const { results, params, zoningType } = useSimulatorStore();
  const hasError = results.warnings.some((w) => w.severity === "error");

  // 용도지역 → 카테고리 매핑
  const usageCategory: "residential" | "commercial" | "industrial" =
    zoningType === "general-commercial" || zoningType === "neighborhood-commercial"
      ? "commercial"
      : zoningType === "quasi-industrial"
        ? "industrial"
        : "residential";

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[6, 12, 8]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3, 6, -4]} intensity={0.3} />
      <Environment preset="city" />

      <LandMesh landArea={params.landArea} />
      <BuildingMesh
        buildingArea={results.buildingArea}
        floors={params.floors}
        hasError={hasError}
        usageCategory={usageCategory}
      />

      <OrbitControls
        enablePan={false}
        minDistance={1}
        maxDistance={15}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, (params.floors * FLOOR_HEIGHT * SCALE) / 3, 0]}
      />

      {/* 그리드 바닥 */}
      <gridHelper args={[4, 20, "#cccccc", "#e5e5e5"]} position={[0, -0.05, 0]} />
    </>
  );
}

export function BuildingScene() {
  return (
    <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-gradient-to-b from-sky-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative">
      <Canvas
        camera={{ position: [4, 3.5, 4], fov: 42 }}
        shadows
        gl={{ antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
