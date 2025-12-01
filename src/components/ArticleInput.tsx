import { useState } from 'react';
import { FileText } from 'lucide-react';

interface ArticleInputProps {
  onGenerateQuiz: (title: string, content: string, difficulty: 'easy' | 'medium' | 'hard' | 'mixed', count: number) => void;
  isLoading: boolean;
}

export function ArticleInput({ onGenerateQuiz, isLoading }: ArticleInputProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('medium');
  const [questionCount, setQuestionCount] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onGenerateQuiz(title, content, difficulty, questionCount);
    }
  };

  const pasteExample = () => {
    setTitle('The Solar System');
    setContent(`The Solar System is the gravitationally bound system of the Sun and the objects that orbit it. The Solar System formed 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud. The vast majority of the system's mass is in the Sun, with most of the remaining mass contained in the planet Jupiter. The four inner system planets are Mercury, Venus, Earth and Mars, which are terrestrial planets composed primarily of rock and metal. The four giant planets of the outer system are substantially more massive than the terrestrial planets. The two largest, Jupiter and Saturn, are gas giants, being composed mainly of hydrogen and helium. The two outermost planets, Uranus and Neptune, are ice giants, being composed mostly of volatile substances with relatively high melting points compared with hydrogen and helium. All eight planets have nearly circular orbits that lie near the plane of Earth's orbit, called the ecliptic.`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Article Input</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            Article Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="Enter article title..."
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
            Article Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
            placeholder="Paste or type your article here..."
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="difficulty" className="block text-sm font-semibold text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard' | 'mixed')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              disabled={isLoading}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <div>
            <label htmlFor="count" className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Questions
            </label>
            <input
              id="count"
              type="number"
              min="3"
              max="15"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading || !title.trim() || !content.trim()}
            className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'Generating Quiz...' : 'Generate Quiz'}
          </button>

          <button
            type="button"
            onClick={pasteExample}
            disabled={isLoading}
            className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed transition"
          >
            Try Example
          </button>
        </div>
      </form>
    </div>
  );
}
