import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Lock, CheckCircle, Clock, ChevronRight, Award, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

const MODULES = [
  {
    id: 1,
    title: 'Fundamentos de Excel',
    description: 'Interfaz, celdas, rangos, formatos básicos y atajos esenciales.',
    image: '/images/modules/1_fundamentos.png',
    duration: '4 horas',
    lessons: 12,
  },
  {
    id: 2,
    title: 'Fórmulas y Funciones',
    description: 'SUMA, PROMEDIO, BUSCARV, SI, CONCATENAR y funciones anidadas.',
    image: '/images/modules/2_formulas.png',
    duration: '6 horas',
    lessons: 18,
  },
  {
    id: 3,
    title: 'Tablas Dinámicas',
    description: 'Crear, filtrar, segmentar y analizar datos con tablas dinámicas.',
    image: '/images/modules/3_tablas_dinamicas.png',
    duration: '5 horas',
    lessons: 14,
  },
  {
    id: 4,
    title: 'Gráficos Avanzados',
    description: 'Gráficos combinados, sparklines, mapas de calor y dashboards.',
    image: '/images/modules/4_graficos.png',
    duration: '4 horas',
    lessons: 10,
  },
  {
    id: 5,
    title: 'Macros y VBA',
    description: 'Automatización con macros, editor VBA, bucles y formularios.',
    image: '/images/modules/5_vba.png',
    duration: '8 horas',
    lessons: 20,
  },
  {
    id: 6,
    title: 'Power Query',
    description: 'Importar, transformar y combinar datos de múltiples fuentes.',
    image: '/images/modules/6_power_query.png',
    duration: '5 horas',
    lessons: 12,
  },
  {
    id: 7,
    title: 'Power BI Ejecutivo',
    description: 'Modelado de datos, DAX, visualizaciones y publicación en servicio.',
    image: '/images/modules/7_powerbi.png',
    duration: '10 horas',
    lessons: 24,
  },
];

export default function ExcelCurso() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<any[]>([]);
  const [showExamModal, setShowExamModal] = useState(false);

  // Obtener usuario desde el token
  useEffect(() => {
    const token = localStorage.getItem('excel_token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetch('/api/trpc/auth.me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data?.result?.data) {
        setUser(data.result.data);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error('Error al obtener usuario:', err);
      setLoading(false);
    });
  }, []);

  // Obtener progreso del usuario
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('excel_token');
    
    fetch('/api/trpc/excel.getUserProgress', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data?.result?.data) {
        setProgress(data.result.data);
      }
    })
    .catch(err => console.error('Error al obtener progreso:', err));
  }, [user]);

  const completedModules = progress?.map((p: any) => p.moduleId) || [];
  const totalModules = MODULES.length;
  const completedCount = completedModules.length;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  const isModuleUnlocked = (moduleId: number) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (moduleId === 1) return true;
    return completedModules.includes(moduleId - 1);
  };

  const isModuleCompleted = (moduleId: number) => completedModules.includes(moduleId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-slate-600 dark:text-slate-400">
        Cargando...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Acceso Requerido</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Debes iniciar sesión para acceder al curso de Excel Avanzado.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
          >
            Ingresar al Curso
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-emerald-600" />
            Excel Avanzado + Power BI
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            7 módulos · 42 horas · 110 lecciones · Certificación incluida
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-slate-400">Progreso General</p>
            <p className="text-2xl font-bold text-emerald-600">{progressPercent}%</p>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-slate-200 dark:text-slate-700" />
              <circle
                cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - progressPercent / 100)}`}
                className="text-emerald-600 transition-all duration-500"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
              {completedCount}/{totalModules}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Módulos completados: {completedCount} de {totalModules}
          </span>
          {completedCount === totalModules && (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
              <Award className="h-4 w-4" />
              ¡Curso completado!
            </span>
          )}
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
          <div
            className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Exam Button */}
      {completedCount === totalModules && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 text-center">
          <Award className="h-12 w-12 text-amber-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300 mb-2">
            ¡Felicidades! Has completado todos los módulos
          </h3>
          <p className="text-amber-700 dark:text-amber-400 mb-4">
            Ahora puedes rendir el examen final para obtener tu certificado.
          </p>
          <Link
            to="/excel/examen"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors"
          >
            <BarChart3 className="h-5 w-5" />
            Rendir Examen Final
          </Link>
        </div>
      )}

      {/* Modules Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULES.map((module) => {
          const unlocked = isModuleUnlocked(module.id);
          const completed = isModuleCompleted(module.id);

          return (
            <div
              key={module.id}
              className={`group relative bg-white dark:bg-slate-800 rounded-xl border overflow-hidden transition-all ${
                unlocked
                  ? 'border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700 cursor-pointer'
                  : 'border-slate-200 dark:border-slate-700 opacity-75'
              }`}
            >
              {/* Module Image */}
              <div className="relative h-40 bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <img
                  src={module.image}
                  alt={module.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="160"%3E%3Crect fill="%23f1f5f9" width="400" height="160"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EMódulo ' + module.id + '%3C/text%3E%3C/svg%3E';
                  }}
                />
                {completed && (
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white rounded-full p-1">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                )}
                {!unlocked && (
                  <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    Módulo {module.id}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {module.duration}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {module.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {module.description}
                </p>

                {unlocked ? (
                  <Link
                    to={`/excel/module/${module.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    {completed ? 'Revisar módulo' : 'Comenzar módulo'}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 text-sm text-slate-400">
                    <Lock className="h-4 w-4" />
                    Completa el módulo anterior
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
