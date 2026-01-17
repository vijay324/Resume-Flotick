/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link, Svg, Path } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';

/**
 * Professional Two-Column PDF Template
 * 
 * Section-specific styles for granular control over each section's spacing.
 * Uses Times-Roman font family for professional appearance.
 */

const styles = StyleSheet.create({
  // ===== PAGE =====
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    fontFamily: 'Times-Roman',
  },

  // ===== LEFT COLUMN =====
  leftColumn: {
    width: '30%',
    backgroundColor: '#2c3e50',
    color: 'white',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    height: '100%',
  },

  // ===== LEFT HEADER SECTION =====
  leftHeaderSection: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    marginBottom: 24,
    paddingBottom: 16,
  },
  leftHeaderName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 1.2,
  },
  leftHeaderJobTitle: {
    fontSize: 10,
    color: '#d1d5db',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: 'medium',
    marginBottom: 0,
  },

  // ===== CONTACT SECTION (Left) =====
  contactSection: {
    marginBottom: 24,
  },
  contactTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    color: '#d1d5db',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    fontSize: 9,
  },
  contactIcon: {
    width: 10,
    height: 10,
    marginRight: 8,
    color: '#9ca3af',
  },
  contactText: {
    color: 'white',
    textDecoration: 'none',
  },

  // ===== SKILLS SECTION (Left) =====
  skillsSection: {
    marginBottom: 24,
  },
  skillsTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    color: '#d1d5db',
  },
  skillItem: {
    marginBottom: 6,
    fontSize: 9,
  },

  // ===== LANGUAGES SECTION (Left) =====
  languagesSection: {
    marginBottom: 24,
  },
  languagesTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    color: '#d1d5db',
  },
  languageItem: {
    marginBottom: 4,
    fontSize: 9,
  },
  languageProficiency: {
    color: '#9ca3af',
  },

  // ===== CERTIFICATIONS SECTION (Left) =====
  certificationsSection: {
    marginBottom: 24,
  },
  certificationsTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    color: '#d1d5db',
  },
  certItem: {
    marginBottom: 8,
    fontSize: 9,
  },
  certIssuer: {
    color: '#9ca3af',
    fontSize: 8,
  },

  // ===== RIGHT COLUMN =====
  rightColumn: {
    width: '70%',
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
    height: '100%',
  },

  // ===== PROFILE SECTION (Right) =====
  profileSection: {
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    color: '#2c3e50',
    borderBottomWidth: 2,
    borderBottomColor: '#2c3e50',
    paddingBottom: 4,
  },
  profileText: {
    fontSize: 10,
    lineHeight: 1.5,
    textAlign: 'justify',
    color: '#374151',
  },

  // ===== EXPERIENCE SECTION (Right) =====
  experienceSection: {
    marginBottom: 20,
  },
  experienceTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    color: '#2c3e50',
    borderBottomWidth: 2,
    borderBottomColor: '#2c3e50',
    paddingBottom: 4,
  },
  experienceBlock: {
    marginBottom: 16,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  experiencePosition: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  experienceDate: {
    fontSize: 9,
    color: '#4b5563',
    fontWeight: 'medium',
  },
  experienceSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  experienceCompany: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  experienceLocation: {
    fontSize: 9,
    fontStyle: 'italic',
    color: '#6b7280',
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
    color: '#2c3e50',
  },
  experienceBulletContent: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.5,
    color: '#374151',
  },

  // ===== PROJECTS SECTION (Right) =====
  projectsSection: {
    marginBottom: 20,
  },
  projectsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    color: '#2c3e50',
    borderBottomWidth: 2,
    borderBottomColor: '#2c3e50',
    paddingBottom: 4,
  },
  projectBlock: {
    marginBottom: 16,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 0,
  },
  projectNameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  projectName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  projectLink: {
    marginLeft: 5,
    fontSize: 8,
    color: '#666',
    textDecoration: 'none',
  },
  projectTech: {
    fontSize: 9,
    color: '#2c3e50',
    fontStyle: 'italic',
    marginBottom: 4,
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
    color: '#2c3e50',
  },
  projectBulletContent: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.5,
    color: '#374151',
  },

  // ===== EDUCATION SECTION (Right) =====
  educationSection: {
    marginBottom: 20,
  },
  educationTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    color: '#2c3e50',
    borderBottomWidth: 2,
    borderBottomColor: '#2c3e50',
    paddingBottom: 4,
  },
  educationBlock: {
    marginBottom: 16,
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  educationInstitution: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  educationDate: {
    fontSize: 9,
    color: '#4b5563',
    fontWeight: 'medium',
  },
  educationDegree: {
    fontSize: 10,
    color: '#374151',
  },
  educationScore: {
    fontSize: 9,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 2,
  },

  // ===== VOLUNTEER SECTION (Right) =====
  volunteerSection: {
    marginBottom: 20,
  },
  volunteerTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    color: '#2c3e50',
    borderBottomWidth: 2,
    borderBottomColor: '#2c3e50',
    paddingBottom: 4,
  },
  volunteerBlock: {
    marginBottom: 16,
  },
  volunteerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  volunteerOrganization: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  volunteerDate: {
    fontSize: 9,
    color: '#4b5563',
    fontWeight: 'medium',
  },
  volunteerRole: {
    fontSize: 10,
    fontStyle: 'italic',
    marginBottom: 2,
  },
  volunteerDescription: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.5,
    color: '#374151',
  },

  // ===== AWARDS SECTION (Right) =====
  awardsSection: {
    marginBottom: 20,
  },
  awardsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    color: '#2c3e50',
    borderBottomWidth: 2,
    borderBottomColor: '#2c3e50',
    paddingBottom: 4,
  },
  awardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  awardTitle: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  awardIssuer: {
    fontWeight: 'normal',
    color: '#666',
  },
  awardDate: {
    fontSize: 9,
    color: '#4b5563',
    fontWeight: 'medium',
  },
});

// Icon Components
const Icon = ({ path }: { path: string }) => (
  <Svg viewBox="0 0 24 24" style={styles.contactIcon}>
    <Path d={path} fill="none" stroke="#9ca3af" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
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

export const ProfessionalPdf = ({ data }: Props) => {
  const { personalInfo, experience, education, skills, projects, languages, certifications, awards, volunteer } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ===== LEFT COLUMN ===== */}
        <View style={styles.leftColumn}>
          {/* Header */}
          <View style={styles.leftHeaderSection}>
            <Text style={styles.leftHeaderName}>{personalInfo.fullName}</Text>
            {personalInfo.jobTitle && <Text style={styles.leftHeaderJobTitle}>{personalInfo.jobTitle}</Text>}
          </View>

          {/* Contact */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Contact</Text>
            {personalInfo.phone && (
              <View style={styles.contactItem}>
                <PhoneIcon />
                <Link src={`tel:${personalInfo.phone}`} style={styles.contactText}>{personalInfo.phone}</Link>
              </View>
            )}
            {personalInfo.email && (
              <View style={styles.contactItem}>
                <MailIcon />
                <Link src={`mailto:${personalInfo.email}`} style={styles.contactText}>{personalInfo.email}</Link>
              </View>
            )}
            {personalInfo.location && (
              <View style={styles.contactItem}>
                <MapPinIcon />
                <Text>{personalInfo.location}</Text>
              </View>
            )}
            {personalInfo.linkedin && (
              <View style={styles.contactItem}>
                <LinkedinIcon />
                <Link src={personalInfo.linkedin} style={styles.contactText}>
                  {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                </Link>
              </View>
            )}
            {personalInfo.github && (
              <View style={styles.contactItem}>
                <GithubIcon />
                <Link src={personalInfo.github} style={styles.contactText}>
                  {personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}
                </Link>
              </View>
            )}
            {personalInfo.website && (
              <View style={styles.contactItem}>
                <GlobeIcon />
                <Link src={personalInfo.website} style={styles.contactText}>
                  {personalInfo.website.replace(/^https?:\/\/(www\.)?/, "")}
                </Link>
              </View>
            )}
          </View>

          {/* Skills */}
          {skills.length > 0 && (
            <View style={styles.skillsSection}>
              <Text style={styles.skillsTitle}>Skills</Text>
              {skills.map((skill) => (
                <View key={skill.id} style={styles.skillItem}>
                  <Text>{skill.name}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <View style={styles.languagesSection}>
              <Text style={styles.languagesTitle}>Languages</Text>
              {languages.map((lang) => (
                <View key={lang.id} style={styles.languageItem}>
                  <Text>{lang.name} <Text style={styles.languageProficiency}>({lang.proficiency})</Text></Text>
                </View>
              ))}
            </View>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <View style={styles.certificationsSection}>
              <Text style={styles.certificationsTitle}>Certifications</Text>
              {certifications.map((cert) => (
                <View key={cert.id} style={styles.certItem}>
                  <Text>{cert.name}</Text>
                  <Text style={styles.certIssuer}>{cert.issuer} • {cert.date}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ===== RIGHT COLUMN ===== */}
        <View style={styles.rightColumn}>
          {/* Profile */}
          {personalInfo.summary && (
            <View style={styles.profileSection}>
              <Text style={styles.profileTitle}>Profile</Text>
              <Text style={styles.profileText}>{personalInfo.summary}</Text>
            </View>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <View style={styles.experienceSection}>
              {experience.map((exp, index) => (
                <View key={exp.id} wrap={false} style={styles.experienceBlock}>
                  {index === 0 && <Text style={styles.experienceTitle}>Experience</Text>}
                  <View style={styles.experienceHeader}>
                    <Text style={styles.experiencePosition}>{exp.position}</Text>
                    <Text style={styles.experienceDate}>{exp.startDate} – {exp.endDate}</Text>
                  </View>
                  <View style={styles.experienceSubRow}>
                    <Text style={styles.experienceCompany}>{exp.company}</Text>
                    {exp.location && <Text style={styles.experienceLocation}>{exp.location}</Text>}
                  </View>
                  <View style={styles.experienceBulletList}>
                    {exp.description.split('\n').map((line, i) => line.trim() && (
                      <View key={i} style={styles.experienceBulletItem}>
                        <Text style={styles.experienceBullet}>▸</Text>
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
                    <View style={styles.projectNameRow}>
                      <Text style={styles.projectName}>{proj.name}</Text>
                      {proj.link && (
                        <Text style={styles.projectLink}>
                          | <Link src={proj.link} style={styles.projectLink}>{proj.link.replace(/^https?:\/\//, "")}</Link>
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text style={styles.projectTech}>
                    {proj.technologies.join(" • ")}
                  </Text>
                  <View style={styles.projectBulletList}>
                    {proj.description.split('\n').map((line, i) => line.trim() && (
                      <View key={i} style={styles.projectBulletItem}>
                        <Text style={styles.projectBullet}>▸</Text>
                        <Text style={styles.projectBulletContent}>{line.trim()}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {education.length > 0 && (
            <View style={styles.educationSection}>
              {education.map((edu, index) => (
                <View key={edu.id} wrap={false} style={styles.educationBlock}>
                  {index === 0 && <Text style={styles.educationTitle}>Education</Text>}
                  <View style={styles.educationHeader}>
                    <Text style={styles.educationInstitution}>{edu.institution}</Text>
                    <Text style={styles.educationDate}>{edu.startDate} – {edu.endDate}</Text>
                  </View>
                  <Text style={styles.educationDegree}>{edu.degree} in {edu.field}</Text>
                  {edu.score && <Text style={styles.educationScore}>{edu.score}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Volunteer */}
          {volunteer.length > 0 && (
            <View style={styles.volunteerSection}>
              <Text style={styles.volunteerTitle}>Volunteer</Text>
              {volunteer.map((vol) => (
                <View key={vol.id} style={styles.volunteerBlock}>
                  <View style={styles.volunteerHeader}>
                    <Text style={styles.volunteerOrganization}>{vol.organization}</Text>
                    <Text style={styles.volunteerDate}>{vol.startDate} – {vol.endDate}</Text>
                  </View>
                  <Text style={styles.volunteerRole}>{vol.role}</Text>
                  <Text style={styles.volunteerDescription}>{vol.description}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Awards */}
          {awards.length > 0 && (
            <View style={styles.awardsSection}>
              <Text style={styles.awardsTitle}>Awards</Text>
              {awards.map((award) => (
                <View key={award.id} style={styles.awardRow}>
                  <Text style={styles.awardTitle}>{award.title} <Text style={styles.awardIssuer}>— {award.issuer}</Text></Text>
                  <Text style={styles.awardDate}>{award.date}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};
