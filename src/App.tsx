import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Home as HomeIcon, ShieldCheck } from 'lucide-react';
import Home from './pages/Home';
import Login from './pages/Login';
import ExcelCurso from './pages/ExcelCurso';
import ExcelModule from './pages/ExcelModule';
import AdminPage from './pages/AdminPage';

function App() {
  const token = localStorage.getItem('excel_token');

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-slate-950">
        {/* NAVBAR GLOBAL */}
        <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-emerald-600 rounded-lg rotate-45 flex items-center justify-center">
                <span className="text-white font-black text-[10px] -rotate-45">IA</span>
              </div>
              <span className="font-black text-lg tracking-tighter text-slate-900 dark:text-white">IA ACADEMY</span>
            </div>
            
            <div className="flex items-center gap-6">
              <Link to="/" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-1">
                <HomeIcon className="h-4 w-4" /> Inicio
              </Link>
              {token && (
                <>
                  <Link to="/curso" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-1">
                    <BookOpen className="h-4 w-4" /> Curso
                  </Link>
                  <Link to="/admin" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4" /> Admin
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Contenido con padding superior para que el Navbar no tape nada */}
        <div className="pt-20 px-6">
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/curso" element={<ExcelCurso />} />
            <Route path="/excel/module/:moduleId" element={<ExcelModule />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// Componente auxiliar para los links del nav
function Link({ to, children, className }: any) {
  const { useNavigate } = require('react-router-dom');
  const navigate = useNavigate();
  return <span onClick={() => navigate(to)} className={`cursor-pointer ${className}`}>{children}</span>;
}

export default App;
