import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlignLeft, AlignJustify, AlignCenter } from "lucide-react";
import type { ContentLength } from "@/types/ai";

interface LengthSelectorProps {
  value: ContentLength;
  onChange: (value: ContentLength) => void;
  className?: string;
  id?: string;
}

export function LengthSelector({ value, onChange, className, id }: LengthSelectorProps) {
  return (
    <div className={className}>
      <Select value={value} onValueChange={(v) => onChange(v as ContentLength)}>
        <SelectTrigger id={id} className="h-8 w-[110px] text-xs">
          <div className="flex items-center gap-2">
            {value === "short" && <AlignCenter className="w-3 h-3" />}
            {value === "medium" && <AlignJustify className="w-3 h-3" />}
            {value === "long" && <AlignLeft className="w-3 h-3" />}
            <SelectValue placeholder="Length" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="short" className="text-xs">
            <div className="flex items-center gap-2">
              <AlignCenter className="w-3 h-3" />
              <span>Short</span>
            </div>
          </SelectItem>
          <SelectItem value="medium" className="text-xs">
            <div className="flex items-center gap-2">
              <AlignJustify className="w-3 h-3" />
              <span>Medium</span>
            </div>
          </SelectItem>
          <SelectItem value="long" className="text-xs">
            <div className="flex items-center gap-2">
              <AlignLeft className="w-3 h-3" />
              <span>Long</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
