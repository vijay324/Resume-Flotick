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
    padding: 20,
    fontFamily: 'Times-Roman',
    fontSize: 10,
    lineHeight: 1.4,
    color: '#000000',
  },
  
  // Header
  header: {
    marginBottom: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 8,
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
    marginTop: 4,
    marginBottom: 5,
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
    gap: 2,
  },
  contactIcon: {
    width: 9,
    height: 9,
    marginRight: 1,
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
    marginBottom: 6,
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

// Icon Components - SVG paths for contact icons
const Icon = ({ d }: { d: string }) => (
  <Svg viewBox="0 0 24 24" style={styles.contactIcon}>
    <Path d={d} fill="#000000" />
  </Svg>
);

const PhoneIcon = () => <Icon d="M9.36556 10.6821C10.302 12.3288 11.6712 13.698 13.3179 14.6344L14.2024 13.3961C14.4965 12.9845 15.0516 12.8573 15.4956 13.0998C16.9024 13.8683 18.4571 14.3353 20.0789 14.4637C20.599 14.5049 21 14.9389 21 15.4606V19.9234C21 20.4361 20.6122 20.8657 20.1022 20.9181C19.5723 20.9726 19.0377 21 18.5 21C9.93959 21 3 14.0604 3 5.5C3 4.96227 3.02742 4.42771 3.08189 3.89776C3.1343 3.38775 3.56394 3 4.07665 3H8.53942C9.0611 3 9.49513 3.40104 9.5363 3.92109C9.66467 5.54288 10.1317 7.09764 10.9002 8.50444C11.1427 8.9484 11.0155 9.50354 10.6039 9.79757L9.36556 10.6821ZM6.84425 10.0252L8.7442 8.66809C8.20547 7.50514 7.83628 6.27183 7.64727 5H5.00907C5.00303 5.16632 5 5.333 5 5.5C5 12.9558 11.0442 19 18.5 19C18.667 19 18.8337 18.997 19 18.9909V16.3527C17.7282 16.1637 16.4949 15.7945 15.3319 15.2558L13.9748 17.1558C13.4258 16.9425 12.8956 16.6915 12.3874 16.4061L12.3293 16.373C10.3697 15.2587 8.74134 13.6303 7.627 11.6707L7.59394 11.6126C7.30849 11.1044 7.05754 10.5742 6.84425 10.0252Z" />;
const MailIcon = () => <Icon d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM20 7.23792L12.0718 14.338L4 7.21594V19H20V7.23792ZM4.51146 5L12.0619 11.662L19.501 5H4.51146Z" />;
const MapPinIcon = () => <Icon d="M12 20.8995L16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995ZM12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15Z" />;
const LinkedinIcon = () => <Icon d="M4.00098 3H20.001C20.5533 3 21.001 3.44772 21.001 4V20C21.001 20.5523 20.5533 21 20.001 21H4.00098C3.44869 21 3.00098 20.5523 3.00098 20V4C3.00098 3.44772 3.44869 3 4.00098 3ZM5.00098 5V19H19.001V5H5.00098ZM7.50098 9C6.67255 9 6.00098 8.32843 6.00098 7.5C6.00098 6.67157 6.67255 6 7.50098 6C8.3294 6 9.00098 6.67157 9.00098 7.5C9.00098 8.32843 8.3294 9 7.50098 9ZM6.50098 10H8.50098V17.5H6.50098V10ZM12.001 10.4295C12.5854 9.86534 13.2665 9.5 14.001 9.5C16.072 9.5 17.501 11.1789 17.501 13.25V17.5H15.501V13.25C15.501 12.2835 14.7175 11.5 13.751 11.5C12.7845 11.5 12.001 12.2835 12.001 13.25V17.5H10.001V10H12.001V10.4295Z" />;
const GithubIcon = () => <Icon d="M5.88401 18.6533C5.58404 18.4526 5.32587 18.1975 5.0239 17.8369C4.91473 17.7065 4.47283 17.1524 4.55811 17.2583C4.09533 16.6833 3.80296 16.417 3.50156 16.3089C2.9817 16.1225 2.7114 15.5499 2.89784 15.0301C3.08428 14.5102 3.65685 14.2399 4.17672 14.4263C4.92936 14.6963 5.43847 15.1611 6.12425 16.0143C6.03025 15.8974 6.46364 16.441 6.55731 16.5529C6.74784 16.7804 6.88732 16.9182 6.99629 16.9911C7.20118 17.1283 7.58451 17.1874 8.14709 17.1311C8.17065 16.7489 8.24136 16.3783 8.34919 16.0358C5.38097 15.3104 3.70116 13.3952 3.70116 9.63971C3.70116 8.40085 4.0704 7.28393 4.75917 6.3478C4.5415 5.45392 4.57433 4.37284 5.06092 3.15636C5.1725 2.87739 5.40361 2.66338 5.69031 2.57352C5.77242 2.54973 5.81791 2.53915 5.89878 2.52673C6.70167 2.40343 7.83573 2.69705 9.31449 3.62336C10.181 3.41879 11.0885 3.315 12.0012 3.315C12.9129 3.315 13.8196 3.4186 14.6854 3.62277C16.1619 2.69 17.2986 2.39649 18.1072 2.52651C18.1919 2.54013 18.2645 2.55783 18.3249 2.57766C18.6059 2.66991 18.8316 2.88179 18.9414 3.15636C19.4279 4.37256 19.4608 5.45344 19.2433 6.3472C19.9342 7.28337 20.3012 8.39208 20.3012 9.63971C20.3012 13.3968 18.627 15.3048 15.6588 16.032C15.7837 16.447 15.8496 16.9105 15.8496 17.4121C15.8496 18.0765 15.8471 18.711 15.8424 19.4225C15.8412 19.6127 15.8397 19.8159 15.8375 20.1281C16.2129 20.2109 16.5229 20.5077 16.6031 20.9089C16.7114 21.4504 16.3602 21.9773 15.8186 22.0856C14.6794 22.3134 13.8353 21.5538 13.8353 20.5611C13.8353 20.4708 13.836 20.3417 13.8375 20.1145C13.8398 19.8015 13.8412 19.599 13.8425 19.4094C13.8471 18.7019 13.8496 18.0716 13.8496 17.4121C13.8496 16.7148 13.6664 16.2602 13.4237 16.051C12.7627 15.4812 13.0977 14.3973 13.965 14.2999C16.9314 13.9666 18.3012 12.8177 18.3012 9.63971C18.3012 8.68508 17.9893 7.89571 17.3881 7.23559C17.1301 6.95233 17.0567 6.54659 17.199 6.19087C17.3647 5.77663 17.4354 5.23384 17.2941 4.57702L17.2847 4.57968C16.7928 4.71886 16.1744 5.0198 15.4261 5.5285C15.182 5.69438 14.8772 5.74401 14.5932 5.66413C13.7729 5.43343 12.8913 5.315 12.0012 5.315C11.111 5.315 10.2294 5.43343 9.40916 5.66413C9.12662 5.74359 8.82344 5.69492 8.57997 5.53101C7.8274 5.02439 7.2056 4.72379 6.71079 4.58376C6.56735 5.23696 6.63814 5.77782 6.80336 6.19087C6.94565 6.54659 6.87219 6.95233 6.61423 7.23559C6.01715 7.8912 5.70116 8.69376 5.70116 9.63971C5.70116 12.8116 7.07225 13.9683 10.023 14.2999C10.8883 14.3971 11.2246 15.4769 10.5675 16.0482C10.3751 16.2156 10.1384 16.7802 10.1384 17.4121V20.5611C10.1384 21.5474 9.30356 22.2869 8.17878 22.09C7.63476 21.9948 7.27093 21.4766 7.36613 20.9326C7.43827 20.5204 7.75331 20.2116 8.13841 20.1276V19.1381C7.22829 19.1994 6.47656 19.0498 5.88401 18.6533Z" />;
const GlobeIcon = () => <Icon d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM9.71002 19.6674C8.74743 17.6259 8.15732 15.3742 8.02731 13H4.06189C4.458 16.1765 6.71639 18.7747 9.71002 19.6674ZM10.0307 13C10.1811 15.4388 10.8778 17.7297 12 19.752C13.1222 17.7297 13.8189 15.4388 13.9693 13H10.0307ZM19.9381 13H15.9727C15.8427 15.3742 15.2526 17.6259 14.29 19.6674C17.2836 18.7747 19.542 16.1765 19.9381 13ZM4.06189 11H8.02731C8.15732 8.62577 8.74743 6.37407 9.71002 4.33256C6.71639 5.22533 4.458 7.8235 4.06189 11ZM10.0307 11H13.9693C13.8189 8.56122 13.1222 6.27025 12 4.24799C10.8778 6.27025 10.1811 8.56122 10.0307 11ZM14.29 4.33256C15.2526 6.37407 15.8427 8.62577 15.9727 11H19.9381C19.542 7.8235 17.2836 5.22533 14.29 4.33256Z" />;

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
              <View style={styles.contactItem}>
                <PhoneIcon />
                <Link src={`tel:${personalInfo.phone}`} style={styles.contactText}>{personalInfo.phone}</Link>
              </View>
            )}
            
            {personalInfo.email && (
              <>
                {personalInfo.phone && <ContactSeparator />}
                <View style={styles.contactItem}>
                  <MailIcon />
                  <Link src={`mailto:${personalInfo.email}`} style={styles.contactText}>{personalInfo.email}</Link>
                </View>
              </>
            )}

            {personalInfo.location && (
              <>
                {(personalInfo.phone || personalInfo.email) && <ContactSeparator />}
                <View style={styles.contactItem}>
                  <MapPinIcon />
                  <Text style={styles.contactText}>{personalInfo.location}</Text>
                </View>
              </>
            )}

            {personalInfo.linkedin && (
              <>
                <ContactSeparator />
                <View style={styles.contactItem}>
                  <LinkedinIcon />
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
                  <GithubIcon />
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
                  <GlobeIcon />
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

