'use client';
import { useState } from 'react';

const stopWords = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
  'shall', 'can', 'not', 'no', 'nor', 'so', 'yet', 'both', 'either',
  'neither', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'than', 'that', 'this', 'these', 'those', 'i', 'me', 'my', 'we', 'our',
  'you', 'your', 'he', 'him', 'his', 'she', 'her', 'it', 'its', 'they',
  'them', 'their', 'what', 'which', 'who', 'how', 'when', 'where', 'why',
  'all', 'any', 'just', 'also', 'very', 'as', 'if', 'then', 'because',
]);

interface TextStats {
  wordCount: number;
  charCount: number;
  charNoSpaces: number;
  sentenceCount: number;
  paragraphCount: number;
  avgWordLength: number;
  readingTime: number;
  fleschScore: number;
  fleschLabel: string;
  keywords: { word: string; count: number }[];
}

function analyzeText(text: string): TextStats {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = text.length;
  const charNoSpaces = text.replace(/\s/g, '').length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = sentences.length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const paragraphCount = Math.max(1, paragraphs.length);

  const totalWordLen = words.reduce((acc, w) => acc + w.replace(/[^a-zA-Z]/g, '').length, 0);
  const avgWordLength = wordCount > 0 ? parseFloat((totalWordLen / wordCount).toFixed(1)) : 0;

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const syllableCount = words.reduce((acc, word) => {
    const clean = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!clean) return acc;
    const vowels = clean.match(/[aeiouy]+/g);
    return acc + Math.max(1, vowels ? vowels.length : 1);
  }, 0);

  const avgSyllablesPerWord = wordCount > 0 ? syllableCount / wordCount : 0;
  const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  const fleschScore = Math.max(0, Math.min(100, Math.round(
    206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord
  )));

  let fleschLabel = 'Very Difficult';
  if (fleschScore >= 90) fleschLabel = 'Very Easy';
  else if (fleschScore >= 70) fleschLabel = 'Easy';
  else if (fleschScore >= 60) fleschLabel = 'Standard';
  else if (fleschScore >= 50) fleschLabel = 'Fairly Difficult';
  else if (fleschScore >= 30) fleschLabel = 'Difficult';

  const freq: Record<string, number> = {};
  for (const word of words) {
    const clean = word.toLowerCase().replace(/[^a-z]/g, '');
    if (clean.length > 2 && !stopWords.has(clean)) {
      freq[clean] = (freq[clean] || 0) + 1;
    }
  }
  const keywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));

  return {
    wordCount, charCount, charNoSpaces, sentenceCount, paragraphCount,
    avgWordLength, readingTime, fleschScore, fleschLabel, keywords,
  };
}

const sampleText = `Artificial intelligence is transforming the way we build software. Machine learning models can now understand natural language, recognize images, and generate creative content with remarkable accuracy.

The development of large language models has been particularly significant. These systems learn from vast amounts of text data and can perform complex reasoning tasks. However, building responsible AI systems requires careful consideration of bias, fairness, and transparency.

Modern AI applications combine multiple techniques including supervised learning, reinforcement learning, and neural network architectures. The field continues to evolve rapidly, with new breakthroughs emerging regularly.`;

export default function TextAnalyzer() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState<TextStats | null>(null);

  const analyze = () => {
    if (text.trim()) {
      setStats(analyzeText(text));
    }
  };

  const fleschColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          Text{' '}
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Analyzer
          </span>
        </h1>
        <p className="text-gray-400">
          Comprehensive text statistics, readability scores, and keyword extraction. Runs entirely in your browser.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-3">Enter your text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          className="w-full h-48 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 resize-none text-sm"
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => { setText(sampleText); setStats(null); }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 text-sm rounded-lg transition-colors"
          >
            Load Sample
          </button>
          <button
            onClick={analyze}
            disabled={!text.trim()}
            className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Analyze Text
          </button>
        </div>
      </div>

      {stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Words', value: stats.wordCount.toLocaleString() },
              { label: 'Characters', value: stats.charCount.toLocaleString() },
              { label: 'Sentences', value: stats.sentenceCount.toLocaleString() },
              { label: 'Reading Time', value: `${stats.readingTime} min` },
              { label: 'Paragraphs', value: stats.paragraphCount.toLocaleString() },
              { label: 'Avg Word Length', value: `${stats.avgWordLength} chars` },
              { label: 'Chars (no spaces)', value: stats.charNoSpaces.toLocaleString() },
              { label: 'Words/Sentence', value: stats.sentenceCount > 0 ? Math.round(stats.wordCount / stats.sentenceCount) : 0 },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Readability Score (Flesch-Kincaid)</h3>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className={`text-5xl font-bold ${fleschColor(stats.fleschScore)}`}>{stats.fleschScore}</div>
                <div className={`text-sm mt-1 ${fleschColor(stats.fleschScore)}`}>{stats.fleschLabel}</div>
              </div>
              <div className="flex-1">
                <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full transition-all duration-700"
                    style={{ width: `${stats.fleschScore}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Very Difficult</span>
                  <span>Standard</span>
                  <span>Very Easy</span>
                </div>
              </div>
            </div>
          </div>

          {stats.keywords.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Top Keywords</h3>
              <div className="space-y-2">
                {stats.keywords.map((kw, i) => (
                  <div key={kw.word} className="flex items-center gap-3">
                    <span className="text-gray-500 text-xs w-6 text-right">{i + 1}.</span>
                    <span className="text-white text-sm font-medium w-28">{kw.word}</span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        style={{ width: `${(kw.count / stats.keywords[0].count) * 100}%` }}
                      />
                    </div>
                    <span className="text-gray-400 text-xs w-16 text-right">{kw.count}×</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
