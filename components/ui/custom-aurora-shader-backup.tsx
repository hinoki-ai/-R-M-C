'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Custom Aurora Shader - Backup of clowny implementation
const CustomAuroraShader = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const container = containerRef.current;
    if (!container) return;

    // 1) Renderer + Scene + Camera + Clock
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();

    // 2) Custom Aurora shaders
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;
      varying vec2 vUv;

      // Noise function
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      // Fractal noise
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;

        for(int i = 0; i < 5; i++) {
          value += amplitude * noise(p * frequency);
          amplitude *= 0.5;
          frequency *= 2.0;
        }

        return value;
      }

      void main() {
        vec2 uv = vUv;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= iResolution.x / iResolution.y;

        // Aurora layers
        float time = iTime * 0.3;

        // Main aurora wave
        float aurora1 = sin(p.x * 3.0 + time) * cos(p.y * 2.0 + time * 0.7) * 0.5 + 0.5;
        aurora1 *= smoothstep(0.0, 1.0, 1.0 - abs(p.y));

        // Secondary aurora wave
        float aurora2 = sin(p.x * 4.0 - time * 0.5) * sin(p.y * 3.0 + time * 1.2) * 0.3 + 0.3;
        aurora2 *= smoothstep(0.0, 1.0, 1.0 - abs(p.y - 0.2));

        // Add some turbulence
        float turbulence = fbm(p + time * 0.1) * 0.2;

        // Color gradients
        vec3 color1 = vec3(0.0, 0.8, 0.4); // Green
        vec3 color2 = vec3(0.2, 0.4, 1.0); // Blue
        vec3 color3 = vec3(0.8, 0.2, 0.6); // Purple

        vec3 finalColor = mix(color1, color2, aurora1);
        finalColor = mix(finalColor, color3, aurora2 * 0.5);

        // Add turbulence variation
        finalColor += turbulence * vec3(0.1, 0.2, 0.3);

        // Fade at edges
        float edgeFade = smoothstep(0.0, 0.3, 1.0 - abs(p.y));
        finalColor *= edgeFade;

        gl_FragColor = vec4(finalColor, 0.8);
      }
    `;

    // 3) Build mesh
    const uniforms = {
      iTime: { value: 0 },
      iResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    // 4) Resize logic
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.iResolution.value.set(w, h);
    };
    window.addEventListener('resize', onResize);
    onResize(); // initial sizing

    // 5) Animation loop
    renderer.setAnimationLoop(() => {
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    });

    // 6) Cleanup
    return () => {
      window.removeEventListener('resize', onResize);
      renderer.setAnimationLoop(null);

      const canvas = renderer.domElement;
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);

      material.dispose();
      mesh.geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none aurora-shader-background"
      aria-label="Custom Aurora animated background"
    />
  );
};

export default CustomAuroraShader;
