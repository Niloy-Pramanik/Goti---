import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LayoutGrid, Loader2, ExternalLink, Clock, Users } from 'lucide-react';
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

  const { data: issues } = useQuery({
    queryKey: ['issues', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/projects/${projectId}/issues`);
      return response.data;
    },
    enabled: !!project,
  });

  const { data: teamMembers } = useQuery({
    queryKey: ['teamMembers', project?.teamId],
    queryFn: async () => {
      if (!project?.teamId) return [];
      const response = await apiClient.get(`/api/teams/${project.teamId}/members`);
      return response.data;
    },
    enabled: !!project?.teamId,
  });

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!project) return <div>Project not found</div>;

  // Calculate Time Tracking Summary
  const totalMinutes = issues?.reduce((sum: number, issue: any) => sum + (issue.totalTimeLogged || 0), 0) || 0;
  
  const memberTimeMap = new Map<string, number>();
  if (issues && teamMembers) {
    issues.forEach((issue: any) => {
      if (issue.assigneeId && issue.totalTimeLogged > 0) {
        const current = memberTimeMap.get(issue.assigneeId) || 0;
        memberTimeMap.set(issue.assigneeId, current + issue.totalTimeLogged);
      }
    });
  }

  const memberTimeList = teamMembers
    ?.map((m: any) => ({
      ...m,
      loggedMinutes: memberTimeMap.get(m.userId) || 0
    }))
    .filter((m: any) => m.loggedMinutes > 0)
    .sort((a: any, b: any) => b.loggedMinutes - a.loggedMinutes) || [];

  return (
    <div className="relative min-h-[calc(100vh-6rem)] max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex items-start gap-6 bg-white/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/60 shadow-sm">
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

      {/* Grid Layout for Stats and Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Welcome / Info Card */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-sm flex flex-col justify-center text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Welcome to {project.name}</h3>
          <p className="text-slate-500 max-w-xl mx-auto mb-6">
            Use the sidebar to navigate to the <strong>Board</strong> to track issues, or <strong>Milestones</strong> to view overall project progress.
          </p>
        </div>

        {/* Time Tracking Summary Card */}
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-500" />
            Time Tracking Summary
          </h3>
          
          <div className="mb-6 p-4 bg-brand-50 rounded-2xl border border-brand-100 flex items-center justify-between">
            <span className="text-sm font-bold text-brand-700">Total Project Time</span>
            <span className="text-xl font-black text-brand-700">
              {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              Member Contributions
            </h4>
            
            {memberTimeList.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No time logged yet.
              </p>
            ) : (
              <div className="space-y-3">
                {memberTimeList.map((member: any) => (
                  <div key={member.userId} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <span className="text-sm font-bold text-slate-700">{member.name}</span>
                    <span className="text-sm font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg">
                      {Math.floor(member.loggedMinutes / 60)}h {member.loggedMinutes % 60}m
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
