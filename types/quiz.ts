export interface QuizQuestionOption {
  id: string; // Unique ID for the option (e.g., "q1-opt1")
  text: string; // The text content of the option
}

export interface QuizQuestion {
  id: string; // Unique ID for the question (e.g., "q1")
  questionText: string; // The main text of the question
  options: QuizQuestionOption[]; // Array of possible answers
  correctAnswer: number;
}

export interface QuizData {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface Question {
  id: string;
  questionText: string;
  options: QuizQuestionOption[];
  correctAnswer: number;
}

// Type for storing user answers, mapping question ID to selected option ID
export type UserAnswers = Record<string, number>;

export interface QuizResult {
  answers: UserAnswers;
  quiz_id: string;
  user_id?: string;
  created_at?: string;
}
