import { spawnSync } from "node:child_process";
import { readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const schemas = [
  "public",
  "api",
  "util",
  "research_private",
  "orchestration",
  "evidence",
  "taxonomy",
  "corpus",
  "knowledge",
  "staging",
  "ranking",
  "research",
  "retrieval",
  "evaluation",
  "observability",
  "curriculum",
];

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const outputPath = path.join(repositoryRoot, "src", "database.generated.ts");
const temporaryPath = `${outputPath}.tmp`;
const checkOnly = process.argv.includes("--check");
const connectionFlag = process.argv.includes("--linked") ? "--linked" : "--local";

const command = process.execPath;
const cliEntryPoint = path.join(
  repositoryRoot,
  "node_modules",
  "supabase",
  "dist",
  "supabase.js",
);
const args = ["gen", "types", "typescript", connectionFlag];
args.unshift(cliEntryPoint);
for (const schema of schemas) args.push("--schema", schema);

const result = spawnSync(command, args, {
  cwd: repositoryRoot,
  encoding: "utf8",
  maxBuffer: 128 * 1024 * 1024,
});

if (result.status !== 0) {
  process.stderr.write(result.stderr || result.stdout);
  process.exit(result.status ?? 1);
}

const generated = `${result.stdout.replaceAll("\r\n", "\n").trimEnd()}\n`;

if (checkOnly) {
  const existing = readFileSync(outputPath, "utf8").replaceAll("\r\n", "\n");
  if (existing !== generated) {
    process.stderr.write(
      "Generated database types are stale. Run npm run types:generate and commit the result.\n",
    );
    process.exit(1);
  }
  process.stdout.write("Generated database types are current.\n");
  process.exit(0);
}

try {
  writeFileSync(temporaryPath, generated, "utf8");
  renameSync(temporaryPath, outputPath);
} finally {
  rmSync(temporaryPath, { force: true });
}

process.stdout.write(`Generated ${path.relative(repositoryRoot, outputPath)}.\n`);
