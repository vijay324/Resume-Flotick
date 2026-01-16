/**
 * Text Humanizer Utility
 * Cleans and normalizes AI-generated text for a natural, human-like reading experience
 */

// Common robotic phrases to replace with more natural alternatives
const PHRASE_REPLACEMENTS: [RegExp, string][] = [
  // Overused corporate jargon
  [/\butilize\b/gi, "use"],
  [/\butilizing\b/gi, "using"],
  [/\butilization\b/gi, "use"],
  [/\bleverage\b/gi, "use"],
  [/\bleveraging\b/gi, "using"],
  [/\bleveraged\b/gi, "used"],
  [/\bsynergize\b/gi, "combine"],
  [/\bsynergy\b/gi, "collaboration"],
  [/\bsynergies\b/gi, "benefits"],
  [/\boptimize\b/gi, "improve"],
  [/\boptimizing\b/gi, "improving"],
  [/\bfacilitate\b/gi, "help"],
  [/\bfacilitating\b/gi, "helping"],
  [/\bfacilitated\b/gi, "helped"],
  
  // Robotic sentence starters (context-sensitive, be careful)
  [/^In order to\s/gim, "To "],
  [/^It is important to note that\s/gim, "Note that "],
  [/^It should be noted that\s/gim, ""],
  [/^Additionally,\s/gim, "Also, "],
  [/^Furthermore,\s/gim, "Also, "],
  [/^Moreover,\s/gim, "Also, "],
  
  // Overly formal phrases
  [/\bprior to\b/gi, "before"],
  [/\bsubsequent to\b/gi, "after"],
  [/\bin the event that\b/gi, "if"],
  [/\bat this point in time\b/gi, "now"],
  [/\bat the present time\b/gi, "now"],
  [/\bdue to the fact that\b/gi, "because"],
  [/\bin spite of the fact that\b/gi, "although"],
  [/\bwith regard to\b/gi, "about"],
  [/\bwith respect to\b/gi, "about"],
  [/\bpertaining to\b/gi, "about"],
  [/\bin terms of\b/gi, "for"],
  
  // Filler phrases
  [/\bbasically,?\s/gi, ""],
  [/\bessentially,?\s/gi, ""],
  [/\bin essence,?\s/gi, ""],
];

/**
 * Humanize AI-generated text by cleaning artifacts and replacing robotic phrases
 */
export function humanizeText(text: string): string {
  if (!text || typeof text !== "string") {
    return text;
  }

  let result = text;

  // Apply phrase replacements
  for (const [pattern, replacement] of PHRASE_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }

  // Clean up formatting issues
  result = cleanFormatting(result);

  return result.trim();
}

/**
 * Clean formatting artifacts from AI output
 */
function cleanFormatting(text: string): string {
  return text
    // Remove excessive whitespace
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    // Clean up bullet point inconsistencies
    .replace(/^[\s]*[-•*]\s*/gm, "• ")
    // Remove stray markdown for plain text (if not expected)
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
    // Normalize dashes
    .replace(/\s+-\s+/g, " – ")
    // Fix double punctuation
    .replace(/([.!?])\1+/g, "$1")
    // Fix spacing after punctuation
    .replace(/([.!?,;:])([A-Za-z])/g, "$1 $2")
    // Remove leading/trailing whitespace from lines
    .split("\n")
    .map((line) => line.trim())
    .join("\n");
}

/**
 * Light humanization for content that should preserve more structure
 * (e.g., bullet points in job descriptions)
 */
export function humanizePreserveStructure(text: string): string {
  if (!text || typeof text !== "string") {
    return text;
  }

  let result = text;

  // Apply only phrase replacements, preserve formatting
  for (const [pattern, replacement] of PHRASE_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }

  // Minimal cleanup
  return result
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}
