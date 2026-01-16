import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBlogPosts, getBlogPost } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    alternates: {
      canonical: `https://resume.flotick.org/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://resume.flotick.org/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

// Simple markdown to HTML converter
function renderContent(content: string): string {
  return content
    .split("\n")
    .map((line) => {
      // Headers
      if (line.startsWith("# ")) {
        return `<h1 class="text-3xl font-bold mt-8 mb-4">${line.slice(2)}</h1>`;
      }
      if (line.startsWith("## ")) {
        return `<h2 class="text-2xl font-bold mt-8 mb-4">${line.slice(3)}</h2>`;
      }
      if (line.startsWith("### ")) {
        return `<h3 class="text-xl font-semibold mt-6 mb-3">${line.slice(4)}</h3>`;
      }
      // Bold
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
      // Links
      line = line.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');
      // List items
      if (line.startsWith("- ")) {
        return `<li class="ml-4">${line.slice(2)}</li>`;
      }
      if (line.match(/^\d+\. /)) {
        return `<li class="ml-4">${line.replace(/^\d+\. /, "")}</li>`;
      }
      // Table handling (simple)
      if (line.startsWith("|")) {
        return ""; // Skip table markdown for now
      }
      // Empty lines become paragraph breaks
      if (line.trim() === "") {
        return "<br/>";
      }
      // Regular paragraphs
      return `<p class="mb-4 text-muted-foreground leading-relaxed">${line}</p>`;
    })
    .join("\n");
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // BlogPosting schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Flotick",
      url: "https://Flotick.com",
      logo: {
        "@type": "ImageObject",
        url: "https://Flotick.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://resume.flotick.org/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
  };

  const allPosts = getAllBlogPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

     

      {/* Article */}
      <article className="pt-26 pb-14">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
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
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {post.title}
            </h1>
            <p className="text-xl text-muted-foreground">{post.description}</p>
            <div className="flex items-center gap-2 flex-wrap mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
          />

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl bg-blue-50 border border-blue-100 text-center">
            <h3 className="text-xl font-bold mb-2">
              Ready to Build Your Resume?
            </h3>
            <p className="text-muted-foreground mb-4">
              Try Flotick Resume for free and create your professional resume in
              minutes.
            </p>
            <Link href="/builder">
              <Button className="gap-2">
                Start Building Now
              </Button>
            </Link>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid gap-4">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all"
                  >
                    <h3 className="font-semibold hover:text-blue-600">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {relatedPost.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
