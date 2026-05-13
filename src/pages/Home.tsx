import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, Award, ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const token = localStorage.getItem('excel_token');

  const features = [
    {
      icon: <GraduationCap className="h-6 w-6 text-emerald-600" />,
      title: '7 Módulos Pro',
      description: 'Desde fundamentos hasta Power BI. Contenido directo al grano.',
    },
    {
      icon: <Users className="h-6 w-6 text-emerald-600" />,
      title: 'Enfoque Corporativo',
      description: 'Acceso exclusivo mediante claves únicas para equipos de alto rendimiento.',
    },
    {
      icon: <Award className="h-6 w-6 text-emerald-600" />,
      title: 'Certificación',
      description: 'Valida tus conocimientos con un diploma avalado por IA Academy.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      {/* Hero Section - Limpia y Elegante */}
      <section className="pt-24 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-8 uppercase tracking-widest">
            <Sparkles className="h-3 w-3" /> IA ACADEMY
          </div_>
          <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tight leading-tight">
            Análisis de Datos <br />
            <span className="text-emerald-600">Excel & Power BI</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Domina las herramientas más demandadas del mercado laboral. <br /> 
            Aprende la lógica, domina la herramienta, impulsa tu carrera.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={token ? "/curso" : "/login"} className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all flex items-center gap-2">
              {token ? 'Acceder al Aula' : 'Empezar Ahora'} <ArrowRight className="h-5 w-5" />
            </Link>
          </div_>
        </div_>
      </section>

      {/* Features - Estilo Grid Limpio */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          {features.map((feature, i) => (
            <div key={i} className="p-2">
              <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center mb-6 shadow-sm border border-slate-100 dark:border-slate-700">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div_>
      </section>

      { la footer se mantiene igual que el anterior... }
      <footer className="py-12 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">
          © {new Date().getFullYear()} <span className="text-emerald-600">IA Academy</span>
        </p>
      </footer>
    </div>
  );
}
