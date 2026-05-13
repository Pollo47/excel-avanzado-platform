import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Users, Award, ArrowRight, Sparkles, CheckCircle2, Zap } from 'lucide-react';

export default function Home() {
  const token = localStorage.getItem('excel_token');

  const features = [
    {
      icon: <GraduationCap className="h-8 w-8 text-emerald-600" />,
      title: '7 Módulos Profesionales',
      description: 'Desde fundamentos hasta Power BI ejecutivo. Contenido diseñado para el mundo real.',
      color: 'bg-emerald-50'
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: 'Enfoque Corporativo',
      description: 'Acceso cerrado con claves únicas. Ideal para capacitación de equipos de alto rendimiento.',
      color: 'bg-blue-50'
    },
    {
      icon: <Award className="h-8 w-8 text-amber-600" />,
      title: 'Certificación Elite',
      description: 'Evaluaciones rigurosas y diploma digital avalado por IA Academy para tu LinkedIn.',
      color: 'bg-amber-50'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Hero Section con Efecto de Brillo */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-400/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-bold mb-8 animate-bounce">
            <Sparkles className="h-4 w-4" />
            IA ACADEMY: EL ESTÁNDAR DE EXCELENCIA
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[1.1]">
            Domina el Análisis de Datos <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 text-transparent bg-clip-text">
              Excel Pro & Power BI
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            No solo aprendas a usar la herramienta; aprende la lógica de negocio. 
            Transforma datos brutos en decisiones estratégicas con la metodología de <span className="font-bold text-slate-900 dark:text-white">IA Academy</span>.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to={token ? "/curso" : "/login"} className="group relative px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl hover:shadow-emerald-500/40 flex items-center gap-2 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                {token ? 'Acceder a mi Aula' : 'Comenzar Ahora'} <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link to="#features" className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              Ver Plan de Estudios
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Diseñado para el Éxito Profesional</h2>
            <div className="h-1.5 w-20 bg-emerald-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, i) => (
              <div key={i} className="group p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className={`h-16 w-16 ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                <div className="mt-6 flex items-center gap-2 text-emerald-600 font-bold text-sm group-hover:gap-3 transition-all">
                  Saber más <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section - Social Proof */}
      <section className="py-24 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Certificación con Valor Real</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Nuestro certificado no es solo un PDF. Es la prueba de que dominas las herramientas más demandadas por las empresas Fortune 500.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
            {['MICROSOFT', 'GOOGLE', 'AMAZON', 'DELOITTE'].map(brand => (
              <span key={brand} className="font-black text-2xl tracking-tighter text-slate-500">{brand}</span>
            ))}
          </div>
          
          <div className="flex justify-center gap-4 pt-8">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-slate-900 bg-slate-700 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-400 flex items-center gap-2">
              <span className="text-emerald-400 font-bold">+1,000</span> alumnos graduados
            </p>
          </div>
        </div>
      </section>

      {/* Footer IA Academy */}
      <footer className="py-12 px-6 border-t border-slate-200 dark:border-slate-800 text-center space-y-4">
        <div className="flex justify-center items-center gap-2 mb-4">
          <div className="h-8 w-8 bg-emerald-600 rounded-lg rotate-45 flex items-center justify-center">
            <span className="text-white font-black text-xs -rotate-45">IA</span>
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">IA ACADEMY</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          © {new Date().getFullYear()} Todos los derechos reservados. <br />
          <span className="font-bold text-emerald-600 uppercase tracking-widest text-xs">Excelencia en Análisis de Datos</span>
        </p>
      </footer>
    </div>
  );
}
