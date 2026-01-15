"use client";

import React from "react";
import type { ResumeData, ExperienceItem, EducationItem, SkillItem, ProjectItem, LanguageItem, CertificationItem, AwardItem, VolunteerItem } from "@/types/resume";
import { Phone, Mail, Linkedin, Github, Globe, MapPin } from "lucide-react";

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
        className="resume-page bg-white shadow-none text-[10pt] leading-[1.4] text-[#1a1a1a]"
        style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }} 
      >
        {/* Two Column Layout */}
        <div className="flex min-h-[297mm]">
          {/* Left Sidebar - 30% */}
          <div className="w-[30%] bg-[#2c3e50] text-white p-6">
            {/* Name & Title */}
            <div className="mb-6 pb-4 border-b border-white/20 break-inside-avoid">
              <h1 className="text-[18pt] font-bold leading-tight mb-1">{personalInfo.fullName}</h1>
              {personalInfo.jobTitle && (
                <p className="text-[10pt] text-gray-300 uppercase tracking-wider font-medium">
                  {personalInfo.jobTitle}
                </p>
              )}
            </div>
            
            {/* Contact */}
            <div className="mb-6 break-inside-avoid">
              <h2 className="text-[9pt] font-bold uppercase tracking-wider mb-3 text-gray-300">Contact</h2>
              <div className="space-y-2 text-[9pt]">
                {personalInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-gray-400 shrink-0" />
                    <span className="break-words">{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-gray-400 shrink-0" />
                    <span className="break-words">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                    <span>{personalInfo.location}</span>
                  </div>
                )}
                {personalInfo.linkedin && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-3 w-3 text-gray-400 shrink-0" />
                    <span className="break-words">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
                  </div>
                )}
                {personalInfo.github && (
                  <div className="flex items-center gap-2">
                    <Github className="h-3 w-3 text-gray-400 shrink-0" />
                    <span className="break-words">{personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}</span>
                  </div>
                )}
                {personalInfo.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-3 w-3 text-gray-400 shrink-0" />
                    <span className="break-words">{personalInfo.website.replace(/^https?:\/\/(www\.)?/, "")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mb-6 break-inside-avoid">
                <h2 className="text-[9pt] font-bold uppercase tracking-wider mb-3 text-gray-300">Skills</h2>
                <div className="space-y-1.5">
                  {skills.map((skill: SkillItem) => (
                    <div key={skill.id} className="text-[9pt]">
                      <span>{skill.name}</span>
                      {skill.level && (
                        <span className="text-gray-400 text-[8pt] ml-1">• {skill.level}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {resumeData.languages.length > 0 && (
              <div className="mb-6 break-inside-avoid">
                <h2 className="text-[9pt] font-bold uppercase tracking-wider mb-3 text-gray-300">Languages</h2>
                <div className="space-y-1">
                  {resumeData.languages.map((lang: LanguageItem) => (
                    <p key={lang.id} className="text-[9pt]">
                      {lang.name} <span className="text-gray-400">({lang.proficiency})</span>
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {resumeData.certifications.length > 0 && (
              <div className="mb-6 break-inside-avoid">
                <h2 className="text-[9pt] font-bold uppercase tracking-wider mb-3 text-gray-300">Certifications</h2>
                <div className="space-y-2">
                  {resumeData.certifications.map((cert: CertificationItem) => (
                    <div key={cert.id} className="text-[9pt]">
                      <p className="font-medium">{cert.name}</p>
                      <p className="text-gray-400 text-[8pt]">{cert.issuer} • {cert.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Content - 70% */}
          <div className="w-[70%] p-8">
            {/* Summary */}
            {personalInfo.summary && (
              <div className="mb-5 break-inside-avoid">
                <h2 className="text-[11pt] font-bold uppercase border-b-2 border-[#2c3e50] mb-2.5 pb-1 tracking-wider text-[#2c3e50]">Profile</h2>
                <p className="text-justify text-gray-700 text-[10pt]">{personalInfo.summary}</p>
              </div>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <div className="mb-5">
                <h2 className="text-[11pt] font-bold uppercase border-b-2 border-[#2c3e50] mb-3 pb-1 tracking-wider text-[#2c3e50]">Experience</h2>
                {experience.map((exp: ExperienceItem) => (
                  <div key={exp.id} className="mb-4 break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-[11pt] text-gray-900">{exp.position}</h3>
                      <span className="text-[9pt] text-gray-600 font-medium whitespace-nowrap">
                        {exp.startDate} – {exp.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="font-semibold text-[#2c3e50] text-[10pt]">{exp.company}</span>
                      {exp.location && <span className="text-gray-500 text-[9pt] italic">{exp.location}</span>}
                    </div>
                    <div className="text-[10pt] text-gray-700">
                      {exp.description.split('\n').map((line: string, i: number) => (
                        line.trim() && (
                          <div key={i} className="relative pl-4 mb-0.5 before:content-['▸'] before:absolute before:left-0 before:text-[#2c3e50] before:text-[8pt]">
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
              <div className="mb-5">
                <h2 className="text-[11pt] font-bold uppercase border-b-2 border-[#2c3e50] mb-3 pb-1 tracking-wider text-[#2c3e50]">Projects</h2>
                {projects.map((proj: ProjectItem) => (
                  <div key={proj.id} className="mb-3 break-inside-avoid">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <h3 className="font-bold text-[10pt] text-gray-900">{proj.name}</h3>
                      {proj.link && (
                        <span className="text-[8pt] text-gray-500">
                          | <a href={proj.link} className="underline">{proj.link.replace(/^https?:\/\//, "")}</a>
                        </span>
                      )}
                    </div>
                    <p className="text-[9pt] text-[#2c3e50] italic mb-1">{proj.technologies.join(" • ")}</p>
                    <div className="text-[10pt] text-gray-700">
                      {proj.description.split('\n').map((line: string, i: number) => (
                        line.trim() && (
                          <div key={i} className="relative pl-4 mb-0.5 before:content-['▸'] before:absolute before:left-0 before:text-[#2c3e50] before:text-[8pt]">
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
              <div className="mb-5">
                <h2 className="text-[11pt] font-bold uppercase border-b-2 border-[#2c3e50] mb-3 pb-1 tracking-wider text-[#2c3e50]">Education</h2>
                {education.map((edu: EducationItem) => (
                  <div key={edu.id} className="flex justify-between mb-2 break-inside-avoid">
                    <div>
                      <h3 className="font-bold text-[10pt] text-gray-900">{edu.institution}</h3>
                      <p className="text-[10pt] text-gray-700">{edu.degree} in {edu.field}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9pt] text-gray-600 font-medium">{edu.startDate} – {edu.endDate}</p>
                      {edu.score && <p className="text-[9pt] text-gray-500 italic">{edu.score}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Volunteer */}
            {resumeData.volunteer.length > 0 && (
              <div className="mb-5">
                <h2 className="text-[11pt] font-bold uppercase border-b-2 border-[#2c3e50] mb-3 pb-1 tracking-wider text-[#2c3e50]">Volunteer</h2>
                {resumeData.volunteer.map((vol: VolunteerItem) => (
                  <div key={vol.id} className="mb-2 break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-[10pt] text-gray-900">{vol.organization}</h3>
                      <span className="text-[9pt] text-gray-600">{vol.startDate} – {vol.endDate}</span>
                    </div>
                    <p className="text-[10pt] text-gray-700 italic">{vol.role}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Awards */}
            {resumeData.awards.length > 0 && (
              <div className="mb-5">
                <h2 className="text-[11pt] font-bold uppercase border-b-2 border-[#2c3e50] mb-3 pb-1 tracking-wider text-[#2c3e50]">Awards</h2>
                {resumeData.awards.map((award: AwardItem) => (
                  <div key={award.id} className="flex justify-between mb-1.5 break-inside-avoid">
                    <span className="font-medium text-[10pt]">{award.title} <span className="text-gray-500 font-normal">— {award.issuer}</span></span>
                    <span className="text-[9pt] text-gray-500">{award.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
