import React, { useRef } from 'react';
import { Upload, FileText,  Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FileUploadZoneProps {
  title: string;
  description: string;
  acceptedTypes: string;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ComponentType<{ className?: string }>;
  file?: File;
  dragActive?: boolean;
}

export default function FileUploadZone({ 
  title, 
  description, 
  acceptedTypes, 
  onFileSelect, 
  icon: Icon,
  file,
  dragActive
}: FileUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className={`w-[550px] h-[450px]  relative overflow-hidden  bg-gray-800/50  backdrop-blur-sm shadow-xl transition-all duration-300 cursor-pointer group ${
      dragActive ? 'border-blue-400 bg-blue-50/50 scale-[1.02]' : 'border-slate-200 hover:border-slate-300'
    } ${file ? 'border-green-400 bg-green-50/30' : ''}`}>
      <div 
        onClick={handleClick}
        className="p-8 text-center relative"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          onChange={onFileSelect}
          className="hidden"
        />

        <div className="relative z-10">
          <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            file 
              ? 'bg-green-500 text-white shadow-lg' 
              : dragActive 
                ? 'bg-blue-500 text-white shadow-lg scale-110' 
                : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
          }`}>
            {file ? <Check className="w-7 h-7" /> : <Icon className="w-7 h-7" />}
          </div>

          <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
          <p className="text-slate-500 mb-6">{description}</p>

          {file ? (
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-center space-x-2">
                <FileText className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">{file.name}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <Button variant="outline" className="border-slate-300 hover:border-slate-400">
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          )}

          <p className="text-xs text-slate-400 mt-4">{acceptedTypes}</p>
        </div>
      </div>
    </Card>
  );
}