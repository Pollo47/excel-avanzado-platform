import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Lock, CheckCircle, Clock, ChevronRight, Award, BarChart3, AlertTriangle, FileText, Download, Headphones, Library, Target } from 'lucide-react';
import { toast } from 'sonner';

const MODULES = [
  { id: 1, title: 'Fundamentos de Excel Pro', description: 'Interfaz, celdas, rangos y los atajos que te harán volar en la oficina.', image: '/images/modules/1_fundamentos.png', duration: '4 horas', lessons: 12, audioText: "¡Qué onda! Iniciamos con lo básico pero indispensable.", resource: "Guía de Atajos Rápidos PDF" },
  { id: 2, title: 'Maestría en Fórmulas', description: 'Desde el BUSCARV clásico hasta el potente XLOOKUP y funciones anidadas.', image: '/images/modules/2_formulas.png', duration: '6 horas', lessons: 18, audioText: "Aquí es donde sucede la magia de la lógica.", resource: "Diccionario de Funciones" },
  { id: 3, title: 'Tablas Dinámicas', description: 'Transforma miles de filas en reportes ejecutivos en segundos.', image: '/images/modules/3_tablas_dinamicas.png', duration: '5 horas', lessons: 14, audioText: "Olvídate de sumar a mano, automatiza tus reportes.", resource: "Plantilla de Reporte" },
  { id: 4, title: 'Dashboards de Impacto', description: 'Crea tableros visuales que cuenten una historia y faciliten decisiones.', image: '/images/modules/4_graficos.png', duration: '4 horas', lessons: 10, audioText: "Un dato sin diseño es solo un número.", resource: "Paleta de Colores" },
  { id: 5, title: 'Macros y VBA', description: 'Crea tus propios botones y automatiza tareas repetitivas.', image: '/images/modules/5_vba.png', duration: '8 horas', lessons: 20, audioText: "Llegamos a las ligas mayores. Programa tu éxito.", resource: "Cheat Sheet VBA" },
  { id: 6, title: 'Power Query (ETL)', description: 'Limpia, transforma y combina datos de múltiples fuentes sin errores.', image: '/images/modules/6_power_query.png', duration: '5 horas', lessons: 12, audioText: "Limpia tus datos en segundos, no en horas.", resource: "Guía de Conectores" },
  { id: 7, title: 'Power BI Ejecutivo', description: 'Modelado DAX, relaciones de datos y publicación en la nube.', image: '/images/modules/7_powerbi.png', duration: '10 horas', lessons: 24, audioText: "El cierre maestro. Business Intelligence real.", resource: "Manual DAX" },
];

export default function ExcelCurso() {
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'modules' | 'library'>('modules');

  useEffect(() => {
    async function initApp() {
      const token = localStorage.getItem('excel_token');
      if (!token) { window.location.href = '/login'; return; }
      try {
        const authRes = await fetch('/api/trpc/auth.me', { headers: { 'Authorization': `Bearer ${token}` } });
        const authData = await authRes.json();
        if (!authRes.ok || !authData.result?.data) { localStorage.clear(); window.location.href = '/login'; return; }
        setUser(authData.result.data);
        const progRes = await fetch('/api/trpc/excel.getUserProgress', { headers: { 'Authorization': `Bearer ${token}` } });
        const progData = await progRes.json();
        if (progRes.ok && progData.result?.data) setProgress(progData.result.data);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }
    initApp();
  }, []);

  const completedModules = progress?.map((p: any) => p.moduleId) || [];
  const totalModules = MODULES.length;
  const completedCount = completedModules.length;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  const isModuleUnlocked = (id: number) => user?.role === 'admin' || id === 1 || completedModules.includes(id - 1);
  const isModuleCompleted = (id: number) => completedModules.includes(id);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-600"></div></div>;
  if (!user) return <div className="text-center py-20"><Link to="/login" className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold">Acceso Requerido</Link></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-emerald-600" /> IA Academy
          </h1>
          <p className="text-slate-500">Hola, <span className="font-bold text-emerald-600">{user.name}</span>. Tu camino al éxito comienza aquí.</p>
        </div>
        <div className="flex items-center gap-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
          <div className="text-right">
            <p className="text-[10px] uppercase font-black text-slate-400">Progreso</p>
            <p className="text-2xl font-black text-emerald-600">{progressPercent}%</p>
          </div>
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-slate-200 dark:text-slate-700" />
              <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none"
                strokeDasharray={125.6} strokeDashoffset={125.6 * (1 - progressPercent / 100)}
                className="text-emerald-600 transition-all duration-1000" strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{completedCount}/{totalModules}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800">
        <button onClick={() => setActiveTab('modules')} className={`pb-3 px-4 font-bold transition-all ${activeTab === 'modules' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-400'}`}>Módulos</button>
        <button onClick={() => setActiveTab('library')} className={`pb-3 px-4 font-bold transition-all ${activeTab === 'library' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-400'}`}>Biblioteca</button>
      </div>

      {activeTab === 'modules' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((m) => {
            const unlocked = isModuleUnlocked(m.id);
            const completed = isModuleCompleted(m.id);
            return (
              <div key={m.id} className={`group bg-white dark:bg-slate-900 rounded-3xl border transition-all ${unlocked ? 'hover:border-emerald-600 shadow-sm' : 'opacity-60'}`}>
                <div className="relative h-40 overflow-hidden rounded-t-3xl">
                  <img src={m.image} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  {!unlocked && <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center"><Lock className="h-8 w-8 text-white" /></div>}
                  {completed && <div className="absolute top-3 right-3 bg-emerald-600 text-white rounded-full p-1"><CheckCircle className="h-4 w-4" /></div>}
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                    <span>Módulo {m.id}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {m.duration}</span>
                  </div>
                  <h3 className="text-xl font-bold">{m.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{m.description}</p>
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl flex gap-3 border border-emerald-100 dark:border-emerald-800">
                    <Headphones className="h-4 w-4 text-emerald-600 shrink-0" />
                    <p className="text-xs italic text-emerald-700 dark:text-emerald-400">"{m.audioText}"</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    {unlocked ? (
                      <Link to={`/excel/module/${m.id}`} className="text-emerald-600 font-bold text-sm flex items-center gap-1 hover:underline">
                        {completed ? 'Repasar' : 'Empezar'} <ChevronRight className="h-4 w-4" />
                      </Link>
                    ) : <span className="text-slate-400 text-xs font-medium flex items-center gap-1"><Lock className="h-3 w-3" /> Bloqueado</span>}
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Target className="h-3 w-3" /> {m.lessons} Lecciones</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Library className="text-emerald-600" /> Recursos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MODULES.map(m => (
                  <div key={m.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between group transition-all">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-slate-400 group-hover:text-emerald-600" />
                      <span className="text-sm font-medium">{m.resource}</span>
                    </div>
                    <Download className="h-4 w-4 text-slate-300 cursor-pointer hover:text-emerald-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-lg">
              <h3 className="font-bold mb-2">Soporte IA Academy</h3>
              <p className="text-xs text-emerald-100 mb-4">¿Tienes dudas con un ejercicio?</p>
              <button className="w-full py-2 bg-white text-emerald-600 rounded-xl font-bold text-xs">Soporte Técnico</button>
            </div>
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Award className="text-amber-400" /> Ranking</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs p-2 bg-slate-800 rounded"><span>1. Juan Pérez</span> <span className="text-emerald-400">100%</span></div>
                <div className="flex justify-between text-xs p-2 bg-slate-800 rounded"><span>2. María G.</span> <span className="text-emerald-400">95%</span></div>
                <div className="flex justify-between text-xs p-2 bg-slate-800 rounded"><span>3. Tú</span> <span className="text-emerald-400">{progressPercent}%</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="pt-12 text-center space-y-2 border-t border-slate-100 dark:border-slate-800">
        <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">
          © {new Date().getFullYear()} <span className="text-emerald-600">IA Academy</span>
        </p>
      </footer>
    </div>
  );
}
