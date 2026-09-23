import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import apiClient from '../../api/client';

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  milestoneId?: string;
  teamId?: string;
  canAssign?: boolean;
}

export default function CreateIssueModal({ isOpen, onClose, projectId, milestoneId, teamId, canAssign = true }: CreateIssueModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('TASK');
  const [assigneeId, setAssigneeId] = useState('');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(milestoneId || '');
  const [error, setError] = useState('');
  
  const queryClient = useQueryClient();

  // Fetch team members if teamId is available
  const { data: teamMembers } = useQuery({
    queryKey: ['teamMembers', teamId],
    queryFn: async () => {
      if (!teamId) return [];
      const response = await apiClient.get(`/api/teams/${teamId}/members`);
      return response.data;
    },
    enabled: !!teamId && isOpen,
  });

  // Fetch project milestones
  const { data: milestones } = useQuery({
    queryKey: ['milestones', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/projects/${projectId}/milestones`);
      return response.data;
    },
    enabled: !!projectId && isOpen,
  });

  const createIssueMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post(`/api/projects/${projectId}/issues`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues', projectId] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      setTitle('');
      setDescription('');
      setType('TASK');
      setAssigneeId('');
      setSelectedMilestoneId(milestoneId || '');
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create issue');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    const payload: any = { title, description, type };
    if (selectedMilestoneId) payload.milestoneId = selectedMilestoneId;
    if (assigneeId) payload.assigneeId = assigneeId;

    createIssueMutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Create Issue</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              placeholder="e.g., Fix login page styling"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all h-24 resize-none"
              placeholder="Details about the issue..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-white"
              >
                <option value="TASK">Task</option>
                <option value="BUG">Bug</option>
                <option value="FEATURE">Feature</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Milestone</label>
              <select
                value={selectedMilestoneId}
                onChange={(e) => setSelectedMilestoneId(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-white"
              >
                <option value="">No Milestone</option>
                {milestones?.map((m: any) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {teamId && canAssign && (
              <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Assignee</label>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-white"
                >
                  <option value="">Unassigned</option>
                  {teamMembers?.map((member: any) => (
                    <option key={member.userId} value={member.userId}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createIssueMutation.isPending}
              className="flex-1 bg-brand-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {createIssueMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
