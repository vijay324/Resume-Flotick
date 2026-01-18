"use client";

import React from "react";
import { useResume } from "@/context/resume-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Languages } from "lucide-react";

export function LanguageForm() {
  const { resumeData, updateSection } = useResume();
  const { languages } = resumeData;
  const [newLanguage, setNewLanguage] = React.useState("");
  const [proficiency, setProficiency] = React.useState("Professional");

  const commonLanguages = ["English", "Telugu", "Hindi", "Tamil"];

  const removeLanguage = (id: string) => {
    updateSection("languages", languages.filter((l) => l.id !== id));
  };

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

  const addSpecificLanguage = (name: string) => {
    if (languages.some(l => l.name.toLowerCase() === name.toLowerCase())) return;
    const item = {
      id: crypto.randomUUID(),
      name: name,
      proficiency: (name.toLowerCase() === "english" ? "Professional" : "Native") as any,
    };
    updateSection("languages", [...languages, item]);
  };

  const inputClass = "rounded-lg border-zinc-200 bg-zinc-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-11 transition-all duration-200 ease-in-out font-medium text-zinc-800 placeholder:text-zinc-400 text-sm";
  const labelClass = "text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block ml-0.5";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-wrap gap-2 mb-2">
          {commonLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => addSpecificLanguage(lang)}
              disabled={languages.some(l => l.name.toLowerCase() === lang.toLowerCase())}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 text-zinc-600 hover:text-indigo-600 text-xs font-medium transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-zinc-200 disabled:hover:text-zinc-600"
            >
              <Plus className="h-3 w-3" />
              {lang}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[1fr,140px,auto] gap-3 items-end">
          <div className="space-y-1">
             <Label htmlFor="lang-input" className={labelClass}>Language</Label>
             <Input 
               id="lang-input"
               placeholder="e.g. French" 
               value={newLanguage} 
               onChange={(e) => setNewLanguage(e.target.value)}
               className={inputClass}
             />
          </div>
          <div className="space-y-1">
             <Label htmlFor="prof-input" className={labelClass}>Proficiency</Label>
             <select 
               className="w-full h-11 rounded-lg border-zinc-200 bg-zinc-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm px-3 font-medium text-zinc-700 outline-none transition-all"
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
          <Button onClick={addLanguage} size="icon" className="h-11 w-11 rounded-xl bg-zinc-900 hover:bg-black text-white shadow-lg shadow-zinc-200 transition-all hover:scale-105 active:scale-95 mb-[1px]">
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {languages.length > 0 && (
           <div className="p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100 flex flex-wrap gap-2">
             {languages.map((lang) => (
               <div 
                 key={lang.id} 
                 className="group bg-white hover:bg-indigo-50 text-zinc-700 hover:text-indigo-700 flex items-center gap-2 rounded-lg border border-zinc-200 hover:border-indigo-200 pl-3 pr-2 py-1.5 text-xs font-semibold transition-all shadow-sm"
               >
                 <span>{lang.name} <span className="text-zinc-400 font-normal group-hover:text-indigo-400">({lang.proficiency})</span></span>
                  <button 
                    onClick={() => removeLanguage(lang.id)}
                    className="ml-1 text-zinc-400 hover:text-red-500 transition-colors rounded-full p-0.5 hover:bg-red-50"
                  >
                    <X className="h-3 w-3" />
                  </button>
               </div>
             ))}
           </div>
        )}
        
        {languages.length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-zinc-100 rounded-xl">
             <p className="text-sm text-zinc-400">Add languages to showcase your communication skills.</p>
          </div>
        )}

    </div>
  );
}
