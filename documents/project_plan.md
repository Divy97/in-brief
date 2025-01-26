# in-brief: Project Plan

## Core Features & Implementation Order

### 1. Video Input System

- Support two input methods:
  - Direct video upload (mp4, mov, etc.)
  - YouTube URL input
- Basic validation and sanitization
- File size limits and format restrictions
- YouTube URL validation and metadata extraction

### 2. Anonymous Usage Flow

- No login required for basic usage
- Session-based tracking for free tier limits
- Store session in cookies to track daily usage
- Clear UI indicating remaining free uses
- Prompt for signup only after limit reached

### 3. Video Processing Pipeline

- Video upload handling
- YouTube video processing
- Progress indicators
- Error handling with user-friendly messages
- Temporary storage for anonymous users
- Permanent storage for authenticated users

### 4. Summarization System

- Text extraction from video
- AI-powered summarization
- Key points extraction
- Timeline markers for important moments
- Summary formatting and presentation

### 5. Authentication (Optional)

- Simple email/password signup
- Social auth options (Google, GitHub)
- Guest to authenticated user conversion
- Profile management
- Summary history for authenticated users

### 6. Subscription System

- Free tier: 3 videos per day
- Pro tier features:
  - Unlimited video summaries
  - Advanced summarization options
  - Summary history
  - Export functionality
- Payment integration (Stripe)
- Subscription management

## Technical Implementation Details

### Database Schema Extensions

sql
-- Add subscription related fields
ALTER TABLE users ADD COLUMN
subscription_tier TEXT DEFAULT 'free',
subscription_start TIMESTAMPTZ,
subscription_end TIMESTAMPTZ;

-- Track anonymous usage
CREATE TABLE anonymous_usage (
session_id TEXT PRIMARY KEY,
usage_count INTEGER DEFAULT 0,
last_used TIMESTAMPTZ DEFAULT NOW(),
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Store video processing status
ALTER TABLE videos ADD COLUMN
processing_status TEXT DEFAULT 'pending',
error_message TEXT,
youtube_url TEXT;

### API Routes Structure

    typescript
    app/
    api/
    video/
    upload/ // Direct video upload
    youtube/ // YouTube URL processing
    process/ // Video processing status
    summary/
    generate/ // Generate summary
    [id]/ // Get specific summary
    auth/
    register/ // Optional registration
    login/ // Optional login
    subscription/
    create/ // Create subscription
    webhook/ // Stripe webhook

### User Flow States

1. **Anonymous User**

   - Session cookie created
   - Daily limit tracked
   - Temporary storage

2. **Free User**

   - Basic account
   - 3 videos per day
   - Basic summarization

3. **Pro User**
   - Unlimited videos
   - Advanced features
   - Permanent storage

## Development Phases

### Phase 1: Core Functionality

- ✅ Project setup
- ✅ Database configuration
- 🏗️ Video input system
- 🏗️ Basic summarization
- 🏗️ Anonymous usage tracking

### Phase 2: Enhancement

- Authentication system
- User profiles
- Summary history
- Advanced summarization options

### Phase 3: Monetization

- Subscription system
- Payment integration
- Pro features
- Usage analytics

### Phase 4: Optimization

- Performance improvements
- Error handling
- User experience refinement
- SEO optimization

## Immediate Next Steps

1. Implement video upload component
2. Create YouTube URL processor
3. Set up anonymous session tracking
4. Develop basic summarization pipeline
5. Build summary display component
