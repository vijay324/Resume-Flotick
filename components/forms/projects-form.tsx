"use client";

import React from "react";
import { useResume } from "@/context/resume-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { ProjectItem } from "@/types/resume";
import { DescriptionRewriteButton } from "@/components/ai/description-rewrite-button";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function ProjectsForm() {
  const { resumeData, updateSection } = useResume();
  const { projects } = resumeData;
  const [deleteIndex, setDeleteIndex] = React.useState<number | null>(null);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

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

  const confirmDelete = () => {
    if (deleteIndex === null) return;
    const newProjects = [...projects];
    newProjects.splice(deleteIndex, 1);
    updateSection("projects", newProjects);
    setDeleteIndex(null);
  };

  const handleDragStart = (index: number) => (event: React.DragEvent<HTMLButtonElement>) => {
    setDragIndex(index);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (index: number) => (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const newProjects = [...projects];
    const [moved] = newProjects.splice(dragIndex, 1);
    newProjects.splice(index, 0, moved);
    updateSection("projects", newProjects);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const inputClass = "rounded-lg border-zinc-200 bg-zinc-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-10 transition-all duration-200 ease-in-out font-medium text-zinc-800 placeholder:text-zinc-400 text-sm";
  const labelClass = "text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block ml-0.5";


  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {projects.length > 1 && (
        <div className="flex items-center gap-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          <GripVertical className="h-3.5 w-3.5" />
          Drag to reorder
        </div>
      )}
      {projects.map((item, index) => (
        <div
          key={item.id}
          onDragOver={handleDragOver(index)}
          onDrop={() => handleDrop(index)}
          className={`group relative p-5 bg-white border border-zinc-100 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all duration-300 ${dragOverIndex === index ? "ring-2 ring-indigo-200" : ""}`}
        >
            <button
               type="button"
               draggable
               onDragStart={handleDragStart(index)}
               onDragEnd={handleDragEnd}
               className="absolute top-3 left-3 p-1.5 text-zinc-300 hover:text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors opacity-100 cursor-grab active:cursor-grabbing"
               title="Drag to reorder"
            >
               <GripVertical className="h-4 w-4" />
            </button>
            <button
               className="absolute top-3 right-3 p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
               onClick={() => setDeleteIndex(index)}
               title="Remove"
            >
               <Trash2 className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
               <div className="flex items-center justify-between">
                 <Label className={labelClass}>
                    Description
                    <span className="text-zinc-300 font-normal ml-1 lowercase">(brief summary)</span>
                 </Label>
                 <DescriptionRewriteButton
                   description={item.description}
                   title={item.name}
                   onApply={(newDesc) => handleChange(index, "description", newDesc)}
                 />
               </div>
               <Textarea 
                 value={item.description} 
                 onChange={(e) => handleChange(index, "description", e.target.value)} 
                 className="min-h-[80px] rounded-lg border-zinc-200 bg-zinc-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none p-3 font-normal text-sm text-zinc-700 leading-relaxed"
                 placeholder="Built a full-stack dashboard for managing online store inventory..."
               />
            </div>
        </div>
      ))}
      <Button onClick={addProject} variant="outline" className="w-full h-11 border-dashed border-zinc-300 text-zinc-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-xl transition-all">
        <Plus className="mr-2 h-4 w-4" /> Add Project
      </Button>

      <ConfirmDialog
        isOpen={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        onConfirm={confirmDelete}
        title="Remove Project"
        description="Are you sure you want to remove this project? This action cannot be undone."
        confirmText="Remove"
        variant="danger"
      />
    </div>
  );
}
