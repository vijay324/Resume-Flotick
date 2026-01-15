"use client";

import React from "react";
import { useResume } from "@/context/resume-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { ProjectItem } from "@/types/resume";

export function ProjectsForm() {
  const { resumeData, updateSection } = useResume();
  const { projects } = resumeData;

  const handleChange = (index: number, field: keyof ProjectItem, value: any) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    updateSection("projects", newProjects);
  };

  const handleTechnologiesChange = (index: number, value: string) => {
     // Split by comma
     const techs = value.split(",").map(t => t.trim());
     handleChange(index, "technologies", techs);
  };

  const addProject = () => {
    const newItem: ProjectItem = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      technologies: [],
      link: "",
    };
    updateSection("projects", [...projects, newItem]);
  };

  const removeProject = (index: number) => {
    const newProjects = [...projects];
    newProjects.splice(index, 1);
    updateSection("projects", newProjects);
  };

  const inputClass = "rounded-lg border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-10 transition-all duration-200 ease-in-out font-medium text-gray-800 placeholder:text-gray-400 text-sm";
  const labelClass = "text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block ml-0.5";


  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {projects.map((item, index) => (
        <div key={item.id} className="group relative p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all duration-300">
            <button
               className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
               onClick={() => removeProject(index)}
               title="Remove"
            >
               <Trash2 className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                   <Label className={labelClass}>Project Name</Label>
                   <Input value={item.name} onChange={(e) => handleChange(index, "name", e.target.value)} className={inputClass} placeholder="E-commerce Dashboard" />
                </div>
                <div className="space-y-1">
                   <Label className={labelClass}>Link / URL</Label>
                   <Input value={item.link || ""} onChange={(e) => handleChange(index, "link", e.target.value)} className={inputClass} placeholder="github.com/project" />
                </div>
            </div>

            <div className="space-y-1 mb-4">
               <Label className={labelClass}>Technologies Used (comma separated)</Label>
               <Input 
                 value={item.technologies.join(", ")} 
                 onChange={(e) => handleTechnologiesChange(index, e.target.value)} 
                 placeholder="React, Node.js, Stripe, Tailwind CSS"
                 className={inputClass}
               />
            </div>
             
            <div className="space-y-1">
               <Label className={labelClass}>
                   Description
                   <span className="text-gray-300 font-normal ml-1 lowercase">(brief summary)</span>
               </Label>
               <Textarea 
                 value={item.description} 
                 onChange={(e) => handleChange(index, "description", e.target.value)} 
                 className="min-h-[80px] rounded-lg border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none p-3 font-normal text-sm text-gray-700 leading-relaxed"
                 placeholder="Built a full-stack dashboard for managing online store inventory..."
               />
            </div>
        </div>
      ))}
      <Button onClick={addProject} variant="outline" className="w-full h-11 border-dashed border-gray-300 text-gray-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-xl transition-all">
        <Plus className="mr-2 h-4 w-4" /> Add Project
      </Button>
    </div>
  );
}
