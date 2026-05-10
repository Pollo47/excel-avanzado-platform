import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, GraduationCap, Users, Award, ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  const features = [
    {
      icon: <GraduationCap className="h-8 w-8 text-emerald-600" />,
      title: '7 Módulos Profesionales',
      description: 'Desde fundamentos hasta Power BI ejecutivo. Contenido diseñado para el mundo real.',
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: 'Para Instituciones y Empresas',
      description: 'Acceso cerrado con claves de un solo uso. Ideal para capacitación corporativa.',
    },
    {
      icon: <Award className="h-8 w-8 text-amber-600" />,
      title: 'Certificación Incluida',
      description: 'Evaluaciones por módulo y examen final con certificado de aprobación.',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6">
          <Sparkles className="h-4 w-4" />
          Curso Excel Avanzado + Power BI
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
          Domina el Análisis de Datos
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
          Aprende Excel avanzado, fórmulas complejas, tablas dinámicas, macros VBA y 
          Power BI ejecutivo. Curso práctico, profesional y actualizado.
        </p>
        <div className="flex justify-center gap-4">
          {user ? (
            <Link
              to="/excel"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
            >
              <BookOpen className="h-5 w-5" />
              Ir al Curso
              <ArrowRight className="h-5 w-5" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
            >
              Comenzar Ahora
              <ArrowRight className="h-5 w-5" />
            </Link>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">¿Listo para transformar tus datos?</h2>
        <p className="text-emerald-100 text-lg mb-6 max-w-xl mx-auto">
          Únete a cientos de profesionales que ya dominaran Excel y Power BI con nosotros.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-emerald-700 font-semibold hover:bg-emerald-50 transition-colors"
        >
          Ingresar al Curso
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>
    </div>
  );
}
