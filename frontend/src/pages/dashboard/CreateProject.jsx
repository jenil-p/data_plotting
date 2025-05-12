import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { createProject } from '../../api/project';
import { FiUpload, FiX, FiSave, FiTrash2 } from 'react-icons/fi';

const CreateProject = () => {
  const [file, setFile] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  console.log('CreateProject component rendered, user state:', user);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validExtensions = ['.csv', '.xlsx', '.xls'];
      const fileExt = selectedFile.name.split('.').pop().toLowerCase();
      if (!validExtensions.includes(`.${fileExt}`)) {
        toast.error('Only CSV and Excel files are allowed!');
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!file) {
    toast.error('Please select a file');
    return;
  }

  setIsLoading(true);
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (projectName) formData.append('name', projectName);

    const response = await createProject(formData);
    toast.success('Project created successfully!');
    
    // Navigate to project details
    navigate(`/dashboard/${response.data.project._id}`);
    
  } catch (error) {
    toast.error(error.message || 'Failed to create project');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Project Name (optional)</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="My Awesome Project"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Upload File (CSV or Excel)</label>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            {file ? (
              <div className="flex items-center justify-between bg-gray-100 p-3 rounded">
                <span>{file.name}</span>
                <button 
                  type="button" 
                  onClick={() => setFile(null)}
                  className="text-red-500"
                >
                  <FiX />
                </button>
              </div>
            ) : (
              <>
                <FiUpload className="mx-auto text-3xl mb-2 text-gray-400" />
                <input
                  type="file"
                  id="file-upload"
                  name="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                >
                  Choose a file
                </label>
                <p className="text-sm text-gray-500 mt-2">or drag and drop</p>
              </>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!file || isLoading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
};

export default CreateProject;