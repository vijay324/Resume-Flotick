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

  return (
    <div className="space-y-4">
      {projects.map((item, index) => (
        <Card key={item.id} className="relative">
          <CardContent className="pt-6 space-y-4">
            <Button
               variant="ghost"
               size="icon"
               className="absolute top-2 right-2 text-red-500 hover:text-red-700"
               onClick={() => removeProject(index)}
            >
               <Trash2 className="h-4 w-4" />
            </Button>

            <div className="space-y-1">
               <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Project Name</Label>
               <Input value={item.name} onChange={(e) => handleChange(index, "name", e.target.value)} className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12" />
            </div>

            <div className="space-y-1">
               <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Technologies (comma separated)</Label>
               <Input 
                 value={item.technologies.join(", ")} 
                 onChange={(e) => handleTechnologiesChange(index, e.target.value)} 
                 placeholder="React, Node.js, Stripe"
                 className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12"
               />
            </div>
             
             <div className="space-y-1">
               <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Link</Label>
               <Input value={item.link || ""} onChange={(e) => handleChange(index, "link", e.target.value)} className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12" />
             </div>

            <div className="space-y-1">
               <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Description</Label>
               <Textarea 
                 value={item.description} 
                 onChange={(e) => handleChange(index, "description", e.target.value)} 
                 className="min-h-[80px] rounded-xl border-gray-200 focus:ring-black focus:border-black p-4"
               />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button onClick={addProject} variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add Project
      </Button>
    </div>
  );
}
