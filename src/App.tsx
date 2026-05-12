import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Excel from './pages/Excel'; // Asegúrate de que la ruta sea correcta

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

  if (loading) return <div className="flex justify-center items-center h-screen">Cargando...</div>;

  return (
    <>
      {token ? <Excel /> : <Login />}
      <Toaster />
    </>
  );
}

export default App;
