import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Link2, X } from 'lucide-react';

export type SourceMode = 'upload' | 'external';

interface Props {
  mode: SourceMode;
  onModeChange: (m: SourceMode) => void;
  externalUrl: string;
  onExternalUrlChange: (url: string) => void;
  onFileChange: (file: File | null) => void;
  fileLabel?: string;
  accept?: string;
  selectedFileName?: string | null;
  preview?: string | null;
  onClearPreview?: () => void;
  urlPlaceholder?: string;
  helpText?: string;
}

const detectProvider = (url: string): string => {
  const u = url.toLowerCase();
  if (u.includes('onedrive') || u.includes('1drv.ms') || u.includes('sharepoint')) return 'OneDrive';
  if (u.includes('drive.google') || u.includes('docs.google')) return 'Google Drive';
  if (u.includes('dropbox')) return 'Dropbox';
  if (u.includes('mega.nz') || u.includes('mega.io')) return 'MEGA';
  if (u.includes('icloud')) return 'iCloud';
  if (u.includes('s3.amazonaws') || u.includes('.s3.')) return 'AWS S3';
  return 'Externo';
};

export const detectExternalProvider = detectProvider;

const UploadOrLinkInput: React.FC<Props> = ({
  mode, onModeChange, externalUrl, onExternalUrlChange,
  onFileChange, fileLabel = 'Selecionar arquivo', accept,
  selectedFileName, preview, onClearPreview,
  urlPlaceholder = 'https://1drv.ms/... ou https://drive.google.com/...',
  helpText,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <div className="inline-flex rounded-md border bg-muted p-0.5 text-xs">
        <button
          type="button"
          onClick={() => onModeChange('upload')}
          className={`px-3 py-1.5 rounded gap-1 inline-flex items-center transition ${
            mode === 'upload' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'
          }`}
        >
          <Upload className="w-3 h-3" /> Upload
        </button>
        <button
          type="button"
          onClick={() => onModeChange('external')}
          className={`px-3 py-1.5 rounded gap-1 inline-flex items-center transition ${
            mode === 'external' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'
          }`}
        >
          <Link2 className="w-3 h-3" /> Link externo
        </button>
      </div>

      {mode === 'upload' ? (
        <div>
          <input
            type="file"
            ref={inputRef}
            accept={accept}
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            className="hidden"
          />
          <Button type="button" variant="outline" className="gap-2" onClick={() => inputRef.current?.click()}>
            <Upload className="w-4 h-4" /> {fileLabel}
          </Button>
          {selectedFileName && (
            <span className="ml-2 text-xs text-muted-foreground">{selectedFileName}</span>
          )}
          {preview && (
            <div className="relative mt-2 inline-block">
              <img src={preview} alt="Preview" className="rounded-lg border max-h-48 object-contain" />
              {onClearPreview && (
                <button
                  type="button"
                  onClick={onClearPreview}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <Input
            type="url"
            value={externalUrl}
            onChange={(e) => onExternalUrlChange(e.target.value)}
            placeholder={urlPlaceholder}
          />
          {externalUrl && (
            <p className="text-xs text-muted-foreground mt-1">
              Provedor detectado: <span className="font-medium">{detectProvider(externalUrl)}</span>
            </p>
          )}
        </div>
      )}

      {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
    </div>
  );
};

export default UploadOrLinkInput;
