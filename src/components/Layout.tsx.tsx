import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/button';

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">Excel Academy</Link>
          <div className="flex gap-4 items-center">
            {user ? (
              <>
                <span className="text-sm">Hola, {user.name}</span>
                {user.role === 'admin' && (
                  <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
                    Admin
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={logout}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/login')}>Iniciar sesión</Button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        © 2025 Excel Academy - IA Academy
      </footer>
    </div>
  );
}