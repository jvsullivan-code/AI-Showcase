import Link from 'next/link';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
}

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 h-full">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/20">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}
