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

### 🔒 Security & Privacy

- **Enterprise-grade Security** with comprehensive input validation
- **API Key Protection** with secure environment handling
- **Rate Limiting** to prevent abuse
- **XSS Protection** with content sanitization
- **Security Headers** for enhanced protection
- **Audit Tools** for continuous security monitoring

### 🛠 Technical Excellence

- **Modern Tech Stack** with React 19, TypeScript, and Vite
- **Real-time Database** with Supabase integration
- **Authentication** powered by Stack Auth
- **Voice Processing** with Web Audio API
- **Performance Optimized** with lazy loading and code splitting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Google Gemini API key
- Supabase account
- Stack Auth account

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

5. **Database Setup**

   - Run the SQL scripts in your Supabase dashboard:
     - `database-setup-stack-auth.sql` (for Stack Auth integration)
     - Or `database-setup.sql` (for basic setup)

6. **Start Development Server**

   ```bash
   pnpm dev
   ```

7. **Security Check** (Optional but recommended)
   ```bash
   pnpm run security-check
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

# Code Quality
pnpm lint                  # TypeScript type checking
pnpm security-check        # Run security audit
pnpm security-audit        # Full security audit with dependencies

# Maintenance
pnpm clean                 # Clean build artifacts
pnpm setup                 # Initial project setup
````

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

## 🎯 Key Components

### AI Services

- **GeminiService**: Handles AI conversations with memory integration
- **VoiceService**: Real-time voice chat with Google Gemini Live API
- **MemoryService**: Intelligent conversation memory and context

### User Features

- **Authentication**: Secure user management with Stack Auth
- **Profile Management**: Customizable personality and preferences
- **Conversation History**: Persistent chat storage with search
- **Achievements**: Gamified interaction system
- **Mood Tracking**: Daily emotional check-ins

### Technical Infrastructure

- **Database Layer**: Supabase with Row Level Security
- **Security Layer**: Comprehensive input validation and sanitization
- **Logging System**: Production-safe error handling
- **Performance**: Optimized with lazy loading and caching

## 🌐 API Integration

### Google Gemini AI

- **Text Generation**: Advanced conversational AI
- **Voice Processing**: Real-time audio conversation
- **Context Awareness**: Memory-enhanced responses

### Supabase Database

- **Real-time Sync**: Live conversation updates
- **Secure Storage**: Encrypted user data
- **Scalable Architecture**: Production-ready database

### Stack Auth

- **User Management**: Secure authentication flow
- **Session Handling**: Persistent login state
- **Profile Integration**: Seamless user experience

## 🎨 Customization

### Personality Configuration

Users can customize Riya's personality:

- **Caring & Nurturing**
- **Playful & Fun**
- **Intellectual & Thoughtful**
- **Romantic & Sweet**
- **Supportive & Understanding**

### Communication Styles

- **Casual**: Relaxed and informal
- **Formal**: Polite and respectful
- **Intimate**: Close and personal
- **Humorous**: Light-hearted and funny

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Enhanced tablet experience
- **Desktop**: Full-featured desktop interface
- **PWA Ready**: Progressive Web App capabilities

## 🔄 Development Workflow

### Getting Started

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run security checks
5. Submit a pull request

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality enforcement
- **Security First**: All changes must pass security audit
- **Performance**: Optimized for speed and efficiency

## 📊 Performance

- **Fast Loading**: Optimized bundle size with code splitting
- **Efficient Rendering**: React 19 with concurrent features
- **Memory Management**: Intelligent caching and cleanup
- **Real-time Updates**: Optimistic UI updates

## 🛡️ Privacy & Data Protection

- **Local Storage**: Sensitive data encrypted locally
- **Minimal Data Collection**: Only necessary information stored
- **User Control**: Full data export and deletion capabilities
- **Compliance Ready**: GDPR and privacy law considerations

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Security First**: All contributions must pass security review
2. **Code Quality**: Follow TypeScript and React best practices
3. **Testing**: Include tests for new features
4. **Documentation**: Update docs for any changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation

- [Security Guide](./SECURITY.md) - Comprehensive security documentation
- [API Documentation](./docs/api.md) - API reference (if available)
- [Deployment Guide](./docs/deployment.md) - Production deployment (if available)

### Getting Help

- **Issues**: Report bugs and request features
- **Discussions**: Community support and questions
- **Security**: Report security issues privately

## 🎉 Acknowledgments

- **Google Gemini AI** for advanced AI capabilities
- **Supabase** for real-time database infrastructure
- **Stack Auth** for secure authentication
- **React Team** for the amazing framework
- **Open Source Community** for inspiration and tools

---

**Built with ❤️ for meaningful AI companionship**

> **Note**: This is a demonstration project showcasing AI companion technology. Please use responsibly and in accordance with all applicable laws and regulations.
