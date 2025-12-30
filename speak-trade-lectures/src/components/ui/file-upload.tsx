import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File, content: string) => void;
  acceptedTypes?: string[];
  className?: string;
}

export function FileUpload({ 
  onFileSelect, 
  acceptedTypes = ['.srt', '.vtt', '.txt'],
  className 
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = async (file: File) => {
    try {
      const content = await file.text();
      setSelectedFile(file);
      onFileSelect(file, content);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card 
      className={cn(
        "relative border-2 border-dashed transition-all duration-300",
        isDragOver 
          ? "border-trading-blue bg-trading-blue/5 shadow-glow" 
          : selectedFile
          ? "border-trading-green bg-trading-green/5"
          : "border-border hover:border-trading-blue/50",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-8 text-center">
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <FileText className="h-8 w-8 text-trading-green" />
              <div className="text-left">
                <p className="font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="ml-auto text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Загрузите файл субтитров
              </h3>
              <p className="text-muted-foreground mb-4">
                Поддерживаются форматы: {acceptedTypes.join(', ')}
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                Выбрать файл
              </Button>
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={acceptedTypes.join(',')}
          onChange={handleInputChange}
        />
      </div>
    </Card>
  );
}