import React, { useEffect, useState } from 'react';
import type jsPDF from 'jspdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  pdf: jsPDF | null;
  fileName: string;
  isLoading?: boolean;
}

const PdfPreviewDialog: React.FC<Props> = ({ open, onOpenChange, pdf, fileName, isLoading }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    if (!pdf) {
      setBlobUrl(null);
      return;
    }
    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);
    setZoom(100);
    return () => URL.revokeObjectURL(url);
  }, [pdf]);

  const handleDownload = () => {
    if (pdf) pdf.save(fileName);
  };

  const iframeSrc = blobUrl ? `${blobUrl}#zoom=${zoom}&toolbar=1&navpanes=0` : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[92vh] p-0 flex flex-col gap-0">
        <DialogHeader className="px-4 py-3 pr-12 border-b flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-base">Pré-visualização do laudo — {fileName}</DialogTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setZoom((z) => Math.max(50, z - 25))} disabled={!blobUrl}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs font-mono w-12 text-center text-gray-600">{zoom}%</span>
            <Button size="sm" variant="outline" onClick={() => setZoom((z) => Math.min(300, z + 25))} disabled={!blobUrl}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button size="sm" className="bg-blue-900 hover:bg-blue-800" onClick={handleDownload} disabled={!blobUrl}>
              <Download className="w-4 h-4 mr-1" /> Baixar PDF
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 bg-gray-200 overflow-hidden">
          {isLoading || !blobUrl ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm">Gerando pré-visualização...</p>
            </div>
          ) : (
            <object
              key={`${blobUrl}-${zoom}`}
              data={iframeSrc}
              type="application/pdf"
              className="w-full h-full"
              aria-label="Pré-visualização do PDF"
            >
              <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-600 p-6 text-center">
                <p className="text-sm">Seu navegador não conseguiu exibir o PDF embutido.</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={blobUrl} target="_blank" rel="noopener noreferrer">Abrir em nova aba</a>
                  </Button>
                  <Button size="sm" className="bg-blue-900 hover:bg-blue-800" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-1" /> Baixar PDF
                  </Button>
                </div>
              </div>
            </object>
          )}
        </div>
        <p className="text-xs text-gray-500 text-center py-2 border-t bg-white">
          Use as setas do leitor de PDF para navegar entre páginas. O documento já foi salvo no histórico.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default PdfPreviewDialog;
