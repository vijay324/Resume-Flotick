"use client";

import React from "react";
import type {
  ResumeData,
  ExperienceItem,
  EducationItem,
  SkillItem,
  ProjectItem,
  LanguageItem,
  CertificationItem,
} from "@/types/resume";

interface TemplateProps {
  resumeData: ResumeData;
}

/**
 * ATS-Optimized Professional Resume Template
 * 
 * Design principles:
 * - Single-column layout for 100% ATS compatibility
 * - No icons or graphics that break text extraction
 * - Industry-standard section ordering
 * - Clear visual hierarchy for 6-8 second recruiter scan
 * - Pixel-perfect alignment with PDF export
 */
export function AtsTemplate({ resumeData }: TemplateProps) {
  const { personalInfo, experience, education, skills, projects, languages, certifications } = resumeData;

  // Text separator for contact info (ATS-friendly, no icons)
  const Separator = () => <span className="text-gray-400 mx-2">|</span>;

  return (
    <div 
      id="resume-preview" 
      className="resume-pages-container"
    >
      <div 
        className="resume-page bg-white shadow-none text-[10pt] leading-[1.35] text-[#1f2937]"
        style={{ 
          fontFamily: "Georgia, 'Times New Roman', Times, serif",
          paddingTop: "30px",
          paddingBottom: "30px",
          paddingLeft: "35px",
          paddingRight: "35px",
        }} 
      >
        {/* ===== HEADER SECTION ===== */}
        <header className="text-center mb-3 break-inside-avoid">
          {/* Name */}
          <h1 className="text-[22pt] font-bold tracking-wide text-black mb-0.5">
            {personalInfo.fullName}
          </h1>
          
          {/* Job Title */}
          {personalInfo.jobTitle && (
            <p className="text-[11pt] text-gray-600 font-medium mb-2">
              {personalInfo.jobTitle}
            </p>
          )}
          
          {/* Contact Info - Single line, pipe-separated (ATS-friendly) */}
          <div className="text-[9pt] text-gray-700 flex flex-wrap justify-center items-center">
            {personalInfo.phone && (
              <a 
                href={`tel:${personalInfo.phone}`} 
                className="text-gray-800 hover:text-blue-600 transition-colors"
              >
                {personalInfo.phone}
              </a>
            )}
            {personalInfo.phone && personalInfo.email && <Separator />}
            {personalInfo.email && (
              <a 
                href={`mailto:${personalInfo.email}`} 
                className="text-gray-800 hover:text-blue-600 transition-colors"
              >
                {personalInfo.email}
              </a>
            )}
            {(personalInfo.phone || personalInfo.email) && personalInfo.location && <Separator />}
            {personalInfo.location && (
              <span className="text-gray-800">{personalInfo.location}</span>
            )}
          </div>
          
          {/* Links Row */}
          {(personalInfo.linkedin || personalInfo.github || personalInfo.website) && (
            <div className="text-[9pt] text-gray-600 flex flex-wrap justify-center items-center mt-1">
              {personalInfo.linkedin && (
                <a 
                  href={personalInfo.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-blue-600 transition-colors underline underline-offset-2"
                >
                  {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              )}
              {personalInfo.linkedin && personalInfo.github && <Separator />}
              {personalInfo.github && (
                <a 
                  href={personalInfo.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-blue-600 transition-colors underline underline-offset-2"
                >
                  {personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              )}
              {(personalInfo.linkedin || personalInfo.github) && personalInfo.website && <Separator />}
              {personalInfo.website && (
                <a 
                  href={personalInfo.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-blue-600 transition-colors underline underline-offset-2"
                >
                  {personalInfo.website.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              )}
            </div>
          )}
        </header>

        {/* ===== PROFESSIONAL SUMMARY ===== */}
        {personalInfo.summary && (
          <section className="mb-3 break-inside-avoid">
            <h2 className="text-[10pt] font-bold uppercase border-b border-black mb-1.5 pb-0.5 tracking-wider text-black">
              Professional Summary
            </h2>
            <p className="text-justify text-gray-800 leading-snug text-[9.5pt]">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* ===== SKILLS ===== */}
        {skills.length > 0 && (
          <section className="mb-3 break-inside-avoid">
            <h2 className="text-[10pt] font-bold uppercase border-b border-black mb-1.5 pb-0.5 tracking-wider text-black">
              Skills
            </h2>
            <p className="text-gray-800 leading-snug text-[9.5pt]">
              <span className="font-bold text-black">Technical Skills: </span>
              {skills.map((s: SkillItem, i: number) => (
                <span key={s.id}>
                  {s.name}
                  {s.level && <span className="text-gray-500 text-[8.5pt]"> ({s.level})</span>}
                  {i < skills.length - 1 && <span className="text-gray-400"> • </span>}
                </span>
              ))}
            </p>
          </section>
        )}

        {/* ===== WORK EXPERIENCE ===== */}
        {experience.length > 0 && (
          <section className="mb-3">
            <h2 className="text-[10pt] font-bold uppercase border-b border-black mb-2 pb-0.5 tracking-wider text-black">
              Professional Experience
            </h2>
            {experience.map((exp: ExperienceItem) => (
              <article key={exp.id} className="mb-3 break-inside-avoid">
                {/* Position and Date */}
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-[10pt] text-black">{exp.position}</h3>
                  <span className="text-[9pt] text-gray-600 font-medium whitespace-nowrap ml-4">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {/* Company and Location */}
                <div className="flex justify-between items-baseline mb-1 text-[9.5pt]">
                  <span className="font-semibold italic text-gray-700">{exp.company}</span>
                  {exp.location && (
                    <span className="text-gray-500 italic text-[9pt]">{exp.location}</span>
                  )}
                </div>
                {/* Description bullets */}
                <div className="text-gray-800 ml-1.5 text-[9.5pt]">
                  {exp.description.split('\n').map((line: string, i: number) => (
                    line.trim() && (
                      <div 
                        key={i} 
                        className="relative pl-3 mb-0.5 before:content-['•'] before:absolute before:left-0 before:text-gray-600"
                      >
                        {line.trim()}
                      </div>
                    )
                  ))}
                </div>
              </article>
            ))}
          </section>
        )}

        {/* ===== PROJECTS ===== */}
        {projects.length > 0 && (
          <section className="mb-3">
            <h2 className="text-[10pt] font-bold uppercase border-b border-black mb-2 pb-0.5 tracking-wider text-black">
              Projects
            </h2>
            {projects.map((proj: ProjectItem) => (
              <article key={proj.id} className="mb-2 break-inside-avoid">
                {/* Project name and link */}
                <div className="flex items-baseline gap-1">
                  <h3 className="font-bold text-[10pt] text-black">{proj.name}</h3>
                  {proj.link && (
                    <span className="text-[8.5pt] text-gray-500">
                      | <a 
                          href={proj.link} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-blue-600"
                        >
                          {proj.link.replace(/^https?:\/\//, "")}
                        </a>
                    </span>
                  )}
                </div>
                {/* Technologies */}
                {proj.technologies.length > 0 && (
                  <p className="text-[9pt] text-gray-600 italic mb-0.5">
                    Technologies: {proj.technologies.join(", ")}
                  </p>
                )}
                {/* Description bullets */}
                <div className="text-gray-800 ml-1.5 text-[9.5pt]">
                  {proj.description.split('\n').map((line: string, i: number) => (
                    line.trim() && (
                      <div 
                        key={i} 
                        className="relative pl-3 mb-0.5 before:content-['•'] before:absolute before:left-0 before:text-gray-600"
                      >
                        {line.trim()}
                      </div>
                    )
                  ))}
                </div>
              </article>
            ))}
          </section>
        )}

        {/* ===== EDUCATION ===== */}
        {education.length > 0 && (
          <section className="mb-3">
            <h2 className="text-[10pt] font-bold uppercase border-b border-black mb-2 pb-0.5 tracking-wider text-black">
              Education
            </h2>
            {education.map((edu: EducationItem) => (
              <article key={edu.id} className="flex justify-between items-start mb-1.5 break-inside-avoid">
                <div>
                  <h3 className="font-bold text-[10pt] text-black">{edu.institution}</h3>
                  <p className="text-[9.5pt] text-gray-700">
                    {edu.degree} in {edu.field}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9pt] text-gray-600 font-medium">
                    {edu.startDate} – {edu.current ? "Present" : edu.endDate}
                  </p>
                  {edu.score && (
                    <p className="text-[8.5pt] text-gray-500 italic">Score: {edu.score}</p>
                  )}
                </div>
              </article>
            ))}
          </section>
        )}

        {/* ===== CERTIFICATIONS ===== */}
        {certifications.length > 0 && (
          <section className="mb-3 break-inside-avoid">
            <h2 className="text-[10pt] font-bold uppercase border-b border-black mb-1.5 pb-0.5 tracking-wider text-black">
              Certifications
            </h2>
            <div className="space-y-1">
              {certifications.map((cert: CertificationItem) => (
                <div key={cert.id} className="flex justify-between text-[9.5pt]">
                  <span>
                    <span className="font-semibold text-gray-900">{cert.name}</span>
                    <span className="text-gray-500 italic ml-1">— {cert.issuer}</span>
                  </span>
                  <span className="text-gray-600 text-[9pt]">{cert.date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== LANGUAGES ===== */}
        {languages.length > 0 && (
          <section className="mb-3 break-inside-avoid">
            <h2 className="text-[10pt] font-bold uppercase border-b border-black mb-1.5 pb-0.5 tracking-wider text-black">
              Languages
            </h2>
            <p className="text-[9.5pt] text-gray-800">
              {languages.map((lang: LanguageItem, i: number) => (
                <span key={lang.id}>
                  {lang.name} <span className="text-gray-500">({lang.proficiency})</span>
                  {i < languages.length - 1 && <span className="text-gray-400"> • </span>}
                </span>
              ))}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
