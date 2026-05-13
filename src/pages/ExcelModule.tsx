import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ChevronRight, PlayCircle, HelpCircle, Award, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';

const MODULE_CONTENT: Record<number, { title: string; units: { id: number; title: string; paragraphs: { content: string; imageUrl?: string; imageCaption?: string }[]; exercise?: { title: string; description: string; hint: string }; quiz?: { question: string; options: string[]; correctAnswer: number; explanation: string }[]; }[] }> = {
  1: {
    title: 'Fundamentos de Excel Pro',
    units: [
      {
        id: 1,
        title: 'Arquitectura de la Interfaz',
        paragraphs: [
          { content: 'Bienvenido a IA Academy. Para dominar Excel, primero debemos entender su anatomía. La cuadrícula es la base, pero la Cinta de Opciones (Ribbon) es donde reside el poder.' },
          { content: 'El secreto de los expertos no es el conocimiento de cada botón, sino la velocidad. Dominar atajos como Ctrl+T para tablas o Ctrl+L para buscar es lo que separa a un usuario promedio de un analista de élite.' },
        ],
        exercise: { title: 'Reto de Configuración', description: 'Crea un libro nuevo y configura una tabla de datos. Aplica el formato de "Tabla de Excel" y cambia el estilo a uno corporativo.', hint: 'Usa el atajo Ctrl+T y luego la pestaña Diseño de Tabla.' },
        quiz: [{ question: '¿Cuál es la función de la Barra de Fórmulas?', options: ['Solo ver el resultado', 'Editar el contenido y la lógica de la celda', 'Cambiar el color de la fuente', 'Ninguna'], correctAnswer: 1, explanation: 'Permite ver y editar la fórmula exacta que genera el valor de la celda.' }],
      },
    ],
  },
  2: {
    title: 'Maestría en Fórmulas y Funciones',
    units: [
      {
        id: 1,
        title: 'Lógica de Referencias',
        paragraphs: [
          { content: 'La diferencia entre una referencia relativa (A1) y una absoluta ($A$1) es la base de la automatización. Si no dominas los signos de peso, tus fórmulas se romperán al arrastrarlas.' },
        ],
        exercise: { title: 'Reto de Referencias', description: 'Crea una tabla de multiplicar donde la fila y la columna estén fijas usando referencias absolutas.', hint: 'Usa F4 para poner los signos de $ rápidamente.' },
      },
      {
        id: 2,
        title: 'Búsquedas Avanzadas (XLOOKUP)',
        paragraphs: [
          { content: 'Olvídate del BUSCARV. El nuevo XLOOKUP es más potente, flexible y no se rompe si insertas columnas. Aprenderás a buscar datos en cualquier dirección.' },
        ],
      }
    ],
  },
  3: {
    title: 'Tablas Dinámicas y Análisis',
    units: [
      {
        id: 1,
        title: 'El Poder del Resumen',
        paragraphs: [
          { content: 'Las Tablas Dinámicas son el corazón del análisis de datos. Te permiten convertir 10,000 filas de ventas en un reporte de 3 líneas.' },
        ],
        exercise: { title: 'Reto de Análisis', description: 'Importa una base de datos de ventas y crea una tabla dinámica que muestre el total de ventas por vendedor.', hint: 'Arrastra "Vendedor" a Filas y "Venta" a Valores.' },
      }
    ],
  },
  4: {
    title: 'Dashboards de Impacto',
    units: [
      {
        id: 1,
        title: 'Storytelling con Datos',
        paragraphs: [
          { content: 'Un Dashboard no es un montón de gráficos; es una historia. Aprenderás la psicología del color y la jerarquía visual.' },
        ],
        exercise: { title: 'Diseño de KPI', description: 'Crea un gráfico de velocímetro o una barra de progreso para medir el cumplimiento de una meta.', hint: 'Usa gráficos combinados.' },
      }
    ],
  },
  5: {
    title: 'Automatización con Macros y VBA',
    units: [
      {
        id: 1,
        title: 'Introducción al Editor de VBA',
        paragraphs: [
          { content: 'VBA es el lenguaje que permite que Excel piense por ti. Aprenderás a crear macros que realicen tareas de 3 horas en solo 2 segundos.' },
        ],
        exercise: { title: 'Mi Primera Macro', description: 'Crea un botón que, al presionarlo, limpie todos los datos de un formulario.', hint: 'Usa la Grabadora de Macros y luego revisa el código en Alt+F11.' },
      }
    ],
  },
  6: {
    title: 'Power Query (ETL)',
    units: [
      {
        id: 1,
        title: 'Conexión y Limpieza',
        paragraphs: [
          { content: 'Power Query es la herramienta más poderosa para limpiar datos. Aprenderás a combinar múltiples archivos en una sola tabla maestra.' },
        ],
        exercise: { title: 'Consolidación', description: 'Conecta una carpeta que contenga 3 archivos CSV y unifica la información.', hint: 'Datos -> Obtener Datos -> De una carpeta.' },
      }
    ],
  },
  7: {
    title: 'Power BI Ejecutivo',
    units: [
      {
        id: 1,
        title: 'Modelado y Lenguaje DAX',
        paragraphs: [
          { content own: 'Llegamos a la cima. Power BI lleva el análisis a la nube. Aprenderás DAX, el lenguaje de fórmulas avanzado.' },
        ],
        exercise: { title: 'Reporte de BI', description: 'Crea un modelo de datos relacionando una tabla de Ventas con una de Clientes.', hint: 'Usa la vista de modelo para crear la relación 1:N.' },
      }
    ],
  },
};

export default function ExcelModule() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const [currentUnit, setCurrentUnit] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const moduleNum = parseInt(moduleId || '1');
  const moduleData = MODULE_CONTENT[moduleNum] || MODULE_CONTENT[1];
  const unit = moduleData.units[currentUnit];

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-MX';
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const completeModule = async () => {
    const token = localStorage.getItem('excel_token');
    try {
      const res = await fetch('/api/trpc/excel.completeModule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ moduleId: moduleNum }),
      });
      if (res.ok) { toast.success('¡Módulo superado!'); navigate('/curso'); }
    } catch (e) { toast.error("Error de progreso"); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
        <Link to="/curso" className="hover:text-emerald-600 flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Volver</Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 dark:text-white">Módulo {moduleNum}</span>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest">Unidad {currentUnit + 1} de {moduleData.units.length}</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">{moduleData.title}</h1>
        <p className="text-slate-500 font-medium">{unit.title}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {unit.paragraphs.map((p, i) => (
            <div key={i} className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-emerald-600">
              <div className="flex items-start gap-4">
                <button onClick={() => handleSpeak(p.content)} className={`p-3 rounded-full transition-all ${isSpeaking ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-emerald-100'}`}>
                  {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">{p.content}</p>
              </div>
            </div>
          ))}

          {unit.exercise && (
            <div className="bg-amber-50 dark:bg-amber-900/20 p-8 rounded-3xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-3 mb-4 text-amber-700 dark:text-amber-400">
                <PlayCircle className="h-6 w-6" />
                <h3 className="font-black uppercase text-sm tracking-widest">{unit.exercise.title}</h3>
              </div>
              <p className="text-slate-800 dark:text-slate-200 mb-6 text-lg">{unit.exercise.description}</p>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-amber-100 dark:border-amber-800 text-sm text-slate-600 italic">
                <strong className="text-amber-600">Sugerencia:</strong> {unit.exercise.hint}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold mb-6 flex items-center gap-2"><HelpCircle className="h-5 w-5 text-emerald-600" /> Evaluación</h3>
            {!showQuiz ? (
              <button onClick={() => setShowQuiz(true)} className="w-full py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-bold hover:scale-105 transition-transform">Iniciar Quiz</button>
            ) : (
              <div className="space-y-4">
                {unit.quiz?.map((q, i) => (
                  <div key={i} className="space-y-3">
                    <p className="text-sm font-bold">{q.question}</p>
                    <div className="grid gap-2">
                      {q.options.map((opt, oi) => (
                        <button key={oi} onClick={() => setQuizAnswers({...quizAnswers, [i]: oi})} className={`w-full text-left p-3 rounded-xl text-xs transition-all ${quizAnswers[i] === oi ? 'bg-emerald-100 text-emerald-700 border-emerald-300 border' : 'bg-slate-50 dark:bg-slate-800 border-transparent border'}`}>{opt}</button>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={() => { setQuizSubmitted(true); toast.success("Enviado"); }} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm">Enviar Respuestas</button>
              </div>
            )}
          </div>

          <button onClick={() => { if(currentUnit === moduleData.units.length - 1) completeModule(); else setCurrentUnit(currentUnit + 1); }} className="w-full py-4 bg-emerald-600 text-white rounded-3xl font-black text-lg shadow-lg shadow-emerald-500/40 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
            {currentUnit === moduleData.units.length - 1 ? <Award className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            {currentUnit === moduleData.units.length - 1 ? 'Certificar' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
}
