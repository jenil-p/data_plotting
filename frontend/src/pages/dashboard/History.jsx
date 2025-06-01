import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFile, FiClock, FiTrash2, FiDownload, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { getProjects, deleteProject } from '../../api/project';
import { toast } from 'react-hot-toast';

const History = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects();
        setProjects(response.data.projects);
      } catch (error) {
        toast.error('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        setProjects(projects.filter(project => project._id !== id));
        toast.success('Project deleted successfully');
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const toggleExpanded = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Project History</h1>

      {projects.length === 0 ? (
        <p className="text-gray-500 text-center py-10 text-lg">No projects found.</p>
      ) : (
        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 sm:gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-xl shadow-md p-4 sm:p-0 sm:flex sm:flex-col animate-fade-in"
            >
              {/* Mobile Card Layout (up to 640px) */}
              <div className="sm:hidden">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <FiFile className="h-5 w-5 text-blue-500 mr-3" />
                    <Link
                      to={`/dashboard/${project._id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-base"
                    >
                      {project.name}
                    </Link>
                  </div>
                  <button
                    onClick={() => toggleExpanded(project._id)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                    aria-label={expanded[project._id] ? 'Collapse details' : 'Expand details'}
                  >
                    {expanded[project._id] ? (
                      <FiChevronUp className="h-5 w-5" />
                    ) : (
                      <FiChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {expanded[project._id] && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiClock className="h-4 w-4 mr-2" />
                      <span>
                        Last accessed: {new Date(project.lastAccessed).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {project.charts?.length || 0} charts
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex justify-end space-x-2 mt-4">
                  <Link
                    to={`/dashboard/${project._id}`}
                    className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
                  >
                    <FiFile className="h-4 w-4 mr-1" /> Open
                  </Link>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                  >
                    <FiTrash2 className="h-4 w-4 mr-1" /> Delete
                  </button>
                </div>
              </div>

              {/* Tablet and Desktop Flex Layout (640px and above) */}
              <div className="hidden sm:flex sm:justify-between sm:items-center sm:p-6 sm:hover:shadow-lg sm:transition-all sm:duration-300 sm:gap-4">
                <div className="flex-1 min-w-0 flex items-center">
                  <FiFile className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                  <Link
                    to={`/dashboard/${project._id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm truncate"
                  >
                    {project.name}
                  </Link>
                </div>
                <div className="flex-none w-28 flex items-center text-gray-600">
                  <FiClock className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-sm truncate">
                    {new Date(project.lastAccessed).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex-none max-md:w-16 w-24 flex items-center">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 whitespace-nowrap">
                    {project.charts?.length || 0} charts
                  </span>
                </div>
                <div className="flex-none flex justify-end gap-0.5">
                  <Link
                    to={`/dashboard/${project._id}`}
                    className="flex items-center px-2 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm whitespace-nowrap"
                  >
                    <FiFile className="h-4 w-4 mr-1" /> Open
                  </Link>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="flex items-center px-2 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm whitespace-nowrap"
                  >
                    <FiTrash2 className="h-4 w-4 mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;