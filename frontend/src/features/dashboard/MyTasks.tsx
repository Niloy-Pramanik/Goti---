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
      case 'BUG': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'FEATURE': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default: return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border-white/60 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:bg-white group">
      
      {/* Decorative gradient blob at top right */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-brand-100 to-transparent rounded-full blur-xl opacity-60 pointer-events-none transition-opacity group-hover:opacity-100"></div>

      <div className="flex justify-between items-start mb-3 relative z-10">
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border ${getTypeColor(issue.type)}`}>
          {issue.type}
        </span>
        <select 
          value={issue.status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="text-[10px] font-bold bg-slate-100/80 hover:bg-slate-200 border-none rounded-lg py-1 px-2 outline-none text-slate-600 cursor-pointer transition-colors shadow-sm appearance-none pr-6 relative"
          style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .5rem top 50%', backgroundSize: '.65rem auto' }}
        >
          <option value="TO_DO">TO DO</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
      </div>
      
      <h4 className="font-extrabold text-slate-900 text-sm mb-1.5 leading-snug relative z-10">{issue.title}</h4>
      
      <p className="text-[11px] text-slate-500 font-medium mb-4 truncate flex items-center gap-1.5 relative z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-400/50"></span>
        {issue.projectName} {issue.milestoneName && <span className="opacity-50">• {issue.milestoneName}</span>}
      </p>
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100/80 relative z-10">
        <div className="flex gap-1.5 items-center">
          {issue.totalTimeLogged > 0 && (
            <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
              {Math.floor(issue.totalTimeLogged / 60)}h {issue.totalTimeLogged % 60}m
            </span>
          )}
        </div>
        <div className="flex gap-1.5">
        <button 
          onClick={onLogTime}
          className="p-1.5 text-slate-400 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 rounded-lg border border-transparent hover:border-brand-100 transition-all shadow-sm"
          title="Log Time"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </button>
        <button 
          onClick={onLogProgress}
          className="p-1.5 text-slate-400 bg-slate-50 hover:bg-brand-50 hover:text-brand-600 rounded-lg border border-transparent hover:border-brand-100 transition-all shadow-sm"
          title="Log Progress/Blocker"
        >
          <MessageSquare className="w-3.5 h-3.5" strokeWidth={2.5} />
        </button>
        </div>
      </div>
    </div>
  );
}
