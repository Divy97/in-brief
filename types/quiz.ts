export interface QuizQuestionOption {
  id: string; // Unique ID for the option (e.g., "q1-opt1")
  text: string; // The text content of the option
}

export interface QuizQuestion {
  id: string; // Unique ID for the question (e.g., "q1")
  questionText: string; // The main text of the question
  options: QuizQuestionOption[]; // Array of possible answers
  correctOptionId?: string; // Optional: We'll add this later for scoring
}

export interface QuizData {
  title: string; // Title for the quiz (e.g., based on the source article/video)
  questions: QuizQuestion[]; // Array of questions
}

// Type for storing user answers, mapping question ID to selected option ID
export type UserAnswers = Record<string, string>;
