"use client";

import React from "react";
import { useResume } from "@/context/resume-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

export function CertificationForm() {
  const { resumeData, updateSection } = useResume();
  const { certifications } = resumeData;

  const addCertification = () => {
    const newItem = {
      id: crypto.randomUUID(),
      name: "",
      issuer: "",
      date: "",
      link: "",
    };
    updateSection("certifications", [...certifications, newItem]);
  };

  const removeCertification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateSection("certifications", certifications.filter((i) => i.id !== id));
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newItems = [...certifications];
    newItems[index] = { ...newItems[index], [field]: value };
    updateSection("certifications", newItems);
  };

  return (
    <div className="space-y-4">
      {certifications.map((item, index) => (
        <Card key={item.id} className="relative group overflow-hidden border-l-4 border-l-black border-y-gray-100 border-r-gray-100">
           <CardContent className="pt-6 space-y-4">
             <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 hover:bg-red-50"
                onClick={(e) => removeCertification(item.id, e)}
             >
                <Trash2 className="h-4 w-4" />
             </Button>

            <div className="space-y-1">
               <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Certification Name</Label>
               <Input value={item.name} onChange={(e) => handleChange(index, "name", e.target.value)} className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12" />
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
               <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Credential Link</Label>
               <Input value={item.link || ""} onChange={(e) => handleChange(index, "link", e.target.value)} className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12" />
             </div>
           </CardContent>
        </Card>
      ))}
      
      <Button onClick={addCertification} variant="outline" className="w-full py-6 border-dashed border-2 hover:border-black hover:bg-gray-50 transition-all rounded-xl gap-2 text-gray-500 font-medium">
        <Plus className="h-4 w-4" /> Add Certification
      </Button>
    </div>
  );
}
