"use client";

import React from "react";
import { useResume } from "@/context/resume-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

export function VolunteerForm() {
  const { resumeData, updateSection } = useResume();
  const { volunteer } = resumeData;

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

  const removeVolunteer = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateSection("volunteer", volunteer.filter((i) => i.id !== id));
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Handle checkbox/current state differently if needed, but here simple implementation
    const newItems = [...volunteer];
    newItems[index] = { ...newItems[index], [name]: value };
    updateSection("volunteer", newItems);
  };

  return (
    <div className="space-y-4">
      {volunteer.map((item, index) => (
        <Card key={item.id} className="relative group overflow-hidden border-l-4 border-l-black border-y-gray-100 border-r-gray-100">
           <CardContent className="pt-6 space-y-4">
             <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 hover:bg-red-50"
                onClick={(e) => removeVolunteer(item.id, e)}
             >
                <Trash2 className="h-4 w-4" />
             </Button>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Organization</Label>
                 <Input name="organization" value={item.organization} onChange={(e) => handleChange(index, e)} className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12" />
               </div>
               <div className="space-y-1">
                 <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Role</Label>
                 <Input name="role" value={item.role} onChange={(e) => handleChange(index, e)} className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Start Date</Label>
                 <Input name="startDate" type="text" placeholder="YYYY-MM" value={item.startDate} onChange={(e) => handleChange(index, e)} className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12" />
               </div>
               <div className="space-y-1">
                 <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">End Date</Label>
                 <Input name="endDate" type="text" placeholder="YYYY-MM" value={item.endDate} onChange={(e) => handleChange(index, e)} className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12" />
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
               />
            </div>
           </CardContent>
        </Card>
      ))}
      
      <Button onClick={addVolunteer} variant="outline" className="w-full py-6 border-dashed border-2 hover:border-black hover:bg-gray-50 transition-all rounded-xl gap-2 text-gray-500 font-medium">
        <Plus className="h-4 w-4" /> Add Volunteer Exp
      </Button>
    </div>
  );
}
