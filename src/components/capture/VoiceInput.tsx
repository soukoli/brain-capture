"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, X, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useVoiceRecognition,
  type VoiceRecognitionError,
} from "@/hooks/useVoiceRecognition";
import { cn } from "@/lib/utils";

export interface VoiceInputProps {
  /** Callback when transcript is ready to be used */
  onTranscript?: (text: string) => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** Language code for speech recognition (default: en-US) */
  language?: string;
  /** Custom className for the container */
  className?: string;
  /** Whether to show the transcript preview */
  showTranscript?: boolean;
}

const LANGUAGE_OPTIONS = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "es-ES", label: "Spanish" },
  { code: "fr-FR", label: "French" },
  { code: "de-DE", label: "German" },
  { code: "it-IT", label: "Italian" },
  { code: "pt-BR", label: "Portuguese" },
  { code: "ja-JP", label: "Japanese" },
  { code: "zh-CN", label: "Chinese" },
  { code: "ko-KR", label: "Korean" },
];

export function VoiceInput({
  onTranscript,
  onError,
  language: initialLanguage = "en-US",
  className,
  showTranscript = true,
}: VoiceInputProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);

  const {
    isSupported,
    state,
    transcript,
    interimTranscript,
    isListening,
    error,
    start,
    stop,
    reset,
  } = useVoiceRecognition({
    language: selectedLanguage,
    continuous: true,
    interimResults: true,
    onError: (err: VoiceRecognitionError) => {
      onError?.(new Error(err.message));
    },
  });

  // Combined transcript for display
  const displayTranscript = transcript + (interimTranscript ? ` ${interimTranscript}` : "");
  const hasContent = transcript.length > 0;

  // Handle toggle recording
  const handleToggleRecording = async () => {
    if (isListening) {
      stop();
    } else {
      await start();
    }
  };

  // Handle clear
  const handleClear = () => {
    reset();
  };

  // Handle use transcript
  const handleUseTranscript = () => {
    if (transcript) {
      onTranscript?.(transcript);
      reset();
    }
  };

  // Not supported fallback
  if (!isSupported) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50">
              Voice Input Not Supported
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your browser doesn't support voice input. Please try using Chrome, Edge, or Safari on
              a desktop or mobile device.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Error state
  if (state === "error" && error) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-900 dark:text-slate-50">
              {error.code === "not-allowed" || error.code === "permission-denied"
                ? "Microphone Access Required"
                : "Voice Input Error"}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{error.message}</p>
          </div>
          <Button onClick={() => reset()} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Language Selection */}
      {showLanguageSelect && (
        <Card className="p-4">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Language
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus:border-slate-50 dark:focus:ring-slate-50"
            disabled={isListening}
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </Card>
      )}

      {/* Main Voice Input Card */}
      <Card className="p-6">
        <div className="flex flex-col items-center gap-6">
          {/* Recording Button */}
          <div className="relative">
            <Button
              onClick={handleToggleRecording}
              size="lg"
              variant={isListening ? "destructive" : "default"}
              className={cn(
                "h-20 w-20 rounded-full transition-all",
                isListening && "animate-pulse"
              )}
              disabled={state === "processing"}
              aria-label={isListening ? "Stop recording" : "Start recording"}
            >
              {state === "processing" ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : isListening ? (
                <MicOff className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </Button>

            {/* Recording Indicator */}
            {isListening && (
              <div className="absolute -right-1 -top-1 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500"></span>
              </div>
            )}
          </div>

          {/* Status Text */}
          <div className="text-center">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
              {state === "processing"
                ? "Initializing..."
                : isListening
                  ? "Listening..."
                  : "Tap to speak"}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {isListening ? "Tap again to stop" : "Voice will be transcribed in real-time"}
            </p>
          </div>

          {/* Language Toggle Button */}
          <Button
            onClick={() => setShowLanguageSelect(!showLanguageSelect)}
            variant="ghost"
            size="sm"
            disabled={isListening}
            className="text-xs"
          >
            {LANGUAGE_OPTIONS.find((l) => l.code === selectedLanguage)?.label || selectedLanguage}
          </Button>
        </div>
      </Card>

      {/* Transcript Display */}
      {showTranscript && (displayTranscript || hasContent) && (
        <Card className="p-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Transcript
              </h3>
              {hasContent && (
                <Button
                  onClick={handleClear}
                  variant="ghost"
                  size="sm"
                  disabled={isListening}
                  aria-label="Clear transcript"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Transcript Text */}
            <div
              className="min-h-[100px] max-h-[300px] overflow-y-auto rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
              role="log"
              aria-live="polite"
              aria-atomic="false"
            >
              <p className="whitespace-pre-wrap text-sm text-slate-900 dark:text-slate-50">
                {displayTranscript || (
                  <span className="text-slate-400 dark:text-slate-600">
                    Your speech will appear here...
                  </span>
                )}
              </p>
              {interimTranscript && (
                <span className="text-slate-400 dark:text-slate-500"> (listening...)</span>
              )}
            </div>

            {/* Action Buttons */}
            {hasContent && (
              <div className="flex gap-2">
                <Button
                  onClick={handleClear}
                  variant="outline"
                  size="sm"
                  disabled={isListening}
                  className="flex-1"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
                <Button
                  onClick={handleUseTranscript}
                  variant="default"
                  size="sm"
                  disabled={isListening}
                  className="flex-1"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Use This Text
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Accessibility Live Region for Screen Readers */}
      <div className="sr-only" role="status" aria-live="assertive" aria-atomic="true">
        {isListening
          ? "Recording in progress"
          : hasContent
            ? `Transcript: ${transcript}`
            : "Ready to record"}
      </div>
    </div>
  );
}
