import React from 'react';
import { FiTrash2, FiDownload } from 'react-icons/fi';
import { Bar, Line, Scatter } from 'react-chartjs-2';
import PieChart from './PieChart';
import ThreeChart from './ThreeChart';

const ChartsDisplay = ({ charts, fullData, project, chartRefs, handleDeleteChart, handleDownloadChart }) => {
  const renderChart = (chart, index) => {
    const data = fullData;

    if (!data || data.length === 0) {
      return <p className="text-gray-500 text-center py-4">No data available to render chart.</p>;
    }

    if (chart.type === 'pie') {
      let selectedColumn = chart.dataColumn;

      if (!selectedColumn) {
        console.warn('No dataColumn specified for pie chart:', chart);
        selectedColumn = project?.file?.columns?.[0];
        if (!selectedColumn) {
          return (
            <p className="text-gray-500 text-center py-4">
              No data column available for pie chart (Chart ID: {chart._id})
            </p>
          );
        }
      }

      const pieData = data
        .map(row => row[selectedColumn])
        .filter(value => value !== undefined && value !== null);

      if (pieData.length === 0) {
        console.warn(`No valid data found for column "${selectedColumn}"`);
        return (
          <p className="text-gray-500 text-center py-4">
            No valid data found for column "{selectedColumn}"
          </p>
        );
      }

      return (
        <div
          key={index}
          className="p-6 bg-white rounded-xl shadow-md border border-gray-100 relative hover:shadow-lg transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{chart.title || 'Pie Chart'}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDownloadChart(chart._id, chart.title || 'pie-chart', chart.type)}
                className="p-2 text-blue-500 hover:bg-blue-50 hover:text-blue-700 rounded-full transition-all duration-200"
                aria-label="Download chart"
              >
                <FiDownload size={20} />
              </button>
              <button
                onClick={() => handleDeleteChart(chart._id)}
                className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full transition-all duration-200"
                aria-label="Delete chart"
              >
                <FiTrash2 size={20} />
              </button>
            </div>
          </div>
          <div className="w-full h-[400px] sm:h-[450px]">
            <PieChart
              chart={chart}
              data={pieData}
              ref={(el) => (chartRefs.current[chart._id] = el)}
            />
          </div>
        </div>
      );
    }

    const labels = data.map(row => row[chart.xAxis] || '');
    const datasetData = data.map(row => {
      const value = row[chart.yAxis];
      const numValue = parseFloat(value);
      return isNaN(numValue) ? 0 : numValue;
    });

    const chartData = {
      labels,
      datasets: [{
        label: chart.yAxis,
        data: datasetData,
        backgroundColor: chart.color,
        borderColor: chart.color,
        borderWidth: 1
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
          },
        },
        title: {
          display: true,
          text: chart.title || `${chart.type} Chart`,
          font: { size: 18, weight: 'bold', family: 'Inter' },
          color: '#1F2937',
          padding: { top: 10, bottom: 20 },
        },
        tooltip: {
          backgroundColor: '#1F2937',
          titleFont: { size: 14, family: 'Inter' },
          bodyFont: { size: 12, family: 'Inter' },
          cornerRadius: 8,
        },
      },
      scales: {
        x: {
          ticks: { color: '#6B7280', font: { family: 'Inter' } },
          grid: { display: false },
        },
        y: {
          ticks: { color: '#6B7280', font: { family: 'Inter' } },
          grid: { color: '#E5E7EB' },
        },
      },
      maintainAspectRatio: false,
    };

    return (
      <div
        key={index}
        className="p-6 bg-white rounded-xl shadow-md border border-gray-100 relative hover:shadow-lg transition-all duration-300"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{chart.title || `${chart.type} Chart`}</h3>
          <div className="flex space-x-2">
            {!(chart.type.includes('3d')) && (
              <button
                onClick={() => handleDownloadChart(chart._id, chart.title || `${chart.type}-chart`, chart.type)}
                className="p-2 text-blue-500 hover:bg-blue-50 hover:text-blue-700 rounded-full transition-all duration-200"
                aria-label="Download chart"
              >
                <FiDownload size={20} />
              </button>
            )}
            <button
              onClick={() => handleDeleteChart(chart._id)}
              className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full transition-all duration-200"
              aria-label="Delete chart"
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        </div>
        <div className="w-full h-[400px] sm:h-[450px]">
          {chart.type === 'bar' && (
            <Bar
              data={chartData}
              options={options}
              ref={(el) => (chartRefs.current[chart._id] = el)}
            />
          )}
          {chart.type === 'line' && (
            <Line
              data={chartData}
              options={options}
              ref={(el) => (chartRefs.current[chart._id] = el)}
            />
          )}
          {chart.type === 'scatter' && (
            <Scatter
              data={chartData}
              options={options}
              ref={(el) => (chartRefs.current[chart._id] = el)}
            />
          )}
          {(chart.type === 'bar3d' || chart.type === 'line3d' || chart.type === 'scatter3d') && (
            <ThreeChart chart={chart} data={data} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Charts</h2>
      {charts.length === 0 ? (
        <p className="text-gray-500 text-center py-6 text-lg">No charts added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          {charts.map((chart, index) => renderChart(chart, index))}
        </div>
      )}
    </div>
  );
};

export default ChartsDisplay;