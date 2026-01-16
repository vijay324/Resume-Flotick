import { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog - Resume Tips, AI Insights & Career Advice | Flotick Resume",
  description:
    "Explore the Flotick Resume blog for expert tips on resume building, AI-powered career tools, job search strategies, and professional development. Learn how to create ATS-optimized resumes.",
  alternates: {
    canonical: "https://resume.flotick.org/blog",
  },
  openGraph: {
    title: "Flotick Resume Blog - Resume Tips & AI Career Insights",
    description:
      "Expert advice on resume building, AI career tools, and job search strategies from the Flotick team.",
    url: "https://resume.flotick.org/blog",
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  // Blog listing schema
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Flotick Resume Blog",
    description:
      "Expert tips on resume building, AI-powered career tools, and job search strategies.",
    url: "https://resume.flotick.org/blog",
    publisher: {
      "@type": "Organization",
      name: "Flotick",
      url: "https://Flotick.com",
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: `https://resume.flotick.org/blog/${post.slug}`,
      datePublished: post.date,
      author: {
        "@type": "Person",
        name: post.author,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />


      {/* Hero */}
      <section className="pt-26 bg-gradient-to-b from-blue-50 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Flotick Resume <span className="text-blue-600">Blog</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Expert insights on resume building, AI career tools, and job search
            strategies to help you land your dream job.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readingTime}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground">{post.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 font-medium">
                      Read more <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Build Your Resume?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Put these tips into practice with Flotick Resume, our free AI-powered
            resume builder.
          </p>
          <Link href="/builder">
            <Button size="lg" className="gap-2">
              Start Building <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Flotick Resume. A product of{" "}
            <a
              href="https://Flotick.com"
              className="font-semibold text-foreground hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Flotick
            </a>
            .
          </p>
        </div>
      </footer>
    </main>
  );
}
