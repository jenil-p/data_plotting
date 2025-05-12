import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProject } from '../../api/project';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        console.log('Fetching project with ID:', id);
        const response = await getProject(id);
        console.log('Project details response:', response);
        setProject(response.data.project);
      } catch (error) {
        console.error('Failed to fetch project:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <div>Loading project...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{project.name}</h1>
      <p>File: {project.file.originalName}</p>
      <p>Columns: {project.file.columns.join(', ')}</p>
    </div>
  );
};

export default ProjectDetails;