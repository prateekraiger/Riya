# 🌟 Riya AI Companion

> **A secure, intelligent, and emotionally aware AI girlfriend companion built with React, TypeScript, and Google Gemini AI**

[![Security Status](https://img.shields.io/badge/Security-Hardened-green.svg)](./SECURITY.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-purple.svg)](https://vitejs.dev/)

## ✨ Features

### 🤖 AI Capabilities

- **Advanced Conversational AI** powered by Google Gemini 2.5 Flash
- **Real-time Voice Chat** with native audio processing
- **Emotional Intelligence** with mood tracking and empathetic responses
- **Memory System** that remembers personal details and conversation history
- **Multilingual Support** with natural Hindi-English (Hinglish) integration

### 🎨 User Experience

- **Personalized Interactions** based on user preferences and personality
- **Achievement System** to gamify conversations and engagement
- **Daily Check-ins** for mood tracking and emotional support
- **Conversation Highlights** to save memorable moments
- **Responsive Design** optimized for all devices
- **Dark/Light Theme** support

### 🛠 Technical Excellence

- **Modern Tech Stack** with React 19, TypeScript, and Vite
- **Real-time Database** with Supabase integration
- **Authentication** powered by Stack Auth
- **Voice Processing** with Web Audio API
- **Performance Optimized** with lazy loading and code splitting

## 🚀 Quick Start


### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd riya-ai-companion
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure your API keys** in `.env.local`:

   ```env
   # Google Gemini AI
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key
   VITE_GOOGLE_TTS_API_KEY=your_actual_google_tts_key

   # Supabase Database
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Stack Authentication
   VITE_STACK_PROJECT_ID=your_stack_project_id
   VITE_STACK_PUBLISHABLE_CLIENT_KEY=your_stack_publishable_key
   VITE_STACK_SECRET_SERVER_KEY=your_stack_secret_key
   ```


6. **Start Development Server**

   ```bash
   pnpm dev
   ```


## 📁 Project Structure

````
riya-ai-companion/
├── 📁 auth/                    # Authentication configuration
├── 📁 components/              # React components
│   ├── 📁 layout/             # Layout components
│   ├── 📁 ui/                 # UI components
│   └── 📄 *.tsx               # Feature components
├── 📁 database/               # Database utilities
├── 📁 hooks/                  # Custom React hooks
├── 📁 lib/                    # Utility libraries
│   ├── 📄 env.ts              # Environment configuration
│   ├── 📄 logger.ts           # Secure logging system
│   ├── 📄 security.ts         # Security utilities
│   └── 📄 security-config.ts  # Security configuration
├── 📁 pages/                  # Application pages
├── 📁 scripts/                # Build and utility scripts
├── 📁 services/               # API and service layers
│   ├── 📄 geminiService.ts    # AI conversation service
│   ├── 📄 memoryService.ts    # Memory management
│   └── 📄 voiceService.ts     # Voice chat service
├── 📁 types/                  # TypeScript type definitions
├── 📄 .htaccess               # Security headers configuration
├── 📄 SECURITY.md             # Security documentation
└── 📄 package.json            # Dependencies and scrip
cp .env.example .env.local

## 🔧 Available Scripts

```bash
# Development
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm preview               # Preview production build



## 🔒 Security Features

### Built-in Security Measures

- ✅ **Input Sanitization** - All user inputs are validated and sanitized
- ✅ **XSS Protection** - Content Security Policy and input filtering
- ✅ **Rate Limiting** - API abuse prevention
- ✅ **Secure Headers** - OWASP recommended security headers
- ✅ **Environment Protection** - API keys never exposed to client
- ✅ **Dependency Scanning** - Regular vulnerability audits
- ✅ **Secure Logging** - Production-safe logging with data sanitization

### Security Tools

```bash
# Run comprehensive security check
pnpm run security-check

# Check for dependency vulnerabilities
pnpm audit

# Full security audit
pnpm run security-audit
```



## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.


> **Note**: This is a demonstration project showcasing AI companion technology. Please use responsibly and in accordance with all applicable laws and regulations.
