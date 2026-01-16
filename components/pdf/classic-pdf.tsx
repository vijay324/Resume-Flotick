/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link, Svg, Path } from '@react-pdf/renderer';
import type { ResumeData } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    padding: 30, // Tighter padding to match preview
    backgroundColor: '#ffffff',
    fontFamily: 'Times-Roman', // Matches preview's Georgia/Times New Roman serif
    fontSize: 10.5,
    lineHeight: 1.45, // Matching preview's leading-[1.45]
  },
  header: {
    marginBottom: 14, // Tightened header spacing
    textAlign: 'center',
    borderBottomWidth: 0,
  },
  // Wrappers to ensure spacing is respected
  nameWrapper: {
    marginBottom: 4, // Reduced from 10 to match preview
  },
  jobTitleWrapper: {
    marginBottom: 6, // Reduced from 14 to match preview
  },
  name: {
    fontSize: 28, // Matching preview's text-[28pt]
    fontFamily: 'Times-Bold', // Bold serif font to match preview
    textTransform: 'uppercase',
    letterSpacing: 1,
    lineHeight: 1.2, // Tighter line height for the name
  },
  jobTitle: {
    fontSize: 11,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10, // Reduced from 16 to tighten contact spacing
    fontSize: 9,
    color: '#666',
    marginBottom: 4, // Reduced from 8
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactLink: {
    textDecoration: 'none',
    color: '#111',
  },
  // Icon style
  icon: {
    width: 9, // Reduced slightly to match text size better for vertical alignment
    height: 9, 
    marginRight: 6, // Increased spacing between icon and text
  },
  separator: {
     display: 'none', // Hiding text separator in favor of icons/gap
  },
  section: {
    marginBottom: 16, // Reduced from 24 to tighten section spacing
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Times-Bold', // Bold serif to match preview
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 8, // Reduced from 12 for tighter spacing
    paddingBottom: 1, // Reduced from 2
  },
  // Block styles
  block: {
    marginBottom: 10, // Reduced from 16 for tighter block spacing
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  blockTitle: {
    fontSize: 12,
    fontFamily: 'Times-Bold', // Bold serif to match preview
  },
  blockDate: {
    fontSize: 10,
    color: '#4b5563',
  },
  blockSubtitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2, // Reduced from 4 for tighter spacing
  },
  blockSubtitle: {
    fontSize: 10.5,
    fontFamily: 'Times-BoldItalic', // Bold italic serif to match preview
    color: '#333',
  },
  blockLocation: {
    fontSize: 10,
    fontFamily: 'Times-Italic', // Italic serif to match preview
    color: '#666',
  },
  list: {
    marginLeft: 8, // Reduced from 10 for tighter list indentation
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 1, // Reduced from 2 for tighter list items
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

// Icon Components
const Icon = ({ path }: { path: string }) => (
  <Svg viewBox="0 0 24 24" style={styles.icon}>
    <Path d={path} fill="none" stroke="#666" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
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

// Helper function to ensure URLs have proper protocol
const normalizeUrl = (url: string): string => {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

export const ClassicPdf = ({ data }: Props) => {
  const { personalInfo, experience, education, skills, projects, languages, certifications, awards, volunteer } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.nameWrapper}>
             <Text style={styles.name}>{personalInfo.fullName}</Text>
          </View>
          {personalInfo.jobTitle && (
            <View style={styles.jobTitleWrapper}>
               <Text style={styles.jobTitle}>{personalInfo.jobTitle}</Text>
            </View>
          )}
          
          <View style={styles.contactRow}>
            {personalInfo.phone && (
                <View style={styles.contactItem}>
                    <PhoneIcon />
                    <Link src={`tel:${personalInfo.phone}`} style={styles.contactLink}>{personalInfo.phone}</Link>
                </View>
            )}
            {personalInfo.email && (
                <View style={styles.contactItem}>
                    <MailIcon />
                    <Link src={`mailto:${personalInfo.email}`} style={styles.contactLink}>{personalInfo.email}</Link>
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
                    <Link src={normalizeUrl(personalInfo.linkedin)} style={styles.contactLink}>
                       {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                    </Link>
                </View>
             )}
             {personalInfo.github && (
                <View style={styles.contactItem}>
                    <GithubIcon />
                    <Link src={normalizeUrl(personalInfo.github)} style={styles.contactLink}>
                       {personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}
                    </Link>
                </View>
             )}
             {personalInfo.website && (
                <View style={styles.contactItem}>
                    <GlobeIcon />
                    <Link src={normalizeUrl(personalInfo.website)} style={styles.contactLink}>
                       {personalInfo.website.replace(/^https?:\/\/(www\.)?/, "")}
                    </Link>
                </View>
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
              <Text style={{ fontFamily: 'Times-Bold' }}>Technical Proficiency: </Text>
              {skills.map(s => s.name).join(" • ")}
            </Text>
          </View>
        )}

        {experience.length > 0 && (
          <View style={styles.section}>
            {experience.map((exp, index) => (
              <View key={exp.id} wrap={false} style={styles.block}>
                {index === 0 && <Text style={styles.sectionTitle}>Work Experience</Text>}
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
             {projects.map((proj, index) => (
              <View key={proj.id} wrap={false} style={styles.block}>
                 {index === 0 && <Text style={styles.sectionTitle}>Projects</Text>}
                <View style={styles.blockHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.blockTitle, { fontSize: 11 }]}>{proj.name}</Text>
                    {proj.link && (
                      <Link src={normalizeUrl(proj.link)} style={{ marginLeft: 6, fontSize: 9, color: '#666', textDecoration: 'underline' }}>
                        | {proj.link.replace(/^https?:\/\//, "")}
                      </Link>
                    )}
                  </View>
                </View>
                <Text style={{ fontSize: 9.5, fontFamily: 'Times-Italic', marginBottom: 2 }}>
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
              {education.map((edu, index) => (
                <View key={edu.id} wrap={false} style={[styles.block, { marginBottom: 6 }]}>
                   {index === 0 && <Text style={styles.sectionTitle}>Education</Text>}
                   <View style={styles.blockHeader}>
                     <View>
                        <Text style={{ fontFamily: 'Times-Bold' }}>{edu.institution}</Text>
                        <Text>{edu.degree} in {edu.field}</Text>
                     </View>
                     <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.blockDate}>{edu.startDate} – {edu.endDate}</Text>
                        {edu.score && <Text style={{ fontSize: 9, fontFamily: 'Times-Italic', color: '#666' }}>Score: {edu.score}</Text>}
                     </View>
                   </View>
                </View>
              ))}
          </View>
        )}

        {(certifications.length > 0 || languages.length > 0) && (
           <View style={{ flexDirection: 'row', gap: 14 }}>
              {certifications.length > 0 && (
                 <View style={{ flex: 1 }}>
                    <Text style={styles.sectionTitle}>Certifications</Text>
                    {certifications.map((cert) => (
                       <View key={cert.id} style={{ marginBottom: 4 }}>
                          <Text style={{ fontFamily: 'Times-Bold' }}>{cert.name} <Text style={{ fontFamily: 'Times-Roman', color: '#666' }}>— {cert.issuer}</Text></Text>
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
