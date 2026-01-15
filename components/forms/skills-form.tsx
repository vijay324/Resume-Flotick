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
      level: "Expert" as const, // Default, can be expanded
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

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="skill-input" className="sr-only">Add Skill</Label>
            <Input 
              id="skill-input"
              placeholder="Add a skill (e.g., React, Python)" 
              value={newSkill} 
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              className="rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12"
            />
          </div>
          <Button onClick={addSkill} size="icon" className="h-12 w-12 rounded-xl bg-black hover:bg-gray-800">
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div 
              key={skill.id} 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {skill.name}
              <button 
                onClick={() => removeSkill(skill.id)}
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                <span className="sr-only">Remove {skill.name}</span>
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
