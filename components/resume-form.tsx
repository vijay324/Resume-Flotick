"use client";

import React from "react";
import { User, Wrench, History, Briefcase, Sparkles, GraduationCap } from "lucide-react";
import { PersonalInfoForm } from "./forms/personal-info-form";
import { ExperienceForm } from "./forms/experience-form";
import { EducationForm } from "./forms/education-form";
import { SkillsForm } from "./forms/skills-form";
import { ProjectsForm } from "./forms/projects-form";
import { ATSScore } from "./ats-score";
import { cn } from "@/lib/utils";
import { LanguageForm } from "./forms/language-form";
import { CertificationForm } from "./forms/certification-form";
import { AwardForm } from "./forms/award-form";
import { VolunteerForm } from "./forms/volunteer-form";
import { ResumeAIPanel } from "./ai/resume-ai-panel";
import { JobOptimizerPanel } from "./ai/job-optimizer-panel";
import { LinkedInAnalyzer } from "./ai/linkedin-analyzer";
import { ApiKeySettings } from "./ai/api-key-settings";

export function ResumeForm() {
  const [activeTab, setActiveTab] = React.useState("identity");

  const tabs = [
    { id: "identity", label: "Identity", icon: User },
    { id: "toolkit", label: "Toolkit", icon: Wrench },
    { id: "history", label: "History", icon: History }, 
    { id: "works", label: "Works", icon: Briefcase }, 
    { id: "ai-tools", label: "AI Tools", icon: Sparkles },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
       {/* Tab Navigation */}
       <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 overflow-x-auto no-scrollbar bg-white/50 backdrop-blur-sm sticky top-0 z-10 w-full">
          {tabs.map((tab) => {
             const Icon = tab.icon;
             const isActive = activeTab === tab.id;
             return (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={cn(
                    "relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-300 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                    isActive 
                        ? "bg-gray-900 text-white shadow-md shadow-gray-200 scale-105" 
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/80"
                 )}
               >
                 <Icon className={`h-3.5 w-3.5 ${isActive ? "text-indigo-300" : ""}`} />
                 <span>{tab.label}</span>
               </button>
             );
          })}
       </div>

       {/* Tab Content */}
       <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {activeTab === "identity" && (
             <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                   <h2 className="text-xl font-bold text-gray-900 tracking-tight">Personal Identity</h2>
                   <p className="text-sm text-gray-500 font-medium">Contact details and professional title</p>
                </div>
                <ATSScore />
                <PersonalInfoForm />
             </div>
          )}

          {activeTab === "toolkit" && (
             <div className="space-y-8 animate-in fade-in duration-300">
                <div className="space-y-4">
                   <div>
                      <h2 className="text-lg font-bold text-gray-900">Technical Skills</h2>
                      <p className="text-sm text-gray-500">Highlight your technical expertise</p>
                   </div>
                   <SkillsForm />
                </div>
                <hr className="border-dashed border-gray-200" />
                <div className="space-y-4">
                   <div>
                      <h2 className="text-lg font-bold text-gray-900">Languages</h2>
                      <p className="text-sm text-gray-500">Spoken and written languages</p>
                   </div>
                   <LanguageForm />
                </div>
                <hr className="border-dashed border-gray-200" />
                <div className="space-y-4">
                   <div>
                      <h2 className="text-lg font-bold text-gray-900">Certifications</h2>
                      <p className="text-sm text-gray-500">Professional licenses & certs</p>
                   </div>
                   <CertificationForm />
                </div>
             </div>
          )}

          {activeTab === "history" && (
             <div className="space-y-8 animate-in fade-in duration-300">
                <div className="space-y-4">
                   <div>
                      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><History className="h-4 w-4"/> Work Experience</h2>
                       <p className="text-sm text-gray-500">Past professional roles</p>
                   </div>
                   <ExperienceForm />
                </div>
                <hr className="border-dashed border-gray-200" />
                <div className="space-y-4">
                   <div>
                       <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"><GraduationCap className="h-4 w-4"/> Education</h2>
                       <p className="text-sm text-gray-500">Academic background</p>
                   </div>
                   <EducationForm />
                </div>
                <hr className="border-dashed border-gray-200" />
                <div className="space-y-4">
                   <div>
                       <h2 className="text-lg font-bold text-gray-900">Volunteering</h2>
                       <p className="text-sm text-gray-500">Community service & leadership</p>
                   </div>
                   <VolunteerForm />
                </div>
                <hr className="border-dashed border-gray-200" />
                <div className="space-y-4">
                   <div>
                       <h2 className="text-lg font-bold text-gray-900">Honors & Awards</h2>
                       <p className="text-sm text-gray-500">Achievements and recognition</p>
                   </div>
                   <AwardForm />
                </div>
             </div>
          )}

           {activeTab === "works" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                 <div>
                    <h2 className="text-lg font-bold text-gray-900">Selected Works</h2>
                    <p className="text-sm text-gray-500">Projects and achievements</p>
                 </div>
                 <ProjectsForm />
              </div>
           )}

           {activeTab === "ai-tools" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                 <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      AI-Powered Tools
                    </h2>
                    <p className="text-sm text-gray-500">Enhance your resume and LinkedIn profile with AI</p>
                 </div>
                 
                 <ApiKeySettings />
                 
                 <hr className="border-dashed border-gray-200" />
                 <JobOptimizerPanel />
                 <hr className="border-dashed border-gray-200" />
                 <ResumeAIPanel />
                 <hr className="border-dashed border-gray-200" />
                 <div>
                    <h3 className="text-md font-bold text-gray-900">LinkedIn Profile Optimizer</h3>
                    <p className="text-xs text-gray-500 mb-4">Get AI-powered suggestions to improve your LinkedIn presence</p>
                    <LinkedInAnalyzer />
                 </div>
              </div>
           )}
       </div>
    </div>
  );
}
