import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Building2, Users, Loader2, Plus, LayoutGrid, ChevronRight, ChevronDown, ExternalLink, Trash2 } from 'lucide-react';
import apiClient from '../../api/client';
import { useNavigate } from 'react-router-dom';
import CreateTeamModal from '../teams/CreateTeamModal';
import CreateProjectModal from '../projects/CreateProjectModal';
import OrgMembersList from './OrgMembersList';
import TeamMembersModal from '../teams/TeamMembersModal';

interface Organization {
  id: string;
  name: string;
  description: string;
  userRole: string;
}

interface Team {
  id: string;
  name: string;
  userRole: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  repoLink: string;
  meetingLink: string;
  storageLink: string;
}

function TeamItem({ team, orgRole }: { team: Team, orgRole: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isTeamMembersModalOpen, setIsTeamMembersModalOpen] = useState(false);

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['projects', team.id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/teams/${team.id}/projects`);
      return response.data;
    },
    enabled: isExpanded,
  });

  return (
    <div className="mb-6 group min-w-0">
      <div className={`bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[1.5rem] overflow-hidden transition-all duration-500 ${!isExpanded && 'hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]'}`}>
        <div 
          className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/90 transition-colors gap-4"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-sm">
              {team.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">{team.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider border border-indigo-100/50">
                  {team.userRole}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center flex-wrap gap-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsTeamMembersModalOpen(true);
              }}
              className="flex items-center gap-1.5 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95 border border-slate-200/60"
            >
              <Users className="w-4 h-4" />
              Members
            </button>
            {(team.userRole === 'LEAD' || orgRole === 'ADMIN') && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCreateProjectModalOpen(true);
                }}
                className="flex items-center gap-1.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            )}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isExpanded ? 'bg-slate-100 text-slate-900' : 'bg-slate-50 text-slate-400'}`}>
              {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-slate-100/50 bg-slate-50/30 p-6 backdrop-blur-md">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              </div>
            ) : projects?.length === 0 ? (
              <div className="text-center py-12 bg-white/50 rounded-2xl border border-dashed border-slate-200">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <LayoutGrid className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium text-sm">No projects in this team yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects?.map((project) => (
                  <div key={project.id} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-extrabold text-slate-900 flex items-center gap-2 text-lg tracking-tight">
                        <div className="w-8 h-8 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center">
                          <LayoutGrid className="w-4 h-4" />
                        </div>
                        {project.name}
                      </h4>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium">
                      {project.description || 'No description provided.'}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-auto">
                      {project.repoLink && (
                        <a href={project.repoLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100/80 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors border border-slate-200/50">
                          <ExternalLink className="w-3.5 h-3.5" /> Code Repository
                        </a>
                      )}
                      {project.meetingLink && (
                        <a href={project.meetingLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100/80 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors border border-slate-200/50">
                          <ExternalLink className="w-3.5 h-3.5" /> Meeting Link
                        </a>
                      )}
                      {project.storageLink && (
                        <a href={project.storageLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100/80 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors border border-slate-200/50">
                          <ExternalLink className="w-3.5 h-3.5" /> Shared Files
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <CreateProjectModal 
        isOpen={isCreateProjectModalOpen} 
        onClose={() => setIsCreateProjectModalOpen(false)}
        teamId={team.id}
      />
      <TeamMembersModal
        isOpen={isTeamMembersModalOpen}
        onClose={() => setIsTeamMembersModalOpen(false)}
        teamId={team.id}
        teamName={team.name}
        myRole={team.userRole}
        orgRole={orgRole}
      />
    </div>
  );
}

export default function OrganizationDetail() {
  const { orgId } = useParams<{ orgId: string }>();
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteOrgMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/api/organizations/${orgId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      navigate('/dashboard');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to delete organization');
      setIsDeleting(false);
    }
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this organization? This action cannot be undone and will delete all teams, projects, and data within it.')) {
      setIsDeleting(true);
      deleteOrgMutation.mutate();
    }
  };

  const { data: org, isLoading: orgLoading } = useQuery<Organization>({
    queryKey: ['organization', orgId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/organizations/${orgId}`);
      return response.data;
    },
  });

  const { data: teams, isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ['teams', orgId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/organizations/${orgId}/teams`);
      return response.data;
    },
  });

  if (orgLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!org) return <div>Organization not found</div>;

  return (
    <div className="relative min-h-[calc(100vh-6rem)] max-w-6xl mx-auto">
      {/* Background Glows */}
      <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] -z-10 mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-20 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 mix-blend-multiply pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-start gap-6 mb-12 bg-white/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <Link to="/dashboard" className="p-3 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all mt-1">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-grow">
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            {org.name}
          </h1>
          {org.description && (
            <p className="text-slate-500 mt-2 text-base font-medium">{org.description}</p>
          )}
          <div className="mt-4 flex gap-2">
            <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wide">
              {org.userRole}
            </span>
          </div>
        </div>
        
        {org.userRole === 'ADMIN' && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition-all border border-red-100 shadow-sm whitespace-nowrap disabled:opacity-50"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete Organization
          </button>
        )}
      </div>

      {/* Teams Section */}
      <div className="min-w-0">
        
        {/* Teams List */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Teams</h2>
            {org.userRole === 'ADMIN' && (
              <button 
                onClick={() => setIsTeamModalOpen(true)}
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-sm hover:-translate-y-0.5 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                New Team
              </button>
            )}
          </div>

          {teamsLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
            </div>
          ) : teams?.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white shadow-inner">
                <Users className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="font-extrabold text-slate-900 mb-2 text-xl">No teams found</h3>
              <p className="text-slate-500 text-base mb-6 font-medium">Create a team to organize projects and members.</p>
              {org.userRole === 'ADMIN' && (
                <button 
                  onClick={() => setIsTeamModalOpen(true)}
                  className="bg-slate-900 text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-slate-800 hover:shadow-lg transition-all"
                >
                  + Create Team
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {teams?.map((team) => (
                <TeamItem key={team.id} team={team} orgRole={org.userRole} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 relative">
        <OrgMembersList orgId={orgId as string} myRole={org.userRole} />
      </div>

      <CreateTeamModal 
        isOpen={isTeamModalOpen} 
        onClose={() => setIsTeamModalOpen(false)}
        orgId={orgId as string}
      />
    </div>
  );
}
