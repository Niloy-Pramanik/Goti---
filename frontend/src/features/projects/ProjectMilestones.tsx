import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Plus, Flag } from 'lucide-react';
import apiClient from '../../api/client';
import CreateMilestoneModal from './CreateMilestoneModal';
import { useAuthStore } from '../../store/authStore';

export default function ProjectMilestones() {
  const { projectId } = useParams<{ projectId: string }>();
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/projects/${projectId}`);
      return response.data;
    },
  });

  const { data: milestones, isLoading: milestonesLoading } = useQuery({
    queryKey: ['milestones', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/projects/${projectId}/milestones`);
      return response.data;
    },
  });

  const { user } = useAuthStore();
  const { data: teamMembers } = useQuery({
    queryKey: ['teamMembers', project?.teamId],
    queryFn: async () => {
      if (!project?.teamId) return [];
      const response = await apiClient.get(`/api/teams/${project.teamId}/members`);
      return response.data;
    },
    enabled: !!project?.teamId,
  });

  const currentUserRole = teamMembers?.find((m: any) => m.userId === user?.id)?.role;
  const canCreate = currentUserRole === 'LEAD' || user?.globalRole === 'SUPER_ADMIN';

  if (projectLoading || milestonesLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!project) return <div>Project not found</div>;

  return (
    <div className="relative min-h-[calc(100vh-6rem)] max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Milestones</h1>
          <p className="text-slate-500 mt-1 font-medium">Track key deliverables for {project.name}</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setIsMilestoneModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Milestone
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {milestones?.map((milestone: any) => (
          <MilestoneCard key={milestone.id} milestone={milestone} />
        ))}
        {milestones?.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 bg-white/50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Flag className="w-5 h-5 text-slate-400" />
            </div>
            <p className="font-medium text-sm">No milestones created yet.</p>
          </div>
        )}
      </div>

      <CreateMilestoneModal isOpen={isMilestoneModalOpen} onClose={() => setIsMilestoneModalOpen(false)} projectId={projectId as string} />
    </div>
  );
}

function MilestoneCard({ milestone }: { milestone: any }) {
  const percentage = milestone.totalTasks > 0 ? (milestone.completedTasks / milestone.totalTasks) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-extrabold text-slate-900 text-lg">{milestone.name}</h3>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
          milestone.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
          milestone.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
          'bg-slate-100 text-slate-600'
        }`}>
          {milestone.status || 'PENDING'}
        </span>
      </div>
      
      {milestone.description && (
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{milestone.description}</p>
      )}

      {milestone.dueDate && (
        <p className="text-xs font-medium text-slate-500 mb-6 flex items-center gap-1.5 mt-auto">
          <Flag className="w-3.5 h-3.5" /> Due: {new Date(milestone.dueDate).toLocaleDateString()}
        </p>
      )}
      
      <div className={!milestone.dueDate ? "mt-auto" : ""}>
        <div className="flex justify-between text-xs font-bold mb-2">
          <span className="text-slate-600">Progress</span>
          <span className="text-brand-600">{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div className="bg-brand-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-right font-medium uppercase tracking-wider">
          {milestone.completedTasks || 0} of {milestone.totalTasks || 0} tasks completed
        </p>
      </div>
    </div>
  );
}
