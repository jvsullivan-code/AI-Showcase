'use client';
import { useState, useRef } from 'react';

const categories = [
  { label: 'Golden Retriever', category: 'animals' },
  { label: 'Tabby Cat', category: 'animals' },
  { label: 'Bald Eagle', category: 'animals' },
  { label: 'Sports Car', category: 'vehicles' },
  { label: 'Mountain Bicycle', category: 'vehicles' },
  { label: 'Delivery Truck', category: 'vehicles' },
  { label: 'Laptop Computer', category: 'objects' },
  { label: 'Smartphone', category: 'objects' },
  { label: 'Hardcover Book', category: 'objects' },
  { label: 'Margherita Pizza', category: 'food' },
  { label: 'Espresso Coffee', category: 'food' },
  { label: 'Sourdough Bread', category: 'food' },
];

function getHashFromString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function generatePredictions(filename: string) {
  const hash = getHashFromString(filename);
  const topIdx = hash % categories.length;

  const others = categories
    .map((_, i) => i)
    .filter((i) => i !== topIdx)
    .sort((a, b) => (getHashFromString(filename + String(a)) % 2 === 0 ? 1 : -1) - (getHashFromString(filename + String(b)) % 2 === 0 ? 1 : -1))
    .slice(0, 4);

  const scores = [
    Math.round(60 + (hash % 30)),
    Math.round(15 + (getHashFromString(filename + '1') % 15)),
    Math.round(5 + (getHashFromString(filename + '2') % 10)),
    Math.round(2 + (getHashFromString(filename + '3') % 5)),
    Math.round(1 + (getHashFromString(filename + '4') % 3)),
  ];

  return [topIdx, ...others].map((idx, i) => ({
    label: categories[idx].label,
    category: categories[idx].category,
    confidence: scores[i],
  }));
}

export default function ImageClassifier() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState('');
  const [predictions, setPredictions] = useState<ReturnType<typeof generatePredictions> | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setFilename(file.name);
    setPredictions(null);
  };

  const classify = async () => {
    if (!filename) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPredictions(generatePredictions(filename));
    setLoading(false);
  };

  const categoryColors: Record<string, string> = {
    animals: 'text-green-400',
    vehicles: 'text-blue-400',
    objects: 'text-purple-400',
    food: 'text-orange-400',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          Image{' '}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Classifier
          </span>
        </h1>
        <p className="text-gray-400">
          Upload an image to classify it using our AI model. Demo uses MobileNet-style classification.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {imageUrl ? (
          <div className="mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Uploaded"
              className="w-full max-h-64 object-contain rounded-xl bg-black/20"
            />
            <p className="text-gray-400 text-sm mt-2 text-center">{filename}</p>
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center cursor-pointer hover:border-purple-500/50 transition-colors"
          >
            <div className="text-4xl mb-3">🖼️</div>
            <p className="text-gray-300 font-medium mb-1">Click to upload an image</p>
            <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          {imageUrl && (
            <button
              onClick={() => { fileRef.current?.click(); }}
              className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
            >
              Change Image
            </button>
          )}
          <button
            onClick={classify}
            disabled={!imageUrl || loading}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Classifying...
              </span>
            ) : 'Classify Image'}
          </button>
        </div>
      </div>

      {predictions && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Top 5 Predictions</h3>
          <div className="space-y-3">
            {predictions.map((pred, i) => (
              <div key={pred.label}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs w-4">{i + 1}.</span>
                    <span className="text-white text-sm font-medium">{pred.label}</span>
                    <span className={`text-xs ${categoryColors[pred.category]}`}>({pred.category})</span>
                  </div>
                  <span className="text-gray-300 text-sm">{pred.confidence}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${i === 0 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/30'}`}
                    style={{ width: `${pred.confidence}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-4">
            * This is a demonstration using simulated predictions. In production, this would use a TensorFlow.js MobileNet model.
          </p>
        </div>
      )}
    </div>
  );
}
