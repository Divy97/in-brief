"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useQuizManager } from "@/hooks/useQuizManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/ui/icons";

interface QuizHistoryItem {
  id: string;
  title: string;
  created_at: string;
  questionnaire_results: Array<{
    score: number;
    created_at: string;
  }>;
}

export default function ProfilePage() {
  const { user } = useAuthContext();
  const { profile, loading: profileLoading } = useProfile();
  const { getUserQuizHistory } = useQuizManager();
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuizHistory = async () => {
      try {
        const history = await getUserQuizHistory();
        setQuizHistory(history);
      } catch (error) {
        console.error("Error loading quiz history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuizHistory();
  }, [getUserQuizHistory]);

  if (loading || profileLoading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-14">
        <div className="flex justify-center">
          <Icons.spinner className="h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-14">
      {/* Profile Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Profile Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1">{user?.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Display Name
              </h3>
              <p className="mt-1">
                {profile?.display_name || user?.email?.split("@")[0]}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Account Type
              </h3>
              <p className="mt-1 capitalize">
                {profile?.subscription_tier || "Free"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Stats and History */}
      <Tabs defaultValue="stats" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="history">Quiz History</TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <Card>
            <CardContent className="py-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Quizzes Taken
                  </h3>
                  <p className="text-2xl font-bold">
                    {profile?.quizzes_taken || 0}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Average Score
                  </h3>
                  <p className="text-2xl font-bold">
                    {quizHistory.length > 0
                      ? Math.round(
                          quizHistory.reduce(
                            (acc, quiz) =>
                              acc +
                              (quiz.questionnaire_results?.[0]?.score || 0),
                            0
                          ) / quizHistory.length
                        )
                      : 0}
                    %
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Last Quiz
                  </h3>
                  <p className="text-2xl font-bold">
                    {profile?.last_quiz_at
                      ? new Date(profile.last_quiz_at).toLocaleDateString()
                      : "Never"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="py-6">
              {quizHistory.length > 0 ? (
                <div className="space-y-4">
                  {quizHistory.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{quiz.title}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(quiz.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {quiz.questionnaire_results?.[0]?.score || 0}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No quizzes taken yet</p>
                  <Button asChild className="mt-4">
                    <a href="/">Create your first quiz</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
