import { MetadataRoute } from "next";

// Blog posts for sitemap generation
const blogPosts = [
  "what-is-Flotick-resume",
  "how-Flotick-uses-ai",
  "best-resume-builder-enterprise",
  "optimize-resume-with-ai",
  "about-Flotick-enterprise",
  "traditional-vs-ai-resume-builders",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://resume.flotick.org";
  const currentDate = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/builder`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Blog post pages
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}

