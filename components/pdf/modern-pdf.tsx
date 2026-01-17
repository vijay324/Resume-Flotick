/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link, Svg, Path } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';

/**
 * Modern PDF Template
 * 
 * Section-specific styles for granular control over each section's spacing.
 * Uses Helvetica font family for clean, modern appearance.
 */

const styles = StyleSheet.create({
  // ===== PAGE =====
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
  },

  // ===== HEADER SECTION =====
  headerSection: {
    backgroundColor: '#1e3a5f',
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 28,
    color: '#ffffff',
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerJobTitle: {
    fontSize: 12,
    color: '#bfdbfe',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  headerContactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 8,
  },
  headerContactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 9,
    color: '#e5e7eb',
  },
  headerContactIcon: {
    width: 12,
    height: 12,
    marginRight: 6,
  },
  headerLink: {
    color: '#e5e7eb',
    textDecoration: 'none',
  },

  // ===== BODY LAYOUT =====
  body: {
    flexDirection: 'row',
    flex: 1,
  },

  // ===== LEFT COLUMN =====
  leftColumn: {
    width: '65%',
    paddingTop: 28,
    paddingBottom: 28,
    paddingLeft: 28,
    paddingRight: 18,
  },

  // ===== RIGHT COLUMN =====
  rightColumn: {
    width: '35%',
    backgroundColor: '#f9fafb',
    paddingTop: 28,
    paddingBottom: 28,
    paddingLeft: 18,
    paddingRight: 28,
  },

  // ===== ABOUT SECTION (Left) =====
  aboutSection: {
    marginBottom: 16,
  },
  aboutTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#1e3a5f',
    marginBottom: 12,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#1e3a5f',
    flexDirection: 'row',
    alignItems: 'center',
  },
  aboutText: {
    textAlign: 'justify',
    lineHeight: 1.5,
    color: '#374151',
  },

  // ===== EXPERIENCE SECTION (Left) =====
  experienceSection: {
    marginBottom: 16,
  },
  experienceTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#1e3a5f',
    marginBottom: 12,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#1e3a5f',
  },
  experienceBlock: {
    marginBottom: 16,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  experiencePosition: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  experienceDate: {
    fontSize: 9,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: '2 6',
    borderRadius: 4,
  },
  experienceCompany: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: 2,
  },
  experienceBulletList: {
    marginTop: 4,
  },
  experienceBulletItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  experienceBullet: {
    width: 10,
    fontSize: 10,
    color: '#9ca3af',
  },
  experienceBulletContent: {
    flex: 1,
    fontSize: 10,
    color: '#374151',
  },

  // ===== PROJECTS SECTION (Left) =====
  projectsSection: {
    marginBottom: 16,
  },
  projectsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#1e3a5f',
    marginBottom: 12,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#1e3a5f',
  },
  projectBlock: {
    marginBottom: 12,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  projectName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  projectLink: {
    marginLeft: 6,
    fontSize: 8,
    color: '#1e3a5f',
    textDecoration: 'none',
  },
  projectTechRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  projectTechTag: {
    fontSize: 8,
    backgroundColor: '#f3f4f6',
    padding: '1 4',
    borderRadius: 2,
    color: '#4b5563',
  },
  projectBulletList: {
    marginTop: 4,
  },
  projectBulletItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  projectBullet: {
    width: 10,
    fontSize: 10,
    color: '#9ca3af',
  },
  projectBulletContent: {
    flex: 1,
    fontSize: 10,
    color: '#374151',
  },

  // ===== SKILLS SECTION (Right) =====
  skillsSection: {
    marginBottom: 24,
  },
  skillsTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#1e3a5f',
    marginBottom: 8,
  },
  skillsTagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: '4 8',
    borderRadius: 4,
    fontSize: 9,
    color: '#374151',
  },

  // ===== EDUCATION SECTION (Right) =====
  educationSection: {
    marginBottom: 24,
  },
  educationTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#1e3a5f',
    marginBottom: 8,
  },
  educationBlock: {
    marginBottom: 8,
  },
  educationInstitution: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  educationDegree: {
    fontSize: 9,
    color: '#374151',
  },
  educationDate: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 1,
  },
  educationScore: {
    fontSize: 8,
    color: '#1e3a5f',
    fontWeight: 'bold',
  },

  // ===== LANGUAGES SECTION (Right) =====
  languagesSection: {
    marginBottom: 24,
  },
  languagesTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#1e3a5f',
    marginBottom: 8,
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  languageName: {
    fontSize: 9,
  },
  languageProficiency: {
    fontSize: 9,
    color: '#6b7280',
  },

  // ===== CERTIFICATIONS SECTION (Right) =====
  certificationsSection: {
    marginBottom: 24,
  },
  certificationsTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#1e3a5f',
    marginBottom: 8,
  },
  certBlock: {
    marginBottom: 6,
  },
  certName: {
    fontWeight: 'bold',
    fontSize: 9,
  },
  certIssuer: {
    fontSize: 8,
    color: '#6b7280',
  },
});

// Icon Components for Header
const Icon = ({ path }: { path: string }) => (
  <Svg viewBox="0 0 24 24" style={styles.headerContactIcon}>
    <Path d={path} fill="none" stroke="#93c5fd" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PhoneIcon = () => <Icon path="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />;
const MailIcon = () => <Icon path="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" />;
const MapPinIcon = () => <Icon path="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />;
const LinkedinIcon = () => <Icon path="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" />;
const GithubIcon = () => <Icon path="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />;
const GlobeIcon = () => <Icon path="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />;

interface Props {
  data: ResumeData;
}

export const ModernPdf = ({ data }: Props) => {
  const { personalInfo, experience, education, skills, projects, languages, certifications } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ===== HEADER ===== */}
        <View style={styles.headerSection}>
          <Text style={styles.headerName}>{personalInfo.fullName}</Text>
          {personalInfo.jobTitle && <Text style={styles.headerJobTitle}>{personalInfo.jobTitle}</Text>}
          
          <View style={styles.headerContactRow}>
            {personalInfo.phone && (
              <View style={styles.headerContactItem}>
                <PhoneIcon />
                <Link src={`tel:${personalInfo.phone}`} style={styles.headerLink}>{personalInfo.phone}</Link>
              </View>
            )}
            {personalInfo.email && (
              <View style={styles.headerContactItem}>
                <MailIcon />
                <Link src={`mailto:${personalInfo.email}`} style={styles.headerLink}>{personalInfo.email}</Link>
              </View>
            )}
            {personalInfo.location && (
              <View style={styles.headerContactItem}>
                <MapPinIcon />
                <Text>{personalInfo.location}</Text>
              </View>
            )}
            {personalInfo.linkedin && (
              <View style={styles.headerContactItem}>
                <LinkedinIcon />
                <Link src={personalInfo.linkedin} style={styles.headerLink}>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</Link>
              </View>
            )}
            {personalInfo.github && (
              <View style={styles.headerContactItem}>
                <GithubIcon />
                <Link src={personalInfo.github} style={styles.headerLink}>{personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}</Link>
              </View>
            )}
            {personalInfo.website && (
              <View style={styles.headerContactItem}>
                <GlobeIcon />
                <Link src={personalInfo.website} style={styles.headerLink}>{personalInfo.website.replace(/^https?:\/\/(www\.)?/, "")}</Link>
              </View>
            )}
          </View>
        </View>

        <View style={styles.body}>
          {/* ===== LEFT MAIN COLUMN ===== */}
          <View style={styles.leftColumn}>
            {/* About */}
            {personalInfo.summary && (
              <View style={styles.aboutSection}>
                <Text style={styles.aboutTitle}>About Me</Text>
                <Text style={styles.aboutText}>{personalInfo.summary}</Text>
              </View>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <View style={styles.experienceSection}>
                {experience.map((exp, index) => (
                  <View key={exp.id} wrap={false} style={styles.experienceBlock}>
                    {index === 0 && <Text style={styles.experienceTitle}>Work Experience</Text>}
                    <View style={styles.experienceHeader}>
                      <Text style={styles.experiencePosition}>{exp.position}</Text>
                      <Text style={styles.experienceDate}>{exp.startDate} – {exp.endDate}</Text>
                    </View>
                    <Text style={styles.experienceCompany}>{exp.company} {exp.location ? `• ${exp.location}` : ''}</Text>
                    <View style={styles.experienceBulletList}>
                      {exp.description.split('\n').map((line, i) => line.trim() && (
                        <View key={i} style={styles.experienceBulletItem}>
                          <Text style={styles.experienceBullet}>–</Text>
                          <Text style={styles.experienceBulletContent}>{line.trim()}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <View style={styles.projectsSection}>
                {projects.map((proj, index) => (
                  <View key={proj.id} wrap={false} style={styles.projectBlock}>
                    {index === 0 && <Text style={styles.projectsTitle}>Projects</Text>}
                    <View style={styles.projectHeader}>
                      <Text style={styles.projectName}>{proj.name}</Text>
                      {proj.link && <Link src={proj.link} style={styles.projectLink}>| {proj.link.replace(/^https?:\/\//, "")}</Link>}
                    </View>
                    <View style={styles.projectTechRow}>
                      {proj.technologies.map((tech, i) => (
                        <Text key={i} style={styles.projectTechTag}>{tech}</Text>
                      ))}
                    </View>
                    <View style={styles.projectBulletList}>
                      {proj.description.split('\n').map((line, i) => line.trim() && (
                        <View key={i} style={styles.projectBulletItem}>
                          <Text style={styles.projectBullet}>–</Text>
                          <Text style={styles.projectBulletContent}>{line.trim()}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* ===== RIGHT SIDEBAR COLUMN ===== */}
          <View style={styles.rightColumn}>
            {/* Skills */}
            {skills.length > 0 && (
              <View style={styles.skillsSection}>
                <Text style={styles.skillsTitle}>Skills</Text>
                <View style={styles.skillsTagContainer}>
                  {skills.map(skill => (
                    <Text key={skill.id} style={styles.skillTag}>{skill.name}</Text>
                  ))}
                </View>
              </View>
            )}

            {/* Education */}
            {education.length > 0 && (
              <View style={styles.educationSection}>
                <Text style={styles.educationTitle}>Education</Text>
                {education.map(edu => (
                  <View key={edu.id} style={styles.educationBlock}>
                    <Text style={styles.educationInstitution}>{edu.institution}</Text>
                    <Text style={styles.educationDegree}>{edu.degree} in {edu.field}</Text>
                    <Text style={styles.educationDate}>{edu.startDate} – {edu.endDate}</Text>
                    {edu.score && <Text style={styles.educationScore}>{edu.score}</Text>}
                  </View>
                ))}
              </View>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <View style={styles.languagesSection}>
                <Text style={styles.languagesTitle}>Languages</Text>
                {languages.map(lang => (
                  <View key={lang.id} style={styles.languageRow}>
                    <Text style={styles.languageName}>{lang.name}</Text>
                    <Text style={styles.languageProficiency}>{lang.proficiency}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <View style={styles.certificationsSection}>
                <Text style={styles.certificationsTitle}>Certifications</Text>
                {certifications.map(cert => (
                  <View key={cert.id} style={styles.certBlock}>
                    <Text style={styles.certName}>{cert.name}</Text>
                    <Text style={styles.certIssuer}>{cert.issuer} • {cert.date}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};
