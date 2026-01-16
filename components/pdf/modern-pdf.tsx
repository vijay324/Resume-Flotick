/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link, Svg, Path } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    backgroundColor: '#1e3a5f',
    padding: 24,
    color: '#ffffff',
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 12,
    color: '#bfdbfe', // blue-200
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 9,
    color: '#e5e7eb', // gray-200
  },
  link: {
    color: '#e5e7eb',
    textDecoration: 'none',
  },
  // Body Layout
  body: {
    flexDirection: 'row',
    flex: 1,
  },
  leftColumn: {
    width: '65%',
    padding: 24,
    paddingRight: 16,
  },
  rightColumn: {
    width: '35%',
    backgroundColor: '#f9fafb', // gray-50
    padding: 24,
    paddingLeft: 16,
  },
  // Typography
  sectionTitle: {
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
  block: {
    marginBottom: 16,
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  blockTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  blockDate: {
    fontSize: 9,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: '2 6',
    borderRadius: 4,
  },
  blockSubtitle: {
    fontSize: 10,
    fontWeight: 'bold', // React-pdf doesn't support semi-bold well with std fonts, but bold works
    color: '#1e3a5f',
    marginBottom: 2,
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
    color: '#9ca3af',
  },
  listContent: {
    flex: 1,
    fontSize: 10,
    color: '#374151',
  },
  // Right Column Items
  sidebarSection: {
    marginBottom: 24,
  },
  sidebarTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#1e3a5f',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: '4 8',
    borderRadius: 4,
    fontSize: 9,
    color: '#374151',
  },
});

// Icon Components for Header
const Icon = ({ path }: { path: string }) => (
  <Svg viewBox="0 0 24 24" style={{ width: 10, height: 10, marginRight: 4 }}>
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
  const { personalInfo, experience, education, skills, projects, languages, certifications, awards, volunteer } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
           <Text style={styles.headerName}>{personalInfo.fullName}</Text>
           {personalInfo.jobTitle && <Text style={styles.headerTitle}>{personalInfo.jobTitle}</Text>}
           
           <View style={styles.contactRow}>
              {personalInfo.phone && (
                <View style={styles.contactItem}><PhoneIcon /><Link src={`tel:${personalInfo.phone}`} style={styles.link}>{personalInfo.phone}</Link></View>
              )}
              {personalInfo.email && (
                <View style={styles.contactItem}><MailIcon /><Link src={`mailto:${personalInfo.email}`} style={styles.link}>{personalInfo.email}</Link></View>
              )}
              {personalInfo.location && (
                <View style={styles.contactItem}><MapPinIcon /><Text>{personalInfo.location}</Text></View>
              )}
              {personalInfo.linkedin && (
                <View style={styles.contactItem}><LinkedinIcon /><Link src={personalInfo.linkedin} style={styles.link}>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</Link></View>
              )}
              {personalInfo.github && (
                <View style={styles.contactItem}><GithubIcon /><Link src={personalInfo.github} style={styles.link}>{personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}</Link></View>
              )}
              {personalInfo.website && (
                <View style={styles.contactItem}><GlobeIcon /><Link src={personalInfo.website} style={styles.link}>{personalInfo.website.replace(/^https?:\/\/(www\.)?/, "")}</Link></View>
              )}
           </View>
        </View>

        <View style={styles.body}>
          {/* Left Main Column */}
          <View style={styles.leftColumn}>
             {personalInfo.summary && (
               <View style={styles.block}>
                 <Text style={styles.sectionTitle}>About Me</Text>
                 <Text style={{ textAlign: 'justify', lineHeight: 1.5, color: '#374151' }}>{personalInfo.summary}</Text>
               </View>
             )}

             {experience.length > 0 && (
               <View style={styles.block}>
                 <Text style={styles.sectionTitle}>Work Experience</Text>
                 {experience.map(exp => (
                   <View key={exp.id} style={{ marginBottom: 16 }}>
                     <View style={styles.blockHeader}>
                        <Text style={styles.blockTitle}>{exp.position}</Text>
                        <Text style={styles.blockDate}>{exp.startDate} – {exp.endDate}</Text>
                     </View>
                     <Text style={styles.blockSubtitle}>{exp.company} {exp.location ? `• ${exp.location}` : ''}</Text>
                     <View style={styles.list}>
                        {exp.description.split('\n').map((line, i) => line.trim() && (
                          <View key={i} style={styles.listItem}>
                             <Text style={styles.bullet}>–</Text>
                             <Text style={styles.listContent}>{line.trim()}</Text>
                          </View>
                        ))}
                     </View>
                   </View>
                 ))}
               </View>
             )}

             {projects.length > 0 && (
               <View style={styles.block}>
                 <Text style={styles.sectionTitle}>Projects</Text>
                 {projects.map(proj => (
                   <View key={proj.id} style={{ marginBottom: 12 }}>
                     <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 2 }}>
                        <Text style={styles.blockTitle}>{proj.name}</Text>
                        {proj.link && <Link src={proj.link} style={{ marginLeft: 6, fontSize: 8, color: '#1e3a5f' }}>| {proj.link.replace(/^https?:\/\//, "")}</Link>}
                     </View>
                     <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap', marginBottom: 4 }}>
                       {proj.technologies.map((tech, i) => (
                         <Text key={i} style={{ fontSize: 8, backgroundColor: '#f3f4f6', padding: '1 4', borderRadius: 2, color: '#4b5563' }}>{tech}</Text>
                       ))}
                     </View>
                     <View style={styles.list}>
                        {proj.description.split('\n').map((line, i) => line.trim() && (
                          <View key={i} style={styles.listItem}>
                             <Text style={styles.bullet}>–</Text>
                             <Text style={styles.listContent}>{line.trim()}</Text>
                          </View>
                        ))}
                     </View>
                   </View>
                 ))}
               </View>
             )}
          </View>

          {/* Right Sidebar Column */}
          <View style={styles.rightColumn}>
             {skills.length > 0 && (
               <View style={styles.sidebarSection}>
                  <Text style={styles.sidebarTitle}>Skills</Text>
                  <View style={styles.tagContainer}>
                     {skills.map(skill => (
                        <Text key={skill.id} style={styles.tag}>{skill.name}</Text>
                     ))}
                  </View>
               </View>
             )}

             {education.length > 0 && (
               <View style={styles.sidebarSection}>
                  <Text style={styles.sidebarTitle}>Education</Text>
                  {education.map(edu => (
                     <View key={edu.id} style={{ marginBottom: 8 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 10 }}>{edu.institution}</Text>
                        <Text style={{ fontSize: 9, color: '#374151' }}>{edu.degree} in {edu.field}</Text>
                        <Text style={{ fontSize: 8, color: '#6b7280', marginTop: 1 }}>{edu.startDate} – {edu.endDate}</Text>
                        {edu.score && <Text style={{ fontSize: 8, color: '#1e3a5f', fontWeight: 'bold' }}>{edu.score}</Text>}
                     </View>
                  ))}
               </View>
             )}

             {languages.length > 0 && (
               <View style={styles.sidebarSection}>
                  <Text style={styles.sidebarTitle}>Languages</Text>
                  {languages.map(lang => (
                     <View key={lang.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                        <Text style={{ fontSize: 9 }}>{lang.name}</Text>
                        <Text style={{ fontSize: 9, color: '#6b7280' }}>{lang.proficiency}</Text>
                     </View>
                  ))}
               </View>
             )}

             {certifications.length > 0 && (
               <View style={styles.sidebarSection}>
                  <Text style={styles.sidebarTitle}>Certifications</Text>
                  {certifications.map(cert => (
                     <View key={cert.id} style={{ marginBottom: 6 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 9 }}>{cert.name}</Text>
                        <Text style={{ fontSize: 8, color: '#6b7280' }}>{cert.issuer} • {cert.date}</Text>
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
