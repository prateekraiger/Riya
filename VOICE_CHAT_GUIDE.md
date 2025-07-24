# Voice Chat Integration Guide

## Overview

This guide explains the voice chat functionality integrated into Riya AI Companion using Google's Gemini Live API for real-time voice conversations.

## Features Added

### 🎤 Real-time Voice Chat

- **Live Audio Streaming**: Real-time bidirectional audio communication
- **Voice Activity Detection**: Visual feedback for audio levels
- **Seamless Integration**: Voice chat alongside existing text chat
- **Beautiful UI**: Custom voice chat panel with Riya's design language

### 🎨 Voice UI Components

#### 1. VoiceChatPanel

- Modal interface for voice chat controls
- Real-time status updates
- Audio level visualization
- Start/stop/reset controls

#### 2. VoiceVisualizer

- Animated audio level indicator
- Pulsing effects during voice activity
- Matches Riya's pink/purple theme

#### 3. VoiceService

- Core service handling Gemini Live API
- Audio processing and streaming
- Session management
- Error handling

## How to Use

### For Users

1. **Start Voice Chat**: Click the microphone button in chat input or header
2. **Speak Naturally**: Talk to Riya as you would in person
3. **Listen to Response**: Riya responds with natural voice
4. **Control Session**: Use stop/reset buttons as needed

### For Developers

#### Installation

The voice chat feature requires Google GenAI version 0.9.0 or higher:

```bash
npm install @google/genai@^0.9.0
```

#### Environment Setup

Ensure your `.env.local` includes:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_with_live_api_access
```

#### Key Components Integration

**1. Voice Service Usage:**

```typescript
import { VoiceService } from "../services/voiceService";

const callbacks = {
  onStatusChange: (status) => console.log(status),
  onError: (error) => console.error(error),
  onAudioLevelChange: (level) => updateVisualizer(level),
};

const voiceService = new VoiceService(callbacks);
await voiceService.startVoiceChat();
```

**2. Voice Chat Panel:**

```tsx
import { VoiceChatPanel } from "../components/VoiceChatPanel";

<VoiceChatPanel
  isOpen={showVoiceChat}
  onClose={() => setShowVoiceChat(false)}
/>;
```

## Technical Implementation

### Audio Processing Pipeline

1. **Input**: Microphone → MediaStream → AudioWorklet
2. **Processing**: PCM conversion → Base64 encoding → Gemini Live API
3. **Output**: API Response → Audio decoding → Web Audio API playback

### Key Files Added/Modified

#### New Files:

- `services/voiceService.ts` - Core voice chat service
- `components/VoiceChatPanel.tsx` - Main voice chat interface
- `components/VoiceVisualizer.tsx` - Audio level visualization
- `components/VoiceIndicator.tsx` - Voice activity indicator

#### Modified Files:

- `components/ChatInput.tsx` - Added voice chat button
- `pages/ChatPage.tsx` - Integrated voice chat panel
- `store/useVoiceStore.ts` - Extended voice state management
- `package.json` - Updated Google GenAI dependency

### Audio Contexts

- **Input Context**: 16kHz sample rate for microphone input
- **Output Context**: 24kHz sample rate for AI response playback
- **Gain Nodes**: Volume control for input/output audio

### Error Handling

- Microphone permission errors
- Network connectivity issues
- API rate limiting
- Audio codec compatibility

## Browser Compatibility

### Supported Browsers

- ✅ Chrome 66+
- ✅ Firefox 60+
- ✅ Safari 14.1+
- ✅ Edge 79+

### Required Features

- Web Audio API
- MediaDevices API
- AudioWorklet support
- WebRTC (for microphone access)

## Performance Considerations

### Optimization Features

- **Audio Worklet**: Efficient real-time audio processing
- **Streaming**: Low-latency audio streaming
- **Memory Management**: Proper cleanup of audio sources
- **Error Recovery**: Graceful handling of connection issues

### Resource Usage

- **CPU**: Moderate usage during active voice chat
- **Memory**: ~10-20MB additional during voice session
- **Network**: Continuous streaming during conversation
- **Battery**: Higher usage on mobile devices

## Security & Privacy

### Data Handling

- Audio data is processed in real-time
- No local audio storage
- Encrypted transmission to Gemini API
- Session-based processing only

### Permissions

- Microphone access required
- User consent for each session
- Clear permission indicators

## Troubleshooting

### Common Issues

**1. Microphone Not Working**

- Check browser permissions
- Ensure HTTPS connection
- Verify microphone hardware

**2. No Audio Response**

- Check speaker/headphone connection
- Verify audio output device
- Check browser audio settings

**3. Connection Errors**

- Verify API key validity
- Check network connectivity
- Ensure Gemini Live API access

**4. Poor Audio Quality**

- Check microphone quality
- Reduce background noise
- Ensure stable internet connection

### Debug Mode

Enable debug logging by setting:

```typescript
console.log("Voice service debug mode enabled");
```

## Future Enhancements

### Planned Features

- **Voice Commands**: Specific voice commands for app control
- **Language Detection**: Automatic language switching
- **Voice Cloning**: Custom voice personalities
- **Noise Cancellation**: Advanced audio filtering
- **Offline Mode**: Local voice processing capabilities

### Integration Opportunities

- **3D Avatar Sync**: Lip-sync with 3D avatar (Phase 3)
- **Emotion Detection**: Voice-based emotion analysis
- **Multi-language**: Support for multiple languages
- **Voice Memory**: Remember voice preferences

## API Reference

### VoiceService Methods

```typescript
class VoiceService {
  startVoiceChat(): Promise<void>;
  stopVoiceChat(): void;
  reset(): void;
  get isActive(): boolean;
  destroy(): void;
}
```

### Callback Interfaces

```typescript
interface VoiceServiceCallbacks {
  onStatusChange: (status: string) => void;
  onError: (error: string) => void;
  onTranscriptReceived?: (transcript: string) => void;
  onAudioLevelChange?: (level: number) => void;
}
```

## Contributing

When contributing to voice chat features:

1. **Test Audio**: Verify on multiple devices/browsers
2. **Handle Errors**: Implement proper error boundaries
3. **Performance**: Monitor memory and CPU usage
4. **Accessibility**: Ensure keyboard navigation support
5. **Documentation**: Update this guide with changes

## Support

For voice chat related issues:

- Check browser console for errors
- Verify API key permissions
- Test microphone in other applications
- Review network connectivity

---

_This voice chat integration transforms Riya from a text-based companion to a truly conversational AI friend, bringing us closer to the vision of natural human-AI interaction._
