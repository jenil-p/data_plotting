import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getProject, getFileData, addChart, deleteProject, deleteChart } from '../../api/project';
import { FiTrash2, FiPlus, FiDownload } from 'react-icons/fi';
import { Bar, Line, Scatter, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ThreeChart from './ThreeChart';
import PieChart from './PieChart';
import ChatBoard from '../../components/Chatboard';
import '../../App.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [dataPreview, setDataPreview] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartForm, setChartForm] = useState({
    type: 'bar',
    title: '',
    xAxis: '',
    yAxis: '',
    zAxis: '',
    dataColumn: '',
    color: '#4F46E5',
  });

  // Create refs for each chart type to access Chart.js instances
  const chartRefs = useRef({});

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProject(id);
        const projectData = response.data.project;
        if (!projectData) {
          throw new Error('Project data not found in response');
        }
        setProject(projectData);
        setCharts(projectData.charts || []);

        const fileData = await getFileData(id);
        if (!fileData.data || !Array.isArray(fileData.data.data)) {
          throw new Error('Invalid file data format: data is not an array');
        }

        const fileDataRows = fileData.data.data;
        setDataPreview(fileDataRows.slice(0, 5));
        setFullData(fileDataRows);
      } catch (error) {
        console.error('Failed to fetch project or file data:', error.message);
        toast.error('Failed to load project');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, navigate]);

  const handleChartFormChange = (e) => {
    const { name, value } = e.target;
    setChartForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddChart = async (e) => {
    e.preventDefault();

    if (chartForm.type === 'pie') {
      if (!chartForm.dataColumn) {
        toast.error('Please select a Data Column for the Pie chart');
        return;
      }
    } else {
      if (!chartForm.xAxis || !chartForm.yAxis) {
        toast.error('Please select X and Y axes');
        return;
      }
      if (chartForm.type.includes('3d') && !chartForm.zAxis) {
        toast.error('Please select Z-axis for 3D charts');
        return;
      }
    }

    try {
      const chartData = {
        type: chartForm.type,
        title: chartForm.title,
        color: chartForm.color,
        ...(chartForm.type === 'pie'
          ? { dataColumn: chartForm.dataColumn }
          : {
              xAxis: chartForm.xAxis,
              yAxis: chartForm.yAxis,
              ...(chartForm.type.includes('3d') ? { zAxis: chartForm.zAxis } : {})
            }
        )
      };

      const response = await addChart(id, chartData);
      setCharts(response.data.project.charts);
      toast.success('Chart added successfully');

      setChartForm({
        type: 'bar',
        title: '',
        xAxis: '',
        yAxis: '',
        zAxis: '',
        dataColumn: '',
        color: '#4F46E5',
      });
    } catch (error) {
      console.error('Failed to add chart:', error);
      toast.error('Failed to add chart');
    }
  };

  const handleDeleteChart = async (chartId) => {
    if (confirm('Are you sure you want to delete this graph?')) {
      try {
        const response = await deleteChart(id, chartId);
        setCharts(response.data.project.charts);
        toast.success('Chart deleted successfully');
      } catch (error) {
        console.error('Failed to delete chart:', error.message);
        toast.error('Failed to delete chart');
      }
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        toast.success('Project deleted successfully');
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to delete project:', error.message);
        toast.error('Failed to delete project');
      }
    }
  };

  // Function to handle chart download with white background
  const handleDownloadChart = (chartId, chartTitle, chartType) => {
    const chartInstance = chartRefs.current[chartId];
    if (chartInstance) {
      // Create a temporary canvas to draw the chart with a white background
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = chartInstance.width;
      tempCanvas.height = chartInstance.height;
      const tempCtx = tempCanvas.getContext('2d');

      // Draw a white background on the temporary canvas
      tempCtx.fillStyle = '#ffffff';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Draw the chart's canvas onto the temporary canvas
      tempCtx.drawImage(chartInstance.canvas, 0, 0);

      // Generate the image from the temporary canvas
      const base64Image = tempCanvas.toDataURL('image/png');

      // Trigger the download
      const link = document.createElement('a');
      link.href = base64Image;
      link.download = `${chartTitle || 'chart'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error('Failed to download chart');
    }
  };

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
          className="mb-10 p-8 bg-white rounded-2xl shadow-xl border border-gray-100 relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <button
            onClick={() => handleDeleteChart(chart._id)}
            className="absolute cursor-pointer z-50 top-4 right-4 p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full transition-all duration-200"
          >
            <FiTrash2 size={20} />
          </button>
          <button
            onClick={() => handleDownloadChart(chart._id, chart.title || 'pie-chart', chart.type)}
            className="absolute cursor-pointer z-50 top-4 right-14 p-2 text-blue-500 hover:bg-blue-50 hover:text-blue-700 rounded-full transition-all duration-200"
          >
            <FiDownload size={20} />
          </button>
          <div className="w-full h-[450px]">
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
        className="mb-10 p-8 bg-white rounded-2xl shadow-xl border border-gray-100 relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <button
          onClick={() => handleDeleteChart(chart._id)}
          className="absolute cursor-pointer z-50 top-4 right-4 p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full transition-all duration-200"
        >
          <FiTrash2 size={20} />
        </button>
        {!(chart.type.includes('3d')) && (
          <button
            onClick={() => handleDownloadChart(chart._id, chart.title || `${chart.type}-chart`, chart.type)}
            className="absolute cursor-pointer z-50 top-4 right-14 p-2 text-blue-500 hover:bg-blue-50 hover:text-blue-700 rounded-full transition-all duration-200"
          >
            <FiDownload size={20} />
          </button>
        )}
        {chart.type === 'bar' && (
          <div className="w-full h-[450px]">
            <Bar
              data={chartData}
              options={options}
              ref={(el) => (chartRefs.current[chart._id] = el)}
            />
          </div>
        )}
        {chart.type === 'line' && (
          <div className="w-full h-[450px]">
            <Line
              data={chartData}
              options={options}
              ref={(el) => (chartRefs.current[chart._id] = el)}
            />
          </div>
        )}
        {chart.type === 'scatter' && (
          <div className="w-full h-[450px]">
            <Scatter
              data={chartData}
              options={options}
              ref={(el) => (chartRefs.current[chart._id] = el)}
            />
          </div>
        )}
        {(chart.type === 'bar3d' || chart.type === 'line3d' || chart.type === 'scatter3d') && (
          <ThreeChart chart={chart} data={data} />
        )}
      </div>
    );
  };

  if (loading) return <div className="text-center text-gray-500 py-10 text-lg">Loading project...</div>;
  if (!project) return <div className="text-center text-gray-500 py-10 text-lg">Project not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{project.name}</h1>
        <button
          onClick={handleDeleteProject}
          className="flex items-center cursor-pointer py-2 px-6 rounded-xl bg-red-100 text-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FiTrash2 className="mr-2" /> Delete Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <p className="text-gray-700 text-lg">
          <span className="font-semibold">File:</span> {project.file.originalName}
        </p>
        <p className="text-gray-700 text-lg">
          <span className="font-semibold">Columns:</span> {project.file.columns.join(', ')}
        </p>
      </div>

      {/* Data Preview */}
      {dataPreview.length > 0 && project?.file?.columns ? (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Preview (First 5 Rows)</h2>
          <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-indigo-100 text-gray-800">
                  {project.file.columns.map((col, index) => (
                    <th key={index} className="border-b border-gray-200 px-6 py-4 text-left text-sm font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataPreview.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-indigo-50 transition-colors duration-200">
                    {project.file.columns.map((col, colIndex) => (
                      <td key={colIndex} className="border-b border-gray-200 px-6 py-4 text-gray-700">
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-6 text-lg">No data available to preview.</p>
      )}

      {/* Add Chart Form */}
      <div className="mb-10 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add New Chart</h2>
        <form onSubmit={handleAddChart} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
              <select
                name="type"
                value={chartForm.type}
                onChange={handleChartFormChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 text-gray-900"
              >
                <option value="bar">2D Bar</option>
                <option value="line">2D Line</option>
                <option value="scatter">2D Scatter</option>
                <option value="pie">2D Pie</option>
                <option value="bar3d">3D Bar</option>
                <option value="line3d">3D Line</option>
                <option value="scatter3d">3D Scatter</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chart Title</label>
              <input
                type="text"
                name="title"
                value={chartForm.title}
                onChange={handleChartFormChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 placeholder-gray-400 text-gray-900"
                placeholder="Enter chart title"
              />
            </div>
            {chartForm.type !== 'pie' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">X-Axis</label>
                  <select
                    name="xAxis"
                    value={chartForm.xAxis}
                    onChange={handleChartFormChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 text-gray-900"
                  >
                    <option value="">Select X-Axis</option>
                    {project?.file?.columns?.map((col, index) => (
                      <option key={index} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Y-Axis</label>
                  <select
                    name="yAxis"
                    value={chartForm.yAxis}
                    onChange={handleChartFormChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 text-gray-900"
                  >
                    <option value="">Select Y-Axis</option>
                    {project?.file?.columns?.map((col, index) => (
                      <option key={index} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            {chartForm.type === 'pie' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Column</label>
                <select
                  name="dataColumn"
                  value={chartForm.dataColumn}
                  onChange={handleChartFormChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 text-gray-900"
                >
                  <option value="">Select Data Column</option>
                  {project?.file?.columns?.map((col, index) => (
                    <option key={index} value={col}>{col}</option>
                  ))}
                </select>
              </div>
            )}
            {chartForm.type.includes('3d') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Z-Axis</label>
                <select
                  name="zAxis"
                  value={chartForm.zAxis}
                  onChange={handleChartFormChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50 text-gray-900"
                >
                  <option value="">Select Z-Axis</option>
                  {project?.file?.columns?.map((col, index) => (
                    <option key={index} value={col}>{col}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <input
                type="color"
                name="color"
                value={chartForm.color}
                onChange={handleChartFormChange}
                className="w-14 h-12 border border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 transition-all duration-200"
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center bg-blue-700 text-white py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FiPlus className="mr-2" /> Add Chart
          </button>
        </form>
      </div>

      {/* AI Chat Board */}
      <div className="mb-10">
        <ChatBoard projectId={id} columns={project?.file?.columns || []} data={fullData} />
      </div>

      {/* Render Charts */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Charts</h2>
        {charts.length === 0 ? (
          <p className="text-gray-500 text-center py-6 text-lg">No charts added yet.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {charts.map((chart, index) => renderChart(chart, index))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;