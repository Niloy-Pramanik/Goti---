import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import apiClient from '../../api/client';

interface LogProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  issueId: string;
}

export default function LogProgressModal({ isOpen, onClose, issueId }: LogProgressModalProps) {
  const [comment, setComment] = useState('');
  const [delayDays, setDelayDays] = useState('0');
  const [error, setError] = useState('');
  
  const queryClient = useQueryClient();

  const { data: logs, isLoading: logsLoading } = useQuery({
    queryKey: ['progress', issueId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/issues/${issueId}/progress`);
      return response.data;
    },
    enabled: isOpen,
  });

  const logProgressMutation = useMutation({
    mutationFn: async (data: { comment: string; delayDays: number }) => {
      const response = await apiClient.post(`/api/issues/${issueId}/progress`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', issueId] });
      setComment('');
      setDelayDays('0');
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to log progress');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!comment.trim()) {
      setError('Comment is required');
      return;
    }
    
    logProgressMutation.mutate({ 
      comment,
      delayDays: parseInt(delayDays, 10) || 0
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Log Progress & Blockers</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 max-h-60 overflow-y-auto bg-slate-50 border-b border-slate-100 space-y-3">
          {logsLoading ? (
            <div className="flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
          ) : logs && logs.length > 0 ? (
            logs.map((log: any) => (
              <div key={log.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-sm">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-800">{log.userName}</span>
                  <span className="text-xs text-slate-400">{new Date(log.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-600 mb-2">{log.comment}</p>
                {log.delayDays > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    Delay: {log.delayDays} day(s)
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-slate-500 py-2">No progress logs yet.</div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Update / Comment *</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all h-24 resize-none"
              placeholder="e.g., Sick today, could not work on this."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Delay Days (Blockers)</label>
            <input
              type="number"
              min="0"
              value={delayDays}
              onChange={(e) => setDelayDays(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
            />
            <p className="text-xs text-slate-500 mt-1">If this update is a blocker, how many days were lost?</p>
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
              disabled={logProgressMutation.isPending}
              className="flex-1 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {logProgressMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Log Progress
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
