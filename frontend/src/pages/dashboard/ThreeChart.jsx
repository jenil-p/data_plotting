import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const ThreeChart = ({ chart, data }) => {
  const [plotlyConfig, setPlotlyConfig] = useState(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Extract data for the chart
    const xData = data.map(row => row[chart.xAxis] ?? null);
    const yData = data.map(row => row[chart.yAxis] ?? null);
    const zData = data.map(row => row[chart.zAxis] ?? null);

    // Check if data is valid
    if (!xData.length || !yData.length || !zData.length) {
      console.error('Invalid data for 3D chart:', { xData, yData, zData });
      return;
    }

    // Prepare Plotly trace
    let trace = {
      x: xData,
      y: yData,
      z: zData,
      name: `${chart.xAxis} vs ${chart.yAxis} vs ${chart.zAxis}`,
    };

    let plotTitle = `3D Plot: ${chart.yAxis} vs ${chart.xAxis} vs ${chart.zAxis}`;

    // Customize based on chart type
    if (chart.type === 'scatter3d') {
      trace.mode = 'markers';
      trace.marker = { size: 5, color: chart.color || 'rgb(23, 190, 207)' };
      trace.type = 'scatter3d';
      plotTitle = `3D Scatter Plot: ${chart.yAxis} vs ${chart.xAxis} vs ${chart.zAxis}`;
    } else if (chart.type === 'line3d') {
      trace.mode = 'lines+markers';
      trace.line = { color: chart.color || 'rgb(255, 127, 14)', width: 2 };
      trace.marker = { size: 3, color: chart.color || 'rgb(255, 127, 14)' };
      trace.type = 'scatter3d';
      plotTitle = `3D Line Plot: ${chart.yAxis} vs ${chart.xAxis} vs ${chart.zAxis}`;
    } else if (chart.type === 'bar3d') {
      // Plotly.js doesn’t have a direct "bar3d" type, so we’ll simulate it using scatter3d with larger markers
      trace.mode = 'markers';
      trace.marker = { size: 8, color: chart.color || 'rgb(75, 192, 192)', symbol: 'square' };
      trace.type = 'scatter3d';
      plotTitle = `3D Bar Plot: ${chart.yAxis} vs ${chart.xAxis} vs ${chart.zAxis}`;
    }

    const layout = {
      title: chart.title || plotTitle,
      autosize: true,
      margin: { l: 0, r: 0, b: 0, t: 40 },
      scene: {
        xaxis: { title: chart.xAxis },
        yaxis: { title: chart.yAxis },
        zaxis: { title: chart.zAxis },
      },
    };

    setPlotlyConfig({ data: [trace], layout });
  }, [chart, data]);

  if (!plotlyConfig) {
    return <p className="text-gray-500 text-center py-4">Loading 3D chart...</p>;
  }

  return (
    <div className="relative">
      <div className="w-full h-[450px]">
        <Plot
          data={plotlyConfig.data}
          layout={plotlyConfig.layout}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
          config={{ responsive: true }}
        />
      </div>
      <div className="mt-2 text-sm text-gray-600">
        <p>X-Axis: {chart.xAxis}</p>
        <p>Y-Axis: {chart.yAxis}</p>
        <p>Z-Axis: {chart.zAxis}</p>
      </div>
    </div>
  );
};

export default ThreeChart;