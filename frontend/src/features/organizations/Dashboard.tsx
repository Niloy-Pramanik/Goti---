import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import { Building2, Plus, Loader2, ArrowRight } from 'lucide-react';
import CreateOrgModal from './CreateOrgModal';

interface Organization {
  id: string;
  name: string;
  myRole: string;
  createdAt: string;
}

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: orgs, isLoading, error } = useQuery<Organization[]>({
    queryKey: ['organizations'],
    queryFn: async () => {
      const response = await apiClient.get('/api/organizations');
      return response.data;
    },
  });

  return (
    <div className="relative min-h-[calc(100vh-6rem)]">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>

      <div className="flex justify-between items-center mb-10 relative z-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Organizations</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage your workspaces, teams, and projects.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all hover:scale-105 hover:shadow-xl shadow-slate-900/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          New Organization
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 relative z-10">
          <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50/50 backdrop-blur-sm text-red-600 p-4 rounded-2xl border border-red-200 shadow-sm relative z-10">
          Failed to load organizations. Please try again later.
        </div>
      ) : orgs?.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/50">
            <Building2 className="w-10 h-10 text-brand-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">No organizations yet</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
            Get started by creating a new organization to manage your teams and projects effortlessly.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 text-white px-8 py-3.5 rounded-full text-base font-semibold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Create your first Organization
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000 relative z-10">
          {orgs?.map((org, index) => (
            <Link
              key={org.id}
              to={`/orgs/${org.id}`}
              className="group block relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent rounded-[2rem] transform translate-y-2 translate-x-2 group-hover:translate-y-4 group-hover:translate-x-4 transition-transform duration-500 -z-10"></div>
              
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 transform rotate-x-[4deg] rotate-y-[-4deg] group-hover:rotate-x-0 group-hover:rotate-y-0 group-hover:-translate-y-2 h-full flex flex-col">
                
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner shadow-white/20 border border-slate-700">
                    {org.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-brand-100 uppercase tracking-wider">
                    {org.myRole}
                  </span>
                </div>
                
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors mb-2 tracking-tight">
                  {org.name}
                </h3>
                
                <p className="text-slate-500 text-sm mb-6 flex-grow">
                  Created {new Date(org.createdAt).toLocaleDateString()}
                </p>

                <div className="mt-auto flex items-center text-sm font-bold text-slate-900 bg-slate-50 px-4 py-3 rounded-xl group-hover:bg-brand-50 group-hover:text-brand-700 transition-colors">
                  Enter Workspace 
                  <ArrowRight className="w-4 h-4 ml-auto transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <CreateOrgModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
