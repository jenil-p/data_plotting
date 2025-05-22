import React, { useState } from 'react';
import { FiTrash2, FiPlus, FiDownload } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

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
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{project.name}</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center cursor-pointer py-2 px-6 rounded-xl bg-green-100 text-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FiDownload className="mr-2" /> Download Project PDF
          </button>
          <button
            onClick={handleDeleteProject}
            className="flex items-center cursor-pointer py-2 px-6 rounded-xl bg-red-100 text-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <FiTrash2 className="mr-2" /> Delete Project
          </button>
        </div>
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
        <form onSubmit={validateForm} className="space-y-6">
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
    </>
  );
};

export default ProjectDetailsMain;