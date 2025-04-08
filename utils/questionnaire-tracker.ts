import {
  QuestionnaireStatus,
  QuestionnaireResult,
} from "@/types/questionnaire";
import { createClient } from "@/utils/supabase/client";

const STORAGE_KEY = "questionnaire_status";

export class QuestionnaireTracker {
  private static getStoredStatus(): QuestionnaireStatus {
    if (typeof window === "undefined") return { hasCompletedFree: false };

    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { hasCompletedFree: false };
  }

  private static setStoredStatus(status: QuestionnaireStatus): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(status));
  }

  static hasCompletedFree(): boolean {
    return this.getStoredStatus().hasCompletedFree;
  }

  static markFreeCompleted(): void {
    this.setStoredStatus({
      ...this.getStoredStatus(),
      hasCompletedFree: true,
      lastCompletedAt: new Date().toISOString(),
    });
  }

  static shouldShowPrompt(): boolean {
    const status = this.getStoredStatus();
    if (!status.hasCompletedFree) return false;
    if (!status.dismissedPromptUntil) return true;
    return new Date(status.dismissedPromptUntil) <= new Date();
  }

  static dismissPrompt(hours: number = 24): void {
    const dismissUntil = new Date();
    dismissUntil.setHours(dismissUntil.getHours() + hours);

    this.setStoredStatus({
      ...this.getStoredStatus(),
      dismissedPromptUntil: dismissUntil.toISOString(),
    });
  }

  static async saveResult(
    result: Omit<QuestionnaireResult, "id" | "created_at">
  ): Promise<void> {
    const supabase = createClient();

    await supabase.from("questionnaire_results").insert([
      {
        questionnaire_type: result.questionnaire_type,
        answers: result.answers,
        user_id: result.userId,
      },
    ]);
  }

  static async getUserResults(userId: string): Promise<QuestionnaireResult[]> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("questionnaire_results")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
