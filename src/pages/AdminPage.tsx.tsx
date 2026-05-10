import { useState } from 'react';
import { trpc } from '@/providers/trpc';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Key, Activity, TrendingUp, Plus, Trash2, RotateCcw, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPage() {
  const { user } = useAuth();
  const [entityName, setEntityName] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [keyToDelete, setKeyToDelete] = useState<number | null>(null);
  const [keyToReset, setKeyToReset] = useState<number | null>(null);

  const { data: stats } = trpc.admin.getStats.useQuery();
  const { data: keysData, refetch: refetchKeys } = trpc.admin.getKeys.useQuery();
  const { data: usersData, refetch: refetchUsers } = trpc.admin.getUsers.useQuery();
  const generateKey = trpc.admin.generateKey.useMutation({ onSuccess: () => { setEntityName(''); setEmailDomain(''); refetchKeys(); toast.success('Clave generada'); } });
  const deleteKey = trpc.admin.deleteKey.useMutation({ onSuccess: () => { setKeyToDelete(null); refetchKeys(); } });
  const resetKey = trpc.admin.resetKey.useMutation({ onSuccess: () => { setKeyToReset(null); refetchKeys(); } });
  const toggleExcelAuth = trpc.admin.toggleExcelAuthorization.useMutation({ onSuccess: () => refetchUsers() });

  if (user?.role !== 'admin') return <div className="text-center py-10">Acceso restringido</div>;

  const handleCopyKey = (key: string) => { navigator.clipboard.writeText(key); setCopiedKey(key); setTimeout(() => setCopiedKey(null), 2000); };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="dashboard"><TrendingUp className="h-4 w-4 mr-2" />Dashboard</TabsTrigger>
          <TabsTrigger value="keys"><Key className="h-4 w-4 mr-2" />Claves</TabsTrigger>
          <TabsTrigger value="users"><Users className="h-4 w-4 mr-2" />Usuarios</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card><CardHeader><CardTitle className="text-sm">Total Usuarios</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.totalUsers || 0}</div></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Claves Generadas</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.totalKeys || 0}</div></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Claves Usadas</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.usedKeys || 0}</div></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm">Usuarios Activos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats?.activeUsers || 0}</div></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="keys">
          <Card className="mb-6">
            <CardHeader><CardTitle>Generar nueva clave</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Nombre entidad (ej: Municipalidad)" value={entityName} onChange={(e) => setEntityName(e.target.value)} />
                <Input placeholder="Dominio email (opcional)" value={emailDomain} onChange={(e) => setEmailDomain(e.target.value)} />
              </div>
              <Button onClick={() => generateKey.mutate({ entityName, emailDomain: emailDomain || undefined })} disabled={!entityName.trim()}>Generar clave</Button>
              {generateKey.data && (
                <div className="p-4 bg-green-50 rounded-lg"><p className="text-sm font-medium">Clave generada:</p><code className="bg-white px-2 py-1 rounded border">{generateKey.data.key}</code>
                <Button variant="outline" size="sm" onClick={() => handleCopyKey(generateKey.data.key)}>{copiedKey === generateKey.data.key ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</Button></div>)}
            </CardContent>
          </Card>
          <Card><CardHeader><CardTitle>Claves existentes</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Clave</TableHead><TableHead>Entidad</TableHead><TableHead>Estado</TableHead><TableHead>Acciones</TableHead></TableRow></TableHeader>
          <TableBody>{keysData?.map(key => (<TableRow key={key.id}><TableCell className="font-mono">{key.keyCode}</TableCell><TableCell>{key.entityName}</TableCell><TableCell>{key.used ? <Badge>Usada</Badge> : <Badge variant="outline">Disponible</Badge>}</TableCell>
          <TableCell><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => setKeyToReset(key.id)} disabled={!key.used}><RotateCcw className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => setKeyToDelete(key.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button></div></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          <Dialog open={!!keyToReset} onOpenChange={() => setKeyToReset(null)}><DialogContent><DialogHeader><DialogTitle>Resetear clave</DialogTitle><DialogDescription>¿Marcar como no usada?</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setKeyToReset(null)}>Cancelar</Button><Button onClick={() => resetKey.mutate({ keyId: keyToReset! })}>Confirmar</Button></DialogFooter></DialogContent></Dialog>
          <Dialog open={!!keyToDelete} onOpenChange={() => setKeyToDelete(null)}><DialogContent><DialogHeader><DialogTitle>Eliminar clave</DialogTitle><DialogDescription>Esta acción no se puede deshacer.</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setKeyToDelete(null)}>Cancelar</Button><Button variant="destructive" onClick={() => deleteKey.mutate({ keyId: keyToDelete! })}>Eliminar</Button></DialogFooter></DialogContent></Dialog>
        </TabsContent>

        <TabsContent value="users">
          <Card><CardHeader><CardTitle>Usuarios registrados</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Email</TableHead><TableHead>Nombre</TableHead><TableHead>Rol</TableHead><TableHead>Acceso Excel</TableHead></TableRow></TableHeader>
          <TableBody>{usersData?.map(user => (<TableRow key={user.id}><TableCell>{user.email}</TableCell><TableCell>{user.name}</TableCell><TableCell>{user.role === 'admin' ? <Badge>Admin</Badge> : <Badge variant="outline">Usuario</Badge>}</TableCell>
          <TableCell><div className="flex items-center gap-2"><Badge variant={user.isExcelAuthorized ? 'default' : 'secondary'}>{user.isExcelAuthorized ? 'Autorizado' : 'Bloqueado'}</Badge>
          <Button size="sm" variant="outline" onClick={() => toggleExcelAuth.mutate({ userId: user.id, authorized: !user.isExcelAuthorized })}>{user.isExcelAuthorized ? 'Revocar' : 'Autorizar'}</Button></div></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}