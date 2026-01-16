/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Times-Roman',
    fontSize: 10.5,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 0,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 11,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    fontSize: 9,
    color: '#666',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactLink: {
    textDecoration: 'none',
    color: '#111',
  },
  separator: {
    marginHorizontal: 4,
    color: '#ccc',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 8,
    paddingBottom: 2,
  },
  // Block styles
  block: {
    marginBottom: 12,
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  blockTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  blockDate: {
    fontSize: 10,
    color: '#4b5563',
  },
  blockSubtitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  blockSubtitle: {
    fontSize: 10.5,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#333',
  },
  blockLocation: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#666',
  },
  list: {
    marginLeft: 10,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 10,
    fontSize: 10,
  },
  listContent: {
    flex: 1,
    textAlign: 'justify',
  },
  skillsText: {
    textAlign: 'justify',
  },
});

interface Props {
  data: ResumeData;
}

export const ClassicPdf = ({ data }: Props) => {
  const { personalInfo, experience, education, skills, projects, languages, certifications, awards, volunteer } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName}</Text>
          {personalInfo.jobTitle && <Text style={styles.jobTitle}>{personalInfo.jobTitle}</Text>}
          
          <View style={styles.contactRow}>
            {personalInfo.phone && <Link src={`tel:${personalInfo.phone}`} style={styles.contactLink}>{personalInfo.phone}</Link>}
            {personalInfo.phone && personalInfo.email && <Text style={styles.separator}>•</Text>}
            {personalInfo.email && <Link src={`mailto:${personalInfo.email}`} style={styles.contactLink}>{personalInfo.email}</Link>}
            
            {(personalInfo.phone || personalInfo.email) && personalInfo.location && <Text style={styles.separator}>•</Text>}
            {personalInfo.location && <Text>{personalInfo.location}</Text>}
          </View>
          
          <View style={[styles.contactRow, { marginTop: 4 }]}>
             {personalInfo.linkedin && (
                <Link src={personalInfo.linkedin} style={styles.contactLink}>
                   {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                </Link>
             )}
             {personalInfo.linkedin && personalInfo.github && <Text style={styles.separator}>•</Text>}
             {personalInfo.github && (
                <Link src={personalInfo.github} style={styles.contactLink}>
                   {personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}
                </Link>
             )}
             {(personalInfo.linkedin || personalInfo.github) && personalInfo.website && <Text style={styles.separator}>•</Text>}
             {personalInfo.website && (
                <Link src={personalInfo.website} style={styles.contactLink}>
                   {personalInfo.website.replace(/^https?:\/\/(www\.)?/, "")}
                </Link>
             )}
          </View>
        </View>

        {personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={{ textAlign: 'justify' }}>{personalInfo.summary}</Text>
          </View>
        )}

        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skillsText}>
              <Text style={{ fontWeight: 'bold' }}>Technical Proficiency: </Text>
              {skills.map(s => s.name).join(" • ")}
            </Text>
          </View>
        )}

        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={styles.block}>
                <View style={styles.blockHeader}>
                  <Text style={styles.blockTitle}>{exp.position}</Text>
                  <Text style={styles.blockDate}>{exp.startDate} – {exp.endDate}</Text>
                </View>
                <View style={styles.blockSubtitleRow}>
                  <Text style={styles.blockSubtitle}>{exp.company}</Text>
                  {exp.location && <Text style={styles.blockLocation}>{exp.location}</Text>}
                </View>
                <View style={styles.list}>
                  {exp.description.split('\n').map((line, i) => line.trim() && (
                    <View key={i} style={styles.listItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.listContent}>{line.trim()}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={styles.block}>
                <View style={styles.blockHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.blockTitle, { fontSize: 11 }]}>{proj.name}</Text>
                    {proj.link && (
                      <Link src={proj.link} style={{ marginLeft: 6, fontSize: 9, color: '#666', textDecoration: 'underline' }}>
                        | {proj.link.replace(/^https?:\/\//, "")}
                      </Link>
                    )}
                  </View>
                </View>
                <Text style={{ fontSize: 9.5, fontStyle: 'italic', marginBottom: 2 }}>
                  Technologies: {proj.technologies.join(", ")}
                </Text>
                <View style={styles.list}>
                  {proj.description.split('\n').map((line, i) => line.trim() && (
                    <View key={i} style={styles.listItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.listContent}>{line.trim()}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {education.map((edu) => (
                <View key={edu.id} style={[styles.blockHeader, { marginBottom: 6 }]}>
                   <View>
                      <Text style={{ fontWeight: 'bold' }}>{edu.institution}</Text>
                      <Text>{edu.degree} in {edu.field}</Text>
                   </View>
                   <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.blockDate}>{edu.startDate} – {edu.endDate}</Text>
                      {edu.score && <Text style={{ fontSize: 9, fontStyle: 'italic', color: '#666' }}>Score: {edu.score}</Text>}
                   </View>
                </View>
              ))}
          </View>
        )}

        {(certifications.length > 0 || languages.length > 0) && (
           <View style={{ flexDirection: 'row', gap: 20 }}>
              {certifications.length > 0 && (
                 <View style={{ flex: 1 }}>
                    <Text style={styles.sectionTitle}>Certifications</Text>
                    {certifications.map((cert) => (
                       <View key={cert.id} style={{ marginBottom: 4 }}>
                          <Text style={{ fontWeight: 'bold' }}>{cert.name} <Text style={{ fontWeight: 'normal', color: '#666' }}>— {cert.issuer}</Text></Text>
                          <Text style={{ fontSize: 9, color: '#666' }}>{cert.date}</Text>
                       </View>
                    ))}
                 </View>
              )}
              {languages.length > 0 && (
                 <View style={{ flex: 1 }}>
                    <Text style={styles.sectionTitle}>Languages</Text>
                     <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Text>
                           {languages.map((lang, i) => (
                              <Text key={lang.id}>{lang.name} ({lang.proficiency}){i < languages.length - 1 ? ' • ' : ''}</Text>
                           ))}
                        </Text>
                     </View>
                 </View>
              )}
           </View>
        )}
      </Page>
    </Document>
  );
};
