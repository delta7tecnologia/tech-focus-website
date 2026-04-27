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
  const [hasDrawn, setHasDrawn] = useState(!!value);

  const lastEmittedRef = useRef<string>('');
  const drawingRef = useRef(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * ratio;
    c.height = rect.height * ratio;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.scale(ratio, ratio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#0f172a';
    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasDrawn(true);
        lastEmittedRef.current = value;
      };
      img.src = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload only if value changed from outside (not our own onChange echo)
  useEffect(() => {
    if (value === lastEmittedRef.current) return;
    const c = canvasRef.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    const rect = c.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasDrawn(true);
      };
      img.src = value;
    } else {
      setHasDrawn(false);
    }
    lastEmittedRef.current = value;
  }, [value]);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (readOnly) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    drawingRef.current = true;
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || readOnly) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const end = (e?: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    e?.preventDefault();
    if (e?.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    drawingRef.current = false;
    const c = canvasRef.current;
    if (c) {
      const dataUrl = c.toDataURL('image/png');
      lastEmittedRef.current = dataUrl;
      onChange(dataUrl);
    }
  };

  const clear = () => {
    if (readOnly) return;
    drawingRef.current = false;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const ratio = window.devicePixelRatio || 1;
    ctx?.clearRect(0, 0, c.width / ratio, c.height / ratio);
    setHasDrawn(false);
    lastEmittedRef.current = '';
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
            onTouchEnd={(e) => { e.preventDefault(); clear(); }}
            className="h-9 px-3 text-xs flex-shrink-0 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 active:bg-red-100"
          >
            <Eraser className="w-4 h-4 mr-1" /> Limpar
          </Button>
        )}
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-32 border-2 border-dashed border-gray-300 rounded bg-white touch-none block"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onPointerLeave={end}
      />
      {!hasDrawn && !readOnly && (
        <p className="text-xs text-gray-400 text-center">Assine com o mouse ou dedo</p>
      )}
    </div>
  );
};

export default SignaturePad;
