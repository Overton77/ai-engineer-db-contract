import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import pg from "pg";

const projectRef = "wkythqbofmckbuoothhn";
const root = resolve(import.meta.dirname, "..");
const url = process.env.POSTGRES_URL_NON_POOLING;
if (!url || !new URL(url).username.endsWith(`.${projectRef}`) || new URL(url).port !== "5432") throw new Error("Explicit blue-ocean session-pooler POSTGRES_URL_NON_POOLING required");
const apply = process.argv.includes("--apply");
const connection = new pg.Client({ connectionString: url, statement_timeout: 120_000, application_name: "report-contract-deploy" });
await connection.connect();
const migrations = [
  "20260912020000_km_13_knowledge_intents.sql",
  "20260912030000_km_14_executor_lineage_and_global_vocabulary_reads.sql",
  "20260912040000_km_15_operation_receipt_tenant_policy.sql",
  "20260913010000_research_report_packages.sql",
  "20260913020000_report_assessment_links.sql",
];

async function preservation() {
  const tables = (await connection.query("select tablename from pg_tables where schemaname='public' and tablename like 'research\\_%' escape '\\' order by tablename")).rows;
  const digests = {};
  for (const { tablename } of tables) {
    const identifier = `public."${tablename.replaceAll('"', '""')}"`;
    digests[identifier] = (await connection.query(`select count(*)::text rows,md5(coalesce(string_agg(value,'' order by value),'')) digest from (select to_jsonb(t)::text value from ${identifier} t) snapshot`)).rows[0];
  }
  for (const [table, columns] of [["report", "id,tenant_id,mission_id,slug,title,created_at"], ["report_version", "id,report_id,version,markdown_artifact_id,json_artifact_id,synthesis_consistency_eval_id,assurance_summary,published_at"], ["report_claim", "report_version_id,claim_id,role"]]) {
    digests[`research.${table}`] = (await connection.query(`select count(*)::text rows,md5(coalesce(string_agg(to_jsonb(t)::text,'' order by to_jsonb(t)::text),'')) digest from (select ${columns} from research.${table}) t`)).rows[0];
  }
  return digests;
}

try {
  const before = await preservation();
  const applied = (await connection.query("select version,name from supabase_migrations.schema_migrations order by version")).rows;
  const directory = mkdtempSync(join(tmpdir(), "report-contract-deploy-"));
  mkdirSync(join(directory, "supabase", "migrations"), { recursive: true });
  copyFileSync(join(root, "supabase", "config.toml"), join(directory, "supabase", "config.toml"));
  // These markers align existing cloud history; only canonical pending files execute.
  for (const row of applied) {
    if (!/^\d{14}$/.test(row.version)) throw new Error("Unexpected remote migration version");
    writeFileSync(join(directory, "supabase", "migrations", `${row.version}_already_applied.sql`), "-- Existing cloud ledger entry; metadata alignment only.\n");
  }
  const pending = migrations.filter((file) => !applied.some((row) => row.version === file.slice(0, 14)));
  for (const file of pending) copyFileSync(join(root, "supabase", "migrations", file), join(directory, "supabase", "migrations", file));
  const args = [join(root, "node_modules", "supabase", "dist", "supabase.js"), "db", "push", "--db-url", url, "--workdir", directory, ...(apply ? ["--yes"] : ["--dry-run"])];
  const result = spawnSync(process.execPath, args, { encoding: "utf8", maxBuffer: 4_000_000, timeout: 180_000 });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.replaceAll(url, "[REDACTED_DATABASE_URL]");
  process.stdout.write(output);
  if (result.status !== 0) throw new Error(`Migration command failed (${result.status})`);
  const after = await preservation();
  if (JSON.stringify(before) !== JSON.stringify(after)) throw new Error("Protected data preservation mismatch");
  const state = (await connection.query("select version,name from supabase_migrations.schema_migrations order by version desc limit 4")).rows;
  const receipt = { projectRef, mode: apply ? "applied" : "dry_run", pending, preservation: before, preservationMatches: true, migrations: state, recordedAt: new Date().toISOString() };
  if (apply) writeFileSync(join(root, "docs", "knowledge-model", pending.includes("20260913010000_research_report_packages.sql") ? "REPORT-CONTRACT-DEPLOYMENT.json" : "REPORT-ASSESSMENT-DEPLOYMENT.json"), `${JSON.stringify(receipt, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ mode: receipt.mode, pending, preservationMatches: true, preservedTables: Object.keys(before).length, migrations: state }, null, 2)}\n`);
} finally {
  await connection.end();
}
