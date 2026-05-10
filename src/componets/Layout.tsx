import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, LogOut, User, Shield, Home } from 'lucide-react';
import { toast } from 'sonner';

export function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  const handleLogout = async () => {
    await logout();
    toast.success('Sesión cerrada correctamente');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-emerald-600" />
              <span className="font-bold text-xl text-slate-800 dark:text-white">
                Excel Academy
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <Home className="h-4 w-4" />
                Inicio
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/admin'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Salir
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Ingresar
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            © 2026 Excel Academy — Creado con amor by LRU
          </p>
        </div>
      </footer>
    </div>
  );
}
