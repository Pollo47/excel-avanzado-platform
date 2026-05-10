import { jsPDF } from 'jspdf';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/providers/trpc';

export default function CertificateButton() {
  const { user } = useAuth();
  const { data: progress } = trpc.excel.getUserProgress.useQuery(undefined, { enabled: !!user });
  const completed = progress?.every(p => p.percentage === 100) && progress?.length === 7;

  if (!completed) return null;

  const generate = () => {
    if (!user) return;
    const doc = new jsPDF();
    doc.setFillColor(240, 248, 255);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setFontSize(28);
    doc.text('CERTIFICADO DE FINALIZACIÓN', 105, 100, { align: 'center' });
    doc.setFontSize(16);
    doc.text(`Otorgado a: ${user.name}`, 105, 130, { align: 'center' });
    doc.text('Por haber completado el curso "Excel Avanzado - IA Academy"', 105, 170, { align: 'center' });
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 105, 200, { align: 'center' });
    doc.save(`certificado_${user.name}.pdf`);
  };

  return <Button onClick={generate}>Descargar certificado</Button>;
}