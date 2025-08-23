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
    <Card className={`w-[550px] h-[450px] relative overflow-hidden bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm shadow-xl transition-all duration-300 cursor-pointer group border ${
      dragActive ? 'border-blue-400/70 bg-blue-500/10 scale-[1.02] shadow-blue-500/20' : 'border-gray-600/50 hover:border-gray-500/70'
    } ${file ? 'border-green-400/70 bg-green-500/10 shadow-green-500/20' : ''}`}>
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
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30' 
              : dragActive 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110' 
                : 'bg-gradient-to-r from-gray-700 to-gray-600 text-gray-300 group-hover:from-gray-600 group-hover:to-gray-500'
          }`}>
            {file ? <Check className="w-7 h-7" /> : <Icon className="w-7 h-7" />}
          </div>

          {/* IMPROVED: Better text colors for dark theme */}
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-gray-300 mb-6">{description}</p>

          {file ? (
            // IMPROVED: Dark theme styling for file display
            <div className="bg-gray-700/50 rounded-lg p-4 border border-green-400/30">
              <div className="flex items-center justify-center space-x-2">
                <FileText className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-400">{file.name}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            // IMPROVED: Better button styling for dark theme
            <Button variant="outline" className="border-gray-500/50 hover:border-gray-400/70 text-gray-200 hover:text-white bg-gray-700/30 hover:bg-gray-600/50">
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          )}

          {/* IMPROVED: Better text color for accepted types */}
          <p className="text-xs text-gray-400 mt-4">{acceptedTypes}</p>
        </div>
      </div>
    </Card>
  );
}