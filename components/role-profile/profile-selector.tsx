"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRoleProfile } from "@/context/role-profile-context";
import { ChevronDown, Plus, Check, UserCircle2, Briefcase } from "lucide-react";
import { CreateProfileDialog } from "./create-profile-dialog";
import { cn } from "@/lib/utils";

export function ProfileSelector({ className }: { className?: string }) {
  const { profiles, activeProfile, switchProfile, isLoading } = useRoleProfile();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className={cn("h-9 w-32 bg-zinc-100 animate-pulse rounded-lg", className)} />
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn("w-[140px] sm:w-[200px] lg:w-[180px] xl:w-[200px] justify-between pl-3 pr-2 h-9 border-zinc-200 bg-white/50 backdrop-blur-sm hover:bg-white hover:border-zinc-300 transition-all group", className)}
          >
            <div className="flex items-center gap-2 truncate">
              {activeProfile ? (
                 <div
                    className="h-2 w-2 rounded-full shrink-0 ring-2 ring-white shadow-sm"
                    style={{ backgroundColor: activeProfile.color }}
                 />
              ) : (
                 <UserCircle2 className="h-4 w-4 text-zinc-400" />
              )}
              <span className={cn("truncate text-sm font-medium", !activeProfile && "text-zinc-500")}>
                {activeProfile?.name || "Select Profile"}
              </span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[240px] p-2" align="start">
          <DropdownMenuLabel className="text-xs text-zinc-400 font-medium px-2 py-1.5 uppercase tracking-wider">
            Role Profiles
          </DropdownMenuLabel>
          <DropdownMenuGroup className="space-y-1">
             {profiles.map((profile) => (
                <DropdownMenuItem
                  key={profile.id}
                  onSelect={() => switchProfile(profile.id)}
                  className="flex items-center justify-between px-2 py-2 rounded-md cursor-pointer focus:bg-zinc-100 focus:text-zinc-900 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-700"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className="h-2.5 w-2.5 rounded-full shrink-0 ring-1 ring-zinc-200"
                      style={{ backgroundColor: profile.color }}
                    />
                    <div className="flex flex-col truncate">
                       <span className="font-medium truncate">{profile.name}</span>
                       {profile.jobTitle && (
                          <span className="text-[10px] text-zinc-500 truncate">{profile.jobTitle}</span>
                       )}
                    </div>
                  </div>
                  {activeProfile?.id === profile.id && (
                    <Check className="h-4 w-4 text-indigo-600 ml-2 shrink-0" />
                  )}
                </DropdownMenuItem>
             ))}
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator className="my-2 bg-zinc-100" />
          
          <DropdownMenuItem 
            onSelect={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2 text-indigo-600 focus:text-indigo-700 focus:bg-indigo-50 font-medium cursor-pointer"
          >
            <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
              <Plus className="h-3.5 w-3.5" />
            </div>
            Create New Profile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateProfileDialog 
        isOpen={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)} 
      />
    </>
  );
}
