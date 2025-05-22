import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getProject, getFileData, addChart, deleteProject, deleteChart } from '../../api/project';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend } from 'chart.js';
import ProjectDetailsMain from './ProjectDetailsMain';
import ChartsDisplay from './Chartdisplay';
import ChatBoard from '../../components/Chatboard';
import { computeDataSummary, generatePDFContent } from './PdfGenerator';
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

  const handleAddChart = async (e) => {
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

  const handleDownloadChart = (chartId, chartTitle, chartType) => {
    const chartInstance = chartRefs.current[chartId];
    if (chartInstance && chartInstance.canvas) {
      const canvas = chartInstance.canvas;
      const renderedWidth = canvas.offsetWidth;
      const renderedHeight = canvas.offsetHeight;
      const pixelRatio = window.devicePixelRatio || 1;
      const padding = 40;
      const downloadWidth = (renderedWidth + padding * 2) * pixelRatio;
      const downloadHeight = (renderedHeight + padding * 2) * pixelRatio;

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = downloadWidth;
      tempCanvas.height = downloadHeight;
      const tempCtx = tempCanvas.getContext('2d');

      tempCtx.scale(pixelRatio, pixelRatio);
      tempCtx.fillStyle = '#ffffff';
      tempCtx.fillRect(0, 0, downloadWidth / pixelRatio, downloadHeight / pixelRatio);
      tempCtx.drawImage(canvas, padding, padding, renderedWidth, renderedHeight);

      const base64Image = tempCanvas.toDataURL('image/png');
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

  const handleDownloadPDF = () => {
    try {
      const dataSummary = computeDataSummary(fullData, project?.file?.columns);
      const doc = generatePDFContent(project, dataPreview, charts, dataSummary, chartRefs);
      doc.save(`${project?.name || 'project'}_summary.pdf`);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  if (loading) return <div className="text-center text-gray-500 py-10 text-lg">Loading project...</div>;
  if (!project) return <div className="text-center text-gray-500 py-10 text-lg">Project not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <ProjectDetailsMain
        project={project}
        dataPreview={dataPreview}
        chartForm={chartForm}
        setChartForm={setChartForm}
        handleAddChart={handleAddChart}
        handleDeleteProject={handleDeleteProject}
        handleDownloadPDF={handleDownloadPDF}
      />
      <div className="mb-10">
        <ChatBoard projectId={id} columns={project?.file?.columns || []} data={fullData} />
      </div>
      <ChartsDisplay
        charts={charts}
        fullData={fullData}
        project={project}
        chartRefs={chartRefs}
        handleDeleteChart={handleDeleteChart}
        handleDownloadChart={handleDownloadChart}
      />
    </div>
  );
};

export default ProjectDetails;