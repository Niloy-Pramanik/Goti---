import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
}

export default function TeamMembersModal({ isOpen, onClose, teamId, teamName }: TeamMembersModalProps) {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

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
          <button 
            onClick={() => setIsAddMemberModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-sm hover:-translate-y-0.5 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            Add Member
          </button>
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
                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-bold text-slate-900 truncate text-sm">{member.name}</h4>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider border ${
                        member.role === 'LEAD' 
                          ? 'bg-purple-50 text-purple-700 border-purple-200/60' 
                          : 'bg-slate-50 text-slate-600 border-slate-200/60'
                      }`}>
                        {member.role}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 truncate">{member.email}</p>
                  </div>
                </div>
              ))}
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
