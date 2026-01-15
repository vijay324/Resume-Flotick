"use client";

import React from "react";
import { useResume } from "@/context/resume-context";

export function ResumePreview() {
  const { resumeData } = useResume();
  const { personalInfo, experience, education, skills, projects } = resumeData;

  return (
    
      <div 
        id="resume-preview" 
        className="bg-white shadow-none p-10 min-h-[297mm] w-[210mm] text-sm leading-relaxed text-gray-800"
        style={{ fontFamily: "'Times New Roman', Times, serif" }} 
      >
        {/* Header */}
        <div className="text-center border-b pb-4 mb-4">
          <h1 className="text-3xl font-bold uppercase tracking-wide mb-1">{personalInfo.fullName}</h1>
          {personalInfo.jobTitle && <p className="text-sm text-gray-600 font-medium uppercase tracking-widest mb-2">{personalInfo.jobTitle}</p>}
          <div className="flex justify-center gap-4 text-gray-600 text-xs flex-wrap">
             {personalInfo.phone && <span>{personalInfo.phone}</span>}
             {personalInfo.email && <span>{personalInfo.email}</span>}
             {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
             {personalInfo.github && <span>{personalInfo.github}</span>}
             {personalInfo.website && <span>{personalInfo.website}</span>}
             {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2">Professional Summary</h2>
            <p className="text-justify">{personalInfo.summary}</p>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2">Technical Skills</h2>
            <div className="flex flex-wrap gap-2">
                 <p><span className="font-semibold">Languages & Frameworks:</span> {skills.map(s => s.name).join(", ")}</p>
            </div>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
           <div className="mb-6">
             <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2">Work Experience</h2>
             {experience.map((exp) => (
               <div key={exp.id} className="mb-4">
                 <div className="flex justify-between items-baseline mb-1">
                   <h3 className="font-bold">{exp.position}</h3>
                   <span className="text-gray-600 italic text-xs">
                     {exp.startDate} – {exp.endDate}
                   </span>
                 </div>
                 <div className="flex justify-between items-baseline mb-1">
                   <span className="font-semibold text-gray-700">{exp.company}</span>
                   {exp.location && <span className="text-gray-500 text-xs">{exp.location}</span>}
                 </div>
                 <p className="whitespace-pre-line">{exp.description}</p>
               </div>
             ))}
           </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-6">
             <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2">Selected Projects</h2>
             {projects.map((proj) => (
                <div key={proj.id} className="mb-3">
                   <div className="flex items-baseline gap-2 mb-1">
                      <h3 className="font-bold">{proj.name}</h3>
                      {proj.link && <a href={`https://${proj.link}`} target="_blank" className="text-blue-600 hover:underline text-xs">{proj.link}</a>}
                      <span className="text-gray-500 text-xs">| {proj.technologies.join(", ")}</span>
                   </div>
                   <p>{proj.description}</p>
                </div>
             ))}
          </div>
        )}

         {/* Education */}
         {education.length > 0 && (
          <div className="mb-6">
             <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2">Education</h2>
             {education.map((edu) => (
                <div key={edu.id} className="flex justify-between mb-2">
                   <div>
                      <h3 className="font-bold">{edu.institution}</h3>
                      <p>{edu.degree} in {edu.field}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-gray-600 text-xs">{edu.startDate} – {edu.endDate}</p>
                      {edu.score && <p className="text-gray-500 text-xs">Score: {edu.score}</p>}
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
                   <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2">Certifications</h2>
                   <ul className="list-disc list-inside text-xs space-y-1">
                      {resumeData.certifications.map(cert => (
                         <li key={cert.id}>
                            <span className="font-semibold">{cert.name}</span> — {cert.issuer} <span className="text-gray-500">({cert.date})</span>
                         </li>
                      ))}
                   </ul>
                </div>
              )}
              
              {resumeData.languages.length > 0 && (
                <div>
                   <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2">Languages</h2>
                   <div className="text-xs space-y-1">
                      {resumeData.languages.map(lang => (
                         <div key={lang.id} className="flex justify-between">
                            <span className="font-semibold">{lang.name}</span>
                            <span className="text-gray-600">{lang.proficiency}</span>
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
             <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2">Volunteer Experience</h2>
             {resumeData.volunteer.map((vol) => (
               <div key={vol.id} className="mb-3">
                 <div className="flex justify-between items-baseline mb-1">
                   <h3 className="font-bold">{vol.role}</h3>
                   <span className="text-gray-600 italic text-xs">
                     {vol.startDate} – {vol.endDate}
                   </span>
                 </div>
                 <div className="flex justify-between items-baseline mb-1">
                   <span className="font-semibold text-gray-700">{vol.organization}</span>
                   {vol.location && <span className="text-gray-500 text-xs">{vol.location}</span>}
                 </div>
                 <p className="whitespace-pre-line">{vol.description}</p>
               </div>
             ))}
           </div>
        )}

        {/* Awards */}
        {resumeData.awards.length > 0 && (
           <div className="mb-6">
             <h2 className="text-sm font-bold uppercase border-b border-gray-300 mb-2">Honors & Awards</h2>
             <ul className="space-y-2">
                {resumeData.awards.map((award) => (
                   <li key={award.id}>
                      <div className="flex justify-between">
                         <span className="font-bold">{award.title}</span>
                         <span className="text-gray-600 text-xs">{award.date}</span>
                      </div>
                      <p className="text-xs text-gray-700">{award.issuer}</p>
                      {award.description && <p className="text-xs text-gray-600 mt-1">{award.description}</p>}
                   </li>
                ))}
             </ul>
           </div>
        )}

      </div>
  );
}
