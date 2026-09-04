import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, UserPlus, Users, AlertTriangle } from 'lucide-react';
import apiClient from '../../api/client';
import AddOrgMemberModal from './AddOrgMemberModal';

interface OrgMember {
  userId: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

interface OrgMembersListProps {
  orgId: string;
  myRole: string; // To check if current user can add members
}

export default function OrgMembersList({ orgId, myRole }: OrgMembersListProps) {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const removeMemberMutation = useMutation({
    mutationFn: async (userId: string) => {
      await apiClient.delete(`/api/organizations/${orgId}/members/${userId}`);
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
      await apiClient.put(`/api/organizations/${orgId}/members/${userId}`, { role: newRole });
    },
    onSuccess: () => {
      window.location.reload();
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to update role');
    }
  });

  const { data: members, isLoading, error } = useQuery<OrgMember[]>({
    queryKey: ['orgMembers', orgId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/organizations/${orgId}/members`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 bg-red-50 rounded-xl border border-red-100">
        Failed to load members.
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative z-0">
      {/* Header */}
      <div className="flex justify-between items-center p-8 border-b border-white/50">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="w-6 h-6 text-slate-400" />
            Members
          </h2>
          <p className="text-slate-500 font-medium mt-1">Manage organization access and roles.</p>
        </div>
        <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200">
          {members?.length || 0} Members
        </span>
      </div>

      {/* List */}
      <div className="p-8">
        {members?.length === 0 && myRole !== 'ADMIN' ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No members found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members?.map((member) => (
              <div key={member.userId} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-lg border border-slate-200">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-900 truncate">{member.name}</h4>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider border whitespace-nowrap ${
                      member.role === 'ADMIN' 
                        ? 'bg-amber-50 text-amber-700 border-amber-200/60' 
                        : 'bg-slate-50 text-slate-600 border-slate-200/60'
                    }`}>
                      {member.role}
                    </span>
                  </div>
                  <a href={`mailto:${member.email}`} className="text-xs font-medium text-slate-500 truncate hover:text-slate-700 hover:underline">
                    {member.email}
                  </a>
                  {member.joinedAt && (
                    <p className="text-[10px] font-medium text-slate-400 mt-1">
                      Joined {new Date(member.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                </div>
                {myRole === 'ADMIN' && (
                  <div className="flex items-center gap-2 ml-auto">
                    <button 
                      onClick={() => {
                        const newRole = member.role === 'ADMIN' ? 'MEMBER' : 'ADMIN';
                        updateRoleMutation.mutate({ userId: member.userId, newRole });
                      }}
                      className="text-xs font-bold px-3 py-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200/60 disabled:opacity-50"
                      disabled={updateRoleMutation.isPending}
                    >
                      {member.role === 'ADMIN' ? 'Make Member' : 'Make Admin'}
                    </button>
                    <button 
                      onClick={() => {
                        removeMemberMutation.mutate(member.userId);
                      }}
                      className="text-xs font-bold px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 disabled:opacity-50"
                      disabled={removeMemberMutation.isPending}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {myRole === 'ADMIN' && (
              <button 
                onClick={() => setIsAddMemberModalOpen(true)}
                className="bg-slate-50/50 hover:bg-slate-50 border-2 border-dashed border-slate-200/60 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-slate-900 transition-colors h-full min-h-[100px] p-6"
              >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <UserPlus className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm">Add Member</span>
              </button>
            )}
          </div>
        )}
      </div>

      <AddOrgMemberModal 
        isOpen={isAddMemberModalOpen} 
        onClose={() => setIsAddMemberModalOpen(false)}
        orgId={orgId}
      />
    </div>
  );
}
