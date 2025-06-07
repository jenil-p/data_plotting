import React, { useState } from 'react';
import { FiTrash2, FiPlus, FiDownload } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProjectDetailsMain = ({ 
  project, 
  dataPreview, 
  chartForm, 
  setChartForm, 
  handleAddChart, 
  handleDeleteProject, 
  handleDownloadPDF 
}) => {
  const handleChartFormChange = (e) => {
    const { name, value } = e.target;
    setChartForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (e) => {
    e.preventDefault();
    if (chartForm.type === 'pie') {
      if (!chartForm.dataColumn) {
        toast.error('Please select a Data Column for the Pie chart');
        return false;
      }
    } else {
      if (!chartForm.xAxis || !chartForm.yAxis) {
        toast.error('Please select X and Y axes');
        return false;
      }
      if (chartForm.type.includes('3d') && !chartForm.zAxis) {
        toast.error('Please select Z-axis for 3D charts');
        return false;
      }
    }
    handleAddChart(e);
  };

  return (
    <div className="space-y-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      {/* Project Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{project.name}</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center py-2 px-4 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 transition-all duration-300 shadow-sm hover:shadow-md w-full sm:w-auto"
          >
            <FiDownload className="mr-2" /> Download PDF
          </button>
          <button
            onClick={handleDeleteProject}
            className="flex items-center justify-center py-2 px-4 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition-all duration-300 shadow-sm hover:shadow-md w-full sm:w-auto"
          >
            <FiTrash2 className="mr-2" /> Delete Project
          </button>
        </div>
      </div>

      {/* Columns */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Columns</h2>
        <div className="flex flex-wrap gap-2">
          {project?.file?.columns?.map((col, index) => (
            <span
              key={index}
              className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm"
            >
              {col}
            </span>
          )) || <p className="text-gray-500">No columns available</p>}
        </div>
      </div>

      {/* File Info */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">File</h2>
        <p className="text-gray-700">{project?.file?.originalName || 'No file'}</p>
      </div>

      {/* Data Preview */}
      {dataPreview.length > 0 && project?.file?.columns ? (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Data Preview (First 5 Rows)</h2>
          <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
            <table className="min-w-full">
              <thead>
                <tr className="bg-indigo-50 text-gray-800">
                  {project.file.columns.map((col, index) => (
                    <th key={index} className="border-b border-gray-200 px-4 sm:px-6 py-3 text-left text-sm font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataPreview.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-indigo-50 transition-colors duration-200">
                    {project.file.columns.map((col, colIndex) => (
                      <td key={colIndex} className="border-b border-gray-200 px-4 sm:px-6 py-3 text-gray-700">
                        {row[col] || 'N/A'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-6">No data available to preview.</p>
      )}

      {/* Add Chart Form */}
      <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Add New Chart</h2>
        <form onSubmit={validateForm} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            className="flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md w-full sm:w-auto"
          >
            <FiPlus className="mr-2" /> Add Chart
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectDetailsMain;