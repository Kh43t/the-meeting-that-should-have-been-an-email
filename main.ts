// The Meeting That Should Have Been an Email — make.fun entry.
//
// Writes one single-line joke to /output/entry.txt (or $OUTPUT_PATH when
// set, so the entry can be tested locally without touching /output).
// The gate counts 1-200 characters of UTF-8, not only whitespace, so the
// text is validated here before anything is written: empty, over-long,
// whitespace-only or multi-line text is refused instead of shipped.

import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const JOKE =
  "Someone shared their screen, opened the email this meeting was about, and read it aloud to twelve adults for forty minutes.";

const MAX_CHARS = 200;

function validate(text: string): void {
  const chars = [...text];
  if (chars.length < 1) {
    throw new Error("entry is empty");
  }
  if (chars.length > MAX_CHARS) {
    throw new Error(
      `entry is ${chars.length} characters, over the ${MAX_CHARS} limit`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

const outPath = process.env.OUTPUT_PATH ?? "/output/entry.txt";

validate(JOKE);
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JOKE, "utf8");
chmodSync(outPath, 0o644);

// Read the file back and refuse to finish if what landed on disk is not
// exactly the validated line: the sandbox collects the file as another
// user, so a silent write failure must surface here, not at grading time.
const written = readFileSync(outPath, "utf8");
if (written !== JOKE) {
  throw new Error("entry.txt on disk does not match the validated line");
}
