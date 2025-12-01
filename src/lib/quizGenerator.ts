export function generateQuizQuestions(
  articleContent: string,
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed',
  count: number = 5
) {
  const sentences = articleContent
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20);

  if (sentences.length === 0) {
    return [];
  }

  const questions = [];
  const usedSentences = new Set<number>();

  for (let i = 0; i < Math.min(count, sentences.length); i++) {
    let sentenceIndex;
    do {
      sentenceIndex = Math.floor(Math.random() * sentences.length);
    } while (usedSentences.has(sentenceIndex) && usedSentences.size < sentences.length);

    usedSentences.add(sentenceIndex);
    const sentence = sentences[sentenceIndex];

    const questionDifficulty = difficulty === 'mixed'
      ? (['easy', 'medium', 'hard'][i % 3] as 'easy' | 'medium' | 'hard')
      : difficulty;

    const question = generateQuestion(sentence, questionDifficulty, sentences);
    questions.push(question);
  }

  return questions;
}

function generateQuestion(
  sentence: string,
  difficulty: 'easy' | 'medium' | 'hard',
  allSentences: string[]
) {
  const words = sentence.split(' ').filter(w => w.length > 3);

  if (words.length === 0) {
    return null;
  }

  const keywordIndex = Math.floor(Math.random() * words.length);
  const keyword = words[keywordIndex].replace(/[,;:]/g, '');

  const questionText = difficulty === 'easy'
    ? `What word completes this statement: "${sentence.replace(keyword, '____')}"?`
    : difficulty === 'medium'
    ? `According to the article, which term best fits: "${sentence.replace(keyword, '____')}"?`
    : `Analyze this statement: "${sentence.replace(keyword, '____')}". Which concept is missing?`;

  const wrongOptions = generateWrongOptions(keyword, words, difficulty);
  const options = shuffleArray([keyword, ...wrongOptions]);

  const explanation = difficulty === 'easy'
    ? `The correct answer is "${keyword}". This word directly appears in the article text.`
    : difficulty === 'medium'
    ? `The correct answer is "${keyword}". This term is key to understanding this concept from the article.`
    : `The correct answer is "${keyword}". This represents a critical concept that requires careful analysis of the article's main ideas.`;

  return {
    question: questionText,
    options,
    correct_answer: keyword,
    difficulty,
    explanation
  };
}

function generateWrongOptions(correctAnswer: string, availableWords: string[], difficulty: string) {
  const cleaned = availableWords.map(w => w.replace(/[,;:]/g, ''));
  const filtered = cleaned.filter(w => w !== correctAnswer && w.length > 3);

  const selected = [];
  const usedIndices = new Set<number>();

  while (selected.length < 3 && selected.length < filtered.length) {
    const index = Math.floor(Math.random() * filtered.length);
    if (!usedIndices.has(index)) {
      usedIndices.add(index);
      selected.push(filtered[index]);
    }
  }

  while (selected.length < 3) {
    selected.push(`Option ${selected.length + 1}`);
  }

  return selected.slice(0, 3);
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function calculateScore(
  totalQuestions: number,
  correctAnswers: number,
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed'
): number {
  const baseScore = (correctAnswers / totalQuestions) * 100;

  const multiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.2 : difficulty === 'hard' ? 1.5 : 1.1;

  return Math.round(baseScore * multiplier);
}

export function getPerformanceTips(
  score: number,
  difficulty: string,
  correctCount: number,
  totalCount: number
): string[] {
  const tips = [];
  const percentage = (correctCount / totalCount) * 100;

  if (percentage === 100) {
    tips.push("Perfect score! You've mastered this content.");
    tips.push("Consider trying a higher difficulty level to challenge yourself further.");
  } else if (percentage >= 80) {
    tips.push("Great job! You have a strong understanding of the material.");
    tips.push("Review the questions you missed to solidify your knowledge.");
  } else if (percentage >= 60) {
    tips.push("Good effort! You're on the right track.");
    tips.push("Try reading the article again, focusing on the areas where you struggled.");
    tips.push("Consider taking the quiz again after reviewing the material.");
  } else if (percentage >= 40) {
    tips.push("Keep practicing! Learning takes time and repetition.");
    tips.push("Break down the article into smaller sections and focus on understanding each part.");
    tips.push("Take notes while reading to help retain key information.");
  } else {
    tips.push("Don't get discouraged! This is a learning opportunity.");
    tips.push("Start with an easier difficulty level to build confidence.");
    tips.push("Read the article slowly and carefully, highlighting important points.");
    tips.push("Try creating your own questions while reading to engage more deeply.");
  }

  if (difficulty === 'hard') {
    tips.push("Hard questions require deep comprehension. Consider re-reading the source material.");
  }

  return tips;
}
