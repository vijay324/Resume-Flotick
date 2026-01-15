"use client";

import React from "react";
import { useResume } from "@/context/resume-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function LanguageForm() {
  const { resumeData, updateSection } = useResume();
  const { languages } = resumeData;
  const [newLanguage, setNewLanguage] = React.useState("");
  const [proficiency, setProficiency] = React.useState("Professional");
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

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

  const confirmDelete = () => {
    if (deleteId === null) return;
    updateSection("languages", languages.filter((l) => l.id !== deleteId));
    setDeleteId(null);
  };

  const inputClass = "rounded-lg border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-11 transition-all duration-200 ease-in-out font-medium text-gray-800 placeholder:text-gray-400 text-sm";
  const labelClass = "text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block ml-0.5";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
               className="w-full h-11 rounded-lg border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm px-3 font-medium text-gray-700 outline-none transition-all"
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
          <Button onClick={addLanguage} size="icon" className="h-11 w-11 rounded-xl bg-gray-900 hover:bg-black text-white shadow-lg shadow-gray-200 transition-all hover:scale-105 active:scale-95 mb-[1px]">
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {languages.length > 0 && (
           <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-wrap gap-2">
             {languages.map((lang) => (
               <div 
                 key={lang.id} 
                 className="group bg-white hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 flex items-center gap-2 rounded-lg border border-gray-200 hover:border-indigo-200 pl-3 pr-2 py-1.5 text-xs font-semibold transition-all shadow-sm"
               >
                 <span>{lang.name} <span className="text-gray-400 font-normal group-hover:text-indigo-400">({lang.proficiency})</span></span>
                 <button 
                   onClick={() => setDeleteId(lang.id)}
                   className="ml-1 text-gray-400 hover:text-red-500 transition-colors rounded-full p-0.5 hover:bg-red-50"
                 >
                   <X className="h-3 w-3" />
                 </button>
               </div>
             ))}
           </div>
        )}
        
        {languages.length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl">
             <p className="text-sm text-gray-400">Add languages to showcase your communication skills.</p>
          </div>
        )}

        <ConfirmDialog
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          title="Remove Language"
          description="Are you sure you want to remove this language? This action cannot be undone."
          confirmText="Remove"
          variant="danger"
        />
    </div>
  );
}
