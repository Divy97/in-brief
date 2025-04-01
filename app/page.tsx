import { UrlInputForm } from "@/components/url-input-form"; // Import the new client component

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2 p-6 rounded-lg border bg-white shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col items-center px-4 pb-20">
      {/* Hero Section (Static) */}
      <section className="w-full max-w-4xl mx-auto pt-20 pb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Generate Smart Questionnaires
          <span className="text-blue-600"> Instantly</span>
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          Transform any article or video into an interactive questionnaire.
          Perfect for learning, teaching, or testing knowledge.
        </p>
      </section>
      {/* Render the Client Component for the form and results */}
      <UrlInputForm />
      {/* Features Section (Static)
      <section className="w-full max-w-4xl mx-auto mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Articles"
            description="Generate questions from any web article or blog post"
          />
          <FeatureCard
            title="Videos"
            description="Create quizzes from YouTube videos automatically"
          />
          <FeatureCard
            title="Smart Questions"
            description="AI-powered questions that test understanding"
          />
        </div>
      </section> */}
    </div>
  );
}
