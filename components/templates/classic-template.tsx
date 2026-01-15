"use client";

import React from "react";
import type { ResumeData, ExperienceItem, EducationItem, SkillItem, ProjectItem, LanguageItem, CertificationItem, AwardItem, VolunteerItem } from "@/types/resume";
import { Phone, Mail, Linkedin, Github, Globe, MapPin } from "lucide-react";

interface TemplateProps {
  resumeData: ResumeData;
}

export function ClassicTemplate({ resumeData }: TemplateProps) {
  const { personalInfo, experience, education, skills, projects } = resumeData;

  const Separator = () => <span className="text-gray-300 mx-2">•</span>;

  return (
    <div 
      id="resume-preview" 
      className="resume-pages-container"
    >
      <div 
        className="resume-page bg-white shadow-none p-[40px] md:p-[50px] text-[10.5pt] leading-[1.45] text-[#1a1a1a]"
        style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }} 
      >
        {/* Header */}
        <div className="text-center mb-6 break-inside-avoid">
          <h1 className="text-[28pt] font-serif uppercase tracking-wide text-black mb-1.5">{personalInfo.fullName}</h1>
          {personalInfo.jobTitle && (
            <p className="text-[11pt] text-gray-600 uppercase tracking-widest font-medium mb-3">
              {personalInfo.jobTitle}
            </p>
          )}
          
          <div className="flex justify-center items-center flex-wrap text-[9pt] text-gray-600 mt-2 gap-y-1">
             {personalInfo.phone && (
               <div className="flex items-center gap-1">
                 <Phone className="h-3 w-3 text-gray-500" />
                 <span className="text-gray-900 font-medium">{personalInfo.phone}</span>
               </div>
             )}
             {personalInfo.phone && personalInfo.email && <Separator />}
             {personalInfo.email && (
               <div className="flex items-center gap-1">
                 <Mail className="h-3 w-3 text-gray-500" />
                 <span className="text-gray-900 font-medium">{personalInfo.email}</span>
               </div>
             )}
             {(personalInfo.email || personalInfo.phone) && personalInfo.location && <Separator />}
             {personalInfo.location && (
               <div className="flex items-center gap-1">
                 <MapPin className="h-3 w-3 text-gray-500" />
                 <span className="text-gray-900 font-medium">{personalInfo.location}</span>
               </div>
             )}
          </div>

          {/* Second row for links */}
          {(personalInfo.linkedin || personalInfo.github || personalInfo.website) && (
            <div className="flex justify-center items-center flex-wrap text-[9pt] text-gray-600 mt-1.5 gap-y-1">
               {personalInfo.linkedin && (
                 <div className="flex items-center gap-1">
                   <Linkedin className="h-3 w-3 text-gray-500" />
                   <span className="text-gray-900 underline decoration-gray-300 underline-offset-2">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
                 </div>
               )}
               {personalInfo.linkedin && personalInfo.github && <Separator />}
               {personalInfo.github && (
                 <div className="flex items-center gap-1">
                   <Github className="h-3 w-3 text-gray-500" />
                   <span className="text-gray-900 underline decoration-gray-300 underline-offset-2">{personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}</span>
                 </div>
               )}
               {(personalInfo.linkedin || personalInfo.github) && personalInfo.website && <Separator />}
               {personalInfo.website && (
                 <div className="flex items-center gap-1">
                   <Globe className="h-3 w-3 text-gray-500" />
                   <span className="text-gray-900 underline decoration-gray-300 underline-offset-2">{personalInfo.website.replace(/^https?:\/\/(www\.)?/, "")}</span>
                 </div>
               )}
            </div>
          )}
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-6 break-inside-avoid">
            <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2.5 pb-0.5 tracking-wider text-black">Professional Summary</h2>
            <p className="text-justify text-gray-800">{personalInfo.summary}</p>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6 break-inside-avoid">
             <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2.5 pb-0.5 tracking-wider text-black">Skills</h2>
            <div className="text-[10.5pt]">
                 <p className="leading-relaxed"><span className="font-bold text-black">Technical Proficiency:</span> {skills.map((s: SkillItem) => s.name).join(" • ")}</p>
            </div>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
           <div className="mb-6">
             <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-3 pb-0.5 tracking-wider text-black">Work Experience</h2>
             {experience.map((exp: ExperienceItem) => (
               <div key={exp.id} className="mb-4 break-inside-avoid">
                 <div className="flex justify-between items-baseline mb-0.5">
                   <h3 className="font-bold text-[12pt] text-black">{exp.position}</h3>
                   <span className="text-[10pt] font-medium text-gray-700 whitespace-nowrap">
                     {exp.startDate} – {exp.endDate}
                   </span>
                 </div>
                 <div className="flex justify-between items-baseline mb-2 text-[10.5pt]">
                   <span className="font-semibold italic text-gray-800">{exp.company}</span>
                   {exp.location && <span className="italic text-gray-600 text-[10pt]">{exp.location}</span>}
                 </div>
                 <div className="text-justify pl-3 text-gray-800">
                    {exp.description.split('\n').map((line: string, i: number) => (
                      line.trim() && (
                        <div key={i} className="relative pl-3 mb-1 before:content-['•'] before:absolute before:-left-1 before:text-gray-500">
                           {line.trim()}
                        </div>
                      )
                    ))}
                 </div>
               </div>
             ))}
           </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-6">
             <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-3 pb-0.5 tracking-wider text-black">Projects</h2>
             {projects.map((proj: ProjectItem) => (
                <div key={proj.id} className="mb-4 break-inside-avoid">
                   <div className="flex justify-between items-baseline mb-1">
                      <div className="flex items-center gap-2">
                         <h3 className="font-bold text-[11pt] text-black">{proj.name}</h3>
                         {proj.link && <span className="text-[9pt] text-gray-500 font-normal">| <a href={proj.link} className="underline hover:text-black">{proj.link.replace(/^https?:\/\//, "")}</a></span>}
                      </div>
                   </div>
                   <div className="mb-1.5 text-[10pt] text-gray-600 font-medium italic">
                      Technologies: {proj.technologies.join(", ")}
                   </div>
                   <div className="text-justify pl-3 text-gray-800">
                      {proj.description.split('\n').map((line: string, i: number) => (
                        line.trim() && (
                           <div key={i} className="relative pl-3 mb-1 before:content-['•'] before:absolute before:-left-1 before:text-gray-500">
                             {line.trim()}
                           </div>
                        )
                      ))}
                   </div>
                </div>
             ))}
          </div>
        )}

         {/* Education */}
         {education.length > 0 && (
          <div className="mb-6">
             <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-3 pb-0.5 tracking-wider text-black">Education</h2>
             {education.map((edu: EducationItem) => (
                <div key={edu.id} className="flex justify-between mb-3 break-inside-avoid">
                   <div>
                      <h3 className="font-bold text-[11pt] text-black">{edu.institution}</h3>
                      <p className="font-medium text-gray-800">{edu.degree} in {edu.field}</p>
                   </div>
                   <div className="text-right">
                      <p className="font-medium text-gray-700">{edu.startDate} – {edu.endDate}</p>
                      {edu.score && <p className="text-[10pt] text-gray-600 italic">Score: {edu.score}</p>}
                   </div>
                </div>
             ))}
          </div>
        )}

        {/* Certifications & Languages */}
        {(resumeData.certifications.length > 0 || resumeData.languages.length > 0) && (
           <div className="mb-6 grid grid-cols-1 gap-6">
              {resumeData.certifications.length > 0 && (
                <div className="break-inside-avoid">
                   <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-3 pb-0.5 tracking-wider text-black">Certifications</h2>
                   <div className="grid grid-cols-1 gap-1">
                      {resumeData.certifications.map((cert: CertificationItem) => (
                         <div key={cert.id} className="flex justify-between text-[10.5pt]">
                            <span className="font-semibold text-gray-900">{cert.name} <span className="text-gray-500 font-normal italic mx-1">— {cert.issuer}</span></span>
                            <span className="text-gray-600 text-[10pt]">{cert.date}</span>
                         </div>
                      ))}
                   </div>
                </div>
              )}
              
              {resumeData.languages.length > 0 && (
                <div className="break-inside-avoid">
                   <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-3 pb-0.5 tracking-wider text-black">Languages</h2>
                   <p className="text-[10.5pt] text-gray-800">
                      {resumeData.languages.map((lang: LanguageItem) => (
                         `${lang.name} (${lang.proficiency})`
                      )).join(" • ")}
                   </p>
                </div>
              )}
           </div>
        )}

        {/* Volunteer Experience */}
        {resumeData.volunteer.length > 0 && (
           <div className="mb-6">
             <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-3 pb-0.5 tracking-wider text-black">Volunteer Experience</h2>
             {resumeData.volunteer.map((vol: VolunteerItem) => (
               <div key={vol.id} className="mb-3 break-inside-avoid">
                 <div className="flex justify-between items-baseline">
                   <h3 className="font-bold text-[11pt] text-black">{vol.organization}</h3>
                   <span className="font-medium text-gray-700 text-[10pt]">
                     {vol.startDate} – {vol.endDate}
                   </span>
                 </div>
                 <div className="flex justify-between items-baseline mb-1">
                   <span className="italic font-medium text-gray-800">{vol.role}</span>
                   {vol.location && <span className="italic text-gray-600 text-[10pt]">{vol.location}</span>}
                 </div>
                 <p className="text-justify text-gray-800 text-[10pt]">{vol.description}</p>
               </div>
             ))}
           </div>
        )}

        {/* Awards */}
        {resumeData.awards.length > 0 && (
           <div className="mb-6">
             <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-3 pb-0.5 tracking-wider text-black">Honors & Awards</h2>
             <div className="space-y-2">
                {resumeData.awards.map((award: AwardItem) => (
                   <div key={award.id} className="flex justify-between break-inside-avoid">
                      <div className="max-w-[80%]">
                          <span className="font-bold text-gray-900">{award.title}</span> <span className="text-gray-600 italic">— {award.issuer}</span>
                          {award.description && <p className="text-[10pt] text-gray-600 mt-0.5">{award.description}</p>}
                      </div>
                      <span className="text-[10pt] text-gray-600 whitespace-nowrap">{award.date}</span>
                   </div>
                ))}
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
