# in-brief: Video Summarization Platform

## Tech Stack

### Frontend

- Next.js 15 (App Router)
- TypeScript
- ShadCN UI Components
- Framer Motion for animations
- TailwindCSS for styling

### Backend

- Next.js Server Actions for API routes
- Custom JWT authentication
- GraphQL with Hasura
- PostgreSQL database

### Infrastructure

- Docker for development
- Hasura GraphQL Engine
- PostgreSQL

## Project Structure

src/
├── app/ # Next.js app router pages
│ ├── (auth)/ # Authentication routes (grouped)
│ │ ├── login/
│ │ └── register/
│ ├── (dashboard)/ # Protected dashboard routes
│ │ ├── videos/
│ │ └── settings/
│ └── api/ # API routes
├── components/ # React components
│ ├── ui/ # ShadcN components
│ ├── auth/ # Authentication components
│ ├── video/ # Video-related components
│ └── layout/ # Layout components
├── lib/ # Utility functions
│ ├── auth.ts # Authentication utilities
│ ├── graphql/ # GraphQL queries and mutations
│ └── utils.ts # General utilities
├── types/ # TypeScript type definitions
└── styles/ # Global styles

## Key Features

1. Video Upload & Processing

   - Support for multiple video formats
   - Video thumbnail generation
   - Progress tracking

2. AI Summarization

   - Text summarization
   - Key points extraction
   - Timeline markers

3. User Management

   - JWT-based authentication
   - User profiles
   - Video history

4. Dashboard
   - Video management
   - Summary history
   - User settings

## Security Considerations

- JWT token rotation
- Rate limiting
- Input validation
- SQL injection prevention via Hasura
- File upload restrictions

## Performance Optimization

- Video chunk uploading
- Lazy loading
- Image optimization
- API response caching
