import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Type, Upload, Briefcase } from 'lucide-react';
import FileUploadZone from './FileUploadZone';

interface JobDescriptionInputProps {
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  jobFile: File | null;
  onJobFileSelect: (file: File | null) => void;
  dragActive: boolean;
}

export default function JobDescriptionInput({ 
  jobDescription, 
  onJobDescriptionChange, 
  jobFile, 
  onJobFileSelect,
  dragActive 
}: JobDescriptionInputProps) {
  const [activeTab, setActiveTab] = useState('text');

  return (
    <Card className="luxury-shadow border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-slate-800">
          <Briefcase className="w-5 h-5 text-blue-500" />
          <span>Job Description</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="text" className="flex items-center space-x-2">
              <Type className="w-4 h-4" />
              <span>Paste Text</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Upload File</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <Textarea
              value={jobDescription}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
              placeholder="Paste the job description here... Include job title, responsibilities, requirements, and qualifications for best results."
              className="min-h-[200px] resize-none border-slate-200 focus:border-blue-400 transition-colors"
            />
            <p className="text-xs text-slate-500">
              Tip: Include job title, company name, requirements, and responsibilities for more accurate analysis.
            </p>
          </TabsContent>

          <TabsContent value="upload">
            <FileUploadZone
              title="Upload Job Description"
              description="Upload a PDF or text file containing the job posting"
              acceptedTypes=".pdf,.txt,.docx"
              onFileSelect={(e) => onJobFileSelect(e.target.files?.[0] ?? null)}
              icon={Briefcase}
              file={jobFile ?? undefined}
              dragActive={dragActive}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}