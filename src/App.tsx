import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import ExcelCurso from './pages/ExcelCurso'; // 👈 Ruta correcta según tu archivo

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = () => {
      setToken(localStorage.getItem('excel_token'));
      setLoading(false);
    };
    checkToken();
    window.addEventListener('storage', checkToken);
    return () => window.removeEventListener('storage', checkToken);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-slate-600 dark:text-slate-400">
        Cargando...
      </div>
    );
  }

  return (
    <>
      {token ? <ExcelCurso /> : <Login />}
      <Toaster />
    </>
  );
}

export default App;
