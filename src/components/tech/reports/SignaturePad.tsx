import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eraser } from 'lucide-react';

interface Props {
  label: string;
  value: string; // dataURL
  onChange: (dataUrl: string) => void;
  readOnly?: boolean;
}

const SignaturePad: React.FC<Props> = ({ label, value, onChange, readOnly = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(!!value);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    // Setup hi-dpi
    const ratio = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * ratio;
    c.height = rect.height * ratio;
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.scale(ratio, ratio);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#0f172a';
    }
    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx?.clearRect(0, 0, rect.width, rect.height);
        ctx?.drawImage(img, 0, 0, rect.width, rect.height);
        setHasDrawn(true);
      };
      img.src = value;
    } else {
      setHasDrawn(false);
    }
  }, [value]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    if ('touches' in e) {
      const t = e.touches[0] || e.changedTouches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (readOnly) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const move = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing || readOnly) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const end = () => {
    if (!drawing) return;
    setDrawing(false);
    const c = canvasRef.current;
    if (c) onChange(c.toDataURL('image/png'));
  };

  const clear = () => {
    if (readOnly) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const ratio = window.devicePixelRatio || 1;
    ctx?.clearRect(0, 0, c.width / ratio, c.height / ratio);
    setHasDrawn(false);
    onChange('');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-gray-700 truncate">{label}</span>
        {!readOnly && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clear}
            className="h-8 px-3 text-xs flex-shrink-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Eraser className="w-3.5 h-3.5 mr-1" /> Limpar
          </Button>
        )}
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-32 border-2 border-dashed border-gray-300 rounded bg-white touch-none block"
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
        />
        {!readOnly && hasDrawn && (
          <button
            type="button"
            onClick={clear}
            aria-label="Limpar assinatura"
            className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 border border-red-200 text-red-600 rounded-full p-1.5 shadow-sm"
          >
            <Eraser className="w-4 h-4" />
          </button>
        )}
      </div>
      {!hasDrawn && !readOnly && (
        <p className="text-xs text-gray-400 text-center">Assine com o mouse ou dedo</p>
      )}
    </div>
  );
};

export default SignaturePad;
