import type { Database } from "./database.generated.js";

export type ResearchReport = Database["research"]["Tables"]["report"]["Row"];
export type ResearchReportVersion = Database["research"]["Tables"]["report_version"]["Row"];
export type ResearchReportPackage = Database["research"]["Tables"]["report_package"]["Row"];
export type ResearchReportSection = Database["research"]["Tables"]["report_section_version"]["Row"];
export type ResearchReportAssertion = Database["research"]["Tables"]["report_assertion"]["Row"];
export type ResearchReportClaimBinding = Database["research"]["Tables"]["report_assertion_claim"]["Row"];
export type ResearchReportArtifact = Database["research"]["Tables"]["report_artifact"]["Row"];
export type ResearchReportQuestion = Database["research"]["Tables"]["report_question"]["Row"];
export type ResearchReportSeal = Database["research"]["Tables"]["report_package_seal"]["Row"];
export type ResearchReportIngestionLink = Database["research"]["Tables"]["report_ingestion_link"]["Row"];
export type ResearchReportAssessment = Database["research"]["Tables"]["report_assessment"]["Row"];
