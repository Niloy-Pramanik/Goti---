import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import { Building2, Plus, Loader2, ArrowRight } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  myRole: string;
  createdAt: string;
}

export default function Dashboard() {
  const { data: orgs, isLoading, error } = useQuery<Organization[]>({
    queryKey: ['organizations'],
    queryFn: async () => {
      const response = await apiClient.get('/api/organizations');
      return response.data.data;
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Organizations</h1>
          <p className="text-slate-500 mt-1">Manage your workspaces and teams</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          New Organization
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
          Failed to load organizations.
        </div>
      ) : orgs?.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No organizations yet</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            Get started by creating a new organization to manage your teams and projects.
          </p>
          <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors">
            Create your first Organization
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orgs?.map((org) => (
            <Link
              key={org.id}
              to={`/orgs/${org.id}`}
              className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-brand-200 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center font-bold text-xl">
                  {org.name.charAt(0).toUpperCase()}
                </div>
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md">
                  {org.myRole}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                {org.name}
              </h3>
              <div className="mt-4 flex items-center text-sm font-medium text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Enter workspace <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
