"use client";

import React from "react";
import { useResume } from "@/context/resume-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

export function LanguageForm() {
  const { resumeData, updateSection } = useResume();
  const { languages } = resumeData;
  const [newLanguage, setNewLanguage] = React.useState("");
  const [proficiency, setProficiency] = React.useState("Professional");

  const addLanguage = () => {
    if (!newLanguage.trim()) return;
    const item = {
      id: crypto.randomUUID(),
      name: newLanguage.trim(),
      proficiency: proficiency as any,
    };
    updateSection("languages", [...languages, item]);
    setNewLanguage("");
  };

  const removeLanguage = (id: string) => {
    updateSection("languages", languages.filter((l) => l.id !== id));
  };


  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-[1fr,auto,auto] gap-2 items-end">
          <div className="space-y-1">
             <Label htmlFor="lang-input" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Language</Label>
             <Input 
               id="lang-input"
               placeholder="e.g. French" 
               value={newLanguage} 
               onChange={(e) => setNewLanguage(e.target.value)}
               className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12"
             />
          </div>
          <div className="space-y-1 w-32">
             <Label htmlFor="prof-input" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Proficiency</Label>
             <select 
               className="w-full h-12 rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black text-sm px-3"
               value={proficiency}
               onChange={(e) => setProficiency(e.target.value)}
             >
                <option value="Native">Native</option>
                <option value="Fluent">Fluent</option>
                <option value="Professional">Professional</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Basic">Basic</option>
             </select>
          </div>
          <Button onClick={addLanguage} size="icon" className="h-12 w-12 rounded-xl bg-black hover:bg-gray-800 shrink-0">
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <div 
              key={lang.id} 
              className="bg-gray-100/50 hover:bg-gray-100 flex items-center gap-2 rounded-lg border border-gray-200 pl-3 pr-2 py-1.5 text-xs font-medium transition-colors"
            >
              <span>{lang.name} <span className="text-gray-400 font-normal">({lang.proficiency})</span></span>
              <button 
                onClick={() => removeLanguage(lang.id)}
                className="ml-1 p-0.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="h-3 w-3 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
