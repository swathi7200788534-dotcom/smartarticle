import { Trophy, TrendingUp, RotateCcw, Home } from 'lucide-react';

interface QuizResultsProps {
  score: number;
  correctCount: number;
  totalCount: number;
  difficulty: string;
  tips: string[];
  onRetake: () => void;
  onNewQuiz: () => void;
}

export function QuizResults({
  score,
  correctCount,
  totalCount,
  difficulty,
  tips,
  onRetake,
  onNewQuiz,
}: QuizResultsProps) {
  const percentage = Math.round((correctCount / totalCount) * 100);

  const getScoreColor = () => {
    if (percentage === 100) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreMessage = () => {
    if (percentage === 100) return 'Outstanding!';
    if (percentage >= 80) return 'Excellent Work!';
    if (percentage >= 60) return 'Good Job!';
    if (percentage >= 40) return 'Keep Practicing!';
    return 'Keep Learning!';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <Trophy className={`w-20 h-20 mx-auto mb-4 ${getScoreColor()}`} />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {getScoreMessage()}
        </h2>
        <p className="text-gray-600">
          You completed the {difficulty} difficulty quiz
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className={`text-4xl font-bold mb-2 ${getScoreColor()}`}>
            {score}
          </div>
          <div className="text-sm text-gray-600 font-semibold">
            Final Score
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-gray-800 mb-2">
            {correctCount}/{totalCount}
          </div>
          <div className="text-sm text-gray-600 font-semibold">
            Questions Correct
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="text-4xl font-bold text-gray-800 mb-2">
            {percentage}%
          </div>
          <div className="text-sm text-gray-600 font-semibold">
            Accuracy
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Learning Tips
            </h3>
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="text-gray-700 leading-relaxed flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onRetake}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition"
        >
          <RotateCcw className="w-5 h-5" />
          Retake Quiz
        </button>

        <button
          onClick={onNewQuiz}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition"
        >
          <Home className="w-5 h-5" />
          New Article
        </button>
      </div>
    </div>
  );
}
