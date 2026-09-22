import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { 
  LayoutGrid, Building2, LogOut, Kanban, Flag, FileText, ArrowLeft 
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const projectMatch = location.pathname.match(/\/projects\/([^/]+)/);
  const projectId = projectMatch ? projectMatch[1] : null;

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/projects/${projectId}`);
      return response.data;
    },
    enabled: !!projectId,
  });

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await apiClient.get('/api/notifications');
      return response.data;
    },
    refetchInterval: 5000, // Poll every 5 seconds for instant updates
    enabled: !!user,
  });

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  return (
    <div className="w-64 h-screen bg-white/70 backdrop-blur-md border-r border-slate-200/60 flex flex-col justify-between py-6 flex-shrink-0">
      <div>
        <div className="px-6 mb-8">
          <Link to="/dashboard" className="flex items-center gap-2 text-slate-900 font-bold text-xl tracking-tight">
            <LayoutGrid className="w-6 h-6 text-brand-600" />
            Goti
          </Link>
        </div>

        {projectId ? (
          <div className="px-3 space-y-4">
            <div className="px-3 pb-4 border-b border-slate-200/60">
              <Link 
                to={project?.orgId ? `/orgs/${project.orgId}` : '/dashboard'} 
                className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Organization
              </Link>
              <h2 className="text-sm font-bold text-slate-900 truncate flex items-center gap-2">
                <div className="w-6 h-6 bg-brand-50 text-brand-600 rounded-md flex items-center justify-center shadow-sm shrink-0">
                  <LayoutGrid className="w-3.5 h-3.5" />
                </div>
                {project?.name || 'Loading...'}
              </h2>
            </div>
            
            <nav className="space-y-1">
              <Link
                to={`/projects/${projectId}/overview`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === `/projects/${projectId}/overview`
                    ? 'bg-slate-100/80 text-slate-900 shadow-sm border border-slate-200/50'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                Overview
              </Link>
              <Link
                to={`/projects/${projectId}/board`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === `/projects/${projectId}/board`
                    ? 'bg-slate-100/80 text-slate-900 shadow-sm border border-slate-200/50'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Kanban className="w-4 h-4" />
                Board
              </Link>
              <Link
                to={`/projects/${projectId}/milestones`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === `/projects/${projectId}/milestones`
                    ? 'bg-slate-100/80 text-slate-900 shadow-sm border border-slate-200/50'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Flag className="w-4 h-4" />
                Milestones
              </Link>
            </nav>
          </div>
        ) : (
          <nav className="px-3 space-y-1">
            <Link
              to="/inbox"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/inbox'
                  ? 'bg-slate-100/80 text-slate-900 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-inbox"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
              <span className="flex-1">Inbox</span>
              {unreadCount > 0 && (
                <span className="bg-brand-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link
              to="/my-tasks"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/my-tasks'
                  ? 'bg-slate-100/80 text-slate-900 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-square"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              My Tasks
            </Link>
            <Link
              to="/time-tracking"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/time-tracking'
                  ? 'bg-slate-100/80 text-slate-900 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Time Tracking
            </Link>
            <Link
              to="/reports"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/reports'
                  ? 'bg-slate-100/80 text-slate-900 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              Reports
            </Link>
            
            <div className="pt-4 pb-1">
              <p className="px-3 text-xs font-black text-slate-400 uppercase tracking-wider">Workspaces</p>
            </div>
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/dashboard' || location.pathname.startsWith('/orgs')
                  ? 'bg-slate-100/80 text-slate-900 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-5 h-5" />
              Organizations
            </Link>
          </nav>
        )}
      </div>

      <div className="px-6">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
