"use client";

import React from "react";
import { useResume } from "@/context/resume-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

export function AwardForm() {
  const { resumeData, updateSection } = useResume();
  const { awards } = resumeData;

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

  const removeAward = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateSection("awards", awards.filter((i) => i.id !== id));
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newItems = [...awards];
    newItems[index] = { ...newItems[index], [field]: value };
    updateSection("awards", newItems);
  };

  return (
    <div className="space-y-4">
      {awards.map((item, index) => (
        <Card key={item.id} className="relative group overflow-hidden border-l-4 border-l-black border-y-gray-100 border-r-gray-100">
           <CardContent className="pt-6 space-y-4">
             <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 hover:bg-red-50"
                onClick={(e) => removeAward(item.id, e)}
             >
                <Trash2 className="h-4 w-4" />
             </Button>

            <div className="space-y-1">
               <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Award Title</Label>
               <Input value={item.title} onChange={(e) => handleChange(index, "title", e.target.value)} className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Issuer</Label>
                 <Input value={item.issuer} onChange={(e) => handleChange(index, "issuer", e.target.value)} className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12" />
               </div>
               <div className="space-y-1">
                 <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Date (YYYY-MM)</Label>
                 <Input value={item.date} onChange={(e) => handleChange(index, "date", e.target.value)} className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12" placeholder="e.g. 2023-05" />
               </div>
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
      
      <Button onClick={addAward} variant="outline" className="w-full py-6 border-dashed border-2 hover:border-black hover:bg-gray-50 transition-all rounded-xl gap-2 text-gray-500 font-medium">
        <Plus className="h-4 w-4" /> Add Award
      </Button>
    </div>
  );
}
