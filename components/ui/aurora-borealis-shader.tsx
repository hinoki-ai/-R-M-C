'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const AuroraBorealisShader = () => {
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

    // 2) Aurora Borealis shaders - Original 21st.dev style
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

      // Hash function for noise
      float hash(float n) {
        return fract(sin(n) * 43758.5453);
      }

      // 2D noise function
      float noise(vec2 p) {
        vec2 ip = floor(p);
        vec2 fp = fract(p);
        fp = fp * fp * (3.0 - 2.0 * fp);

        float a = hash(ip.x + ip.y * 57.0);
        float b = hash(ip.x + 1.0 + ip.y * 57.0);
        float c = hash(ip.x + (ip.y + 1.0) * 57.0);
        float d = hash(ip.x + 1.0 + (ip.y + 1.0) * 57.0);

        return mix(mix(a, b, fp.x), mix(c, d, fp.x), fp.y);
      }

      // Fractal Brownian Motion
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;

        for(int i = 0; i < 6; i++) {
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

        float time = iTime * 0.8;

        // Create multiple aurora layers
        float aurora = 0.0;

        // Primary aurora wave
        aurora += sin(p.x * 2.0 + time * 0.5) * sin(p.y * 4.0 + time * 0.3) * 0.5 + 0.5;

        // Secondary wave with different frequency
        aurora += sin(p.x * 3.0 - time * 0.7) * cos(p.y * 3.0 + time * 0.4) * 0.3 + 0.3;

        // Tertiary wave for complexity
        aurora += sin(p.x * 1.5 + time * 0.2) * sin(p.y * 2.0 - time * 0.6) * 0.2 + 0.2;

        // Add fractal noise for organic texture
        float noisePattern = fbm(p * 3.0 + time * 0.1) * 0.3;

        // Create vertical gradient for aurora shape
        float shape = smoothstep(0.0, 0.8, 1.0 - abs(p.y));
        shape *= smoothstep(-0.5, 0.2, p.y); // Fade towards bottom

        // Apply shape to aurora
        aurora *= shape;
        aurora += noisePattern * shape;

        // Color palette - authentic aurora colors
        vec3 color1 = vec3(0.1, 0.8, 0.3);  // Bright green
        vec3 color2 = vec3(0.2, 0.4, 0.9);  // Electric blue
        vec3 color3 = vec3(0.8, 0.2, 0.9);  // Magenta
        vec3 color4 = vec3(0.9, 0.6, 0.1);  // Golden yellow

        // Create color mixing based on aurora intensity
        vec3 auroraColor = mix(color1, color2, aurora * 0.6);
        auroraColor = mix(auroraColor, color3, aurora * 0.4);
        auroraColor = mix(auroraColor, color4, aurora * 0.2);

        // Add subtle color variation
        auroraColor += noisePattern * vec3(0.1, 0.05, 0.15);

        // Create atmospheric perspective
        float depth = smoothstep(0.0, 1.0, abs(p.y));
        auroraColor *= (0.8 + depth * 0.4);

        // Add slight vignette
        float vignette = 1.0 - length(p) * 0.3;
        auroraColor *= vignette;

        // Final alpha based on aurora intensity
        float alpha = aurora * 0.7 + noisePattern * 0.3;
        alpha *= shape;

        gl_FragColor = vec4(auroraColor, alpha);
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
      aria-label="Aurora Borealis animated background"
    />
  );
};

export default AuroraBorealisShader;
