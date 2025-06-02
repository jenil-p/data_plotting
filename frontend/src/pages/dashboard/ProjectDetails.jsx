import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getProject, getFileData, addChart, deleteProject, deleteChart } from '../../api/project';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend } from 'chart.js';
import ProjectDetailsMain from './ProjectDetailsMain';
import ChartsDisplay from './Chartdisplay';
import ChatBoard from '../../components/ChatBoard';
import { computeDataSummary, generatePDFContent } from './PdfGenerator';
import '../../App.css';
import { FiBarChart2, FiMessageSquare } from 'react-icons/fi';

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
  const [showChatModal, setShowChatModal] = useState(false);
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

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (!project) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-semibold text-gray-700">Project not found</h2>
      <p className="text-gray-500 mt-2">The requested project could not be loaded</p>
      <button
        onClick={() => navigate('/dashboard')}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Back to Dashboard
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Floating AI Assistant Button */}
      <button
        onClick={() => setShowChatModal(true)}
        className="fixed bottom-8 right-8 z-20 flex items-center justify-center w-14 h-14 max-sm:w-10 max-sm:h-10 rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 transition-all duration-300 hover:shadow-2xl"
        aria-label="Open AI Assistant"
      >
        <FiMessageSquare className="h-6 w-6 max-sm:w-4 max-sm:h-4" />
      </button>

      {/* Main Content */}
      <div className="relative">
        <ProjectDetailsMain
          project={project}
          dataPreview={dataPreview}
          chartForm={chartForm}
          setChartForm={setChartForm}
          handleAddChart={handleAddChart}
        />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              <FiBarChart2 className="inline mr-2" /> Data Visualizations
            </h2>
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
      </div>

      {/* AI Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowChatModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl max-md:w-screen w-[70vw] h-[75vh] max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300 animate-modal-open">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">AI Data Assistant</h2>
              <button
                onClick={() => setShowChatModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              <ChatBoard
                projectId={id}
                columns={project?.file?.columns || []}
                data={fullData}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;