import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Circle, CheckCircle2, BarChart2, Plus, Calendar, Clock, MessageSquare } from 'lucide-react';
import apiClient from '../../api/client';
import LogProgressModal from '../issues/LogProgressModal';
import LogTimeModal from '../issues/LogTimeModal';
import CreateDashboardTaskModal from './CreateDashboardTaskModal';

export default function MyTasks() {
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: issues, isLoading } = useQuery({
    queryKey: ['my-issues'],
    queryFn: async () => {
      const response = await apiClient.get('/api/dashboard/my-issues');
      return response.data;
    },
    refetchInterval: 5000,
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

  // Next status rotation: TO_DO -> IN_PROGRESS -> DONE -> TO_DO
  const handleStatusToggle = (issue: any) => {
    let nextStatus = 'IN_PROGRESS';
    if (issue.status === 'IN_PROGRESS') nextStatus = 'DONE';
    if (issue.status === 'DONE') nextStatus = 'TO_DO';
    updateIssueStatusMutation.mutate({ issueId: issue.id, status: nextStatus });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-slate-800">My Tasks</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
            <Calendar className="w-3.5 h-3.5" />
            Due Date
          </button>
          <button 
            onClick={() => setIsNewTaskModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Task List */}
      <div>
        <h2 className="text-sm font-bold text-slate-700 mb-4">Other</h2>
        
        <div className="flex flex-col">
          {issues?.length === 0 && (
            <div className="text-center py-10 text-sm text-slate-400">
              No tasks assigned to you.
            </div>
          )}
          
          {issues?.map((issue: any) => (
            <div 
              key={issue.id} 
              className="group flex items-center justify-between py-2.5 px-3 -mx-3 rounded-lg border border-transparent hover:border-slate-200 hover:shadow-sm transition-all bg-transparent hover:bg-white"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Status Toggle */}
                <button 
                  onClick={() => handleStatusToggle(issue)}
                  className="flex-shrink-0 focus:outline-none"
                >
                  {issue.status === 'DONE' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 fill-green-50" />
                  ) : issue.status === 'IN_PROGRESS' ? (
                    <div className="w-4 h-4 rounded-full border-2 border-yellow-400 flex items-center justify-center relative overflow-hidden">
                       <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-yellow-400"></div>
                    </div>
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 hover:text-slate-400" />
                  )}
                </button>
                
                {/* Type/Priority Icon */}
                <BarChart2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                
                {/* Title */}
                <span className={`text-sm text-slate-700 truncate ${issue.status === 'DONE' ? 'line-through text-slate-400' : ''}`}>
                  {issue.title}
                </span>
                
                {/* Assignee Avatar (Dummy) */}
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[9px] font-bold text-white ml-2">
                  ME
                </div>

                {/* Hover Actions (Log Time, Log Progress) */}
                <div className="hidden group-hover:flex items-center gap-1 ml-4">
                  <button 
                    onClick={() => { setActiveIssueId(issue.id); setIsTimeModalOpen(true); }}
                    className="p-1 rounded bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                    title="Log Time"
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => { setActiveIssueId(issue.id); setIsLogModalOpen(true); }}
                    className="p-1 rounded bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                    title="Log Progress"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              
              {/* Project Name & Extra Actions */}
              <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                {issue.dueDate && (
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(issue.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
                <span className="text-[11px] text-slate-500">
                  {issue.projectName || 'Getting Started'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {activeIssueId && (
        <>
          <LogProgressModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} issueId={activeIssueId} />
          <LogTimeModal isOpen={isTimeModalOpen} onClose={() => setIsTimeModalOpen(false)} issueId={activeIssueId} />
        </>
      )}

      <CreateDashboardTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
      />
    </div>
  );
}
