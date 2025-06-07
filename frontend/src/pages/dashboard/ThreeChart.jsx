import React, { useEffect, useState, useRef } from 'react';
import Plot from 'react-plotly.js';

const ThreeChart = ({ chart, data }) => {
  const [plotlyConfig, setPlotlyConfig] = useState(null);
  const plotContainerRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Extract data for the chart
    const xData = data.map(row => row[chart.xAxis] ?? null).map(val => parseFloat(val)).filter(val => !isNaN(val));
    const yData = data.map(row => row[chart.yAxis] ?? null).map(val => parseFloat(val)).filter(val => !isNaN(val));
    const zData = data.map(row => row[chart.zAxis] ?? null).map(val => parseFloat(val)).filter(val => !isNaN(val));

    // Check if data is valid
    if (!xData.length || !yData.length || !zData.length) {
      console.error('Invalid data for 3D chart:', { xData, yData, zData });
      return;
    }

    let traces = [];
    let plotTitle = `3D Plot: ${chart.yAxis} vs ${chart.xAxis} vs ${chart.zAxis}`;

    // Customize based on chart type
    if (chart.type === 'scatter3d') {
      traces.push({
        x: xData,
        y: yData,
        z: zData,
        mode: 'markers',
        marker: { 
          size: 5, 
          color: chart.color || 'rgb(23, 190, 207)',
          symbol: 'circle',
        },
        type: 'scatter3d',
        name: `${chart.xAxis} vs ${chart.yAxis} vs ${chart.zAxis}`,
      });
      plotTitle = `3D Scatter Plot: ${chart.yAxis} vs ${chart.xAxis} vs ${chart.zAxis}`;
    } else if (chart.type === 'line3d') {
      traces.push({
        x: xData,
        y: yData,
        z: zData,
        mode: 'lines+markers',
        line: { color: chart.color || 'rgb(255, 127, 14)', width: 2 },
        marker: { 
          size: 3, 
          color: chart.color || 'rgb(255, 127, 14)',
          symbol: 'circle',
        },
        type: 'scatter3d',
        name: `${chart.xAxis} vs ${chart.yAxis} vs ${chart.zAxis}`,
      });
      plotTitle = `3D Line Plot: ${chart.yAxis} vs ${chart.xAxis} vs ${chart.zAxis}`;
    } 

    // Get container dimensions
    const containerWidth = plotContainerRef.current?.offsetWidth || 400;
    const containerHeight = plotContainerRef.current?.offsetHeight || 450;

    const layout = {
      title: chart.title || plotTitle,
      width: containerWidth,
      height: containerHeight,
      margin: { l: 10, r: 10, b: 10, t: 40 },
      scene: {
        xaxis: { 
          title: chart.xAxis,
          tickmode: 'auto',
          gridcolor: 'rgba(0, 0, 0, 0.2)',
        },
        yaxis: { 
          title: chart.yAxis,
          tickmode: 'auto',
          gridcolor: 'rgba(0, 0, 0, 0.2)',
        },
        zaxis: { 
          title: chart.zAxis,
          tickmode: 'auto',
          gridcolor: 'rgba(0, 0, 0, 0.2)',
          range: [0, Math.max(...zData) * 1.1], // Start z-axis at 0 for bar-like effect
        },
        aspectmode: 'cube', // Equal scaling for better visualization
        camera: {
          eye: { x: 1.8, y: 1.8, z: 1.2 }, // Adjusted for better 3D view
        },
      },
    };

    setPlotlyConfig({ data: traces, layout });
  }, [chart, data]);

  // Handle window resize to update chart dimensions
  useEffect(() => {
    const handleResize = () => {
      if (plotContainerRef.current && plotlyConfig) {
        const containerWidth = plotContainerRef.current.offsetWidth;
        const containerHeight = plotContainerRef.current.offsetHeight;
        setPlotlyConfig((prev) => ({
          ...prev,
          layout: {
            ...prev.layout,
            width: containerWidth,
            height: containerHeight,
          },
        }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [plotlyConfig]);

  if (!plotlyConfig) {
    return <p className="text-gray-500 text-center py-4">Loading 3D chart...</p>;
  }

  return (
    <div className="relative w-full h-[450px]" ref={plotContainerRef}>
      <Plot
        data={plotlyConfig.data}
        layout={plotlyConfig.layout}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
        config={{ responsive: true }}
      />
      <div className="mt-2 text-sm text-gray-600">
        <p>X-Axis: {chart.xAxis}</p>
        <p>Y-Axis: {chart.yAxis}</p>
        <p>Z-Axis: {chart.zAxis}</p>
      </div>
    </div>
  );
};

export default ThreeChart;