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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
    <div className="flex flex-col h-full bg-transparent">
       {/* Tab Navigation */}
       <div className="flex items-center gap-2 px-6 py-4 border-b border-border overflow-x-auto no-scrollbar bg-transparent backdrop-blur-sm sticky top-0 z-10 w-full">
          {tabs.map((tab) => {
             const Icon = tab.icon;
             const isActive = activeTab === tab.id;
             return (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={cn(
                    "relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-300 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive 
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                 )}
               >
                 <Icon className={`h-3.5 w-3.5 ${isActive ? "text-primary-foreground/90" : ""}`} />
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
                   <h2 className="text-xl font-bold text-foreground tracking-tight">Personal Identity</h2>
                   <p className="text-sm text-muted-foreground font-medium">Contact details and professional title</p>
                </div>
                <ATSScore />
                <PersonalInfoForm />
             </div>
          )}

          {activeTab === "toolkit" && (
             <div className="space-y-8 animate-in fade-in duration-300">
                <div className="space-y-4">
                   <div>
                      <h2 className="text-lg font-bold text-zinc-900">Technical Skills</h2>
                      <p className="text-sm text-zinc-500">Highlight your technical expertise</p>
                   </div>
                   <SkillsForm />
                </div>
                <hr className="border-dashed border-zinc-200" />
                <div className="space-y-4">
                   <div>
                      <h2 className="text-lg font-bold text-zinc-900">Certifications</h2>
                      <p className="text-sm text-zinc-500">Professional licenses & certs</p>
                   </div>
                   <CertificationForm />
                </div>
                <hr className="border-dashed border-zinc-200" />
                <div className="space-y-4">
                   <div>
                      <h2 className="text-lg font-bold text-zinc-900">Languages</h2>
                      <p className="text-sm text-zinc-500">Spoken and written languages</p>
                   </div>
                   <LanguageForm />
                </div>
                
             </div>
          )}

          {activeTab === "history" && (
             <div className="space-y-8 animate-in fade-in duration-300">
                <div className="space-y-4">
                   <div>
                      <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2"><History className="h-4 w-4"/> Work Experience</h2>
                       <p className="text-sm text-zinc-500">Past professional roles</p>
                   </div>
                   <ExperienceForm />
                </div>
                <hr className="border-dashed border-zinc-200" />
                <div className="space-y-4">
                   <div>
                       <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2"><GraduationCap className="h-4 w-4"/> Education</h2>
                       <p className="text-sm text-zinc-500">Academic background</p>
                   </div>
                   <EducationForm />
                </div>
                <hr className="border-dashed border-zinc-200" />
                <div className="space-y-4">
                   <div>
                       <h2 className="text-lg font-bold text-zinc-900">Volunteering</h2>
                       <p className="text-sm text-zinc-500">Community service & leadership</p>
                   </div>
                   <VolunteerForm />
                </div>
                <hr className="border-dashed border-zinc-200" />
                <div className="space-y-4">
                   <div>
                       <h2 className="text-lg font-bold text-zinc-900">Honors & Awards</h2>
                       <p className="text-sm text-zinc-500">Achievements and recognition</p>
                   </div>
                   <AwardForm />
                </div>
             </div>
          )}

           {activeTab === "works" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                 <div>
                    <h2 className="text-lg font-bold text-zinc-900">Selected Works</h2>
                    <p className="text-sm text-zinc-500">Projects and achievements</p>
                 </div>
                 <ProjectsForm />
              </div>
           )}

           {activeTab === "ai-tools" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                 <div>
                    <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-600" />
                      AI-Powered Tools
                    </h2>
                    <p className="text-sm text-zinc-500">Enhance your resume and LinkedIn profile with AI</p>
                 </div>
                 
                 <ApiKeySettings />
                 
                 <Tabs defaultValue="tailor" className="w-full">
                   <TabsList className="grid w-full grid-cols-3 mb-6 bg-zinc-100/80 p-1.5 h-auto gap-2 rounded-xl">
                     <TabsTrigger value="tailor" className="gap-2 py-2.5 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-zinc-200/50">
                       <Briefcase className="w-4 h-4" />
                       <span className="hidden sm:inline">Tailor Resume</span>
                       <span className="sm:hidden">Tailor</span>
                     </TabsTrigger>
                     <TabsTrigger value="analyze" className="gap-2 py-2.5 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-zinc-200/50">
                       <Sparkles className="w-4 h-4" />
                       <span className="hidden sm:inline">Analysis</span>
                       <span className="sm:hidden">Analyze</span>
                     </TabsTrigger>
                     <TabsTrigger value="linkedin" className="gap-2 py-2.5 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-zinc-200/50">
                       <span className="font-bold text-blue-600 bg-white rounded flex items-center justify-center w-4 h-4 leading-none text-xs">in</span>
                       <span className="hidden sm:inline">LinkedIn</span>
                       <span className="sm:hidden">Profile</span>
                     </TabsTrigger>
                   </TabsList>

                   <TabsContent value="tailor" className="mt-0 focus-visible:outline-none">
                     <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-sm font-semibold text-zinc-700">Optimize for a specific job description</h3>
                     </div>
                     <JobOptimizerPanel />
                   </TabsContent>
                   
                   <TabsContent value="analyze" className="mt-0 focus-visible:outline-none">
                     <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-sm font-semibold text-zinc-700">Get detailed feedback and scoring</h3>
                     </div>
                     <ResumeAIPanel />
                   </TabsContent>
                   
                   <TabsContent value="linkedin" className="mt-0 focus-visible:outline-none">
                     <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-sm font-semibold text-zinc-700">Optimize your LinkedIn profile</h3>
                     </div>
                     <LinkedInAnalyzer />
                   </TabsContent>
                 </Tabs>
              </div>
           )}
       </div>
    </div>
  );
}
