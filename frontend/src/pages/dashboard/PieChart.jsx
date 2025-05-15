import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ chart, data }) => {
  console.log('PieChart props - chart:', chart);
  console.log('PieChart props - data:', data);

  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-center py-4">No data available to render chart.</p>;
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

  console.log("chartdata",chartData);
  console.log("data",data);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: !!chart.title,
        text: chart.title,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
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
    <div className="w-full h-[450px]">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;