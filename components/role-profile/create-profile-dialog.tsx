"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRoleProfile } from "@/context/role-profile-context";
import { Copy, Plus, Loader2 } from "lucide-react";

interface CreateProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProfileDialog({ isOpen, onClose }: CreateProfileDialogProps) {
  const { createProfile, activeProfile } = useRoleProfile();
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when opening
  React.useEffect(() => {
    if (isOpen) {
        setName("");
        setJobTitle("");
        setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      // Pass activeProfile.id to clone data from current profile
      await createProfile(name, jobTitle || undefined, activeProfile?.id);
      onClose();
    } catch (error) {
      console.error("Failed to create profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Role Profile</DialogTitle>
          <DialogDescription>
             Create a tailored resume version for a specific job role. We'll start by copying your current profile data.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Profile Name</Label>
            <Input 
              id="profile-name"
              placeholder='e.g., "Full Stack Developer" or "Cybersecurity Analyst"'
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="col-span-3"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="job-title" className="text-muted-foreground font-normal">Target Job Title (Optional)</Label>
            <Input 
              id="job-title"
              placeholder='e.g., "Senior Software Engineer"'
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-indigo-50 text-indigo-700 text-xs rounded-lg border border-indigo-100">
             <Copy className="h-3.5 w-3.5 shrink-0" />
             <p>Data will be cloned from <strong>{activeProfile?.name || "Current Profile"}</strong>.</p>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || isSubmitting}>
              {isSubmitting ? (
                 <>
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                   Creating...
                 </>
              ) : (
                 <>
                   <Plus className="mr-1.5 h-4 w-4" />
                   Create Profile
                 </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
