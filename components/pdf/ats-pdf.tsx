/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';

/**
 * ATS-Optimized PDF Template
 * 
 * Section-specific styles for granular control over each section's spacing.
 * Uses Times-Roman font family for ATS compatibility.
 */

const styles = StyleSheet.create({
  // ===== PAGE =====
  page: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 35,
    backgroundColor: '#ffffff',
    fontFamily: 'Times-Roman',
    fontSize: 9.5,
    color: '#1f2937',
  },

  // ===== HEADER SECTION =====
  headerSection: {
    textAlign: 'center',
    marginBottom: 6,
    paddingBottom: 0,
  },
  headerName: {
    fontSize: 22,
    fontFamily: 'Times-Bold',
    letterSpacing: 0.3,
    color: '#000000',
    lineHeight: 1.0,
    marginBottom: 0,
  },
  headerJobTitle: {
    fontSize: 10,
    color: '#4b5563',
    marginTop: 4,
    marginBottom: 3,
    lineHeight: 1.0,
  },
  headerContactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    fontSize: 8.5,
    color: '#374151',
    marginBottom: 4,
    lineHeight: 1.0,
  },
  headerContactLink: {
    textDecoration: 'none',
    color: '#1f2937',
  },
  headerContactLinkUnderline: {
    textDecoration: 'underline',
    color: '#374151',
  },
  headerSeparator: {
    color: '#9ca3af',
    marginHorizontal: 4,
  },

  // ===== SUMMARY SECTION =====
  summarySection: {
    marginTop: 6,
    marginBottom: 6,
  },
  summaryTitle: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
    paddingBottom: 1,
    marginBottom: 4,
    letterSpacing: 0.5,
    color: '#000000',
    lineHeight: 1.0,
  },
  summaryText: {
    textAlign: 'justify',
    color: '#1f2937',
    lineHeight: 1.3,
    marginTop: 0,
    paddingTop: 0,
    fontSize: 9.5,
  },

  // ===== SKILLS SECTION =====
  skillsSection: {
    marginTop: 6,
    marginBottom: 6,
  },
  skillsTitle: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
    paddingBottom: 1,
    marginBottom: 4,
    letterSpacing: 0.5,
    color: '#000000',
    lineHeight: 1.0,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 0,
    lineHeight: 1.25,
    fontSize: 9.5,
  },
  skillsLabel: {
    fontFamily: 'Times-Bold',
    color: '#000000',
  },

  // ===== EXPERIENCE SECTION =====
  experienceSection: {
    marginTop: 6,
    marginBottom: 6,
  },
  experienceTitle: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
    paddingBottom: 1,
    marginBottom: 4,
    letterSpacing: 0.5,
    color: '#000000',
    lineHeight: 1.0,
  },
  experienceBlock: {
    marginBottom: 6,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 1,
  },
  experiencePosition: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    color: '#000000',
    lineHeight: 1.0,
  },
  experienceDate: {
    fontSize: 8,
    color: '#4b5563',
  },
  experienceSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    fontSize: 9,
  },
  experienceCompany: {
    fontFamily: 'Times-BoldItalic',
    color: '#374151',
  },
  experienceLocation: {
    fontSize: 8,
    fontFamily: 'Times-Italic',
    color: '#6b7280',
  },
  experienceBulletList: {
    marginLeft: 3,
    marginTop: 0,
  },
  experienceBulletItem: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  experienceBullet: {
    width: 8,
    fontSize: 9,
    color: '#4b5563',
  },
  experienceBulletContent: {
    flex: 1,
    color: '#1f2937',
    fontSize: 9,
    lineHeight: 1.2,
  },

  // ===== PROJECTS SECTION =====
  projectsSection: {
    marginTop: 6,
    marginBottom: 6,
  },
  projectsTitle: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
    paddingBottom: 1,
    marginBottom: 4,
    letterSpacing: 0.5,
    color: '#000000',
    lineHeight: 1.0,
  },
  projectBlock: {
    marginBottom: 6,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 0,
  },
  projectName: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    color: '#000000',
    lineHeight: 1.0,
  },
  projectLink: {
    fontSize: 7.5,
    color: '#6b7280',
    marginLeft: 2,
    textDecoration: 'underline',
  },
  projectTech: {
    fontSize: 8,
    fontFamily: 'Times-Italic',
    color: '#4b5563',
    marginTop: 1.5,
    marginBottom: 1,
  },
  projectBulletList: {
    marginLeft: 3,
  },
  projectBulletItem: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  projectBullet: {
    width: 8,
    fontSize: 9,
    color: '#4b5563',
  },
  projectBulletContent: {
    flex: 1,
    color: '#1f2937',
    fontSize: 9,
    lineHeight: 1.2,
  },

  // ===== EDUCATION SECTION =====
  educationSection: {
    marginTop: 6,
    marginBottom: 6,
  },
  educationTitle: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
    paddingBottom: 1,
    marginBottom: 4,
    letterSpacing: 0.5,
    color: '#000000',
    lineHeight: 1.0,
  },
  educationBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  educationInstitution: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    color: '#000000',
    lineHeight: 1.0,
  },
  educationDegree: {
    fontSize: 8.5,
    color: '#374151',
  },
  educationDate: {
    fontSize: 8,
    color: '#4b5563',
    textAlign: 'right',
  },
  educationScore: {
    fontSize: 7.5,
    fontFamily: 'Times-Italic',
    color: '#6b7280',
    textAlign: 'right',
  },

  // ===== CERTIFICATIONS SECTION =====
  certificationsSection: {
    marginTop: 6,
    marginBottom: 6,
  },
  certificationsTitle: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
    paddingBottom: 1,
    marginBottom: 4,
    letterSpacing: 0.5,
    color: '#000000',
    lineHeight: 1.0,
  },
  certificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    fontSize: 9,
  },
  certificationName: {
    fontFamily: 'Times-Bold',
    color: '#111827',
  },
  certificationIssuer: {
    fontFamily: 'Times-Italic',
    color: '#6b7280',
  },
  certificationDate: {
    fontSize: 8,
    color: '#4b5563',
  },

  // ===== LANGUAGES SECTION =====
  languagesSection: {
    marginTop: 6,
    marginBottom: 6,
  },
  languagesTitle: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
    paddingBottom: 1,
    marginBottom: 4,
    letterSpacing: 0.5,
    color: '#000000',
    lineHeight: 1.0,
  },
  languagesText: {
    fontSize: 9,
    color: '#1f2937',
    lineHeight: 1.2,
  },
  languagesProficiency: {
    color: '#6b7280',
  },
});

// Helper function to ensure URLs have proper protocol
const normalizeUrl = (url: string): string => {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

interface Props {
  data: ResumeData;
}

export const AtsPdf = ({ data }: Props) => {
  const { personalInfo, experience, education, skills, projects, languages, certifications } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ===== HEADER ===== */}
        <View style={styles.headerSection}>
          <Text style={styles.headerName}>{personalInfo.fullName}</Text>
          
          {personalInfo.jobTitle && (
            <Text style={styles.headerJobTitle}>{personalInfo.jobTitle}</Text>
          )}
          
          {/* Contact Row 1: Phone, Email, Location */}
          <View style={styles.headerContactRow}>
            {personalInfo.phone && (
              <Link src={`tel:${personalInfo.phone}`} style={styles.headerContactLink}>
                {personalInfo.phone}
              </Link>
            )}
            {personalInfo.phone && personalInfo.email && (
              <Text style={styles.headerSeparator}>|</Text>
            )}
            {personalInfo.email && (
              <Link src={`mailto:${personalInfo.email}`} style={styles.headerContactLink}>
                {personalInfo.email}
              </Link>
            )}
            {(personalInfo.phone || personalInfo.email) && personalInfo.location && (
              <Text style={styles.headerSeparator}>|</Text>
            )}
            {personalInfo.location && (
              <Text>{personalInfo.location}</Text>
            )}
          </View>
          
          {/* Contact Row 2: Links */}
          {(personalInfo.linkedin || personalInfo.github || personalInfo.website) && (
            <View style={styles.headerContactRow}>
              {personalInfo.linkedin && (
                <Link src={normalizeUrl(personalInfo.linkedin)} style={styles.headerContactLinkUnderline}>
                  {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                </Link>
              )}
              {personalInfo.linkedin && personalInfo.github && (
                <Text style={styles.headerSeparator}>|</Text>
              )}
              {personalInfo.github && (
                <Link src={normalizeUrl(personalInfo.github)} style={styles.headerContactLinkUnderline}>
                  {personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}
                </Link>
              )}
              {(personalInfo.linkedin || personalInfo.github) && personalInfo.website && (
                <Text style={styles.headerSeparator}>|</Text>
              )}
              {personalInfo.website && (
                <Link src={normalizeUrl(personalInfo.website)} style={styles.headerContactLinkUnderline}>
                  {personalInfo.website.replace(/^https?:\/\/(www\.)?/, "")}
                </Link>
              )}
            </View>
          )}
        </View>

        {/* ===== PROFESSIONAL SUMMARY ===== */}
        {personalInfo.summary && (
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* ===== SKILLS ===== */}
        {skills.length > 0 && (
          <View style={styles.skillsSection}>
            <Text style={styles.skillsTitle}>Skills</Text>
            <View style={styles.skillsRow}>
              <Text>
                <Text style={styles.skillsLabel}>Technical Skills: </Text>
                {skills.map((s, i) => (
                  <Text key={s.id}>
                    {s.name}
                    {i < skills.length - 1 && <Text style={{ color: '#9ca3af' }}> • </Text>}
                  </Text>
                ))}
              </Text>
            </View>
          </View>
        )}

        {/* ===== WORK EXPERIENCE ===== */}
        {experience.length > 0 && (
          <View style={styles.experienceSection}>
            <Text style={styles.experienceTitle}>Professional Experience</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={styles.experienceBlock} wrap={false}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.experiencePosition}>{exp.position}</Text>
                  <Text style={styles.experienceDate}>
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </Text>
                </View>
                <View style={styles.experienceSubRow}>
                  <Text style={styles.experienceCompany}>{exp.company}</Text>
                  {exp.location && <Text style={styles.experienceLocation}>{exp.location}</Text>}
                </View>
                <View style={styles.experienceBulletList}>
                  {exp.description.split('\n').map((line, i) => line.trim() && (
                    <View key={i} style={styles.experienceBulletItem}>
                      <Text style={styles.experienceBullet}>•</Text>
                      <Text style={styles.experienceBulletContent}>{line.trim()}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ===== PROJECTS ===== */}
        {projects.length > 0 && (
          <View style={styles.projectsSection}>
            <Text style={styles.projectsTitle}>Projects</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={styles.projectBlock} wrap={false}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectName}>{proj.name}</Text>
                  {proj.link && (
                    <Link src={normalizeUrl(proj.link)} style={styles.projectLink}>
                      | {proj.link.replace(/^https?:\/\//, "")}
                    </Link>
                  )}
                </View>
                {proj.technologies.length > 0 && (
                  <Text style={styles.projectTech}>
                    Technologies: {proj.technologies.join(", ")}
                  </Text>
                )}
                <View style={styles.projectBulletList}>
                  {proj.description.split('\n').map((line, i) => line.trim() && (
                    <View key={i} style={styles.projectBulletItem}>
                      <Text style={styles.projectBullet}>•</Text>
                      <Text style={styles.projectBulletContent}>{line.trim()}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ===== EDUCATION ===== */}
        {education.length > 0 && (
          <View style={styles.educationSection}>
            <Text style={styles.educationTitle}>Education</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.educationBlock} wrap={false}>
                <View>
                  <Text style={styles.educationInstitution}>{edu.institution}</Text>
                  <Text style={styles.educationDegree}>{edu.degree} in {edu.field}</Text>
                </View>
                <View>
                  <Text style={styles.educationDate}>
                    {edu.startDate} – {edu.current ? "Present" : edu.endDate}
                  </Text>
                  {edu.score && <Text style={styles.educationScore}>Score: {edu.score}</Text>}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ===== CERTIFICATIONS ===== */}
        {certifications.length > 0 && (
          <View style={styles.certificationsSection}>
            <Text style={styles.certificationsTitle}>Certifications</Text>
            {certifications.map((cert) => (
              <View key={cert.id} style={styles.certificationRow}>
                <Text>
                  <Text style={styles.certificationName}>{cert.name}</Text>
                  <Text style={styles.certificationIssuer}> — {cert.issuer}</Text>
                </Text>
                <Text style={styles.certificationDate}>{cert.date}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ===== LANGUAGES ===== */}
        {languages.length > 0 && (
          <View style={styles.languagesSection}>
            <Text style={styles.languagesTitle}>Languages</Text>
            <Text style={styles.languagesText}>
              {languages.map((lang, i) => (
                <Text key={lang.id}>
                  {lang.name} <Text style={styles.languagesProficiency}>({lang.proficiency})</Text>
                  {i < languages.length - 1 && <Text style={{ color: '#9ca3af' }}> • </Text>}
                </Text>
              ))}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
};
