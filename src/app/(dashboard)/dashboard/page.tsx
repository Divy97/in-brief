"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[300px] mt-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}!
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s your in-brief dashboard overview
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border bg-card p-6"
        >
          <h3 className="text-lg font-semibold">Total Videos</h3>
          <p className="mt-2 text-3xl font-bold">0</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg border bg-card p-6"
        >
          <h3 className="text-lg font-semibold">Time Saved</h3>
          <p className="mt-2 text-3xl font-bold">0h</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg border bg-card p-6"
        >
          <h3 className="text-lg font-semibold">Recent Summaries</h3>
          <p className="mt-2 text-3xl font-bold">0</p>
        </motion.div>
      </div>

      {/* Recent Videos Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold">Recent Videos</h2>
        <div className="mt-4 rounded-lg border bg-card p-8 text-center text-muted-foreground">
          No videos yet. Get started by creating your first in-brief summary!
        </div>
      </div>
    </motion.div>
  );
}
