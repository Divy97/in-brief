export interface QuestionnaireStatus {
  hasCompletedFree: boolean;
  lastCompletedAt?: string;
  dismissedPromptUntil?: string;
}

export interface QuestionnaireResult {
  id: string;
  userId?: string;
  questionnaire_type: string;
  answers: Record<string, any>;
  created_at: string;
}

// Database types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      questionnaire_results: {
        Row: {
          id: string;
          user_id: string | null;
          questionnaire_type: string;
          answers: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          questionnaire_type: string;
          answers: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          questionnaire_type?: string;
          answers?: Json;
          created_at?: string;
        };
      };
    };
  };
}
