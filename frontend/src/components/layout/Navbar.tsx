import { Link } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-slate-900 font-bold text-xl tracking-tight">
        <LayoutGrid className="w-6 h-6 text-slate-900" />
        Goti
      </Link>
      
      <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2 gap-8 text-[15px] font-medium text-slate-700">
        <a href="#product" className="hover:text-slate-900 transition-colors">Product</a>
        <a href="#solution" className="hover:text-slate-900 transition-colors">Solution</a>
        <a href="#resources" className="hover:text-slate-900 transition-colors">Resources</a>
        <a href="#support" className="hover:text-slate-900 transition-colors">Support</a>
        <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
      </div>

      <div className="flex items-center gap-6">
        <Link to="/login" className="text-[15px] font-medium text-slate-700 hover:text-slate-900 transition-colors">
          Log In
        </Link>
        <Link to="/register" className="text-[15px] font-medium bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full shadow-sm transition-all">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
