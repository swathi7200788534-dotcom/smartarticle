import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Article {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string | null;
}

export interface QuizQuestion {
  id: string;
  article_id: string;
  question: string;
  options: string[];
  correct_answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
  created_at: string;
}

export interface QuizAttempt {
  id: string;
  article_id: string;
  user_id: string | null;
  score: number;
  total_questions: number;
  answers: Array<{
    question_id: string;
    user_answer: string;
    correct: boolean;
  }>;
  completed_at: string;
}
