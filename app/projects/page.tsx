import ProjectCard from '@/components/ProjectCard';

const projects = [
  {
    title: 'AI Research Agent',
    description: 'Conversational AI agent that plans, retrieves knowledge, and answers questions about ML and AI. Demonstrates the ReAct agent pattern with visible step-by-step reasoning, tool calls, and a curated knowledge base across 8 specialist domains.',
    tags: ['AI Agents', 'NLP', 'TypeScript', 'Next.js'],
    demoUrl: '/demos/agent',
    githubUrl: '#',
    gradient: 'from-violet-500 to-fuchsia-500',
  },
  {
    title: 'Sentiment Analyzer',
    description: 'Real-time NLP sentiment analysis using a lexicon-based approach. Analyzes text for positive, negative, and neutral sentiment with confidence scores and visual representation.',
    tags: ['NLP', 'TypeScript', 'Next.js', 'Lexicon-based'],
    demoUrl: '/demos/sentiment',
    githubUrl: '#',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Image Classifier',
    description: 'Browser-based image classification demo with realistic predictions across 20+ categories including animals, vehicles, objects, and food. Features confidence bars and top-5 results.',
    tags: ['Computer Vision', 'React', 'TypeScript', 'MobileNet'],
    demoUrl: '/demos/image-classifier',
    githubUrl: '#',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Text Analyzer',
    description: 'Comprehensive text statistics and readability analysis. Computes Flesch-Kincaid scores, keyword extraction, sentence structure analysis, and reading time estimates.',
    tags: ['NLP', 'Readability', 'TypeScript', 'Statistics'],
    demoUrl: '/demos/text-analyzer',
    githubUrl: '#',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    title: 'AI Code Assistant',
    description: 'An intelligent code generation and explanation tool that understands programming context, suggests completions, identifies bugs, and explains complex code in plain English.',
    tags: ['LLMs', 'Code Generation', 'Python', 'AST'],
    demoUrl: '#',
    githubUrl: '#',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    title: 'Document Summarizer',
    description: 'AI-powered document summarization using extractive and abstractive techniques. Supports PDFs, Word docs, and web articles with configurable summary length and focus areas.',
    tags: ['NLP', 'Summarization', 'Python', 'Transformers'],
    demoUrl: '#',
    githubUrl: '#',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    title: 'Recommendation Engine',
    description: 'Collaborative filtering recommendation system using matrix factorization. Demonstrates user-item interactions, similarity computation, and personalized ranking.',
    tags: ['Recommender Systems', 'Collaborative Filtering', 'Python', 'NumPy'],
    demoUrl: '#',
    githubUrl: '#',
    gradient: 'from-pink-500 to-rose-500',
  },
];

export default function Projects() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          AI{' '}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Projects
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          A collection of AI and machine learning projects, from live interactive demos to research implementations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  );
}
