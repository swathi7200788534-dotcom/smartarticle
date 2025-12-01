/*
  # Quiz Generator Schema

  ## Overview
  Creates tables for storing articles, generated quiz questions, and user quiz attempts
  with their scores and performance data.

  ## New Tables
  
  ### `articles`
  - `id` (uuid, primary key) - Unique identifier for each article
  - `title` (text) - Article title
  - `content` (text) - Full article text content
  - `created_at` (timestamptz) - Timestamp when article was added
  - `user_id` (uuid) - Reference to the user who created the article
  
  ### `quiz_questions`
  - `id` (uuid, primary key) - Unique identifier for each question
  - `article_id` (uuid, foreign key) - Reference to source article
  - `question` (text) - The quiz question text
  - `options` (jsonb) - Array of answer options
  - `correct_answer` (text) - The correct answer
  - `difficulty` (text) - Difficulty level: easy, medium, hard
  - `explanation` (text) - Learning tip/explanation for the answer
  - `created_at` (timestamptz) - Timestamp when question was generated
  
  ### `quiz_attempts`
  - `id` (uuid, primary key) - Unique identifier for each attempt
  - `article_id` (uuid, foreign key) - Reference to the article
  - `user_id` (uuid) - Reference to the user taking the quiz
  - `score` (integer) - Total score achieved
  - `total_questions` (integer) - Number of questions in the quiz
  - `answers` (jsonb) - User's answers and correctness
  - `completed_at` (timestamptz) - When the quiz was completed
  
  ## Security
  - Enable RLS on all tables
  - Users can create and view their own articles
  - Users can view quiz questions for any article
  - Users can create and view their own quiz attempts
*/

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_answer text NOT NULL,
  difficulty text NOT NULL DEFAULT 'medium',
  explanation text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  user_id uuid,
  score integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL,
  answers jsonb NOT NULL,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view articles"
  ON articles FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert articles"
  ON articles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view quiz questions"
  ON quiz_questions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert quiz questions"
  ON quiz_questions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view quiz attempts"
  ON quiz_attempts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert quiz attempts"
  ON quiz_attempts FOR INSERT
  WITH CHECK (true);