"use client";

import { useState } from "react";
import { VoiceInput } from "@/components/capture/VoiceInput";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Example page demonstrating the VoiceInput component
 * This shows how to integrate voice capture into your application
 */
export default function VoiceInputExample() {
  const [capturedTexts, setCapturedTexts] = useState<string[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);

  const handleTranscript = (text: string) => {
    // Add the new transcript to the list
    setCapturedTexts((prev) => [...prev, text]);
    setLastError(null);
  };

  const handleError = (error: Error) => {
    setLastError(error.message);
  };

  const handleClearAll = () => {
    setCapturedTexts([]);
    setLastError(null);
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
          Voice Input Component
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Capture your thoughts using voice-to-text
        </p>
      </div>

      {/* Voice Input Component */}
      <div className="mb-8">
        <VoiceInput
          onTranscript={handleTranscript}
          onError={handleError}
          language="en-US"
          showTranscript={true}
        />
      </div>

      {/* Error Display */}
      {lastError && (
        <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
          <CardContent className="pt-6">
            <p className="text-sm text-red-800 dark:text-red-200">{lastError}</p>
          </CardContent>
        </Card>
      )}

      {/* Captured Texts */}
      {capturedTexts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Captured Thoughts</CardTitle>
                <CardDescription>
                  {capturedTexts.length} {capturedTexts.length === 1 ? "item" : "items"} captured
                </CardDescription>
              </div>
              <button
                onClick={handleClearAll}
                className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
              >
                Clear All
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {capturedTexts.map((text, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Item #{index + 1}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-600">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-900 dark:text-slate-50">{text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>1. Tap the microphone button to start recording</li>
            <li>2. Speak clearly into your device's microphone</li>
            <li>3. Watch your speech appear as text in real-time</li>
            <li>4. Tap the microphone again to stop recording</li>
            <li>5. Click "Use This Text" to save your transcript</li>
            <li>6. Change the language using the language selector</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
