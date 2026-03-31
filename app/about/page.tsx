const milestones = [
  { year: '2024', title: 'AI Consulting & Research', desc: 'Focused on LLM applications, RAG systems, and AI agent architectures for enterprise clients.' },
  { year: '2023', title: 'Multimodal AI Development', desc: 'Built vision-language applications leveraging GPT-4V and custom fine-tuned models.' },
  { year: '2022', title: 'Senior ML Engineer', desc: 'Led teams building recommendation systems and NLP pipelines processing millions of daily requests.' },
  { year: '2021', title: 'Deep Learning Research', desc: 'Published work on transformer architectures for time-series forecasting and anomaly detection.' },
  { year: '2019', title: 'Started in AI/ML', desc: 'Transitioned from software engineering to machine learning, focusing on computer vision and NLP.' },
];

const skills = [
  { category: 'ML Frameworks', items: ['TensorFlow', 'PyTorch', 'JAX', 'scikit-learn', 'HuggingFace'] },
  { category: 'Languages', items: ['Python', 'TypeScript', 'SQL', 'Rust', 'Julia'] },
  { category: 'LLM & AI', items: ['LangChain', 'OpenAI API', 'Anthropic API', 'LlamaIndex', 'AutoGen'] },
  { category: 'Infrastructure', items: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'MLflow'] },
  { category: 'Data', items: ['Pandas', 'Spark', 'dbt', 'Airflow', 'PostgreSQL'] },
  { category: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'GraphQL'] },
];

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      {/* Header */}
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          About{' '}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Me
          </span>
        </h1>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            I&apos;m an AI developer and researcher passionate about pushing the boundaries of what&apos;s possible with machine learning. With over 5 years of experience building production ML systems, I specialize in large language models, computer vision, and the emerging field of AI agents.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            My work sits at the intersection of cutting-edge AI research and practical engineering — turning state-of-the-art techniques into reliable, scalable systems that solve real problems. I&apos;ve led teams building systems that process millions of requests daily, from recommendation engines to real-time NLP pipelines.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            Beyond building, I believe deeply in the importance of responsible AI development. Every system I build incorporates thoughtful consideration of bias, fairness, transparency, and safety. I write and speak about these topics because I believe the developer community has a crucial role in shaping how AI impacts society.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8">Experience &amp; Milestones</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 to-purple-500" />
          <div className="space-y-8">
            {milestones.map((m) => (
              <div key={m.year} className="pl-12 relative">
                <div className="absolute left-0 top-1 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {m.year.slice(2)}
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="text-blue-400 text-sm font-semibold mb-1">{m.year}</div>
                  <h3 className="text-white font-semibold text-lg mb-1">{m.title}</h3>
                  <p className="text-gray-400 text-sm">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8">Skills &amp; Technologies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((group) => (
            <div key={group.category} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-blue-400 font-semibold text-sm mb-3 uppercase tracking-wide">{group.category}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-md">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Philosophy */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-8">My AI Philosophy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: '🧪 Empirical First', desc: 'Build fast, measure rigorously, iterate based on data. Intuitions about what will work are often wrong — measurement is the only ground truth.' },
            { title: '🔍 Understand Before You Build', desc: "Spend time deeply understanding the problem before reaching for a solution. The hardest part of AI is rarely the ML; it's identifying the right objective." },
            { title: '🛡️ Responsibility by Design', desc: 'Fairness, privacy, and safety are not features to add at the end — they are architectural decisions that must be made from the start.' },
            { title: '🌍 Democratize Intelligence', desc: 'The benefits of AI should be accessible to everyone. I actively work on making AI tools more approachable, explainable, and equitable.' },
          ].map((item) => (
            <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
