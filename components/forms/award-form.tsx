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

export function AwardForm() {
  const { resumeData, updateSection } = useResume();
  const { awards } = resumeData;
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const addAward = () => {
    const newItem = {
      id: crypto.randomUUID(),
      title: "",
      issuer: "",
      date: "",
      description: "",
    };
    updateSection("awards", [...awards, newItem]);
  };

  const confirmDelete = () => {
    if (deleteId === null) return;
    updateSection("awards", awards.filter((i) => i.id !== deleteId));
    setDeleteId(null);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newItems = [...awards];
    newItems[index] = { ...newItems[index], [field]: value };
    updateSection("awards", newItems);
  };

  const inputClass = "rounded-lg border-zinc-200 bg-zinc-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-10 transition-all duration-200 ease-in-out font-medium text-zinc-800 placeholder:text-zinc-400 text-sm";
  const labelClass = "text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block ml-0.5";

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {awards.map((item, index) => (
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

            <div className="space-y-1 mb-4">
               <Label className={labelClass}>Award Title</Label>
               <Input value={item.title} onChange={(e) => handleChange(index, "title", e.target.value)} className={inputClass} placeholder="Employee of the Year" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <div className="space-y-1">
                 <Label className={labelClass}>Issuer</Label>
                 <Input value={item.issuer} onChange={(e) => handleChange(index, "issuer", e.target.value)} className={inputClass} placeholder="Company Name" />
               </div>
               <div className="space-y-1">
                 <Label className={labelClass}>Date (YYYY-MM)</Label>
                 <Input value={item.date} onChange={(e) => handleChange(index, "date", e.target.value)} className={inputClass} placeholder="e.g. 2023-05" />
               </div>
            </div>
            
             <div className="space-y-1">
               <div className="flex items-center justify-between">
                 <Label className={labelClass}>Description</Label>
                 <DescriptionRewriteButton
                   description={item.description || ""}
                   title={item.title}
                   context={item.issuer}
                   onApply={(newDesc) => handleChange(index, "description", newDesc)}
                 />
               </div>
               <Textarea 
                 value={item.description} 
                 onChange={(e) => handleChange(index, "description", e.target.value)} 
                 className="min-h-[80px] rounded-lg border-zinc-200 bg-zinc-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none p-3 font-normal text-sm text-zinc-700 leading-relaxed"
               />
             </div>
        </div>
      ))}
      
      <Button onClick={addAward} variant="outline" className="w-full h-11 border-dashed border-zinc-300 text-zinc-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-xl transition-all">
        <Plus className="mr-2 h-4 w-4" /> Add Award
      </Button>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Remove Award"
        description="Are you sure you want to remove this award? This action cannot be undone."
        confirmText="Remove"
        variant="danger"
      />
    </div>
  );
}
