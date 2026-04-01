import Link from 'next/link';

interface Project {
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  gradient: string;
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className={`h-2 bg-gradient-to-r ${project.gradient}`} />
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-lg mb-2">{project.title}</h3>
        <p className="text-gray-400 text-sm mb-4 flex-1">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-3 mt-auto">
          {project.demoUrl && project.demoUrl !== '#' && (
            <Link
              href={project.demoUrl}
              className="flex-1 text-center py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
            >
              Live Demo
            </Link>
          )}
          {project.githubUrl && project.githubUrl !== '#' && (
            <a
              href={project.githubUrl}
              className="flex-1 text-center py-2 px-4 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          )}
          {project.demoUrl === '#' && (
            <span className="flex-1 text-center py-2 px-4 bg-white/5 text-gray-500 text-sm rounded-lg cursor-not-allowed border border-white/10">
              Coming Soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
