import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">IA Academy</h1>
        <p className="text-xl text-muted-foreground">Plataforma de formación especializada</p>
      </div>

      {user ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/excel">
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <CardTitle>Excel Avanzado</CardTitle>
                <CardDescription>Tablas dinámicas, VBA, Power Query, Power Pivot y más</CardDescription>
              </CardHeader>
              <CardContent>
                <p>7 módulos con certificación digital</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Ingresar al curso</Button>
              </CardFooter>
            </Card>
          </Link>
          {/* Aquí se pueden agregar más cursos en el futuro */}
          <Card className="opacity-50">
            <CardHeader>
              <CardTitle>Próximamente</CardTitle>
              <CardDescription>Más cursos en desarrollo</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Power BI, Python, etc.</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4">Inicia sesión con tu clave de acceso para ver los cursos disponibles.</p>
          <Link to="/login">
            <Button>Iniciar sesión</Button>
          </Link>
        </div>
      )}
    </div>
  );
}