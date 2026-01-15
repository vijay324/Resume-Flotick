"use client";

import React from "react";
import { useResume } from "@/context/resume-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DescriptionRewriteButton } from "@/components/ai/description-rewrite-button";

export function PersonalInfoForm() {
  const { resumeData, updateSection } = useResume();
  const { personalInfo } = resumeData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateSection("personalInfo", { ...personalInfo, [name]: value });
  };

  const inputClass = "rounded-lg border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-11 transition-all duration-200 ease-in-out font-medium text-gray-800 placeholder:text-gray-400";
  const labelClass = "text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2 block ml-0.5";

  return (
    <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
            <label className={labelClass} htmlFor="fullName">Full Name</label>
            <Input 
               id="fullName" 
               name="fullName" 
               value={personalInfo.fullName} 
               onChange={handleChange} 
               className={inputClass}
               placeholder="e.g. Sreekar Desu"
            />
        </div>

        <div className="space-y-1">
            <label className={labelClass} htmlFor="jobTitle">Professional Title</label>
            <Input 
               id="jobTitle" 
               name="jobTitle" 
               value={personalInfo.jobTitle || ""} 
               onChange={handleChange} 
               className={inputClass}
               placeholder="e.g. Full Stack Developer"
            />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className={labelClass} htmlFor="summary">Professional Summary</label>
          <DescriptionRewriteButton
            description={personalInfo.summary}
            title={personalInfo.jobTitle || "Professional"}
            onApply={(newSummary) => updateSection("personalInfo", { ...personalInfo, summary: newSummary })}
          />
        </div>
        <Textarea 
           id="summary" 
           name="summary" 
           value={personalInfo.summary} 
           onChange={handleChange} 
           className="min-h-[120px] rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none p-4 font-normal text-gray-700 leading-relaxed"
           placeholder="Write a compelling summary of your professional background..."
        />
        <p className="text-[10px] text-gray-400 text-right pt-1">Try to keep it under 300 characters for better impact.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="space-y-1">
           <label className={labelClass} htmlFor="email">Email Address</label>
           <div className="relative">
             <Input id="email" name="email" value={personalInfo.email} onChange={handleChange} className={`${inputClass} pl-9`} placeholder="example@gmail.com" />
             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
             </div>
           </div>
         </div>
         <div className="space-y-1">
           <label className={labelClass} htmlFor="phone">Phone Number</label>
           <div className="relative">
             <Input id="phone" name="phone" value={personalInfo.phone} onChange={handleChange} className={`${inputClass} pl-9`} placeholder="+1 (555) 000-0000" />
             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
             </div>
           </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="space-y-1">
           <label className={labelClass} htmlFor="linkedin">LinkedIn</label>
           <Input id="linkedin" name="linkedin" value={personalInfo.linkedin || ""} onChange={handleChange} className={inputClass} placeholder="linkedin.com/in/username" />
         </div>
         <div className="space-y-1">
           <label className={labelClass} htmlFor="github">GitHub</label>
           <Input id="github" name="github" value={personalInfo.github || ""} onChange={handleChange} className={inputClass} placeholder="github.com/username" />
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClass} htmlFor="website">Portfolio / Website</label>
            <Input id="website" name="website" value={personalInfo.website || ""} onChange={handleChange} className={inputClass} placeholder="www.yourname.com" />
          </div>
          <div className="space-y-1">
             <label className={labelClass} htmlFor="location">Location</label>
             <Input id="location" name="location" value={personalInfo.location || ""} onChange={handleChange} className={inputClass} placeholder="City, Country" />
          </div>
      </div>

    </div>
  );
}
