"use client";

import React from "react";
import { useResume } from "@/context/resume-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

export function SkillsForm() {
  const { resumeData, updateSection } = useResume();
  const { skills } = resumeData;
  const [newSkill, setNewSkill] = React.useState("");

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const skillItem = {
      id: crypto.randomUUID(),
      name: newSkill.trim(),
    };
    updateSection("skills", [...skills, skillItem]);
    setNewSkill("");
  };

  const removeSkill = (id: string) => {
    updateSection("skills", skills.filter((s) => s.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const inputClass = "rounded-lg border-zinc-200 bg-zinc-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-11 transition-all duration-200 ease-in-out font-medium text-zinc-800 placeholder:text-zinc-400 text-sm";
  const labelClass = "text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block ml-0.5";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex gap-3">
        <div className="flex-1">
          <Label htmlFor="skill-input" className={labelClass}>Add Skill</Label>
          <div className="relative">
            <Input 
              id="skill-input"
              placeholder="e.g. React, Python, Project Management" 
              value={newSkill} 
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`${inputClass} pr-12`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 font-medium">
               ENTER
            </div>
          </div>
        </div>
        <div className="pt-[1.4rem]">
           <Button onClick={addSkill} size="icon" className="h-11 w-11 rounded-xl bg-zinc-900 hover:bg-black text-white shadow-lg shadow-zinc-200 transition-all hover:scale-105 active:scale-95">
             <Plus className="h-5 w-5" />
           </Button>
        </div>
      </div>

      {skills.length > 0 && (
          <div className="p-4 bg-zinc-50/50 rounded-2xl border border-zinc-100">
             <div className="flex flex-wrap gap-2">
               {skills.map((skill) => (
                 <div 
                   key={skill.id} 
                   className="group bg-white hover:bg-indigo-50 text-zinc-700 hover:text-indigo-700 flex items-center gap-1.5 rounded-lg border border-zinc-200 hover:border-indigo-200 px-3 py-1.5 text-xs font-semibold transition-all shadow-sm"
                 >
                   {skill.name}
                   <button 
                     onClick={() => removeSkill(skill.id)}
                     className="ml-1 text-zinc-400 hover:text-red-500 transition-colors rounded-full p-0.5 hover:bg-red-50"
                   >
                     <X className="h-3 w-3" />
                     <span className="sr-only">Remove {skill.name}</span>
                   </button>
                 </div>
               ))}
             </div>
          </div>
      )}
      
      {skills.length === 0 && (
         <div className="text-center py-8 border-2 border-dashed border-zinc-100 rounded-xl">
            <p className="text-sm text-zinc-400">No skills added yet. Add your key skills above.</p>
         </div>
      )}

    </div>
  );
}
