import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TailProps {
  tailColor: string;
  finColor: string;
}

export default function Tail({ tailColor, finColor }: TailProps) {
  // Shared uniform object to sync the wave animation across both meshes
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: 3.4 },
      uAmp: { value: 0.35 },
      uFreq: { value: 3.0 },
    }),
    [],
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;
  });

  const onBeforeCompile = (shader: any) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uSpeed = uniforms.uSpeed;
    shader.uniforms.uAmp = uniforms.uAmp;
    shader.uniforms.uFreq = uniforms.uFreq;

    shader.vertexShader = `
      uniform float uTime;
      uniform float uSpeed;
      uniform float uAmp;
      uniform float uFreq;
      ${shader.vertexShader}
    `;

    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `
      #include <begin_vertex>
      
      float normalizedY = abs(position.y) / 1.24; 
      float swingAmp = pow(normalizedY, 1.8) * uAmp;
      float wave = sin(position.y * uFreq - (uTime * uSpeed)) * swingAmp;
      
      transformed.x += wave;
      `,
    );
  };

  const tailGeo = useMemo(() => {
    // FIX: Taper the cylinder all the way to 0 radius at the tip
    const geo = new THREE.CylinderGeometry(0.26, 0.0, 1.24, 16, 32);
    geo.translate(0, -0.62, 0);
    return geo;
  }, []);

  // Use a squashed sphere to create the curved, organic fin membrane.
  const finGeo = useMemo(() => {
    // A standard sphere naturally tapers to a point at its top and bottom poles.
    const geo = new THREE.SphereGeometry(1, 16, 32);

    // Stretch and flatten the sphere into a membrane
    geo.scale(0.06, 0.7, 0.28);

    // Position the sphere coordinate space with the tail
    geo.translate(0, -0.65, 0);
    return geo;
  }, []);

  return (
    <group position={[0, -0.01, -0.5]}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        {/* Main Tail Body */}
        <mesh geometry={tailGeo}>
          <meshStandardMaterial
            color={tailColor}
            roughness={0.66}
            onBeforeCompile={onBeforeCompile}
            customProgramCacheKey={() => "tail-shader"}
          />
        </mesh>

        {/* Curved Fin Membrane */}
        <mesh geometry={finGeo}>
          <meshStandardMaterial
            color={finColor}
            transparent
            opacity={0.72}
            emissive={finColor}
            emissiveIntensity={0.16}
            onBeforeCompile={onBeforeCompile}
            customProgramCacheKey={() => "fin-shader"}
          />
        </mesh>
      </group>
    </group>
  );
}
