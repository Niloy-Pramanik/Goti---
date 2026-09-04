import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Loader2, Users } from 'lucide-react';
import apiClient from '../../api/client';

interface Team {
  id: string;
  name: string;
  userRole: string;
}

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: string;
}

export default function CreateTeamModal({ isOpen, onClose, orgId }: CreateTeamModalProps) {
  const [name, setName] = useState('');
  const queryClient = useQueryClient();

  const { data: teams, isLoading } = useQuery<Team[]>({
    queryKey: ['teams', orgId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/organizations/${orgId}/teams`);
      return response.data;
    },
    enabled: isOpen,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(`/api/organizations/${orgId}/teams`, {
        name,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', orgId] });
      setName('');
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-900">Teams</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 border-b border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
            className="space-y-4"
          >
            {mutation.isError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                Failed to create team. Please try again.
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Create New Team
              </label>
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
                placeholder="e.g. Engineering, Marketing"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="submit"
                disabled={mutation.isPending || !name.trim()}
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Team
              </button>
            </div>
          </form>
        </div>

        <div className="p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Existing Teams</h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
            </div>
          ) : teams?.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No teams yet. Create one above.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {teams?.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                      {team.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-900 text-sm">{team.name}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600 uppercase tracking-wider">
                    {team.userRole}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
