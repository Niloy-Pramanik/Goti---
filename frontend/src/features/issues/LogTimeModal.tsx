import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Clock, Trash2 } from 'lucide-react';
import apiClient from '../../api/client';

export default function LogTimeModal({ isOpen, onClose, issueId }: { isOpen: boolean, onClose: () => void, issueId: string }) {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const { data: timeLogs, isLoading } = useQuery({
    queryKey: ['time-logs', issueId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/time-logs/issue/${issueId}`);
      return response.data;
    },
    enabled: isOpen && !!issueId
  });

  const deleteTimeLogMutation = useMutation({
    mutationFn: async (timeLogId: string) => {
      await apiClient.delete(`/api/time-logs/${timeLogId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-logs'] });
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['my-issues'] });
    }
  });

  const logTimeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/api/time-logs', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-logs'] });
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['my-issues'] });
      onClose();
      setHours('');
      setMinutes('');
      setDescription('');
      setError('');
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const totalMinutes = (parseInt(hours || '0') * 60) + parseInt(minutes || '0');
    if (totalMinutes === 0) {
      setError('Duration must be greater than 0 minutes.');
      return;
    }

    logTimeMutation.mutate({
      issueId,
      durationMinutes: totalMinutes,
      description,
      loggedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-500" />
            Log Time
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100">
              {error}
            </div>
          )}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Hours</label>
              <input
                type="number"
                min="0"
                value={hours}
                onChange={(e) => { setHours(e.target.value); setError(''); }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm font-medium"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Minutes</label>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => { setMinutes(e.target.value); setError(''); }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm font-medium"
                placeholder="0"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm resize-none"
              rows={3}
              placeholder="What did you work on?"
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={logTimeMutation.isPending || (!hours && !minutes)}
              className="px-5 py-2.5 bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {logTimeMutation.isPending ? 'Saving...' : 'Save Time'}
            </button>
          </div>
        </form>

        {/* History Section */}
        <div className="bg-slate-50 border-t border-slate-100 p-6 max-h-[300px] overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">Time Log History</h3>
          
          {isLoading ? (
            <div className="text-center py-4 text-sm text-slate-400">Loading history...</div>
          ) : !timeLogs || timeLogs.length === 0 ? (
            <div className="text-center py-4 text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl">
              No time logged yet
            </div>
          ) : (
            <div className="space-y-2">
              {timeLogs.map((log: any) => (
                <div key={log.id} className="bg-white border border-slate-200 rounded-xl p-3 flex items-start justify-between gap-3 shadow-sm hover:border-slate-300 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 text-sm">
                        {Math.floor(log.durationMinutes / 60)}h {log.durationMinutes % 60}m
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {new Date(log.loggedAt).toLocaleDateString()} {new Date(log.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {log.description && (
                      <p className="text-xs text-slate-600 line-clamp-2">{log.description}</p>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this time log?')) {
                        deleteTimeLogMutation.mutate(log.id);
                      }
                    }}
                    disabled={deleteTimeLogMutation.isPending}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    title="Delete Time Log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
