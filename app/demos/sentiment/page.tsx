'use client';
import { useState } from 'react';

const positiveWords = new Set([
  'good', 'great', 'excellent', 'love', 'amazing', 'wonderful', 'fantastic',
  'happy', 'joy', 'perfect', 'best', 'awesome', 'brilliant', 'outstanding',
  'superb', 'beautiful', 'delightful', 'magnificent', 'pleasant', 'thrilled',
  'excited', 'enjoy', 'enjoyed', 'enjoying', 'incredible', 'impressive',
  'remarkable', 'exceptional', 'extraordinary', 'positive', 'nice', 'glad',
]);

const negativeWords = new Set([
  'bad', 'terrible', 'awful', 'hate', 'horrible', 'disappointing', 'worst',
  'poor', 'sad', 'angry', 'frustrating', 'dreadful', 'miserable', 'ugly',
  'boring', 'dull', 'annoying', 'disturbing', 'frightening', 'disgusting',
  'negative', 'broken', 'failed', 'failure', 'useless', 'stupid',
  'pathetic', 'mediocre', 'inferior', 'unpleasant', 'dislike', 'regret',
]);

function analyzeSentiment(text: string): { label: string; score: number; positive: number; negative: number; neutral: number } {
  const words = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
  let pos = 0;
  let neg = 0;

  for (const word of words) {
    if (positiveWords.has(word)) pos++;
    if (negativeWords.has(word)) neg++;
  }

  const total = pos + neg;
  if (total === 0) {
    return { label: 'Neutral', score: 50, positive: 0, negative: 0, neutral: 100 };
  }

  const posRatio = pos / total;
  const negRatio = neg / total;

  if (posRatio > 0.6) {
    return {
      label: 'Positive',
      score: Math.round(50 + posRatio * 50),
      positive: Math.round(posRatio * 100),
      negative: Math.round(negRatio * 100),
      neutral: Math.max(0, 100 - Math.round(posRatio * 100) - Math.round(negRatio * 100)),
    };
  } else if (negRatio > 0.6) {
    return {
      label: 'Negative',
      score: Math.round(50 + negRatio * 50),
      positive: Math.round(posRatio * 100),
      negative: Math.round(negRatio * 100),
      neutral: Math.max(0, 100 - Math.round(posRatio * 100) - Math.round(negRatio * 100)),
    };
  } else {
    return {
      label: 'Neutral',
      score: 50,
      positive: Math.round(posRatio * 100),
      negative: Math.round(negRatio * 100),
      neutral: Math.max(0, 100 - Math.round(posRatio * 100) - Math.round(negRatio * 100)),
    };
  }
}

const examples = [
  "I absolutely love this product! It's amazing and works perfectly. The quality is outstanding.",
  "This is terrible. The worst experience I've ever had. Completely disappointing and frustrating.",
  "The product arrived on time. It has the features described. Works as expected.",
];

export default function SentimentAnalyzer() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ReturnType<typeof analyzeSentiment> | null>(null);

  const analyze = () => {
    if (text.trim()) {
      setResult(analyzeSentiment(text));
    }
  };

  const labelColors: Record<string, string> = {
    Positive: 'text-green-400',
    Negative: 'text-red-400',
    Neutral: 'text-yellow-400',
  };

  const labelBg: Record<string, string> = {
    Positive: 'bg-green-500/20 border-green-500/30',
    Negative: 'bg-red-500/20 border-red-500/30',
    Neutral: 'bg-yellow-500/20 border-yellow-500/30',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          Sentiment{' '}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Analyzer
          </span>
        </h1>
        <p className="text-gray-400">
          Analyze the emotional tone of any text using lexicon-based NLP. Works entirely in your browser.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <label className="block text-gray-300 text-sm font-medium mb-3">Enter text to analyze</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full h-40 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 resize-none text-sm"
        />
        <div className="flex flex-wrap gap-2 mt-3 mb-4">
          <span className="text-gray-500 text-xs self-center">Try an example:</span>
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => { setText(ex); setResult(null); }}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs rounded-lg transition-colors border border-white/10"
            >
              Example {i + 1}
            </button>
          ))}
        </div>
        <button
          onClick={analyze}
          disabled={!text.trim()}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Analyze Sentiment
        </button>
      </div>

      {result && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl border ${labelBg[result.label]}`}>
            <span className="text-2xl">
              {result.label === 'Positive' ? '😊' : result.label === 'Negative' ? '😞' : '😐'}
            </span>
            <div>
              <div className={`text-xl font-bold ${labelColors[result.label]}`}>{result.label}</div>
              <div className="text-gray-400 text-sm">Confidence: {result.score}%</div>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Positive', value: result.positive, color: 'bg-green-500' },
              { label: 'Negative', value: result.negative, color: 'bg-red-500' },
              { label: 'Neutral', value: result.neutral, color: 'bg-yellow-500' },
            ].map((bar) => (
              <div key={bar.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{bar.label}</span>
                  <span className="text-gray-300">{bar.value}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${bar.color} rounded-full transition-all duration-700`}
                    style={{ width: `${bar.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
