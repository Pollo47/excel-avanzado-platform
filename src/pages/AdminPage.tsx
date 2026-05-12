import React, { useEffect, useState } from 'react';
import { Shield, Plus, Trash2, Copy, Check, Users, KeyRound, Loader2, RefreshCw, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [keys, setKeys] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'keys' | 'users' | 'progress'>('keys');

  // Estados del Formulario
  const [newKeyType, setNewKeyType] = useState<'individual' | 'institucion'>('individual');
  const [institutionName, setInstitutionName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('excel_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        // Verificar Administrador
        const authRes = await fetch('/api/trpc/auth.me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const authData = await authRes.json();
        const userData = authData.result?.data;

        if (!userData || userData.role !== 'admin') {
          toast.error("No tienes permisos de administrador");
          window.location.href = '/curso';
          return;
        }
        setUser(userData);

        // Cargar Claves y Usuarios
        const [keysRes, usersRes] = await Promise.all([
          fetch('/api/trpc/admin.getAllKeys', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/trpc/admin.getAllUsers', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const keysData = await keysRes.json();
        const usersData = await usersRes.json();

        setKeys(keysData.result?.data || []);
        setAllUsers(usersData.result?.data || []);
      } catch (e) {
        console.error("Error cargando panel admin", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCreateKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('excel_token');
    try {
      const res = await fetch('/api/trpc/admin.createKeys', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          type: newKeyType,
          quantity,
          institutionName: institutionName || undefined,
          groupName: groupName || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Claves generadas con éxito");
        // Recargar datos
        const updatedKeys = await fetch('/api/trpc/admin.getAllKeys', { headers: { 'Authorization': `Bearer ${token}` } });
        const updatedData = await updatedKeys.json();
        setKeys(updatedData.result?.data || []);
        setInstitutionName(''); setGroupName(''); setQuantity(1);
      }
    } catch (err) {
      toast.error("Error al generar claves");
    }
  };

  const deleteKey = async (id: string) => {
    const token = localStorage.getItem('excel_token');
    try {
      const res = await fetch('/api/trpc/admin.deleteKey', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toast.success("Clave eliminada");
        setKeys(keys.filter(k => k.id !== id));
      }
    } catch (e) {
      toast.error("Error al eliminar");
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(code);
    toast.success('Clave copiada');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/30">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Control Center</h1>
            <p className="text-slate-500 text-sm font-medium">Gestión de accesos IA Academy</p>
          </div>
        </div_>
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          {[
            { id: 'keys', label: 'Accesos', icon: KeyRound },
            { id: 'users', label: 'Alumnos', icon: Users },
            { id: 'progress', label: 'Métricas', icon: RefreshCw },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="h-3 w-3" /> {tab.label}
            </button>
          ))}
        </div_>
      </div_>

      {activeTab === 'keys' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulario de Generación */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Plus className="h-5 w-5 text-emerald-600" /> Crear Accesos
            </h2>
            <form onSubmit={handleCreateKeys} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Tipo de Licencia</label>
                <select
                  value={newKeyType}
                  onChange={(e) => setNewKeyType(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                >
                  <option value="individual">Individual</option>
                  <option value="institucion">Institucional / Empresa</option>
                </select>
              </div_>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Cantidad de Claves</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                />
              </div_>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Nombre Institución</label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  placeholder="Ej: Universidad Nacional"
                />
              </div_>
              <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2">
                <Plus className="h-5 w-5" /> Generar Ahora
              </button>
            </form>
          </div_>

          {/* Tabla de Claves */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white">Inventario de Claves</h3>
              <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg">{keys.length} totales</span>
            </div_>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 font-bold">
                  <tr>
                    <th className="px-6 py-4">Código</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {keys.map(key => (
                    <tr key={key.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-emerald-600 font-bold">{key.keyCode}</td>
                      <td className="px-6 py-4 capitalize">{key.type}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${key.used ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {key.used ? 'Usada' : 'Disponible'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => copyToClipboard(key.keyCode)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all">
                            {copiedKey === key.keyCode ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                          </button>
                          <button onClick={() => deleteKey(key.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-all">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div_>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div_>
          </div_>
        </div_>
      )}

      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white">Directorio de Alumnos</h3>
          </div_>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 font-bold">
                <tr>
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Estatus Excel</th>
                  <th className="px-6 py-4">Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {allUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 font-bold">{u.name}</td>
                    <td className="px-6 py-4 text-slate-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <div className={`h-2 w-2 rounded-full inline-block mr-2 ${u.isExcelAuthorized ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      {u.isExcelAuthorized ? 'Autorizado' : 'Pendiente'}
                    </td>
                    <td className="px-6 py-4 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div_>
        </div_>
      )}

      {activeTab === 'progress' && (
        <div className="bg-white dark:bg-slate-800 p-12 rounded-3xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto">
            <RefreshCw className="h-10 w-10 text-slate-400 animate-spin-slow" />
          </div_
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Analíticas de Progreso</h3>
          <p className="text-slate-500 max-w-md mx-auto">Estamos integrando el motor de análisis para que puedas ver el avance exacto de cada alumno en tiempo real.</p>
          <div className="pt-4 flex justify-center">
            <span className="px-4 py-2 rounded-full bg-amber-100 text-amber-600 text-xs font-black uppercase tracking-widest">En Desarrollo</span>
          </div_>
        </div_>
      )}
    </div>
  );
}
