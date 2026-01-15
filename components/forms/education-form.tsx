"use client";

import React from "react";
import { useResume } from "@/context/resume-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { EducationItem } from "@/types/resume";

export function EducationForm() {
  const { resumeData, updateSection } = useResume();
  const { education } = resumeData;

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newEducation = [...education];
    newEducation[index] = { ...newEducation[index], [name]: value };
    updateSection("education", newEducation);
  };

  const addEducation = () => {
    const newItem: EducationItem = {
      id: crypto.randomUUID(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
      score: "",
    };
    updateSection("education", [...education, newItem]);
  };

  const removeEducation = (index: number) => {
    const newEducation = [...education];
    newEducation.splice(index, 1);
    updateSection("education", newEducation);
  };

  return (
    <div className="space-y-4">
      {education.map((item, index) => (
        <Card key={item.id} className="relative">
          <CardContent className="pt-6 space-y-4">
            <Button
               variant="ghost"
               size="icon"
               className="absolute top-2 right-2 text-red-500 hover:text-red-700"
               onClick={() => removeEducation(index)}
            >
               <Trash2 className="h-4 w-4" />
            </Button>

            <div className="space-y-1">
               <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Institution</Label>
               <Input name="institution" value={item.institution} onChange={(e) => handleChange(index, e)} className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Degree</Label>
                 <Input name="degree" value={item.degree} onChange={(e) => handleChange(index, e)} className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12" />
               </div>
               <div className="space-y-1">
                 <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Field of Study</Label>
                 <Input name="field" value={item.field} onChange={(e) => handleChange(index, e)} className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Start Date</Label>
                 <Input name="startDate" placeholder="YYYY" value={item.startDate} onChange={(e) => handleChange(index, e)} className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12" />
               </div>
               <div className="space-y-1">
                 <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">End Date</Label>
                 <Input name="endDate" placeholder="YYYY" value={item.endDate} onChange={(e) => handleChange(index, e)} className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12" />
               </div>
            </div>
             <div className="space-y-1">
                 <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Grade / Score</Label>
                 <Input name="score" value={item.score || ""} onChange={(e) => handleChange(index, e)} className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12" />
             </div>
          </CardContent>
        </Card>
      ))}
      <Button onClick={addEducation} variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add Education
      </Button>
    </div>
  );
}
