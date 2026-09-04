import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, UserPlus, Users } from 'lucide-react';
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
        
        {myRole === 'ADMIN' && (
          <button 
            onClick={() => setIsAddMemberModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-sm hover:-translate-y-0.5 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        )}
      </div>

      {/* List */}
      <div className="p-8">
        {members?.length === 0 ? (
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
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                      member.role === 'ADMIN' 
                        ? 'bg-amber-50 text-amber-700 border-amber-200/60' 
                        : 'bg-slate-50 text-slate-600 border-slate-200/60'
                    }`}>
                      {member.role}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 truncate">{member.email}</p>
                </div>
              </div>
            ))}
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
