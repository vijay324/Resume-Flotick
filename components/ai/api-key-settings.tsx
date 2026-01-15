"use client";

import React, { useState } from "react";
import { useAI } from "@/context/ai-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Key, Trash2, RefreshCw, CheckCircle2, Settings } from "lucide-react";
import { ApiKeyModal } from "./api-key-modal";

export function ApiKeySettings() {
  const { hasApiKey, isApiKeyValid, removeApiKey, refreshStatus } = useAI();
  const [showModal, setShowModal] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveKey = async () => {
    if (!confirm("Are you sure you want to remove your API key? You'll need to add it again to use AI features.")) {
      return;
    }

    setIsRemoving(true);
    await removeApiKey();
    await refreshStatus();
    setIsRemoving(false);
  };

  const handleUpdateKey = () => {
    setShowModal(true);
  };

  if (!hasApiKey) {
    return (
      <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 border border-gray-100">
            <Key className="h-5 w-5 text-gray-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">No API Key Added</h3>
            <p className="text-sm text-gray-500">
              Add your Gemini API key to use AI features
            </p>
          </div>
          <Button onClick={() => setShowModal(true)} className="bg-black hover:bg-gray-800 text-white rounded-lg">
            Add API Key
          </Button>
        </div>
        <ApiKeyModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </div>
    );
  }

  return (
    <>
      <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 border border-green-100">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">API Key Configured</h3>
              {isApiKeyValid && (
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-green-50 text-green-700 rounded-full border border-green-100">
                  Active
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Your Gemini API key is encrypted and ready to use
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUpdateKey}
                className="h-9 rounded-lg border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Key
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveKey}
                disabled={isRemoving}
                className="h-9 rounded-lg border-gray-200 text-gray-700 hover:text-red-600 hover:bg-red-50 hover:border-red-100"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isRemoving ? "Removing..." : "Remove Key"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ApiKeyModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
}
