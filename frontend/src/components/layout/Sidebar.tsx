import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LayoutGrid, Building2, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="w-64 h-screen bg-white/70 backdrop-blur-md border-r border-slate-200/60 flex flex-col justify-between py-6 flex-shrink-0">
      <div>
        <div className="px-6 mb-8">
          <Link to="/dashboard" className="flex items-center gap-2 text-slate-900 font-bold text-xl tracking-tight">
            <LayoutGrid className="w-6 h-6 text-brand-600" />
            Goti
          </Link>
        </div>

        <nav className="px-3 space-y-1">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/dashboard' || location.pathname.startsWith('/orgs')
                ? 'bg-slate-100/80 text-slate-900'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-5 h-5" />
            Organizations
          </Link>
        </nav>
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
            className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
