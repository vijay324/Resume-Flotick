"use client";

import React from "react";
import type { ResumeData, ExperienceItem, EducationItem, SkillItem, ProjectItem, LanguageItem, CertificationItem, AwardItem, VolunteerItem } from "@/types/resume";

interface TemplateProps {
  resumeData: ResumeData;
}

export function ProfessionalTemplate({ resumeData }: TemplateProps) {
  const { personalInfo, experience, education, skills, projects } = resumeData;

  return (
    <div 
      id="resume-preview" 
      className="resume-pages-container"
    >
      <div 
        className="resume-page bg-white shadow-none text-[10pt] leading-[1.4] text-black"
        style={{ 
          fontFamily: "Times New Roman, Times, serif",
          padding: "40px",
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
          minHeight: "297mm",
        }} 
      >
        {/* ===== HEADER ===== */}
        <div className="flex flex-col items-center border-b border-black pb-4 mb-5">
          <h1 className="text-2xl font-bold uppercase tracking-widest mb-1">
            {personalInfo.fullName}
          </h1>
          {personalInfo.jobTitle && (
            <p className="text-xs uppercase tracking-[0.2em] mb-2 font-medium">
              {personalInfo.jobTitle}
            </p>
          )}

          {/* Contact Row */}
          <div className="flex flex-wrap justify-center gap-x-3 text-[9pt]">
            {personalInfo.phone && (
              <div className="flex items-center">
                <a href={`tel:${personalInfo.phone}`} className="hover:underline">{personalInfo.phone}</a>
              </div>
            )}
            
            {personalInfo.email && (
              <>
                {personalInfo.phone && <span>|</span>}
                <div className="flex items-center">
                  <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
                </div>
              </>
            )}

            {personalInfo.location && (
              <>
                {(personalInfo.phone || personalInfo.email) && <span>|</span>}
                <div>{personalInfo.location}</div>
              </>
            )}

            {personalInfo.linkedin && (
              <>
                <span>|</span>
                <div className="flex items-center">
                  <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    linkedin.com/in/{personalInfo.linkedin.split('linkedin.com/in/')[1] || 'profile'}
                  </a>
                </div>
              </>
            )}

            {personalInfo.github && (
              <>
                <span>|</span>
                <div className="flex items-center">
                   <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    github.com/{personalInfo.github.split('github.com/')[1] || 'profile'}
                  </a>
                </div>
              </>
            )}

            {personalInfo.website && (
              <>
                <span>|</span>
                <div className="flex items-center">
                  <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {personalInfo.website.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ===== COLUMNS ===== */}
        <div className="flex gap-6">
          
          {/* ===== LEFT COLUMN (30%) ===== */}
          <div className="w-[30%] shrink-0">
            
            {/* Education */}
            {education.length > 0 && (
              <div className="mb-4 break-inside-avoid">
                 <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2 pb-0.5 tracking-wider">
                  Education
                </h2>
                <div className="space-y-3">
                  {education.map((edu: EducationItem) => (
                    <div key={edu.id}>
                      <div className="font-bold">{edu.institution}</div>
                      <div className="italic text-[10pt]">{edu.degree} in {edu.field}</div>
                      <div className="text-[9pt] text-right mt-0.5">{edu.startDate} – {edu.endDate}</div>
                      {edu.score && <div className="text-[9pt] mt-0.5">{edu.score}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

             {/* Skills */}
            {skills.length > 0 && (
              <div className="mb-4 break-inside-avoid">
                 <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2 pb-0.5 tracking-wider">
                  Skills
                </h2>
                <div className="space-y-1">
                  {skills.map((skill: SkillItem) => (
                    <div key={skill.id} className="text-[10pt]">
                      • {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {resumeData.languages.length > 0 && (
              <div className="mb-4 break-inside-avoid">
                 <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2 pb-0.5 tracking-wider">
                  Languages
                </h2>
                <div className="space-y-1">
                  {resumeData.languages.map((lang: LanguageItem) => (
                    <div key={lang.id} className="flex justify-between text-[10pt]">
                      <span className="font-bold">{lang.name}</span>
                      <span className="italic">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {resumeData.certifications.length > 0 && (
              <div className="mb-4 break-inside-avoid">
                  <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2 pb-0.5 tracking-wider">
                  Certifications
                </h2>
                <div className="space-y-3">
                  {resumeData.certifications.map((cert: CertificationItem) => (
                    <div key={cert.id}>
                      <div className="font-bold">{cert.name}</div>
                      <div className="text-[9pt]">{cert.issuer}</div>
                      <div className="text-[9pt] text-right">{cert.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

             {/* Awards */}
            {resumeData.awards.length > 0 && (
               <div className="mb-4 break-inside-avoid">
                 <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2 pb-0.5 tracking-wider">
                  Awards
                </h2>
                <div className="space-y-3">
                  {resumeData.awards.map((award: AwardItem) => (
                     <div key={award.id}>
                      <div className="font-bold">{award.title}</div>
                      <div className="text-[9pt]">{award.issuer}</div>
                      <div className="text-[9pt] text-right">{award.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ===== RIGHT COLUMN (70%) ===== */}
          <div className="w-[70%]">
             
             {/* Summary */}
            {personalInfo.summary && (
              <div className="mb-5 break-inside-avoid">
                 <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2 pb-0.5 tracking-wider">
                  Professional Summary
                </h2>
                <p className="text-justify">{personalInfo.summary}</p>
              </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <div className="mb-5">
                 <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2 pb-0.5 tracking-wider">
                  Professional Experience
                </h2>
                <div className="space-y-4">
                  {experience.map((exp: ExperienceItem) => (
                    <div key={exp.id} className="break-inside-avoid">
                      <div className="flex justify-between mb-1">
                        <div className="font-bold text-[10pt]">{exp.position}</div>
                        <div className="text-[9pt]">{exp.startDate} – {exp.endDate}</div>
                      </div>
                      <div className="flex justify-between mb-1">
                         <div className="italic text-[10pt]">{exp.company}</div>
                         <div className="italic text-[10pt]">{exp.location}</div>
                      </div>
                      <div className="text-[10pt]">
                        {exp.description.split('\n').map((line: string, i: number) => (
                          line.trim() && (
                            <div key={i} className="flex mb-0.5">
                              <span className="mr-2">•</span>
                              <span>{line.trim()}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <div className="mb-5">
                 <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2 pb-0.5 tracking-wider">
                  Projects
                </h2>
                <div className="space-y-4">
                  {projects.map((proj: ProjectItem) => (
                    <div key={proj.id} className="break-inside-avoid">
                       <div className="flex justify-between items-baseline mb-1">
                         <div className="flex items-center gap-2">
                            <span className="font-bold">{proj.name}</span>
                            {proj.link && (
                              <a href={proj.link} target="_blank" className="text-[9pt] border-l border-black pl-2 ml-1 hover:underline">
                                Link
                              </a>
                            )}
                         </div>
                       </div>
                       <div className="italic text-[9pt] mb-1">{proj.technologies.join(" • ")}</div>
                       <div className="text-[10pt]">
                        {proj.description.split('\n').map((line: string, i: number) => (
                          line.trim() && (
                            <div key={i} className="flex mb-0.5">
                              <span className="mr-2">•</span>
                              <span>{line.trim()}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
             )}

            {/* Volunteer */}
            {resumeData.volunteer.length > 0 && (
               <div className="mb-5">
                 <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2 pb-0.5 tracking-wider">
                  Volunteer
                </h2>
                 <div className="space-y-4">
                  {resumeData.volunteer.map((vol: VolunteerItem) => (
                    <div key={vol.id} className="break-inside-avoid">
                      <div className="flex justify-between mb-1">
                        <div className="font-bold text-[10pt]">{vol.organization}</div>
                        <div className="text-[9pt]">{vol.startDate} – {vol.endDate}</div>
                      </div>
                      <div className="italic text-[10pt] mb-1">{vol.role}</div>
                      <p className="text-[10pt]">{vol.description}</p>
                    </div>
                  ))}
                 </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
