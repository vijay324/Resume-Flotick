"use client";

import React, { useState } from "react";
import { useAI } from "@/context/ai-context";
import { Button } from "@/components/ui/button";
import {
  Key,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Eye,
  EyeOff,
  TestTube,
} from "lucide-react";
import { ApiKeyModal } from "./api-key-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function ApiKeySettings() {
  const {
    hasApiKey,
    isApiKeyValid,
    maskedKey,
    removeApiKey,
    testCurrentKey,
    refreshStatus,
    consentGiven,
    setConsentGiven,
  } = useAI();
  const [showModal, setShowModal] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    valid: boolean;
    error?: string;
  } | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const handleRemoveKey = async () => {
    setIsRemoving(true);
    try {
      await removeApiKey();
      await refreshStatus();
      setTestResult(null);
      setShowRemoveConfirm(false);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleTestKey = async () => {
    setIsTesting(true);
    setTestResult(null);
    const result = await testCurrentKey();
    setTestResult(result);
    setIsTesting(false);
  };

  const handleUpdateKey = () => {
    setTestResult(null);
    setShowModal(true);
  };

  // Security warning banner (always shown first time)
  if (!consentGiven) {
    return (
      <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <Shield className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 mb-2">
              Security Notice
            </h3>
            <div className="text-sm text-amber-800 space-y-2 mb-4">
              <p>
                <strong>Your API key is stored securely in your browser</strong>{" "}
                using encryption. It never leaves your device or is sent to any
                server.
              </p>
              <p className="text-amber-700 text-xs flex items-start gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>
                  As this is an open-source client-side app, determined users
                  with browser dev tools could potentially access stored keys.
                  Use a key with appropriate quota limits.
                </span>
              </p>
            </div>
            <Button
              onClick={() => setConsentGiven(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              I Understand, Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!hasApiKey) {
    return (
      <div className="p-5 bg-white border border-zinc-100 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-50 border border-zinc-100">
            <Key className="h-5 w-5 text-zinc-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-zinc-900">No API Key Added</h3>
            <p className="text-sm text-zinc-500">
              Add your Gemini API key to use AI features
            </p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-black hover:bg-zinc-800 text-white rounded-lg"
          >
            Add API Key
          </Button>
        </div>
        <ApiKeyModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </div>
    );
  }

  return (
    <>
      <div className="p-5 bg-white border border-zinc-100 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              isApiKeyValid
                ? "bg-green-50 border border-green-100"
                : "bg-yellow-50 border border-yellow-100"
            }`}
          >
            {isApiKeyValid ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-zinc-900">
                API Key Configured
              </h3>
              <span
                className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full border ${
                  isApiKeyValid
                    ? "bg-green-50 text-green-700 border-green-100"
                    : "bg-yellow-50 text-yellow-700 border-yellow-100"
                }`}
              >
                {isApiKeyValid ? "Active" : "Needs Testing"}
              </span>
            </div>

            {/* Masked key display */}
            <div className="text-sm text-zinc-500 mb-1 font-mono">
              {maskedKey}
            </div>

            <p className="text-xs text-zinc-400 mb-4 flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Encrypted in browser storage
            </p>

            {/* Test result */}
            {testResult && (
              <div
                className={`text-sm mb-4 p-2 rounded-lg ${
                  testResult.valid
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {testResult.valid
                  ? "✓ API key is valid and working"
                  : `✗ ${testResult.error}`}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestKey}
                disabled={isTesting}
                className="h-9 rounded-lg border-zinc-200 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50"
              >
                <TestTube className="h-4 w-4 mr-2" />
                {isTesting ? "Testing..." : "Test Key"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUpdateKey}
                className="h-9 rounded-lg border-zinc-200 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Key
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRemoveConfirm(true)}
                disabled={isRemoving}
                className="h-9 rounded-lg border-zinc-200 text-zinc-700 hover:text-red-600 hover:bg-red-50 hover:border-red-100"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isRemoving ? "Removing..." : "Remove Key"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ApiKeyModal isOpen={showModal} onClose={() => setShowModal(false)} />
      
      <ConfirmDialog
        isOpen={showRemoveConfirm}
        onClose={() => setShowRemoveConfirm(false)}
        onConfirm={handleRemoveKey}
        title="Remove API Key"
        description="Are you sure you want to remove your API key? You'll need to add it again to use AI features."
        confirmText="Remove Key"
        cancelText="Cancel"
        variant="danger"
        isLoading={isRemoving}
      />
    </>
  );
}
