import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Building2, Users, FolderKanban, ShieldCheck, Check } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden pb-32">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 pt-20 pb-12">
        <h1 className="text-[3.5rem] md:text-[5rem] leading-[1.1] font-bold text-slate-900 tracking-tight max-w-4xl">
          The Operating System for <br />
          <span className="text-brand-500">Organizations</span>
        </h1>
        
        <p className="mt-8 text-xl text-slate-500 max-w-2xl font-normal leading-relaxed">
          Manage Projects, Teams, and Access Control with high-speed task management and integrated resource links.
        </p>

        <div className="mt-10">
          <Link to="/register" className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-medium px-8 py-4 rounded-full text-lg shadow-md hover:shadow-lg transition-all">
            Get Started for Free
          </Link>
        </div>

        {/* Hero App Mockup */}
        <div className="mt-20 w-full max-w-6xl relative">
          <div className="absolute -inset-0.5 bg-gradient-to-b from-slate-200 to-transparent rounded-[2rem] blur opacity-50"></div>
          <div className="relative bg-white/70 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-2xl p-4 md:p-8 flex gap-6 min-h-[500px]">
            {/* Sidebar Mockup */}
            <div className="w-64 flex-shrink-0 hidden lg:block border-r border-slate-200/60 pr-6">
              <div className="flex items-center gap-2 font-semibold text-slate-800 mb-8">
                <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center text-xs">G</div>
                Goti Inc.
              </div>
              <div className="space-y-1">
                <div className="px-3 py-2 bg-slate-100/80 rounded-lg text-sm font-medium text-slate-900 flex justify-between">
                  <span>Projects</span>
                  <span className="text-slate-400">12</span>
                </div>
                <div className="px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-lg flex justify-between">
                  <span>Teams</span>
                  <span className="text-slate-400">3</span>
                </div>
                <div className="px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 rounded-lg flex justify-between">
                  <span>Members</span>
                  <span className="text-slate-400">24</span>
                </div>
              </div>
            </div>

            {/* Main Content Mockup */}
            <div className="flex-1 bg-slate-50/50 rounded-xl border border-slate-200/50 p-8 shadow-inner">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-slate-900">All Projects</h2>
                <div className="bg-slate-900 text-white text-sm px-4 py-1.5 rounded-full">+ New Project</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[
                  { name: 'Website Redesign', team: 'Design Team', color: 'bg-blue-500', initial: 'W' },
                  { name: 'API V2 Migration', team: 'Engineering', color: 'bg-emerald-500', initial: 'A' },
                  { name: 'Q4 Marketing', team: 'Growth', color: 'bg-pink-500', initial: 'Q' },
                  { name: 'Client Portal', team: 'Engineering', color: 'bg-purple-500', initial: 'C' }
                ].map((p, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl ${p.color} text-white flex items-center justify-center font-bold shadow-sm`}>
                        {p.initial}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">{p.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">for {p.team}</p>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
                      <div className={`h-full ${p.color} opacity-80`} style={{width: `${Math.random() * 60 + 20}%`}}></div>
                    </div>
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-medium text-slate-500">+3</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Section matching Teamcamp style */}
      <section className="max-w-6xl mx-auto w-full px-6 mt-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Whether you ship code, pixels, or campaigns,<br /> Goti adapts to your workflow.
          </h2>
          
          {/* Mock Pill Tabs */}
          <div className="inline-flex items-center gap-2 p-1.5 bg-slate-100/80 backdrop-blur rounded-full mt-8 border border-slate-200/50">
            <div className="flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-sm text-sm font-semibold text-slate-900">
              <span className="text-pink-500">{"</>"}</span> Development
            </div>
            <div className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">
              <span className="text-slate-400">✧</span> Design & No-Code
            </div>
            <div className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">
              <span className="text-slate-400">⚑</span> Marketing
            </div>
          </div>
        </div>

        {/* Big Feature Card */}
        <div className="bg-slate-100/50 rounded-[2.5rem] p-8 md:p-16 border border-white relative overflow-hidden">
          {/* Subtle gradient orb inside card */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/40 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">
                Structure your organization.<br />
                Automate the access.
              </h3>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Stop manually tracking who has access to what. Goti uses hierarchical role-based access control. When someone joins a team, they automatically get access to all associated projects and links.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-600 font-medium">
                  <Check className="w-5 h-5 text-slate-400" /> Organization-level Admin roles
                </li>
                <li className="flex items-center gap-3 text-slate-600 font-medium">
                  <Check className="w-5 h-5 text-slate-400" /> Team-level Lead management
                </li>
                <li className="flex items-center gap-3 text-slate-600 font-medium">
                  <Check className="w-5 h-5 text-slate-400" /> Unified Resource Links (Repo, Meeting, Storage)
                </li>
              </ul>
            </div>
            
            {/* Feature Mockup UI */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="font-semibold text-slate-900">Add Team Member</div>
                <div className="text-slate-400">•••</div>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</div>
                  <div className="text-slate-900 font-medium">alex@goti.inc</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Role Assignment</div>
                  <div className="flex gap-2">
                    <span className="bg-brand-100 text-brand-600 text-xs font-bold px-2 py-1 rounded">LEAD</span>
                    <span className="text-slate-500 text-sm mt-0.5">Full team management access</span>
                  </div>
                </div>
                <button className="w-full bg-slate-900 text-white font-medium py-2.5 rounded-lg shadow-sm">
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
