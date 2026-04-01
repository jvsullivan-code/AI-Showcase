import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import BlogCard from '@/components/BlogCard';
import { blogPosts } from '@/data/blog-posts';

const featuredProjects = [
  {
    title: 'AI Research Agent',
    description: 'Conversational AI agent with step-by-step reasoning and visible tool calls. Ask anything about ML and AI — watch it plan, retrieve knowledge, and respond.',
    tags: ['AI Agents', 'TypeScript', 'Next.js'],
    demoUrl: '/demos/agent',
    githubUrl: '#',
    gradient: 'from-violet-500 to-fuchsia-500',
  },
  {
    title: 'Sentiment Analyzer',
    description: 'Real-time NLP sentiment analysis using lexicon-based approach. Analyze text and get instant positive/negative/neutral scores.',
    tags: ['NLP', 'TypeScript', 'Next.js'],
    demoUrl: '/demos/sentiment',
    githubUrl: '#',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Image Classifier',
    description: 'Browser-based image classification demo with realistic mock predictions across animals, vehicles, objects, and food categories.',
    tags: ['Computer Vision', 'React', 'TypeScript'],
    demoUrl: '/demos/image-classifier',
    githubUrl: '#',
    gradient: 'from-purple-500 to-pink-500',
  },
];

const skills = [
  { name: 'Python', icon: '🐍' },
  { name: 'TensorFlow', icon: '🔷' },
  { name: 'PyTorch', icon: '🔥' },
  { name: 'LLMs', icon: '🧠' },
  { name: 'React', icon: '⚛️' },
  { name: 'Next.js', icon: '▲' },
  { name: 'TypeScript', icon: '📘' },
  { name: 'Docker', icon: '🐳' },
  { name: 'AWS', icon: '☁️' },
  { name: 'RAG', icon: '📚' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-8">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse" />
            Available for AI consulting &amp; collaboration
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Building the </span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Future with AI
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto">
            AI Developer &amp; Thought Leader | Exploring the Frontiers of Machine Learning
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/projects"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              View My Projects
            </Link>
            <Link
              href="/blog"
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
            >
              Read My Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-gray-500 text-sm font-semibold uppercase tracking-widest mb-8">
            Tech Stack &amp; Expertise
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-gray-300 hover:border-blue-500/50 hover:text-white transition-all"
              >
                <span>{skill.icon}</span>
                <span className="text-sm font-medium">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Projects</h2>
              <p className="text-gray-400">Live demos you can interact with right now</p>
            </div>
            <Link href="/projects" className="text-blue-400 hover:text-blue-300 text-sm font-medium hidden sm:block">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Latest Insights</h2>
              <p className="text-gray-400">Thoughts on AI, ML, and the future of technology</p>
            </div>
            <Link href="/blog" className="text-purple-400 hover:text-purple-300 text-sm font-medium hidden sm:block">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
