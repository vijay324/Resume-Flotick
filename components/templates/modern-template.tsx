"use client";

import React from "react";
import type { ResumeData, ExperienceItem, EducationItem, SkillItem, ProjectItem, LanguageItem, CertificationItem, AwardItem, VolunteerItem } from "@/types/resume";
import { Phone, Mail, Linkedin, Github, Globe, MapPin } from "lucide-react";

interface TemplateProps {
  resumeData: ResumeData;
}

export function ModernTemplate({ resumeData }: TemplateProps) {
  const { personalInfo, experience, education, skills, projects } = resumeData;

  return (
    <div 
      id="resume-preview" 
      className="bg-white shadow-none min-h-[297mm] w-[210mm] text-[10pt] leading-[1.4] text-[#1a1a1a] print:min-h-0 print:h-auto print:shadow-none print:w-full"
      style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }} 
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] text-white px-8 py-6">
        <h1 className="text-[24pt] font-bold tracking-wide mb-1">{personalInfo.fullName}</h1>
        {personalInfo.jobTitle && (
          <p className="text-[12pt] text-blue-200 font-medium tracking-wider uppercase">
            {personalInfo.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-[9pt] text-gray-200">
          {personalInfo.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-blue-300" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-blue-300" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-blue-300" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin className="h-3.5 w-3.5 text-blue-300" />
              <span>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-1.5">
              <Github className="h-3.5 w-3.5 text-blue-300" />
              <span>{personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-blue-300" />
              <span>{personalInfo.website.replace(/^https?:\/\/(www\.)?/, "")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Two Column Body */}
      <div className="flex">
        {/* Left Content - 65% */}
        <div className="w-[65%] p-6 pr-4">
          {/* Summary */}
          {personalInfo.summary && (
            <div className="mb-5">
              <h2 className="text-[11pt] font-bold uppercase mb-2 pb-1 text-[#1e3a5f] flex items-center gap-2">
                <span className="w-8 h-0.5 bg-[#1e3a5f]"></span>
                About Me
              </h2>
              <p className="text-justify text-gray-700 text-[10pt] leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[11pt] font-bold uppercase mb-3 pb-1 text-[#1e3a5f] flex items-center gap-2">
                <span className="w-8 h-0.5 bg-[#1e3a5f]"></span>
                Work Experience
              </h2>
              {experience.map((exp: ExperienceItem, index: number) => (
                <div key={exp.id} className={`relative pl-4 ${index < experience.length - 1 ? 'pb-4 border-l-2 border-gray-200' : ''} break-inside-avoid`}>
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-[#1e3a5f] rounded-full"></div>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-[11pt] text-gray-900">{exp.position}</h3>
                    <span className="text-[9pt] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  <p className="text-[10pt] text-[#1e3a5f] font-semibold mb-1.5">
                    {exp.company} {exp.location && <span className="font-normal text-gray-500">• {exp.location}</span>}
                  </p>
                  <div className="text-[10pt] text-gray-700">
                    {exp.description.split('\n').map((line: string, i: number) => (
                      line.trim() && (
                        <div key={i} className="relative pl-3 mb-0.5 before:content-['–'] before:absolute before:left-0 before:text-gray-400">
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
              <h2 className="text-[11pt] font-bold uppercase mb-3 pb-1 text-[#1e3a5f] flex items-center gap-2">
                <span className="w-8 h-0.5 bg-[#1e3a5f]"></span>
                Projects
              </h2>
              {projects.map((proj: ProjectItem) => (
                <div key={proj.id} className="mb-3 break-inside-avoid">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-bold text-[10pt] text-gray-900">{proj.name}</h3>
                    {proj.link && (
                      <a href={proj.link} className="text-[8pt] text-[#1e3a5f] underline">
                        {proj.link.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 my-1">
                    {proj.technologies.map((tech: string, i: number) => (
                      <span key={i} className="text-[8pt] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="text-[10pt] text-gray-700">
                    {proj.description.split('\n').map((line: string, i: number) => (
                      line.trim() && (
                        <div key={i} className="relative pl-3 mb-0.5 before:content-['–'] before:absolute before:left-0 before:text-gray-400">
                          {line.trim()}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar - 35% */}
        <div className="w-[35%] bg-gray-50 p-6 pl-4">
          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[10pt] font-bold uppercase mb-3 text-[#1e3a5f]">Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill: SkillItem) => (
                  <span 
                    key={skill.id} 
                    className="text-[9pt] bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded shadow-sm"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[10pt] font-bold uppercase mb-3 text-[#1e3a5f]">Education</h2>
              {education.map((edu: EducationItem) => (
                <div key={edu.id} className="mb-3">
                  <h3 className="font-bold text-[10pt] text-gray-900">{edu.institution}</h3>
                  <p className="text-[9pt] text-gray-700">{edu.degree} in {edu.field}</p>
                  <p className="text-[8pt] text-gray-500">{edu.startDate} – {edu.endDate}</p>
                  {edu.score && <p className="text-[8pt] text-[#1e3a5f] font-medium">{edu.score}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {resumeData.languages.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[10pt] font-bold uppercase mb-3 text-[#1e3a5f]">Languages</h2>
              <div className="space-y-1.5">
                {resumeData.languages.map((lang: LanguageItem) => (
                  <div key={lang.id} className="flex justify-between text-[9pt]">
                    <span className="text-gray-800">{lang.name}</span>
                    <span className="text-gray-500">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resumeData.certifications.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[10pt] font-bold uppercase mb-3 text-[#1e3a5f]">Certifications</h2>
              {resumeData.certifications.map((cert: CertificationItem) => (
                <div key={cert.id} className="mb-2">
                  <p className="text-[9pt] font-medium text-gray-800">{cert.name}</p>
                  <p className="text-[8pt] text-gray-500">{cert.issuer} • {cert.date}</p>
                </div>
              ))}
            </div>
          )}

          {/* Awards */}
          {resumeData.awards.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[10pt] font-bold uppercase mb-3 text-[#1e3a5f]">Awards</h2>
              {resumeData.awards.map((award: AwardItem) => (
                <div key={award.id} className="mb-2">
                  <p className="text-[9pt] font-medium text-gray-800">{award.title}</p>
                  <p className="text-[8pt] text-gray-500">{award.issuer} • {award.date}</p>
                </div>
              ))}
            </div>
          )}

          {/* Volunteer */}
          {resumeData.volunteer.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[10pt] font-bold uppercase mb-3 text-[#1e3a5f]">Volunteer</h2>
              {resumeData.volunteer.map((vol: VolunteerItem) => (
                <div key={vol.id} className="mb-2">
                  <p className="text-[9pt] font-medium text-gray-800">{vol.organization}</p>
                  <p className="text-[8pt] text-gray-700 italic">{vol.role}</p>
                  <p className="text-[8pt] text-gray-500">{vol.startDate} – {vol.endDate}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
