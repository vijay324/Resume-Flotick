"use client";

import React from "react";
import { useResume } from "@/context/resume-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { EducationItem } from "@/types/resume";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function EducationForm() {
  const { resumeData, updateSection } = useResume();
  const { education } = resumeData;
  const [deleteIndex, setDeleteIndex] = React.useState<number | null>(null);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

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

  const confirmDelete = () => {
    if (deleteIndex === null) return;
    const newEducation = [...education];
    newEducation.splice(deleteIndex, 1);
    updateSection("education", newEducation);
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
    const newEducation = [...education];
    const [moved] = newEducation.splice(dragIndex, 1);
    newEducation.splice(index, 0, moved);
    updateSection("education", newEducation);
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
      {education.length > 1 && (
        <div className="flex items-center gap-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
          <GripVertical className="h-3.5 w-3.5" />
          Drag to reorder
        </div>
      )}
      {education.map((item, index) => (
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

            <div className="space-y-1 mb-4">
               <Label className={labelClass}>Institution / School</Label>
               <Input name="institution" value={item.institution} onChange={(e) => handleChange(index, e)} className={inputClass} placeholder="Stanford University" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <div className="space-y-1">
                 <Label className={labelClass}>Degree</Label>
                 <Input name="degree" value={item.degree} onChange={(e) => handleChange(index, e)} className={inputClass} placeholder="Bachelor of Science" />
               </div>
               <div className="space-y-1">
                 <Label className={labelClass}>Field of Study</Label>
                 <Input name="field" value={item.field} onChange={(e) => handleChange(index, e)} className={inputClass} placeholder="Computer Science" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <div className="space-y-1">
                 <Label className={labelClass}>Start Year</Label>
                 <Input name="startDate" placeholder="2018" value={item.startDate} onChange={(e) => handleChange(index, e)} className={inputClass} />
               </div>
               <div className="space-y-1">
                 <Label className={labelClass}>End Year</Label>
                 <Input name="endDate" placeholder="2022" value={item.endDate} onChange={(e) => handleChange(index, e)} className={inputClass} />
               </div>
            </div>
             <div className="space-y-1">
                 <Label className={labelClass}>Grade / Score / GPA</Label>
                 <Input name="score" value={item.score || ""} onChange={(e) => handleChange(index, e)} className={inputClass} placeholder="3.8/4.0" />
             </div>
        </div>
      ))}
      <Button onClick={addEducation} variant="outline" className="w-full h-11 border-dashed border-zinc-300 text-zinc-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-xl transition-all">
        <Plus className="mr-2 h-4 w-4" /> Add Education
      </Button>

      <ConfirmDialog
        isOpen={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        onConfirm={confirmDelete}
        title="Remove Education"
        description="Are you sure you want to remove this education entry? This action cannot be undone."
        confirmText="Remove"
        variant="danger"
      />
    </div>
  );
}
