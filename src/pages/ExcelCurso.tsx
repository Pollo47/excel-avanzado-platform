import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Lock, CheckCircle, Clock, ChevronRight, 
  Award, BarChart3, AlertTriangle, FileText, 
  Download, Headphones, Library, Target, Star 
} from 'lucide-react';
import { toast } from 'sonner';

// --- CONFIGURACIÓN EXPANDIDA DE MÓDULOS ---
const MODULES = [
  {
    id: 1,
    title: 'Fundamentos de Excel Pro',
    description: 'Domina la interfaz, celdas, rangos y los atajos que te harán volar en la oficina.',
    image: '/images/modules/1_fundamentos.png',
    duration: '4 horas',
    lessons: 12,
    audioText: "¡Qué onda! Iniciamos con lo básico pero indispensable. Aquí aprenderás a moverte en Excel como todo un experto, olvidándote del mouse para ahorrar tiempo real.",
    resource: "Guía de Atajos Rápidos PDF",
    exercise: "Reto 1: Formateo de Base de Datos de Ventas"
  },
  {
    id: 2,
    title: 'Maestría en Fórmulas y Funciones',
    description: 'Desde el BUSCARV clásico hasta el potente XLOOKUP y funciones anidadas complejas.',
    image: '/images/modules/2_formulas.png',
    duration: '6 horas',
    lessons: 18,
    audioText: "Aquí es donde sucede la magia. Vamos a diseccionar las fórmulas para que no solo las copies, sino que entiendas la lógica detrás de cada función.",
    resource: "Diccionario de Funciones Lógicas",
    exercise: "Reto 2: Calculadora de Comisiones Automatizada"
  },
  {
    id: 3,
    title: 'Tablas Dinámicas y Análisis de Datos',
    description: 'Transforma miles de filas en reportes ejecutivos en segundos usando segmentadores.',
    image: '/images/modules/3_tablas_dinamicas.png',
    duration: '5 horas',
    lessons: 14,
    audioText: "Olvídate de sumar a mano. Con las tablas dinámicas vas a resumir la información de todo un año en un solo clic. ¡Es el corazón del análisis!",
    resource: "Plantilla de Reporte Mensual",
    exercise: "Reto 3: Análisis de Tendencias de Ventas Trimestrales"
  },
  {
    id: 4,
    title: 'Dashboards y Visualización de Impacto',
    description: 'Crea tableros visuales que cuenten una historia y faciliten la toma de decisiones.',
    image: '/images/modules/4_graficos.png',
    duration: '4 horas',
    lessons: 10,
    audioText: "Un dato sin diseño es solo un número. Vamos a crear dashboards que impacten a cualquier jefe o cliente, usando colores ejecutivos y gráficos limpios.",
    resource: "Paleta de Colores Corporativos",
    exercise: "Reto 4: Diseño de Dashboard de KPI's"
  },
  {
    id: 5,
    title: 'Automatización con Macros y VBA',
    description: 'Crea tus propios botones y automatiza tareas repetitivas para ganar horas de vida.',
    image: '/images/modules/5_vba.png',
    duration: '8 horas',
    lessons: 20,
    audioText: "¡Llegamos a las ligas mayores! Vamos a programar Excel para que trabaje por ti mientras tú te tomas un café. Bienvenido al mundo de VBA.",
    resource: "Cheat Sheet de Código VBA",
    exercise: "Reto 5: Automatizador de Envío de Reportes"
  },
  {
    id: 6,
    title: 'Power Query: El Arte del ETL',
    description: 'Limpia, transforma y combina datos de diferentes fuentes sin romper tu archivo.',
    image: '/images/modules/6_power_query.png',
    duration: '5 horas',
    lessons: 12,
    audioText: "Si pasas horas limpiando datos manualmente, Power Query es tu salvación. Aprenderás a conectar archivos y dejarlos impecables en segundos.",
    resource: "Guía de Conectores de Datos",
    exercise: "Reto 6: Consolidación de 12 Archivos Mensuales"
  },
  {
    id: 7,
    title: 'Power BI Ejecutivo',
    description: 'Modelado DAX, relaciones de datos y publicación de reportes en la nube.',
    image: '/images/modules/7_powerbi.png',
    duration: '10 horas',
    lessons: 24,
    audioText: "El cierre maestro. Llevamos todo lo aprendido a Power BI. Aprenderás DAX, que es el lenguaje más poderoso para análisis de datos moderno.",
    resource: "Manual de Referencia DAX",
    exercise: "Reto Final: Ecosistema de Business Intelligence"
  },
];

export default function ExcelCurso() {
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'modules' | 'library'>('modules');

  useEffect(() => {
    async function initApp() {
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

        if (!authRes.ok || !authData.result?.data) {
          localStorage.clear();
          window.location.href = '/login';
          return;
        }
        setUser(authData.result.data);

        const progRes = await fetch('/api/trpc/excel.getUserProgress', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const progData = await progRes.json();
        if (progRes.ok && progData.result?.data) {
          setProgress(progData.result.data);
        }
      } catch (e) {
        console.error("Error de inicialización", e);
      } finally {
        setLoading(false);
      }
    }
    initApp();
  }, []);

  const completedModules = progress?.map((p: any) => p.moduleId) || [];
  const totalModules = MODULES.length;
  const completedCount = completedModules.length;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  const isModuleUnlocked = (moduleId: number) => {
    if (user?.role === 'admin') return true;
    if (moduleId === 1) return true;
    return completedModules.includes(moduleId - 1);
  };

  const isModuleCompleted = (moduleId: number) => completedModules.includes(moduleId);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      <p className="text-slate-500 font-medium">Cargando tu academia...</p>
    </div>
  );

  if (!user) return (
    <div className="text-center py-12">
      <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Acceso Requerido</h1>
      <Link to="/login" className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold">Ingresar al Curso</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Corporativo */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-emerald-600" />
            Excel Pro & Power BI <span className="text-sm bg-emerald-100 text-emerald-700 px-2 py-1 rounded uppercase tracking-wider">Certificación</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Hola, <span className="font-bold text-emerald-600">{user.name}</span>. Estás en el camino a convertirte en un experto en análisis de datos.
          </p>
        </div>
        
        <div className="flex items-center gap-6 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase font-bold">Tu Progreso</p>
            <p className="text-2xl font-black text-emerald-600">{progressPercent}%</p>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-slate-200 dark:text-slate-700" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none"
                strokeDasharray={175.9} strokeDashoffset={175.9 * (1 - progressPercent / 100)}
                className="text-emerald-600 transition-all duration-1000" strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{completedCount}/{totalModules}</span>
          </div>
        </div>
      </div>

      {/* Navegación de Pestañas */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700">
        <button 
          onClick={() => setActiveTab('modules')}
          className={`pb-3 px-4 font-semibold transition-all ${activeTab === 'modules' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-500'}`}
        >
          Módulos de Aprendizaje
        </button>
        <button 
          onClick={() => setActiveTab('library')}
          className={`pb-3 px-4 font-semibold transition-all ${activeTab === 'library' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-500'}`}
        >
          Biblioteca de Recursos
        </button>
      </div>

      {activeTab === 'modules' ? (
        <div className="space-y-8">
          {completedCount === totalModules && (
            <div className="bg-gradient-to-r from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200 rounded-2xl p-8 text-center shadow-lg">
              <Award className="h-16 w-16 text-amber-600 mx-auto mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-300 mb-2">¡Misión Cumplida, Experto! 🏆</h3>
              <p className="text-amber-700 dark:text-amber-400 mb-6 max-w-2xl mx-auto">
                Has demostrado un dominio total de las herramientas. Estás listo para emitir tu certificación profesional avalada por la academia.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/excel/examen" className="px-8 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" /> Rendir Examen Final
                </Link>
                <button onClick={() => toast.success("Generando PDF de Certificación...")} className="px-8 py-3 bg-white text-amber-600 border border-amber-600 rounded-xl font-bold hover:bg-amber-50 flex items-center gap-2">
                  <Download className="h-5 w-5" /> Descargar Diploma
                </button>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((module) => {
              const unlocked = isModuleUnlocked(module.id);
              const completed = isModuleCompleted(module.id);

              return (
                <div key={module.id} className={`group bg-white dark:bg-slate-800 rounded-2xl border transition-all shadow-sm ${unlocked ? 'hover:shadow-xl hover:border-emerald-300 cursor-pointer' : 'opacity-60'}`}>
                  <div className="relative h-44 overflow-hidden">
                    <img src={module.image} alt={module.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    {!unlocked && <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center"><Lock className="h-10 w-10 text-white" /></div>}
                    {completed && <div className="absolute top-3 right-3 bg-emerald-600 text-white rounded-full p-1 shadow-lg"><CheckCircle className="h-5 w-5" /></div>}
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-500">Módulo {module.id}</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="h-3 w-3" /> {module.duration}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{module.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{module.description}</p>
                    
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg flex items-start gap-3 border border-emerald-100 dark:border-emerald-800">
                      <Headphones className="h-5 w-5 text-emerald-600 shrink-0" />
                      <p className="text-xs italic text-emerald-700 dark:text-emerald-400">"{module.audioText}"</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      {unlocked ? (
                        <Link to={`/excel/module/${module.id}`} className="text-emerald-600 font-bold text-sm flex items-center gap-1 hover:underline">
                          {completed ? 'Repasar' : 'Empezar'} <ChevronRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <span className="text-slate-400 text-xs font-medium flex items-center gap-1"><Lock className="h-3 w-3" /> Bloqueado</span>
                      )}
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Target className="h-3 w-3" /> {module.lessons} Lecciones
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Library className="text-emerald-600" /> Centro de Documentación</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MODULES.map(m => (
                  <div key={m.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-slate-400 group-hover:text-emerald-600" />
                      <span className="text-sm font-medium">{m.resource}</span>
                    </div>
                    <Download className="h-4 w-4 text-slate-300 cursor-pointer hover:text-emerald-600" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Star className="text-amber-500" /> Bibliografía y Apoyo</h3>
              <ul className="space-y-3">
                {[
                  { name: "Microsoft Learn: Excel Advanced", link: "https://learn.microsoft.com" },
                  { name: "Power BI Community Forum", link: "https://community.fabric.microsoft.com" },
                  { name: "DAX Guide Official", link: "https://dax.guide" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <span className="text-sm text-slate-600 dark:text-slate-300">{item.name}</span>
                    <a href={item.link} target="_blank" className="text-emerald-600 text-xs font-bold hover:underline">Visitar →</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2">Soporte Técnico</h3>
                <p className="text-emerald-100 text-xs mb-4">¿Tienes problemas con un ejercicio? Nuestro equipo de expertos está listo para ayudarte.</p>
                <button className="w-full py-2 bg-white text-emerald-600 rounded-lg font-bold text-sm hover:bg-emerald-50 transition-colors">
                  Abrir Ticket de Ayuda
                </button>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-20">
                <BookOpen className="h-24 w-24 rotate-12" />
              </div>
            </div>
            
            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-700">
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2"><Award className="text-amber-400" /> Ranking</h3>
              <p className="text-slate-400 text-xs mb-4">Compite con otros estudiantes y sube en el tablero de honor.</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs p-2 bg-slate-800 rounded"><span>1. Juan Pérez</span> <span className="text-emerald-400">100%</span></div>
                <div className="flex justify-between text-xs p-2 bg-slate-800 rounded"><span>2. María G.</span> <span className="text-emerald-400">95%</span></div>
                <div className="flex justify-between text-xs p-2 bg-slate-800 rounded"><span>3. Tu Usuario</span> <span className="text-emerald-400">{progressPercent}%</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="pt-12 pb-6 border-t border-slate-200 dark:border-slate-700 text-center space-y-2">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          © {new Date().getFullYear()} Todos los derechos reservados.
        </p>
        <p className="text-slate-400 dark:text-slate-500 text-xs flex items-center justify-center gap-2">
          <span>Creado por</span> 
          <span className="font-bold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase">
            IA Academy
          </span>
        </p>
      </footer>
    </div>
  );
}
