import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeChart = ({ chart, data }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Extract data for the chart
    const xData = data.map(row => parseFloat(row[chart.xAxis]) || 0);
    const yData = data.map(row => parseFloat(row[chart.yAxis]) || 0);
    const zData = data.map(row => parseFloat(row[chart.zAxis]) || 0);

    // Normalize data for better visualization
    const maxX = Math.max(...xData);
    const maxY = Math.max(...yData);
    const maxZ = Math.max(...zData);
    const scale = 5 / Math.max(maxX, maxY, maxZ, 1); // Avoid division by 0

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // White background for better contrast

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(500, 500);
    rendererRef.current = renderer;

    // Append renderer to DOM
    if (mountRef.current) {
      mountRef.current.innerHTML = ''; // Clear previous content to prevent duplicates
      mountRef.current.appendChild(renderer.domElement);
    }

    // Camera position
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.autoRotate = false;
    controlsRef.current = controls;

    // Add lighting for better visualization
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft ambient light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Add axes
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Add grid helpers for each plane
    const gridXY = new THREE.GridHelper(10, 10, 0x888888, 0x888888);
    gridXY.rotation.x = Math.PI / 2;
    scene.add(gridXY);

    const gridXZ = new THREE.GridHelper(10, 10, 0x888888, 0x888888);
    scene.add(gridXZ);

    const gridYZ = new THREE.GridHelper(10, 10, 0x888888, 0x888888);
    gridYZ.rotation.z = Math.PI / 2;
    scene.add(gridYZ);

    // Parse color
    const color = new THREE.Color(chart.color);

    // Render chart based on type with better materials
    if (chart.type === 'bar3d') {
      xData.forEach((x, i) => {
        const geometry = new THREE.BoxGeometry(0.3, yData[i] * scale, 0.3);
        const material = new THREE.MeshPhongMaterial({ color, shininess: 100 });
        const bar = new THREE.Mesh(geometry, material);
        bar.position.set(x * scale, (yData[i] * scale) / 2, zData[i] * scale);
        scene.add(bar);
      });
    } else if (chart.type === 'line3d') {
      const points = xData.map((x, i) => new THREE.Vector3(x * scale, yData[i] * scale, zData[i] * scale));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color, linewidth: 2 });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
    } else if (chart.type === 'scatter3d') {
      xData.forEach((x, i) => {
        const geometry = new THREE.SphereGeometry(0.1, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color, shininess: 100 });
        const point = new THREE.Mesh(geometry, material);
        point.position.set(x * scale, yData[i] * scale, zData[i] * scale);
        scene.add(point);
      });
    }

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      if (rendererRef.current) {
        if (mountRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
          mountRef.current.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
        rendererRef.current = null;
      }

      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }

      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
      });
    };
  }, [chart, data]);

  return (
    <div className="relative">
      <h3 className="text-lg font-semibold mb-2">{chart.title || `${chart.type} Chart`}</h3>
      <div ref={mountRef} style={{ width: '500px', height: '500px' }} />
      <div className="mt-2 text-sm text-gray-600">
        <p>X-Axis: {chart.xAxis}</p>
        <p>Y-Axis: {chart.yAxis}</p>
        <p>Z-Axis: {chart.zAxis}</p>
      </div>
    </div>
  );
};

export default ThreeChart;