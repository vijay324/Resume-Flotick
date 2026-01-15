"use client";

import React, { useState } from "react";
import { useAI } from "@/context/ai-context";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Sparkles, Loader2, Lock } from "lucide-react";
import { ApiKeyModal } from "./api-key-modal";

interface AIButtonProps extends Omit<ButtonProps, "onClick"> {
  onClick?: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
}

export function AIButton({
  onClick,
  isLoading = false,
  children,
  disabled,
  ...props
}: AIButtonProps) {
  const { aiEnabled } = useAI();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (!aiEnabled) {
      setShowModal(true);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {children}
          </>
        ) : !aiEnabled ? (
          <>
            <Lock className="w-4 h-4 mr-2" />
            {children}
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            {children}
          </>
        )}
      </Button>

      <ApiKeyModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
