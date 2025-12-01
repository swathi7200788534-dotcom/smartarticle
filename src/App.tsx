import { useState } from 'react';
import { ArticleInput } from './components/ArticleInput';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { supabase } from './lib/supabase';
import { generateQuizQuestions, calculateScore, getPerformanceTips } from './lib/quizGenerator';
import { BookOpen } from 'lucide-react';

type AppState = 'input' | 'quiz' | 'results';

interface Question {
  id?: string;
  question: string;
  options: string[];
  correct_answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

function App() {
  const [state, setState] = useState<AppState>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<{ id?: string; title: string; content: string } | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<{ question_id?: string; user_answer: string; correct: boolean }>>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('medium');
  const [score, setScore] = useState(0);
  const [tips, setTips] = useState<string[]>([]);

  const handleGenerateQuiz = async (
    title: string,
    content: string,
    selectedDifficulty: 'easy' | 'medium' | 'hard' | 'mixed',
    count: number
  ) => {
    setIsLoading(true);
    try {
      const { data: article, error: articleError } = await supabase
        .from('articles')
        .insert({ title, content })
        .select()
        .single();

      if (articleError) throw articleError;

      const generatedQuestions = generateQuizQuestions(content, selectedDifficulty, count);

      if (!generatedQuestions || generatedQuestions.length === 0) {
        alert('Could not generate questions from this article. Please try a longer article.');
        setIsLoading(false);
        return;
      }

      const questionsToInsert = generatedQuestions.map((q) => ({
        article_id: article.id,
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        difficulty: q.difficulty,
        explanation: q.explanation,
      }));

      const { data: savedQuestions, error: questionsError } = await supabase
        .from('quiz_questions')
        .insert(questionsToInsert)
        .select();

      if (questionsError) throw questionsError;

      setCurrentArticle({ id: article.id, title, content });
      setQuestions(savedQuestions);
      setDifficulty(selectedDifficulty);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setState('quiz');
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (isCorrect: boolean, userAnswer: string) => {
    const newAnswer = {
      question_id: questions[currentQuestionIndex].id,
      user_answer: userAnswer,
      correct: isCorrect,
    };
    setAnswers([...answers, newAnswer]);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        finishQuiz([...answers, newAnswer]);
      }
    }, 2000);
  };

  const finishQuiz = async (finalAnswers: typeof answers) => {
    const correctCount = finalAnswers.filter(a => a.correct).length;
    const totalCount = questions.length;
    const finalScore = calculateScore(totalCount, correctCount, difficulty);
    const performanceTips = getPerformanceTips(finalScore, difficulty, correctCount, totalCount);

    setScore(finalScore);
    setTips(performanceTips);

    try {
      await supabase.from('quiz_attempts').insert({
        article_id: currentArticle?.id,
        score: finalScore,
        total_questions: totalCount,
        answers: finalAnswers,
      });
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
    }

    setState('results');
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setState('quiz');
  };

  const handleNewQuiz = () => {
    setCurrentArticle(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setState('input');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Quiz Generator
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Transform any article into an interactive learning experience
          </p>
        </header>

        <main>
          {state === 'input' && (
            <ArticleInput onGenerateQuiz={handleGenerateQuiz} isLoading={isLoading} />
          )}

          {state === 'quiz' && questions[currentQuestionIndex] && (
            <QuizQuestion
              question={questions[currentQuestionIndex].question}
              options={questions[currentQuestionIndex].options}
              correctAnswer={questions[currentQuestionIndex].correct_answer}
              difficulty={questions[currentQuestionIndex].difficulty}
              explanation={questions[currentQuestionIndex].explanation}
              onAnswer={handleAnswer}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
            />
          )}

          {state === 'results' && (
            <QuizResults
              score={score}
              correctCount={answers.filter(a => a.correct).length}
              totalCount={questions.length}
              difficulty={difficulty}
              tips={tips}
              onRetake={handleRetake}
              onNewQuiz={handleNewQuiz}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
