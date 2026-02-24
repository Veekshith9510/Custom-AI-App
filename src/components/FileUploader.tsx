import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import mammoth from 'mammoth';
import { cn } from '../utils';

interface FileUploaderProps {
  onFileProcessed: (text: string, fileName: string) => void;
  isProcessing: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileProcessed, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setError(null);
    const extension = file.name.split('.').pop()?.toLowerCase();

    try {
      if (extension === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        onFileProcessed(result.value, file.name);
      } else if (extension === 'md' || extension === 'txt' || extension === 'markdown') {
        const text = await file.text();
        onFileProcessed(text, file.name);
      } else {
        setError('Unsupported file type. Please upload .docx or .md files.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to process file. Please try again.');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 transition-all duration-200 flex flex-col items-center justify-center gap-4 cursor-pointer",
          isDragging ? "border-indigo-500 bg-indigo-50/50" : "border-slate-200 hover:border-slate-300 bg-white",
          isProcessing && "opacity-50 pointer-events-none"
        )}
      >
        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileInput}
          accept=".docx,.md,.markdown,.txt"
          disabled={isProcessing}
        />
        
        <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
          {isProcessing ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <Upload className="w-8 h-8" />
          )}
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900">
            {isProcessing ? "Processing document..." : "Upload your document"}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Drag and drop your .docx or .md file here
          </p>
        </div>

        <div className="flex gap-2 mt-2">
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-1">
            <FileText className="w-3 h-3" /> DOCX
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-1">
            <FileText className="w-3 h-3" /> Markdown
          </span>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-700 text-sm">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
};
