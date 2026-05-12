import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, ChevronRight, ChevronLeft, 
  PlayCircle, HelpCircle, Award, Volume2, VolumeX 
} from 'lucide-react';
import { toast } from 'sonner';

// --- CONTENIDO MEJORADO ---
const MODULE_CONTENT: Record<number, {
  title: string;
  units: {
    id: number;
    title: string;
    paragraphs: { content: string; imageUrl?: string; imageCaption?: string }[];
    exercise?: { title: string; description: string; hint: string };
    quiz?: { question: string; options: string[]; correctAnswer: number; explanation: string }[];
  }[];
}> = {
  1: {
    title: 'Fundamentos de Excel Pro',
    units: [
      {
        id: 1,
        title: 'Interfaz de Alto Rendimiento',
        paragraphs: [
          { content: 'Bienvenido a IA Academy. Excel no es solo una hoja de cálculo, es la base de la inteligencia de negocios. Para dominarlo, primero debemos entender la anatomía de la interfaz: Filas, Columnas y la poderosa Cinta de Opciones.' },
          { content: 'La clave de la productividad no está en saber dónde están los botones, sino en dominar los atajos. Un experto en Excel minimiza el uso del mouse para maximizar la velocidad de ejecución.' },
        ],
        exercise: {
          title: 'Reto de Agilidad',
          description: 'Crea un libro y organiza una tabla de 5 columnas. Aplica formatos condicionales básicos para resaltar valores superiores a 100.',
          hint: 'Usa la pestaña Inicio -> Formato Condicional.',
        },
        quiz: [
          {
            question: '¿Cuál es la función principal de la Cinta de Opciones (Ribbon)?',
            options: ['Solo guardar el archivo', 'Organizar comandos por pestañas funcionales', 'Cambiar el color de la hoja', 'Ninguna de las anteriores'],
            correctAnswer: 1,
            explanation: 'El Ribbon organiza las herramientas por categorías (Inicio, Insertar, etc.) para un acceso rápido.',
          },
        ],
      },
    ],
  },
  // ... (puedes agregar el resto de los módulos siguiendo esta estructura)
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
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-MX'; // FORZAMOS MEXICANO LATINO
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.onend = () => setIsSpeaking(false);
      windowPill();
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const windowPill = () => {}; // Helper placeholder

  const completeModule = async () => {
    const token = localStorage.getItem('excel_token');
    try {
      const res = await fetch('/api/trpc/excel.completeModule', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ moduleId: moduleNum }),
      });
      if (res.ok) {
        toast.success('¡Módulo superado! Eres un paso más experto.');
        navigate('/curso');
      }
    } catch (e) {
      toast.error("Error al marcar progreso");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
        <Link to="/curso" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Volver al tablero
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 dark:text-white">Módulo {moduleNum}</span>
      </div_>

      {/* Header de la Unidad */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest">
            Unidad {currentUnit + 1} de {moduleData.units.length}
          </span>
        </div_>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{moduleData.title}</h1>
        <p className="text-slate-500 font-medium">{unit.title}</p>
      </div_>

      {/* Contenido Principal */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {unit.paragraphs.map((p, i) => (
            <div key={i} className="group bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-emerald-300 transition-all">
              <div className="flex items-start gap-4">
                <button 
                  onClick={() => handleSpeak(p.content)}
                  className={`p-3 rounded-full transition-all ${isSpeaking ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-emerald-100'}`}
                >
                  {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                  {p.content}
                </p>
              </div_>
            </div_>
          ))}

          {unit.exercise && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-8 rounded-3xl border border-amber-200 dark:border-amber-800 shadow-inner">
              <div className="flex items-center gap-3 mb-4 text-amber-700 dark:text-amber-400">
                <PlayCircle className="h-6 w-6" />
                <h3 className="font-black uppercase text-sm tracking-widest">{unit.exercise.title}</h3>
              </div_>
              <p className="text-slate-800 dark:text-slate-200 mb-6 text-lg leading-relaxed">
                {unit.exercise.description}
              </p>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-amber-100 dark:border-amber-800 text-sm text-slate-600 dark:text-slate-400 italic">
                <strong>Pro Tip:</strong> {unit.exercise.hint}
              </div_>
            </div_>
          )}
        </div_>

        {/* Lateral: Quiz y Control */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-emerald-600" /> Verificación
            </h3>
            
            {!showQuiz ? (
              <button 
                onClick={() => setShowQuiz(true)}
                className="w-full py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-bold hover:scale-105 transition-transform"
              >
                Iniciar Evaluación
              </button>
            ) : (
              <div className="space-y-4">
                {unit.quiz?.map((q, i) => (
                  <div key={i} className="space-y-3">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{q.question}</p>
                    <div className="grid gap-2">
                      {q.options.map((opt, oi) => (
                        <button 
                          key={oi}
                          onClick={() => setQuizAnswers({...quizAnswers, [i]: oi})}
                          className={`w-full text-left p-3 rounded-xl text-xs transition-all ${quizAnswers[i] === oi ? 'bg-emerald-100 text-emerald-700 border-emerald-300 border' : 'bg-slate-50 dark:bg-slate-700 border-transparent border'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div_>
                  </div_>
                ))}
                <button 
                  onClick={() => {
                    setQuizSubmitted(true);
                    toast.success("Respuestas enviadas");
                  }}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm"
                >
                  Enviar Respuestas
                </button>
              </div_>
            )}
          </div_>

          <button 
            onClick={() => {
              if(currentUnit === moduleData.units.length - 1) completeModule();
              else setCurrentUnit(currentUnit + 1);
            }}
            className="w-full py-4 bg-emerald-600 text-white rounded-3xl font-black text-lg shadow-lg shadow-emerald-500/40 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
          >
            {currentUnit === moduleData.units.length - 1 ? <Award className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            {currentUnit === moduleData.units.length - 1 ? 'Certificar Módulo' : 'Siguiente Unidad'}
          </button>
        </div_>
      </div_>
    </div>
  );
}
