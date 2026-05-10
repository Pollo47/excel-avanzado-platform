import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [keyCode, setKeyCode] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, keyCode, isRegistering ? name : undefined);
      toast.success('Inicio de sesión exitoso');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>Ingresa con tu correo y clave de acceso</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                placeholder="Clave de acceso (8 caracteres)"
                value={keyCode}
                onChange={(e) => setKeyCode(e.target.value.toUpperCase())}
                maxLength={8}
                required
              />
            </div>
            {isRegistering && (
              <div>
                <Input
                  placeholder="Nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isRegistering}
                />
              </div>
            )}
            <Button type="submit" className="w-full">Ingresar</Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-primary hover:underline"
            >
              {isRegistering ? '¿Ya tienes clave? Inicia sesión' : '¿Primera vez? Registra tu cuenta'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}