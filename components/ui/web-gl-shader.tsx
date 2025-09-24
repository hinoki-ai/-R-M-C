'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function WebGLShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);
  const sceneRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.OrthographicCamera | null;
    renderer: THREE.WebGLRenderer | null;
    mesh: THREE.Mesh | null;
    uniforms: any;
    animationId: number | null;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const { current: refs } = sceneRef;

    // Check for WebGL support
    try {
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.warn('WebGL not supported, WebGL shader will not display');
        return;
      }
    } catch (e) {
      console.warn('WebGL initialization failed:', e);
      return;
    }

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        float t = time * 0.001;

        // Create animated wave patterns
        float wave1 = sin(uv.x * 10.0 + t) * sin(uv.y * 8.0 + t * 0.7);
        float wave2 = sin(uv.x * 15.0 - t * 0.5) * sin(uv.y * 12.0 - t * 0.3);

        // Create color gradients
        float r = 0.5 + 0.5 * sin(t + uv.x * 5.0);
        float g = 0.5 + 0.5 * sin(t * 0.8 + uv.y * 5.0);
        float b = 0.5 + 0.5 * sin(t * 1.2 + (uv.x + uv.y) * 3.0);

        // Combine waves with colors
        vec3 color = vec3(r, g, b) * (0.6 + 0.4 * (wave1 + wave2));

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const initScene = () => {
      refs.scene = new THREE.Scene();
      refs.renderer = new THREE.WebGLRenderer({ canvas });
      refs.renderer.setPixelRatio(window.devicePixelRatio);
      refs.renderer.setClearColor(new THREE.Color(0x000000));

      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

      refs.uniforms = {
        resolution: { value: [window.innerWidth, window.innerHeight] },
        time: { value: 0.0 },
        xScale: { value: 1.0 },
        yScale: { value: 0.5 },
        distortion: { value: 0.05 },
      };

      const geometry = new THREE.PlaneGeometry(2, 2);

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms,
        transparent: true,
        side: THREE.DoubleSide,
      });

      refs.mesh = new THREE.Mesh(geometry, material);
      refs.scene.add(refs.mesh);

      // Check for shader compilation errors
      const gl = refs.renderer.getContext();
      if (gl.getError() !== gl.NO_ERROR) {
        console.error('WebGL shader compilation error');
        return;
      }

      handleResize();
    };

    const animate = () => {
      if (refs.uniforms) refs.uniforms.time.value += 0.01;
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera);
      }
      refs.animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      refs.renderer.setSize(width, height, false);
      refs.uniforms.resolution.value = [width, height];
    };

    initScene();
    animate();
    window.addEventListener('resize', handleResize);

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      window.removeEventListener('resize', handleResize);
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh);
        refs.mesh.geometry.dispose();
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose();
        }
      }
      refs.renderer?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full block"
    />
  );
}
