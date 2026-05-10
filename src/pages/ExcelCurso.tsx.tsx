import { useExcelAuth } from '@/hooks/useExcelAuth';
import { trpc } from '@/providers/trpc';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { sendExcelAccessRequest, sendAutoResponse } from '@/lib/emailjs';
import { toast } from 'sonner';

export default function ExcelCurso() {
  const { user, isLoading, isAuthorized, progress, refetchProgress } = useExcelAuth();
  const { data: modules = [], refetch: refetchModules } = trpc.excel.moduleList.useQuery();
  const navigate = useNavigate();

  const requestAccessMutation = trpc.excel.requestAccess.useMutation({
    onSuccess: async () => {
      if (user) {
        await Promise.all([
          sendExcelAccessRequest(user.name, user.email),
          sendAutoResponse(user.name, user.email),
        ]);
        toast.success('Solicitud enviada. Revisa tu correo.');
        refetchModules();
        refetchProgress();
      }
    },
    onError: (error) => toast.error(error.message),
  });

  if (isLoading) return <div className="text-center py-10">Cargando...</div>;

  if (!user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-3xl font-bold">Excel Avanzado</h1>
        <p className="mt-4">Inicia sesión para acceder al curso.</p>
        <Button onClick={() => navigate('/login')} className="mt-4">Iniciar sesión</Button>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-3xl font-bold">Acceso restringido</h1>
        <p className="mt-4">Este curso requiere autorización especial.</p>
        <Button onClick={() => requestAccessMutation.mutate()} disabled={requestAccessMutation.isPending}>
          {requestAccessMutation.isPending ? 'Enviando...' : 'Solicitar acceso'}
        </Button>
      </div>
    );
  }

  const progressMap = new Map(progress?.map((p) => [p.moduleId, p.percentage]) || []);
  const totalProgress = modules.reduce((acc, m) => acc + (progressMap.get(m.id) || 0), 0) / modules.length;

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Excel Avanzado</h1>
        <p className="text-muted-foreground">Domina tablas dinámicas, VBA, Power Query y más</p>
        <div className="mt-4 max-w-md mx-auto">
          <div className="flex justify-between text-sm mb-1">
            <span>Progreso total</span>
            <span>{Math.round(totalProgress)}%</span>
          </div>
          <Progress value={totalProgress} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const moduleProgress = progressMap.get(module.id) || 0;
          return (
            <Card key={module.id}>
              <img
                src={module.coverImage}
                alt={module.title}
                className="h-48 w-full object-cover rounded-t-lg"
                onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Excel')}
              />
              <CardHeader>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>{module.description.substring(0, 100)}...</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progreso</span>
                  <span>{moduleProgress}%</span>
                </div>
                <Progress value={moduleProgress} />
                <p className="text-xs text-muted-foreground mt-2">{module.durationHours} horas</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => navigate(`/excel/module/${module.id}`)}>
                  {moduleProgress === 100 ? 'Repasar' : 'Continuar'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}