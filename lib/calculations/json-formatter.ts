export interface JsonFormatResult {
  success: boolean;
  formattedJson?: string;
  minifiedJson?: string;
  error?: {
    message: string;
    line?: number;
    column?: number;
  };
  stats?: {
    sizeBytes: number;
    keysCount: number;
    linesCount: number;
  };
}

export function formatJson(input: string, indent: number = 2): JsonFormatResult {
  if (!input || !input.trim()) {
    return {
      success: true,
      formattedJson: "",
      minifiedJson: "",
      stats: { sizeBytes: 0, keysCount: 0, linesCount: 0 },
    };
  }

  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, indent);
    const minified = JSON.stringify(parsed);

    // Count keys recursively
    const countKeys = (obj: unknown): number => {
      if (typeof obj !== "object" || obj === null) return 0;
      let count = Array.isArray(obj) ? 0 : Object.keys(obj).length;
      for (const key of Object.keys(obj)) {
        count += countKeys((obj as Record<string, unknown>)[key]);
      }
      return count;
    };

    return {
      success: true,
      formattedJson: formatted,
      minifiedJson: minified,
      stats: {
        sizeBytes: new TextEncoder().encode(formatted).length,
        keysCount: countKeys(parsed),
        linesCount: formatted.split("\n").length,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Malformed JSON syntax";

    // Try extracting line and column numbers from standard error message
    let line: number | undefined;
    let column: number | undefined;

    const lineColMatch = errorMsg.match(/position (\d+)/i);
    if (lineColMatch) {
      const pos = parseInt(lineColMatch[1], 10);
      const lines = input.substring(0, pos).split("\n");
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }

    return {
      success: false,
      error: {
        message: errorMsg,
        line,
        column,
      },
    };
  }
}
