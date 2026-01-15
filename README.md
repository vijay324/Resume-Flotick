# AI-Powered Resume Builder

A modern, AI-enhanced resume builder application powered by Google Gemini AI.

## Features

- **AI-Powered Resume Analysis**: Get detailed feedback on your resume with strengths, weaknesses, and actionable suggestions
- **LinkedIn Profile Optimizer**: Analyze and improve your LinkedIn profile with AI-powered recommendations
- **Content Rewriting**: Rewrite resume content in different tones (professional, concise, detailed)
- **Smart Summarization**: Summarize long text into concise, impactful statements
- **ATS Optimization**: Built-in ATS (Applicant Tracking System) compatibility checking
- **Real-time Preview**: See your changes instantly with live preview
- **Secure API Key Management**: Bring your own Gemini API key with encrypted storage

## AI Features

This application uses Google Gemini AI to provide intelligent features:

- **Resume Analysis**: Comprehensive analysis with scoring, strengths/weaknesses identification, and skill gap detection
- **Content Enhancement**: AI-powered content rewriting and summarization
- **LinkedIn Optimization**: Profile scoring, keyword optimization, and recruiter readiness analysis

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Google Gemini API key ([Get one free](https://aistudio.google.com/app/apikey))

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Copy `.env.example` to `.env` and update the encryption secret:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Using AI Features

1. Click on any AI-powered feature (marked with ✨ sparkle icon)
2. You'll be prompted to enter your Gemini API key
3. Get your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
4. Enter the key and start using AI features!

**Note**: Your API key is encrypted and stored securely. It never leaves your device unencrypted.

## Environment Variables

Required environment variables:

- `DATABASE_URL`: Database connection string (SQLite by default)
- `ENCRYPTION_SECRET`: Secret key for encrypting API keys (generate with `openssl rand -base64 32`)
- `RATE_LIMIT_REQUESTS_PER_DAY`: Maximum AI requests per day per user (default: 50)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **State Management**: React Context
- **Icons**: Lucide React

## Architecture

### Backend (API Routes)

- `/api/ai-keys` - API key management (add, check, remove)
- `/api/ai/summarize` - Content summarization
- `/api/ai/rewrite` - Content rewriting
- `/api/ai/analyze-resume` - Resume analysis
- `/api/ai/analyze-linkedin` - LinkedIn profile analysis

### Frontend Components

- `AIProvider` - Global AI state management
- `ApiKeyModal` - API key input and validation
- `ResumeAIPanel` - Resume analysis interface
- `LinkedInAnalyzer` - LinkedIn optimization tool
- `ContentAIToolbar` - Inline content enhancement tools

## Security

- API keys are encrypted at rest using AES-256-GCM
- All AI requests are proxied through the backend
- Rate limiting prevents abuse
- No API keys are stored in plain text

## Open Source

This project is open source. Users must provide their own Gemini API keys - the application does not include any hardcoded keys or provide API keys.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
