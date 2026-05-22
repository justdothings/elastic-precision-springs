"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { SpringKind } from "@/content/site";

type SpringDirection = "left" | "right";
type ExtensionHook = "english" | "german";

export type SpringModelConfig = {
  wire: number;
  diameter: number;
  coils: number;
  length: number;
  type: SpringKind;
  extensionHook?: ExtensionHook;
  springDirection?: SpringDirection;
  torsionHand?: SpringDirection;
};

type SpringCanvasProps = SpringModelConfig & {
  className?: string;
};

type SpringDimensions = {
  bodyLength: number;
  coilRadius: number;
  wireRadius: number;
  helix: THREE.CatmullRomCurve3;
  glow: THREE.CatmullRomCurve3;
  segments: number;
  extensionLoops: THREE.CatmullRomCurve3[];
  torsionArms: THREE.CatmullRomCurve3[];
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const WATERMARK_DISTANCE_BEHIND_SPRING = 8.4;
const WATERMARK_VIEWPORT_PADDING = 1.16;

const scale = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
  const ratio = (clamp(value, inMin, inMax) - inMin) / (inMax - inMin);
  return outMin + ratio * (outMax - outMin);
};

function createSpringDimensions(config: SpringModelConfig): SpringDimensions {
  const turns = Math.round(clamp(config.coils, 3, 18));
  const bodyLength = scale(config.length, 20, 180, 2.6, 8.2);
  const coilRadius = scale(config.diameter, 8, 80, 0.36, 1.38);
  const wireRadius = scale(config.wire, 0.4, 4.5, 0.025, 0.12);
  const segments = Math.max(220, turns * 56);
  const springDirection = config.springDirection ?? config.torsionHand ?? "right";
  const windSign = springDirection === "left" ? 1 : -1;

  const helixPoints: THREE.Vector3[] = [];
  const glowPoints: THREE.Vector3[] = [];

  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments;
    const angle = windSign * t * Math.PI * 2 * turns;
    const x = (t - 0.5) * bodyLength;
    const radius = coilRadius * (1 + Math.sin(t * Math.PI * 2) * 0.018);
    const y = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    helixPoints.push(new THREE.Vector3(x, y, z));
    glowPoints.push(new THREE.Vector3(x, y * 1.004, z * 1.004));
  }

  const startX = -bodyLength / 2;
  const endX = bodyLength / 2;
  const extensionHook = config.extensionHook ?? "english";
  const extensionLoops = config.type === "extension" ? [createExtensionLoop(-1, startX, coilRadius, extensionHook, windSign), createExtensionLoop(1, endX, coilRadius, extensionHook, windSign)] : [];
  const torsionArms = config.type === "torsion" ? [createTorsionArm(-1, startX, bodyLength, coilRadius, turns, windSign), createTorsionArm(1, endX, bodyLength, coilRadius, turns, windSign)] : [];

  return {
    bodyLength,
    coilRadius,
    wireRadius,
    helix: new THREE.CatmullRomCurve3(helixPoints),
    glow: new THREE.CatmullRomCurve3(glowPoints),
    segments,
    extensionLoops,
    torsionArms,
  };
}

function appendBezierPoints(points: THREE.Vector3[], start: THREE.Vector3, c1: THREE.Vector3, c2: THREE.Vector3, end: THREE.Vector3, steps: number) {
  const curve = new THREE.CubicBezierCurve3(start, c1, c2, end);

  for (let index = 1; index <= steps; index += 1) {
    points.push(curve.getPoint(index / steps));
  }
}

function createExtensionLoop(sign: -1 | 1, endX: number, coilRadius: number, hookStyle: ExtensionHook, windSign: -1 | 1) {
  if (hookStyle === "german") return createGermanExtensionHook(sign, endX, coilRadius, windSign);
  return createEnglishExtensionHook(sign, endX, coilRadius, windSign);
}

function createEnglishExtensionHook(sign: -1 | 1, endX: number, coilRadius: number, windSign: -1 | 1) {
  const loopRadius = coilRadius;
  const centerX = endX + sign * loopRadius;
  const centerZ = 0;
  const endSpin = 1;
  const startAngle = sign === 1 ? Math.PI : 0;
  const sweep = sign * Math.PI * 1.7;
  const steps = 152;
  const start = new THREE.Vector3(endX, 0, coilRadius);
  const axisEntry = new THREE.Vector3(endX, 0, centerZ);
  const loopStartTangent = new THREE.Vector3(0, 0, -1);
  const bendLead = new THREE.Vector3(0, sign * windSign * loopRadius * 0.18, 0);
  const points: THREE.Vector3[] = [start];

  appendBezierPoints(
    points,
    start,
    start.clone().add(bendLead),
    axisEntry.clone().addScaledVector(loopStartTangent, -loopRadius * 0.46),
    axisEntry,
    44,
  );

  for (let index = 1; index <= steps; index += 1) {
    const t = index / steps;
    const angle = startAngle + t * sweep;

    points.push(
      new THREE.Vector3(
        centerX + Math.cos(angle) * loopRadius,
        0,
        centerZ + Math.sin(angle) * loopRadius * endSpin,
      ),
    );
  }

  return new THREE.CatmullRomCurve3(points, false, "centripetal", 0.38);
}

function createGermanExtensionHook(sign: -1 | 1, endX: number, coilRadius: number, windSign: -1 | 1) {
  const loopRadius = coilRadius;
  const centerX = endX + sign * loopRadius;
  const centerZ = coilRadius;
  const endSpin = (sign === -1 ? -1 : 1) * windSign;
  const startAngle = sign === 1 ? Math.PI : 0;
  const sweep = -sign * Math.PI * 1.7;
  const start = new THREE.Vector3(endX, 0, coilRadius);
  const points: THREE.Vector3[] = [start];
  const steps = 152;

  for (let index = 1; index <= steps; index += 1) {
    const t = index / steps;
    const angle = startAngle + t * sweep;

    points.push(
      new THREE.Vector3(
        centerX + Math.cos(angle) * loopRadius,
        Math.sin(angle) * loopRadius * endSpin,
        centerZ,
      ),
    );
  }

  return new THREE.CatmullRomCurve3(points, false, "centripetal", 0.38);
}

function createTorsionArm(sign: -1 | 1, endX: number, bodyLength: number, coilRadius: number, turns: number, windSign: -1 | 1) {
  const armLength = Math.min(2.75, Math.max(1.95, coilRadius * 2.2));
  const pitchPerRadian = bodyLength / (Math.PI * 2 * turns);
  const direction = new THREE.Vector3(sign * pitchPerRadian, sign * windSign * coilRadius, 0).normalize();
  const start = new THREE.Vector3(endX, 0, coilRadius);

  return new THREE.CatmullRomCurve3([
    start,
    start.clone().addScaledVector(direction, armLength * 0.25),
    start.clone().addScaledVector(direction, armLength * 0.5),
    start.clone().addScaledVector(direction, armLength * 0.75),
    start.clone().addScaledVector(direction, armLength),
  ]);
}

export default function ParametricSpringCanvas({ wire, diameter, coils, length, type, extensionHook = "english", springDirection, torsionHand = "right", className }: SpringCanvasProps) {
  const resolvedSpringDirection = springDirection ?? torsionHand;
  const config = useMemo(() => ({ wire, diameter, coils, length, type, extensionHook, springDirection: resolvedSpringDirection }), [wire, diameter, coils, length, type, extensionHook, resolvedSpringDirection]);
  const wrapperClassName = className ? `${className} block` : "relative block h-full min-h-[440px] w-full";

  return (
    <div className={wrapperClassName}>
      <Canvas camera={{ position: [0, 1.2, 8.8], fov: 42 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
        <color attach="background" args={["#05070a"]} />
        <fog attach="fog" args={["#05070a", 8, 18]} />
        <ambientLight intensity={0.42} />
        <directionalLight position={[5, 5, 5]} intensity={2.6} color="#d9f7ff" />
        <directionalLight position={[-5, -3, 4]} intensity={1.35} color="#f4c35f" />
        <pointLight position={[0, 2.8, 3]} intensity={28} color="#65d8ff" distance={12} />
        <WatermarkBackdrop />
        <SpringModel config={config} />
        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={5.8}
          maxDistance={12}
          minPolarAngle={Math.PI / 4.4}
          maxPolarAngle={Math.PI / 1.55}
          rotateSpeed={0.58}
          zoomSpeed={0.45}
        />
      </Canvas>
    </div>
  );
}

function SpringModel({ config }: { config: SpringModelConfig }) {
  const group = useRef<THREE.Group>(null);
  const dims = useMemo(() => createSpringDimensions(config), [config]);

  useFrame(({ clock, pointer }) => {
    if (!group.current) return;
    group.current.rotation.y = pointer.x * 0.14 + Math.sin(clock.elapsedTime * 0.22) * 0.045;
    group.current.rotation.x = -0.13 + pointer.y * 0.065;
  });

  return (
    <group ref={group} rotation={[0, 0, -0.08]}>
      <mesh>
        <tubeGeometry args={[dims.helix, dims.segments, dims.wireRadius, 22, false]} />
        <meshStandardMaterial color="#d9f7ff" metalness={0.92} roughness={0.19} emissive="#102934" emissiveIntensity={0.34} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <tubeGeometry args={[dims.glow, Math.round(dims.segments * 0.72), dims.wireRadius * 0.23, 10, false]} />
        <meshBasicMaterial color="#65d8ff" transparent opacity={0.45} />
      </mesh>
      {config.type === "compression" ? <CompressionEnds dims={dims} /> : null}
      {config.type === "extension" ? <ExtensionEnds dims={dims} /> : null}
      {config.type === "torsion" ? <TorsionEnds dims={dims} /> : null}
      <MeasurementFrame dims={dims} />
    </group>
  );
}

function CompressionEnds({ dims }: { dims: SpringDimensions }) {
  return (
    <>
      {([-1, 1] as const).map((sign) => (
        <group key={sign} position={[sign * (dims.bodyLength / 2), 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh>
            <torusGeometry args={[dims.coilRadius, dims.wireRadius * 0.88, 18, 112]} />
            <meshStandardMaterial color="#f2fbff" metalness={0.92} roughness={0.21} emissive="#11313c" emissiveIntensity={0.22} />
          </mesh>
          <mesh position={[0, 0, sign * dims.wireRadius * 0.32]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[dims.coilRadius + dims.wireRadius * 0.72, dims.coilRadius + dims.wireRadius * 0.72, dims.wireRadius * 0.18, 96]} />
            <meshBasicMaterial color="#65d8ff" transparent opacity={0.12} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function ExtensionEnds({ dims }: { dims: SpringDimensions }) {
  return (
    <>
      {dims.extensionLoops.map((curve, index) => (
        <group key={index}>
          <mesh>
            <tubeGeometry args={[curve, 150, dims.wireRadius * 0.95, 22, false]} />
            <meshStandardMaterial color="#f2fbff" metalness={0.94} roughness={0.18} emissive="#143441" emissiveIntensity={0.3} side={THREE.DoubleSide} />
          </mesh>
          <WireEndCap curve={curve} radius={dims.wireRadius * 0.95} color="#f2fbff" emissive="#143441" emissiveIntensity={0.3} />
        </group>
      ))}
    </>
  );
}

function TorsionEnds({ dims }: { dims: SpringDimensions }) {
  return (
    <>
      {dims.torsionArms.map((curve, index) => (
        <group key={index}>
          <mesh>
            <tubeGeometry args={[curve, 90, dims.wireRadius * 0.95, 22, false]} />
            <meshStandardMaterial color="#d9f7ff" metalness={0.92} roughness={0.19} emissive="#102934" emissiveIntensity={0.34} side={THREE.DoubleSide} />
          </mesh>
          <WireEndCap curve={curve} radius={dims.wireRadius * 0.95} color="#d9f7ff" emissive="#102934" emissiveIntensity={0.34} />
        </group>
      ))}
    </>
  );
}

function WireEndCap({ curve, radius, color, emissive, emissiveIntensity }: { curve: THREE.CatmullRomCurve3; radius: number; color: string; emissive: string; emissiveIntensity: number }) {
  const { point, rotation } = useMemo(() => {
    const point = curve.getPoint(1);
    const tangent = curve.getTangent(1).normalize();
    const rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);

    return { point, rotation };
  }, [curve]);

  return (
    <mesh position={point} quaternion={rotation}>
      <cylinderGeometry args={[radius, radius, radius * 0.12, 28]} />
      <meshStandardMaterial color={color} metalness={0.92} roughness={0.19} emissive={emissive} emissiveIntensity={emissiveIntensity} />
    </mesh>
  );
}

function MeasurementFrame({ dims }: { dims: SpringDimensions }) {
  const half = dims.bodyLength / 2;
  const y = -dims.coilRadius - 0.55;
  const width = dims.wireRadius * 0.18;

  return (
    <group>
      <mesh position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[width, width, dims.bodyLength, 8]} />
        <meshBasicMaterial color="#f4c35f" />
      </mesh>
      {([-1, 1] as const).map((sign) => (
        <mesh key={sign} position={[sign * half, y, 0]}>
          <boxGeometry args={[0.04, 0.48, 0.04]} />
          <meshBasicMaterial color="#f4c35f" />
        </mesh>
      ))}
    </group>
  );
}

function WatermarkBackdrop() {
  const mesh = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const viewDirection = useMemo(() => new THREE.Vector3(), []);
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 1536;
    canvas.height = 864;

    const context = canvas.getContext("2d");
    if (!context) return null;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "700 32px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    context.fillStyle = "rgba(207, 244, 255, 0.18)";
    context.textAlign = "center";
    context.textBaseline = "middle";

    for (let row = -1; row < 8; row += 1) {
      for (let column = -1; column < 8; column += 1) {
        context.save();
        context.translate(column * 260 + (row % 2) * 92, row * 142 + 62);
        context.rotate(-Math.PI / 12);
        context.fillText("Stevini Springs Bulgaria", 0, 0);
        context.restore();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    return texture;
  }, []);

  useFrame(() => {
    const backdrop = mesh.current;
    if (!backdrop) return;

    camera.getWorldDirection(viewDirection);
    backdrop.position.copy(viewDirection).multiplyScalar(WATERMARK_DISTANCE_BEHIND_SPRING);
    backdrop.quaternion.copy(camera.quaternion);

    const distanceFromCamera = camera.position.distanceTo(backdrop.position);

    if (camera instanceof THREE.PerspectiveCamera) {
      const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * distanceFromCamera;
      backdrop.scale.set(visibleHeight * camera.aspect * WATERMARK_VIEWPORT_PADDING, visibleHeight * WATERMARK_VIEWPORT_PADDING, 1);
    } else if (camera instanceof THREE.OrthographicCamera) {
      backdrop.scale.set(((camera.right - camera.left) / camera.zoom) * WATERMARK_VIEWPORT_PADDING, ((camera.top - camera.bottom) / camera.zoom) * WATERMARK_VIEWPORT_PADDING, 1);
    }
  });

  if (!texture) return null;

  return (
    <mesh ref={mesh} frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} side={THREE.DoubleSide} fog={false} />
    </mesh>
  );
}
