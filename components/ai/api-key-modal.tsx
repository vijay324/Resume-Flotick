"use client";

import React, { useState } from "react";
import { useAI } from "@/context/ai-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, Check, X, ExternalLink } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const { addApiKey } = useAI();
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const result = await addApiKey(apiKey);

    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setApiKey("");
        setSuccess(false);
      }, 1500);
    } else {
      setError(result.error || "Failed to add API key");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Add Gemini API Key</h2>
        </div>

        <p className="text-sm text-muted-foreground">
          To use AI-powered features, you need to add your own Google Gemini API key.
          Your key will be encrypted and stored securely.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="api-key" className="text-sm font-medium">
              API Key
            </label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your Gemini API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isLoading || success}
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <X className="w-4 h-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="w-4 h-4" />
              API key added successfully!
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading || success || !apiKey.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : success ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Added!
                </>
              ) : (
                "Add API Key"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t space-y-2">
          <p className="text-xs text-muted-foreground">
            Don't have an API key?
          </p>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Get your free Gemini API key
            <ExternalLink className="w-3 h-3" />
          </a>
          <p className="text-xs text-muted-foreground mt-2">
            🔒 Your API key is encrypted and never leaves your device unencrypted.
          </p>
        </div>
      </Card>
    </div>
  );
}
