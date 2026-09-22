import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Loader2, Calendar as CalendarIcon, User, ChevronLeft, ChevronRight, Sun, CalendarDays, ArchiveX } from 'lucide-react';
import apiClient from '../../api/client';
import { useAuthStore } from '../../store/authStore';


// --- CUSTOM ASSIGNEE PICKER COMPONENT ---
function AssigneePopover({ members, value, onChange, onClose }: { members: any[], value: string, onChange: (id: string) => void, onClose: () => void }) {
  if (!members || members.length === 0) {
    return (
      <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-xl border border-slate-100 w-64 z-50 overflow-hidden p-4">
        <p className="text-sm text-slate-500 text-center">Select a project first</p>
      </div>
    );
  }

  return (
    <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-xl border border-slate-100 w-64 z-50 overflow-hidden max-h-64 overflow-y-auto">
      <div className="p-2 space-y-1">
        {members.map(member => (
          <button
            key={member.userId}
            type="button"
            onClick={() => { onChange(member.userId); onClose(); }}
            className={`w-full flex items-center gap-3 p-2 rounded-lg text-sm transition-colors ${value === member.userId ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-[10px] font-bold">
              {member.email?.charAt(0).toUpperCase()}
            </div>
            <span className="truncate">{member.email}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
// --- END CUSTOM ASSIGNEE PICKER ---

// --- CUSTOM DATE PICKER COMPONENT ---
function DatePickerPopover({ value, onChange, onClose }: { value: string; onChange: (d: string) => void, onClose: () => void }) {
  const [currentDate, setCurrentDate] = useState(() => value ? new Date(value) : new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  // Standardize to Monday start: Monday=0 ... Sunday=6
  const firstDayAdjusted = (getFirstDayOfMonth(year, month) + 6) % 7; 

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const selectDate = (d: number) => {
    const selected = new Date(Date.UTC(year, month, d));
    onChange(selected.toISOString().split('T')[0]);
    onClose();
  };

  const setQuickDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    onChange(d.toISOString().split('T')[0]);
    onClose();
  };

  const getDayClass = (d: number) => {
    const dStr = new Date(Date.UTC(year, month, d)).toISOString().split('T')[0];
    if (value && value.startsWith(dStr)) {
      return "bg-slate-700 text-white hover:bg-slate-800";
    }
    return "text-slate-700 hover:bg-slate-100";
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-xl border border-slate-100 w-72 z-50 overflow-hidden">
      <div className="p-4 border-b border-slate-100 space-y-3">
        <button type="button" onClick={() => setQuickDate(0)} className="flex items-center gap-3 w-full p-2 hover:bg-slate-50 rounded-lg text-sm text-slate-700 transition-colors">
          <CalendarIcon className="w-4 h-4 text-slate-400" />
          <span>Today</span>
          <span className="ml-auto text-slate-400 text-xs uppercase">{new Date().toLocaleDateString('en-US', { weekday: 'short' })}</span>
        </button>
        <button type="button" onClick={() => setQuickDate(1)} className="flex items-center gap-3 w-full p-2 hover:bg-slate-50 rounded-lg text-sm text-slate-700 transition-colors">
          <Sun className="w-4 h-4 text-slate-400" />
          <span>Tomorrow</span>
          <span className="ml-auto text-slate-400 text-xs uppercase">{new Date(Date.now() + 86400000).toLocaleDateString('en-US', { weekday: 'short' })}</span>
        </button>
        <button type="button" onClick={() => setQuickDate(7)} className="flex items-center gap-3 w-full p-2 hover:bg-slate-50 rounded-lg text-sm text-slate-700 transition-colors">
          <CalendarDays className="w-4 h-4 text-slate-400" />
          <span>Next Week</span>
          <span className="ml-auto text-slate-400 text-xs uppercase">{new Date(Date.now() + 86400000 * 7).toLocaleDateString('en-US', { weekday: 'short' })}</span>
        </button>
        <button type="button" onClick={() => { onChange(''); onClose(); }} className="flex items-center gap-3 w-full p-2 hover:bg-slate-50 rounded-lg text-sm text-slate-700 transition-colors">
          <ArchiveX className="w-4 h-4 text-slate-400" />
          <span>No Date</span>
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronLeft className="w-4 h-4" /></button>
          <span className="font-bold text-sm text-slate-900">{monthNames[month]} {year}</span>
          <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronRight className="w-4 h-4" /></button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map(day => (
            <div key={day} className="text-[10px] font-bold text-slate-400">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayAdjusted }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const d = i + 1;
            return (
              <button
                key={d}
                type="button"
                onClick={() => selectDate(d)}
                className={`w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center transition-colors ${getDayClass(d)}`}
              >
                {d}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
// --- END CUSTOM DATE PICKER ---


interface CreateDashboardTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateDashboardTaskModal({ isOpen, onClose }: CreateDashboardTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [assigneeId, setAssigneeId] = useState<string>('');
  
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isAssigneePickerOpen, setIsAssigneePickerOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  useEffect(() => {
    if (isOpen && user?.id && !assigneeId) {
      setAssigneeId(user.id);
    }
  }, [isOpen, user?.id]);


  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['myProjects'],
    queryFn: async () => {
      const response = await apiClient.get('/api/dashboard/my-projects');
      return response.data;
    },
    enabled: isOpen,
  });

  
  const selectedProject = projects?.find((p: any) => p.id === projectId);
  
  const { data: teamMembers } = useQuery({
    queryKey: ['teamMembers', selectedProject?.teamId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/teams/${selectedProject.teamId}/members`);
      return response.data;
    },
    enabled: !!selectedProject?.teamId,
  });

  const createIssueMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post(`/api/projects/${projectId}/issues`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myIssues'] });
      setTitle('');
      setDescription('');
      setProjectId('');
      setDueDate('');
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create task');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!projectId) {
      setError('Please select a project');
      return;
    }
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    const payload: any = { 
      title, 
      description, 
      type: 'TASK',
      assigneeId: assigneeId || user?.id 
    };
    
    if (dueDate) {
      // API expects OffsetDateTime, send full string
      payload.dueDate = new Date(dueDate).toISOString();
    }

    createIssueMutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      {/* Flat layout card as in screenshot */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-visible relative flex flex-col min-h-[350px]">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col h-full flex-1">
          <div className="p-6 flex-1 flex flex-col">
            {error && (
              <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            {/* Top Project Selector */}
            <div className="mb-6 w-48">
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full text-sm text-slate-600 bg-transparent border-0 outline-none hover:text-slate-900 cursor-pointer appearance-none px-0 font-medium"
                required
              >
                <option value="" disabled hidden>Select Project</option>
                {projects?.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Task Title (Large H1 style) */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl font-bold text-slate-900 placeholder:text-slate-300 border-0 outline-none p-0 mb-4 bg-transparent"
              placeholder="Task Title"
              autoFocus
              required
            />

            {/* Description textarea */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-base text-slate-600 placeholder:text-slate-400 border-0 outline-none p-0 bg-transparent flex-1 resize-none"
              placeholder="Add Description..."
            />
          </div>

          {/* Bottom Toolbar */}
          <div className="border-t border-slate-100 p-4 flex items-center gap-3">
            
            {/* Assignee */}
            <div className="relative">
              <button 
                type="button" 
                onClick={() => setIsAssigneePickerOpen(!isAssigneePickerOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium transition-colors ${assigneeId ? 'bg-brand-50 border-brand-200 text-brand-700 hover:bg-brand-100' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <User className="w-4 h-4" />
                <span className="max-w-[100px] truncate">
                  {assigneeId 
                    ? (teamMembers?.find((m: any) => m.userId === assigneeId)?.email || 'Me')
                    : 'Assignee'}
                </span>
              </button>
              {isAssigneePickerOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsAssigneePickerOpen(false)} />
                  <div className="relative z-50">
                    <AssigneePopover 
                      members={teamMembers || []} 
                      value={assigneeId} 
                      onChange={setAssigneeId} 
                      onClose={() => setIsAssigneePickerOpen(false)} 
                    />
                  </div>
                </>
              )}
            </div>

            {/* Date Picker Button */}
            <div className="relative">
              <button 
                type="button" 
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium transition-colors ${dueDate ? 'bg-brand-50 border-brand-200 text-brand-700 hover:bg-brand-100' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span className="whitespace-nowrap">
                  {dueDate 
                    ? new Date(dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Due Date'}
                </span>
              </button>
              {isDatePickerOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDatePickerOpen(false)} />
                  <div className="relative z-50">
                    <DatePickerPopover value={dueDate} onChange={setDueDate} onClose={() => setIsDatePickerOpen(false)} />
                  </div>
                </>
              )}
            </div>

            <div className="flex-1" />



            {/* Create Task Button */}
            <button
              type="submit"
              disabled={createIssueMutation.isPending || projectsLoading}
              className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2 ml-2"
            >
              {createIssueMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Create Task
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}
