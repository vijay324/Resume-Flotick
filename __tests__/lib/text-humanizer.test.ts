/**
 * @fileoverview Unit tests for lib/text-humanizer.ts
 * Tests AI text humanization and cleaning utilities
 */

import { humanizeText, humanizePreserveStructure } from "@/lib/text-humanizer";

describe("humanizeText", () => {
  describe("phrase replacements", () => {
    it("should replace 'utilize' with 'use'", () => {
      expect(humanizeText("We utilize advanced technology")).toBe(
        "We use advanced technology"
      );
    });

    it("should replace 'utilizing' with 'using'", () => {
      expect(humanizeText("By utilizing this approach")).toBe(
        "By using this approach"
      );
    });

    it("should replace 'leverage' with 'use'", () => {
      expect(humanizeText("Leverage your skills")).toBe("use your skills");
    });

    it("should replace 'leveraging' with 'using'", () => {
      expect(humanizeText("Leveraging the platform")).toBe("using the platform");
    });

    it("should replace 'synergy' with 'collaboration'", () => {
      expect(humanizeText("Team synergy is important")).toBe(
        "Team collaboration is important"
      );
    });

    it("should replace 'optimize' with 'improve'", () => {
      expect(humanizeText("Optimize the process")).toBe("improve the process");
    });

    it("should replace 'facilitate' with 'help'", () => {
      expect(humanizeText("Facilitate the meeting")).toBe("help the meeting");
    });

    it("should replace 'prior to' with 'before'", () => {
      expect(humanizeText("Prior to the meeting")).toBe("before the meeting");
    });

    it("should replace 'subsequent to' with 'after'", () => {
      expect(humanizeText("Subsequent to the event")).toBe("after the event");
    });

    it("should replace 'in the event that' with 'if'", () => {
      expect(humanizeText("In the event that you need help")).toBe(
        "if you need help"
      );
    });

    it("should replace 'at this point in time' with 'now'", () => {
      expect(humanizeText("At this point in time")).toBe("now");
    });

    it("should replace 'due to the fact that' with 'because'", () => {
      expect(humanizeText("Due to the fact that it works")).toBe(
        "because it works"
      );
    });

    it("should replace 'with regard to' with 'about'", () => {
      expect(humanizeText("With regard to the project")).toBe(
        "about the project"
      );
    });

    it("should replace 'pertaining to' with 'about'", () => {
      expect(humanizeText("Information pertaining to users")).toBe(
        "Information about users"
      );
    });

    it("should replace 'in terms of' with 'for'", () => {
      expect(humanizeText("In terms of performance")).toBe("for performance");
    });

    it("should remove filler phrases like 'basically'", () => {
      expect(humanizeText("Basically, this is the solution")).toBe(
        "this is the solution"
      );
    });

    it("should remove 'essentially'", () => {
      expect(humanizeText("Essentially this works")).toBe("this works");
    });
  });

  describe("robotic sentence starters", () => {
    it("should replace 'In order to' with 'To'", () => {
      expect(humanizeText("In order to succeed")).toBe("To succeed");
    });

    it("should replace 'Additionally,' with 'Also,'", () => {
      expect(humanizeText("Additionally, we need more")).toBe(
        "Also, we need more"
      );
    });

    it("should replace 'Furthermore,' with 'Also,'", () => {
      expect(humanizeText("Furthermore, consider this")).toBe(
        "Also, consider this"
      );
    });

    it("should replace 'Moreover,' with 'Also,'", () => {
      expect(humanizeText("Moreover, the results show")).toBe(
        "Also, the results show"
      );
    });
  });

  describe("formatting cleanup", () => {
    it("should reduce excessive newlines", () => {
      const input = "Line 1\n\n\n\n\nLine 2";
      const result = humanizeText(input);
      expect(result).toBe("Line 1\n\nLine 2");
    });

    it("should normalize bullet points", () => {
      const input = "  - Item 1\n  * Item 2\n  • Item 3";
      const result = humanizeText(input);
      expect(result).toContain("•");
    });

    it("should remove markdown bold/italic markers", () => {
      expect(humanizeText("This is **bold** text")).toBe("This is bold text");
      expect(humanizeText("This is *italic* text")).toBe("This is italic text");
    });

    it("should fix double punctuation", () => {
      expect(humanizeText("End of sentence..")).toBe("End of sentence.");
      expect(humanizeText("Question??")).toBe("Question?");
    });

    it("should fix spacing after punctuation", () => {
      expect(humanizeText("First.Second")).toBe("First. Second");
      expect(humanizeText("Hello,World")).toBe("Hello, World");
    });

    it("should normalize dashes", () => {
      expect(humanizeText("word - word")).toBe("word – word");
    });

    it("should trim lines", () => {
      const input = "  Line with spaces  \n  Another line  ";
      const result = humanizeText(input);
      expect(result).toBe("Line with spaces\nAnother line");
    });
  });

  describe("edge cases", () => {
    it("should return empty string for empty input", () => {
      expect(humanizeText("")).toBe("");
    });

    it("should return same value for null input", () => {
      expect(humanizeText(null as unknown as string)).toBe(null);
    });

    it("should return same value for undefined input", () => {
      expect(humanizeText(undefined as unknown as string)).toBe(undefined);
    });

    it("should handle non-string input", () => {
      expect(humanizeText(123 as unknown as string)).toBe(123);
    });

    it("should be case insensitive for replacements", () => {
      expect(humanizeText("UTILIZE the resources")).toBe("use the resources");
      expect(humanizeText("Leverage THE platform")).toBe("use THE platform");
    });

    it("should handle multiple replacements in same text", () => {
      const input =
        "We utilize and leverage technology to optimize and facilitate processes.";
      const result = humanizeText(input);
      expect(result).toBe(
        "We use and use technology to improve and help processes."
      );
    });
  });
});

describe("humanizePreserveStructure", () => {
  describe("phrase replacements", () => {
    it("should apply phrase replacements", () => {
      expect(humanizePreserveStructure("Utilize the API")).toBe("use the API");
    });

    it("should replace 'leverage' with 'use'", () => {
      expect(humanizePreserveStructure("Leverage your skills")).toBe(
        "use your skills"
      );
    });
  });

  describe("structure preservation", () => {
    it("should preserve bullet points", () => {
      const input = "• Item 1\n• Item 2\n• Item 3";
      const result = humanizePreserveStructure(input);
      expect(result).toBe("• Item 1\n• Item 2\n• Item 3");
    });

    it("should not convert bullet point formats", () => {
      const input = "- Item 1\n* Item 2";
      const result = humanizePreserveStructure(input);
      // Should preserve original bullet formats
      expect(result).toContain("- Item 1");
      expect(result).toContain("* Item 2");
    });

    it("should preserve markdown formatting", () => {
      const input = "This is **bold** and *italic*";
      const result = humanizePreserveStructure(input);
      expect(result).toBe("This is **bold** and *italic*");
    });
  });

  describe("minimal cleanup", () => {
    it("should reduce excessive newlines", () => {
      const input = "Line 1\n\n\n\n\nLine 2";
      const result = humanizePreserveStructure(input);
      expect(result).toBe("Line 1\n\nLine 2");
    });

    it("should normalize multiple spaces", () => {
      const input = "Word    with    spaces";
      const result = humanizePreserveStructure(input);
      expect(result).toBe("Word with spaces");
    });

    it("should trim leading and trailing whitespace", () => {
      const input = "   Trimmed text   ";
      const result = humanizePreserveStructure(input);
      expect(result).toBe("Trimmed text");
    });
  });

  describe("edge cases", () => {
    it("should return empty string for empty input", () => {
      expect(humanizePreserveStructure("")).toBe("");
    });

    it("should return same value for null input", () => {
      expect(humanizePreserveStructure(null as unknown as string)).toBe(null);
    });

    it("should return same value for undefined input", () => {
      expect(humanizePreserveStructure(undefined as unknown as string)).toBe(
        undefined
      );
    });
  });
});
