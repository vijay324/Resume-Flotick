/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';

/**
 * ATS-Optimized PDF Template
 * 
 * Matches the ats-template.tsx preview exactly for pixel-perfect export.
 * Uses Times-Roman font family (best match for Georgia serif in preview).
 */

const styles = StyleSheet.create({
  page: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 30,
    backgroundColor: '#ffffff',
    fontFamily: 'Times-Roman',
    fontSize: 9.5,
    lineHeight: 1.15,
    color: '#1f2937',
  },
  // Header section
  header: {
    textAlign: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Times-Bold',
    letterSpacing: 0.3,
    color: '#000000',
    marginBottom: 0,
  },
  jobTitle: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 3,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    fontSize: 8.5,
    color: '#374151',
    marginBottom: 1,
  },
  contactLink: {
    textDecoration: 'none',
    color: '#1f2937',
  },
  contactLinkUnderline: {
    textDecoration: 'underline',
    color: '#374151',
  },
  separator: {
    color: '#9ca3af',
    marginHorizontal: 6,
  },
  // Section styles
  section: {
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
    marginBottom: 3,
    paddingBottom: 0.5,
    letterSpacing: 0.5,
    color: '#000000',
  },
  // Text styles
  bodyText: {
    textAlign: 'justify',
    color: '#1f2937',
    lineHeight: 1.15,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillLabel: {
    fontFamily: 'Times-Bold',
    color: '#000000',
  },
  skillLevel: {
    fontSize: 9,
    color: '#6b7280',
  },
  // Experience block
  expBlock: {
    marginBottom: 5,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 0,
  },
  expPosition: {
    fontSize: 9.5,
    fontFamily: 'Times-Bold',
    color: '#000000',
  },
  expDate: {
    fontSize: 8.5,
    color: '#4b5563',
  },
  expSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
    fontSize: 9,
  },
  expCompany: {
    fontFamily: 'Times-BoldItalic',
    color: '#374151',
  },
  expLocation: {
    fontSize: 8.5,
    fontFamily: 'Times-Italic',
    color: '#6b7280',
  },
  // Bullet list
  bulletList: {
    marginLeft: 4,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 0.5,
  },
  bullet: {
    width: 8,
    fontSize: 8.5,
    color: '#4b5563',
  },
  bulletContent: {
    flex: 1,
    color: '#1f2937',
    fontSize: 9,
    lineHeight: 1.15,
  },
  // Project styles
  projBlock: {
    marginBottom: 4,
  },
  projHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 0,
  },
  projName: {
    fontSize: 9.5,
    fontFamily: 'Times-Bold',
    color: '#000000',
  },
  projLink: {
    fontSize: 8,
    color: '#6b7280',
    marginLeft: 3,
    textDecoration: 'underline',
  },
  projTech: {
    fontSize: 8.5,
    fontFamily: 'Times-Italic',
    color: '#4b5563',
    marginBottom: 1,
  },
  // Education styles
  eduBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  eduInstitution: {
    fontSize: 9.5,
    fontFamily: 'Times-Bold',
    color: '#000000',
  },
  eduDegree: {
    fontSize: 9,
    color: '#374151',
  },
  eduDate: {
    fontSize: 8.5,
    color: '#4b5563',
    textAlign: 'right',
  },
  eduScore: {
    fontSize: 8,
    fontFamily: 'Times-Italic',
    color: '#6b7280',
    textAlign: 'right',
  },
  // Certification styles
  certRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    fontSize: 9,
  },
  certName: {
    fontFamily: 'Times-Bold',
    color: '#111827',
  },
  certIssuer: {
    fontFamily: 'Times-Italic',
    color: '#6b7280',
  },
  certDate: {
    fontSize: 8.5,
    color: '#4b5563',
  },
  // Languages
  langText: {
    fontSize: 9,
    color: '#1f2937',
  },
  langProficiency: {
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
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName}</Text>
          
          {personalInfo.jobTitle && (
            <Text style={styles.jobTitle}>{personalInfo.jobTitle}</Text>
          )}
          
          {/* Contact Row 1: Phone, Email, Location */}
          <View style={styles.contactRow}>
            {personalInfo.phone && (
              <Link src={`tel:${personalInfo.phone}`} style={styles.contactLink}>
                {personalInfo.phone}
              </Link>
            )}
            {personalInfo.phone && personalInfo.email && (
              <Text style={styles.separator}>|</Text>
            )}
            {personalInfo.email && (
              <Link src={`mailto:${personalInfo.email}`} style={styles.contactLink}>
                {personalInfo.email}
              </Link>
            )}
            {(personalInfo.phone || personalInfo.email) && personalInfo.location && (
              <Text style={styles.separator}>|</Text>
            )}
            {personalInfo.location && (
              <Text>{personalInfo.location}</Text>
            )}
          </View>
          
          {/* Contact Row 2: Links */}
          {(personalInfo.linkedin || personalInfo.github || personalInfo.website) && (
            <View style={styles.contactRow}>
              {personalInfo.linkedin && (
                <Link src={normalizeUrl(personalInfo.linkedin)} style={styles.contactLinkUnderline}>
                  {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                </Link>
              )}
              {personalInfo.linkedin && personalInfo.github && (
                <Text style={styles.separator}>|</Text>
              )}
              {personalInfo.github && (
                <Link src={normalizeUrl(personalInfo.github)} style={styles.contactLinkUnderline}>
                  {personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}
                </Link>
              )}
              {(personalInfo.linkedin || personalInfo.github) && personalInfo.website && (
                <Text style={styles.separator}>|</Text>
              )}
              {personalInfo.website && (
                <Link src={normalizeUrl(personalInfo.website)} style={styles.contactLinkUnderline}>
                  {personalInfo.website.replace(/^https?:\/\/(www\.)?/, "")}
                </Link>
              )}
            </View>
          )}
        </View>

        {/* ===== PROFESSIONAL SUMMARY ===== */}
        {personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.bodyText}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* ===== SKILLS ===== */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsRow}>
              <Text>
                <Text style={styles.skillLabel}>Technical Skills: </Text>
                {skills.map((s, i) => (
                  <Text key={s.id}>
                    {s.name}
                    {s.level && <Text style={styles.skillLevel}> ({s.level})</Text>}
                    {i < skills.length - 1 && <Text style={{ color: '#9ca3af' }}> • </Text>}
                  </Text>
                ))}
              </Text>
            </View>
          </View>
        )}

        {/* ===== WORK EXPERIENCE ===== */}
        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={styles.expBlock} wrap={false}>
                <View style={styles.expHeader}>
                  <Text style={styles.expPosition}>{exp.position}</Text>
                  <Text style={styles.expDate}>
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </Text>
                </View>
                <View style={styles.expSubRow}>
                  <Text style={styles.expCompany}>{exp.company}</Text>
                  {exp.location && <Text style={styles.expLocation}>{exp.location}</Text>}
                </View>
                <View style={styles.bulletList}>
                  {exp.description.split('\n').map((line, i) => line.trim() && (
                    <View key={i} style={styles.bulletItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.bulletContent}>{line.trim()}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ===== PROJECTS ===== */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={styles.projBlock} wrap={false}>
                <View style={styles.projHeader}>
                  <Text style={styles.projName}>{proj.name}</Text>
                  {proj.link && (
                    <Link src={normalizeUrl(proj.link)} style={styles.projLink}>
                      | {proj.link.replace(/^https?:\/\//, "")}
                    </Link>
                  )}
                </View>
                {proj.technologies.length > 0 && (
                  <Text style={styles.projTech}>
                    Technologies: {proj.technologies.join(", ")}
                  </Text>
                )}
                <View style={styles.bulletList}>
                  {proj.description.split('\n').map((line, i) => line.trim() && (
                    <View key={i} style={styles.bulletItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.bulletContent}>{line.trim()}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ===== EDUCATION ===== */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.eduBlock} wrap={false}>
                <View>
                  <Text style={styles.eduInstitution}>{edu.institution}</Text>
                  <Text style={styles.eduDegree}>{edu.degree} in {edu.field}</Text>
                </View>
                <View>
                  <Text style={styles.eduDate}>
                    {edu.startDate} – {edu.current ? "Present" : edu.endDate}
                  </Text>
                  {edu.score && <Text style={styles.eduScore}>Score: {edu.score}</Text>}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ===== CERTIFICATIONS ===== */}
        {certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert) => (
              <View key={cert.id} style={styles.certRow}>
                <Text>
                  <Text style={styles.certName}>{cert.name}</Text>
                  <Text style={styles.certIssuer}> — {cert.issuer}</Text>
                </Text>
                <Text style={styles.certDate}>{cert.date}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ===== LANGUAGES ===== */}
        {languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <Text style={styles.langText}>
              {languages.map((lang, i) => (
                <Text key={lang.id}>
                  {lang.name} <Text style={styles.langProficiency}>({lang.proficiency})</Text>
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
