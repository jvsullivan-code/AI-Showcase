import BlogCard from '@/components/BlogCard';
import { blogPosts } from '@/data/blog-posts';

export default function Blog() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          AI{' '}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Insights
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Thoughts, tutorials, and deep-dives on artificial intelligence, machine learning, and the future of technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
