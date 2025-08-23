import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Type, Upload, Briefcase, Check, FileText } from 'lucide-react';

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
      <Card className="w-[550px] h-[450px] bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm shadow-xl border border-gray-600/50 hover:border-gray-500/70 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
              <Briefcase className="w-5 h-5 text-blue-400" />
            </div>
            <span>Job Description</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-80px)] flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="pb-9 grid w-full grid-cols-2 mb-4 bg-gray-700/50 border border-gray-600/50">
              <TabsTrigger value="text" className={`flex items-center space-x-2 ${activeTab === "text" ? "text-black" : "text-white"}`}>
                <Type className="w-4 h-4" />
                <span>Paste Text</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className={`flex items-center space-x-2 ${activeTab === "upload" ? "text-black" : "text-white"}`}>
                <Upload className="w-4 h-4" />
                <span>Upload File</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className=" overflow-hidden space-y-5 mt-5  flex-1 flex flex-col">
              <Textarea
                value={jobDescription}
                onChange={(e) => onJobDescriptionChange(e.target.value)}
                placeholder="Paste the job description here... Include job title, responsibilities, requirements, and qualifications for best results."
                className="h-[200px]  resize-none border-slate-200 focus:border-blue-400 transition-colors overflow-y-auto"
              />
              <p className="text-xs text-gray-400">
                Tip: Include job title, company name, requirements, and responsibilities for more accurate analysis.
              </p>
            </TabsContent>

            <TabsContent value="upload" className="mt-5 flex-1">
              <div className={`h-full relative overflow-hidden bg-gradient-to-br from-gray-700/40 to-gray-800/40 backdrop-blur-sm rounded-lg transition-all duration-300 cursor-pointer group border ${
                dragActive ? 'border-blue-400/70 bg-blue-500/10 scale-[1.02] shadow-blue-500/20' : 'border-gray-600/50 hover:border-gray-500/70'
              } ${jobFile ? 'border-green-400/70 bg-green-500/10 shadow-green-500/20' : ''}`}>
                <div 
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.pdf,.txt,.docx';
                    input.onchange = (e) => onJobFileSelect((e.target as HTMLInputElement).files?.[0] ?? null);
                    input.click();
                  }}
                  className="p-6 text-center h-full flex flex-col justify-center"
                >
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    jobFile 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30' 
                      : dragActive 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110' 
                        : 'bg-gradient-to-r from-gray-700 to-gray-600 text-gray-300 group-hover:from-gray-600 group-hover:to-gray-500'
                  }`}>
                    {jobFile ? <Check className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                  </div>
                  <p className="text-gray-300 mb-4 text-sm">Upload a PDF or text file containing the job posting</p>

                  {jobFile ? (
                    <div className="bg-gray-700/50 rounded-lg p-3 border border-green-400/30">
                      <div className="flex items-center justify-center space-x-2">
                        <FileText className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-400 truncate">{jobFile?.name}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {(jobFile?.size ? (jobFile.size / 1024 / 1024).toFixed(2) : '0.00')} MB
                      </p>
                    </div>
                  ) : (
                    <div className=" ml-36 flex  w-36 border border-gray-500/50 hover:border-gray-400/70 text-gray-200 hover:text-white bg-gray-700/30 hover:bg-gray-600/50 px-4 py-2 rounded-md  text-sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-3">.pdf, .txt, .docx</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
  );
}