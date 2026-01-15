"use client";

import React from "react";
import { useResume } from "@/context/resume-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { ExperienceItem } from "@/types/resume";
import { DescriptionRewriteButton } from "@/components/ai/description-rewrite-button";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function ExperienceForm() {
  const { resumeData, updateSection } = useResume();
  const { experience } = resumeData;
  const [deleteIndex, setDeleteIndex] = React.useState<number | null>(null);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newExperience = [...experience];
    newExperience[index] = { ...newExperience[index], [name]: value };
    updateSection("experience", newExperience);
  };
  
  const handleCheckboxChange = (index: number, checked: boolean) => {
      const newExperience = [...experience];
      newExperience[index] = { ...newExperience[index], current: checked };
      updateSection("experience", newExperience);
  };

  const addExperience = () => {
    const newUrl: ExperienceItem = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      location: "",
      description: "",
    };
    updateSection("experience", [...experience, newUrl]);
  };

  const confirmDelete = () => {
    if (deleteIndex === null) return;
    const newExperience = [...experience];
    newExperience.splice(deleteIndex, 1);
    updateSection("experience", newExperience);
    setDeleteIndex(null);
  };

  const inputClass = "rounded-lg border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-10 transition-all duration-200 ease-in-out font-medium text-gray-800 placeholder:text-gray-400 text-sm";
  const labelClass = "text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block ml-0.5";

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {experience.map((item, index) => (
        <div key={item.id} className="group relative p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all duration-300">
            <button
               className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
               onClick={() => setDeleteIndex(index)}
               title="Remove"
            >
               <Trash2 className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-2 gap-4 mb-4">
               <div className="space-y-1">
                 <Label className={labelClass}>Company Name</Label>
                 <Input name="company" value={item.company} onChange={(e) => handleChange(index, e)} className={inputClass} placeholder="Google" />
               </div>
               <div className="space-y-1">
                 <Label className={labelClass}>Job Title</Label>
                 <Input name="position" value={item.position} onChange={(e) => handleChange(index, e)} className={inputClass} placeholder="Software Engineer" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
               <div className="space-y-1">
                 <Label className={labelClass}>Start Date</Label>
                 <Input name="startDate" type="text" placeholder="Jan 2022" value={item.startDate} onChange={(e) => handleChange(index, e)} className={inputClass} />
               </div>
               <div className="space-y-1">
                 <Label className={labelClass}>End Date</Label>
                 <div className="flex items-center gap-2">
                    <Input 
                       name="endDate" 
                       type="text" 
                       placeholder="Present" 
                       value={item.endDate} 
                       disabled={item.current}
                       onChange={(e) => handleChange(index, e)} 
                       className={`${inputClass} disabled:opacity-50`}
                    />
                    <div className="flex items-center gap-1.5 shrink-0">
                       <input 
                          type="checkbox" 
                          id={`current-${item.id}`}
                          checked={item.current}
                          onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                       />
                       <Label htmlFor={`current-${item.id}`} className="text-[10px] font-medium text-gray-500 cursor-pointer select-none">Current</Label>
                    </div>
                 </div>
               </div>
            </div>
            
             <div className="space-y-1 mb-4">
               <Label className={labelClass}>Location</Label>
               <Input name="location" value={item.location || ""} onChange={(e) => handleChange(index, e)} className={inputClass} placeholder="Mountain View, CA (Remote)" />
             </div>

            <div className="space-y-1">
               <div className="flex items-center justify-between">
                 <Label className={labelClass}>
                    Description 
                    <span className="text-gray-300 font-normal ml-1 lowercase">(bullet points recommended)</span>
                 </Label>
                 <DescriptionRewriteButton
                   description={item.description}
                   title={item.position}
                   context={item.company}
                   onApply={(newDesc) => {
                     const newExperience = [...experience];
                     newExperience[index] = { ...newExperience[index], description: newDesc };
                     updateSection("experience", newExperience);
                   }}
                 />
               </div>
               <Textarea 
                 name="description" 
                 value={item.description} 
                 onChange={(e) => handleChange(index, e)} 
                 className="min-h-[100px] rounded-lg border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none p-3 font-normal text-sm text-gray-700 leading-relaxed"
                 placeholder="• Developed scalable web applications using React and Next.js&#10;• Improved site performance by 25% through code optimization"
               />
            </div>
        </div>
      ))}
      <Button onClick={addExperience} variant="outline" className="w-full h-11 border-dashed border-gray-300 text-gray-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-xl transition-all">
        <Plus className="mr-2 h-4 w-4" /> Add Work Experience
      </Button>

      <ConfirmDialog
        isOpen={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        onConfirm={confirmDelete}
        title="Remove Experience"
        description="Are you sure you want to remove this work experience entry? This action cannot be undone."
        confirmText="Remove"
        variant="danger"
      />
    </div>
  );
}
