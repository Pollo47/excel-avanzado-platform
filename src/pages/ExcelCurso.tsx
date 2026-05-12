import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ExcelCurso() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('excel_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch('/api/trpc/auth.me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok && data.result?.data) {
          setUser(data.result.data);
        } else {
          localStorage.removeItem('excel_token');
          navigate('/login');
        }
      } catch (e) {
        console.error("Error verificando sesión", e);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [navigate]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;

  if (!user) return <div className="flex items-center justify-center min-h-screen">Acceso Requerido</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-green-700">¡Bienvenido al Curso de Excel Avanzado!</h1>
      <p className="mt-4 text-gray-600">Hola {user.name}, ya puedes acceder a todos los módulos.</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow rounded border-l-4 border-green-500">Módulo 1: Tablas Dinámicas</div>
        <div className="p-4 bg-white shadow rounded border-l-4 border-green-500">Módulo 2: Macros y VBA</div>
        <div className="p-4 bg-white shadow rounded border-l-4 border-green-500">Módulo 3: Power Query</div>
      </div>
    </div>
  );
}
