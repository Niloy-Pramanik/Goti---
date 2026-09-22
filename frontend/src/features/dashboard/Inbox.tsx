import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Inbox as InboxIcon, CheckCircle2, MessageSquarePlus, X } from 'lucide-react';
import apiClient from '../../api/client';

export default function Inbox() {
  const queryClient = useQueryClient();
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await apiClient.get('/api/notifications');
      return response.data;
    },
    refetchInterval: 5000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(`/api/notifications/${id}/read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const requestLeaveMutation = useMutation({
    mutationFn: async (reason: string) => {
      await apiClient.post('/api/notifications/leave-request', { reason });
    },
    onSuccess: () => {
      setIsLeaveModalOpen(false);
      setLeaveReason('');
      alert('Leave request sent to admins successfully!');
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center shadow-sm">
            <InboxIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Inbox</h1>
            <p className="text-slate-500 mt-1 font-medium">Your notifications and updates</p>
          </div>
        </div>
        <button
          onClick={() => setIsLeaveModalOpen(true)}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-brand-700 transition-colors shadow-sm"
        >
          <MessageSquarePlus className="w-4 h-4" />
          Request Leave
        </button>
      </div>

      <div className="space-y-4">
        {notifications?.map((notification: any) => (
          <div 
            key={notification.id} 
            className={`flex items-start justify-between p-5 rounded-2xl border transition-all ${
              notification.isRead 
                ? 'bg-slate-50/50 border-slate-200 opacity-70' 
                : 'bg-white border-brand-200 shadow-sm'
            }`}
          >
            <div>
              <h3 className={`font-bold ${notification.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                {notification.title}
              </h3>
              <p className="text-sm text-slate-500 mt-1">{notification.message}</p>
              <p className="text-xs font-medium text-slate-400 mt-3">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
            {!notification.isRead && (
              <button
                onClick={() => markAsReadMutation.mutate(notification.id)}
                className="flex items-center gap-2 text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark as read
              </button>
            )}
          </div>
        ))}
        {notifications?.length === 0 && (
          <div className="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <InboxIcon className="w-5 h-5 text-slate-400" />
            </div>
            <p className="font-medium text-sm text-slate-500">You're all caught up!</p>
          </div>
        )}
      </div>

      {/* Leave Request Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Request Leave</h2>
              <button
                onClick={() => setIsLeaveModalOpen(false)}
                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Reason for leave
                </label>
                <textarea
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="E.g. Feeling unwell, taking a day off on Friday..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => requestLeaveMutation.mutate(leaveReason)}
                  disabled={!leaveReason.trim() || requestLeaveMutation.isPending}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
                >
                  {requestLeaveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
