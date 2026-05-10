import { useParams, useNavigate } from 'react-router-dom';
import { useExcelAuth } from '@/hooks/useExcelAuth';
import { trpc } from '@/providers/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import CertificateButton from '@/components/CertificateButton';

export default function ExcelModule() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { user, isAuthorized, refetchProgress } = useExcelAuth();
  const moduleIdNum = parseInt(moduleId || '0', 10);

  const { data: module, isLoading, error } = trpc.excel.getModuleById.useQuery(
    { moduleId: moduleIdNum },
    { enabled: isAuthorized && !isNaN(moduleIdNum) }
  );
  const updateProgress = trpc.excel.updateProgress.useMutation({
    onSuccess: () => refetchProgress(),
  });

  const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [moduleProgress, setModuleProgress] = useState(0);
  const [completedUnits, setCompletedUnits] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!module) return;
    const progressValue = (completedUnits.size / module.units.length) * 100;
    setModuleProgress(progressValue);
    updateProgress.mutate({ moduleId: moduleIdNum, percentage: progressValue });
  }, [completedUnits, module]);

  if (isLoading) return <div className="text-center py-10">Cargando módulo...</div>;
  if (error || !module) return <div className="text-center py-10">Error al cargar el módulo</div>;
  if (!isAuthorized) {
    navigate('/excel');
    return null;
  }

  const currentUnit = module.units[currentUnitIndex];
  const isUnitCompleted = completedUnits.has(currentUnitIndex);

  const handleQuizSubmit = () => {
    let correct = 0;
    currentUnit.quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) correct++;
    });
    const score = (correct / currentUnit.quizQuestions.length) * 100;
    if (score >= 70) {
      setCompletedUnits((prev) => new Set(prev).add(currentUnitIndex));
      setQuizSubmitted(true);
      toast.success(`¡Aprobaste! Puntaje: ${Math.round(score)}%`);
    } else {
      toast.error(`No alcanzaste el mínimo (70%). Puntaje: ${Math.round(score)}%. Revisa el contenido.`);
    }
  };

  const handleNextUnit = () => {
    if (currentUnitIndex + 1 < module.units.length) {
      setCurrentUnitIndex(currentUnitIndex + 1);
      setQuizAnswers({});
      setQuizSubmitted(false);
    } else {
      toast.success('¡Felicidades! Completaste el módulo.');
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate('/excel')} className="mb-4">
        ← Volver al curso
      </Button>
      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">{module.title}</h1>
            <div className="flex justify-between items-center mt-2">
              <span>Progreso del módulo: {Math.round(moduleProgress)}%</span>
              <Progress value={moduleProgress} className="w-1/2" />
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-2">{currentUnit.title}</h2>
            {currentUnit.description && <p className="text-muted-foreground mb-4">{currentUnit.description}</p>}

            {/* Párrafos */}
            {currentUnit.paragraphs.map((p, idx) => (
              <div key={idx} className="mb-6">
                <div dangerouslySetInnerHTML={{ __html: p.content }} className="prose prose-sm max-w-none" />
                {p.imageUrl && (
                  <figure className="my-4">
                    <img src={p.imageUrl} alt={p.imageCaption} className="rounded-md mx-auto max-h-64" />
                    {p.imageCaption && <figcaption className="text-sm text-center text-muted-foreground mt-1">{p.imageCaption}</figcaption>}
                  </figure>
                )}
              </div>
            ))}

            {/* Ejercicios */}
            <div className="bg-muted p-4 rounded-md my-6">
              <h3 className="font-bold text-lg">Ejercicio práctico</h3>
              {currentUnit.exercises.map((ex, idx) => (
                <div key={idx} className="mt-2">
                  <p><strong>{ex.title}</strong></p>
                  <p>{ex.description}</p>
                  {ex.solutionHint && <details className="mt-1"><summary className="cursor-pointer text-sm">Pista</summary>{ex.solutionHint}</details>}
                </div>
              ))}
            </div>

            {/* Quiz */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-bold text-lg mb-2">Quiz de la unidad</h3>
              {!isUnitCompleted ? (
                !quizSubmitted ? (
                  <>
                    {currentUnit.quizQuestions.map((q, qIdx) => (
                      <div key={qIdx} className="mt-4">
                        <p className="font-medium">{q.questionText}</p>
                        <div className="space-y-1 mt-1">
                          {q.options.map((opt, optIdx) => (
                            <label key={optIdx} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name={`q${qIdx}`}
                                value={optIdx}
                                checked={quizAnswers[qIdx] === optIdx}
                                onChange={() => setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx })}
                                className="form-radio"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button onClick={handleQuizSubmit} className="mt-4">Enviar respuestas</Button>
                  </>
                ) : (
                  <div className="mt-2">
                    <p className="text-green-600">Unidad completada</p>
                    {currentUnitIndex + 1 === module.units.length ? (
                      <div className="mt-4">
                        <CertificateButton />
                      </div>
                    ) : (
                      <Button onClick={handleNextUnit} className="mt-2">Siguiente unidad</Button>
                    )}
                  </div>
                )
              ) : (
                <div className="mt-2">
                  <p className="text-green-600">Ya completaste esta unidad.</p>
                  {currentUnitIndex + 1 === module.units.length ? (
                    <div className="mt-4">
                      <CertificateButton />
                    </div>
                  ) : (
                    <Button onClick={handleNextUnit} className="mt-2">Siguiente unidad</Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}