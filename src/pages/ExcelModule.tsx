import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useExcelAuth } from '../hooks/useExcelAuth';
import { trpc } from '../providers/trpc';
import {
  ArrowLeft, CheckCircle, ChevronRight, ChevronLeft, BookOpen,
  PlayCircle, FileText, HelpCircle, Award, Lock, AlertTriangle,
  Volume2, VolumeX
} from 'lucide-react';
import { toast } from 'sonner';

// Contenido de cada módulo (en producción vendría de la BD)
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
    title: 'Fundamentos de Excel',
    units: [
      {
        id: 1,
        title: 'Interfaz de Excel',
        paragraphs: [
          { content: 'Excel es una herramienta de hoja de cálculo desarrollada por Microsoft. Su interfaz principal consiste en una cuadrícula de celdas organizadas en filas (numeradas) y columnas (letras). La intersección de una fila y una columna forma una celda, identificada por su referencia (ej: A1, B2).' },
          { content: 'La cinta de opciones (Ribbon) organiza los comandos en pestañas: Inicio, Insertar, Diseño de página, Fórmulas, Datos, Revisar y Vista. Cada pestaña contiene grupos de comandos relacionados. La barra de fórmulas muestra el contenido de la celda activa y permite editar fórmulas.' },
          { content: 'Las barras de desplazamiento permiten navegar por la hoja. Las pestañas de hoja (ubicadas en la parte inferior) permiten cambiar entre diferentes hojas de cálculo dentro del mismo libro. El cuadro de nombres muestra la referencia de la celda activa.' },
        ],
        exercise: {
          title: 'Ejercicio práctico',
          description: 'Crea un nuevo libro de Excel y escribe tu nombre en la celda A1, tu edad en B1 y tu ciudad en C1. Aplica negrita a la celda A1.',
          hint: 'Selecciona la celda y usa Ctrl+B para negrita, o el botón en la pestaña Inicio.',
        },
        quiz: [
          {
            question: '¿Qué representa la referencia "B3" en Excel?',
            options: ['Fila B, columna 3', 'Columna B, fila 3', 'Celda B multiplicada por 3', 'Ninguna de las anteriores'],
            correctAnswer: 1,
            explanation: 'En Excel, las letras representan columnas y los números representan filas. B3 = Columna B, Fila 3.',
          },
        ],
      },
      {
        id: 2,
        title: 'Formatos Básicos',
        paragraphs: [
          { content: 'El formato de celdas permite cambiar la apariencia de los datos sin alterar su valor. Los formatos numéricos incluyen: General, Número, Moneda, Contabilidad, Fecha, Hora, Porcentaje, Fracción, Científico y Texto.' },
          { content: 'Para aplicar formato, selecciona las celdas y usa el menú contextual (clic derecho) → "Formato de celdas", o los botones rápidos en la pestaña Inicio. Puedes combinar formatos: por ejemplo, número con separador de miles y dos decimales.' },
        ],
      },
    ],
  },
  2: {
    title: 'Fórmulas y Funciones',
    units: [
      {
        id: 1,
        title: 'Fórmulas Básicas',
        paragraphs: [
          { content: 'Toda fórmula en Excel comienza con el signo igual (=). Las fórmulas pueden contener valores, referencias de celdas, operadores matemáticos (+, -, *, /, ^) y funciones. Excel calcula automáticamente el resultado cuando presionas Enter.' },
          { content: 'Las referencias de celdas pueden ser relativas (A1), absolutas ($A$1) o mixtas ($A1 o A$1). Las referencias relativas se ajustan al copiar la fórmula. Las absolutas permanecen fijas. Usa F4 para alternar entre tipos de referencia.' },
        ],
        quiz: [
          {
            question: '¿Qué resultado da la fórmula =5+3*2?',
            options: ['16', '11', '13', '10'],
            correctAnswer: 1,
            explanation: 'Excel sigue el orden de operaciones (PEMDAS). Primero multiplica 3*2=6, luego suma 5+6=11.',
          },
        ],
      },
    ],
  },
  3: {
    title: 'Tablas Dinámicas',
    units: [
      {
        id: 1,
        title: 'Creación de Tablas Dinámicas',
        paragraphs: [
          { content: 'Una tabla dinámica es una herramienta de resumen y análisis de datos. Permite reorganizar, agrupar, filtrar y calcular estadísticas sobre grandes conjuntos de datos sin modificar los datos originales.' },
          { content: 'Para crear una tabla dinámica: selecciona tu rango de datos → Insertar → Tabla dinámica. En el panel de campos, arrastra campos a las áreas: Filtros, Columnas, Filas y Valores. Los valores se resumen con funciones como Suma, Contar, Promedio, Máximo o Mínimo.' },
        ],
      },
    ],
  },
  4: {
    title: 'Gráficos Avanzados',
    units: [
      {
        id: 1,
        title: 'Tipos de Gráficos',
        paragraphs: [
          { content: 'Excel ofrece más de 20 tipos de gráficos. Los más comunes son: Columnas (comparar valores), Líneas (tendencias temporales), Circular (proporciones), Barras (comparar categorías), Dispersión (relaciones entre variables) y Área (magnitud del cambio).' },
          { content: 'Los gráficos combinados permiten mostrar dos tipos de gráfico en uno solo, útil cuando tienes datos con escalas muy diferentes. Los gráficos Sparkline son mini gráficos que caben dentro de una celda, ideales para dashboards compactos.' },
        ],
      },
    ],
  },
  5: {
    title: 'Macros y VBA',
    units: [
      {
        id: 1,
        title: 'Introducción a VBA',
        paragraphs: [
          { content: 'VBA (Visual Basic for Applications) es el lenguaje de programación integrado en Excel. Permite automatizar tareas repetitivas, crear funciones personalizadas, diseñar formularios de usuario y manipular datos programáticamente.' },
          { content: 'Para acceder al editor VBA, presiona Alt+F11. El editor muestra el Explorador de proyectos, la ventana de propiedades y el área de código. Un módulo es un contenedor de código VBA. Los procedimientos pueden ser Sub (subrutinas) o Function (funciones que retornan valores).' },
        ],
      },
    ],
  },
  6: {
    title: 'Power Query',
    units: [
      {
        id: 1,
        title: 'Importación de Datos',
        paragraphs: [
          { content: 'Power Query es una herramienta de ETL (Extract, Transform, Load) integrada en Excel desde 2010. Permite conectar, combinar y transformar datos de múltiples fuentes: Excel, CSV, bases de datos, web, APIs, carpetas de archivos y más.' },
          { content: 'Para acceder: Datos → Obtener datos. Las transformaciones comunes incluyen: eliminar columnas, filtrar filas, dividir columnas, reemplazar valores, agrupar, ordenar, combinar consultas (merge) y anexar consultas (append).' },
        ],
      },
    ],
  },
  7: {
    title: 'Power BI Ejecutivo',
    units: [
      {
        id: 1,
        title: 'Modelado de Datos',
        paragraphs: [
          { content: 'Power BI es una suite de herramientas de análisis de negocios que permite visualizar datos y compartir insights. Consta de Power BI Desktop (aplicación gratuita), Power BI Service (nube) y Power BI Mobile.' },
          { content: 'El modelado de datos en Power BI se basa en relaciones entre tablas. Las relaciones pueden ser uno a uno (1:1), uno a muchos (1:N) o muchos a muchos (N:M). Las relaciones se crean arrastrando campos entre tablas en la vista de modelo.' },
        ],
      },
    ],
  },
};

export default function ExcelModule() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAuthorized } = useExcelAuth();
  const [currentUnit, setCurrentUnit] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const moduleNum = parseInt(moduleId || '1');
  const moduleData = MODULE_CONTENT[moduleNum];

  const utils = trpc.useUtils();

  const completeModuleMutation = trpc.excel.completeModule.useMutation({
    onSuccess: () => {
      toast.success('¡Módulo completado! Puedes continuar con el siguiente.');
      utils.excel.getUserProgress.invalidate();
    },
  });

  if (!moduleData) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Módulo no encontrado</h1>
      </div>
    );
  }

  const unit = moduleData.units[currentUnit];
  const isLastUnit = currentUnit === moduleData.units.length - 1;
  const isFirstUnit = currentUnit === 0;

  const handleNext = () => {
    if (isLastUnit) {
      // Complete module
      completeModuleMutation.mutate({ moduleId: moduleNum });
      if (moduleNum < 7) {
        navigate(`/excel/module/${moduleNum + 1}`);
      } else {
        navigate('/excel');
      }
    } else {
      setCurrentUnit(currentUnit + 1);
      setShowQuiz(false);
      setQuizSubmitted(false);
      setQuizAnswers({});
    }
  };

  const handlePrev = () => {
    if (!isFirstUnit) {
      setCurrentUnit(currentUnit - 1);
      setShowQuiz(false);
      setQuizSubmitted(false);
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    } else {
      toast.error('Tu navegador no soporta síntesis de voz');
    }
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers({ ...quizAnswers, [questionIndex]: answerIndex });
  };

  const submitQuiz = () => {
    if (!unit.quiz) return;
    const allAnswered = unit.quiz.every((_, i) => quizAnswers[i] !== undefined);
    if (!allAnswered) {
      toast.error('Responde todas las preguntas antes de enviar');
      return;
    }
    setQuizSubmitted(true);
    const correct = unit.quiz.filter((q, i) => quizAnswers[i] === q.correctAnswer).length;
    const total = unit.quiz.length;
    if (correct === total) {
      toast.success(`¡Perfecto! ${correct}/${total} correctas`);
    } else {
      toast.info(`${correct}/${total} correctas. Revisa las explicaciones.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Link to="/excel" className="hover:text-emerald-600 flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Volver al Curso
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span>Módulo {moduleNum}</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900 dark:text-white font-medium">{moduleData.title}</span>
      </div>

      {/* Module Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
            Módulo {moduleNum} de 7
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Unidad {currentUnit + 1} de {moduleData.units.length}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{moduleData.title}</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">{unit.title}</p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentUnit + 1) / moduleData.units.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
          Progreso del módulo: {Math.round(((currentUnit + 1) / moduleData.units.length) * 100)}%
        </p>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        {/* Paragraphs */}
        {unit.paragraphs.map((paragraph, idx) => (
          <div key={idx} className="space-y-3">
            <div className="flex items-start gap-3">
              <button
                onClick={() => handleSpeak(paragraph.content)}
                className={`mt-1 p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                  isSpeaking
                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400'
                }`}
                title={isSpeaking ? 'Detener lectura' : 'Escuchar contenido'}
              >
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
                {paragraph.content}
              </p>
            </div>
            {paragraph.imageUrl && (
              <div className="ml-10">
                <img
                  src={paragraph.imageUrl}
                  alt={paragraph.imageCaption || 'Imagen del contenido'}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 max-w-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {paragraph.imageCaption && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center italic">
                    {paragraph.imageCaption}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Exercise */}
        {unit.exercise && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-5">
            <h3 className="flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300 mb-3">
              <PlayCircle className="h-5 w-5" />
              {unit.exercise.title}
            </h3>
            <p className="text-amber-700 dark:text-amber-400 mb-3">{unit.exercise.description}</p>
            <div className="bg-white dark:bg-slate-800 rounded-md p-3 border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium">Pista:</span> {unit.exercise.hint}
              </p>
            </div>
          </div>
        )}

        {/* Quiz */}
        {unit.quiz && unit.quiz.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            {!showQuiz ? (
              <button
                onClick={() => setShowQuiz(true)}
                className="w-full py-3 rounded-lg border-2 border-dashed border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors flex items-center justify-center gap-2"
              >
                <HelpCircle className="h-5 w-5" />
                Responder Quiz de Evaluación
              </button>
            ) : (
              <div className="space-y-6">
                <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                  <HelpCircle className="h-5 w-5 text-emerald-600" />
                  Quiz de Evaluación
                </h3>
                {unit.quiz.map((question, qIdx) => (
                  <div key={qIdx} className="space-y-3">
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {qIdx + 1}. {question.question}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleQuizAnswer(qIdx, oIdx)}
                          disabled={quizSubmitted}
                          className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                            quizAnswers[qIdx] === oIdx
                              ? quizSubmitted
                                ? oIdx === question.correctAnswer
                                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                                  : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                : 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                              : quizSubmitted && oIdx === question.correctAnswer
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <span className="font-medium mr-2">{String.fromCharCode(65 + oIdx)}.</span>
                          {option}
                        </button>
                      ))}
                    </div>
                    {quizSubmitted && (
                      <div className={`p-3 rounded-lg ${
                        quizAnswers[qIdx] === question.correctAnswer
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      }`}>
                        <p className="text-sm font-medium">
                          {quizAnswers[qIdx] === question.correctAnswer ? '✓ Correcto' : '✗ Incorrecto'}
                        </p>
                        <p className="text-sm mt-1">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
                {!quizSubmitted ? (
                  <button
                    onClick={submitQuiz}
                    className="w-full py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Enviar Respuestas
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Quiz completado</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={isFirstUnit}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </button>

        <button
          onClick={handleNext}
          disabled={unit.quiz && !quizSubmitted && showQuiz}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLastUnit ? (
            <>
              <Award className="h-4 w-4" />
              Completar Módulo
            </>
          ) : (
            <>
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
