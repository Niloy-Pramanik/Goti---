import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { 
  Users, ShieldCheck, Check, Zap, Lock, Globe,
  Inbox, CheckSquare, MessageSquare, FileText, Clock, BarChart2, MoreHorizontal,
  LayoutGrid
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col relative bg-white overflow-hidden font-sans">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 pt-20 pb-20 relative z-10">
        
        {/* Subtle Background Glow mimicking Teamcamp */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-50 rounded-full blur-3xl opacity-50 -z-10"></div>

        <h1 className="text-5xl md:text-[3.5rem] lg:text-[4rem] leading-[1.1] font-bold text-slate-900 tracking-tight max-w-4xl">
          The Operating System for <br />
          <span className="text-emerald-500">Organizations</span>
        </h1>
        
        <p className="mt-6 text-[17px] text-slate-500 max-w-2xl font-normal leading-relaxed">
          Manage Code, No-Code, Marketing and Design Projects with high-speed task management, integrated billing, and client portals.
        </p>

        <div className="mt-10">
          <Link to="/register" className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-medium px-8 py-3.5 rounded-full text-base transition-all duration-200">
            Get Started for Free
          </Link>
        </div>

        {/* Flat Face-On Detailed Hero App Mockup - Now with 3D Perspective */}
        <div className="mt-20 w-full max-w-[1100px] relative z-10 mx-auto perspective-1000">
          
          {/* Subtle glowing background behind the mockup */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

          <div className="relative bg-[#FAFAFA] border border-slate-200/60 rounded-2xl shadow-2xl shadow-slate-200/50 flex overflow-hidden min-h-[600px] text-left transform rotate-x-[8deg] rotate-y-[-6deg] rotate-z-[1deg] hover:rotate-x-0 hover:rotate-y-0 hover:rotate-z-0 transition-transform duration-700 ease-out cursor-pointer group">
            

            
            {/* Sidebar Mockup */}
            <div className="w-[240px] flex-shrink-0 hidden md:flex flex-col border-r border-slate-200/60 bg-white py-6 px-4 h-full">
              <div className="flex items-center gap-3 font-bold text-slate-900 mb-6 px-2">
                <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">
                  G
                </div>
                <span className="text-sm">Goti Inc.</span>
              </div>

              {/* Primary Menu */}
              <div className="space-y-0.5 mb-6">
                <MenuItem icon={<Inbox className="w-4 h-4" />} label="Inbox" badge="22" />
                <MenuItem icon={<CheckSquare className="w-4 h-4" />} label="My Task" />
                <MenuItem icon={<MessageSquare className="w-4 h-4" />} label="Messages" />
                <MenuItem icon={<FileText className="w-4 h-4" />} label="Invoices" badge="15" />
                <MenuItem icon={<Users className="w-4 h-4" />} label="Customers" badge="35" />
                <MenuItem icon={<Clock className="w-4 h-4" />} label="Time Tracking" />
                <MenuItem icon={<BarChart2 className="w-4 h-4" />} label="Report" />
              </div>

              {/* Projects Menu */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 mb-2 px-2 uppercase">Projects</h4>
                <div className="space-y-0.5">
                  <ProjectItem icon="B" color="bg-slate-500" label="BreezeTech Web" />
                  <ProjectItem icon="C" color="bg-blue-500" label="Copilot" />
                  <ProjectItem icon="A" color="bg-teal-500" label="AI Chatbot Integration" />
                  <ProjectItem icon="C" color="bg-red-500" label="Cosmico Studios We..." />
                </div>
              </div>
            </div>

            {/* Main Content Mockup */}
            <div className="flex-1 bg-[#FAFAFA] p-8 flex flex-col relative h-full">
              
              {/* Main Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[15px] font-bold text-slate-800">All Projects</h2>
                <div className="flex items-center gap-2">
                  <button className="bg-slate-900 text-white text-[11px] font-medium px-3 py-1.5 rounded-md flex items-center gap-1">
                    + New Project
                  </button>
                  <button className="text-slate-400 p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Favourite Section */}
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-slate-700 mb-3">Favourite</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FavouriteCard icon="B" color="bg-slate-500" title="BreezeTech Web" client="for BreezeTech Pvt." progress={75} progressColor="bg-emerald-500" avatars={4} />
                  <FavouriteCard icon="C" color="bg-blue-500" title="Copilot" client="for Pixer" progress={60} progressColor="bg-yellow-400" avatars={3} />
                  <FavouriteCard icon="A" color="bg-teal-500" title="AI Chatbot Integration" client="for Pixer" progress={90} progressColor="bg-yellow-400" avatars={5} />
                  <FavouriteCard icon="C" color="bg-red-500" title="Cosmico Studios Website" client="for Cosmico Studios" progress={15} progressColor="bg-red-500" avatars={4} />
                  
                  <FavouriteCard icon="S" color="bg-cyan-400" title="SkyNavigator" client="" progress={40} progressColor="bg-orange-500" avatars={3} />
                  <FavouriteCard icon="A" color="bg-orange-400" title="ArcSpeed" client="for ArcSpeed" progress={85} progressColor="bg-emerald-500" avatars={3} />
                  <FavouriteCard icon="P" color="bg-indigo-500" title="Pixer Marketing" client="for Pixer" progress={65} progressColor="bg-emerald-500" avatars={2} />
                </div>
              </div>

              {/* Projects List Section */}
              <div className="flex-1 mt-4">
                 <h3 className="text-xs font-semibold text-slate-700 mb-3 border-b border-slate-200/60 pb-2">Projects</h3>
                 <div className="flex flex-col">
                   <ProjectListRow icon="H" color="bg-indigo-500" title="Healthcare Portal" client="for MedTech Solutions" status="In Progress" statusDot="bg-blue-500" avatars={4} />
                   <ProjectListRow icon="E" color="bg-pink-500" title="E-commerce Redesign" client="for ShopGlobal" status="Review" statusDot="bg-orange-500" avatars={3} />
                   <ProjectListRow icon="F" color="bg-emerald-500" title="FinTech Mobile App" client="for TrustBank" status="Completed" statusDot="bg-emerald-500" avatars={5} />
                   <ProjectListRow icon="D" color="bg-purple-500" title="Data Warehouse Setup" client="for DataCorp" status="Planning" statusDot="bg-slate-400" avatars={2} />
                 </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Feature Section matching Teamcamp style */}
      <section className="max-w-[1200px] mx-auto w-full px-6 mt-40">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            Whether you ship code, pixels, or campaigns,<br /> Goti adapts to your workflow.
          </h2>
          
          {/* Mock Pill Tabs */}
          <div className="inline-flex items-center gap-1.5 p-1.5 bg-slate-200/50 backdrop-blur rounded-full mt-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 bg-white px-6 py-2.5 rounded-full shadow-sm text-sm font-bold text-slate-900 tracking-wide">
              <span className="text-pink-500 font-black">{"</>"}</span> Development
            </div>
            <div className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">
              <span className="text-slate-400">✧</span> Design & No-Code
            </div>
            <div className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">
              <span className="text-slate-400">⚑</span> Marketing
            </div>
          </div>
        </div>

        {/* Feature Block 1 */}
        <div className="bg-slate-100/80 rounded-[3rem] p-8 md:p-16 border border-white/60 shadow-xl shadow-slate-200/50 relative overflow-hidden mb-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" /> Access Control
              </div>
              <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                Structure your organization.<br />
                Automate the access.
              </h3>
              <p className="text-slate-500 text-lg md:text-xl font-medium mb-10 leading-relaxed">
                Stop manually tracking who has access to what. Goti uses hierarchical role-based access control. When someone joins a team, they automatically get access to all associated projects and links.
              </p>
              
              <ul className="space-y-5">
                <li className="flex items-center gap-4 text-slate-700 font-semibold text-lg">
                  <div className="bg-white p-1 rounded-full shadow-sm"><Check className="w-5 h-5 text-emerald-500" /></div>
                  Organization-level Admin roles
                </li>
                <li className="flex items-center gap-4 text-slate-700 font-semibold text-lg">
                  <div className="bg-white p-1 rounded-full shadow-sm"><Check className="w-5 h-5 text-emerald-500" /></div>
                  Team-level Lead management
                </li>
                <li className="flex items-center gap-4 text-slate-700 font-semibold text-lg">
                  <div className="bg-white p-1 rounded-full shadow-sm"><Check className="w-5 h-5 text-emerald-500" /></div>
                  Unified Resource Links (Repo, Storage)
                </li>
              </ul>
            </div>
            
            {/* Feature Mockup UI */}
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                <div className="font-bold text-slate-900 text-lg">Add Team Member</div>
                <div className="text-slate-300 font-bold tracking-widest cursor-pointer">•••</div>
              </div>
              <div className="space-y-5">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Email Address</div>
                  <div className="text-slate-900 font-semibold text-lg">alex@goti.inc</div>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Role Assignment</div>
                  <div className="flex gap-3 items-center">
                    <span className="bg-emerald-100 text-emerald-700 text-sm font-black px-3 py-1 rounded-md tracking-wide">LEAD</span>
                    <span className="text-slate-500 font-medium">Full team management access</span>
                  </div>
                </div>
                <button className="w-full bg-slate-900 hover:bg-slate-800 transition-colors text-white font-bold py-4 rounded-xl shadow-md mt-2 text-lg">
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7" />
            </div>
            <h4 className="text-2xl font-bold text-slate-900 mb-3">Lightning Fast</h4>
            <p className="text-slate-500 font-medium leading-relaxed">Built on modern architecture ensuring zero lag when switching between projects and teams.</p>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Lock className="w-7 h-7" />
            </div>
            <h4 className="text-2xl font-bold text-slate-900 mb-3">Enterprise Security</h4>
            <p className="text-slate-500 font-medium leading-relaxed">Stateless JWT authentication and strictly isolated organizational boundaries.</p>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <Globe className="w-7 h-7" />
            </div>
            <h4 className="text-2xl font-bold text-slate-900 mb-3">Unified Resources</h4>
            <p className="text-slate-500 font-medium leading-relaxed">Keep your Jira, GitHub, and Google Drive links in exactly one place per project.</p>
          </div>
        </div>
      </section>

      {/* Massive CTA Section */}
      <section className="max-w-[1200px] mx-auto w-full px-6 mt-40 mb-20">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-brand-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight">
              Ready to unify your work?
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 font-medium mb-12 max-w-2xl mx-auto">
              Join thousands of organizations using Goti to manage their teams, projects, and access control.
            </p>
            <Link to="/register" className="inline-block bg-white text-slate-900 hover:bg-slate-100 font-bold px-10 py-5 rounded-full text-xl shadow-xl transition-transform hover:scale-105">
              Start your free trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto w-full px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2 md:col-span-2">
              <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900 mb-4">
                <LayoutGrid className="w-6 h-6 text-slate-900" />
                Goti
              </Link>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                The operating system for modern organizations to manage access, teams, and projects seamlessly.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4 text-sm">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-500 text-sm hover:text-slate-900 transition-colors">Features</a></li>
                <li><a href="#" className="text-slate-500 text-sm hover:text-slate-900 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-500 text-sm hover:text-slate-900 transition-colors">Integrations</a></li>
                <li><a href="#" className="text-slate-500 text-sm hover:text-slate-900 transition-colors">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4 text-sm">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-500 text-sm hover:text-slate-900 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-slate-500 text-sm hover:text-slate-900 transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-500 text-sm hover:text-slate-900 transition-colors">Community</a></li>
                <li><a href="#" className="text-slate-500 text-sm hover:text-slate-900 transition-colors">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-900 mb-4 text-sm">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-500 text-sm hover:text-slate-900 transition-colors">About Us</a></li>
                <li><a href="#" className="text-slate-500 text-sm hover:text-slate-900 transition-colors">Careers</a></li>
                <li><a href="#" className="text-slate-500 text-sm hover:text-slate-900 transition-colors">Contact</a></li>
                <li><a href="#" className="text-slate-500 text-sm hover:text-slate-900 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-100">
            <p className="text-slate-400 text-sm">© 2026 Goti Inc. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-slate-600"><span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-600"><span className="sr-only">GitHub</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sub-components for cleaner mockup code

function MenuItem({ icon, label, badge }: { icon: React.ReactNode, label: string, badge?: string }) {
  return (
    <div className="flex items-center justify-between px-2 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 cursor-pointer">
      <div className="flex items-center gap-2">
        <span className="text-slate-500">{icon}</span>
        <span className="text-[13px] font-medium">{label}</span>
      </div>
      {badge && (
        <span className="text-[11px] font-medium text-slate-400">{badge}</span>
      )}
    </div>
  );
}

function ProjectItem({ icon, color, label }: { icon: string, color: string, label: string }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 cursor-pointer">
      <div className={`w-5 h-5 rounded-[4px] flex items-center justify-center text-[10px] font-bold text-white ${color}`}>
        {icon}
      </div>
      <span className="text-[13px] font-medium truncate">{label}</span>
    </div>
  );
}

function FavouriteCard({ icon, color, title, client, progress, progressColor, avatars }: any) {
  return (
    <div className="border border-slate-200/80 rounded-[14px] p-4 bg-white shadow-sm flex flex-col hover:shadow-md transition-shadow cursor-pointer min-h-[140px]">
      <div className="flex items-start gap-3 mb-2">
        <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center text-white font-bold text-sm ${color}`}>
          {icon}
        </div>
      </div>
      <div className="flex-1 mb-2">
        <h4 className="font-semibold text-slate-800 text-[13px] truncate leading-tight">{title}</h4>
        {client && <p className="text-[11px] text-slate-500 truncate mt-0.5">{client}</p>}
      </div>
      <div className="mt-3">
        <div className="w-full bg-slate-100 rounded-full h-1 mb-3">
          <div className={`${progressColor} h-1 rounded-full`} style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex -space-x-1.5">
          {[...Array(avatars)].map((_, i) => (
            <div key={i} className="w-5 h-5 rounded-full bg-slate-200 border border-white" style={{
              backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})`,
              backgroundSize: 'cover'
            }}></div>
          ))}
          <div className="w-5 h-5 rounded-full bg-slate-50 border border-white flex items-center justify-center text-[9px] font-medium text-slate-500">
            +{avatars * 2}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectListRow({ icon, color, title, client, status, statusDot, avatars }: any) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 rounded-lg transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg ${color} text-white flex items-center justify-center text-xs font-bold shadow-sm`}>
          {icon}
        </div>
        <div>
          <div className="text-[13px] font-bold text-slate-900">{title}</div>
          {client && <div className="text-[11px] text-slate-500">{client}</div>}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5 w-24">
          <div className={`w-2 h-2 rounded-full ${statusDot}`}></div>
          <span className="text-[11px] font-semibold text-slate-600">{status}</span>
        </div>
        <div className="flex -space-x-2">
          {[...Array(avatars)].map((_, i) => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-slate-200 shadow-sm">
              <img src={`https://i.pravatar.cc/150?img=${i + avatars + 10}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <MoreHorizontal className="w-4 h-4 text-slate-300 hover:text-slate-500 transition-colors" />
      </div>
    </div>
  );
}
