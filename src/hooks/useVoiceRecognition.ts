"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export type RecognitionState = "idle" | "listening" | "processing" | "error";

export interface VoiceRecognitionError {
  code: string;
  message: string;
}

export interface UseVoiceRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  onError?: (error: VoiceRecognitionError) => void;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
}

export interface UseVoiceRecognitionReturn {
  isSupported: boolean;
  state: RecognitionState;
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  error: VoiceRecognitionError | null;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
}

const getSpeechRecognition = (): typeof SpeechRecognition | null => {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

export const useVoiceRecognition = (
  options: UseVoiceRecognitionOptions = {}
): UseVoiceRecognitionReturn => {
  const {
    language = "en-US",
    continuous = false,
    interimResults = true,
    maxAlternatives = 1,
    onError,
    onTranscript,
  } = options;

  const [isSupported, setIsSupported] = useState(false);
  const [state, setState] = useState<RecognitionState>("idle");
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<VoiceRecognitionError | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);

  // Check browser support on mount
  useEffect(() => {
    const SpeechRecognitionAPI = getSpeechRecognition();
    setIsSupported(SpeechRecognitionAPI !== null);

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  // Initialize recognition instance
  const initializeRecognition = useCallback(() => {
    const SpeechRecognitionAPI = getSpeechRecognition();
    if (!SpeechRecognitionAPI) return null;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = language;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.maxAlternatives = maxAlternatives;

    recognition.onstart = () => {
      isListeningRef.current = true;
      setState("listening");
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimText = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }

      if (finalText) {
        setTranscript((prev) => {
          const newTranscript = prev + (prev ? " " : "") + finalText;
          onTranscript?.(newTranscript, true);
          return newTranscript;
        });
        setInterimTranscript("");
      } else if (interimText) {
        setInterimTranscript(interimText);
        const fullTranscript = transcript + (transcript ? " " : "") + interimText;
        onTranscript?.(fullTranscript, false);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      isListeningRef.current = false;

      let errorMessage = "An error occurred during speech recognition";
      let errorCode = event.error;

      switch (event.error) {
        case "no-speech":
          errorMessage = "No speech was detected. Please try again.";
          break;
        case "audio-capture":
          errorMessage = "No microphone was found or microphone is not working.";
          break;
        case "not-allowed":
          errorMessage = "Microphone permission was denied. Please allow microphone access.";
          break;
        case "network":
          errorMessage = "Network error occurred. Please check your connection.";
          break;
        case "aborted":
          errorMessage = "Speech recognition was aborted.";
          errorCode = "aborted";
          break;
        case "language-not-supported":
          errorMessage = `Language ${language} is not supported.`;
          break;
        case "service-not-allowed":
          errorMessage = "Speech recognition service is not allowed in this context.";
          break;
      }

      const voiceError: VoiceRecognitionError = {
        code: errorCode,
        message: errorMessage,
      };

      setError(voiceError);
      setState(errorCode === "aborted" ? "idle" : "error");
      onError?.(voiceError);
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      if (state === "listening") {
        setState("idle");
      }
    };

    return recognition;
  }, [language, continuous, interimResults, maxAlternatives, onError, onTranscript, state, transcript]);

  // Start recognition
  const start = useCallback(async () => {
    if (!isSupported) {
      const voiceError: VoiceRecognitionError = {
        code: "not-supported",
        message: "Speech recognition is not supported in this browser.",
      };
      setError(voiceError);
      setState("error");
      onError?.(voiceError);
      return;
    }

    if (isListeningRef.current) {
      return;
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Initialize and start recognition
      if (!recognitionRef.current) {
        recognitionRef.current = initializeRecognition();
      }

      if (recognitionRef.current) {
        setError(null);
        setState("processing");
        recognitionRef.current.start();
      }
    } catch (err) {
      const voiceError: VoiceRecognitionError = {
        code: "permission-denied",
        message:
          err instanceof Error && err.name === "NotAllowedError"
            ? "Microphone permission was denied. Please allow microphone access in your browser settings."
            : "Failed to access microphone. Please check your device settings.",
      };
      setError(voiceError);
      setState("error");
      onError?.(voiceError);
    }
  }, [isSupported, initializeRecognition, onError]);

  // Stop recognition
  const stop = useCallback(() => {
    if (recognitionRef.current && isListeningRef.current) {
      recognitionRef.current.stop();
      isListeningRef.current = false;
      setState("idle");
    }
  }, []);

  // Reset transcript and state
  const reset = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setError(null);
    if (!isListeningRef.current) {
      setState("idle");
    }
  }, []);

  return {
    isSupported,
    state,
    transcript,
    interimTranscript,
    isListening: isListeningRef.current,
    error,
    start,
    stop,
    reset,
  };
};
