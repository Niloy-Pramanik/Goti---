import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LayoutGrid, Loader2, ExternalLink } from 'lucide-react';
import apiClient from '../../api/client';

export default function ProjectOverview() {
  const { projectId } = useParams<{ projectId: string }>();

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/projects/${projectId}`);
      return response.data;
    },
  });

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!project) return <div>Project not found</div>;

  return (
    <div className="relative min-h-[calc(100vh-6rem)] max-w-6xl mx-auto">
      <div className="flex items-start gap-6 mb-12 bg-white/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/60 shadow-sm">
        <div className="flex-grow">
          <h1 className="text-4xl font-extrabold text-slate-900 flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center shadow-sm">
              <LayoutGrid className="w-6 h-6" />
            </div>
            {project.name}
          </h1>
          {project.description && (
            <p className="text-slate-500 mt-4 text-lg font-medium max-w-3xl">{project.description}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-3 mt-6">
            {project.repoLink && (
              <a href={project.repoLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 hover:shadow-md transition-all">
                <ExternalLink className="w-4 h-4" /> Code Repository
              </a>
            )}
            {project.meetingLink && (
              <a href={project.meetingLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 hover:shadow-md transition-all">
                <ExternalLink className="w-4 h-4" /> Meeting Link
              </a>
            )}
            {project.storageLink && (
              <a href={project.storageLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 hover:shadow-md transition-all">
                <ExternalLink className="w-4 h-4" /> Shared Files
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-sm text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">Welcome to {project.name}</h3>
        <p className="text-slate-500 max-w-xl mx-auto mb-6">
          Use the sidebar to navigate to the <strong>Board</strong> to track issues, or <strong>Milestones</strong> to view overall project progress.
        </p>
      </div>
    </div>
  );
}
