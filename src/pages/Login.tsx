import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/trpc/auth.login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, keyCode: key }),
      });
      const data = await response.json();
      if (data.error) {
        setError(Array.isArray(data.error) ? data.error[0]?.message : data.error.message || 'Error de acceso');
      } else if (data.result?.data?.token) {
        localStorage.setItem('excel_token', data.result.data.token);
        navigate('/curso');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <form onSubmit={handleLogin} className="p-10 bg-white dark:bg-slate-900 shadow-xl rounded-3xl w-full max-w-md border border-slate-100 dark:border-slate-800">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">IA Academy</h2>
          <p className="text-slate-500 mt-2">Ingresa tus credenciales de acceso</p>
        </div>
        {error && <div className="p-3 mb-6 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium border border-red-100">{error}</div>}
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1 ml-1">Email Corporativo</label>
            <input type="email" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1 ml-1">Clave de Acceso</label>
            <input type="password" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm" value={key} onChange={(e) => setKey(e.target.value)} required />
          </div>
          <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 dark:shadow-none">
            Ingresar al Aula
          </button>
        </div>
      </form>
    </div>
  );
}
