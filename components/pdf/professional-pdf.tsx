/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link, Svg, Path } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';

/**
 * Professional Two-Column PDF Template
 * 
 * Style: Clean, Serif (Times-Roman), Two-Column.
 * Header: Centered, Full Width.
 * Body: Left (Skills/Edu) vs Right (Exp/Proj).
 */

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Times-Roman',
    fontSize: 10,
    lineHeight: 1.4,
    color: '#000000',
  },
  
  // Header
  header: {
    marginBottom: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  jobTitle: {
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 9,
    color: '#000000',
    textDecoration: 'none',
  },
  separator: {
    marginHorizontal: 5,
    color: '#000000',
  },

  // Layout
  columns: {
    flexDirection: 'row',
    gap: 20,
  },
  leftColumn: {
    width: '30%',
  },
  rightColumn: {
    width: '70%',
  },

  // Section Styles
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginBottom: 8,
    paddingBottom: 2,
    letterSpacing: 1,
  },

  // Content Styles
  block: {
    marginBottom: 10,
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  italicText: {
    fontStyle: 'italic',
    fontSize: 10,
  },
  dateText: {
    fontSize: 9,
    textAlign: 'right',
  },
  techStack: {
    fontSize: 9,
    fontStyle: 'italic',
    marginBottom: 2,
  },
  
  // Lists
  bulletList: {
    marginTop: 2,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 5,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
  },
  bulletContent: {
    flex: 1,
    fontSize: 10,
  },

  // Left Column Specific
  skillItem: {
    marginBottom: 2,
    fontSize: 10,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    fontSize: 10,
  },
});

interface Props {
  data: ResumeData;
}

export const ProfessionalPdf = ({ data }: Props) => {
  const { personalInfo, experience, education, skills, projects, languages, certifications, awards, volunteer } = data;

  const ContactSeparator = () => <Text style={styles.separator}>|</Text>;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName}</Text>
          {personalInfo.jobTitle && <Text style={styles.jobTitle}>{personalInfo.jobTitle}</Text>}
          
          <View style={styles.contactRow}>
            {personalInfo.phone && (
              <View style={styles.contactItem}><Link src={`tel:${personalInfo.phone}`} style={styles.contactText}>{personalInfo.phone}</Link></View>
            )}
            
            {personalInfo.email && (
              <>
                {personalInfo.phone && <ContactSeparator />}
                <View style={styles.contactItem}><Link src={`mailto:${personalInfo.email}`} style={styles.contactText}>{personalInfo.email}</Link></View>
              </>
            )}

            {personalInfo.location && (
              <>
                {(personalInfo.phone || personalInfo.email) && <ContactSeparator />}
                <View style={styles.contactItem}><Text style={styles.contactText}>{personalInfo.location}</Text></View>
              </>
            )}

            {personalInfo.linkedin && (
              <>
                <ContactSeparator />
                <View style={styles.contactItem}>
                  <Link src={personalInfo.linkedin} style={styles.contactText}>
                    linkedin.com/in/{personalInfo.linkedin.split('linkedin.com/in/')[1] || 'profile'}
                  </Link>
                </View>
              </>
            )}
            
            {personalInfo.github && (
              <>
                <ContactSeparator />
                <View style={styles.contactItem}>
                  <Link src={personalInfo.github} style={styles.contactText}>
                    github.com/{personalInfo.github.split('github.com/')[1] || 'profile'}
                  </Link>
                </View>
              </>
            )}

            {personalInfo.website && (
              <>
                <ContactSeparator />
                <View style={styles.contactItem}>
                   <Link src={personalInfo.website} style={styles.contactText}>
                    {personalInfo.website.replace(/^https?:\/\/(www\.)?/, "")}
                  </Link>
                </View>
              </>
            )}
          </View>
        </View>

        <View style={styles.columns}>
          
          {/* ===== LEFT COLUMN (30%) ===== */}
          <View style={styles.leftColumn}>
            
            {/* Education */}
            {education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {education.map((edu) => (
                  <View key={edu.id} style={styles.block}>
                    <Text style={styles.boldText}>{edu.institution}</Text>
                    <Text style={styles.italicText}>{edu.degree} in {edu.field}</Text>
                    <Text style={styles.dateText}>{edu.startDate} – {edu.endDate}</Text>
                    {edu.score && <Text style={{fontSize: 9, marginTop: 1}}>{edu.score}</Text>}
                  </View>
                ))}
              </View>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                 {skills.map((skill) => (
                  <Text key={skill.id} style={styles.skillItem}>• {skill.name}</Text>
                ))}
              </View>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Languages</Text>
                {languages.map((lang) => (
                  <View key={lang.id} style={styles.languageItem}>
                    <Text style={styles.boldText}>{lang.name}</Text>
                    <Text style={styles.italicText}>{lang.proficiency}</Text>
                  </View>
                ))}
              </View>
            )}
            
            {/* Certifications */}
            {certifications.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                {certifications.map((cert) => (
                  <View key={cert.id} style={styles.block}>
                    <Text style={styles.boldText}>{cert.name}</Text>
                    <Text style={{fontSize: 9}}>{cert.issuer}</Text>
                    <Text style={styles.dateText}>{cert.date}</Text>
                  </View>
                ))}
              </View>
            )}
            
             {/* Awards - If sparse, can go here */}
            {awards.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Awards</Text>
                {awards.map((award) => (
                  <View key={award.id} style={styles.block}>
                     <Text style={styles.boldText}>{award.title}</Text>
                     <Text style={{fontSize: 9}}>{award.issuer}</Text>
                     <Text style={styles.dateText}>{award.date}</Text>
                  </View>
                ))}
              </View>
            )}

          </View>

          {/* ===== RIGHT COLUMN (70%) ===== */}
          <View style={styles.rightColumn}>
            
            {/* Summary */}
            {personalInfo.summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professional Summary</Text>
                <Text style={{textAlign: 'justify'}}>{personalInfo.summary}</Text>
              </View>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professional Experience</Text>
                {experience.map((exp) => (
                  <View key={exp.id} style={styles.block} wrap={false}>
                    <View style={styles.blockHeader}>
                      <Text style={styles.boldText}>{exp.position}</Text>
                      <Text style={styles.dateText}>{exp.startDate} – {exp.endDate}</Text>
                    </View>
                    <View style={styles.blockHeader}>
                       <Text style={styles.italicText}>{exp.company}</Text>
                       {exp.location && <Text style={styles.italicText}>{exp.location}</Text>}
                    </View>
                    
                    <View style={styles.bulletList}>
                      {exp.description.split('\n').map((line, i) => line.trim() && (
                        <View key={i} style={styles.bulletItem}>
                          <Text style={styles.bulletPoint}>•</Text>
                          <Text style={styles.bulletContent}>{line.trim()}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Projects</Text>
                {projects.map((proj) => (
                  <View key={proj.id} style={styles.block} wrap={false}>
                    <View style={styles.blockHeader}>
                        <View style={{flexDirection: 'row'}}>
                           <Text style={styles.boldText}>{proj.name}</Text>
                           {proj.link && (
                             <Link src={proj.link} style={{marginLeft: 5, fontSize: 9, color: '#000000', textDecoration: 'none'}}>| Link</Link>
                           )}
                        </View>
                    </View>
                    <Text style={styles.techStack}>{proj.technologies.join(" • ")}</Text>
                     <View style={styles.bulletList}>
                      {proj.description.split('\n').map((line, i) => line.trim() && (
                        <View key={i} style={styles.bulletItem}>
                          <Text style={styles.bulletPoint}>•</Text>
                          <Text style={styles.bulletContent}>{line.trim()}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}

             {/* Volunteer - Right column as it's often descriptive */}
            {volunteer.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Volunteer</Text>
                {volunteer.map((vol) => (
                  <View key={vol.id} style={styles.block} wrap={false}>
                     <View style={styles.blockHeader}>
                        <Text style={styles.boldText}>{vol.organization}</Text>
                         <Text style={styles.dateText}>{vol.startDate} – {vol.endDate}</Text>
                     </View>
                     <Text style={styles.italicText}>{vol.role}</Text>
                     <Text style={{marginTop: 2}}>{vol.description}</Text>
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

