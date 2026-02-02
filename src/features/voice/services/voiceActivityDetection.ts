import { Audio } from 'expo-av';

interface VADConfig {
  silenceThreshold: number;
  silenceDuration: number;
  maxRecordingDuration: number;
}

const DEFAULT_CONFIG: VADConfig = {
  silenceThreshold: -40,
  silenceDuration: 1500,
  maxRecordingDuration: 120000,
};

interface VADCallbacks {
  onSpeechStart?: () => void;
  onSpeechEnd?: (audioUri: string) => void;
  onSilenceDetected?: () => void;
  onMeteringUpdate?: (db: number) => void;
}

export class VoiceActivityDetector {
  private recording: Audio.Recording | null = null;
  private config: VADConfig;
  private callbacks: VADCallbacks;
  private silenceStartTime: number | null = null;
  private isSpeaking = false;
  private meteringInterval: ReturnType<typeof setInterval> | null = null;

  constructor(callbacks: VADCallbacks, config: Partial<VADConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.callbacks = callbacks;
  }

  async start(): Promise<void> {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    this.recording = new Audio.Recording();
    await this.recording.prepareToRecordAsync({
      ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
      isMeteringEnabled: true,
    });

    await this.recording.startAsync();
    this.startMetering();
  }

  async stop(): Promise<string | null> {
    if (this.meteringInterval) {
      clearInterval(this.meteringInterval);
      this.meteringInterval = null;
    }

    if (!this.recording) return null;

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;
      this.isSpeaking = false;
      this.silenceStartTime = null;

      if (uri) {
        this.callbacks.onSpeechEnd?.(uri);
      }

      return uri ?? null;
    } catch (error) {
      console.error('Error stopping recording:', error);
      return null;
    }
  }

  async cancel(): Promise<void> {
    if (this.meteringInterval) {
      clearInterval(this.meteringInterval);
      this.meteringInterval = null;
    }

    if (this.recording) {
      try {
        await this.recording.stopAndUnloadAsync();
      } catch {
        // Ignore cleanup errors
      }
      this.recording = null;
    }
  }

  private startMetering(): void {
    this.meteringInterval = setInterval(async () => {
      if (!this.recording) return;

      const status = await this.recording.getStatusAsync();
      if (!status.isRecording) return;

      const db = status.metering ?? -160;
      this.callbacks.onMeteringUpdate?.(db);

      if (db > this.config.silenceThreshold) {
        if (!this.isSpeaking) {
          this.isSpeaking = true;
          this.callbacks.onSpeechStart?.();
        }
        this.silenceStartTime = null;
      } else if (this.isSpeaking) {
        if (!this.silenceStartTime) {
          this.silenceStartTime = Date.now();
          this.callbacks.onSilenceDetected?.();
        } else if (Date.now() - this.silenceStartTime > this.config.silenceDuration) {
          await this.stop();
        }
      }

      if (status.durationMillis && status.durationMillis > this.config.maxRecordingDuration) {
        await this.stop();
      }
    }, 100);
  }
}
