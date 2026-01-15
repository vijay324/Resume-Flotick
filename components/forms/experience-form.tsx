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

export function ExperienceForm() {
  const { resumeData, updateSection } = useResume();
  const { experience } = resumeData;

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newExperience = [...experience];
    newExperience[index] = { ...newExperience[index], [name]: value };
    updateSection("experience", newExperience);
  };
  
  // Explicitly typed helper for checkbox
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

  const removeExperience = (index: number) => {
    const newExperience = [...experience];
    newExperience.splice(index, 1);
    updateSection("experience", newExperience);
  };

  return (
    <div className="space-y-4">
      {experience.map((item, index) => (
        <Card key={item.id} className="relative">
          <CardContent className="pt-6 space-y-4">
            <Button
               variant="ghost"
               size="icon"
               className="absolute top-2 right-2 text-red-500 hover:text-red-700"
               onClick={() => removeExperience(index)}
            >
               <Trash2 className="h-4 w-4" />
            </Button>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Company</Label>
                 <Input name="company" value={item.company} onChange={(e) => handleChange(index, e)} className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12" />
               </div>
               <div className="space-y-1">
                 <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Position</Label>
                 <Input name="position" value={item.position} onChange={(e) => handleChange(index, e)} className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Start Date</Label>
                 <Input name="startDate" type="text" placeholder="YYYY-MM" value={item.startDate} onChange={(e) => handleChange(index, e)} className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12" />
               </div>
               <div className="space-y-1">
                 <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">End Date</Label>
                 <div className="flex items-center gap-2">
                    <Input 
                       name="endDate" 
                       type="text" 
                       placeholder="YYYY-MM" 
                       value={item.endDate} 
                       disabled={item.current}
                       onChange={(e) => handleChange(index, e)} 
                       className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12"
                    />
                    <div className="flex items-center gap-1.5">
                       <input 
                          type="checkbox" 
                          id={`current-${item.id}`}
                          checked={item.current}
                          onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                       />
                       <Label htmlFor={`current-${item.id}`} className="text-xs font-normal">Present</Label>
                    </div>
                 </div>
               </div>
            </div>
            
             <div className="space-y-1">
               <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Location</Label>
               <Input name="location" value={item.location || ""} onChange={(e) => handleChange(index, e)} className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12" />
             </div>

            <div className="space-y-1">
               <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Description</Label>
               <Textarea 
                 name="description" 
                 value={item.description} 
                 onChange={(e) => handleChange(index, e)} 
                 className="min-h-[100px] rounded-xl border-gray-200 focus:ring-black focus:border-black p-4"
                 placeholder="• Achieved X by doing Y..."
               />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button onClick={addExperience} variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add Experience
      </Button>
    </div>
  );
}
