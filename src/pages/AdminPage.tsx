import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { trpc } from '../providers/trpc';
import { Shield, Plus, Trash2, Copy, Check, Users, KeyRound, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPage() {
  const { user } = useAuth();
  const [newKeyType, setNewKeyType] = useState<'individual' | 'institucion'>('individual');
  const [institutionName, setInstitutionName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'keys' | 'users' | 'progress'>('keys');

  const utils = trpc.useUtils();

  // Queries
  const { data: keys, isLoading: keysLoading } = trpc.admin.getAllKeys.useQuery(undefined, {
    enabled: user?.role === 'admin',
  });
  const { data: allUsers, isLoading: usersLoading } = trpc.admin.getAllUsers.useQuery(undefined, {
    enabled: user?.role === 'admin',
  });

  // Mutations
  const createKeysMutation = trpc.admin.createKeys.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.length} clave(s) generada(s) exitosamente`);
      utils.admin.getAllKeys.invalidate();
      setInstitutionName('');
      setGroupName('');
      setQuantity(1);
    },
    onError: (error) => {
      toast.error(error.message || 'Error al generar claves');
    },
  });

  const deleteKeyMutation = trpc.admin.deleteKey.useMutation({
    onSuccess: () => {
      toast.success('Clave eliminada');
      utils.admin.getAllKeys.invalidate();
    },
  });

  const handleCreateKeys = async () => {
    if (newKeyType === 'institucion' && !institutionName.trim()) {
      toast.error('Ingresa el nombre de la institución');
      return;
    }
    await createKeysMutation.mutateAsync({
      type: newKeyType,
      quantity,
      institutionName: institutionName || undefined,
      groupName: groupName || undefined,
    });
  };

  const copyToClipboard = (keyCode: string) => {
    navigator.clipboard.writeText(keyCode);
    setCopiedKey(keyCode);
    toast.success('Clave copiada al portapapeles');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Acceso Denegado</h1>
        <p className="text-slate-600 dark:text-slate-400">
          No tienes permisos de administrador para ver esta página.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-emerald-600" />
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Panel de Administración</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {[
          { id: 'keys' as const, label: 'Claves de Acceso', icon: KeyRound },
          { id: 'users' as const, label: 'Usuarios', icon: Users },
          { id: 'progress' as const, label: 'Progreso', icon: RefreshCw },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Keys */}
      {activeTab === 'keys' && (
        <div className="space-y-6">
          {/* Generate Keys Form */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-emerald-600" />
              Generar Nuevas Claves
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tipo
                </label>
                <select
                  value={newKeyType}
                  onChange={(e) => setNewKeyType(e.target.value as 'individual' | 'institucion')}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="individual">Individual</option>
                  <option value="institucion">Institución/Empresa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Cantidad
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Institución {newKeyType === 'institucion' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="Nombre de empresa/institución"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Grupo/Curso
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Ej: Grupo A, Curso 2026"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>
            <button
              onClick={handleCreateKeys}
              disabled={createKeysMutation.isPending}
              className="mt-4 px-6 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {createKeysMutation.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Generando...</>
              ) : (
                <><Plus className="h-4 w-4" /> Generar Claves</>
              )}
            </button>
          </div>

          {/* Keys List */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white">Claves Generadas</h3>
            </div>
            {keysLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
              </div>
            ) : keys && keys.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Clave</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Tipo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Institución</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Grupo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Estado</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {keys.map((key) => (
                      <tr key={key.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                        <td className="px-4 py-3">
                          <code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-sm font-mono text-slate-900 dark:text-white">
                            {key.keyCode}
                          </code>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 capitalize">{key.type}</td>
                        <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{key.institutionName || '-'}</td>
                        <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{key.groupName || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            key.used
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                          }`}>
                            {key.used ? 'Usada' : 'Disponible'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => copyToClipboard(key.keyCode)}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
                              title="Copiar clave"
                            >
                              {copiedKey === key.keyCode ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => deleteKeyMutation.mutate(key.id)}
                              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                              title="Eliminar clave"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                No hay claves generadas aún
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Users */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white">Usuarios Registrados</h3>
          </div>
          {usersLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
            </div>
          ) : allUsers && allUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Nombre</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Rol</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Excel Autorizado</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Registro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {allUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{u.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          u.isExcelAuthorized
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                        }`}>
                          {u.isExcelAuthorized ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString('es-CL')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              No hay usuarios registrados
            </div>
          )}
        </div>
      )}

      {/* Tab: Progress */}
      {activeTab === 'progress' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
          <RefreshCw className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Progreso de Estudiantes</h3>
          <p className="text-slate-500 dark:text-slate-400">
            Próximamente: visualización detallada del progreso por estudiante y módulo.
          </p>
        </div>
      )}
    </div>
  );
}
