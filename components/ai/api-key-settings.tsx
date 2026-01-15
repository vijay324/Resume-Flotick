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
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Key className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">No API Key Added</h3>
            <p className="text-sm text-muted-foreground">
              Add your Gemini API key to use AI features
            </p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            Add API Key
          </Button>
        </div>
        <ApiKeyModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">API Key Configured</h3>
              {isApiKeyValid && (
                <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                  Active
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your Gemini API key is encrypted and ready to use
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUpdateKey}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Key
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveKey}
                disabled={isRemoving}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isRemoving ? "Removing..." : "Remove Key"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <ApiKeyModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
}
