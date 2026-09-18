import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, CheckSquare, MessageSquare } from 'lucide-react';
import apiClient from '../../api/client';
import LogProgressModal from '../issues/LogProgressModal';
import LogTimeModal from '../issues/LogTimeModal';

export default function MyTasks() {
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: issues, isLoading } = useQuery({
    queryKey: ['my-issues'],
    queryFn: async () => {
      const response = await apiClient.get('/api/dashboard/my-issues');
      return response.data;
    },
  });

  const updateIssueStatusMutation = useMutation({
    mutationFn: async ({ issueId, status }: { issueId: string, status: string }) => {
      const response = await apiClient.patch(`/api/issues/${issueId}`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-issues'] });
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    );
  }

  const todoIssues = issues?.filter((i: any) => i.status === 'TO_DO') || [];
  const inProgressIssues = issues?.filter((i: any) => i.status === 'IN_PROGRESS') || [];
  const doneIssues = issues?.filter((i: any) => i.status === 'DONE') || [];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center shadow-sm">
          <CheckSquare className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">My Tasks</h1>
          <p className="text-slate-500 mt-1 font-medium">All tasks assigned to you across all projects</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TO DO Column */}
        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-4 flex justify-between">
            TO DO <span className="bg-slate-200 text-slate-600 px-2 rounded-full text-xs flex items-center">{todoIssues.length}</span>
          </h3>
          <div className="space-y-3">
            {todoIssues.map((issue: any) => (
              <TaskCard 
                key={issue.id} 
                issue={issue} 
                onStatusChange={(status) => updateIssueStatusMutation.mutate({ issueId: issue.id, status })}
                onLogProgress={() => { setActiveIssueId(issue.id); setIsLogModalOpen(true); }}
                onLogTime={() => { setActiveIssueId(issue.id); setIsTimeModalOpen(true); }}
              />
            ))}
            {todoIssues.length === 0 && (
              <div className="text-center py-6 text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl">
                No tasks
              </div>
            )}
          </div>
        </div>
        
        {/* IN PROGRESS Column */}
        <div className="bg-brand-50/30 rounded-2xl p-4 border border-brand-100">
          <h3 className="font-bold text-brand-700 mb-4 flex justify-between">
            IN PROGRESS <span className="bg-brand-100 text-brand-600 px-2 rounded-full text-xs flex items-center">{inProgressIssues.length}</span>
          </h3>
          <div className="space-y-3">
            {inProgressIssues.map((issue: any) => (
              <TaskCard 
                key={issue.id} 
                issue={issue} 
                onStatusChange={(status) => updateIssueStatusMutation.mutate({ issueId: issue.id, status })}
                onLogProgress={() => { setActiveIssueId(issue.id); setIsLogModalOpen(true); }}
                onLogTime={() => { setActiveIssueId(issue.id); setIsTimeModalOpen(true); }}
              />
            ))}
            {inProgressIssues.length === 0 && (
              <div className="text-center py-6 text-sm text-brand-400 border border-dashed border-brand-200 rounded-xl">
                No tasks
              </div>
            )}
          </div>
        </div>

        {/* DONE Column */}
        <div className="bg-green-50/30 rounded-2xl p-4 border border-green-100">
          <h3 className="font-bold text-green-700 mb-4 flex justify-between">
            DONE <span className="bg-green-100 text-green-600 px-2 rounded-full text-xs flex items-center">{doneIssues.length}</span>
          </h3>
          <div className="space-y-3">
            {doneIssues.map((issue: any) => (
              <TaskCard 
                key={issue.id} 
                issue={issue} 
                onStatusChange={(status) => updateIssueStatusMutation.mutate({ issueId: issue.id, status })}
                onLogProgress={() => { setActiveIssueId(issue.id); setIsLogModalOpen(true); }}
                onLogTime={() => { setActiveIssueId(issue.id); setIsTimeModalOpen(true); }}
              />
            ))}
            {doneIssues.length === 0 && (
              <div className="text-center py-6 text-sm text-green-400 border border-dashed border-green-200 rounded-xl">
                No tasks
              </div>
            )}
          </div>
        </div>
      </div>

      {activeIssueId && (
        <>
          <LogProgressModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} issueId={activeIssueId} />
          <LogTimeModal isOpen={isTimeModalOpen} onClose={() => setIsTimeModalOpen(false)} issueId={activeIssueId} />
        </>
      )}
    </div>
  );
}

function TaskCard({ issue, onStatusChange, onLogProgress, onLogTime }: { issue: any, onStatusChange: (s: string) => void, onLogProgress: () => void, onLogTime: () => void }) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BUG': return 'bg-red-50 text-red-600 border-red-100';
      case 'FEATURE': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider border ${getTypeColor(issue.type)}`}>
          {issue.type}
        </span>
        <select 
          value={issue.status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded p-1 outline-none font-medium text-slate-700"
        >
          <option value="TO_DO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>
      <h4 className="font-bold text-slate-900 text-sm mb-1">{issue.title}</h4>
      <p className="text-xs text-slate-400 font-medium mb-3 truncate flex items-center gap-1">
        {issue.projectName} {issue.milestoneName && `• ${issue.milestoneName}`}
      </p>
      <div className="flex items-center justify-end mt-3 pt-3 border-t border-slate-100 gap-2">
        <button 
          onClick={onLogTime}
          className="text-slate-400 hover:text-brand-600 transition-colors"
          title="Log Time"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </button>
        <button 
          onClick={onLogProgress}
          className="text-slate-400 hover:text-brand-600 transition-colors"
          title="Log Progress/Blocker"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
