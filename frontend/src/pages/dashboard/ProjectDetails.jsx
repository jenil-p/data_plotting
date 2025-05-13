import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getProject, getFileData, addChart, deleteProject } from '../../api/project';
import { FiTrash2, FiPlus } from 'react-icons/fi';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [dataPreview, setDataPreview] = useState([]);
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartForm, setChartForm] = useState({
    type: 'bar',
    title: '',
    xAxis: '',
    yAxis: '',
    zAxis: '',
    color: '#4F46E5',
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        console.log('Fetching project with ID:', id);
        const response = await getProject(id);
        console.log('Project details response:', response);
        const projectData = response.data.project;
        if (!projectData) {
          throw new Error('Project data not found in response');
        }
        setProject(projectData);
        setCharts(projectData.charts || []);

        console.log('Fetching file data for project:', id);
        const fileData = await getFileData(id);
        console.log('File data response:', fileData);

        // Validate the response structure
        if (!fileData.data || !Array.isArray(fileData.data.data)) {
          throw new Error('Invalid file data format: data is not an array');
        }

        // Access fileData.data.data to get the array of rows
        const fileDataRows = fileData.data.data;
        console.log('File data preview (first 5 rows):', fileDataRows.slice(0, 5));
        setDataPreview(fileDataRows.slice(0, 5));
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
    setChartForm({
      ...chartForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddChart = async (e) => {
    e.preventDefault();
    if (!chartForm.xAxis || !chartForm.yAxis) {
      toast.error('Please select X and Y axes');
      return;
    }

    try {
      const response = await addChart(id, chartForm);
      setCharts(response.data.project.charts);
      toast.success('Chart added successfully');
    } catch (error) {
      console.error('Failed to add chart:', error.message);
      toast.error('Failed to add chart');
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

  if (loading) return <div>Loading project...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <button
          onClick={handleDeleteProject}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          <FiTrash2 className="inline mr-1" /> Delete Project
        </button>
      </div>

      <p>File: {project.file.originalName}</p>
      <p>Columns: {project.file.columns.join(', ')}</p>

      {/* Data Preview */}
      {dataPreview.length > 0 && project?.file?.columns ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Data Preview</h2>
          <table className="min-w-full border">
            <thead>
              <tr>
                {project.file.columns.map((col, index) => (
                  <th key={index} className="border px-4 py-2">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataPreview.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {project.file.columns.map((col, colIndex) => (
                    <td key={colIndex} className="border px-4 py-2">{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No data available to preview.</p>
      )}

      {/* Add Chart Form */}
      <div className="mt-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Add New Chart</h2>
        <form onSubmit={handleAddChart} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Chart Type</label>
            <select
              name="type"
              value={chartForm.type}
              onChange={handleChartFormChange}
              className="w-full p-2 border rounded"
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
            <label className="block text-sm font-medium mb-1">Chart Title</label>
            <input
              type="text"
              name="title"
              value={chartForm.title}
              onChange={handleChartFormChange}
              className="w-full p-2 border rounded"
              placeholder="Chart Title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">X-Axis</label>
            <select
              name="xAxis"
              value={chartForm.xAxis}
              onChange={handleChartFormChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select X-Axis</option>
              {project?.file?.columns?.map((col, index) => (
                <option key={index} value={col}>{col}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Y-Axis</label>
            <select
              name="yAxis"
              value={chartForm.yAxis}
              onChange={handleChartFormChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Y-Axis</option>
              {project?.file?.columns?.map((col, index) => (
                <option key={index} value={col}>{col}</option>
              ))}
            </select>
          </div>
          {chartForm.type.includes('3d') && (
            <div>
              <label className="block text-sm font-medium mb-1">Z-Axis</label>
              <select
                name="zAxis"
                value={chartForm.zAxis}
                onChange={handleChartFormChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Z-Axis</option>
                {project?.file?.columns?.map((col, index) => (
                  <option key={index} value={col}>{col}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <input
              type="color"
              name="color"
              value={chartForm.color}
              onChange={handleChartFormChange}
              className="w-full h-10 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            <FiPlus className="inline mr-1" /> Add Chart
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectDetails;