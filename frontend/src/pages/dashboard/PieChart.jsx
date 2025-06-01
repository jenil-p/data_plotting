import React, { forwardRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Use forwardRef to pass the ref to the Pie component
const PieChart = forwardRef(({ chart, data }, ref) => {
  if (!data || data.length === 0) {
    return <p className="text-gray-600 text-center py-4">No data available to render chart.</p>;
  }

  // Process data directly since data is already the array of values
  const valueCounts = {};
  data.forEach(value => {
    const formattedValue = value?.toString() || 'Unknown';
    valueCounts[formattedValue] = (valueCounts[formattedValue] || 0) + 1;
  });

  const labels = Object.keys(valueCounts);
  const datasetData = Object.values(valueCounts);

  const backgroundColors = [
    chart.color || '#4F46E5',
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
    '#9966FF', '#FF9F40', '#8AC24A', '#EA5F89'
  ];

  const chartData = {
    labels,
    datasets: [{
      data: datasetData,
      backgroundColor: labels.map((_, i) => backgroundColors[i % backgroundColors.length]),
      borderColor: '#ffffff',
      borderWidth: 2
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, family: 'Inter' },
          color: '#1F2937',
          padding: 20,
          boxWidth: 20,
        },
      },
      title: {
        display: true,
        text: chart.title || `Pie Chart: ${chart.dataColumn || 'Data'}`,
        font: { size: 18, weight: 'bold', family: 'Inter' },
        color: '#1F2937',
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleFont: { size: 14, family: 'Inter' },
        bodyFont: { size: 12, family: 'Inter' },
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-[500px] bg-white flex flex-col items-center">
      <Pie
        ref={ref}
        data={chartData}
        options={options}
      />
      <p className="mt-2 text-sm text-gray-600">
        Data: {chart.dataColumn || 'Unknown'}
      </p>
    </div>
  );
});

export default PieChart;