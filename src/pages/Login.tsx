import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Mail, KeyRound, UserPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [keyCode, setKeyCode] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await login(email, keyCode, isRegistering ? name : undefined);
      if (result.success) {
        toast.success(isRegistering ? '¡Registro exitoso!' : '¡Bienvenido de vuelta!');
        navigate('/excel');
      } else {
        toast.error(result.message || 'Error al ingresar');
      }
    } catch (error) {
      toast.error('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
            <LogIn className="h-6 w-6 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isRegistering ? 'Crear Cuenta' : 'Ingresar al Curso'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {isRegistering 
              ? 'Regístrate con tu clave de acceso' 
              : 'Ingresa tu email y clave de acceso'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              <Mail className="inline h-4 w-4 mr-1" />
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              <KeyRound className="inline h-4 w-4 mr-1" />
              Clave de Acceso
            </label>
            <input
              type="text"
              value={keyCode}
              onChange={(e) => setKeyCode(e.target.value.toUpperCase())}
              required
              maxLength={8}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent uppercase"
              placeholder="ABC12345"
            />
            <p className="text-xs text-slate-500 mt-1">
              Ingresa la clave de 8 caracteres proporcionada por tu institución
            </p>
          </div>

          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                <UserPlus className="inline h-4 w-4 mr-1" />
                Tu Nombre Completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isRegistering}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Juan Pérez"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                {isRegistering ? 'Registrarme' : 'Ingresar'}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            {isRegistering 
              ? '¿Ya tienes cuenta? Ingresa aquí' 
              : '¿Primera vez? Regístrate con tu clave'}
          </button>
        </div>
      </div>
    </div>
  );
}
