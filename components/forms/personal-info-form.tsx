"use client";

import React from "react";
import { useResume } from "@/context/resume-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function PersonalInfoForm() {
  const { resumeData, updateSection } = useResume();
  const { personalInfo } = resumeData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateSection("personalInfo", { ...personalInfo, [name]: value });
  };

  const inputClass = "rounded-xl border-gray-200 bg-white focus:ring-black focus:border-black h-12";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block";

  return (
    <div className="grid gap-6">
      
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

      <div className="space-y-1">
        <label className={labelClass} htmlFor="summary">Professional Summary</label>
        <Textarea 
           id="summary" 
           name="summary" 
           value={personalInfo.summary} 
           onChange={handleChange} 
           className="min-h-[100px] rounded-xl border-gray-200 focus:ring-black focus:border-black resize-none p-4"
           placeholder="Full-stack engineer building scalable web systems..."
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
         <div className="space-y-1">
           <label className={labelClass} htmlFor="email">Email</label>
           <Input id="email" name="email" value={personalInfo.email} onChange={handleChange} className={inputClass} />
         </div>
         <div className="space-y-1">
           <label className={labelClass} htmlFor="phone">Phone</label>
           <Input id="phone" name="phone" value={personalInfo.phone} onChange={handleChange} className={inputClass} />
         </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
         <div className="space-y-1">
           <label className={labelClass} htmlFor="linkedin">LinkedIn</label>
           <Input id="linkedin" name="linkedin" value={personalInfo.linkedin || ""} onChange={handleChange} className={inputClass} placeholder="linkedin.com/in/..." />
         </div>
         <div className="space-y-1">
           <label className={labelClass} htmlFor="website">Portfolio</label>
           <Input id="website" name="website" value={personalInfo.website || ""} onChange={handleChange} className={inputClass} placeholder="mysite.com" />
         </div>
      </div>
      
       <div className="space-y-1">
           <label className={labelClass} htmlFor="location">Location</label>
           <Input id="location" name="location" value={personalInfo.location || ""} onChange={handleChange} className={inputClass} />
         </div>

    </div>
  );
}
