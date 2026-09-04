import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, UserPlus, Users, X } from 'lucide-react';
import apiClient from '../../api/client';
import AddTeamMemberModal from './AddTeamMemberModal';

interface TeamMember {
  userId: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

interface TeamMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  teamName: string;
  myRole?: string;
  orgRole?: string;
}

export default function TeamMembersModal({ isOpen, onClose, teamId, teamName, myRole, orgRole }: TeamMembersModalProps) {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const removeMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      await apiClient.delete(`/api/teams/${teamId}/members/${userId}`);
    },
    onSuccess: () => {
      window.location.reload();
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to remove member');
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string, newRole: string }) => {
      await apiClient.put(`/api/teams/${teamId}/members/${userId}`, { role: newRole });
    },
    onSuccess: () => {
      window.location.reload();
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to update role');
    }
  });

  const { data: members, isLoading, error } = useQuery<TeamMember[]>({
    queryKey: ['teamMembers', teamId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/teams/${teamId}/members`);
      return response.data;
    },
    enabled: isOpen,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-400" />
              {teamName} Members
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex justify-between items-center bg-slate-50 border-b border-slate-100">
          <p className="text-sm font-medium text-slate-600">Manage who has access to this team.</p>
          <span className="bg-slate-200/60 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-300/50">
            {members?.length || 0} Members
          </span>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500 bg-red-50 rounded-xl border border-red-100">
              Failed to load members.
            </div>
          ) : members?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No members found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members?.map((member) => (
                <div key={member.userId} className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-base border border-slate-200">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-bold text-slate-900 truncate text-sm">{member.name}</h4>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider border whitespace-nowrap shrink-0 ${
                        member.role === 'LEAD' 
                          ? 'bg-purple-50 text-purple-700 border-purple-200/60' 
                          : 'bg-slate-50 text-slate-600 border-slate-200/60'
                      }`}>
                        {member.role}
                      </span>
                    </div>
                    <a href={`mailto:${member.email}`} title={member.email} className="block text-xs font-medium text-slate-500 truncate hover:text-slate-700 hover:underline">
                      {member.email}
                    </a>
                    {member.joinedAt && (
                      <p className="text-[10px] font-medium text-slate-400 mt-1">
                        Joined {new Date(member.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                  {(myRole === 'LEAD' || orgRole === 'ADMIN') && (
                    <div className="flex items-center gap-1.5 ml-auto shrink-0">
                      <button 
                        onClick={() => {
                          const newRole = member.role === 'LEAD' ? 'MEMBER' : 'LEAD';
                          updateRoleMutation.mutate({ userId: member.userId, newRole });
                        }}
                        className="text-[10px] font-bold px-2 py-1 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors border border-slate-200/60 disabled:opacity-50"
                        disabled={updateRoleMutation.isPending}
                      >
                        {member.role === 'LEAD' ? 'Make Member' : 'Make Lead'}
                      </button>
                      <button 
                        onClick={() => {
                          removeMemberMutation.mutate(member.userId);
                        }}
                        className="text-[10px] font-bold px-2 py-1 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors border border-red-100 disabled:opacity-50"
                        disabled={removeMemberMutation.isPending}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
              {(myRole === 'LEAD' || orgRole === 'ADMIN') && (
                <button 
                  onClick={() => setIsAddMemberModalOpen(true)}
                  className="bg-slate-50/50 hover:bg-slate-50 border-2 border-dashed border-slate-200/60 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-slate-900 transition-colors h-full min-h-[80px] p-4"
                >
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-xs">Add Member</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <AddTeamMemberModal 
        isOpen={isAddMemberModalOpen} 
        onClose={() => setIsAddMemberModalOpen(false)}
        teamId={teamId}
      />
    </div>
  );
}
