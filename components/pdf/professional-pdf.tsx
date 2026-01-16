/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link, Svg, Path } from '@react-pdf/renderer';
import type { ResumeData, SkillItem, LanguageItem, CertificationItem, EducationItem, ExperienceItem, ProjectItem, AwardItem, VolunteerItem } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    fontFamily: 'Times-Roman',
  },
  leftColumn: {
    width: '30%',
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: 20,
    height: '100%',
  },
  rightColumn: {
    width: '70%',
    padding: 24,
    height: '100%',
  },
  // Typography
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 1.2,
  },
  jobTitle: {
    fontSize: 10,
    color: '#d1d5db', // gray-300
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: 'medium',
    marginBottom: 8,
  },
  headerDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    marginBottom: 24,
    paddingBottom: 16,
  },
  sectionTitleLeft: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    color: '#d1d5db', // gray-300
  },
  sectionTitleRight: {
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
  // Contact
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
    color: '#9ca3af', // gray-400
  },
  contactText: {
    color: 'white',
    textDecoration: 'none',
  },
  // Content Items
  skillItem: {
    marginBottom: 6,
    fontSize: 9,
  },
  skillLevel: {
    color: '#9ca3af',
    fontSize: 8,
  },
  languageItem: {
    marginBottom: 4,
    fontSize: 9,
  },
  certItem: {
    marginBottom: 8,
    fontSize: 9,
  },
  certIssuer: {
    color: '#9ca3af',
    fontSize: 8,
  },
  // Right Column Items
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 20,
    textAlign: 'justify',
    color: '#374151', // gray-700
  },
  block: {
    marginBottom: 16,
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  blockTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827', // gray-900
  },
  blockDate: {
    fontSize: 9,
    color: '#4b5563', // gray-600
    fontWeight: 'medium',
  },
  blockSubtitle: {
    fontSize: 10,
    fontWeight: 'bold', // Semibold equivalent
    color: '#2c3e50',
    marginBottom: 2,
  },
  blockLocation: {
    fontSize: 9,
    fontStyle: 'italic',
    color: '#6b7280', // gray-500
  },
  list: {
    marginTop: 4,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 10,
    fontSize: 10,
    color: '#2c3e50',
  },
  listContent: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.5,
    color: '#374151',
  },
  link: {
    color: '#374151',
    textDecoration: 'none',
  },
  linkText: {
     fontSize: 8,
     color: '#6b7280',
  }
});

interface Props {
  data: ResumeData;
}

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

export const ProfessionalPdf = ({ data }: Props) => {
  const { personalInfo, experience, education, skills, projects, languages, certifications, awards, volunteer } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Left Column */}
        <View style={styles.leftColumn}>
          <View style={styles.headerDivider}>
            <Text style={styles.name}>{personalInfo.fullName}</Text>
            {personalInfo.jobTitle && <Text style={styles.jobTitle}>{personalInfo.jobTitle}</Text>}
          </View>

          {/* Contact */}
          <View style={{ marginBottom: 24 }}>
            <Text style={styles.sectionTitleLeft}>Contact</Text>
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
            <View style={{ marginBottom: 24 }}>
              <Text style={styles.sectionTitleLeft}>Skills</Text>
              {skills.map((skill) => (
                <View key={skill.id} style={styles.skillItem}>
                  <Text>{skill.name}</Text>
                  {skill.level && <Text style={styles.skillLevel}>• {skill.level}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <Text style={styles.sectionTitleLeft}>Languages</Text>
              {languages.map((lang) => (
                <View key={lang.id} style={styles.languageItem}>
                  <Text>{lang.name} <Text style={{ color: '#9ca3af' }}>({lang.proficiency})</Text></Text>
                </View>
              ))}
            </View>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <Text style={styles.sectionTitleLeft}>Certifications</Text>
              {certifications.map((cert) => (
                <View key={cert.id} style={styles.certItem}>
                  <Text>{cert.name}</Text>
                  <Text style={styles.certIssuer}>{cert.issuer} • {cert.date}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Right Column */}
        <View style={styles.rightColumn}>
          {/* Summary */}
          {personalInfo.summary && (
             <View style={{ marginBottom: 20 }}>
                <Text style={styles.sectionTitleRight}>Profile</Text>
                <Text style={styles.summary}>{personalInfo.summary}</Text>
             </View>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              {experience.map((exp, index) => (
                <View key={exp.id} wrap={false} style={styles.block}>
                  {index === 0 && <Text style={styles.sectionTitleRight}>Experience</Text>}
                  <View style={styles.blockHeader}>
                    <Text style={styles.blockTitle}>{exp.position}</Text>
                    <Text style={styles.blockDate}>{exp.startDate} – {exp.endDate}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                     <Text style={styles.blockSubtitle}>{exp.company}</Text>
                     {exp.location && <Text style={styles.blockLocation}>{exp.location}</Text>}
                  </View>
                  <View style={styles.list}>
                    {exp.description.split('\n').map((line, i) => line.trim() && (
                      <View key={i} style={styles.listItem}>
                        <Text style={styles.bullet}>▸</Text>
                        <Text style={styles.listContent}>{line.trim()}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              {projects.map((proj, index) => (
                <View key={proj.id} wrap={false} style={styles.block}>
                   {index === 0 && <Text style={styles.sectionTitleRight}>Projects</Text>}
                   <View style={styles.blockHeader}>
                     <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                        <Text style={styles.blockTitle}>{proj.name}</Text>
                        {proj.link && (
                           <Text style={{marginLeft: 5, fontSize: 8, color: '#666'}}>
                             | <Link src={proj.link} style={styles.link}>{proj.link.replace(/^https?:\/\//, "")}</Link>
                           </Text>
                        )}
                     </View>
                   </View>
                   <Text style={{ fontSize: 9, color: '#2c3e50', fontStyle: 'italic', marginBottom: 4 }}>
                      {proj.technologies.join(" • ")}
                   </Text>
                   <View style={styles.list}>
                    {proj.description.split('\n').map((line, i) => line.trim() && (
                      <View key={i} style={styles.listItem}>
                        <Text style={styles.bullet}>▸</Text>
                        <Text style={styles.listContent}>{line.trim()}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {education.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              {education.map((edu, index) => (
                <View key={edu.id} wrap={false} style={styles.block}>
                  {index === 0 && <Text style={styles.sectionTitleRight}>Education</Text>}
                  <View style={styles.blockHeader}>
                    <Text style={styles.blockTitle}>{edu.institution}</Text>
                    <Text style={styles.blockDate}>{edu.startDate} – {edu.endDate}</Text>
                  </View>
                  <Text style={{ fontSize: 10, color: '#374151' }}>{edu.degree} in {edu.field}</Text>
                  {edu.score && <Text style={{ fontSize: 9, color: '#6b7280', fontStyle: 'italic', marginTop: 2 }}>{edu.score}</Text>}
                </View>
              ))}
            </View>
          )}

          {/* Volunteer */}
          {volunteer.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitleRight}>Volunteer</Text>
              {volunteer.map((vol) => (
                <View key={vol.id} style={styles.block}>
                  <View style={styles.blockHeader}>
                    <Text style={styles.blockTitle}>{vol.organization}</Text>
                    <Text style={styles.blockDate}>{vol.startDate} – {vol.endDate}</Text>
                  </View>
                  <Text style={{ fontSize: 10, fontStyle: 'italic', marginBottom: 2 }}>{vol.role}</Text>
                  <Text style={styles.listContent}>{vol.description}</Text>
                </View>
              ))}
            </View>
          )}

           {/* Awards */}
           {awards.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitleRight}>Awards</Text>
              {awards.map((award) => (
                <View key={award.id} style={styles.blockHeader}>
                  <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{award.title} <Text style={{ fontWeight: 'normal', color: '#666' }}>— {award.issuer}</Text></Text>
                  <Text style={styles.blockDate}>{award.date}</Text>
                </View>
              ))}
            </View>
          )}

        </View>
      </Page>
    </Document>
  );
};
