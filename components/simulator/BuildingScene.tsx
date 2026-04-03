"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useSimulatorStore } from "@/store/simulatorStore";

const SCALE = 0.02;
const FH = FLOOR_HEIGHT_WORLD();
function FLOOR_HEIGHT_WORLD() { return 3 * 0.02; } // 층고 3m × SCALE

// ════════ 대지 ════════
function Land({ size }: { size: number }) {
  return (
    <group>
      <mesh position={[0, -0.01, 0]} receiveShadow>
        <boxGeometry args={[size, 0.02, size]} />
        <meshStandardMaterial color="#8a9560" roughness={0.9} />
      </mesh>
      <lineSegments position={[0, 0.005, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(size, 0.001, size)]} />
        <lineBasicMaterial color="#c8a070" />
      </lineSegments>
      {/* 도로 */}
      <mesh position={[0, -0.015, size / 2 + 0.1]}>
        <boxGeometry args={[size + 0.4, 0.01, 0.2]} />
        <meshStandardMaterial color="#505050" roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.005, size / 2 + 0.1]}>
        <boxGeometry args={[size * 0.8, 0.001, 0.012]} />
        <meshStandardMaterial color="#cccc00" />
      </mesh>
      {/* 나무 */}
      {size > 0.2 && <MiniTree pos={[-size / 2 + 0.06, 0, -size / 2 + 0.06]} />}
      {size > 0.3 && <MiniTree pos={[size / 2 - 0.06, 0, -size / 2 + 0.06]} h={0.1} />}
    </group>
  );
}

function MiniTree({ pos, h = 0.13 }: { pos: [number, number, number]; h?: number }) {
  return (
    <group position={pos}>
      <mesh position={[0, h / 2, 0]}>
        <cylinderGeometry args={[0.006, 0.01, h, 5]} />
        <meshStandardMaterial color="#7a5c2e" />
      </mesh>
      <mesh position={[0, h + 0.035, 0]}>
        <sphereGeometry args={[0.045, 6, 5]} />
        <meshStandardMaterial color="#3a8a3a" roughness={0.8} />
      </mesh>
    </group>
  );
}

// ════════ 건물 본체 ════════
function Building({
  area,
  floors,
  hasError,
  usage,
}: {
  area: number;
  floors: number;
  hasError: boolean;
  usage: "residential" | "commercial" | "industrial";
}) {
  const side = Math.sqrt(area) * SCALE;
  const h = floors * FH;
  if (floors === 0 || side < 0.01) return null;

  const errColor = "#cc3333";
  const palette = {
    residential: { body: "#5a6a78", window: "#a0c8e0", roof: "#888" },
    commercial:  { body: "#3a6090", window: "#80b8e8", roof: "#aaa" },
    industrial:  { body: "#687860", window: "#a0c0a0", roof: "#999" },
  }[usage];
  const body = hasError ? errColor : palette.body;
  const win = hasError ? "#ee9999" : palette.window;

  return (
    <group>
      {usage === "residential" && <Residential s={side} h={h} floors={floors} body={body} win={win} roof={palette.roof} />}
      {usage === "commercial" && <Commercial s={side} h={h} floors={floors} body={body} win={win} roof={palette.roof} />}
      {usage === "industrial" && <Industrial s={side} h={h} floors={floors} body={body} win={win} roof={palette.roof} />}
    </group>
  );
}

// ─── 주거: 하부 + 세트백 상부 ───
function Residential({ s, h, floors, body, win, roof }: BP) {
  const cut = Math.max(1, Math.floor(floors * 0.7));
  const h1 = cut * FH;
  const h2 = h - h1;
  const s2 = s * 0.78;
  const bs = s * 0.9;

  return (
    <group>
      {/* 하부 */}
      <Box pos={[0, h1 / 2, 0]} size={[bs, h1, bs]} color={body} />
      <WinRows s={bs} y0={0} n={cut} color={win} />
      {/* 상부 */}
      {h2 > 0.001 && (
        <>
          <Box pos={[0, h1 + h2 / 2, 0]} size={[s2, h2, s2]} color={body} />
          <WinRows s={s2} y0={h1} n={floors - cut} color={win} />
        </>
      )}
      {/* 옥상 */}
      <Box pos={[0, h + 0.012, 0]} size={[s * 0.22, 0.024, s * 0.22]} color={roof} />
      {/* 입구 */}
      <mesh position={[0, FH * 0.3, bs / 2 + 0.001]}>
        <planeGeometry args={[bs * 0.18, FH * 0.5]} />
        <meshStandardMaterial color="#445566" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ─── 상업: 단일 바디 + 유리 색상 + 층 라인 ───
function Commercial({ s, h, floors, body, win, roof }: BP) {
  const bs = s * 0.9;

  return (
    <group>
      {/* 메인 바디 — 유리 느낌 재질 */}
      <Box pos={[0, h / 2, 0]} size={[bs, h, bs]} color={body} metalness={0.4} roughness={0.15} />
      {/* 유리 창문 (바디와 동일 크기, 약간 밝게) */}
      <WinRows s={bs} y0={0} n={floors} color={win} scale={1.2} />
      {/* 층 구분선 — 바디 안쪽에만 */}
      {Array.from({ length: Math.max(0, floors - 1) }, (_, i) => (
        <mesh key={i} position={[0, (i + 1) * FH, 0]}>
          <boxGeometry args={[bs + 0.003, 0.005, bs + 0.003]} />
          <meshStandardMaterial color="#1a2a3a" />
        </mesh>
      ))}
      {/* 옥상 */}
      <mesh position={[0, h + 0.004, 0]}>
        <cylinderGeometry args={[bs * 0.15, bs * 0.15, 0.008, 12]} />
        <meshStandardMaterial color={roof} />
      </mesh>
    </group>
  );
}

// ─── 공업: 넓적 + 환기구 ───
function Industrial({ s, h, floors, body, win, roof }: BP) {
  const sx = s * 0.92;
  const sz = s * 0.68;

  return (
    <group>
      <Box pos={[0, h / 2, 0]} size={[sx, h, sz]} color={body} roughness={0.7} />
      <WinRows s={sx} depth={sz} y0={0} n={floors} color={win} scale={1.3} />
      {/* 환기구 */}
      {[-0.22, 0.22].map((off) => (
        <mesh key={off} position={[sx * off, h + 0.025, 0]}>
          <cylinderGeometry args={[0.015, 0.02, 0.05, 6]} />
          <meshStandardMaterial color={roof} metalness={0.2} />
        </mesh>
      ))}
      <Box pos={[0, h + 0.012, sz * 0.12]} size={[sx * 0.3, 0.024, sz * 0.18]} color="#777" />
    </group>
  );
}

// ════════ 유틸 ════════

interface BP { s: number; h: number; floors: number; body: string; win: string; roof: string }

function Box({ pos, size, color, metalness = 0.1, roughness = 0.35 }:
  { pos: [number, number, number]; size: [number, number, number]; color: string; metalness?: number; roughness?: number }) {
  return (
    <mesh position={pos} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  );
}

function WinRows({ s, depth, y0, n, color, scale = 1 }:
  { s: number; depth?: number; y0: number; n: number; color: string; scale?: number }) {
  const d = depth ?? s;
  const elements = useMemo(() => {
    const res: React.ReactElement[] = [];
    const cols = Math.max(2, Math.min(5, Math.floor(s / (0.08 * scale))));
    const ww = (s * 0.6) / cols;
    const wh = FH * 0.4 * scale;
    const gap = 0.002; // 건물 표면에서 살짝 띄움

    for (let f = 0; f < n; f++) {
      const y = y0 + FH * (f + 0.55);
      for (let c = 0; c < cols; c++) {
        const x = -s * 0.3 + ww * (c + 0.5);
        // 전/후면
        res.push(
          <mesh key={`${f}-${c}-f`} position={[x, y, d / 2 + gap]}>
            <planeGeometry args={[ww * 0.6, wh]} />
            <meshStandardMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        );
        res.push(
          <mesh key={`${f}-${c}-b`} position={[x, y, -(d / 2 + gap)]}>
            <planeGeometry args={[ww * 0.6, wh]} />
            <meshStandardMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        );
      }
      // 좌/우면
      const sc = Math.max(1, cols - 1);
      for (let c = 0; c < sc; c++) {
        const z = -d * 0.3 + (d * 0.6 / sc) * (c + 0.5);
        const sw = (d * 0.6 / sc) * 0.6;
        res.push(
          <mesh key={`${f}-${c}-l`} position={[-(s / 2 + gap), y, z]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[sw, wh]} />
            <meshStandardMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        );
        res.push(
          <mesh key={`${f}-${c}-r`} position={[s / 2 + gap, y, z]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[sw, wh]} />
            <meshStandardMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        );
      }
    }
    return res;
  }, [s, d, y0, n, color, scale]);

  return <>{elements}</>;
}

// ════════ 씬 ════════

function Scene() {
  const { results, params, zoningType } = useSimulatorStore();
  const hasError = results.warnings.some((w) => w.severity === "error");
  const landSide = Math.sqrt(params.landArea) * SCALE;
  const bh = params.floors * FH;

  const usage: "residential" | "commercial" | "industrial" =
    zoningType === "general-commercial" || zoningType === "neighborhood-commercial"
      ? "commercial"
      : zoningType === "quasi-industrial"
        ? "industrial"
        : "residential";

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 10, 7]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-3, 5, -3]} intensity={0.25} />
      <Environment preset="city" />

      <Land size={landSide} />
      <Building area={results.buildingArea} floors={params.floors} hasError={hasError} usage={usage} />

      {/* 그리드 — 대지 크기 비례 */}
      <gridHelper
        args={[landSide + 0.6, Math.min(16, Math.max(6, Math.round(landSide / 0.12))), "#999", "#ccc"]}
        position={[0, -0.02, 0]}
      />

      <OrbitControls
        enablePan={false}
        minDistance={0.5}
        maxDistance={10}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2.3}
        target={[0, Math.max(bh * 0.35, 0.05), 0]}
      />
    </>
  );
}

// ════════ 내보내기 ════════

export function BuildingScene() {
  return (
    <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-gradient-to-b from-sky-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
      <Canvas camera={{ position: [3, 2.5, 3], fov: 44 }} shadows gl={{ antialias: true }}>
        <Scene />
      </Canvas>
    </div>
  );
}
