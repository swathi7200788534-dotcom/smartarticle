import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface QuizQuestionProps {
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
  onAnswer: (isCorrect: boolean, userAnswer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export function QuizQuestion({
  question,
  options,
  correctAnswer,
  difficulty,
  explanation,
  onAnswer,
  questionNumber,
  totalQuestions,
}: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    setShowExplanation(true);
    const isCorrect = answer === correctAnswer;
    onAnswer(isCorrect, answer);
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
    }
  };

  const getOptionStyle = (option: string) => {
    if (!selectedAnswer) {
      return 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer';
    }

    if (option === correctAnswer) {
      return 'border-green-500 bg-green-50';
    }

    if (option === selectedAnswer && option !== correctAnswer) {
      return 'border-red-500 bg-red-50';
    }

    return 'border-gray-300 opacity-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-semibold text-gray-600">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor()}`}>
          {difficulty.toUpperCase()}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
        {question}
      </h3>

      <div className="space-y-3 mb-6">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            disabled={!!selectedAnswer}
            className={`w-full text-left px-6 py-4 border-2 rounded-lg transition ${getOptionStyle(option)}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">{option}</span>
              {selectedAnswer && option === correctAnswer && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              {selectedAnswer && option === selectedAnswer && option !== correctAnswer && (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
          </button>
        ))}
      </div>

      {showExplanation && (
        <div className={`p-4 rounded-lg border-l-4 ${
          selectedAnswer === correctAnswer
            ? 'bg-green-50 border-green-500'
            : 'bg-blue-50 border-blue-500'
        }`}>
          <div className="flex items-start gap-3">
            <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
              selectedAnswer === correctAnswer ? 'text-green-600' : 'text-blue-600'
            }`} />
            <div>
              <p className="font-semibold text-gray-800 mb-1">
                {selectedAnswer === correctAnswer ? 'Correct!' : 'Learning Tip'}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
