"use client";

import React from "react";
import { useResume } from "@/context/resume-context";
import { Phone, Mail, Linkedin, Github, Globe, MapPin } from "lucide-react";
import type { ExperienceItem, EducationItem, SkillItem, ProjectItem, LanguageItem, CertificationItem, AwardItem, VolunteerItem } from "@/types/resume";

export function ResumePreview() {
  const { resumeData } = useResume();
  const { personalInfo, experience, education, skills, projects } = resumeData;

  const Separator = () => <span className="text-gray-400 mx-1">•</span>;

  return (
    
      <div 
        id="resume-preview" 
        className="bg-white shadow-none p-12 min-h-[297mm] w-[210mm] text-[13px] leading-[1.6] text-gray-900 print:min-h-0 print:h-auto print:shadow-none print:w-full"
        style={{ fontFamily: "'Times New Roman', Times, serif" }} 
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">{personalInfo.fullName}</h1>
          {personalInfo.jobTitle && (
            <p className="text-sm text-gray-600 font-normal mb-3 leading-tight max-w-2xl mx-auto">
              {personalInfo.jobTitle}
            </p>
          )}
          
          <div className="flex justify-center items-center gap-2 text-gray-700 text-[11px] flex-wrap">
             {personalInfo.phone && (
               <div className="flex items-center gap-1">
                 <Phone className="h-3 w-3" />
                 <span>{personalInfo.phone}</span>
               </div>
             )}
             {personalInfo.phone && personalInfo.email && <Separator />}
             {personalInfo.email && (
               <div className="flex items-center gap-1">
                 <Mail className="h-3 w-3" />
                 <span>{personalInfo.email}</span>
               </div>
             )}
             {(personalInfo.email || personalInfo.phone) && personalInfo.linkedin && <Separator />}
             {personalInfo.linkedin && (
               <div className="flex items-center gap-1">
                 <Linkedin className="h-3 w-3" />
                 <span>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
               </div>
             )}
             {personalInfo.linkedin && personalInfo.github && <Separator />}
             {personalInfo.github && (
               <div className="flex items-center gap-1">
                 <Github className="h-3 w-3" />
                 <span>{personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}</span>
               </div>
             )}
             {personalInfo.github && personalInfo.website && <Separator />}
             {personalInfo.website && (
               <div className="flex items-center gap-1">
                 <Globe className="h-3 w-3" />
                 <span>{personalInfo.website.replace(/^https?:\/\/(www\.)?/, "")}</span>
               </div>
             )}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-[13px] font-bold uppercase border-b border-gray-900 mb-2 pb-0.5 tracking-tight">Professional Summary</h2>
            <p className="text-justify">{personalInfo.summary}</p>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[13px] font-bold uppercase border-b border-gray-900 mb-2 pb-0.5 tracking-tight">Technical Skills</h2>
            <div className="text-[13px]">
                 <p><span className="font-bold">Skills:</span> {skills.map((s: SkillItem) => s.name).join(", ")}</p>
            </div>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
           <div className="mb-6">
             <h2 className="text-[13px] font-bold uppercase border-b border-gray-900 mb-2 pb-0.5 tracking-tight">Work Experience</h2>
             {experience.map((exp: ExperienceItem) => (
               <div key={exp.id} className="mb-4">
                 <div className="flex justify-between items-baseline">
                   <h3 className="font-bold text-[14px]">{exp.position}</h3>
                   <span className="font-bold text-[13px]">
                     {exp.startDate} – {exp.endDate}
                   </span>
                 </div>
                 <div className="flex justify-between items-baseline mb-1">
                   <span className="italic font-medium text-gray-800">{exp.company}</span>
                   {exp.location && <span className="italic text-gray-700">{exp.location}</span>}
                 </div>
                 <div className="text-justify whitespace-pre-line pl-4">
                    {exp.description.split('\n').map((line: string, i: number) => (
                      <div key={i} className="relative before:content-['•'] before:absolute before:-left-4">
                        {line.trim()}
                      </div>
                    ))}
                 </div>
               </div>
             ))}
           </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-6">
             <h2 className="text-[13px] font-bold uppercase border-b border-gray-900 mb-2 pb-0.5 tracking-tight">Selected Projects</h2>
             {projects.map((proj: ProjectItem) => (
                <div key={proj.id} className="mb-4">
                   <div className="flex justify-between items-baseline">
                      <div className="flex items-center gap-2">
                         <h3 className="font-bold text-[14px]">{proj.name}</h3>
                         {proj.link && <a href={`https://${proj.link}`} target="_blank" className="text-blue-600 hover:underline text-[11px] font-normal">{proj.link}</a>}
                      </div>
                      <div className="text-[12px] font-bold uppercase text-gray-600">
                         {proj.technologies.join(", ")}
                      </div>
                   </div>
                   <div className="text-justify mt-1">
                      {proj.description.split('\n').map((line: string, i: number) => (
                        <div key={i} className="pl-4 relative before:content-['•'] before:absolute before:-left-4">
                          {line.trim()}
                        </div>
                      ))}
                   </div>
                </div>
             ))}
          </div>
        )}

         {/* Education */}
         {education.length > 0 && (
          <div className="mb-6">
             <h2 className="text-[13px] font-bold uppercase border-b border-gray-900 mb-2 pb-0.5 tracking-tight">Education</h2>
             {education.map((edu: EducationItem) => (
                <div key={edu.id} className="flex justify-between mb-2">
                   <div>
                      <h3 className="font-bold">{edu.institution}</h3>
                      <p className="italic">{edu.degree} in {edu.field}</p>
                   </div>
                   <div className="text-right">
                      <p className="font-bold">{edu.startDate} – {edu.endDate}</p>
                      {edu.score && <p className="text-[12px]">Score: {edu.score}</p>}
                   </div>
                </div>
             ))}
          </div>
        )}

        {/* Certifications & Languages */}
        {(resumeData.certifications.length > 0 || resumeData.languages.length > 0) && (
           <div className="mb-6 grid grid-cols-2 gap-8">
              {resumeData.certifications.length > 0 && (
                <div>
                   <h2 className="text-[13px] font-bold uppercase border-b border-gray-900 mb-2 pb-0.5 tracking-tight">Certifications</h2>
                   <ul className="text-xs space-y-1">
                      {resumeData.certifications.map((cert: CertificationItem) => (
                         <li key={cert.id} className="pl-4 relative before:content-['•'] before:absolute before:-left-4">
                            <span className="font-bold">{cert.name}</span> — {cert.issuer} <span className="italic">({cert.date})</span>
                         </li>
                      ))}
                   </ul>
                </div>
              )}
              
              {resumeData.languages.length > 0 && (
                <div>
                   <h2 className="text-[13px] font-bold uppercase border-b border-gray-900 mb-2 pb-0.5 tracking-tight">Languages</h2>
                   <div className="text-xs space-y-1">
                      {resumeData.languages.map((lang: LanguageItem) => (
                         <div key={lang.id} className="flex justify-between italic">
                            <span>{lang.name}</span>
                            <span>{lang.proficiency}</span>
                         </div>
                      ))}
                   </div>
                </div>
              )}
           </div>
        )}

        {/* Volunteer Experience */}
        {resumeData.volunteer.length > 0 && (
           <div className="mb-6">
             <h2 className="text-[13px] font-bold uppercase border-b border-gray-900 mb-2 pb-0.5 tracking-tight">Volunteer Experience</h2>
             {resumeData.volunteer.map((vol: VolunteerItem) => (
               <div key={vol.id} className="mb-3">
                 <div className="flex justify-between items-baseline">
                   <h3 className="font-bold">{vol.role}</h3>
                   <span className="font-bold text-[12px]">
                     {vol.startDate} – {vol.endDate}
                   </span>
                 </div>
                 <div className="flex justify-between items-baseline mb-1">
                   <span className="italic text-gray-700">{vol.organization}</span>
                   {vol.location && <span className="italic text-gray-700">{vol.location}</span>}
                 </div>
                 <p className="text-justify">{vol.description}</p>
               </div>
             ))}
           </div>
        )}

        {/* Awards */}
        {resumeData.awards.length > 0 && (
           <div className="mb-6">
             <h2 className="text-[13px] font-bold uppercase border-b border-gray-900 mb-2 pb-0.5 tracking-tight">Honors & Awards</h2>
             <ul className="space-y-2">
                {resumeData.awards.map((award: AwardItem) => (
                   <li key={award.id} className="pl-4 relative before:content-['•'] before:absolute before:-left-4">
                      <div className="flex justify-between">
                         <span className="font-bold">{award.title}</span>
                         <span className="font-bold text-[12px]">{award.date}</span>
                      </div>
                      <p className="italic text-gray-700">{award.issuer}</p>
                      {award.description && <p className="text-gray-600 mt-1">{award.description}</p>}
                   </li>
                ))}
             </ul>
           </div>
        )}

      </div>
  );
}
