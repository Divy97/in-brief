# AI Quiz Generator from URL

This project is a web application built with Next.js, Supabase (for potential auth, if used), and Tailwind CSS that allows users to generate multiple-choice quizzes automatically from the content of a web article or blog post URL. It uses AI via OpenRouter to create the questions and answers.

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a>
</p>
<br/>

## Features

- **URL Input:** Simple interface to paste a URL.
- **Content Extraction:** Uses `@mozilla/readability` to extract the main content from the provided URL.
- **AI Quiz Generation:** Leverages an LLM via [OpenRouter](https://openrouter.ai/) to generate relevant multiple-choice questions based on the extracted content.
- **Interactive Quiz Interface:**
  - Displays questions one by one with a progress bar.
  - Provides immediate feedback on whether the selected answer was correct or incorrect.
  - Calculates and displays the final score upon completion.
- **Client-Side Routing:** Uses Next.js App Router for navigation between the input form and the quiz page.
- **Modern UI:** Built with [Tailwind CSS](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com/) components.
- **(Optional) User Authentication:** Includes basic setup for Supabase authentication (sign-up, sign-in, password reset - can be removed if not needed).

## Deploy to Vercel

You can deploy your own instance of this project to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F<YOUR_GITHUB_USERNAME>%2F<YOUR_REPOSITORY_NAME>&project-name=ai-quiz-generator&repository-name=ai-quiz-generator&env=OPENROUTER_API_KEY,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=OpenRouter%20API%20Key%20is%20required%20for%20quiz%20generation.%20Supabase%20keys%20needed%20if%20using%20auth.&demo-url=<YOUR_DEPLOYED_URL_IF_ANY>)

_(Remember to replace the `repository-url` in the button link with your actual GitHub repository URL if you fork this project)_

**Environment Variables Needed for Deployment:**

- `OPENROUTER_API_KEY`: Your API key from [OpenRouter](https://openrouter.ai/) (Required for quiz generation).
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL (Only required if using Supabase Auth).
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase project anon key (Only required if using Supabase Auth).

Vercel will prompt you for these during the deployment setup.

## Clone and run locally

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
    cd <YOUR_REPOSITORY_NAME>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Set up environment variables:**

    - Rename the `.env.example` file to `.env.local`.
      ```bash
      cp .env.example .env.local
      ```
    - Edit `.env.local` and add your keys:

      ```.env.local
      # Required for Quiz Generation
      OPENROUTER_API_KEY="sk-or-v1-..." # Get from https://openrouter.ai/

      # Only needed if using Supabase Auth features
      NEXT_PUBLIC_SUPABASE_URL="https://<your-project-ref>.supabase.co"
      NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
      ```

      - Get your `OPENROUTER_API_KEY` from [OpenRouter](https://openrouter.ai/).
      - If using Supabase Auth, get `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your [Supabase project's API settings](https://app.supabase.com/project/_/settings/api).

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **AI:** [OpenRouter](https://openrouter.ai/) (via `openai` SDK)
- **Content Extraction:** [`@mozilla/readability`](https://github.com/mozilla/readability)
- **DOM Parsing:** [`jsdom`](https://github.com/jsdom/jsdom)
- **(Optional) Authentication:** [Supabase](https://supabase.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

## Feedback and Issues

If you encounter any bugs or have suggestions, please file an issue on the GitHub repository issues page.
