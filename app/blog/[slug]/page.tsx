import { blogPosts } from '@/data/blog-posts';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default function BlogPost({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      {/* Back link */}
      <Link href="/blog" className="inline-flex items-center text-gray-400 hover:text-white text-sm mb-8 transition-colors">
        ← Back to Blog
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/20">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
        <div className="flex items-center gap-4 text-gray-500 text-sm">
          <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
      </div>

      {/* Author */}
      <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl mb-10">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
          AI
        </div>
        <div>
          <div className="text-white font-semibold">AI Developer</div>
          <div className="text-gray-400 text-sm">ML Engineer &amp; AI Researcher</div>
        </div>
      </div>

      {/* Content */}
      <article className="space-y-4">
        {post.content.split('\n\n').map((paragraph, i) => {
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={i} className="text-2xl font-bold text-white mt-10 mb-4">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={i} className="text-xl font-semibold text-blue-400 mt-6 mb-2">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          // Handle numbered lists
          if (/^\d+\./.test(paragraph)) {
            const lines = paragraph.split('\n').filter(Boolean);
            return (
              <ol key={i} className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
                {lines.map((line, j) => {
                  const parts = line.replace(/^\d+\.\s*/, '').split(/(\*\*[^*]+\*\*)/g);
                  return (
                    <li key={j}>
                      {parts.map((part, k) =>
                        part.startsWith('**') && part.endsWith('**') ? (
                          <strong key={k} className="text-white font-semibold">{part.replace(/\*\*/g, '')}</strong>
                        ) : part
                      )}
                    </li>
                  );
                })}
              </ol>
            );
          }
          // Handle bullet lists
          if (paragraph.startsWith('- ')) {
            const lines = paragraph.split('\n').filter((l) => l.startsWith('- '));
            return (
              <ul key={i} className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                {lines.map((line, j) => {
                  const parts = line.replace(/^- /, '').split(/(\*\*[^*]+\*\*)/g);
                  return (
                    <li key={j}>
                      {parts.map((part, k) =>
                        part.startsWith('**') && part.endsWith('**') ? (
                          <strong key={k} className="text-white font-semibold">{part.replace(/\*\*/g, '')}</strong>
                        ) : part
                      )}
                    </li>
                  );
                })}
              </ul>
            );
          }
          // Handle inline bold
          const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
          return (
            <p key={i} className="text-gray-300 leading-relaxed">
              {parts.map((part, j) =>
                part.startsWith('**') && part.endsWith('**') ? (
                  <strong key={j} className="text-white font-semibold">
                    {part.replace(/\*\*/g, '')}
                  </strong>
                ) : (
                  part
                )
              )}
            </p>
          );
        })}
      </article>

      {/* Share */}
      <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-xl">
        <h3 className="text-white font-semibold mb-4">Share this article</h3>
        <div className="flex gap-3">
          {['Twitter/X', 'LinkedIn', 'Copy Link'].map((platform) => (
            <button
              key={platform}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 text-sm rounded-lg transition-colors"
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-bold text-white mb-6">Related Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {related.map((relPost) => (
              <Link key={relPost.slug} href={`/blog/${relPost.slug}`}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-purple-500/50 transition-all">
                  <div className="text-purple-400 text-xs mb-2">{relPost.readTime}</div>
                  <h4 className="text-white font-semibold text-sm leading-snug">{relPost.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
