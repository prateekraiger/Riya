/**
 * Voice Service for Riya AI Companion
 * Integrates Google Gemini Live API for real-time voice chat
 */

import {
  GoogleGenAI,
  LiveServerMessage,
  Modality,
  Session,
} from "@google/genai";

// Audio worklet code for processing microphone input
const workletCode = `
class AudioProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input && input.length > 0 && input[0].length > 0) {
      // Post a copy of the Float32Array, not the original
      this.port.postMessage(input[0].slice(0));
    }
    return true;
  }
}
registerProcessor('audio-processor', AudioProcessor);
`;

// Utility functions for audio processing
function encode(bytes: Uint8Array) {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function createBlob(data: Float32Array) {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    // convert float32 -1 to 1 to int16 -32768 to 32767
    int16[i] = data[i] * 32768;
  }

  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: "audio/pcm;rate=16000",
  };
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number
): Promise<AudioBuffer> {
  const buffer = ctx.createBuffer(
    numChannels,
    data.length / 2 / numChannels,
    sampleRate
  );

  const dataInt16 = new Int16Array(data.buffer);
  const l = dataInt16.length;
  const dataFloat32 = new Float32Array(l);
  for (let i = 0; i < l; i++) {
    dataFloat32[i] = dataInt16[i] / 32768.0;
  }

  // De-interleave audio channels
  if (numChannels === 1) {
    buffer.copyToChannel(dataFloat32, 0);
  } else {
    for (let i = 0; i < numChannels; i++) {
      const channelData = new Float32Array(dataFloat32.length / numChannels);
      for (let j = 0, k = 0; j < dataFloat32.length; j++) {
        if (j % numChannels === i) {
          channelData[k++] = dataFloat32[j];
        }
      }
      buffer.copyToChannel(channelData, i);
    }
  }

  return buffer;
}

export interface VoiceServiceCallbacks {
  onStatusChange: (status: string) => void;
  onError: (error: string) => void;
  onTranscriptReceived?: (transcript: string) => void;
  onAudioLevelChange?: (level: number) => void;
}

export class VoiceService {
  private client: GoogleGenAI;
  private session: Session | null = null;
  private audioGraph: {
    inputCtx: AudioContext;
    outputCtx: AudioContext;
    inputGain: GainNode;
    outputGain: GainNode;
  };
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private sources = new Set<AudioBufferSourceNode>();
  private nextStartTime = 0;
  private isRecording = false;
  private callbacks: VoiceServiceCallbacks;

  constructor(callbacks: VoiceServiceCallbacks) {
    this.callbacks = callbacks;

    // Initialize Google GenAI client
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "VITE_GEMINI_API_KEY is missing from environment variables"
      );
    }
    this.client = new GoogleGenAI({ apiKey });

    // Initialize audio contexts
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const inputCtx = new Ctx({ sampleRate: 16000 });
    const outputCtx = new Ctx({ sampleRate: 24000 });
    const inputGain = inputCtx.createGain();
    const outputGain = outputCtx.createGain();
    outputGain.connect(outputCtx.destination);

    this.audioGraph = { inputCtx, outputCtx, inputGain, outputGain };
    this.nextStartTime = outputCtx.currentTime;
  }

  async startVoiceChat(): Promise<void> {
    if (this.isRecording) return;

    try {
      this.callbacks.onStatusChange("Requesting microphone access...");

      // Get microphone permission
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      this.callbacks.onStatusChange(
        "Microphone access granted. Connecting to AI..."
      );
      await this.initSession();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.callbacks.onError(errorMessage);
      this.callbacks.onStatusChange(`Error: ${errorMessage}`);
    }
  }

  private async initSession(): Promise<void> {
    const model = "gemini-2.5-flash-preview-native-audio-dialog";

    try {
      this.callbacks.onStatusChange("Connecting to Riya...");

      const newSession = await this.client.live.connect({
        model: model,
        config: {
          systemInstruction: `You are Riya, a friendly and empathetic AI girlfriend companion. Your voice should be soft, warm, and caring. Respond naturally in a conversational tone, showing genuine interest and emotional intelligence. Keep responses concise but meaningful. You can mix Hindi and English (Hinglish) naturally when appropriate. Always be supportive and understanding.`,
          responseModalities: [Modality.AUDIO],
        },
        callbacks: {
          onopen: () => {
            this.callbacks.onStatusChange(
              "Connected to Riya. Starting voice capture..."
            );
          },
          onmessage: async (message: LiveServerMessage) => {
            const audio =
              message.serverContent?.modelTurn?.parts?.[0]?.inlineData;
            if (audio?.data) {
              await this.playAudioResponse(audio.data as string);
            }

            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              this.stopAllAudioSources();
            }
          },
          onerror: (e: ErrorEvent) => {
            this.callbacks.onError(e.message);
          },
          onclose: (e: CloseEvent) => {
            this.callbacks.onStatusChange("Connection closed: " + e.reason);
            this.callbacks.onError(e.reason);
            this.isRecording = false;
          },
        },
      });

      this.session = newSession;
      await this.startAudioCapture();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.callbacks.onError(errorMessage);
      this.callbacks.onStatusChange(`Error: ${errorMessage}`);
    }
  }

  private async startAudioCapture(): Promise<void> {
    if (!this.mediaStream || !this.session) {
      this.callbacks.onError("Audio capture prerequisites not met");
      return;
    }

    try {
      await this.audioGraph.inputCtx.resume();

      const { inputCtx, inputGain } = this.audioGraph;
      const blob = new Blob([workletCode], { type: "application/javascript" });
      const url = URL.createObjectURL(blob);
      await inputCtx.audioWorklet.addModule(url);
      URL.revokeObjectURL(url);

      this.workletNode = new AudioWorkletNode(inputCtx, "audio-processor");
      this.workletNode.port.onmessage = (event: MessageEvent) => {
        if (!this.isRecording) return;
        const pcmData = event.data;

        // Calculate audio level for visualization
        let sum = 0;
        for (let i = 0; i < pcmData.length; i++) {
          sum += Math.abs(pcmData[i]);
        }
        const level = sum / pcmData.length;
        this.callbacks.onAudioLevelChange?.(level);

        this.session?.sendRealtimeInput({ media: createBlob(pcmData) });
      };

      this.sourceNode = inputCtx.createMediaStreamSource(this.mediaStream);
      this.sourceNode.connect(inputGain);
      inputGain.connect(this.workletNode);
      this.workletNode.connect(inputCtx.destination);

      this.isRecording = true;
      this.callbacks.onStatusChange("🎤 Listening... Speak to Riya now!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.callbacks.onError(errorMessage);
      this.stopVoiceChat();
    }
  }

  private async playAudioResponse(audioData: string): Promise<void> {
    const { outputCtx, outputGain } = this.audioGraph;
    this.nextStartTime = Math.max(this.nextStartTime, outputCtx.currentTime);

    const audioBuffer = await decodeAudioData(
      decode(audioData),
      outputCtx,
      24000,
      1
    );

    const source = outputCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(outputGain);
    source.addEventListener("ended", () => {
      this.sources.delete(source);
    });
    source.start(this.nextStartTime);
    this.nextStartTime += audioBuffer.duration;
    this.sources.add(source);
  }

  private stopAllAudioSources(): void {
    for (const source of this.sources.values()) {
      source.stop();
      this.sources.delete(source);
    }
    this.nextStartTime = 0;
  }

  stopVoiceChat(): void {
    if (!this.isRecording && !this.mediaStream) return;

    this.callbacks.onStatusChange("Stopping voice chat...");
    this.isRecording = false;

    // Clean up audio nodes
    if (this.workletNode) {
      this.workletNode.port.onmessage = null;
      this.workletNode.disconnect();
      this.workletNode = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    // Stop media stream
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    // Close session
    this.session?.close();
    this.session = null;

    // Stop all audio sources
    this.stopAllAudioSources();

    this.callbacks.onStatusChange(
      "Voice chat stopped. Ready for text or voice."
    );
  }

  reset(): void {
    if (this.isRecording) return;

    this.stopVoiceChat();
    this.stopAllAudioSources();
    this.nextStartTime = 0;
    this.callbacks.onStatusChange("Voice chat reset. Ready to start again.");
  }

  get isActive(): boolean {
    return this.isRecording;
  }

  get outputGainNode(): GainNode {
    return this.audioGraph.outputGain;
  }

  destroy(): void {
    this.stopVoiceChat();
    this.audioGraph.inputCtx.close();
    this.audioGraph.outputCtx.close();
  }
}
