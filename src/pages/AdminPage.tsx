import React, { useEffect, useState } from 'react';
import { Shield, Plus, Trash2, Copy, Check, Users, KeyRound, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [keys, setKeys] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'keys' | 'users' | 'progress'>('keys');
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
        const authRes = await fetch('/api/trpc/auth.me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const authData = await authRes.json();
        if (!authData.result?.data || authData.result.data.role !== 'admin') {
          toast.error("Acceso restringido");
          window.location.href = '/curso';
          return;
        }
        setUser(authData.result.data);
        const [keysRes, usersRes] = await Promise.all([
          fetch('/api/trpc/admin.getAllKeys', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/trpc/admin.getAllUsers', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        const kData = await keysRes.json();
        const uData = await usersRes.json();
        setKeys(kData.result?.data || []);
        setAllUsers(uData.result?.data || []);
      } catch (e) {
        console.error(e);
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ type: newKeyType, quantity, institutionName: institutionName || undefined, groupName: groupName || undefined }),
      });
      if (res.ok) {
        toast.success("Claves generadas");
        const updated = await fetch('/api/trpc/admin.getAllKeys', { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await updated.json();
        setKeys(data.result?.data || []);
        setInstitutionName(''); setGroupName(''); setQuantity(1);
      }
    } catch (e) {
      toast.error("Error al generar claves");
    }
  };

  const deleteKey = async (id: string) => {
    const token = localStorage.getItem('excel_token');
    try {
      const res = await fetch('/api/trpc/admin.deleteKey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toast.success("Eliminado");
        setKeys(keys.filter(k => k.id !== id));
      }
    } catch (e) {
      toast.error("Error al eliminar");
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/30"><Shield className="h-8 w-8 text-white" /></div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Control Center</h1>
            <p className="text-slate-500 text-sm">IA Academy Admin</p>
          </div>
        </div>
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          {[ { id: 'keys', label: 'Accesos', icon: KeyRound }, { id: 'users', label: 'Alumnos', icon: Users }, { id: 'progress', label: 'Métricas', icon: RefreshCw } ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              <tab.icon className="h-3 w-3" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'keys' && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white"><Plus className="h-5 w-5 text-emerald-600" /> Crear Accesos</h2>
            <form onSubmit={handleCreateKeys} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Tipo</label>
                <select value={newKeyType} onChange={(e) => setNewKeyType(e.target.value as any)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm">
                  <option value="individual">Individual</option><option value="institucion">Institucional</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Cantidad</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Institución</label>
                <input type="text" value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-sm" placeholder="Opcional" />
              </div>
              <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/30">Generar Ahora</button>
            </form>
          </div>
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white">Inventario de Claves</h3>
              <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">{keys.length} totales</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold">
                  <tr><th className="px-6 py-4">Código</th><th className="px-6 py-4">Tipo</th><th className="px-6 py-4">Estado</th><th className="px-6 py-4 text-right">Acciones</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {keys.map(key => (
                    <tr key={key.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-emerald-600 font-bold">{key.keyCode}</td>
                      <td className="px-6 py-4 capitalize">{key.type}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${key.used ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {key.used ? 'Usada' : 'Disponible'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { navigator.clipboard.writeText(key.keyCode); toast.success("Copiada"); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all">
                            <Copy className="h-4 w-4" />
                          </button>
                          <button onClick={() => deleteKey(key.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-all">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white">Directorio de Alumnos</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold">
                <tr><th className="px-6 py-4">Usuario</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Estado</th><th className="px-6 py-4">Registro</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {allUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-bold">{u.name}</td>
                    <td className="px-6 py-4 text-slate-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <div className={`h-2 w-2 rounded-full inline-block mr-2 ${u.isExcelAuthorized ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      {u.isExcelAuthorized ? 'Ok' : 'Pendiente'}
                    </td>
                    <td className="px-6 py-4 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <RefreshCw className="h-12 w-12 text-slate-400 mx-auto animate-spin-slow" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Métricas en Tiempo Real</h3>
          <p className="text-slate-500 max-w-md mx-auto">Estamos procesando los datos de progreso para mostrarte el rendimiento de tus alumnos.</p>
          <div className="flex justify-center">
            <span className="px-4 py-2 rounded-full bg-amber-100 text-amber-600 text-xs font-black uppercase">Próximamente</span>
          </div>
        </div>
      )}
    </div>
  );
}
