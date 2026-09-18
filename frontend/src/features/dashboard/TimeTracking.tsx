import { useQuery } from '@tanstack/react-query';
import { Loader2, Clock } from 'lucide-react';
import apiClient from '../../api/client';

export default function TimeTracking() {
  const { data: timeLogs, isLoading } = useQuery({
    queryKey: ['time-logs'],
    queryFn: async () => {
      const response = await apiClient.get('/api/time-logs/me');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    );
  }

  const totalMinutes = timeLogs?.reduce((acc: number, log: any) => acc + log.durationMinutes, 0) || 0;
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Time Tracking</h1>
            <p className="text-slate-500 mt-1 font-medium">History of your logged time</p>
          </div>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Time Logged</p>
          <p className="text-2xl font-black text-brand-600">
            {totalHours}h {remainingMinutes}m
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Project / Issue</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {timeLogs?.map((log: any) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-900 whitespace-nowrap">
                  {new Date(log.loggedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-900">{log.issueTitle}</p>
                  <p className="text-xs font-medium text-slate-500">{log.projectName}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {log.description || '-'}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-brand-600 whitespace-nowrap text-right">
                  {Math.floor(log.durationMinutes / 60)}h {log.durationMinutes % 60}m
                </td>
              </tr>
            ))}
            {timeLogs?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  <Clock className="w-8 h-8 mx-auto text-slate-300 mb-3" />
                  <p className="font-medium">No time logged yet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
