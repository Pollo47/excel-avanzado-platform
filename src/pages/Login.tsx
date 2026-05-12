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
        body: JSON.stringify({
          email: email, 
          keyCode: key 
        }),
      });

      const data = await response.json();

      if (data.error) {
        // Si el error es un array (como el que viste en pantalla), sacamos el primer mensaje
        const msg = Array.isArray(data.error) 
          ? data.error[0]?.message 
          : data.error.message || 'Error al iniciar sesión';
        setError(msg);
      } else if (data.result?.data?.token) {
        localStorage.setItem('excel_token', data.result.data.token);
        navigate('/curso');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Acceso Excel Academy</h2>
        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            className="w-full p-2 border rounded" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Clave de Acceso</label>
          <input 
            type="password" 
            className="w-full p-2 border rounded" 
            value={key} 
            onChange={(e) => setKey(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">
          Ingresar al Curso
        </button>
      </form>
    </div>
  );
}
