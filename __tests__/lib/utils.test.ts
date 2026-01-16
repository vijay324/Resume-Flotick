/**
 * @fileoverview Unit tests for lib/utils.ts
 * Tests the `cn` utility function for merging classNames with Tailwind
 */

import { cn } from "@/lib/utils";

describe("cn utility", () => {
  describe("basic usage", () => {
    it("should return empty string when no arguments provided", () => {
      expect(cn()).toBe("");
    });

    it("should return single class unchanged", () => {
      expect(cn("text-red-500")).toBe("text-red-500");
    });

    it("should merge multiple classes", () => {
      expect(cn("text-red-500", "bg-blue-500")).toBe("text-red-500 bg-blue-500");
    });

    it("should merge classes from array", () => {
      expect(cn(["text-red-500", "bg-blue-500"])).toBe("text-red-500 bg-blue-500");
    });
  });

  describe("conditional classes", () => {
    it("should handle undefined values", () => {
      expect(cn("base-class", undefined)).toBe("base-class");
    });

    it("should handle null values", () => {
      expect(cn("base-class", null)).toBe("base-class");
    });

    it("should handle false values", () => {
      expect(cn("base-class", false)).toBe("base-class");
    });

    it("should handle conditional expressions", () => {
      const isActive = true;
      const isDisabled = false;
      expect(cn("base", isActive && "active", isDisabled && "disabled")).toBe(
        "base active"
      );
    });

    it("should handle object syntax", () => {
      expect(
        cn({
          "text-red-500": true,
          "bg-blue-500": false,
          "border-green-500": true,
        })
      ).toBe("text-red-500 border-green-500");
    });
  });

  describe("tailwind merge behavior", () => {
    it("should merge conflicting tailwind classes (last wins)", () => {
      // twMerge should keep the last conflicting class
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    it("should merge conflicting padding classes", () => {
      expect(cn("p-4", "p-2")).toBe("p-2");
    });

    it("should merge conflicting margin classes", () => {
      expect(cn("m-4", "m-2")).toBe("m-2");
    });

    it("should merge conflicting width classes", () => {
      expect(cn("w-full", "w-1/2")).toBe("w-1/2");
    });

    it("should not merge non-conflicting classes", () => {
      expect(cn("text-red-500", "bg-blue-500", "p-4")).toBe(
        "text-red-500 bg-blue-500 p-4"
      );
    });

    it("should handle complex tailwind class merging", () => {
      const result = cn(
        "px-4 py-2 bg-blue-500 text-white",
        "px-6", // override px
        "hover:bg-blue-600"
      );
      expect(result).toContain("px-6");
      expect(result).toContain("py-2");
      expect(result).toContain("bg-blue-500");
      expect(result).toContain("text-white");
      expect(result).toContain("hover:bg-blue-600");
      expect(result).not.toContain("px-4");
    });
  });

  describe("edge cases", () => {
    it("should handle empty strings", () => {
      expect(cn("", "class1", "", "class2")).toBe("class1 class2");
    });

    it("should handle whitespace-only strings", () => {
      expect(cn("   ", "class1")).toBe("class1");
    });

    it("should handle deeply nested arrays", () => {
      expect(cn(["a", ["b", ["c"]]])).toBe("a b c");
    });

    it("should handle mixed types", () => {
      expect(
        cn(
          "string-class",
          ["array-class"],
          { "object-class": true },
          undefined,
          null,
          false
        )
      ).toBe("string-class array-class object-class");
    });
  });
});
