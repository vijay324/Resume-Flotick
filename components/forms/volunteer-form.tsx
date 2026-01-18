"use client";

import React from "react";
import { useResume } from "@/context/resume-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { DescriptionRewriteButton } from "@/components/ai/description-rewrite-button";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function VolunteerForm() {
  const { resumeData, updateSection } = useResume();
  const { volunteer } = resumeData;
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const addVolunteer = () => {
    const newItem = {
      id: crypto.randomUUID(),
      organization: "",
      role: "",
      startDate: "",
      endDate: "",
      current: false,
      location: "",
      description: "",
    };
    updateSection("volunteer", [...volunteer, newItem]);
  };

  const confirmDelete = () => {
    if (deleteId === null) return;
    updateSection("volunteer", volunteer.filter((i) => i.id !== deleteId));
    setDeleteId(null);
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Handle checkbox/current state differently if needed, but here simple implementation
    const newItems = [...volunteer];
    newItems[index] = { ...newItems[index], [name]: value };
    updateSection("volunteer", newItems);
  };

  const inputClass = "rounded-lg border-zinc-200 bg-zinc-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-10 transition-all duration-200 ease-in-out font-medium text-zinc-800 placeholder:text-zinc-400 text-sm";
  const labelClass = "text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block ml-0.5";

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {volunteer.map((item, index) => (
        <div key={item.id} className="group relative p-5 bg-white border border-zinc-100 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all duration-300">
             <button
                className="absolute top-3 right-3 p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteId(item.id);
                }}
                title="Remove"
             >
                <Trash2 className="h-4 w-4" />
             </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <div className="space-y-1">
                 <Label className={labelClass}>Organization</Label>
                 <Input name="organization" value={item.organization} onChange={(e) => handleChange(index, e)} className={inputClass} placeholder="Non-profit Name" />
               </div>
               <div className="space-y-1">
                 <Label className={labelClass}>Role</Label>
                 <Input name="role" value={item.role} onChange={(e) => handleChange(index, e)} className={inputClass} placeholder="Volunteer" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <div className="space-y-1">
                 <Label className={labelClass}>Start Date</Label>
                 <Input name="startDate" type="text" placeholder="YYYY-MM" value={item.startDate} onChange={(e) => handleChange(index, e)} className={inputClass} />
               </div>
               <div className="space-y-1">
                 <Label className={labelClass}>End Date</Label>
                 <Input name="endDate" type="text" placeholder="YYYY-MM" value={item.endDate} onChange={(e) => handleChange(index, e)} className={inputClass} />
               </div>
            </div>
            
             <div className="space-y-1 mb-4">
               <Label className={labelClass}>Location</Label>
               <Input name="location" value={item.location || ""} onChange={(e) => handleChange(index, e)} className={inputClass} placeholder="New York, NY" />
             </div>

            <div className="space-y-1">
               <div className="flex items-center justify-between">
                 <Label className={labelClass}>Description</Label>
                 <DescriptionRewriteButton
                   description={item.description}
                   title={item.role}
                   context={item.organization}
                   onApply={(newDesc) => {
                     const newItems = [...volunteer];
                     newItems[index] = { ...newItems[index], description: newDesc };
                     updateSection("volunteer", newItems);
                   }}
                 />
               </div>
               <Textarea 
                 name="description" 
                 value={item.description} 
                 onChange={(e) => handleChange(index, e)} 
                 className="min-h-[100px] rounded-lg border-zinc-200 bg-zinc-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none p-3 font-normal text-sm text-zinc-700 leading-relaxed"
               />
            </div>
        </div>
      ))}
      
      <Button onClick={addVolunteer} variant="outline" className="w-full h-11 border-dashed border-zinc-300 text-zinc-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-xl transition-all">
        <Plus className="mr-2 h-4 w-4" /> Add Volunteer Exp
      </Button>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Remove Volunteer Experience"
        description="Are you sure you want to remove this volunteer experience? This action cannot be undone."
        confirmText="Remove"
        variant="danger"
      />
    </div>
  );
}
