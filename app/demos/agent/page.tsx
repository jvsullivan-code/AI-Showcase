'use client';
import React, { useState, useRef, useEffect } from 'react';

// ---- Types ----
interface AgentStep {
  icon: string;
  label: string;
  detail: string;
  status: 'pending' | 'active' | 'done';
}

interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  steps?: AgentStep[];
  stepsExpanded?: boolean;
}

// ---- Knowledge base ----
const RESPONSES: Record<string, { steps: { icon: string; label: string; detail: string }[]; answer: string }> = {
  neural_network: {
    steps: [
      { icon: '🔍', label: 'Query analysis', detail: 'Detected topic: neural networks / deep learning' },
      { icon: '📚', label: 'Knowledge retrieval', detail: 'Loading: architecture, training, activation functions' },
      { icon: '⚙️', label: 'Synthesis', detail: 'Combining concepts: layers, weights, backpropagation' },
    ],
    answer: `**Neural networks** are computational models inspired by the human brain, made up of layered nodes that process data to learn patterns and make predictions.

**Core components:**
- **Neurons & layers** — Input layer receives raw data; hidden layers extract increasingly abstract features; the output layer produces the final result
- **Weights & biases** — Learnable parameters that control how strongly each neuron influences the next
- **Activation functions** — Non-linear functions (ReLU, sigmoid, tanh) that let networks model complex, non-linear relationships
- **Loss function** — Measures the gap between predictions and correct answers

**How training works:**
1. Forward pass — data flows through the network to produce a prediction
2. Loss calculation — the prediction is compared to the ground truth
3. Backpropagation — gradients are computed and flowed backward through the layers
4. Weight update — an optimizer (e.g., Adam, SGD) adjusts weights to reduce the loss
5. Repeat over many batches until performance converges

**Related topics:** Convolutional Neural Networks (CNNs), Recurrent Neural Networks (RNNs), Transformers`,
  },

  llm: {
    steps: [
      { icon: '🔍', label: 'Query analysis', detail: 'Detected topic: large language models / transformers' },
      { icon: '📚', label: 'Knowledge retrieval', detail: 'Loading: transformer architecture, attention, pre-training' },
      { icon: '⚙️', label: 'Synthesis', detail: 'Combining: self-attention, RLHF, emergent capabilities' },
    ],
    answer: `**Large Language Models (LLMs)** are neural networks — typically transformer-based — trained on massive text datasets to understand and generate human language.

**How they work:**
- **Tokenization** — Text is split into sub-word tokens (roughly 3-4 characters each)
- **Embeddings** — Tokens are mapped to high-dimensional vectors in a learned semantic space
- **Transformer layers** — Self-attention allows the model to weigh relationships between all tokens simultaneously, regardless of distance
- **Pre-training** — The model learns to predict the next token across trillions of tokens of text, developing broad language understanding
- **Fine-tuning / RLHF** — Models are further trained on curated instruction data and human feedback to be helpful and safe

**Key capabilities that emerge at scale:**
- In-context learning (following examples in the prompt)
- Multi-step reasoning and chain-of-thought
- Code generation and explanation
- Translation, summarization, and question answering

**Examples:** GPT-4, Claude, Gemini, Llama, Mistral

**Related topics:** Transformers, Attention mechanisms, Prompt engineering, RAG`,
  },

  agent: {
    steps: [
      { icon: '🔍', label: 'Query analysis', detail: 'Detected topic: AI agents / autonomous systems' },
      { icon: '📚', label: 'Knowledge retrieval', detail: 'Loading: ReAct, tool use, planning, memory' },
      { icon: '⚙️', label: 'Synthesis', detail: 'Combining: perceive-plan-act loop, multi-agent systems' },
    ],
    answer: `**AI Agents** are systems where an LLM is given a set of tools and autonomously decides how to use them in a loop to accomplish a goal.

**The agent loop (ReAct pattern):**
1. **Observe** — Receive the current state (user goal, prior actions, tool outputs)
2. **Think** — Reason about what to do next (often shown as a "scratchpad")
3. **Act** — Call a tool or produce a final answer
4. **Repeat** — Feed tool results back into the context and continue until done

**Common agent tools:**
- Web search / document retrieval
- Code interpreter / REPL
- File system access
- External APIs (calendars, databases, browsers)

**Memory types:**
- **In-context** — Everything in the current prompt window
- **External** — Vector databases for long-term retrieval (RAG)
- **Procedural** — Learned behaviors from fine-tuning

**Architectures:** Single-agent (one model, many tools), Multi-agent (specialized agents that call each other), Hierarchical (planner + executor agents)

**Challenges:** Long-horizon planning, hallucinated tool calls, compounding errors, latency, cost

**Related topics:** LangChain, AutoGen, LlamaIndex, RAG, Function calling`,
  },

  rag: {
    steps: [
      { icon: '🔍', label: 'Query analysis', detail: 'Detected topic: retrieval-augmented generation' },
      { icon: '📚', label: 'Knowledge retrieval', detail: 'Loading: embeddings, vector search, chunking strategies' },
      { icon: '⚙️', label: 'Synthesis', detail: 'Combining: indexing pipeline, retrieval, prompt grounding' },
    ],
    answer: `**Retrieval-Augmented Generation (RAG)** is a technique that gives LLMs access to an external knowledge base at inference time, grounding their answers in retrieved facts instead of relying solely on memorized training data.

**How RAG works:**
1. **Indexing** — Documents are split into chunks, embedded into vectors, and stored in a vector database
2. **Query** — The user's question is also embedded into a vector
3. **Retrieval** — The nearest document chunks (by cosine similarity) are fetched from the store
4. **Augmentation** — Retrieved chunks are injected into the LLM's prompt as context
5. **Generation** — The LLM answers based on the retrieved context, reducing hallucination

**Why RAG matters:**
- Keeps responses up-to-date without retraining
- Enables the model to cite its sources
- Works with private/internal documents
- Much cheaper than full fine-tuning

**Tools:** LlamaIndex, LangChain, Pinecone, Weaviate, pgvector, FAISS

**Related topics:** Embeddings, Vector databases, Semantic search, AI Agents`,
  },

  computer_vision: {
    steps: [
      { icon: '🔍', label: 'Query analysis', detail: 'Detected topic: computer vision / image processing' },
      { icon: '📚', label: 'Knowledge retrieval', detail: 'Loading: CNNs, object detection, segmentation' },
      { icon: '⚙️', label: 'Synthesis', detail: 'Combining: convolutional layers, feature maps, architectures' },
    ],
    answer: `**Computer Vision (CV)** is the field of AI that enables machines to interpret and understand visual information from images and video.

**Core tasks:**
- **Image classification** — Assign a single label to an image (e.g., "cat")
- **Object detection** — Locate and classify multiple objects with bounding boxes (YOLO, Faster R-CNN)
- **Semantic segmentation** — Classify every pixel in an image
- **Instance segmentation** — Detect and segment each individual object
- **Image generation** — Create new images (GANs, Diffusion models)

**How CNNs work:**
1. Convolutional layers slide small filters across the image, detecting low-level features (edges, textures)
2. Pooling layers downsample feature maps to build spatial invariance
3. Deeper layers combine low-level features into high-level concepts (eyes → face → person)
4. Fully-connected layers produce the final classification

**Modern architectures:** ResNet, EfficientNet, ViT (Vision Transformer), CLIP, SAM (Segment Anything)

**Related topics:** Image classification demo (see sidebar), Neural networks, Transformers`,
  },

  sentiment: {
    steps: [
      { icon: '🔍', label: 'Query analysis', detail: 'Detected topic: sentiment analysis / NLP' },
      { icon: '📚', label: 'Knowledge retrieval', detail: 'Loading: lexicon-based, ML-based, BERT approaches' },
      { icon: '⚙️', label: 'Synthesis', detail: 'Combining: preprocessing, feature extraction, classification' },
    ],
    answer: `**Sentiment analysis** is an NLP task that classifies the emotional tone of text — most commonly as positive, negative, or neutral.

**Approaches:**
- **Lexicon-based** — Maintain lists of positive/negative words and score text by how many appear (fast, no training needed, used in this site's demo)
- **Classic ML** — Train a classifier (Naive Bayes, SVM) on labeled text using TF-IDF features
- **Deep learning** — Fine-tune BERT or RoBERTa on labeled sentiment datasets (state of the art)

**Processing pipeline:**
1. Tokenization & lowercasing
2. Stop-word removal
3. Negation handling ("not good" → negative)
4. Feature extraction (word counts, embeddings)
5. Classification + confidence score

**Challenges:**
- Sarcasm and irony ("Oh great, another bug 🙄")
- Context dependency ("sick" can be good or bad)
- Domain shift (movie reviews vs. medical notes)
- Multi-lingual text

**Related topics:** Try the live Sentiment Analyzer demo, NLP, Text classification, Transformers`,
  },

  machine_learning: {
    steps: [
      { icon: '🔍', label: 'Query analysis', detail: 'Detected topic: machine learning fundamentals' },
      { icon: '📚', label: 'Knowledge retrieval', detail: 'Loading: supervised, unsupervised, reinforcement learning' },
      { icon: '⚙️', label: 'Synthesis', detail: 'Combining: model types, training process, evaluation' },
    ],
    answer: `**Machine Learning (ML)** is a subfield of AI where systems learn patterns from data rather than following explicit rules.

**Three learning paradigms:**
- **Supervised learning** — Learn from labeled examples to predict outputs (classification, regression). Examples: spam detection, price prediction
- **Unsupervised learning** — Discover structure in unlabeled data (clustering, dimensionality reduction). Examples: customer segmentation, anomaly detection
- **Reinforcement learning** — An agent learns by taking actions in an environment and receiving rewards. Examples: game playing (AlphaGo), robotics

**The ML workflow:**
1. Define the problem and collect data
2. Explore and preprocess the data (EDA, feature engineering)
3. Choose and train a model
4. Evaluate with held-out test data (accuracy, F1, AUC-ROC)
5. Tune hyperparameters (cross-validation, grid search)
6. Deploy and monitor in production

**Common algorithms:** Linear/Logistic Regression, Decision Trees, Random Forests, Gradient Boosting (XGBoost), Neural Networks, SVMs, k-Means

**Related topics:** Neural networks, Deep learning, Feature engineering, Model evaluation`,
  },

  transformer: {
    steps: [
      { icon: '🔍', label: 'Query analysis', detail: 'Detected topic: transformer architecture' },
      { icon: '📚', label: 'Knowledge retrieval', detail: 'Loading: attention mechanism, encoder-decoder, positional encoding' },
      { icon: '⚙️', label: 'Synthesis', detail: 'Combining: self-attention, multi-head attention, feed-forward layers' },
    ],
    answer: `**Transformers** are a neural network architecture introduced in "Attention Is All You Need" (Vaswani et al., 2017) that became the foundation for virtually all modern LLMs.

**Key innovation — Self-attention:**
Each token can directly attend to every other token in the sequence, computing how much "attention" to pay to each one. This overcomes the sequential bottleneck of RNNs and enables massive parallelism during training.

**Architecture components:**
- **Multi-head attention** — Run attention multiple times in parallel with different learned projections, capturing different relationship types simultaneously
- **Feed-forward network** — A two-layer MLP applied independently to each position
- **Layer normalization** — Stabilizes training
- **Positional encoding** — Injects sequence order information (since attention itself is order-agnostic)
- **Residual connections** — Add the input to the output of each sub-layer, enabling deep networks to train

**Encoder vs. Decoder:**
- Encoder-only (BERT) — Best for classification and understanding tasks
- Decoder-only (GPT) — Best for text generation
- Encoder-decoder (T5, BART) — Best for translation and summarization

**Related topics:** LLMs, Attention mechanism, BERT, GPT, Fine-tuning`,
  },

  general: {
    steps: [
      { icon: '🔍', label: 'Query analysis', detail: 'Parsing intent and key concepts' },
      { icon: '📚', label: 'Knowledge retrieval', detail: 'Searching available knowledge domains' },
      { icon: '⚙️', label: 'Synthesis', detail: 'Formulating a helpful response' },
    ],
    answer: `I'm an AI Research Assistant specialized in machine learning and AI topics. Here are the areas I know best:

**Topics I can explain:**
- 🧠 **Neural networks** — How they work, layers, training, backpropagation
- 🤖 **Large Language Models (LLMs)** — GPT, Claude, Gemini, transformer architecture
- 🔗 **AI Agents** — Autonomous systems, tool use, the ReAct pattern
- 📂 **RAG** — Retrieval-Augmented Generation, vector databases
- 👁️ **Computer Vision** — CNNs, object detection, segmentation
- 💬 **Sentiment Analysis** — NLP, lexicon-based and ML approaches
- 📐 **Machine Learning** — Supervised, unsupervised, reinforcement learning
- ⚡ **Transformers** — Self-attention, encoder/decoder, BERT, GPT

Try asking me something like:
- *"How do neural networks learn?"*
- *"What is RAG and why is it useful?"*
- *"Explain how AI agents work"*
- *"What makes transformers so powerful?"*`,
  },
};

const EXAMPLE_PROMPTS = [
  'How do neural networks work?',
  'What are AI agents?',
  'Explain RAG (Retrieval-Augmented Generation)',
  'What makes transformers special?',
  'How does sentiment analysis work?',
  'What is machine learning?',
];

// ---- Topic detection ----
function detectTopic(query: string): keyof typeof RESPONSES {
  const q = query.toLowerCase();
  if (/neural.?net|deep.?learn|perceptron|backprop|hidden.?layer/.test(q)) return 'neural_network';
  if (/\bllm\b|large.?language|gpt|claude|gemini|llama|mistral/.test(q)) return 'llm';
  if (/\bagent|autonomous|tool.?use|react.?pattern|agentic/.test(q)) return 'agent';
  if (/\brag\b|retrieval.?augmented|vector.?database|embedding.*retriev|retriev.*augment/.test(q)) return 'rag';
  if (/computer.?vision|cnn|image.?classif|object.?detect|convolut/.test(q)) return 'computer_vision';
  if (/sentiment|emotion.*text|opinion.?mining|polarity/.test(q)) return 'sentiment';
  if (/\btransformer|self.?attention|multi.?head|bert\b|attention.?mechanism/.test(q)) return 'transformer';
  if (/machine.?learn|supervised|unsupervised|reinforcement|random.?forest|gradient.?boost/.test(q)) return 'machine_learning';
  return 'general';
}

export default function AgentDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, processing]);

  const sendMessage = async (query: string) => {
    if (!query.trim() || processing) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: query.trim(),
    };

    setMessages((prev) => {
      // Prune expandedSteps for any messages no longer in the list (keep state lean)
      const currentIds = new Set(prev.map((m) => m.id));
      setExpandedSteps((es) => {
        const pruned: Record<string, boolean> = {};
        for (const id of Object.keys(es)) {
          if (currentIds.has(id)) pruned[id] = es[id];
        }
        return pruned;
      });
      return [...prev, userMsg];
    });
    setInput('');
    setProcessing(true);

    const topic = detectTopic(query);
    const response = RESPONSES[topic];
    const agentId = `a-${Date.now()}`;

    // Build initial steps as 'pending'
    const initialSteps: AgentStep[] = response.steps.map((s) => ({
      ...s,
      status: 'pending',
    }));

    // Add agent message with pending steps
    const agentMsg: ChatMessage = {
      id: agentId,
      role: 'agent',
      content: '',
      steps: initialSteps,
    };
    setMessages((prev) => [...prev, agentMsg]);
    setExpandedSteps((prev) => ({ ...prev, [agentId]: true }));

    // Animate steps
    for (let i = 0; i < initialSteps.length; i++) {
      // Mark step i as active
      await new Promise<void>((res) => setTimeout(res, i === 0 ? 300 : 500));
      setMessages((prev) =>
        prev.map((m) =>
          m.id === agentId
            ? {
                ...m,
                steps: m.steps!.map((s, idx) =>
                  idx === i ? { ...s, status: 'active' } : s
                ),
              }
            : m
        )
      );

      // Mark step i as done
      await new Promise<void>((res) => setTimeout(res, 500));
      setMessages((prev) =>
        prev.map((m) =>
          m.id === agentId
            ? {
                ...m,
                steps: m.steps!.map((s, idx) =>
                  idx === i ? { ...s, status: 'done' } : s
                ),
              }
            : m
        )
      );
    }

    // Small pause then reveal the answer
    await new Promise<void>((res) => setTimeout(res, 400));
    setMessages((prev) =>
      prev.map((m) =>
        m.id === agentId ? { ...m, content: response.answer } : m
      )
    );
    setProcessing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const toggleSteps = (id: string) => {
    setExpandedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Render markdown-lite (bold, bullets) — no dangerouslySetInnerHTML
  const renderBold = (text: string): React.ReactNode[] => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part
    );
  };

  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const isListItem = line.startsWith('- ') || line.startsWith('• ');
      if (isListItem) {
        return (
          <li key={i} className="ml-4 list-disc text-gray-300 text-sm leading-relaxed">
            {renderBold(line.replace(/^[-•]\s/, ''))}
          </li>
        );
      }
      if (line.trim() === '') return <div key={i} className="h-2" />;
      return (
        <p key={i} className="text-gray-300 text-sm leading-relaxed">
          {renderBold(line)}
        </p>
      );
    });
  };

  const stepStatusIcon = (status: AgentStep['status']) => {
    if (status === 'done') return '✅';
    if (status === 'active') return (
      <span
        role="status"
        aria-label="Processing step"
        className="inline-block w-4 h-4 border-2 border-blue-400/40 border-t-blue-400 rounded-full animate-spin"
      />
    );
    return <span className="w-4 h-4 rounded-full border border-white/20 inline-block" />;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          AI{' '}
          <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Research Agent
          </span>
        </h1>
        <p className="text-gray-400">
          An AI agent that plans, retrieves knowledge, and answers your questions about machine learning. Watch it think step-by-step.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {['🧠 Knowledge Base', '🔍 Semantic Search', '⚙️ Multi-step Reasoning', '💬 Conversational'].map((tag) => (
            <span key={tag} className="px-3 py-1 bg-violet-500/10 text-violet-300 text-xs rounded-full border border-violet-500/20">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: 420 }}>
        {/* Messages */}
        <div className="flex-1 p-5 space-y-5 overflow-y-auto" style={{ maxHeight: 520 }}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <div className="text-4xl mb-3">🤖</div>
              <p className="text-gray-400 text-sm mb-1">Ask me anything about AI &amp; machine learning</p>
              <p className="text-gray-600 text-xs">I{"'"}ll show you my reasoning process as I work through the answer</p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gradient-to-br from-violet-500 to-fuchsia-600'}`}>
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>

              <div className={`flex-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                {/* User bubble */}
                {msg.role === 'user' && (
                  <div className="bg-blue-600/30 border border-blue-500/30 rounded-2xl rounded-tr-sm px-4 py-3">
                    <p className="text-white text-sm">{msg.content}</p>
                  </div>
                )}

                {/* Agent steps */}
                {msg.role === 'agent' && msg.steps && msg.steps.length > 0 && (
                  <div className="w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSteps(msg.id)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="text-gray-400 text-xs font-medium flex items-center gap-1.5">
                        <span>⚙️</span> Agent reasoning steps
                      </span>
                      <span className="text-gray-500 text-xs">{expandedSteps[msg.id] ? '▲ hide' : '▼ show'}</span>
                    </button>
                    {expandedSteps[msg.id] && (
                      <div className="px-4 pb-3 space-y-2 border-t border-white/10">
                        {msg.steps.map((step, i) => (
                          <div key={i} className="flex items-center gap-3 py-1.5">
                            <div className="w-5 flex items-center justify-center text-xs">
                              {stepStatusIcon(step.status)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-white text-xs font-medium">{step.icon} {step.label}</span>
                              </div>
                              <div className={`text-xs mt-0.5 ${step.status === 'pending' ? 'text-gray-600' : 'text-gray-400'}`}>
                                {step.detail}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Agent answer */}
                {msg.role === 'agent' && msg.content && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-5 py-4 w-full space-y-1">
                    {renderContent(msg.content)}
                  </div>
                )}

                {/* Generating indicator */}
                {msg.role === 'agent' && !msg.content && msg.steps && msg.steps.every((s) => s.status === 'done') && (
                  <div role="status" aria-label="Generating response" className="flex items-center gap-2 px-4 py-3">
                    <span className="w-4 h-4 border-2 border-violet-400/40 border-t-violet-400 rounded-full animate-spin" aria-hidden="true" />
                    <span className="text-gray-400 text-sm">Generating response…</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* Example prompts */}
        {messages.length === 0 && (
          <div className="px-5 pb-4">
            <p className="text-gray-500 text-xs mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  disabled={processing}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs rounded-lg transition-colors border border-white/10 disabled:opacity-40"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-white/10 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about neural networks, LLMs, AI agents, RAG…"
              rows={1}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 resize-none text-sm"
              style={{ minHeight: 48 }}
              disabled={processing}
            />
            <button
              type="submit"
              disabled={!input.trim() || processing}
              className="px-5 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              {processing ? (
                <span
                  role="status"
                  aria-label="Sending message"
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin block"
                />
              ) : (
                '→'
              )}
            </button>
          </form>
          <p className="text-gray-600 text-xs mt-2 text-center">
            Press Enter to send · Shift+Enter for new line · Runs entirely in your browser
          </p>
        </div>
      </div>

      {/* About this demo */}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-3">About this demo</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[
            { icon: '🔍', label: 'Topic Detection', desc: 'Regex-based intent parsing identifies your query domain' },
            { icon: '📚', label: 'Knowledge Base', desc: 'Curated ML/AI knowledge across 8 specialist domains' },
            { icon: '⚙️', label: 'Agentic Steps', desc: 'Transparent reasoning steps shown as the agent works' },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="text-2xl">{item.icon}</div>
              <div className="text-white text-sm font-medium">{item.label}</div>
              <div className="text-gray-400 text-xs">{item.desc}</div>
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-4 text-center">
          Production agents use LLMs + real tool calls (web search, code execution, APIs). This demo shows the architectural pattern entirely in-browser.
        </p>
      </div>
    </div>
  );
}
