import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, BarChart2, Briefcase, Users, CheckCircle, Clock, LayoutTemplate, Calendar, AlertCircle, Download } from 'lucide-react';
import apiClient from '../../api/client';

type Tab = 'overview' | 'projects' | 'tasks' | 'timeline';

export default function Reports() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Filters for Tasks tab
  const [projectFilter, setProjectFilter] = useState<string>('All');
  const [orgFilter, setOrgFilter] = useState<string>('All');
  const [teamFilter, setTeamFilter] = useState<string>('All');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const { data: stats, isLoading: isLoadingStats, isError, error } = useQuery({
    queryKey: ['reports', 'overview'],
    queryFn: async () => {
      const response = await apiClient.get('/api/reports');
      return response.data;
    },
    retry: false
  });

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['reports', 'projects'],
    queryFn: async () => {
      const response = await apiClient.get('/api/reports/projects');
      return response.data;
    },
    enabled: activeTab === 'projects' && !isError
  });

  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['reports', 'tasks'],
    queryFn: async () => {
      const response = await apiClient.get('/api/reports/tasks');
      return response.data;
    },
    enabled: activeTab === 'tasks' && !isError
  });

  const { data: timeline, isLoading: isLoadingTimeline } = useQuery({
    queryKey: ['reports', 'timeline'],
    queryFn: async () => {
      const response = await apiClient.get('/api/reports/timeline');
      return response.data;
    },
    enabled: activeTab === 'timeline' && !isError
  });

  const formatHours = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  // Filtered Tasks logic
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.filter((t: any) => {
      if (projectFilter !== 'All' && t.projectName !== projectFilter) return false;
      if (orgFilter !== 'All' && t.orgName !== orgFilter) return false;
      if (teamFilter !== 'All' && t.teamName !== teamFilter) return false;
      if (assigneeFilter !== 'All') {
        if (assigneeFilter === 'Unassigned' && t.assigneeName) return false;
        if (assigneeFilter !== 'Unassigned' && t.assigneeName !== assigneeFilter) return false;
      }
      if (statusFilter !== 'All' && t.status !== statusFilter) return false;
      return true;
    });
  }, [tasks, projectFilter, orgFilter, teamFilter, assigneeFilter, statusFilter]);

  // Unique lists for dropdowns
  const uniqueProjects = Array.from(new Set(tasks?.map((t: any) => t.projectName))).filter(Boolean);
  const uniqueOrgs = Array.from(new Set(tasks?.map((t: any) => t.orgName))).filter(Boolean);
  const uniqueTeams = Array.from(new Set(tasks?.map((t: any) => t.teamName))).filter(Boolean);
  const uniqueAssignees = Array.from(new Set(tasks?.map((t: any) => t.assigneeName))).filter(Boolean);
  const uniqueStatuses = Array.from(new Set(tasks?.map((t: any) => t.status))).filter(Boolean);

  const exportCsv = () => {
    if (!filteredTasks || filteredTasks.length === 0) return;
    const headers = ['Status', 'Project Name', 'Organization', 'Team', 'Task Name', 'Assigned', 'Due Date', 'Priority'];
    const rows = filteredTasks.map((t: any) => [
      t.status,
      t.projectName || '',
      t.orgName || '',
      t.teamName || '',
      t.title || '',
      t.assigneeName || 'Unassigned',
      t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No Due Date',
      t.priority || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((r: any[]) => r.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tasks_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoadingStats) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (isError) {
    const status = (error as any)?.response?.status;
    if (status === 403) {
      return (
        <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart2 className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-500">You must be an Organization Admin to view aggregate reports.</p>
        </div>
      );
    }
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Reports</h2>
        <p className="text-slate-500">Failed to load reporting data.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
          <BarChart2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Reports</h1>
          <p className="text-slate-500 mt-1 font-medium">Analytics across your organizations</p>
        </div>
      </div>

      <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-xl mb-8 w-max border border-slate-200/60">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<BarChart2 className="w-4 h-4" />}>Overview</TabButton>
        <TabButton active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={<Briefcase className="w-4 h-4" />}>Projects</TabButton>
        <TabButton active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} icon={<CheckCircle className="w-4 h-4" />}>Tasks</TabButton>
        <TabButton active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} icon={<Calendar className="w-4 h-4" />}>Team Timeline</TabButton>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReportCard title="Total Projects" value={stats.totalProjects} icon={<Briefcase className="w-6 h-6 text-blue-500" />} bgColor="bg-blue-50" />
            <ReportCard title="Total Teams" value={stats.totalTeams} icon={<LayoutTemplate className="w-6 h-6 text-indigo-500" />} bgColor="bg-indigo-50" />
            <ReportCard title="Unique Members" value={stats.totalMembers} icon={<Users className="w-6 h-6 text-green-500" />} bgColor="bg-green-50" />
            <ReportCard title="Total Issues Created" value={stats.totalIssues} icon={<BarChart2 className="w-6 h-6 text-purple-500" />} bgColor="bg-purple-50" />
            <ReportCard title="Issues Completed" value={stats.completedIssues} icon={<CheckCircle className="w-6 h-6 text-teal-500" />} bgColor="bg-teal-50" subtitle={`${stats.totalIssues > 0 ? Math.round((stats.completedIssues / stats.totalIssues) * 100) : 0}% completion rate`} />
            <ReportCard title="Total Time Logged" value={formatHours(stats.totalTimeLoggedMinutes)} icon={<Clock className="w-6 h-6 text-amber-500" />} bgColor="bg-amber-50" />
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {isLoadingProjects ? (
            <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-semibold">
                    <th className="px-6 py-4">Project Name</th>
                    <th className="px-6 py-4">Organization</th>
                    <th className="px-6 py-4">Progress</th>
                    <th className="px-6 py-4 text-right">Time Logged</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects?.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No projects found.</td></tr>
                  )}
                  {projects?.map((p: any) => {
                    const percent = p.totalTasks > 0 ? Math.round((p.completedTasks / p.totalTasks) * 100) : 0;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{p.name}</td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{p.orgName}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-brand-500 rounded-full" style={{ width: `${percent}%` }}></div>
                            </div>
                            <span className="text-xs font-bold text-slate-600 w-8">{percent}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-slate-600">{formatHours(p.totalTimeLoggedMinutes)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
          
          <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <FilterSelect label="Organization" value={orgFilter} onChange={setOrgFilter} options={uniqueOrgs} />
            <FilterSelect label="Project" value={projectFilter} onChange={setProjectFilter} options={uniqueProjects} />
            <FilterSelect label="Team" value={teamFilter} onChange={setTeamFilter} options={uniqueTeams} />
            <FilterSelect label="Assigned" value={assigneeFilter} onChange={setAssigneeFilter} options={uniqueAssignees} allowUnassigned />
            <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={uniqueStatuses} />
            
            <button 
              onClick={exportCsv}
              className="ml-auto flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              Export as CSV
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {isLoadingTasks ? (
              <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Project Name</th>
                      <th className="px-6 py-4">Task Name</th>
                      <th className="px-6 py-4">Assigned</th>
                      <th className="px-6 py-4">Due Date</th>
                      <th className="px-6 py-4">Organization</th>
                      <th className="px-6 py-4">Team</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredTasks?.length === 0 && (
                      <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500">No tasks found matching criteria.</td></tr>
                    )}
                    {filteredTasks?.map((t: any) => (
                      <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className={`font-bold ${t.status === 'DONE' ? 'text-green-600' : 'text-red-500'}`}>
                            {t.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700">{t.projectName}</td>
                        <td className="px-6 py-4 text-slate-900 font-medium">{t.title}</td>
                        <td className="px-6 py-4 text-slate-700 font-medium">{t.assigneeName || <span className="text-slate-400 italic">Unassigned</span>}</td>
                        <td className="px-6 py-4 text-slate-600">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No Due Date'}</td>
                        <td className="px-6 py-4 text-slate-500">{t.orgName}</td>
                        <td className="px-6 py-4 text-slate-500">{t.teamName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          {isLoadingTimeline ? (
            <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>
          ) : timeline?.length === 0 ? (
             <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">No team members found.</div>
          ) : (
            timeline?.map((member: any) => (
              <div key={member.memberId} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-indigo-500 text-white flex items-center justify-center text-lg font-bold shadow-md">
                    {member.memberName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{member.memberName}</h3>
                    <p className="text-sm text-slate-500">{member.email}</p>
                  </div>
                  <div className="ml-auto bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="text-sm font-bold text-slate-700">{member.tasks.length}</span>
                    <span className="text-xs text-slate-500 font-medium ml-1">Active Tasks</span>
                  </div>
                </div>

                {member.tasks.length === 0 ? (
                  <div className="flex items-center gap-2 text-slate-400 text-sm italic py-2">
                    <CheckCircle className="w-4 h-4" /> No active tasks. Clear schedule!
                  </div>
                ) : (
                  <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                    {member.tasks.map((task: any) => (
                      <div key={task.id} className="min-w-[260px] max-w-[260px] bg-slate-50 rounded-xl p-4 border border-slate-200/60 snap-start shrink-0 relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-1 h-full ${task.priority === 'HIGH' ? 'bg-red-400' : task.priority === 'MEDIUM' ? 'bg-amber-400' : 'bg-green-400'}`}></div>
                        <p className="text-xs font-bold text-brand-600 mb-1 tracking-wider uppercase">{task.projectName} • {task.orgName}</p>
                        <h4 className="font-semibold text-slate-900 text-sm mb-2 line-clamp-2">{task.title}</h4>
                        <div className="flex items-center gap-2 mt-auto pt-2">
                          <span className="text-[10px] font-bold bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded uppercase">{task.status.replace('_', ' ')}</span>
                          {task.dueDate && (
                            <span className="flex items-center gap-1 text-xs font-medium text-slate-500 ml-auto">
                              <AlertCircle className="w-3.5 h-3.5" />
                              {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, allowUnassigned }: any) {
  return (
    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-sm font-semibold text-slate-900 outline-none border-none appearance-none pr-4 cursor-pointer"
        style={{ WebkitAppearance: 'none' }}
      >
        <option value="All">All</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
        ))}
        {allowUnassigned && <option value="Unassigned">Unassigned</option>}
      </select>
    </div>
  );
}

function TabButton({ active, onClick, children, icon }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
        active 
          ? 'bg-white text-brand-600 shadow-sm ring-1 ring-slate-900/5' 
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function ReportCard({ title, value, icon, bgColor, subtitle }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <p className="text-slate-500 font-medium text-sm mb-1">{title}</p>
          <h3 className="text-3xl font-black text-slate-900">{value}</h3>
          {subtitle && <p className="text-xs font-bold text-brand-600 mt-2 bg-brand-50 inline-block px-2 py-0.5 rounded-full">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bgColor}`}>
          {icon}
        </div>
      </div>
      <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full ${bgColor} opacity-50 group-hover:scale-150 transition-transform duration-500`}></div>
    </div>
  );
}
