import { LayoutGrid } from 'lucide-react';

export default function PlaceholderView({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center shadow-sm mb-6">
        <LayoutGrid className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-4">{title}</h1>
      <p className="text-slate-500 max-w-md mx-auto">
        This feature is currently under development. Check back later for updates!
      </p>
    </div>
  );
}
