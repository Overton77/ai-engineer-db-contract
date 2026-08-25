export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  api: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      agent_skill_profile: {
        Row: {
          created_at: string | null
          description: string | null
          distribution: string | null
          format_version: string | null
          id: string | null
          latest_release: string | null
          license_spdx: string | null
          lifecycle_state: string
          name: string | null
          skill_format: string | null
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          distribution?: string | null
          format_version?: string | null
          id?: string | null
          latest_release?: never
          license_spdx?: string | null
          lifecycle_state?: string | null
          name?: string | null
          skill_format?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          distribution?: string | null
          format_version?: string | null
          id?: string | null
          latest_release?: never
          license_spdx?: string | null
          lifecycle_state?: string | null
          name?: string | null
          skill_format?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      claim_with_evidence: {
        Row: {
          claim_id: string | null
          claim_type: string | null
          created_at: string | null
          evidence: Json | null
          statement: string | null
          status: Database["evidence"]["Enums"]["claim_status"] | null
        }
        Relationships: []
      }
      lesson_freshness: {
        Row: {
          backing_records: number | null
          freshness: string | null
          lesson_id: string | null
          slug: string | null
          stale_records: number | null
          status: Database["curriculum"]["Enums"]["publish_status"] | null
          title: string | null
          version: number | null
        }
        Relationships: []
      }
      library_profile: {
        Row: {
          created_at: string | null
          current_license: string | null
          description: string | null
          display_name: string | null
          ecosystem: string | null
          first_released_on: string | null
          homepage_url: string | null
          id: string | null
          lifecycle_state: string
          maintenance_status: string | null
          package_name: string | null
          primary_language: string | null
          taxonomy_terms: Json | null
          updated_at: string | null
        }
        Relationships: []
      }
      mcp_server_profile: {
        Row: {
          created_at: string | null
          description: string | null
          distribution_kind: string | null
          ecosystem: string | null
          id: string | null
          latest_release: string | null
          license_spdx: string | null
          lifecycle_state: string
          name: string | null
          package_name: string | null
          registry_id: string | null
          registry_status: string | null
          transport_kinds: string[] | null
          updated_at: string | null
          version_count: number | null
        }
        Relationships: []
      }
      mission_progress: {
        Row: {
          budget_cost_usd: number | null
          cost_usd: number | null
          ended_at: string | null
          failed: number | null
          goal: string | null
          mission_id: string | null
          outstanding: number | null
          slug: string | null
          started_at: string | null
          status: Database["orchestration"]["Enums"]["mission_status"] | null
          succeeded: number | null
          work_items: number | null
        }
        Relationships: []
      }
      model_profile: {
        Row: {
          availability: string | null
          context_window_tokens: number | null
          created_at: string | null
          display_name: string | null
          family: string | null
          id: string | null
          latest_released_on: string | null
          latest_version: string | null
          modality: string[] | null
          model_kind: string | null
          model_slug: string | null
          openness: string | null
          provider: string | null
        }
        Relationships: []
      }
      review_queue: {
        Row: {
          assignee: string | null
          created_at: string | null
          priority: number | null
          quorum_required: number | null
          review_task_id: string | null
          state: Database["evaluation"]["Enums"]["review_state"] | null
          subject_kind: string | null
          summary: string | null
          task_kind: string | null
          updated_at: string | null
        }
        Insert: {
          assignee?: string | null
          created_at?: string | null
          priority?: number | null
          quorum_required?: number | null
          review_task_id?: string | null
          state?: Database["evaluation"]["Enums"]["review_state"] | null
          subject_kind?: string | null
          summary?: string | null
          task_kind?: string | null
          updated_at?: string | null
        }
        Update: {
          assignee?: string | null
          created_at?: string | null
          priority?: number | null
          quorum_required?: number | null
          review_task_id?: string | null
          state?: Database["evaluation"]["Enums"]["review_state"] | null
          subject_kind?: string | null
          summary?: string | null
          task_kind?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      technical_record_search: {
        Row: {
          assurance_level: string | null
          confidence: number | null
          id: string | null
          maturity: Database["knowledge"]["Enums"]["maturity"] | null
          next_revalidation_at: string | null
          record_kind: string | null
          revalidation_state:
            | Database["knowledge"]["Enums"]["revalidation_state"]
            | null
          scope: Json | null
          statement: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      evidence_packet: { Args: { p_packet_id: string }; Returns: Json }
      leaderboard: {
        Args: { p_slug: string }
        Returns: {
          entity_id: string
          entity_kind: string
          explanation: string
          rank: number
          score: number
        }[]
      }
      submit_intent: {
        Args: {
          p_attempt_id?: string
          p_idempotency_key: string
          p_intent_type: string
          p_mission_id?: string
          p_payload: Json
          p_preconditions?: Json
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  corpus: {
    Tables: {
      agent_skill: {
        Row: {
          created_at: string
          created_by_receipt_id: string
          description: string | null
          distribution: string | null
          format_version: string | null
          id: string
          license_spdx: string | null
          lifecycle_state: string
          maintainer_organization_id: string | null
          merged_into_id: string | null
          name: string
          repository_id: string | null
          skill_format: string | null
          slug: string | null
          tenant_id: string
          updated_at: string
          updated_by_receipt_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_receipt_id: string
          description?: string | null
          distribution?: string | null
          format_version?: string | null
          id?: string
          license_spdx?: string | null
          lifecycle_state: string
          maintainer_organization_id?: string | null
          merged_into_id?: string | null
          name: string
          repository_id?: string | null
          skill_format?: string | null
          slug?: string | null
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_receipt_id?: string
          description?: string | null
          distribution?: string | null
          format_version?: string | null
          id?: string
          license_spdx?: string | null
          lifecycle_state?: string
          maintainer_organization_id?: string | null
          merged_into_id?: string | null
          name?: string
          repository_id?: string | null
          skill_format?: string | null
          slug?: string | null
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_skill_maintainer_organization_id_fkey"
            columns: ["maintainer_organization_id"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_skill_merged_into_id_fkey"
            columns: ["merged_into_id"]
            isOneToOne: false
            referencedRelation: "agent_skill"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_skill_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repository"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_skill_requires_mcp_server: {
        Row: {
          agent_skill_id: string
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          mcp_server_id: string
          min_server_version: string | null
          optionality: string
          provenance_claim_id: string | null
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          agent_skill_id: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          mcp_server_id: string
          min_server_version?: string | null
          optionality?: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          agent_skill_id?: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          mcp_server_id?: string
          min_server_version?: string | null
          optionality?: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_skill_requires_mcp_server_agent_skill_id_fkey"
            columns: ["agent_skill_id"]
            isOneToOne: false
            referencedRelation: "agent_skill"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_skill_requires_mcp_server_mcp_server_id_fkey"
            columns: ["mcp_server_id"]
            isOneToOne: false
            referencedRelation: "mcp_server"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_skill_targets_library: {
        Row: {
          agent_skill_id: string
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          library_id: string
          lifecycle_state: string
          provenance_claim_id: string | null
          relationship: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          agent_skill_id: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          library_id: string
          lifecycle_state: string
          provenance_claim_id?: string | null
          relationship?: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          agent_skill_id?: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          library_id?: string
          lifecycle_state?: string
          provenance_claim_id?: string | null
          relationship?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_skill_targets_library_agent_skill_id_fkey"
            columns: ["agent_skill_id"]
            isOneToOne: false
            referencedRelation: "agent_skill"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_skill_targets_library_library_id_fkey"
            columns: ["library_id"]
            isOneToOne: false
            referencedRelation: "library"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_skill_version: {
        Row: {
          agent_skill_id: string
          bundled_tooling: Json | null
          created_at: string
          created_by_receipt_id: string
          id: string
          manifest: Json | null
          released_on: string | null
          version_label: string
        }
        Insert: {
          agent_skill_id: string
          bundled_tooling?: Json | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          manifest?: Json | null
          released_on?: string | null
          version_label: string
        }
        Update: {
          agent_skill_id?: string
          bundled_tooling?: Json | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          manifest?: Json | null
          released_on?: string | null
          version_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_skill_version_agent_skill_id_fkey"
            columns: ["agent_skill_id"]
            isOneToOne: false
            referencedRelation: "agent_skill"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_model: {
        Row: {
          created_at: string
          created_by_receipt_id: string
          display_name: string
          family: string | null
          id: string
          lifecycle_state: string
          merged_into_id: string | null
          modality: string[]
          model_kind: string | null
          model_slug: string
          openness: string | null
          provider_organization_id: string
          tenant_id: string
          updated_at: string
          updated_by_receipt_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_receipt_id: string
          display_name: string
          family?: string | null
          id?: string
          lifecycle_state: string
          merged_into_id?: string | null
          modality?: string[]
          model_kind?: string | null
          model_slug: string
          openness?: string | null
          provider_organization_id: string
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_receipt_id?: string
          display_name?: string
          family?: string | null
          id?: string
          lifecycle_state?: string
          merged_into_id?: string | null
          modality?: string[]
          model_kind?: string | null
          model_slug?: string
          openness?: string | null
          provider_organization_id?: string
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_model_merged_into_id_fkey"
            columns: ["merged_into_id"]
            isOneToOne: false
            referencedRelation: "ai_model"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_model_provider_organization_id_fkey"
            columns: ["provider_organization_id"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_model_availability_fact: {
        Row: {
          ai_model_version_id: string
          availability: string
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          provenance_claim_id: string | null
          valid_from: string
          valid_to: string | null
          validity: unknown
        }
        Insert: {
          ai_model_version_id: string
          availability: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
          validity?: unknown
        }
        Update: {
          ai_model_version_id?: string
          availability?: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
          validity?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "ai_model_availability_fact_ai_model_version_id_fkey"
            columns: ["ai_model_version_id"]
            isOneToOne: false
            referencedRelation: "ai_model_version"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_model_released_by_organization: {
        Row: {
          ai_model_id: string
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          organization_id: string
          provenance_claim_id: string | null
          release_role: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          ai_model_id: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          organization_id: string
          provenance_claim_id?: string | null
          release_role: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          ai_model_id?: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          organization_id?: string
          provenance_claim_id?: string | null
          release_role?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_model_released_by_organization_ai_model_id_fkey"
            columns: ["ai_model_id"]
            isOneToOne: false
            referencedRelation: "ai_model"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_model_released_by_organization_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_model_version: {
        Row: {
          ai_model_id: string
          context_window_tokens: number | null
          created_at: string
          created_by_receipt_id: string
          deprecation_state: string | null
          id: string
          knowledge_cutoff_on: string | null
          max_output_tokens: number | null
          released_on: string | null
          version_label: string
        }
        Insert: {
          ai_model_id: string
          context_window_tokens?: number | null
          created_at?: string
          created_by_receipt_id: string
          deprecation_state?: string | null
          id?: string
          knowledge_cutoff_on?: string | null
          max_output_tokens?: number | null
          released_on?: string | null
          version_label: string
        }
        Update: {
          ai_model_id?: string
          context_window_tokens?: number | null
          created_at?: string
          created_by_receipt_id?: string
          deprecation_state?: string | null
          id?: string
          knowledge_cutoff_on?: string | null
          max_output_tokens?: number | null
          released_on?: string | null
          version_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_model_version_ai_model_id_fkey"
            columns: ["ai_model_id"]
            isOneToOne: false
            referencedRelation: "ai_model"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_protocol: {
        Row: {
          created_at: string
          created_by_receipt_id: string
          governing_organization_id: string | null
          id: string
          lifecycle_state: string
          merged_into_id: string | null
          name: string
          purpose: string | null
          slug: string
          spec_repository_id: string | null
          status: string | null
          tenant_id: string
          updated_at: string
          updated_by_receipt_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_receipt_id: string
          governing_organization_id?: string | null
          id?: string
          lifecycle_state: string
          merged_into_id?: string | null
          name: string
          purpose?: string | null
          slug: string
          spec_repository_id?: string | null
          status?: string | null
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_receipt_id?: string
          governing_organization_id?: string | null
          id?: string
          lifecycle_state?: string
          merged_into_id?: string | null
          name?: string
          purpose?: string | null
          slug?: string
          spec_repository_id?: string | null
          status?: string | null
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_protocol_governing_organization_id_fkey"
            columns: ["governing_organization_id"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_protocol_merged_into_id_fkey"
            columns: ["merged_into_id"]
            isOneToOne: false
            referencedRelation: "ai_protocol"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_protocol_spec_repository_id_fkey"
            columns: ["spec_repository_id"]
            isOneToOne: false
            referencedRelation: "repository"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_protocol_version: {
        Row: {
          ai_protocol_id: string
          breaking_changes: boolean
          created_at: string
          created_by_receipt_id: string
          id: string
          released_on: string | null
          spec_url: string | null
          summary: string | null
          version_label: string
        }
        Insert: {
          ai_protocol_id: string
          breaking_changes?: boolean
          created_at?: string
          created_by_receipt_id: string
          id?: string
          released_on?: string | null
          spec_url?: string | null
          summary?: string | null
          version_label: string
        }
        Update: {
          ai_protocol_id?: string
          breaking_changes?: boolean
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          released_on?: string | null
          spec_url?: string | null
          summary?: string | null
          version_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_protocol_version_ai_protocol_id_fkey"
            columns: ["ai_protocol_id"]
            isOneToOne: false
            referencedRelation: "ai_protocol"
            referencedColumns: ["id"]
          },
        ]
      }
      benchmark: {
        Row: {
          created_at: string
          created_by_receipt_id: string
          homepage_url: string | null
          id: string
          lifecycle_state: string
          measures: string | null
          merged_into_id: string | null
          name: string
          retired: boolean
          slug: string
          task_domain: string | null
          tenant_id: string
          updated_at: string
          updated_by_receipt_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_receipt_id: string
          homepage_url?: string | null
          id?: string
          lifecycle_state: string
          measures?: string | null
          merged_into_id?: string | null
          name: string
          retired?: boolean
          slug: string
          task_domain?: string | null
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_receipt_id?: string
          homepage_url?: string | null
          id?: string
          lifecycle_state?: string
          measures?: string | null
          merged_into_id?: string | null
          name?: string
          retired?: boolean
          slug?: string
          task_domain?: string | null
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "benchmark_merged_into_id_fkey"
            columns: ["merged_into_id"]
            isOneToOne: false
            referencedRelation: "benchmark"
            referencedColumns: ["id"]
          },
        ]
      }
      concept: {
        Row: {
          concept_kind: string | null
          created_at: string
          created_by_receipt_id: string
          definition: string | null
          id: string
          lifecycle_state: string
          merged_into_id: string | null
          preferred_label: string
          slug: string
          tenant_id: string
          updated_at: string
          updated_by_receipt_id: string | null
        }
        Insert: {
          concept_kind?: string | null
          created_at?: string
          created_by_receipt_id: string
          definition?: string | null
          id?: string
          lifecycle_state: string
          merged_into_id?: string | null
          preferred_label: string
          slug: string
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Update: {
          concept_kind?: string | null
          created_at?: string
          created_by_receipt_id?: string
          definition?: string | null
          id?: string
          lifecycle_state?: string
          merged_into_id?: string | null
          preferred_label?: string
          slug?: string
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "concept_merged_into_id_fkey"
            columns: ["merged_into_id"]
            isOneToOne: false
            referencedRelation: "concept"
            referencedColumns: ["id"]
          },
        ]
      }
      concept_alias: {
        Row: {
          alias: string
          alias_kind: string
          concept_id: string
          created_at: string
          created_by_receipt_id: string
          id: string
        }
        Insert: {
          alias: string
          alias_kind?: string
          concept_id: string
          created_at?: string
          created_by_receipt_id: string
          id?: string
        }
        Update: {
          alias?: string
          alias_kind?: string
          concept_id?: string
          created_at?: string
          created_by_receipt_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "concept_alias_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concept"
            referencedColumns: ["id"]
          },
        ]
      }
      dataset: {
        Row: {
          created_at: string
          created_by_receipt_id: string
          external_id: string
          host: string
          id: string
          license_spdx: string | null
          lifecycle_state: string
          merged_into_id: string | null
          modality: string[] | null
          name: string
          size_descriptor: string | null
          tenant_id: string
          updated_at: string
          updated_by_receipt_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_receipt_id: string
          external_id: string
          host: string
          id?: string
          license_spdx?: string | null
          lifecycle_state: string
          merged_into_id?: string | null
          modality?: string[] | null
          name: string
          size_descriptor?: string | null
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_receipt_id?: string
          external_id?: string
          host?: string
          id?: string
          license_spdx?: string | null
          lifecycle_state?: string
          merged_into_id?: string | null
          modality?: string[] | null
          name?: string
          size_descriptor?: string | null
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dataset_merged_into_id_fkey"
            columns: ["merged_into_id"]
            isOneToOne: false
            referencedRelation: "dataset"
            referencedColumns: ["id"]
          },
        ]
      }
      distribution_kind: {
        Row: {
          code: string
          description: string
        }
        Insert: {
          code: string
          description: string
        }
        Update: {
          code?: string
          description?: string
        }
        Relationships: []
      }
      entity_merge: {
        Row: {
          created_at: string
          created_by_receipt_id: string
          entity_kind: string
          id: string
          loser_id: string
          merge_reason: string
          winner_id: string
        }
        Insert: {
          created_at?: string
          created_by_receipt_id: string
          entity_kind: string
          id?: string
          loser_id: string
          merge_reason: string
          winner_id: string
        }
        Update: {
          created_at?: string
          created_by_receipt_id?: string
          entity_kind?: string
          id?: string
          loser_id?: string
          merge_reason?: string
          winner_id?: string
        }
        Relationships: []
      }
      library: {
        Row: {
          created_at: string
          created_by_receipt_id: string
          description: string | null
          display_name: string | null
          ecosystem: string
          first_released_on: string | null
          homepage_url: string | null
          id: string
          lifecycle_state: string
          merged_into_id: string | null
          package_name: string
          primary_language: string | null
          tenant_id: string
          updated_at: string
          updated_by_receipt_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_receipt_id: string
          description?: string | null
          display_name?: string | null
          ecosystem: string
          first_released_on?: string | null
          homepage_url?: string | null
          id?: string
          lifecycle_state: string
          merged_into_id?: string | null
          package_name: string
          primary_language?: string | null
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_receipt_id?: string
          description?: string | null
          display_name?: string | null
          ecosystem?: string
          first_released_on?: string | null
          homepage_url?: string | null
          id?: string
          lifecycle_state?: string
          merged_into_id?: string | null
          package_name?: string
          primary_language?: string | null
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "library_ecosystem_fkey"
            columns: ["ecosystem"]
            isOneToOne: false
            referencedRelation: "distribution_kind"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "library_merged_into_id_fkey"
            columns: ["merged_into_id"]
            isOneToOne: false
            referencedRelation: "library"
            referencedColumns: ["id"]
          },
        ]
      }
      library_appeared_in_video: {
        Row: {
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          library_id: string
          lifecycle_state: string
          locator_id: string | null
          prominence: string | null
          provenance_claim_id: string | null
          valid_from: string
          valid_to: string | null
          video_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          library_id: string
          lifecycle_state: string
          locator_id?: string | null
          prominence?: string | null
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
          video_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          library_id?: string
          lifecycle_state?: string
          locator_id?: string | null
          prominence?: string | null
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_appeared_in_video_library_id_fkey"
            columns: ["library_id"]
            isOneToOne: false
            referencedRelation: "library"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_appeared_in_video_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "video"
            referencedColumns: ["id"]
          },
        ]
      }
      library_backed_by_repository: {
        Row: {
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          library_id: string
          lifecycle_state: string
          path_in_repo: string | null
          provenance_claim_id: string | null
          relationship_kind: string
          repository_id: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          library_id: string
          lifecycle_state: string
          path_in_repo?: string | null
          provenance_claim_id?: string | null
          relationship_kind?: string
          repository_id: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          library_id?: string
          lifecycle_state?: string
          path_in_repo?: string | null
          provenance_claim_id?: string | null
          relationship_kind?: string
          repository_id?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "library_backed_by_repository_library_id_fkey"
            columns: ["library_id"]
            isOneToOne: false
            referencedRelation: "library"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_backed_by_repository_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repository"
            referencedColumns: ["id"]
          },
        ]
      }
      library_depends_on_library: {
        Row: {
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          dependency_kind: string
          depends_on_id: string
          id: string
          library_id: string
          lifecycle_state: string
          provenance_claim_id: string | null
          valid_from: string
          valid_to: string | null
          version_range: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          dependency_kind: string
          depends_on_id: string
          id?: string
          library_id: string
          lifecycle_state: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
          version_range?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          dependency_kind?: string
          depends_on_id?: string
          id?: string
          library_id?: string
          lifecycle_state?: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
          version_range?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "library_depends_on_library_depends_on_id_fkey"
            columns: ["depends_on_id"]
            isOneToOne: false
            referencedRelation: "library"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_depends_on_library_library_id_fkey"
            columns: ["library_id"]
            isOneToOne: false
            referencedRelation: "library"
            referencedColumns: ["id"]
          },
        ]
      }
      library_implements_protocol_version: {
        Row: {
          ai_protocol_version_id: string
          confidence: number | null
          conformance: string
          created_at: string
          created_by_receipt_id: string
          id: string
          library_id: string
          lifecycle_state: string
          provenance_claim_id: string | null
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          ai_protocol_version_id: string
          confidence?: number | null
          conformance: string
          created_at?: string
          created_by_receipt_id: string
          id?: string
          library_id: string
          lifecycle_state: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          ai_protocol_version_id?: string
          confidence?: number | null
          conformance?: string
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          library_id?: string
          lifecycle_state?: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "library_implements_protocol_version_ai_protocol_version_id_fkey"
            columns: ["ai_protocol_version_id"]
            isOneToOne: false
            referencedRelation: "ai_protocol_version"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_implements_protocol_version_library_id_fkey"
            columns: ["library_id"]
            isOneToOne: false
            referencedRelation: "library"
            referencedColumns: ["id"]
          },
        ]
      }
      library_license_fact: {
        Row: {
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          library_id: string
          license_spdx: string
          lifecycle_state: string
          provenance_claim_id: string | null
          valid_from: string
          valid_to: string | null
          validity: unknown
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          library_id: string
          license_spdx: string
          lifecycle_state: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
          validity?: unknown
        }
        Update: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          library_id?: string
          license_spdx?: string
          lifecycle_state?: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
          validity?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "library_license_fact_library_id_fkey"
            columns: ["library_id"]
            isOneToOne: false
            referencedRelation: "library"
            referencedColumns: ["id"]
          },
        ]
      }
      library_maintained_by_person: {
        Row: {
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          library_id: string
          lifecycle_state: string
          person_id: string
          provenance_claim_id: string | null
          role: string
          source: string | null
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          library_id: string
          lifecycle_state: string
          person_id: string
          provenance_claim_id?: string | null
          role?: string
          source?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          library_id?: string
          lifecycle_state?: string
          person_id?: string
          provenance_claim_id?: string | null
          role?: string
          source?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "library_maintained_by_person_library_id_fkey"
            columns: ["library_id"]
            isOneToOne: false
            referencedRelation: "library"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_maintained_by_person_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "person"
            referencedColumns: ["id"]
          },
        ]
      }
      library_maintenance_status_fact: {
        Row: {
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          library_id: string
          lifecycle_state: string
          provenance_claim_id: string | null
          status: string
          valid_from: string
          valid_to: string | null
          validity: unknown
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          library_id: string
          lifecycle_state: string
          provenance_claim_id?: string | null
          status: string
          valid_from?: string
          valid_to?: string | null
          validity?: unknown
        }
        Update: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          library_id?: string
          lifecycle_state?: string
          provenance_claim_id?: string | null
          status?: string
          valid_from?: string
          valid_to?: string | null
          validity?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "library_maintenance_status_fact_library_id_fkey"
            columns: ["library_id"]
            isOneToOne: false
            referencedRelation: "library"
            referencedColumns: ["id"]
          },
        ]
      }
      library_supports_model_version: {
        Row: {
          ai_model_version_id: string
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          integration_kind: string
          library_id: string
          lifecycle_state: string
          provenance_claim_id: string | null
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          ai_model_version_id: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          integration_kind: string
          library_id: string
          lifecycle_state: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          ai_model_version_id?: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          integration_kind?: string
          library_id?: string
          lifecycle_state?: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "library_supports_model_version_ai_model_version_id_fkey"
            columns: ["ai_model_version_id"]
            isOneToOne: false
            referencedRelation: "ai_model_version"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "library_supports_model_version_library_id_fkey"
            columns: ["library_id"]
            isOneToOne: false
            referencedRelation: "library"
            referencedColumns: ["id"]
          },
        ]
      }
      mcp_server: {
        Row: {
          created_at: string
          created_by_receipt_id: string
          description: string | null
          distribution_kind: string
          ecosystem: string | null
          id: string
          license_spdx: string | null
          lifecycle_state: string
          maintainer_organization_id: string | null
          merged_into_id: string | null
          name: string
          package_name: string | null
          registry_id: string | null
          repository_id: string | null
          tenant_id: string
          transport_kinds: string[]
          updated_at: string
          updated_by_receipt_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_receipt_id: string
          description?: string | null
          distribution_kind: string
          ecosystem?: string | null
          id?: string
          license_spdx?: string | null
          lifecycle_state: string
          maintainer_organization_id?: string | null
          merged_into_id?: string | null
          name: string
          package_name?: string | null
          registry_id?: string | null
          repository_id?: string | null
          tenant_id?: string
          transport_kinds?: string[]
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_receipt_id?: string
          description?: string | null
          distribution_kind?: string
          ecosystem?: string | null
          id?: string
          license_spdx?: string | null
          lifecycle_state?: string
          maintainer_organization_id?: string | null
          merged_into_id?: string | null
          name?: string
          package_name?: string | null
          registry_id?: string | null
          repository_id?: string | null
          tenant_id?: string
          transport_kinds?: string[]
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mcp_server_distribution_kind_fkey"
            columns: ["distribution_kind"]
            isOneToOne: false
            referencedRelation: "distribution_kind"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "mcp_server_ecosystem_fkey"
            columns: ["ecosystem"]
            isOneToOne: false
            referencedRelation: "distribution_kind"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "mcp_server_maintainer_organization_id_fkey"
            columns: ["maintainer_organization_id"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mcp_server_merged_into_id_fkey"
            columns: ["merged_into_id"]
            isOneToOne: false
            referencedRelation: "mcp_server"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mcp_server_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repository"
            referencedColumns: ["id"]
          },
        ]
      }
      mcp_server_backed_by_repository: {
        Row: {
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          mcp_server_id: string
          provenance_claim_id: string | null
          relationship_kind: string
          repository_id: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          mcp_server_id: string
          provenance_claim_id?: string | null
          relationship_kind?: string
          repository_id: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          mcp_server_id?: string
          provenance_claim_id?: string | null
          relationship_kind?: string
          repository_id?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mcp_server_backed_by_repository_mcp_server_id_fkey"
            columns: ["mcp_server_id"]
            isOneToOne: false
            referencedRelation: "mcp_server"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mcp_server_backed_by_repository_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repository"
            referencedColumns: ["id"]
          },
        ]
      }
      mcp_server_prompt: {
        Row: {
          arguments: Json | null
          created_at: string
          created_by_receipt_id: string
          description: string | null
          id: string
          mcp_server_version_id: string
          name: string
        }
        Insert: {
          arguments?: Json | null
          created_at?: string
          created_by_receipt_id: string
          description?: string | null
          id?: string
          mcp_server_version_id: string
          name: string
        }
        Update: {
          arguments?: Json | null
          created_at?: string
          created_by_receipt_id?: string
          description?: string | null
          id?: string
          mcp_server_version_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "mcp_server_prompt_mcp_server_version_id_fkey"
            columns: ["mcp_server_version_id"]
            isOneToOne: false
            referencedRelation: "mcp_server_version"
            referencedColumns: ["id"]
          },
        ]
      }
      mcp_server_registry_status_fact: {
        Row: {
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          mcp_server_id: string
          provenance_claim_id: string | null
          status: string
          valid_from: string
          valid_to: string | null
          validity: unknown
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          mcp_server_id: string
          provenance_claim_id?: string | null
          status: string
          valid_from?: string
          valid_to?: string | null
          validity?: unknown
        }
        Update: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          mcp_server_id?: string
          provenance_claim_id?: string | null
          status?: string
          valid_from?: string
          valid_to?: string | null
          validity?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "mcp_server_registry_status_fact_mcp_server_id_fkey"
            columns: ["mcp_server_id"]
            isOneToOne: false
            referencedRelation: "mcp_server"
            referencedColumns: ["id"]
          },
        ]
      }
      mcp_server_resource: {
        Row: {
          created_at: string
          created_by_receipt_id: string
          description: string | null
          id: string
          mcp_server_version_id: string
          name: string
          uri_template: string | null
        }
        Insert: {
          created_at?: string
          created_by_receipt_id: string
          description?: string | null
          id?: string
          mcp_server_version_id: string
          name: string
          uri_template?: string | null
        }
        Update: {
          created_at?: string
          created_by_receipt_id?: string
          description?: string | null
          id?: string
          mcp_server_version_id?: string
          name?: string
          uri_template?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mcp_server_resource_mcp_server_version_id_fkey"
            columns: ["mcp_server_version_id"]
            isOneToOne: false
            referencedRelation: "mcp_server_version"
            referencedColumns: ["id"]
          },
        ]
      }
      mcp_server_tool: {
        Row: {
          annotations: Json | null
          created_at: string
          created_by_receipt_id: string
          description: string | null
          id: string
          input_schema: Json | null
          mcp_server_version_id: string
          output_schema: Json | null
          tool_name: string
        }
        Insert: {
          annotations?: Json | null
          created_at?: string
          created_by_receipt_id: string
          description?: string | null
          id?: string
          input_schema?: Json | null
          mcp_server_version_id: string
          output_schema?: Json | null
          tool_name: string
        }
        Update: {
          annotations?: Json | null
          created_at?: string
          created_by_receipt_id?: string
          description?: string | null
          id?: string
          input_schema?: Json | null
          mcp_server_version_id?: string
          output_schema?: Json | null
          tool_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "mcp_server_tool_mcp_server_version_id_fkey"
            columns: ["mcp_server_version_id"]
            isOneToOne: false
            referencedRelation: "mcp_server_version"
            referencedColumns: ["id"]
          },
        ]
      }
      mcp_server_version: {
        Row: {
          auth_model: string | null
          created_at: string
          created_by_receipt_id: string
          id: string
          mcp_server_id: string
          packaging_hash: string | null
          protocol_version_id: string | null
          released_on: string | null
          version_label: string
        }
        Insert: {
          auth_model?: string | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          mcp_server_id: string
          packaging_hash?: string | null
          protocol_version_id?: string | null
          released_on?: string | null
          version_label: string
        }
        Update: {
          auth_model?: string | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          mcp_server_id?: string
          packaging_hash?: string | null
          protocol_version_id?: string | null
          released_on?: string | null
          version_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "mcp_server_version_mcp_server_id_fkey"
            columns: ["mcp_server_id"]
            isOneToOne: false
            referencedRelation: "mcp_server"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mcp_server_version_protocol_version_id_fkey"
            columns: ["protocol_version_id"]
            isOneToOne: false
            referencedRelation: "ai_protocol_version"
            referencedColumns: ["id"]
          },
        ]
      }
      mcp_server_wraps_product: {
        Row: {
          confidence: number | null
          coverage: string | null
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          mcp_server_id: string
          product_id: string
          provenance_claim_id: string | null
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          confidence?: number | null
          coverage?: string | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          mcp_server_id: string
          product_id: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          confidence?: number | null
          coverage?: string | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          mcp_server_id?: string
          product_id?: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mcp_server_wraps_product_mcp_server_id_fkey"
            columns: ["mcp_server_id"]
            isOneToOne: false
            referencedRelation: "mcp_server"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mcp_server_wraps_product_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      organization: {
        Row: {
          created_at: string
          created_by_receipt_id: string
          description: string | null
          display_name: string
          founded_on: string | null
          id: string
          legal_name: string | null
          lifecycle_state: string
          merged_into_id: string | null
          org_kind: string | null
          slug: string
          tenant_id: string
          updated_at: string
          updated_by_receipt_id: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string
          created_by_receipt_id: string
          description?: string | null
          display_name: string
          founded_on?: string | null
          id?: string
          legal_name?: string | null
          lifecycle_state: string
          merged_into_id?: string | null
          org_kind?: string | null
          slug: string
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string
          created_by_receipt_id?: string
          description?: string | null
          display_name?: string
          founded_on?: string | null
          id?: string
          legal_name?: string | null
          lifecycle_state?: string
          merged_into_id?: string | null
          org_kind?: string | null
          slug?: string
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_merged_into_id_fkey"
            columns: ["merged_into_id"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_identifier: {
        Row: {
          created_at: string
          created_by_receipt_id: string
          id: string
          organization_id: string
          scheme: string
          value: string
        }
        Insert: {
          created_at?: string
          created_by_receipt_id: string
          id?: string
          organization_id: string
          scheme: string
          value: string
        }
        Update: {
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          organization_id?: string
          scheme?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_identifier_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id"]
          },
        ]
      }
      paper: {
        Row: {
          abstract: string | null
          arxiv_id: string | null
          created_at: string
          created_by_receipt_id: string
          doi: string | null
          id: string
          lifecycle_state: string
          merged_into_id: string | null
          openreview_id: string | null
          paper_kind: string | null
          published_on: string | null
          tenant_id: string
          title: string
          updated_at: string
          updated_by_receipt_id: string | null
          venue: string | null
        }
        Insert: {
          abstract?: string | null
          arxiv_id?: string | null
          created_at?: string
          created_by_receipt_id: string
          doi?: string | null
          id?: string
          lifecycle_state: string
          merged_into_id?: string | null
          openreview_id?: string | null
          paper_kind?: string | null
          published_on?: string | null
          tenant_id?: string
          title: string
          updated_at?: string
          updated_by_receipt_id?: string | null
          venue?: string | null
        }
        Update: {
          abstract?: string | null
          arxiv_id?: string | null
          created_at?: string
          created_by_receipt_id?: string
          doi?: string | null
          id?: string
          lifecycle_state?: string
          merged_into_id?: string | null
          openreview_id?: string | null
          paper_kind?: string | null
          published_on?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paper_merged_into_id_fkey"
            columns: ["merged_into_id"]
            isOneToOne: false
            referencedRelation: "paper"
            referencedColumns: ["id"]
          },
        ]
      }
      paper_appeared_in_talk: {
        Row: {
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          paper_id: string
          provenance_claim_id: string | null
          talk_id: string
          treatment: string | null
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          paper_id: string
          provenance_claim_id?: string | null
          talk_id: string
          treatment?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          paper_id?: string
          provenance_claim_id?: string | null
          talk_id?: string
          treatment?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paper_appeared_in_talk_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "paper"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paper_appeared_in_talk_talk_id_fkey"
            columns: ["talk_id"]
            isOneToOne: false
            referencedRelation: "talk"
            referencedColumns: ["id"]
          },
        ]
      }
      paper_appeared_in_video: {
        Row: {
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          locator_id: string | null
          paper_id: string
          provenance_claim_id: string | null
          treatment: string | null
          valid_from: string
          valid_to: string | null
          video_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          locator_id?: string | null
          paper_id: string
          provenance_claim_id?: string | null
          treatment?: string | null
          valid_from?: string
          valid_to?: string | null
          video_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          locator_id?: string | null
          paper_id?: string
          provenance_claim_id?: string | null
          treatment?: string | null
          valid_from?: string
          valid_to?: string | null
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "paper_appeared_in_video_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "paper"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paper_appeared_in_video_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "video"
            referencedColumns: ["id"]
          },
        ]
      }
      paper_authored_by_person: {
        Row: {
          affiliation_organization_id: string | null
          author_position: number | null
          confidence: number | null
          corresponding: boolean
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          paper_id: string
          person_id: string
          provenance_claim_id: string | null
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          affiliation_organization_id?: string | null
          author_position?: number | null
          confidence?: number | null
          corresponding?: boolean
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          paper_id: string
          person_id: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          affiliation_organization_id?: string | null
          author_position?: number | null
          confidence?: number | null
          corresponding?: boolean
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          paper_id?: string
          person_id?: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paper_authored_by_person_affiliation_organization_id_fkey"
            columns: ["affiliation_organization_id"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paper_authored_by_person_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "paper"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paper_authored_by_person_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "person"
            referencedColumns: ["id"]
          },
        ]
      }
      paper_retraction_fact: {
        Row: {
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          notice_url: string | null
          paper_id: string
          provenance_claim_id: string | null
          state: string
          valid_from: string
          valid_to: string | null
          validity: unknown
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          notice_url?: string | null
          paper_id: string
          provenance_claim_id?: string | null
          state: string
          valid_from?: string
          valid_to?: string | null
          validity?: unknown
        }
        Update: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          notice_url?: string | null
          paper_id?: string
          provenance_claim_id?: string | null
          state?: string
          valid_from?: string
          valid_to?: string | null
          validity?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "paper_retraction_fact_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "paper"
            referencedColumns: ["id"]
          },
        ]
      }
      person: {
        Row: {
          created_at: string
          created_by_receipt_id: string
          display_name: string
          family_name: string | null
          given_name: string | null
          headline: string | null
          id: string
          lifecycle_state: string
          merged_into_id: string | null
          primary_organization_id: string | null
          primary_role: string | null
          slug: string
          tenant_id: string
          updated_at: string
          updated_by_receipt_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_receipt_id: string
          display_name: string
          family_name?: string | null
          given_name?: string | null
          headline?: string | null
          id?: string
          lifecycle_state: string
          merged_into_id?: string | null
          primary_organization_id?: string | null
          primary_role?: string | null
          slug: string
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_receipt_id?: string
          display_name?: string
          family_name?: string | null
          given_name?: string | null
          headline?: string | null
          id?: string
          lifecycle_state?: string
          merged_into_id?: string | null
          primary_organization_id?: string | null
          primary_role?: string | null
          slug?: string
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "person_merged_into_id_fkey"
            columns: ["merged_into_id"]
            isOneToOne: false
            referencedRelation: "person"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "person_primary_organization_id_fkey"
            columns: ["primary_organization_id"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id"]
          },
        ]
      }
      person_appeared_in_video: {
        Row: {
          appearance_role: string | null
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          locator_id: string | null
          person_id: string
          provenance_claim_id: string | null
          valid_from: string
          valid_to: string | null
          video_id: string
        }
        Insert: {
          appearance_role?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          locator_id?: string | null
          person_id: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
          video_id: string
        }
        Update: {
          appearance_role?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          locator_id?: string | null
          person_id?: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "person_appeared_in_video_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "person"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "person_appeared_in_video_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "video"
            referencedColumns: ["id"]
          },
        ]
      }
      person_created_agent_skill: {
        Row: {
          agent_skill_id: string
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          person_id: string
          provenance_claim_id: string | null
          role: string
          since: string | null
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          agent_skill_id: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          person_id: string
          provenance_claim_id?: string | null
          role?: string
          since?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          agent_skill_id?: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          person_id?: string
          provenance_claim_id?: string | null
          role?: string
          since?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "person_created_agent_skill_agent_skill_id_fkey"
            columns: ["agent_skill_id"]
            isOneToOne: false
            referencedRelation: "agent_skill"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "person_created_agent_skill_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "person"
            referencedColumns: ["id"]
          },
        ]
      }
      person_created_mcp_server: {
        Row: {
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          mcp_server_id: string
          person_id: string
          provenance_claim_id: string | null
          role: string
          since: string | null
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          mcp_server_id: string
          person_id: string
          provenance_claim_id?: string | null
          role?: string
          since?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          mcp_server_id?: string
          person_id?: string
          provenance_claim_id?: string | null
          role?: string
          since?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "person_created_mcp_server_mcp_server_id_fkey"
            columns: ["mcp_server_id"]
            isOneToOne: false
            referencedRelation: "mcp_server"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "person_created_mcp_server_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "person"
            referencedColumns: ["id"]
          },
        ]
      }
      person_employed_by_organization: {
        Row: {
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          employment_kind: string | null
          id: string
          lifecycle_state: string
          organization_id: string
          person_id: string
          provenance_claim_id: string | null
          seniority: string | null
          title: string | null
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          employment_kind?: string | null
          id?: string
          lifecycle_state: string
          organization_id: string
          person_id: string
          provenance_claim_id?: string | null
          seniority?: string | null
          title?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          employment_kind?: string | null
          id?: string
          lifecycle_state?: string
          organization_id?: string
          person_id?: string
          provenance_claim_id?: string | null
          seniority?: string | null
          title?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "person_employed_by_organization_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "person_employed_by_organization_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "person"
            referencedColumns: ["id"]
          },
        ]
      }
      person_founded_organization: {
        Row: {
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          founded_on: string | null
          founder_role: string | null
          id: string
          lifecycle_state: string
          organization_id: string
          person_id: string
          provenance_claim_id: string | null
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          founded_on?: string | null
          founder_role?: string | null
          id?: string
          lifecycle_state: string
          organization_id: string
          person_id: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          founded_on?: string | null
          founder_role?: string | null
          id?: string
          lifecycle_state?: string
          organization_id?: string
          person_id?: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "person_founded_organization_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "person_founded_organization_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "person"
            referencedColumns: ["id"]
          },
        ]
      }
      person_identifier: {
        Row: {
          created_at: string
          created_by_receipt_id: string
          id: string
          person_id: string
          scheme: string
          value: string
        }
        Insert: {
          created_at?: string
          created_by_receipt_id: string
          id?: string
          person_id: string
          scheme: string
          value: string
        }
        Update: {
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          person_id?: string
          scheme?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "person_identifier_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "person"
            referencedColumns: ["id"]
          },
        ]
      }
      person_presented_at_talk: {
        Row: {
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          person_id: string
          provenance_claim_id: string | null
          speaker_position: number | null
          speaker_role: string
          talk_id: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          person_id: string
          provenance_claim_id?: string | null
          speaker_position?: number | null
          speaker_role?: string
          talk_id: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          person_id?: string
          provenance_claim_id?: string | null
          speaker_position?: number | null
          speaker_role?: string
          talk_id?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "person_presented_at_talk_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "person"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "person_presented_at_talk_talk_id_fkey"
            columns: ["talk_id"]
            isOneToOne: false
            referencedRelation: "talk"
            referencedColumns: ["id"]
          },
        ]
      }
      product: {
        Row: {
          created_at: string
          created_by_receipt_id: string
          description: string | null
          display_name: string
          homepage_url: string | null
          id: string
          launched_on: string | null
          lifecycle_state: string
          merged_into_id: string | null
          product_kind: string | null
          slug: string
          tenant_id: string
          updated_at: string
          updated_by_receipt_id: string | null
          vendor_organization_id: string | null
        }
        Insert: {
          created_at?: string
          created_by_receipt_id: string
          description?: string | null
          display_name: string
          homepage_url?: string | null
          id?: string
          launched_on?: string | null
          lifecycle_state: string
          merged_into_id?: string | null
          product_kind?: string | null
          slug: string
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
          vendor_organization_id?: string | null
        }
        Update: {
          created_at?: string
          created_by_receipt_id?: string
          description?: string | null
          display_name?: string
          homepage_url?: string | null
          id?: string
          launched_on?: string | null
          lifecycle_state?: string
          merged_into_id?: string | null
          product_kind?: string | null
          slug?: string
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
          vendor_organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_merged_into_id_fkey"
            columns: ["merged_into_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_vendor_organization_id_fkey"
            columns: ["vendor_organization_id"]
            isOneToOne: false
            referencedRelation: "organization"
            referencedColumns: ["id"]
          },
        ]
      }
      product_appeared_in_video: {
        Row: {
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          locator_id: string | null
          product_id: string
          prominence: string | null
          provenance_claim_id: string | null
          valid_from: string
          valid_to: string | null
          video_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          locator_id?: string | null
          product_id: string
          prominence?: string | null
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
          video_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          locator_id?: string | null
          product_id?: string
          prominence?: string | null
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_appeared_in_video_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_appeared_in_video_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "video"
            referencedColumns: ["id"]
          },
        ]
      }
      product_built_on_model_version: {
        Row: {
          ai_model_version_id: string
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          product_id: string
          provenance_claim_id: string | null
          usage_kind: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          ai_model_version_id: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          product_id: string
          provenance_claim_id?: string | null
          usage_kind: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          ai_model_version_id?: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          product_id?: string
          provenance_claim_id?: string | null
          usage_kind?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_built_on_model_version_ai_model_version_id_fkey"
            columns: ["ai_model_version_id"]
            isOneToOne: false
            referencedRelation: "ai_model_version"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_built_on_model_version_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      product_implements_protocol_version: {
        Row: {
          ai_protocol_version_id: string
          client_or_server: string | null
          confidence: number | null
          conformance: string
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          product_id: string
          provenance_claim_id: string | null
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          ai_protocol_version_id: string
          client_or_server?: string | null
          confidence?: number | null
          conformance: string
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          product_id: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          ai_protocol_version_id?: string
          client_or_server?: string | null
          confidence?: number | null
          conformance?: string
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          product_id?: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_implements_protocol_version_ai_protocol_version_id_fkey"
            columns: ["ai_protocol_version_id"]
            isOneToOne: false
            referencedRelation: "ai_protocol_version"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_implements_protocol_version_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      repository: {
        Row: {
          created_at: string
          created_at_host: string | null
          created_by_receipt_id: string
          default_branch: string | null
          description: string | null
          host: string
          id: string
          is_fork: boolean
          lifecycle_state: string
          merged_into_id: string | null
          name: string
          owner: string
          primary_language: string | null
          tenant_id: string
          updated_at: string
          updated_by_receipt_id: string | null
        }
        Insert: {
          created_at?: string
          created_at_host?: string | null
          created_by_receipt_id: string
          default_branch?: string | null
          description?: string | null
          host: string
          id?: string
          is_fork?: boolean
          lifecycle_state: string
          merged_into_id?: string | null
          name: string
          owner: string
          primary_language?: string | null
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Update: {
          created_at?: string
          created_at_host?: string | null
          created_by_receipt_id?: string
          default_branch?: string | null
          description?: string | null
          host?: string
          id?: string
          is_fork?: boolean
          lifecycle_state?: string
          merged_into_id?: string | null
          name?: string
          owner?: string
          primary_language?: string | null
          tenant_id?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repository_merged_into_id_fkey"
            columns: ["merged_into_id"]
            isOneToOne: false
            referencedRelation: "repository"
            referencedColumns: ["id"]
          },
        ]
      }
      repository_alias: {
        Row: {
          created_by_receipt_id: string
          host: string
          id: string
          name: string
          observed_at: string
          owner: string
          repository_id: string
        }
        Insert: {
          created_by_receipt_id: string
          host: string
          id?: string
          name: string
          observed_at?: string
          owner: string
          repository_id: string
        }
        Update: {
          created_by_receipt_id?: string
          host?: string
          id?: string
          name?: string
          observed_at?: string
          owner?: string
          repository_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "repository_alias_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repository"
            referencedColumns: ["id"]
          },
        ]
      }
      repository_archival_fact: {
        Row: {
          archived: boolean
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          provenance_claim_id: string | null
          repository_id: string
          valid_from: string
          valid_to: string | null
          validity: unknown
        }
        Insert: {
          archived: boolean
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          provenance_claim_id?: string | null
          repository_id: string
          valid_from?: string
          valid_to?: string | null
          validity?: unknown
        }
        Update: {
          archived?: boolean
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          provenance_claim_id?: string | null
          repository_id?: string
          valid_from?: string
          valid_to?: string | null
          validity?: unknown
        }
        Relationships: [
          {
            foreignKeyName: "repository_archival_fact_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repository"
            referencedColumns: ["id"]
          },
        ]
      }
      repository_implements_paper: {
        Row: {
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          fidelity: string
          id: string
          lifecycle_state: string
          notes: string | null
          paper_id: string
          provenance_claim_id: string | null
          repository_id: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          fidelity: string
          id?: string
          lifecycle_state: string
          notes?: string | null
          paper_id: string
          provenance_claim_id?: string | null
          repository_id: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          fidelity?: string
          id?: string
          lifecycle_state?: string
          notes?: string | null
          paper_id?: string
          provenance_claim_id?: string | null
          repository_id?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repository_implements_paper_paper_id_fkey"
            columns: ["paper_id"]
            isOneToOne: false
            referencedRelation: "paper"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repository_implements_paper_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repository"
            referencedColumns: ["id"]
          },
        ]
      }
      talk: {
        Row: {
          abstract: string | null
          created_at: string
          created_by_receipt_id: string
          delivered_on: string | null
          event_edition: string | null
          event_name: string | null
          event_slug: string | null
          id: string
          lifecycle_state: string
          merged_into_id: string | null
          recording_video_id: string | null
          tenant_id: string
          title: string
          updated_at: string
          updated_by_receipt_id: string | null
        }
        Insert: {
          abstract?: string | null
          created_at?: string
          created_by_receipt_id: string
          delivered_on?: string | null
          event_edition?: string | null
          event_name?: string | null
          event_slug?: string | null
          id?: string
          lifecycle_state: string
          merged_into_id?: string | null
          recording_video_id?: string | null
          tenant_id?: string
          title: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Update: {
          abstract?: string | null
          created_at?: string
          created_by_receipt_id?: string
          delivered_on?: string | null
          event_edition?: string | null
          event_name?: string | null
          event_slug?: string | null
          id?: string
          lifecycle_state?: string
          merged_into_id?: string | null
          recording_video_id?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "talk_merged_into_id_fkey"
            columns: ["merged_into_id"]
            isOneToOne: false
            referencedRelation: "talk"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talk_recording_video_id_fkey"
            columns: ["recording_video_id"]
            isOneToOne: false
            referencedRelation: "video"
            referencedColumns: ["id"]
          },
        ]
      }
      talk_explains_concept: {
        Row: {
          concept_id: string
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          depth: string
          id: string
          lifecycle_state: string
          provenance_claim_id: string | null
          talk_id: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          concept_id: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          depth?: string
          id?: string
          lifecycle_state: string
          provenance_claim_id?: string | null
          talk_id: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          concept_id?: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          depth?: string
          id?: string
          lifecycle_state?: string
          provenance_claim_id?: string | null
          talk_id?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "talk_explains_concept_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "concept"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talk_explains_concept_talk_id_fkey"
            columns: ["talk_id"]
            isOneToOne: false
            referencedRelation: "talk"
            referencedColumns: ["id"]
          },
        ]
      }
      video: {
        Row: {
          channel: string | null
          channel_external_id: string | null
          created_at: string
          created_by_receipt_id: string
          duration_seconds: number | null
          external_id: string
          id: string
          lifecycle_state: string
          merged_into_id: string | null
          platform: string
          published_at: string | null
          tenant_id: string
          title: string
          transcript_artifact_id: string | null
          updated_at: string
          updated_by_receipt_id: string | null
          url: string | null
        }
        Insert: {
          channel?: string | null
          channel_external_id?: string | null
          created_at?: string
          created_by_receipt_id: string
          duration_seconds?: number | null
          external_id: string
          id?: string
          lifecycle_state: string
          merged_into_id?: string | null
          platform: string
          published_at?: string | null
          tenant_id?: string
          title: string
          transcript_artifact_id?: string | null
          updated_at?: string
          updated_by_receipt_id?: string | null
          url?: string | null
        }
        Update: {
          channel?: string | null
          channel_external_id?: string | null
          created_at?: string
          created_by_receipt_id?: string
          duration_seconds?: number | null
          external_id?: string
          id?: string
          lifecycle_state?: string
          merged_into_id?: string | null
          platform?: string
          published_at?: string | null
          tenant_id?: string
          title?: string
          transcript_artifact_id?: string | null
          updated_at?: string
          updated_by_receipt_id?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_merged_into_id_fkey"
            columns: ["merged_into_id"]
            isOneToOne: false
            referencedRelation: "video"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  curriculum: {
    Tables: {
      challenge: {
        Row: {
          created_at: string
          id: string
          module_id: string | null
          slug: string
          tenant_id: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          module_id?: string | null
          slug: string
          tenant_id?: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          module_id?: string | null
          slug?: string
          tenant_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "module"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_derived_from: {
        Row: {
          challenge_version_id: string
          failure_mode_id: string | null
          id: string
          implementation_example_id: string | null
          record_kind: string | null
          technical_problem_id: string | null
        }
        Insert: {
          challenge_version_id: string
          failure_mode_id?: string | null
          id?: string
          implementation_example_id?: string | null
          record_kind?: string | null
          technical_problem_id?: string | null
        }
        Update: {
          challenge_version_id?: string
          failure_mode_id?: string | null
          id?: string
          implementation_example_id?: string | null
          record_kind?: string | null
          technical_problem_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_derived_from_challenge_version_id_fkey"
            columns: ["challenge_version_id"]
            isOneToOne: false
            referencedRelation: "challenge_version"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_targets: {
        Row: {
          agent_skill_id: string | null
          challenge_version_id: string
          concept_id: string | null
          id: string
          library_id: string | null
          mcp_server_id: string | null
          solution_pattern_id: string | null
          target_kind: string | null
        }
        Insert: {
          agent_skill_id?: string | null
          challenge_version_id: string
          concept_id?: string | null
          id?: string
          library_id?: string | null
          mcp_server_id?: string | null
          solution_pattern_id?: string | null
          target_kind?: string | null
        }
        Update: {
          agent_skill_id?: string | null
          challenge_version_id?: string
          concept_id?: string | null
          id?: string
          library_id?: string | null
          mcp_server_id?: string | null
          solution_pattern_id?: string | null
          target_kind?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_targets_challenge_version_id_fkey"
            columns: ["challenge_version_id"]
            isOneToOne: false
            referencedRelation: "challenge_version"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_version: {
        Row: {
          challenge_id: string
          created_at: string
          difficulty: string | null
          environment_spec_artifact_id: string | null
          id: string
          rubric: Json
          statement: string
          status: Database["curriculum"]["Enums"]["publish_status"]
          version: number
        }
        Insert: {
          challenge_id: string
          created_at?: string
          difficulty?: string | null
          environment_spec_artifact_id?: string | null
          id?: string
          rubric?: Json
          statement: string
          status?: Database["curriculum"]["Enums"]["publish_status"]
          version: number
        }
        Update: {
          challenge_id?: string
          created_at?: string
          difficulty?: string | null
          environment_spec_artifact_id?: string | null
          id?: string
          rubric?: Json
          statement?: string
          status?: Database["curriculum"]["Enums"]["publish_status"]
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "challenge_version_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenge"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum: {
        Row: {
          audience: string | null
          created_at: string
          id: string
          slug: string
          status: Database["curriculum"]["Enums"]["publish_status"]
          tenant_id: string
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          audience?: string | null
          created_at?: string
          id?: string
          slug: string
          status?: Database["curriculum"]["Enums"]["publish_status"]
          tenant_id?: string
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          audience?: string | null
          created_at?: string
          id?: string
          slug?: string
          status?: Database["curriculum"]["Enums"]["publish_status"]
          tenant_id?: string
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      learning_objective: {
        Row: {
          bloom_level: string | null
          created_at: string
          id: string
          lesson_version_id: string
          ordering: number
          statement: string
        }
        Insert: {
          bloom_level?: string | null
          created_at?: string
          id?: string
          lesson_version_id: string
          ordering?: number
          statement: string
        }
        Update: {
          bloom_level?: string | null
          created_at?: string
          id?: string
          lesson_version_id?: string
          ordering?: number
          statement?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_objective_lesson_version_id_fkey"
            columns: ["lesson_version_id"]
            isOneToOne: false
            referencedRelation: "lesson_version"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson: {
        Row: {
          created_at: string
          id: string
          module_id: string
          ordering: number
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          module_id: string
          ordering?: number
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          module_id?: string
          ordering?: number
          slug?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "module"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_backed_by: {
        Row: {
          advanced_usage_pattern_id: string | null
          assertion_ref: string | null
          benchmark_result_id: string | null
          compatibility_constraint_id: string | null
          created_at: string
          failure_mode_id: string | null
          id: string
          implementation_example_id: string | null
          lesson_version_id: string
          operational_practice_id: string | null
          record_kind: string | null
          security_consideration_id: string | null
          solution_pattern_id: string | null
          technical_problem_id: string | null
        }
        Insert: {
          advanced_usage_pattern_id?: string | null
          assertion_ref?: string | null
          benchmark_result_id?: string | null
          compatibility_constraint_id?: string | null
          created_at?: string
          failure_mode_id?: string | null
          id?: string
          implementation_example_id?: string | null
          lesson_version_id: string
          operational_practice_id?: string | null
          record_kind?: string | null
          security_consideration_id?: string | null
          solution_pattern_id?: string | null
          technical_problem_id?: string | null
        }
        Update: {
          advanced_usage_pattern_id?: string | null
          assertion_ref?: string | null
          benchmark_result_id?: string | null
          compatibility_constraint_id?: string | null
          created_at?: string
          failure_mode_id?: string | null
          id?: string
          implementation_example_id?: string | null
          lesson_version_id?: string
          operational_practice_id?: string | null
          record_kind?: string | null
          security_consideration_id?: string | null
          solution_pattern_id?: string | null
          technical_problem_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_backed_by_lesson_version_id_fkey"
            columns: ["lesson_version_id"]
            isOneToOne: false
            referencedRelation: "lesson_version"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_covers_concept: {
        Row: {
          concept_id: string
          depth: string
          id: string
          lesson_version_id: string
        }
        Insert: {
          concept_id: string
          depth?: string
          id?: string
          lesson_version_id: string
        }
        Update: {
          concept_id?: string
          depth?: string
          id?: string
          lesson_version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_covers_concept_lesson_version_id_fkey"
            columns: ["lesson_version_id"]
            isOneToOne: false
            referencedRelation: "lesson_version"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_prerequisite: {
        Row: {
          lesson_id: string
          requires_lesson_id: string
        }
        Insert: {
          lesson_id: string
          requires_lesson_id: string
        }
        Update: {
          lesson_id?: string
          requires_lesson_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_prerequisite_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lesson"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_prerequisite_requires_lesson_id_fkey"
            columns: ["requires_lesson_id"]
            isOneToOne: false
            referencedRelation: "lesson"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_version: {
        Row: {
          content_artifact_id: string | null
          created_at: string
          id: string
          lesson_id: string
          published_at: string | null
          status: Database["curriculum"]["Enums"]["publish_status"]
          version: number
        }
        Insert: {
          content_artifact_id?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          published_at?: string | null
          status?: Database["curriculum"]["Enums"]["publish_status"]
          version: number
        }
        Update: {
          content_artifact_id?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          published_at?: string | null
          status?: Database["curriculum"]["Enums"]["publish_status"]
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_version_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lesson"
            referencedColumns: ["id"]
          },
        ]
      }
      module: {
        Row: {
          created_at: string
          id: string
          learning_level_term_id: string | null
          ordering: number
          slug: string
          title: string
          track_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          learning_level_term_id?: string | null
          ordering?: number
          slug: string
          title: string
          track_id: string
        }
        Update: {
          created_at?: string
          id?: string
          learning_level_term_id?: string | null
          ordering?: number
          slug?: string
          title?: string
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "track"
            referencedColumns: ["id"]
          },
        ]
      }
      track: {
        Row: {
          created_at: string
          curriculum_id: string
          id: string
          ordering: number
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          curriculum_id: string
          id?: string
          ordering?: number
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          curriculum_id?: string
          id?: string
          ordering?: number
          slug?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "track_curriculum_id_fkey"
            columns: ["curriculum_id"]
            isOneToOne: false
            referencedRelation: "curriculum"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      publish_status: "draft" | "in_review" | "published" | "retired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  evaluation: {
    Tables: {
      eval_case: {
        Row: {
          created_at: string
          dataset_id: string
          expected: Json | null
          external_key: string | null
          id: string
          input: Json
          metadata: Json
        }
        Insert: {
          created_at?: string
          dataset_id: string
          expected?: Json | null
          external_key?: string | null
          id?: string
          input: Json
          metadata?: Json
        }
        Update: {
          created_at?: string
          dataset_id?: string
          expected?: Json | null
          external_key?: string | null
          id?: string
          input?: Json
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "eval_case_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "eval_dataset"
            referencedColumns: ["id"]
          },
        ]
      }
      eval_dataset: {
        Row: {
          created_at: string
          description: string | null
          id: string
          purpose: string
          slug: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          purpose: string
          slug: string
          tenant_id?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          purpose?: string
          slug?: string
          tenant_id?: string
        }
        Relationships: []
      }
      eval_label: {
        Row: {
          case_id: string
          created_at: string
          id: string
          label: Json
          labeled_by: string
          review_decision_id: string | null
        }
        Insert: {
          case_id: string
          created_at?: string
          id?: string
          label: Json
          labeled_by: string
          review_decision_id?: string | null
        }
        Update: {
          case_id?: string
          created_at?: string
          id?: string
          label?: Json
          labeled_by?: string
          review_decision_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eval_label_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "eval_case"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eval_label_review_decision_fk"
            columns: ["review_decision_id"]
            isOneToOne: false
            referencedRelation: "review_decision"
            referencedColumns: ["id"]
          },
        ]
      }
      eval_run: {
        Row: {
          capability_version_id: string | null
          code_ref: string | null
          config: Json
          dataset_id: string
          executed_at: string
          grader_version_id: string | null
          id: string
          metric_definition_version_id: string | null
          ranking_policy_version_id: string | null
          space_version_id: string | null
          target_code_ref: string | null
          target_kind: string | null
          tenant_id: string
        }
        Insert: {
          capability_version_id?: string | null
          code_ref?: string | null
          config?: Json
          dataset_id: string
          executed_at?: string
          grader_version_id?: string | null
          id?: string
          metric_definition_version_id?: string | null
          ranking_policy_version_id?: string | null
          space_version_id?: string | null
          target_code_ref?: string | null
          target_kind?: string | null
          tenant_id?: string
        }
        Update: {
          capability_version_id?: string | null
          code_ref?: string | null
          config?: Json
          dataset_id?: string
          executed_at?: string
          grader_version_id?: string | null
          id?: string
          metric_definition_version_id?: string | null
          ranking_policy_version_id?: string | null
          space_version_id?: string | null
          target_code_ref?: string | null
          target_kind?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "eval_run_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "eval_dataset"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eval_run_grader_version_id_fkey"
            columns: ["grader_version_id"]
            isOneToOne: false
            referencedRelation: "grader_version"
            referencedColumns: ["id"]
          },
        ]
      }
      eval_score: {
        Row: {
          case_id: string
          created_at: string
          false_acceptance: boolean
          false_rejection: boolean
          id: string
          metrics: Json
          passed: boolean | null
          run_id: string
        }
        Insert: {
          case_id: string
          created_at?: string
          false_acceptance?: boolean
          false_rejection?: boolean
          id?: string
          metrics?: Json
          passed?: boolean | null
          run_id: string
        }
        Update: {
          case_id?: string
          created_at?: string
          false_acceptance?: boolean
          false_rejection?: boolean
          id?: string
          metrics?: Json
          passed?: boolean | null
          run_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "eval_score_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "eval_case"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eval_score_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "eval_run"
            referencedColumns: ["id"]
          },
        ]
      }
      gate: {
        Row: {
          created_at: string
          id: string
          purpose: string
          slug: string
          thresholds: Json
        }
        Insert: {
          created_at?: string
          id?: string
          purpose: string
          slug: string
          thresholds?: Json
        }
        Update: {
          created_at?: string
          id?: string
          purpose?: string
          slug?: string
          thresholds?: Json
        }
        Relationships: []
      }
      gate_binding: {
        Row: {
          created_at: string
          gate_id: string
          guards_kind: string
          guards_ref: string | null
          id: string
        }
        Insert: {
          created_at?: string
          gate_id: string
          guards_kind: string
          guards_ref?: string | null
          id?: string
        }
        Update: {
          created_at?: string
          gate_id?: string
          guards_kind?: string
          guards_ref?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gate_binding_gate_id_fkey"
            columns: ["gate_id"]
            isOneToOne: false
            referencedRelation: "gate"
            referencedColumns: ["id"]
          },
        ]
      }
      gate_result: {
        Row: {
          action: Database["evaluation"]["Enums"]["gate_action"]
          created_at: string
          detail: Json
          eval_run_id: string | null
          gate_id: string
          id: string
          passed: boolean
          spawned_work_item_id: string | null
        }
        Insert: {
          action: Database["evaluation"]["Enums"]["gate_action"]
          created_at?: string
          detail?: Json
          eval_run_id?: string | null
          gate_id: string
          id?: string
          passed: boolean
          spawned_work_item_id?: string | null
        }
        Update: {
          action?: Database["evaluation"]["Enums"]["gate_action"]
          created_at?: string
          detail?: Json
          eval_run_id?: string | null
          gate_id?: string
          id?: string
          passed?: boolean
          spawned_work_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gate_result_eval_run_id_fkey"
            columns: ["eval_run_id"]
            isOneToOne: false
            referencedRelation: "eval_run"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gate_result_gate_id_fkey"
            columns: ["gate_id"]
            isOneToOne: false
            referencedRelation: "gate"
            referencedColumns: ["id"]
          },
        ]
      }
      grader: {
        Row: {
          created_at: string
          id: string
          kind: string
          purpose: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          purpose: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          purpose?: string
          slug?: string
        }
        Relationships: []
      }
      grader_version: {
        Row: {
          code_ref: string | null
          config: Json
          created_at: string
          grader_id: string
          id: string
          model: string | null
          prompt: string | null
          version: number
        }
        Insert: {
          code_ref?: string | null
          config?: Json
          created_at?: string
          grader_id: string
          id?: string
          model?: string | null
          prompt?: string | null
          version: number
        }
        Update: {
          code_ref?: string | null
          config?: Json
          created_at?: string
          grader_id?: string
          id?: string
          model?: string | null
          prompt?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "grader_version_grader_id_fkey"
            columns: ["grader_id"]
            isOneToOne: false
            referencedRelation: "grader"
            referencedColumns: ["id"]
          },
        ]
      }
      regression: {
        Row: {
          baseline_run_id: string
          baseline_value: number | null
          current_run_id: string
          current_value: number | null
          delta: number | null
          detected_at: string
          gate_id: string | null
          id: string
          metric: string
        }
        Insert: {
          baseline_run_id: string
          baseline_value?: number | null
          current_run_id: string
          current_value?: number | null
          delta?: number | null
          detected_at?: string
          gate_id?: string | null
          id?: string
          metric: string
        }
        Update: {
          baseline_run_id?: string
          baseline_value?: number | null
          current_run_id?: string
          current_value?: number | null
          delta?: number | null
          detected_at?: string
          gate_id?: string | null
          id?: string
          metric?: string
        }
        Relationships: [
          {
            foreignKeyName: "regression_baseline_run_id_fkey"
            columns: ["baseline_run_id"]
            isOneToOne: false
            referencedRelation: "eval_run"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regression_current_run_id_fkey"
            columns: ["current_run_id"]
            isOneToOne: false
            referencedRelation: "eval_run"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "regression_gate_id_fkey"
            columns: ["gate_id"]
            isOneToOne: false
            referencedRelation: "gate"
            referencedColumns: ["id"]
          },
        ]
      }
      review_decision: {
        Row: {
          decided_at: string
          decided_by: string
          decision: string
          eval_label_id: string | null
          id: string
          rationale: string
          review_task_id: string
        }
        Insert: {
          decided_at?: string
          decided_by: string
          decision: string
          eval_label_id?: string | null
          id?: string
          rationale: string
          review_task_id: string
        }
        Update: {
          decided_at?: string
          decided_by?: string
          decision?: string
          eval_label_id?: string | null
          id?: string
          rationale?: string
          review_task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_decision_eval_label_id_fkey"
            columns: ["eval_label_id"]
            isOneToOne: false
            referencedRelation: "eval_label"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_decision_review_task_id_fkey"
            columns: ["review_task_id"]
            isOneToOne: false
            referencedRelation: "review_task"
            referencedColumns: ["id"]
          },
        ]
      }
      review_task: {
        Row: {
          assignee: string | null
          candidate_id: string | null
          capability_version_id: string | null
          claim_conflict_id: string | null
          claim_id: string | null
          created_at: string
          detail: Json
          entity_merge_id: string | null
          id: string
          operation_intent_id: string | null
          priority: number
          quorum_required: number
          ranking_result_id: string | null
          record_reconciliation_id: string | null
          report_version_id: string | null
          state: Database["evaluation"]["Enums"]["review_state"]
          subject_kind: string | null
          summary: string
          task_kind: string
          tenant_id: string
          updated_at: string
          vector_space_version_id: string | null
        }
        Insert: {
          assignee?: string | null
          candidate_id?: string | null
          capability_version_id?: string | null
          claim_conflict_id?: string | null
          claim_id?: string | null
          created_at?: string
          detail?: Json
          entity_merge_id?: string | null
          id?: string
          operation_intent_id?: string | null
          priority?: number
          quorum_required?: number
          ranking_result_id?: string | null
          record_reconciliation_id?: string | null
          report_version_id?: string | null
          state?: Database["evaluation"]["Enums"]["review_state"]
          subject_kind?: string | null
          summary: string
          task_kind: string
          tenant_id?: string
          updated_at?: string
          vector_space_version_id?: string | null
        }
        Update: {
          assignee?: string | null
          candidate_id?: string | null
          capability_version_id?: string | null
          claim_conflict_id?: string | null
          claim_id?: string | null
          created_at?: string
          detail?: Json
          entity_merge_id?: string | null
          id?: string
          operation_intent_id?: string | null
          priority?: number
          quorum_required?: number
          ranking_result_id?: string | null
          record_reconciliation_id?: string | null
          report_version_id?: string | null
          state?: Database["evaluation"]["Enums"]["review_state"]
          subject_kind?: string | null
          summary?: string
          task_kind?: string
          tenant_id?: string
          updated_at?: string
          vector_space_version_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      gate_action:
        | "block"
        | "quarantine"
        | "repair"
        | "rerun"
        | "review"
        | "escalate"
        | "optimize"
        | "allow"
      review_state:
        | "open"
        | "claimed"
        | "in_review"
        | "decided"
        | "escalated"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  evidence: {
    Tables: {
      claim: {
        Row: {
          atomized_from_id: string | null
          claim_type: string
          composite: boolean
          created_at: string
          created_by_receipt_id: string | null
          id: string
          producer_attempt_id: string | null
          statement: string
          status: Database["evidence"]["Enums"]["claim_status"]
          structured: Json | null
          superseded_by_id: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          atomized_from_id?: string | null
          claim_type: string
          composite?: boolean
          created_at?: string
          created_by_receipt_id?: string | null
          id?: string
          producer_attempt_id?: string | null
          statement: string
          status?: Database["evidence"]["Enums"]["claim_status"]
          structured?: Json | null
          superseded_by_id?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Update: {
          atomized_from_id?: string | null
          claim_type?: string
          composite?: boolean
          created_at?: string
          created_by_receipt_id?: string | null
          id?: string
          producer_attempt_id?: string | null
          statement?: string
          status?: Database["evidence"]["Enums"]["claim_status"]
          structured?: Json | null
          superseded_by_id?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_atomized_from_id_fkey"
            columns: ["atomized_from_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_claim_type_fkey"
            columns: ["claim_type"]
            isOneToOne: false
            referencedRelation: "claim_type"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "claim_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_agent_skill_version: {
        Row: {
          agent_skill_version_id: string
          claim_id: string
          created_at: string
          role_in_claim: string
        }
        Insert: {
          agent_skill_version_id: string
          claim_id: string
          created_at?: string
          role_in_claim?: string
        }
        Update: {
          agent_skill_version_id?: string
          claim_id?: string
          created_at?: string
          role_in_claim?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_agent_skill_version_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_ai_model_version: {
        Row: {
          ai_model_version_id: string
          claim_id: string
          created_at: string
          role_in_claim: string
        }
        Insert: {
          ai_model_version_id: string
          claim_id: string
          created_at?: string
          role_in_claim?: string
        }
        Update: {
          ai_model_version_id?: string
          claim_id?: string
          created_at?: string
          role_in_claim?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_ai_model_version_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_benchmark: {
        Row: {
          benchmark_id: string
          claim_id: string
          created_at: string
          role_in_claim: string
        }
        Insert: {
          benchmark_id: string
          claim_id: string
          created_at?: string
          role_in_claim?: string
        }
        Update: {
          benchmark_id?: string
          claim_id?: string
          created_at?: string
          role_in_claim?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_benchmark_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_concept: {
        Row: {
          claim_id: string
          concept_id: string
          created_at: string
          role_in_claim: string
        }
        Insert: {
          claim_id: string
          concept_id: string
          created_at?: string
          role_in_claim?: string
        }
        Update: {
          claim_id?: string
          concept_id?: string
          created_at?: string
          role_in_claim?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_concept_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_conflict: {
        Row: {
          claim_a_id: string
          claim_b_id: string
          conflict_kind: string
          detected_at: string
          detected_by: string
          id: string
        }
        Insert: {
          claim_a_id: string
          claim_b_id: string
          conflict_kind: string
          detected_at?: string
          detected_by: string
          id?: string
        }
        Update: {
          claim_a_id?: string
          claim_b_id?: string
          conflict_kind?: string
          detected_at?: string
          detected_by?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_conflict_claim_a_id_fkey"
            columns: ["claim_a_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_conflict_claim_b_id_fkey"
            columns: ["claim_b_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_dataset: {
        Row: {
          claim_id: string
          created_at: string
          dataset_id: string
          role_in_claim: string
        }
        Insert: {
          claim_id: string
          created_at?: string
          dataset_id: string
          role_in_claim?: string
        }
        Update: {
          claim_id?: string
          created_at?: string
          dataset_id?: string
          role_in_claim?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_dataset_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_evidence_link: {
        Row: {
          authority_assessment: Json | null
          claim_id: string
          created_at: string
          id: string
          locator_id: string
          role: string
          support_verdict:
            | Database["evidence"]["Enums"]["support_verdict"]
            | null
          verified_by_run_id: string | null
        }
        Insert: {
          authority_assessment?: Json | null
          claim_id: string
          created_at?: string
          id?: string
          locator_id: string
          role: string
          support_verdict?:
            | Database["evidence"]["Enums"]["support_verdict"]
            | null
          verified_by_run_id?: string | null
        }
        Update: {
          authority_assessment?: Json | null
          claim_id?: string
          created_at?: string
          id?: string
          locator_id?: string
          role?: string
          support_verdict?:
            | Database["evidence"]["Enums"]["support_verdict"]
            | null
          verified_by_run_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claim_evidence_link_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_evidence_link_locator_id_fkey"
            columns: ["locator_id"]
            isOneToOne: false
            referencedRelation: "locator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_evidence_link_verified_by_run_id_fkey"
            columns: ["verified_by_run_id"]
            isOneToOne: false
            referencedRelation: "verification_run"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_library: {
        Row: {
          claim_id: string
          created_at: string
          library_id: string
          role_in_claim: string
        }
        Insert: {
          claim_id: string
          created_at?: string
          library_id: string
          role_in_claim?: string
        }
        Update: {
          claim_id?: string
          created_at?: string
          library_id?: string
          role_in_claim?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_library_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_mcp_server_version: {
        Row: {
          claim_id: string
          created_at: string
          mcp_server_version_id: string
          role_in_claim: string
        }
        Insert: {
          claim_id: string
          created_at?: string
          mcp_server_version_id: string
          role_in_claim?: string
        }
        Update: {
          claim_id?: string
          created_at?: string
          mcp_server_version_id?: string
          role_in_claim?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_mcp_server_version_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_organization: {
        Row: {
          claim_id: string
          created_at: string
          organization_id: string
          role_in_claim: string
        }
        Insert: {
          claim_id: string
          created_at?: string
          organization_id: string
          role_in_claim?: string
        }
        Update: {
          claim_id?: string
          created_at?: string
          organization_id?: string
          role_in_claim?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_organization_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_paper: {
        Row: {
          claim_id: string
          created_at: string
          paper_id: string
          role_in_claim: string
        }
        Insert: {
          claim_id: string
          created_at?: string
          paper_id: string
          role_in_claim?: string
        }
        Update: {
          claim_id?: string
          created_at?: string
          paper_id?: string
          role_in_claim?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_paper_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_person: {
        Row: {
          claim_id: string
          created_at: string
          person_id: string
          role_in_claim: string
        }
        Insert: {
          claim_id: string
          created_at?: string
          person_id: string
          role_in_claim?: string
        }
        Update: {
          claim_id?: string
          created_at?: string
          person_id?: string
          role_in_claim?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_person_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_product: {
        Row: {
          claim_id: string
          created_at: string
          product_id: string
          role_in_claim: string
        }
        Insert: {
          claim_id: string
          created_at?: string
          product_id: string
          role_in_claim?: string
        }
        Update: {
          claim_id?: string
          created_at?: string
          product_id?: string
          role_in_claim?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_product_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_protocol_version: {
        Row: {
          ai_protocol_version_id: string
          claim_id: string
          created_at: string
          role_in_claim: string
        }
        Insert: {
          ai_protocol_version_id: string
          claim_id: string
          created_at?: string
          role_in_claim?: string
        }
        Update: {
          ai_protocol_version_id?: string
          claim_id?: string
          created_at?: string
          role_in_claim?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_protocol_version_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_repository: {
        Row: {
          claim_id: string
          created_at: string
          repository_id: string
          role_in_claim: string
        }
        Insert: {
          claim_id: string
          created_at?: string
          repository_id: string
          role_in_claim?: string
        }
        Update: {
          claim_id?: string
          created_at?: string
          repository_id?: string
          role_in_claim?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_repository_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_talk: {
        Row: {
          claim_id: string
          created_at: string
          role_in_claim: string
          talk_id: string
        }
        Insert: {
          claim_id: string
          created_at?: string
          role_in_claim?: string
          talk_id: string
        }
        Update: {
          claim_id?: string
          created_at?: string
          role_in_claim?: string
          talk_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_talk_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_technical_record: {
        Row: {
          advanced_usage_pattern_id: string | null
          benchmark_result_id: string | null
          claim_id: string
          compatibility_constraint_id: string | null
          created_at: string
          failure_mode_id: string | null
          id: string
          implementation_example_id: string | null
          operational_practice_id: string | null
          record_kind: string | null
          role_in_claim: string
          security_consideration_id: string | null
          solution_pattern_id: string | null
          technical_problem_id: string | null
        }
        Insert: {
          advanced_usage_pattern_id?: string | null
          benchmark_result_id?: string | null
          claim_id: string
          compatibility_constraint_id?: string | null
          created_at?: string
          failure_mode_id?: string | null
          id?: string
          implementation_example_id?: string | null
          operational_practice_id?: string | null
          record_kind?: string | null
          role_in_claim?: string
          security_consideration_id?: string | null
          solution_pattern_id?: string | null
          technical_problem_id?: string | null
        }
        Update: {
          advanced_usage_pattern_id?: string | null
          benchmark_result_id?: string | null
          claim_id?: string
          compatibility_constraint_id?: string | null
          created_at?: string
          failure_mode_id?: string | null
          id?: string
          implementation_example_id?: string | null
          operational_practice_id?: string | null
          record_kind?: string | null
          role_in_claim?: string
          security_consideration_id?: string | null
          solution_pattern_id?: string | null
          technical_problem_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claim_technical_record_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_type: {
        Row: {
          code: string
          created_at: string
          description: string
        }
        Insert: {
          code: string
          created_at?: string
          description: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
        }
        Relationships: []
      }
      claim_video: {
        Row: {
          claim_id: string
          created_at: string
          role_in_claim: string
          video_id: string
        }
        Insert: {
          claim_id: string
          created_at?: string
          role_in_claim?: string
          video_id: string
        }
        Update: {
          claim_id?: string
          created_at?: string
          role_in_claim?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "claim_video_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
        ]
      }
      conflict_reconciliation: {
        Row: {
          conflict_id: string
          decided_at: string
          id: string
          outcome: string
          rationale: string
          review_task_id: string | null
        }
        Insert: {
          conflict_id: string
          decided_at?: string
          id?: string
          outcome: string
          rationale: string
          review_task_id?: string | null
        }
        Update: {
          conflict_id?: string
          decided_at?: string
          id?: string
          outcome?: string
          rationale?: string
          review_task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conflict_reconciliation_conflict_id_fkey"
            columns: ["conflict_id"]
            isOneToOne: false
            referencedRelation: "claim_conflict"
            referencedColumns: ["id"]
          },
        ]
      }
      degraded_assurance: {
        Row: {
          approved_at: string | null
          approved_by_review_task_id: string | null
          attempted_methods: Json
          created_at: string
          id: string
          reason: string
          source_id: string
          what_was_seen: string
        }
        Insert: {
          approved_at?: string | null
          approved_by_review_task_id?: string | null
          attempted_methods?: Json
          created_at?: string
          id?: string
          reason: string
          source_id: string
          what_was_seen: string
        }
        Update: {
          approved_at?: string | null
          approved_by_review_task_id?: string | null
          attempted_methods?: Json
          created_at?: string
          id?: string
          reason?: string
          source_id?: string
          what_was_seen?: string
        }
        Relationships: [
          {
            foreignKeyName: "degraded_assurance_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "source"
            referencedColumns: ["id"]
          },
        ]
      }
      executable_verification: {
        Row: {
          assurance_level: string
          commands: Json
          commit_sha: string | null
          executed_at: string
          exit_codes: Json
          id: string
          image_digest: string | null
          lockfile_hashes: Json
          log_artifact_id: string | null
          repository_url: string | null
          trace_id: string | null
        }
        Insert: {
          assurance_level: string
          commands?: Json
          commit_sha?: string | null
          executed_at?: string
          exit_codes?: Json
          id?: string
          image_digest?: string | null
          lockfile_hashes?: Json
          log_artifact_id?: string | null
          repository_url?: string | null
          trace_id?: string | null
        }
        Update: {
          assurance_level?: string
          commands?: Json
          commit_sha?: string | null
          executed_at?: string
          exit_codes?: Json
          id?: string
          image_digest?: string | null
          lockfile_hashes?: Json
          log_artifact_id?: string | null
          repository_url?: string | null
          trace_id?: string | null
        }
        Relationships: []
      }
      extraction_signature: {
        Row: {
          created_at: string
          id: string
          locator_id: string
          produced_by_attempt_id: string | null
          signature_sha256: string
        }
        Insert: {
          created_at?: string
          id?: string
          locator_id: string
          produced_by_attempt_id?: string | null
          signature_sha256: string
        }
        Update: {
          created_at?: string
          id?: string
          locator_id?: string
          produced_by_attempt_id?: string | null
          signature_sha256?: string
        }
        Relationships: [
          {
            foreignKeyName: "extraction_signature_locator_id_fkey"
            columns: ["locator_id"]
            isOneToOne: false
            referencedRelation: "locator"
            referencedColumns: ["id"]
          },
        ]
      }
      locator: {
        Row: {
          capture_id: string
          context_fingerprint: string | null
          created_at: string
          extraction_params: Json
          extractor_name: string
          extractor_version: string
          id: string
          media_type: string
          normalized_value: string | null
          selected_content_sha256: string | null
          selector: Json
        }
        Insert: {
          capture_id: string
          context_fingerprint?: string | null
          created_at?: string
          extraction_params?: Json
          extractor_name: string
          extractor_version: string
          id?: string
          media_type: string
          normalized_value?: string | null
          selected_content_sha256?: string | null
          selector: Json
        }
        Update: {
          capture_id?: string
          context_fingerprint?: string | null
          created_at?: string
          extraction_params?: Json
          extractor_name?: string
          extractor_version?: string
          id?: string
          media_type?: string
          normalized_value?: string | null
          selected_content_sha256?: string | null
          selector?: Json
        }
        Relationships: [
          {
            foreignKeyName: "locator_capture_id_fkey"
            columns: ["capture_id"]
            isOneToOne: false
            referencedRelation: "source_capture"
            referencedColumns: ["id"]
          },
        ]
      }
      revalidation_event: {
        Row: {
          affected_refs: Json
          fired_at: string
          id: string
          policy_id: string | null
          trigger_kind: string
          work_item_id: string | null
        }
        Insert: {
          affected_refs?: Json
          fired_at?: string
          id?: string
          policy_id?: string | null
          trigger_kind: string
          work_item_id?: string | null
        }
        Update: {
          affected_refs?: Json
          fired_at?: string
          id?: string
          policy_id?: string | null
          trigger_kind?: string
          work_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revalidation_event_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "revalidation_policy"
            referencedColumns: ["id"]
          },
        ]
      }
      revalidation_policy: {
        Row: {
          applies_to: string
          created_at: string
          id: string
          max_age: string | null
          rules: Json
          slug: string
        }
        Insert: {
          applies_to: string
          created_at?: string
          id?: string
          max_age?: string | null
          rules?: Json
          slug: string
        }
        Update: {
          applies_to?: string
          created_at?: string
          id?: string
          max_age?: string | null
          rules?: Json
          slug?: string
        }
        Relationships: []
      }
      source: {
        Row: {
          canonical_url: string | null
          created_at: string
          id: string
          license_notes: string | null
          license_spdx: string | null
          publisher: string | null
          robots_policy: string | null
          sensitivity: string
          source_class: string
          tenant_id: string
          terms_url: string | null
          updated_at: string
          url_pattern: string | null
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          license_notes?: string | null
          license_spdx?: string | null
          publisher?: string | null
          robots_policy?: string | null
          sensitivity?: string
          source_class: string
          tenant_id?: string
          terms_url?: string | null
          updated_at?: string
          url_pattern?: string | null
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          id?: string
          license_notes?: string | null
          license_spdx?: string | null
          publisher?: string | null
          robots_policy?: string | null
          sensitivity?: string
          source_class?: string
          tenant_id?: string
          terms_url?: string | null
          updated_at?: string
          url_pattern?: string | null
        }
        Relationships: []
      }
      source_capture: {
        Row: {
          artifact_id: string
          capture_method: string
          capture_method_version: string
          captured_at: string
          content_sha256: string
          context: Json
          http_headers: Json | null
          http_status: number | null
          id: string
          media_type: string
          produced_by_attempt_id: string | null
          request_url: string | null
          source_id: string
          tenant_id: string
        }
        Insert: {
          artifact_id: string
          capture_method: string
          capture_method_version: string
          captured_at?: string
          content_sha256: string
          context?: Json
          http_headers?: Json | null
          http_status?: number | null
          id?: string
          media_type: string
          produced_by_attempt_id?: string | null
          request_url?: string | null
          source_id: string
          tenant_id?: string
        }
        Update: {
          artifact_id?: string
          capture_method?: string
          capture_method_version?: string
          captured_at?: string
          content_sha256?: string
          context?: Json
          http_headers?: Json | null
          http_status?: number | null
          id?: string
          media_type?: string
          produced_by_attempt_id?: string | null
          request_url?: string | null
          source_id?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_capture_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "source"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_finding: {
        Row: {
          claim_id: string
          created_at: string
          deterministic: boolean
          id: string
          rationale: string | null
          replay_signature_match: boolean | null
          run_id: string
          verdict: Database["evidence"]["Enums"]["support_verdict"]
        }
        Insert: {
          claim_id: string
          created_at?: string
          deterministic?: boolean
          id?: string
          rationale?: string | null
          replay_signature_match?: boolean | null
          run_id: string
          verdict: Database["evidence"]["Enums"]["support_verdict"]
        }
        Update: {
          claim_id?: string
          created_at?: string
          deterministic?: boolean
          id?: string
          rationale?: string | null
          replay_signature_match?: boolean | null
          run_id?: string
          verdict?: Database["evidence"]["Enums"]["support_verdict"]
        }
        Relationships: [
          {
            foreignKeyName: "verification_finding_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claim"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_finding_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "verification_run"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_run: {
        Row: {
          ended_at: string | null
          id: string
          policy_version: string
          started_at: string
          verifier_attempt_id: string
          work_item_id: string | null
        }
        Insert: {
          ended_at?: string | null
          id?: string
          policy_version: string
          started_at?: string
          verifier_attempt_id: string
          work_item_id?: string | null
        }
        Update: {
          ended_at?: string | null
          id?: string
          policy_version?: string
          started_at?: string
          verifier_attempt_id?: string
          work_item_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      claim_status:
        | "proposed"
        | "verified"
        | "disputed"
        | "retracted"
        | "superseded"
      support_verdict:
        | "directly_supported"
        | "supported_with_qualification"
        | "partially_supported"
        | "context_only"
        | "contradicted"
        | "not_supported"
        | "unverifiable"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  knowledge: {
    Tables: {
      advanced_usage_pattern: {
        Row: {
          anti_pattern: boolean
          api_surface: string | null
          assurance_level: string
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          library_id: string | null
          maturity: Database["knowledge"]["Enums"]["maturity"] | null
          minimal_example_artifact_id: string | null
          next_revalidation_at: string | null
          provenance_claim_id: string | null
          record_schema_version: number
          revalidation_policy_id: string | null
          revalidation_state: Database["knowledge"]["Enums"]["revalidation_state"]
          scope: Json
          statement: string
          structured: Json | null
          superseded_by_id: string | null
          tenant_id: string
          title: string
          updated_at: string
          updated_by_receipt_id: string | null
        }
        Insert: {
          anti_pattern?: boolean
          api_surface?: string | null
          assurance_level?: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          library_id?: string | null
          maturity?: Database["knowledge"]["Enums"]["maturity"] | null
          minimal_example_artifact_id?: string | null
          next_revalidation_at?: string | null
          provenance_claim_id?: string | null
          record_schema_version?: number
          revalidation_policy_id?: string | null
          revalidation_state?: Database["knowledge"]["Enums"]["revalidation_state"]
          scope?: Json
          statement: string
          structured?: Json | null
          superseded_by_id?: string | null
          tenant_id?: string
          title: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Update: {
          anti_pattern?: boolean
          api_surface?: string | null
          assurance_level?: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          library_id?: string | null
          maturity?: Database["knowledge"]["Enums"]["maturity"] | null
          minimal_example_artifact_id?: string | null
          next_revalidation_at?: string | null
          provenance_claim_id?: string | null
          record_schema_version?: number
          revalidation_policy_id?: string | null
          revalidation_state?: Database["knowledge"]["Enums"]["revalidation_state"]
          scope?: Json
          statement?: string
          structured?: Json | null
          superseded_by_id?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advanced_usage_pattern_assurance_level_fkey"
            columns: ["assurance_level"]
            isOneToOne: false
            referencedRelation: "assurance_level"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "advanced_usage_pattern_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "advanced_usage_pattern"
            referencedColumns: ["id"]
          },
        ]
      }
      assurance_level: {
        Row: {
          code: string
          description: string
          rank: number
        }
        Insert: {
          code: string
          description: string
          rank: number
        }
        Update: {
          code?: string
          description?: string
          rank?: number
        }
        Relationships: []
      }
      benchmark_compares_libraries: {
        Row: {
          benchmark_result_id: string
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          library_id: string
          lifecycle_state: string
          position: number | null
          provenance_claim_id: string | null
          score: number | null
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          benchmark_result_id: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          library_id: string
          lifecycle_state: string
          position?: number | null
          provenance_claim_id?: string | null
          score?: number | null
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          benchmark_result_id?: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          library_id?: string
          lifecycle_state?: string
          position?: number | null
          provenance_claim_id?: string | null
          score?: number | null
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "benchmark_compares_libraries_benchmark_result_id_fkey"
            columns: ["benchmark_result_id"]
            isOneToOne: false
            referencedRelation: "benchmark_result"
            referencedColumns: ["id"]
          },
        ]
      }
      benchmark_result: {
        Row: {
          assurance_level: string
          benchmark_id: string
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          maturity: Database["knowledge"]["Enums"]["maturity"] | null
          methodology: string | null
          next_revalidation_at: string | null
          provenance_claim_id: string | null
          record_schema_version: number
          reproduction_state: string | null
          revalidation_policy_id: string | null
          revalidation_state: Database["knowledge"]["Enums"]["revalidation_state"]
          scope: Json
          statement: string
          structured: Json | null
          superseded_by_id: string | null
          tenant_id: string
          title: string
          updated_at: string
          updated_by_receipt_id: string | null
        }
        Insert: {
          assurance_level?: string
          benchmark_id: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          maturity?: Database["knowledge"]["Enums"]["maturity"] | null
          methodology?: string | null
          next_revalidation_at?: string | null
          provenance_claim_id?: string | null
          record_schema_version?: number
          reproduction_state?: string | null
          revalidation_policy_id?: string | null
          revalidation_state?: Database["knowledge"]["Enums"]["revalidation_state"]
          scope?: Json
          statement: string
          structured?: Json | null
          superseded_by_id?: string | null
          tenant_id?: string
          title: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Update: {
          assurance_level?: string
          benchmark_id?: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          maturity?: Database["knowledge"]["Enums"]["maturity"] | null
          methodology?: string | null
          next_revalidation_at?: string | null
          provenance_claim_id?: string | null
          record_schema_version?: number
          reproduction_state?: string | null
          revalidation_policy_id?: string | null
          revalidation_state?: Database["knowledge"]["Enums"]["revalidation_state"]
          scope?: Json
          statement?: string
          structured?: Json | null
          superseded_by_id?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "benchmark_result_assurance_level_fkey"
            columns: ["assurance_level"]
            isOneToOne: false
            referencedRelation: "assurance_level"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "benchmark_result_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "benchmark_result"
            referencedColumns: ["id"]
          },
        ]
      }
      compatibility_constraint: {
        Row: {
          assurance_level: string
          confidence: number | null
          constraint_kind: string | null
          created_at: string
          created_by_receipt_id: string
          id: string
          machine_readable_rule: Json | null
          maturity: Database["knowledge"]["Enums"]["maturity"] | null
          next_revalidation_at: string | null
          provenance_claim_id: string | null
          record_schema_version: number
          revalidation_policy_id: string | null
          revalidation_state: Database["knowledge"]["Enums"]["revalidation_state"]
          scope: Json
          statement: string
          structured: Json | null
          superseded_by_id: string | null
          tenant_id: string
          title: string
          updated_at: string
          updated_by_receipt_id: string | null
        }
        Insert: {
          assurance_level?: string
          confidence?: number | null
          constraint_kind?: string | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          machine_readable_rule?: Json | null
          maturity?: Database["knowledge"]["Enums"]["maturity"] | null
          next_revalidation_at?: string | null
          provenance_claim_id?: string | null
          record_schema_version?: number
          revalidation_policy_id?: string | null
          revalidation_state?: Database["knowledge"]["Enums"]["revalidation_state"]
          scope?: Json
          statement: string
          structured?: Json | null
          superseded_by_id?: string | null
          tenant_id?: string
          title: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Update: {
          assurance_level?: string
          confidence?: number | null
          constraint_kind?: string | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          machine_readable_rule?: Json | null
          maturity?: Database["knowledge"]["Enums"]["maturity"] | null
          next_revalidation_at?: string | null
          provenance_claim_id?: string | null
          record_schema_version?: number
          revalidation_policy_id?: string | null
          revalidation_state?: Database["knowledge"]["Enums"]["revalidation_state"]
          scope?: Json
          statement?: string
          structured?: Json | null
          superseded_by_id?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compatibility_constraint_assurance_level_fkey"
            columns: ["assurance_level"]
            isOneToOne: false
            referencedRelation: "assurance_level"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "compatibility_constraint_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "compatibility_constraint"
            referencedColumns: ["id"]
          },
        ]
      }
      failure_mode: {
        Row: {
          assurance_level: string
          blast_radius: string | null
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          detection: string | null
          id: string
          maturity: Database["knowledge"]["Enums"]["maturity"] | null
          mitigation_summary: string | null
          next_revalidation_at: string | null
          provenance_claim_id: string | null
          record_schema_version: number
          revalidation_policy_id: string | null
          revalidation_state: Database["knowledge"]["Enums"]["revalidation_state"]
          scope: Json
          statement: string
          structured: Json | null
          superseded_by_id: string | null
          tenant_id: string
          title: string
          trigger_conditions: string | null
          updated_at: string
          updated_by_receipt_id: string | null
        }
        Insert: {
          assurance_level?: string
          blast_radius?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          detection?: string | null
          id?: string
          maturity?: Database["knowledge"]["Enums"]["maturity"] | null
          mitigation_summary?: string | null
          next_revalidation_at?: string | null
          provenance_claim_id?: string | null
          record_schema_version?: number
          revalidation_policy_id?: string | null
          revalidation_state?: Database["knowledge"]["Enums"]["revalidation_state"]
          scope?: Json
          statement: string
          structured?: Json | null
          superseded_by_id?: string | null
          tenant_id?: string
          title: string
          trigger_conditions?: string | null
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Update: {
          assurance_level?: string
          blast_radius?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          detection?: string | null
          id?: string
          maturity?: Database["knowledge"]["Enums"]["maturity"] | null
          mitigation_summary?: string | null
          next_revalidation_at?: string | null
          provenance_claim_id?: string | null
          record_schema_version?: number
          revalidation_policy_id?: string | null
          revalidation_state?: Database["knowledge"]["Enums"]["revalidation_state"]
          scope?: Json
          statement?: string
          structured?: Json | null
          superseded_by_id?: string | null
          tenant_id?: string
          title?: string
          trigger_conditions?: string | null
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "failure_mode_assurance_level_fkey"
            columns: ["assurance_level"]
            isOneToOne: false
            referencedRelation: "assurance_level"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "failure_mode_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "failure_mode"
            referencedColumns: ["id"]
          },
        ]
      }
      failure_mode_affects_library_version: {
        Row: {
          affected_range: string | null
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          failure_mode_id: string
          fixed_in: string | null
          id: string
          library_id: string
          lifecycle_state: string
          provenance_claim_id: string | null
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          affected_range?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          failure_mode_id: string
          fixed_in?: string | null
          id?: string
          library_id: string
          lifecycle_state: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          affected_range?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          failure_mode_id?: string
          fixed_in?: string | null
          id?: string
          library_id?: string
          lifecycle_state?: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "failure_mode_affects_library_version_failure_mode_id_fkey"
            columns: ["failure_mode_id"]
            isOneToOne: false
            referencedRelation: "failure_mode"
            referencedColumns: ["id"]
          },
        ]
      }
      failure_mode_affects_mcp_server: {
        Row: {
          affected_range: string | null
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          failure_mode_id: string
          fixed_in: string | null
          id: string
          lifecycle_state: string
          mcp_server_id: string
          provenance_claim_id: string | null
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          affected_range?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          failure_mode_id: string
          fixed_in?: string | null
          id?: string
          lifecycle_state: string
          mcp_server_id: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          affected_range?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          failure_mode_id?: string
          fixed_in?: string | null
          id?: string
          lifecycle_state?: string
          mcp_server_id?: string
          provenance_claim_id?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "failure_mode_affects_mcp_server_failure_mode_id_fkey"
            columns: ["failure_mode_id"]
            isOneToOne: false
            referencedRelation: "failure_mode"
            referencedColumns: ["id"]
          },
        ]
      }
      implementation_demonstrates_pattern: {
        Row: {
          advanced_usage_pattern_id: string | null
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          fidelity: string | null
          id: string
          implementation_example_id: string
          lifecycle_state: string
          provenance_claim_id: string | null
          solution_pattern_id: string | null
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          advanced_usage_pattern_id?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          fidelity?: string | null
          id?: string
          implementation_example_id: string
          lifecycle_state: string
          provenance_claim_id?: string | null
          solution_pattern_id?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          advanced_usage_pattern_id?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          fidelity?: string | null
          id?: string
          implementation_example_id?: string
          lifecycle_state?: string
          provenance_claim_id?: string | null
          solution_pattern_id?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "implementation_demonstrates_patt_advanced_usage_pattern_id_fkey"
            columns: ["advanced_usage_pattern_id"]
            isOneToOne: false
            referencedRelation: "advanced_usage_pattern"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "implementation_demonstrates_patt_implementation_example_id_fkey"
            columns: ["implementation_example_id"]
            isOneToOne: false
            referencedRelation: "implementation_example"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "implementation_demonstrates_pattern_solution_pattern_id_fkey"
            columns: ["solution_pattern_id"]
            isOneToOne: false
            referencedRelation: "solution_pattern"
            referencedColumns: ["id"]
          },
        ]
      }
      implementation_example: {
        Row: {
          assurance_level: string
          commit_sha: string | null
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          exec_verification_id: string | null
          id: string
          maturity: Database["knowledge"]["Enums"]["maturity"] | null
          next_revalidation_at: string | null
          path: string | null
          provenance_claim_id: string | null
          record_schema_version: number
          repository_id: string | null
          revalidation_policy_id: string | null
          revalidation_state: Database["knowledge"]["Enums"]["revalidation_state"]
          runnable: boolean
          scope: Json
          statement: string
          structured: Json | null
          superseded_by_id: string | null
          symbol: string | null
          tenant_id: string
          title: string
          updated_at: string
          updated_by_receipt_id: string | null
        }
        Insert: {
          assurance_level?: string
          commit_sha?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          exec_verification_id?: string | null
          id?: string
          maturity?: Database["knowledge"]["Enums"]["maturity"] | null
          next_revalidation_at?: string | null
          path?: string | null
          provenance_claim_id?: string | null
          record_schema_version?: number
          repository_id?: string | null
          revalidation_policy_id?: string | null
          revalidation_state?: Database["knowledge"]["Enums"]["revalidation_state"]
          runnable?: boolean
          scope?: Json
          statement: string
          structured?: Json | null
          superseded_by_id?: string | null
          symbol?: string | null
          tenant_id?: string
          title: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Update: {
          assurance_level?: string
          commit_sha?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          exec_verification_id?: string | null
          id?: string
          maturity?: Database["knowledge"]["Enums"]["maturity"] | null
          next_revalidation_at?: string | null
          path?: string | null
          provenance_claim_id?: string | null
          record_schema_version?: number
          repository_id?: string | null
          revalidation_policy_id?: string | null
          revalidation_state?: Database["knowledge"]["Enums"]["revalidation_state"]
          runnable?: boolean
          scope?: Json
          statement?: string
          structured?: Json | null
          superseded_by_id?: string | null
          symbol?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "implementation_example_assurance_level_fkey"
            columns: ["assurance_level"]
            isOneToOne: false
            referencedRelation: "assurance_level"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "implementation_example_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "implementation_example"
            referencedColumns: ["id"]
          },
        ]
      }
      library_addresses_problem: {
        Row: {
          caveats: string | null
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          effectiveness: string | null
          id: string
          library_id: string
          library_version_range: string | null
          lifecycle_state: string
          provenance_claim_id: string | null
          technical_problem_id: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          caveats?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          effectiveness?: string | null
          id?: string
          library_id: string
          library_version_range?: string | null
          lifecycle_state: string
          provenance_claim_id?: string | null
          technical_problem_id: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          caveats?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          effectiveness?: string | null
          id?: string
          library_id?: string
          library_version_range?: string | null
          lifecycle_state?: string
          provenance_claim_id?: string | null
          technical_problem_id?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "library_addresses_problem_technical_problem_id_fkey"
            columns: ["technical_problem_id"]
            isOneToOne: false
            referencedRelation: "technical_problem"
            referencedColumns: ["id"]
          },
        ]
      }
      operational_practice: {
        Row: {
          applicability: string | null
          assurance_level: string
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          maturity: Database["knowledge"]["Enums"]["maturity"] | null
          next_revalidation_at: string | null
          practice_domain: string | null
          provenance_claim_id: string | null
          record_schema_version: number
          revalidation_policy_id: string | null
          revalidation_state: Database["knowledge"]["Enums"]["revalidation_state"]
          scope: Json
          statement: string
          structured: Json | null
          superseded_by_id: string | null
          tenant_id: string
          title: string
          updated_at: string
          updated_by_receipt_id: string | null
        }
        Insert: {
          applicability?: string | null
          assurance_level?: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          maturity?: Database["knowledge"]["Enums"]["maturity"] | null
          next_revalidation_at?: string | null
          practice_domain?: string | null
          provenance_claim_id?: string | null
          record_schema_version?: number
          revalidation_policy_id?: string | null
          revalidation_state?: Database["knowledge"]["Enums"]["revalidation_state"]
          scope?: Json
          statement: string
          structured?: Json | null
          superseded_by_id?: string | null
          tenant_id?: string
          title: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Update: {
          applicability?: string | null
          assurance_level?: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          maturity?: Database["knowledge"]["Enums"]["maturity"] | null
          next_revalidation_at?: string | null
          practice_domain?: string | null
          provenance_claim_id?: string | null
          record_schema_version?: number
          revalidation_policy_id?: string | null
          revalidation_state?: Database["knowledge"]["Enums"]["revalidation_state"]
          scope?: Json
          statement?: string
          structured?: Json | null
          superseded_by_id?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operational_practice_assurance_level_fkey"
            columns: ["assurance_level"]
            isOneToOne: false
            referencedRelation: "assurance_level"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "operational_practice_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "operational_practice"
            referencedColumns: ["id"]
          },
        ]
      }
      paper_supports_solution: {
        Row: {
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          paper_id: string
          provenance_claim_id: string | null
          solution_pattern_id: string
          support_strength: string | null
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          paper_id: string
          provenance_claim_id?: string | null
          solution_pattern_id: string
          support_strength?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          paper_id?: string
          provenance_claim_id?: string | null
          solution_pattern_id?: string
          support_strength?: string | null
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paper_supports_solution_solution_pattern_id_fkey"
            columns: ["solution_pattern_id"]
            isOneToOne: false
            referencedRelation: "solution_pattern"
            referencedColumns: ["id"]
          },
        ]
      }
      problem_solved_by_solution: {
        Row: {
          conditions: string | null
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          provenance_claim_id: string | null
          solution_pattern_id: string
          technical_problem_id: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          conditions?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          provenance_claim_id?: string | null
          solution_pattern_id: string
          technical_problem_id: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          conditions?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          provenance_claim_id?: string | null
          solution_pattern_id?: string
          technical_problem_id?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "problem_solved_by_solution_solution_pattern_id_fkey"
            columns: ["solution_pattern_id"]
            isOneToOne: false
            referencedRelation: "solution_pattern"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problem_solved_by_solution_technical_problem_id_fkey"
            columns: ["technical_problem_id"]
            isOneToOne: false
            referencedRelation: "technical_problem"
            referencedColumns: ["id"]
          },
        ]
      }
      record_reconciliation: {
        Row: {
          created_at: string
          created_by_receipt_id: string
          id: string
          merged_id: string
          outcome: string
          rationale: string
          record_kind: string
          surviving_id: string
        }
        Insert: {
          created_at?: string
          created_by_receipt_id: string
          id?: string
          merged_id: string
          outcome: string
          rationale: string
          record_kind: string
          surviving_id: string
        }
        Update: {
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          merged_id?: string
          outcome?: string
          rationale?: string
          record_kind?: string
          surviving_id?: string
        }
        Relationships: []
      }
      repository_contains_implementation: {
        Row: {
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          implementation_example_id: string
          lifecycle_state: string
          provenance_claim_id: string | null
          repository_id: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          implementation_example_id: string
          lifecycle_state: string
          provenance_claim_id?: string | null
          repository_id: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          implementation_example_id?: string
          lifecycle_state?: string
          provenance_claim_id?: string | null
          repository_id?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repository_contains_implementati_implementation_example_id_fkey"
            columns: ["implementation_example_id"]
            isOneToOne: false
            referencedRelation: "implementation_example"
            referencedColumns: ["id"]
          },
        ]
      }
      security_consideration: {
        Row: {
          affected_surface: string | null
          assurance_level: string
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          cve_ids: string[]
          id: string
          maturity: Database["knowledge"]["Enums"]["maturity"] | null
          next_revalidation_at: string | null
          provenance_claim_id: string | null
          record_schema_version: number
          revalidation_policy_id: string | null
          revalidation_state: Database["knowledge"]["Enums"]["revalidation_state"]
          scope: Json
          severity: string | null
          statement: string
          structured: Json | null
          superseded_by_id: string | null
          tenant_id: string
          title: string
          updated_at: string
          updated_by_receipt_id: string | null
        }
        Insert: {
          affected_surface?: string | null
          assurance_level?: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          cve_ids?: string[]
          id?: string
          maturity?: Database["knowledge"]["Enums"]["maturity"] | null
          next_revalidation_at?: string | null
          provenance_claim_id?: string | null
          record_schema_version?: number
          revalidation_policy_id?: string | null
          revalidation_state?: Database["knowledge"]["Enums"]["revalidation_state"]
          scope?: Json
          severity?: string | null
          statement: string
          structured?: Json | null
          superseded_by_id?: string | null
          tenant_id?: string
          title: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Update: {
          affected_surface?: string | null
          assurance_level?: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          cve_ids?: string[]
          id?: string
          maturity?: Database["knowledge"]["Enums"]["maturity"] | null
          next_revalidation_at?: string | null
          provenance_claim_id?: string | null
          record_schema_version?: number
          revalidation_policy_id?: string | null
          revalidation_state?: Database["knowledge"]["Enums"]["revalidation_state"]
          scope?: Json
          severity?: string | null
          statement?: string
          structured?: Json | null
          superseded_by_id?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_consideration_assurance_level_fkey"
            columns: ["assurance_level"]
            isOneToOne: false
            referencedRelation: "assurance_level"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "security_consideration_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "security_consideration"
            referencedColumns: ["id"]
          },
        ]
      }
      solution_applies_under_constraint: {
        Row: {
          compatibility_constraint_id: string
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          provenance_claim_id: string | null
          solution_pattern_id: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          compatibility_constraint_id: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          provenance_claim_id?: string | null
          solution_pattern_id: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          compatibility_constraint_id?: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          provenance_claim_id?: string | null
          solution_pattern_id?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solution_applies_under_constra_compatibility_constraint_id_fkey"
            columns: ["compatibility_constraint_id"]
            isOneToOne: false
            referencedRelation: "compatibility_constraint"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solution_applies_under_constraint_solution_pattern_id_fkey"
            columns: ["solution_pattern_id"]
            isOneToOne: false
            referencedRelation: "solution_pattern"
            referencedColumns: ["id"]
          },
        ]
      }
      solution_pattern: {
        Row: {
          alternatives_summary: string | null
          approach_summary: string | null
          assurance_level: string
          benefits: string | null
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          maturity: Database["knowledge"]["Enums"]["maturity"] | null
          next_revalidation_at: string | null
          provenance_claim_id: string | null
          record_schema_version: number
          revalidation_policy_id: string | null
          revalidation_state: Database["knowledge"]["Enums"]["revalidation_state"]
          scope: Json
          statement: string
          structured: Json | null
          superseded_by_id: string | null
          tenant_id: string
          title: string
          tradeoffs: string | null
          updated_at: string
          updated_by_receipt_id: string | null
        }
        Insert: {
          alternatives_summary?: string | null
          approach_summary?: string | null
          assurance_level?: string
          benefits?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          maturity?: Database["knowledge"]["Enums"]["maturity"] | null
          next_revalidation_at?: string | null
          provenance_claim_id?: string | null
          record_schema_version?: number
          revalidation_policy_id?: string | null
          revalidation_state?: Database["knowledge"]["Enums"]["revalidation_state"]
          scope?: Json
          statement: string
          structured?: Json | null
          superseded_by_id?: string | null
          tenant_id?: string
          title: string
          tradeoffs?: string | null
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Update: {
          alternatives_summary?: string | null
          approach_summary?: string | null
          assurance_level?: string
          benefits?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          maturity?: Database["knowledge"]["Enums"]["maturity"] | null
          next_revalidation_at?: string | null
          provenance_claim_id?: string | null
          record_schema_version?: number
          revalidation_policy_id?: string | null
          revalidation_state?: Database["knowledge"]["Enums"]["revalidation_state"]
          scope?: Json
          statement?: string
          structured?: Json | null
          superseded_by_id?: string | null
          tenant_id?: string
          title?: string
          tradeoffs?: string | null
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solution_pattern_assurance_level_fkey"
            columns: ["assurance_level"]
            isOneToOne: false
            referencedRelation: "assurance_level"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "solution_pattern_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "solution_pattern"
            referencedColumns: ["id"]
          },
        ]
      }
      solution_uses_protocol_version: {
        Row: {
          ai_protocol_version_id: string
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          id: string
          lifecycle_state: string
          provenance_claim_id: string | null
          solution_pattern_id: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          ai_protocol_version_id: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          lifecycle_state: string
          provenance_claim_id?: string | null
          solution_pattern_id: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          ai_protocol_version_id?: string
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          lifecycle_state?: string
          provenance_claim_id?: string | null
          solution_pattern_id?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solution_uses_protocol_version_solution_pattern_id_fkey"
            columns: ["solution_pattern_id"]
            isOneToOne: false
            referencedRelation: "solution_pattern"
            referencedColumns: ["id"]
          },
        ]
      }
      talk_explains_pattern: {
        Row: {
          advanced_usage_pattern_id: string | null
          confidence: number | null
          created_at: string
          created_by_receipt_id: string
          depth: string | null
          id: string
          lifecycle_state: string
          provenance_claim_id: string | null
          solution_pattern_id: string | null
          talk_id: string
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          advanced_usage_pattern_id?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id: string
          depth?: string | null
          id?: string
          lifecycle_state: string
          provenance_claim_id?: string | null
          solution_pattern_id?: string | null
          talk_id: string
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          advanced_usage_pattern_id?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string
          depth?: string | null
          id?: string
          lifecycle_state?: string
          provenance_claim_id?: string | null
          solution_pattern_id?: string | null
          talk_id?: string
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "talk_explains_pattern_advanced_usage_pattern_id_fkey"
            columns: ["advanced_usage_pattern_id"]
            isOneToOne: false
            referencedRelation: "advanced_usage_pattern"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "talk_explains_pattern_solution_pattern_id_fkey"
            columns: ["solution_pattern_id"]
            isOneToOne: false
            referencedRelation: "solution_pattern"
            referencedColumns: ["id"]
          },
        ]
      }
      technical_problem: {
        Row: {
          assurance_level: string
          confidence: number | null
          context_of_occurrence: string | null
          created_at: string
          created_by_receipt_id: string
          id: string
          maturity: Database["knowledge"]["Enums"]["maturity"] | null
          next_revalidation_at: string | null
          problem_class: string | null
          provenance_claim_id: string | null
          record_schema_version: number
          revalidation_policy_id: string | null
          revalidation_state: Database["knowledge"]["Enums"]["revalidation_state"]
          scope: Json
          statement: string
          structured: Json | null
          superseded_by_id: string | null
          symptoms: string[]
          tenant_id: string
          title: string
          updated_at: string
          updated_by_receipt_id: string | null
        }
        Insert: {
          assurance_level?: string
          confidence?: number | null
          context_of_occurrence?: string | null
          created_at?: string
          created_by_receipt_id: string
          id?: string
          maturity?: Database["knowledge"]["Enums"]["maturity"] | null
          next_revalidation_at?: string | null
          problem_class?: string | null
          provenance_claim_id?: string | null
          record_schema_version?: number
          revalidation_policy_id?: string | null
          revalidation_state?: Database["knowledge"]["Enums"]["revalidation_state"]
          scope?: Json
          statement: string
          structured?: Json | null
          superseded_by_id?: string | null
          symptoms?: string[]
          tenant_id?: string
          title: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Update: {
          assurance_level?: string
          confidence?: number | null
          context_of_occurrence?: string | null
          created_at?: string
          created_by_receipt_id?: string
          id?: string
          maturity?: Database["knowledge"]["Enums"]["maturity"] | null
          next_revalidation_at?: string | null
          problem_class?: string | null
          provenance_claim_id?: string | null
          record_schema_version?: number
          revalidation_policy_id?: string | null
          revalidation_state?: Database["knowledge"]["Enums"]["revalidation_state"]
          scope?: Json
          statement?: string
          structured?: Json | null
          superseded_by_id?: string | null
          symptoms?: string[]
          tenant_id?: string
          title?: string
          updated_at?: string
          updated_by_receipt_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technical_problem_assurance_level_fkey"
            columns: ["assurance_level"]
            isOneToOne: false
            referencedRelation: "assurance_level"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "technical_problem_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "technical_problem"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      maturity: "experimental" | "emerging" | "established" | "declining"
      revalidation_state:
        | "fresh"
        | "due"
        | "in_progress"
        | "stale"
        | "failed"
        | "retired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  observability: {
    Tables: {
      coordinator_handoff: {
        Row: {
          checkpoint_id: string | null
          created_at: string
          id: string
          new_session_id: string | null
          old_session_id: string | null
          verification_state: string
        }
        Insert: {
          checkpoint_id?: string | null
          created_at?: string
          id?: string
          new_session_id?: string | null
          old_session_id?: string | null
          verification_state?: string
        }
        Update: {
          checkpoint_id?: string | null
          created_at?: string
          id?: string
          new_session_id?: string | null
          old_session_id?: string | null
          verification_state?: string
        }
        Relationships: []
      }
      io_link: {
        Row: {
          artifact_id: string
          created_at: string
          direction: string
          encrypted: boolean
          id: string
          span_id: string | null
          trace_id: string | null
        }
        Insert: {
          artifact_id: string
          created_at?: string
          direction: string
          encrypted?: boolean
          id?: string
          span_id?: string | null
          trace_id?: string | null
        }
        Update: {
          artifact_id?: string
          created_at?: string
          direction?: string
          encrypted?: boolean
          id?: string
          span_id?: string | null
          trace_id?: string | null
        }
        Relationships: []
      }
      normalized_event: {
        Row: {
          event_kind: string
          id: string
          lifecycle_phase: string | null
          mission_id: string | null
          occurred_at: string
          payload: Json
          raw_event_id: string | null
          trace_id: string | null
        }
        Insert: {
          event_kind: string
          id?: string
          lifecycle_phase?: string | null
          mission_id?: string | null
          occurred_at?: string
          payload?: Json
          raw_event_id?: string | null
          trace_id?: string | null
        }
        Update: {
          event_kind?: string
          id?: string
          lifecycle_phase?: string | null
          mission_id?: string | null
          occurred_at?: string
          payload?: Json
          raw_event_id?: string | null
          trace_id?: string | null
        }
        Relationships: []
      }
      normalized_event_202607: {
        Row: {
          event_kind: string
          id: string
          lifecycle_phase: string | null
          mission_id: string | null
          occurred_at: string
          payload: Json
          raw_event_id: string | null
          trace_id: string | null
        }
        Insert: {
          event_kind: string
          id?: string
          lifecycle_phase?: string | null
          mission_id?: string | null
          occurred_at?: string
          payload?: Json
          raw_event_id?: string | null
          trace_id?: string | null
        }
        Update: {
          event_kind?: string
          id?: string
          lifecycle_phase?: string | null
          mission_id?: string | null
          occurred_at?: string
          payload?: Json
          raw_event_id?: string | null
          trace_id?: string | null
        }
        Relationships: []
      }
      normalized_event_202608: {
        Row: {
          event_kind: string
          id: string
          lifecycle_phase: string | null
          mission_id: string | null
          occurred_at: string
          payload: Json
          raw_event_id: string | null
          trace_id: string | null
        }
        Insert: {
          event_kind: string
          id?: string
          lifecycle_phase?: string | null
          mission_id?: string | null
          occurred_at?: string
          payload?: Json
          raw_event_id?: string | null
          trace_id?: string | null
        }
        Update: {
          event_kind?: string
          id?: string
          lifecycle_phase?: string | null
          mission_id?: string | null
          occurred_at?: string
          payload?: Json
          raw_event_id?: string | null
          trace_id?: string | null
        }
        Relationships: []
      }
      normalized_event_202609: {
        Row: {
          event_kind: string
          id: string
          lifecycle_phase: string | null
          mission_id: string | null
          occurred_at: string
          payload: Json
          raw_event_id: string | null
          trace_id: string | null
        }
        Insert: {
          event_kind: string
          id?: string
          lifecycle_phase?: string | null
          mission_id?: string | null
          occurred_at?: string
          payload?: Json
          raw_event_id?: string | null
          trace_id?: string | null
        }
        Update: {
          event_kind?: string
          id?: string
          lifecycle_phase?: string | null
          mission_id?: string | null
          occurred_at?: string
          payload?: Json
          raw_event_id?: string | null
          trace_id?: string | null
        }
        Relationships: []
      }
      normalized_event_202610: {
        Row: {
          event_kind: string
          id: string
          lifecycle_phase: string | null
          mission_id: string | null
          occurred_at: string
          payload: Json
          raw_event_id: string | null
          trace_id: string | null
        }
        Insert: {
          event_kind: string
          id?: string
          lifecycle_phase?: string | null
          mission_id?: string | null
          occurred_at?: string
          payload?: Json
          raw_event_id?: string | null
          trace_id?: string | null
        }
        Update: {
          event_kind?: string
          id?: string
          lifecycle_phase?: string | null
          mission_id?: string | null
          occurred_at?: string
          payload?: Json
          raw_event_id?: string | null
          trace_id?: string | null
        }
        Relationships: []
      }
      normalized_event_202611: {
        Row: {
          event_kind: string
          id: string
          lifecycle_phase: string | null
          mission_id: string | null
          occurred_at: string
          payload: Json
          raw_event_id: string | null
          trace_id: string | null
        }
        Insert: {
          event_kind: string
          id?: string
          lifecycle_phase?: string | null
          mission_id?: string | null
          occurred_at?: string
          payload?: Json
          raw_event_id?: string | null
          trace_id?: string | null
        }
        Update: {
          event_kind?: string
          id?: string
          lifecycle_phase?: string | null
          mission_id?: string | null
          occurred_at?: string
          payload?: Json
          raw_event_id?: string | null
          trace_id?: string | null
        }
        Relationships: []
      }
      normalized_event_202612: {
        Row: {
          event_kind: string
          id: string
          lifecycle_phase: string | null
          mission_id: string | null
          occurred_at: string
          payload: Json
          raw_event_id: string | null
          trace_id: string | null
        }
        Insert: {
          event_kind: string
          id?: string
          lifecycle_phase?: string | null
          mission_id?: string | null
          occurred_at?: string
          payload?: Json
          raw_event_id?: string | null
          trace_id?: string | null
        }
        Update: {
          event_kind?: string
          id?: string
          lifecycle_phase?: string | null
          mission_id?: string | null
          occurred_at?: string
          payload?: Json
          raw_event_id?: string | null
          trace_id?: string | null
        }
        Relationships: []
      }
      normalized_event_202701: {
        Row: {
          event_kind: string
          id: string
          lifecycle_phase: string | null
          mission_id: string | null
          occurred_at: string
          payload: Json
          raw_event_id: string | null
          trace_id: string | null
        }
        Insert: {
          event_kind: string
          id?: string
          lifecycle_phase?: string | null
          mission_id?: string | null
          occurred_at?: string
          payload?: Json
          raw_event_id?: string | null
          trace_id?: string | null
        }
        Update: {
          event_kind?: string
          id?: string
          lifecycle_phase?: string | null
          mission_id?: string | null
          occurred_at?: string
          payload?: Json
          raw_event_id?: string | null
          trace_id?: string | null
        }
        Relationships: []
      }
      normalized_event_202702: {
        Row: {
          event_kind: string
          id: string
          lifecycle_phase: string | null
          mission_id: string | null
          occurred_at: string
          payload: Json
          raw_event_id: string | null
          trace_id: string | null
        }
        Insert: {
          event_kind: string
          id?: string
          lifecycle_phase?: string | null
          mission_id?: string | null
          occurred_at?: string
          payload?: Json
          raw_event_id?: string | null
          trace_id?: string | null
        }
        Update: {
          event_kind?: string
          id?: string
          lifecycle_phase?: string | null
          mission_id?: string | null
          occurred_at?: string
          payload?: Json
          raw_event_id?: string | null
          trace_id?: string | null
        }
        Relationships: []
      }
      raw_event: {
        Row: {
          event: Json
          id: string
          idempotency_key: string
          occurred_at: string
          stream_cursor: string | null
          trace_id: string | null
        }
        Insert: {
          event: Json
          id?: string
          idempotency_key: string
          occurred_at?: string
          stream_cursor?: string | null
          trace_id?: string | null
        }
        Update: {
          event?: Json
          id?: string
          idempotency_key?: string
          occurred_at?: string
          stream_cursor?: string | null
          trace_id?: string | null
        }
        Relationships: []
      }
      raw_event_202607: {
        Row: {
          event: Json
          id: string
          idempotency_key: string
          occurred_at: string
          stream_cursor: string | null
          trace_id: string | null
        }
        Insert: {
          event: Json
          id?: string
          idempotency_key: string
          occurred_at?: string
          stream_cursor?: string | null
          trace_id?: string | null
        }
        Update: {
          event?: Json
          id?: string
          idempotency_key?: string
          occurred_at?: string
          stream_cursor?: string | null
          trace_id?: string | null
        }
        Relationships: []
      }
      raw_event_202608: {
        Row: {
          event: Json
          id: string
          idempotency_key: string
          occurred_at: string
          stream_cursor: string | null
          trace_id: string | null
        }
        Insert: {
          event: Json
          id?: string
          idempotency_key: string
          occurred_at?: string
          stream_cursor?: string | null
          trace_id?: string | null
        }
        Update: {
          event?: Json
          id?: string
          idempotency_key?: string
          occurred_at?: string
          stream_cursor?: string | null
          trace_id?: string | null
        }
        Relationships: []
      }
      raw_event_202609: {
        Row: {
          event: Json
          id: string
          idempotency_key: string
          occurred_at: string
          stream_cursor: string | null
          trace_id: string | null
        }
        Insert: {
          event: Json
          id?: string
          idempotency_key: string
          occurred_at?: string
          stream_cursor?: string | null
          trace_id?: string | null
        }
        Update: {
          event?: Json
          id?: string
          idempotency_key?: string
          occurred_at?: string
          stream_cursor?: string | null
          trace_id?: string | null
        }
        Relationships: []
      }
      raw_event_202610: {
        Row: {
          event: Json
          id: string
          idempotency_key: string
          occurred_at: string
          stream_cursor: string | null
          trace_id: string | null
        }
        Insert: {
          event: Json
          id?: string
          idempotency_key: string
          occurred_at?: string
          stream_cursor?: string | null
          trace_id?: string | null
        }
        Update: {
          event?: Json
          id?: string
          idempotency_key?: string
          occurred_at?: string
          stream_cursor?: string | null
          trace_id?: string | null
        }
        Relationships: []
      }
      raw_event_202611: {
        Row: {
          event: Json
          id: string
          idempotency_key: string
          occurred_at: string
          stream_cursor: string | null
          trace_id: string | null
        }
        Insert: {
          event: Json
          id?: string
          idempotency_key: string
          occurred_at?: string
          stream_cursor?: string | null
          trace_id?: string | null
        }
        Update: {
          event?: Json
          id?: string
          idempotency_key?: string
          occurred_at?: string
          stream_cursor?: string | null
          trace_id?: string | null
        }
        Relationships: []
      }
      raw_event_202612: {
        Row: {
          event: Json
          id: string
          idempotency_key: string
          occurred_at: string
          stream_cursor: string | null
          trace_id: string | null
        }
        Insert: {
          event: Json
          id?: string
          idempotency_key: string
          occurred_at?: string
          stream_cursor?: string | null
          trace_id?: string | null
        }
        Update: {
          event?: Json
          id?: string
          idempotency_key?: string
          occurred_at?: string
          stream_cursor?: string | null
          trace_id?: string | null
        }
        Relationships: []
      }
      raw_event_202701: {
        Row: {
          event: Json
          id: string
          idempotency_key: string
          occurred_at: string
          stream_cursor: string | null
          trace_id: string | null
        }
        Insert: {
          event: Json
          id?: string
          idempotency_key: string
          occurred_at?: string
          stream_cursor?: string | null
          trace_id?: string | null
        }
        Update: {
          event?: Json
          id?: string
          idempotency_key?: string
          occurred_at?: string
          stream_cursor?: string | null
          trace_id?: string | null
        }
        Relationships: []
      }
      raw_event_202702: {
        Row: {
          event: Json
          id: string
          idempotency_key: string
          occurred_at: string
          stream_cursor: string | null
          trace_id: string | null
        }
        Insert: {
          event: Json
          id?: string
          idempotency_key: string
          occurred_at?: string
          stream_cursor?: string | null
          trace_id?: string | null
        }
        Update: {
          event?: Json
          id?: string
          idempotency_key?: string
          occurred_at?: string
          stream_cursor?: string | null
          trace_id?: string | null
        }
        Relationships: []
      }
      span: {
        Row: {
          attributes: Json
          cost_usd: number | null
          duration_ms: number | null
          ended_at: string | null
          id: string
          kind: string
          name: string
          occurred_at: string
          parent_span_id: string | null
          span_id: string
          started_at: string
          status: string
          token_input: number | null
          token_output: number | null
          trace_id: string
        }
        Insert: {
          attributes?: Json
          cost_usd?: number | null
          duration_ms?: number | null
          ended_at?: string | null
          id?: string
          kind: string
          name: string
          occurred_at?: string
          parent_span_id?: string | null
          span_id: string
          started_at: string
          status?: string
          token_input?: number | null
          token_output?: number | null
          trace_id: string
        }
        Update: {
          attributes?: Json
          cost_usd?: number | null
          duration_ms?: number | null
          ended_at?: string | null
          id?: string
          kind?: string
          name?: string
          occurred_at?: string
          parent_span_id?: string | null
          span_id?: string
          started_at?: string
          status?: string
          token_input?: number | null
          token_output?: number | null
          trace_id?: string
        }
        Relationships: []
      }
      span_202607: {
        Row: {
          attributes: Json
          cost_usd: number | null
          duration_ms: number | null
          ended_at: string | null
          id: string
          kind: string
          name: string
          occurred_at: string
          parent_span_id: string | null
          span_id: string
          started_at: string
          status: string
          token_input: number | null
          token_output: number | null
          trace_id: string
        }
        Insert: {
          attributes?: Json
          cost_usd?: number | null
          duration_ms?: number | null
          ended_at?: string | null
          id?: string
          kind: string
          name: string
          occurred_at?: string
          parent_span_id?: string | null
          span_id: string
          started_at: string
          status?: string
          token_input?: number | null
          token_output?: number | null
          trace_id: string
        }
        Update: {
          attributes?: Json
          cost_usd?: number | null
          duration_ms?: number | null
          ended_at?: string | null
          id?: string
          kind?: string
          name?: string
          occurred_at?: string
          parent_span_id?: string | null
          span_id?: string
          started_at?: string
          status?: string
          token_input?: number | null
          token_output?: number | null
          trace_id?: string
        }
        Relationships: []
      }
      span_202608: {
        Row: {
          attributes: Json
          cost_usd: number | null
          duration_ms: number | null
          ended_at: string | null
          id: string
          kind: string
          name: string
          occurred_at: string
          parent_span_id: string | null
          span_id: string
          started_at: string
          status: string
          token_input: number | null
          token_output: number | null
          trace_id: string
        }
        Insert: {
          attributes?: Json
          cost_usd?: number | null
          duration_ms?: number | null
          ended_at?: string | null
          id?: string
          kind: string
          name: string
          occurred_at?: string
          parent_span_id?: string | null
          span_id: string
          started_at: string
          status?: string
          token_input?: number | null
          token_output?: number | null
          trace_id: string
        }
        Update: {
          attributes?: Json
          cost_usd?: number | null
          duration_ms?: number | null
          ended_at?: string | null
          id?: string
          kind?: string
          name?: string
          occurred_at?: string
          parent_span_id?: string | null
          span_id?: string
          started_at?: string
          status?: string
          token_input?: number | null
          token_output?: number | null
          trace_id?: string
        }
        Relationships: []
      }
      span_202609: {
        Row: {
          attributes: Json
          cost_usd: number | null
          duration_ms: number | null
          ended_at: string | null
          id: string
          kind: string
          name: string
          occurred_at: string
          parent_span_id: string | null
          span_id: string
          started_at: string
          status: string
          token_input: number | null
          token_output: number | null
          trace_id: string
        }
        Insert: {
          attributes?: Json
          cost_usd?: number | null
          duration_ms?: number | null
          ended_at?: string | null
          id?: string
          kind: string
          name: string
          occurred_at?: string
          parent_span_id?: string | null
          span_id: string
          started_at: string
          status?: string
          token_input?: number | null
          token_output?: number | null
          trace_id: string
        }
        Update: {
          attributes?: Json
          cost_usd?: number | null
          duration_ms?: number | null
          ended_at?: string | null
          id?: string
          kind?: string
          name?: string
          occurred_at?: string
          parent_span_id?: string | null
          span_id?: string
          started_at?: string
          status?: string
          token_input?: number | null
          token_output?: number | null
          trace_id?: string
        }
        Relationships: []
      }
      span_202610: {
        Row: {
          attributes: Json
          cost_usd: number | null
          duration_ms: number | null
          ended_at: string | null
          id: string
          kind: string
          name: string
          occurred_at: string
          parent_span_id: string | null
          span_id: string
          started_at: string
          status: string
          token_input: number | null
          token_output: number | null
          trace_id: string
        }
        Insert: {
          attributes?: Json
          cost_usd?: number | null
          duration_ms?: number | null
          ended_at?: string | null
          id?: string
          kind: string
          name: string
          occurred_at?: string
          parent_span_id?: string | null
          span_id: string
          started_at: string
          status?: string
          token_input?: number | null
          token_output?: number | null
          trace_id: string
        }
        Update: {
          attributes?: Json
          cost_usd?: number | null
          duration_ms?: number | null
          ended_at?: string | null
          id?: string
          kind?: string
          name?: string
          occurred_at?: string
          parent_span_id?: string | null
          span_id?: string
          started_at?: string
          status?: string
          token_input?: number | null
          token_output?: number | null
          trace_id?: string
        }
        Relationships: []
      }
      span_202611: {
        Row: {
          attributes: Json
          cost_usd: number | null
          duration_ms: number | null
          ended_at: string | null
          id: string
          kind: string
          name: string
          occurred_at: string
          parent_span_id: string | null
          span_id: string
          started_at: string
          status: string
          token_input: number | null
          token_output: number | null
          trace_id: string
        }
        Insert: {
          attributes?: Json
          cost_usd?: number | null
          duration_ms?: number | null
          ended_at?: string | null
          id?: string
          kind: string
          name: string
          occurred_at?: string
          parent_span_id?: string | null
          span_id: string
          started_at: string
          status?: string
          token_input?: number | null
          token_output?: number | null
          trace_id: string
        }
        Update: {
          attributes?: Json
          cost_usd?: number | null
          duration_ms?: number | null
          ended_at?: string | null
          id?: string
          kind?: string
          name?: string
          occurred_at?: string
          parent_span_id?: string | null
          span_id?: string
          started_at?: string
          status?: string
          token_input?: number | null
          token_output?: number | null
          trace_id?: string
        }
        Relationships: []
      }
      span_202612: {
        Row: {
          attributes: Json
          cost_usd: number | null
          duration_ms: number | null
          ended_at: string | null
          id: string
          kind: string
          name: string
          occurred_at: string
          parent_span_id: string | null
          span_id: string
          started_at: string
          status: string
          token_input: number | null
          token_output: number | null
          trace_id: string
        }
        Insert: {
          attributes?: Json
          cost_usd?: number | null
          duration_ms?: number | null
          ended_at?: string | null
          id?: string
          kind: string
          name: string
          occurred_at?: string
          parent_span_id?: string | null
          span_id: string
          started_at: string
          status?: string
          token_input?: number | null
          token_output?: number | null
          trace_id: string
        }
        Update: {
          attributes?: Json
          cost_usd?: number | null
          duration_ms?: number | null
          ended_at?: string | null
          id?: string
          kind?: string
          name?: string
          occurred_at?: string
          parent_span_id?: string | null
          span_id?: string
          started_at?: string
          status?: string
          token_input?: number | null
          token_output?: number | null
          trace_id?: string
        }
        Relationships: []
      }
      span_202701: {
        Row: {
          attributes: Json
          cost_usd: number | null
          duration_ms: number | null
          ended_at: string | null
          id: string
          kind: string
          name: string
          occurred_at: string
          parent_span_id: string | null
          span_id: string
          started_at: string
          status: string
          token_input: number | null
          token_output: number | null
          trace_id: string
        }
        Insert: {
          attributes?: Json
          cost_usd?: number | null
          duration_ms?: number | null
          ended_at?: string | null
          id?: string
          kind: string
          name: string
          occurred_at?: string
          parent_span_id?: string | null
          span_id: string
          started_at: string
          status?: string
          token_input?: number | null
          token_output?: number | null
          trace_id: string
        }
        Update: {
          attributes?: Json
          cost_usd?: number | null
          duration_ms?: number | null
          ended_at?: string | null
          id?: string
          kind?: string
          name?: string
          occurred_at?: string
          parent_span_id?: string | null
          span_id?: string
          started_at?: string
          status?: string
          token_input?: number | null
          token_output?: number | null
          trace_id?: string
        }
        Relationships: []
      }
      span_202702: {
        Row: {
          attributes: Json
          cost_usd: number | null
          duration_ms: number | null
          ended_at: string | null
          id: string
          kind: string
          name: string
          occurred_at: string
          parent_span_id: string | null
          span_id: string
          started_at: string
          status: string
          token_input: number | null
          token_output: number | null
          trace_id: string
        }
        Insert: {
          attributes?: Json
          cost_usd?: number | null
          duration_ms?: number | null
          ended_at?: string | null
          id?: string
          kind: string
          name: string
          occurred_at?: string
          parent_span_id?: string | null
          span_id: string
          started_at: string
          status?: string
          token_input?: number | null
          token_output?: number | null
          trace_id: string
        }
        Update: {
          attributes?: Json
          cost_usd?: number | null
          duration_ms?: number | null
          ended_at?: string | null
          id?: string
          kind?: string
          name?: string
          occurred_at?: string
          parent_span_id?: string | null
          span_id?: string
          started_at?: string
          status?: string
          token_input?: number | null
          token_output?: number | null
          trace_id?: string
        }
        Relationships: []
      }
      trace: {
        Row: {
          attempt_id: string | null
          causation_id: string | null
          ended_at: string | null
          mission_id: string | null
          root_span_id: string | null
          started_at: string
          tenant_id: string
          trace_id: string
          work_item_id: string | null
        }
        Insert: {
          attempt_id?: string | null
          causation_id?: string | null
          ended_at?: string | null
          mission_id?: string | null
          root_span_id?: string | null
          started_at?: string
          tenant_id?: string
          trace_id: string
          work_item_id?: string | null
        }
        Update: {
          attempt_id?: string | null
          causation_id?: string | null
          ended_at?: string | null
          mission_id?: string | null
          root_span_id?: string | null
          started_at?: string
          tenant_id?: string
          trace_id?: string
          work_item_id?: string | null
        }
        Relationships: []
      }
      usage_rollup: {
        Row: {
          computed_at: string
          cost_usd: number
          day: string
          id: string
          latency_ms_p50: number | null
          latency_ms_p95: number | null
          mission_id: string | null
          retry_count: number
          span_count: number
          token_input: number
          token_output: number
        }
        Insert: {
          computed_at?: string
          cost_usd?: number
          day: string
          id?: string
          latency_ms_p50?: number | null
          latency_ms_p95?: number | null
          mission_id?: string | null
          retry_count?: number
          span_count?: number
          token_input?: number
          token_output?: number
        }
        Update: {
          computed_at?: string
          cost_usd?: number
          day?: string
          id?: string
          latency_ms_p50?: number | null
          latency_ms_p95?: number | null
          mission_id?: string | null
          retry_count?: number
          span_count?: number
          token_input?: number
          token_output?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  orchestration: {
    Tables: {
      agent_session: {
        Row: {
          agent_deployment: string
          compaction_count: number
          ended_at: string | null
          eve_session_id: string
          id: string
          mission_id: string | null
          rotated_from_id: string | null
          started_at: string
          status: string
          tenant_id: string
        }
        Insert: {
          agent_deployment: string
          compaction_count?: number
          ended_at?: string | null
          eve_session_id: string
          id?: string
          mission_id?: string | null
          rotated_from_id?: string | null
          started_at?: string
          status?: string
          tenant_id?: string
        }
        Update: {
          agent_deployment?: string
          compaction_count?: number
          ended_at?: string | null
          eve_session_id?: string
          id?: string
          mission_id?: string | null
          rotated_from_id?: string | null
          started_at?: string
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_session_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "mission"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_session_rotated_from_id_fkey"
            columns: ["rotated_from_id"]
            isOneToOne: false
            referencedRelation: "agent_session"
            referencedColumns: ["id"]
          },
        ]
      }
      artifact: {
        Row: {
          artifact_type: string
          bucket_class: Database["orchestration"]["Enums"]["bucket_class"]
          created_at: string
          id: string
          media_type: string | null
          mission_id: string | null
          object_path: string
          producer_attempt_id: string | null
          schema_version: number
          sha256: string
          size_bytes: number | null
          storage_bucket: string
          superseded_by_id: string | null
          tenant_id: string
        }
        Insert: {
          artifact_type: string
          bucket_class: Database["orchestration"]["Enums"]["bucket_class"]
          created_at?: string
          id?: string
          media_type?: string | null
          mission_id?: string | null
          object_path: string
          producer_attempt_id?: string | null
          schema_version?: number
          sha256: string
          size_bytes?: number | null
          storage_bucket: string
          superseded_by_id?: string | null
          tenant_id?: string
        }
        Update: {
          artifact_type?: string
          bucket_class?: Database["orchestration"]["Enums"]["bucket_class"]
          created_at?: string
          id?: string
          media_type?: string | null
          mission_id?: string | null
          object_path?: string
          producer_attempt_id?: string | null
          schema_version?: number
          sha256?: string
          size_bytes?: number | null
          storage_bucket?: string
          superseded_by_id?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artifact_artifact_type_fkey"
            columns: ["artifact_type"]
            isOneToOne: false
            referencedRelation: "artifact_type"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "artifact_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "mission"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artifact_producer_attempt_id_fkey"
            columns: ["producer_attempt_id"]
            isOneToOne: false
            referencedRelation: "attempt"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artifact_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "artifact"
            referencedColumns: ["id"]
          },
        ]
      }
      artifact_manifest: {
        Row: {
          created_at: string
          deferred: Json
          failed: Json
          id: string
          mission_id: string | null
          omitted: Json
          produced: Json
          required: Json
          work_item_id: string | null
        }
        Insert: {
          created_at?: string
          deferred?: Json
          failed?: Json
          id?: string
          mission_id?: string | null
          omitted?: Json
          produced?: Json
          required?: Json
          work_item_id?: string | null
        }
        Update: {
          created_at?: string
          deferred?: Json
          failed?: Json
          id?: string
          mission_id?: string | null
          omitted?: Json
          produced?: Json
          required?: Json
          work_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artifact_manifest_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "mission"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artifact_manifest_work_item_id_fkey"
            columns: ["work_item_id"]
            isOneToOne: false
            referencedRelation: "work_item"
            referencedColumns: ["id"]
          },
        ]
      }
      artifact_type: {
        Row: {
          code: string
          created_at: string
          description: string
        }
        Insert: {
          code: string
          created_at?: string
          description: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
        }
        Relationships: []
      }
      attempt: {
        Row: {
          agent_deployment_id: string
          agent_session_id: string | null
          attempt_no: number
          cost_usd: number | null
          ended_at: string | null
          eve_turn_ids: string[]
          id: string
          latency_ms: number | null
          outcome: Database["orchestration"]["Enums"]["attempt_outcome"] | null
          remote_child_ids: string[]
          started_at: string
          tenant_id: string
          token_input: number | null
          token_output: number | null
          work_item_id: string
        }
        Insert: {
          agent_deployment_id: string
          agent_session_id?: string | null
          attempt_no: number
          cost_usd?: number | null
          ended_at?: string | null
          eve_turn_ids?: string[]
          id?: string
          latency_ms?: number | null
          outcome?: Database["orchestration"]["Enums"]["attempt_outcome"] | null
          remote_child_ids?: string[]
          started_at?: string
          tenant_id?: string
          token_input?: number | null
          token_output?: number | null
          work_item_id: string
        }
        Update: {
          agent_deployment_id?: string
          agent_session_id?: string | null
          attempt_no?: number
          cost_usd?: number | null
          ended_at?: string | null
          eve_turn_ids?: string[]
          id?: string
          latency_ms?: number | null
          outcome?: Database["orchestration"]["Enums"]["attempt_outcome"] | null
          remote_child_ids?: string[]
          started_at?: string
          tenant_id?: string
          token_input?: number | null
          token_output?: number | null
          work_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attempt_agent_session_id_fkey"
            columns: ["agent_session_id"]
            isOneToOne: false
            referencedRelation: "agent_session"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attempt_work_item_id_fkey"
            columns: ["work_item_id"]
            isOneToOne: false
            referencedRelation: "work_item"
            referencedColumns: ["id"]
          },
        ]
      }
      capability: {
        Row: {
          created_at: string
          id: string
          kind: string
          operations: string[]
          packages_mcp_server_version_id: string | null
          purpose: string
          slug: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          operations?: string[]
          packages_mcp_server_version_id?: string | null
          purpose: string
          slug: string
          tenant_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          operations?: string[]
          packages_mcp_server_version_id?: string | null
          purpose?: string
          slug?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "capability_kind_fkey"
            columns: ["kind"]
            isOneToOne: false
            referencedRelation: "capability_kind"
            referencedColumns: ["code"]
          },
        ]
      }
      capability_kind: {
        Row: {
          code: string
          created_at: string
          description: string
        }
        Insert: {
          code: string
          created_at?: string
          description: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
        }
        Relationships: []
      }
      capability_profile: {
        Row: {
          created_at: string
          id: string
          purpose: string
          slug: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          purpose: string
          slug: string
          tenant_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          purpose?: string
          slug?: string
          tenant_id?: string
        }
        Relationships: []
      }
      capability_profile_item: {
        Row: {
          activation: string
          capability_version_id: string
          profile_id: string
        }
        Insert: {
          activation?: string
          capability_version_id: string
          profile_id: string
        }
        Update: {
          activation?: string
          capability_version_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "capability_profile_item_capability_version_id_fkey"
            columns: ["capability_version_id"]
            isOneToOne: false
            referencedRelation: "capability_version"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capability_profile_item_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "capability_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      capability_version: {
        Row: {
          approval_policy: Json
          capability_id: string
          created_at: string
          eval_suite_id: string | null
          id: string
          lifecycle: string
          network_requirements: Json
          secret_requirements: Json
          version_label: string
        }
        Insert: {
          approval_policy?: Json
          capability_id: string
          created_at?: string
          eval_suite_id?: string | null
          id?: string
          lifecycle?: string
          network_requirements?: Json
          secret_requirements?: Json
          version_label: string
        }
        Update: {
          approval_policy?: Json
          capability_id?: string
          created_at?: string
          eval_suite_id?: string | null
          id?: string
          lifecycle?: string
          network_requirements?: Json
          secret_requirements?: Json
          version_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "capability_version_capability_id_fkey"
            columns: ["capability_id"]
            isOneToOne: false
            referencedRelation: "capability"
            referencedColumns: ["id"]
          },
        ]
      }
      continuation_checkpoint: {
        Row: {
          active: Json
          agent_session_id: string | null
          blocked: Json
          completed: Json
          constraints_section: Json
          created_at: string
          decisions: Json
          digests: Json
          failed_approaches: Json
          id: string
          mission_id: string
          package_artifact_id: string | null
          pending_approvals: Json
          refs: Json
          verification_status: string
        }
        Insert: {
          active?: Json
          agent_session_id?: string | null
          blocked?: Json
          completed?: Json
          constraints_section?: Json
          created_at?: string
          decisions?: Json
          digests?: Json
          failed_approaches?: Json
          id?: string
          mission_id: string
          package_artifact_id?: string | null
          pending_approvals?: Json
          refs?: Json
          verification_status?: string
        }
        Update: {
          active?: Json
          agent_session_id?: string | null
          blocked?: Json
          completed?: Json
          constraints_section?: Json
          created_at?: string
          decisions?: Json
          digests?: Json
          failed_approaches?: Json
          id?: string
          mission_id?: string
          package_artifact_id?: string | null
          pending_approvals?: Json
          refs?: Json
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "continuation_checkpoint_agent_session_id_fkey"
            columns: ["agent_session_id"]
            isOneToOne: false
            referencedRelation: "agent_session"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "continuation_checkpoint_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "mission"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "continuation_checkpoint_package_artifact_id_fkey"
            columns: ["package_artifact_id"]
            isOneToOne: false
            referencedRelation: "artifact"
            referencedColumns: ["id"]
          },
        ]
      }
      intent_type: {
        Row: {
          code: string
          created_at: string
          description: string
          schema_version: number
        }
        Insert: {
          code: string
          created_at?: string
          description: string
          schema_version?: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
          schema_version?: number
        }
        Relationships: []
      }
      mission: {
        Row: {
          acceptance_criteria: Json
          budget_cost_usd: number | null
          budget_max_depth: number | null
          budget_max_fanout: number | null
          budget_max_retries: number | null
          budget_wall_seconds: number | null
          capability_profile_id: string | null
          created_at: string
          ended_at: string | null
          goal: string
          id: string
          research_questions: Json
          selection_id: string | null
          slug: string | null
          started_at: string | null
          status: Database["orchestration"]["Enums"]["mission_status"]
          tenant_id: string
          terminal_reason: string | null
          updated_at: string
        }
        Insert: {
          acceptance_criteria?: Json
          budget_cost_usd?: number | null
          budget_max_depth?: number | null
          budget_max_fanout?: number | null
          budget_max_retries?: number | null
          budget_wall_seconds?: number | null
          capability_profile_id?: string | null
          created_at?: string
          ended_at?: string | null
          goal: string
          id?: string
          research_questions?: Json
          selection_id?: string | null
          slug?: string | null
          started_at?: string | null
          status?: Database["orchestration"]["Enums"]["mission_status"]
          tenant_id?: string
          terminal_reason?: string | null
          updated_at?: string
        }
        Update: {
          acceptance_criteria?: Json
          budget_cost_usd?: number | null
          budget_max_depth?: number | null
          budget_max_fanout?: number | null
          budget_max_retries?: number | null
          budget_wall_seconds?: number | null
          capability_profile_id?: string | null
          created_at?: string
          ended_at?: string | null
          goal?: string
          id?: string
          research_questions?: Json
          selection_id?: string | null
          slug?: string | null
          started_at?: string | null
          status?: Database["orchestration"]["Enums"]["mission_status"]
          tenant_id?: string
          terminal_reason?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_capability_profile_fk"
            columns: ["capability_profile_id"]
            isOneToOne: false
            referencedRelation: "capability_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_event: {
        Row: {
          actor: string
          causation_id: string | null
          from_status:
            | Database["orchestration"]["Enums"]["mission_status"]
            | null
          id: string
          mission_id: string
          occurred_at: string
          payload: Json
          reason: string | null
          to_status: Database["orchestration"]["Enums"]["mission_status"]
        }
        Insert: {
          actor: string
          causation_id?: string | null
          from_status?:
            | Database["orchestration"]["Enums"]["mission_status"]
            | null
          id?: string
          mission_id: string
          occurred_at?: string
          payload?: Json
          reason?: string | null
          to_status: Database["orchestration"]["Enums"]["mission_status"]
        }
        Update: {
          actor?: string
          causation_id?: string | null
          from_status?:
            | Database["orchestration"]["Enums"]["mission_status"]
            | null
          id?: string
          mission_id?: string
          occurred_at?: string
          payload?: Json
          reason?: string | null
          to_status?: Database["orchestration"]["Enums"]["mission_status"]
        }
        Relationships: [
          {
            foreignKeyName: "mission_event_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "mission"
            referencedColumns: ["id"]
          },
        ]
      }
      operation_intent: {
        Row: {
          approval_state: string
          created_at: string
          id: string
          idempotency_key: string
          intent_type: string
          mission_id: string | null
          payload: Json
          policy_decision: Json | null
          preconditions: Json
          proposed_by_attempt: string | null
          schema_version: number
          tenant_id: string
        }
        Insert: {
          approval_state?: string
          created_at?: string
          id?: string
          idempotency_key: string
          intent_type: string
          mission_id?: string | null
          payload: Json
          policy_decision?: Json | null
          preconditions?: Json
          proposed_by_attempt?: string | null
          schema_version?: number
          tenant_id?: string
        }
        Update: {
          approval_state?: string
          created_at?: string
          id?: string
          idempotency_key?: string
          intent_type?: string
          mission_id?: string | null
          payload?: Json
          policy_decision?: Json | null
          preconditions?: Json
          proposed_by_attempt?: string | null
          schema_version?: number
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "operation_intent_intent_type_fkey"
            columns: ["intent_type"]
            isOneToOne: false
            referencedRelation: "intent_type"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "operation_intent_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "mission"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operation_intent_proposed_by_attempt_fkey"
            columns: ["proposed_by_attempt"]
            isOneToOne: false
            referencedRelation: "attempt"
            referencedColumns: ["id"]
          },
        ]
      }
      operation_receipt: {
        Row: {
          affected_refs: Json
          applied_at: string
          changes_summary: Json
          executor_version: string
          id: string
          intent_id: string
          outcome: string
          precondition_results: Json
        }
        Insert: {
          affected_refs?: Json
          applied_at?: string
          changes_summary?: Json
          executor_version: string
          id?: string
          intent_id: string
          outcome: string
          precondition_results?: Json
        }
        Update: {
          affected_refs?: Json
          applied_at?: string
          changes_summary?: Json
          executor_version?: string
          id?: string
          intent_id?: string
          outcome?: string
          precondition_results?: Json
        }
        Relationships: [
          {
            foreignKeyName: "operation_receipt_intent_id_fkey"
            columns: ["intent_id"]
            isOneToOne: true
            referencedRelation: "operation_intent"
            referencedColumns: ["id"]
          },
        ]
      }
      outbox_event: {
        Row: {
          causation_id: string | null
          created_at: string
          id: number
          mission_id: string | null
          payload: Json
          published_at: string | null
          topic: string
        }
        Insert: {
          causation_id?: string | null
          created_at?: string
          id?: number
          mission_id?: string | null
          payload: Json
          published_at?: string | null
          topic: string
        }
        Update: {
          causation_id?: string | null
          created_at?: string
          id?: number
          mission_id?: string | null
          payload?: Json
          published_at?: string | null
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "outbox_event_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "mission"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_route: {
        Row: {
          abstract_operation: string
          created_at: string
          enabled: boolean
          failure_rollup: Json
          id: string
          policy_version: number
          priority: number
          provider: string
          selection_rules: Json
        }
        Insert: {
          abstract_operation: string
          created_at?: string
          enabled?: boolean
          failure_rollup?: Json
          id?: string
          policy_version?: number
          priority?: number
          provider: string
          selection_rules?: Json
        }
        Update: {
          abstract_operation?: string
          created_at?: string
          enabled?: boolean
          failure_rollup?: Json
          id?: string
          policy_version?: number
          priority?: number
          provider?: string
          selection_rules?: Json
        }
        Relationships: []
      }
      work_item: {
        Row: {
          attempt_count: number
          budget_cost_usd: number | null
          budget_wall_seconds: number | null
          capability_profile_id: string | null
          created_at: string
          id: string
          kind: string
          max_attempts: number
          mission_id: string
          spec: Json
          status: Database["orchestration"]["Enums"]["work_item_status"]
          tenant_id: string
          terminal_evidence: Json | null
          updated_at: string
        }
        Insert: {
          attempt_count?: number
          budget_cost_usd?: number | null
          budget_wall_seconds?: number | null
          capability_profile_id?: string | null
          created_at?: string
          id?: string
          kind: string
          max_attempts?: number
          mission_id: string
          spec?: Json
          status?: Database["orchestration"]["Enums"]["work_item_status"]
          tenant_id?: string
          terminal_evidence?: Json | null
          updated_at?: string
        }
        Update: {
          attempt_count?: number
          budget_cost_usd?: number | null
          budget_wall_seconds?: number | null
          capability_profile_id?: string | null
          created_at?: string
          id?: string
          kind?: string
          max_attempts?: number
          mission_id?: string
          spec?: Json
          status?: Database["orchestration"]["Enums"]["work_item_status"]
          tenant_id?: string
          terminal_evidence?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_item_capability_profile_fk"
            columns: ["capability_profile_id"]
            isOneToOne: false
            referencedRelation: "capability_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_item_kind_fkey"
            columns: ["kind"]
            isOneToOne: false
            referencedRelation: "work_item_kind"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "work_item_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "mission"
            referencedColumns: ["id"]
          },
        ]
      }
      work_item_artifact: {
        Row: {
          artifact_id: string
          role: string
          work_item_id: string
        }
        Insert: {
          artifact_id: string
          role: string
          work_item_id: string
        }
        Update: {
          artifact_id?: string
          role?: string
          work_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_item_artifact_artifact_id_fkey"
            columns: ["artifact_id"]
            isOneToOne: false
            referencedRelation: "artifact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_item_artifact_work_item_id_fkey"
            columns: ["work_item_id"]
            isOneToOne: false
            referencedRelation: "work_item"
            referencedColumns: ["id"]
          },
        ]
      }
      work_item_dependency: {
        Row: {
          created_at: string
          dependency_kind: string
          depends_on_id: string
          work_item_id: string
        }
        Insert: {
          created_at?: string
          dependency_kind?: string
          depends_on_id: string
          work_item_id: string
        }
        Update: {
          created_at?: string
          dependency_kind?: string
          depends_on_id?: string
          work_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_item_dependency_depends_on_id_fkey"
            columns: ["depends_on_id"]
            isOneToOne: false
            referencedRelation: "work_item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_item_dependency_work_item_id_fkey"
            columns: ["work_item_id"]
            isOneToOne: false
            referencedRelation: "work_item"
            referencedColumns: ["id"]
          },
        ]
      }
      work_item_kind: {
        Row: {
          code: string
          created_at: string
          description: string
        }
        Insert: {
          code: string
          created_at?: string
          description: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      attempt_outcome:
        | "succeeded"
        | "failed"
        | "timeout"
        | "cancelled"
        | "rejected"
      bucket_class:
        | "source_captures"
        | "candidate"
        | "accepted"
        | "ledger"
        | "published"
      mission_status:
        | "created"
        | "planning"
        | "running"
        | "paused"
        | "blocked"
        | "succeeded"
        | "failed"
        | "cancelled"
        | "superseded"
      work_item_status:
        | "pending"
        | "ready"
        | "running"
        | "blocked"
        | "succeeded"
        | "failed"
        | "cancelled"
        | "skipped"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      factory_artifact: {
        Row: {
          artifact_kind: string
          byte_size: number | null
          contains_sensitive_data: boolean
          content_digest: string
          created_at: string
          factory_artifact_id: string
          factory_episode_id: string
          media_type: string | null
          metadata: Json
          retention_class: string
          storage_uri: string
        }
        Insert: {
          artifact_kind: string
          byte_size?: number | null
          contains_sensitive_data?: boolean
          content_digest: string
          created_at?: string
          factory_artifact_id?: string
          factory_episode_id: string
          media_type?: string | null
          metadata?: Json
          retention_class?: string
          storage_uri: string
        }
        Update: {
          artifact_kind?: string
          byte_size?: number | null
          contains_sensitive_data?: boolean
          content_digest?: string
          created_at?: string
          factory_artifact_id?: string
          factory_episode_id?: string
          media_type?: string | null
          metadata?: Json
          retention_class?: string
          storage_uri?: string
        }
        Relationships: [
          {
            foreignKeyName: "factory_artifact_factory_episode_id_fkey"
            columns: ["factory_episode_id"]
            isOneToOne: false
            referencedRelation: "factory_episode"
            referencedColumns: ["factory_episode_id"]
          },
        ]
      }
      factory_assertion_result: {
        Row: {
          assertion_key: string
          assertion_kind: string
          created_at: string
          details: Json
          evaluator_version: string
          evidence_artifact_ids: string[]
          factory_assertion_result_id: string
          factory_episode_id: string
          hard_gate: boolean
          passed: boolean
          score: number | null
        }
        Insert: {
          assertion_key: string
          assertion_kind: string
          created_at?: string
          details?: Json
          evaluator_version: string
          evidence_artifact_ids?: string[]
          factory_assertion_result_id?: string
          factory_episode_id: string
          hard_gate?: boolean
          passed: boolean
          score?: number | null
        }
        Update: {
          assertion_key?: string
          assertion_kind?: string
          created_at?: string
          details?: Json
          evaluator_version?: string
          evidence_artifact_ids?: string[]
          factory_assertion_result_id?: string
          factory_episode_id?: string
          hard_gate?: boolean
          passed?: boolean
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "factory_assertion_result_factory_episode_id_fkey"
            columns: ["factory_episode_id"]
            isOneToOne: false
            referencedRelation: "factory_episode"
            referencedColumns: ["factory_episode_id"]
          },
        ]
      }
      factory_canary_result: {
        Row: {
          created_at: string
          factory_canary_result_id: string
          finished_at: string | null
          metrics: Json
          promotion_decision_id: string
          rollback_reason: string | null
          started_at: string
          status: string
          traffic_fraction: number
        }
        Insert: {
          created_at?: string
          factory_canary_result_id?: string
          finished_at?: string | null
          metrics?: Json
          promotion_decision_id: string
          rollback_reason?: string | null
          started_at: string
          status?: string
          traffic_fraction: number
        }
        Update: {
          created_at?: string
          factory_canary_result_id?: string
          finished_at?: string | null
          metrics?: Json
          promotion_decision_id?: string
          rollback_reason?: string | null
          started_at?: string
          status?: string
          traffic_fraction?: number
        }
        Relationships: [
          {
            foreignKeyName: "factory_canary_result_promotion_decision_id_fkey"
            columns: ["promotion_decision_id"]
            isOneToOne: false
            referencedRelation: "factory_promotion_decision"
            referencedColumns: ["factory_promotion_decision_id"]
          },
        ]
      }
      factory_candidate: {
        Row: {
          candidate_kind: string
          component_versions: Json
          content_digest: string
          created_at: string
          factory_candidate_id: string
          mutation_surface: Json
          parent_candidate_id: string | null
          proposer: string
          rationale: string
          source_revision: string
          status: string
        }
        Insert: {
          candidate_kind: string
          component_versions: Json
          content_digest: string
          created_at?: string
          factory_candidate_id?: string
          mutation_surface: Json
          parent_candidate_id?: string | null
          proposer: string
          rationale: string
          source_revision: string
          status?: string
        }
        Update: {
          candidate_kind?: string
          component_versions?: Json
          content_digest?: string
          created_at?: string
          factory_candidate_id?: string
          mutation_surface?: Json
          parent_candidate_id?: string | null
          proposer?: string
          rationale?: string
          source_revision?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "factory_candidate_parent_candidate_id_fkey"
            columns: ["parent_candidate_id"]
            isOneToOne: false
            referencedRelation: "factory_candidate"
            referencedColumns: ["factory_candidate_id"]
          },
        ]
      }
      factory_component_version: {
        Row: {
          component_kind: string
          component_version_id: string
          content_digest: string
          created_at: string
          metadata: Json
          slug: string
          source_revision: string
          storage_uri: string | null
          version: string
        }
        Insert: {
          component_kind: string
          component_version_id?: string
          content_digest: string
          created_at?: string
          metadata?: Json
          slug: string
          source_revision: string
          storage_uri?: string | null
          version: string
        }
        Update: {
          component_kind?: string
          component_version_id?: string
          content_digest?: string
          created_at?: string
          metadata?: Json
          slug?: string
          source_revision?: string
          storage_uri?: string | null
          version?: string
        }
        Relationships: []
      }
      factory_environment_version: {
        Row: {
          created_at: string
          environment_version_id: string
          image_digest: string
          protocol_version: string
          reward_contract_version: string
          slug: string
          spec: Json
          status: string
          task_kind: string
          verifier_bundle_digest: string
          version: string
        }
        Insert: {
          created_at?: string
          environment_version_id?: string
          image_digest: string
          protocol_version?: string
          reward_contract_version: string
          slug: string
          spec: Json
          status?: string
          task_kind: string
          verifier_bundle_digest: string
          version: string
        }
        Update: {
          created_at?: string
          environment_version_id?: string
          image_digest?: string
          protocol_version?: string
          reward_contract_version?: string
          slug?: string
          spec?: Json
          status?: string
          task_kind?: string
          verifier_bundle_digest?: string
          version?: string
        }
        Relationships: []
      }
      factory_episode: {
        Row: {
          attempt_id: string | null
          cost_usd: number
          created_at: string
          duration_ms: number | null
          environment_version_id: string
          eve_session_id: string | null
          factory_candidate_id: string
          factory_episode_id: string
          factory_task_id: string
          finished_at: string | null
          idempotency_key: string
          metadata: Json
          model_tokens: number
          sandbox_provider: string | null
          sandbox_session_id: string | null
          seed: number
          source_revision: string
          started_at: string | null
          status: string
          terminal_state: string | null
          workflow_run_id: string | null
        }
        Insert: {
          attempt_id?: string | null
          cost_usd?: number
          created_at?: string
          duration_ms?: number | null
          environment_version_id: string
          eve_session_id?: string | null
          factory_candidate_id: string
          factory_episode_id?: string
          factory_task_id: string
          finished_at?: string | null
          idempotency_key: string
          metadata?: Json
          model_tokens?: number
          sandbox_provider?: string | null
          sandbox_session_id?: string | null
          seed: number
          source_revision: string
          started_at?: string | null
          status?: string
          terminal_state?: string | null
          workflow_run_id?: string | null
        }
        Update: {
          attempt_id?: string | null
          cost_usd?: number
          created_at?: string
          duration_ms?: number | null
          environment_version_id?: string
          eve_session_id?: string | null
          factory_candidate_id?: string
          factory_episode_id?: string
          factory_task_id?: string
          finished_at?: string | null
          idempotency_key?: string
          metadata?: Json
          model_tokens?: number
          sandbox_provider?: string | null
          sandbox_session_id?: string | null
          seed?: number
          source_revision?: string
          started_at?: string | null
          status?: string
          terminal_state?: string | null
          workflow_run_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "factory_episode_environment_version_id_fkey"
            columns: ["environment_version_id"]
            isOneToOne: false
            referencedRelation: "factory_environment_version"
            referencedColumns: ["environment_version_id"]
          },
          {
            foreignKeyName: "factory_episode_factory_candidate_id_fkey"
            columns: ["factory_candidate_id"]
            isOneToOne: false
            referencedRelation: "factory_candidate"
            referencedColumns: ["factory_candidate_id"]
          },
          {
            foreignKeyName: "factory_episode_factory_task_id_fkey"
            columns: ["factory_task_id"]
            isOneToOne: false
            referencedRelation: "factory_task"
            referencedColumns: ["factory_task_id"]
          },
        ]
      }
      factory_evolution_proposal: {
        Row: {
          budget: Json
          created_at: string
          evaluation_plan: Json
          factory_evolution_proposal_id: string
          failure_cluster_id: string | null
          hypothesis: string
          hypothesized_component_kind: string
          mutation_surface: Json
          predicted_impact: Json
          proposed_candidate_id: string | null
          risks: Json
          rollback_component_version_id: string | null
          status: string
          stop_condition: Json
        }
        Insert: {
          budget: Json
          created_at?: string
          evaluation_plan: Json
          factory_evolution_proposal_id?: string
          failure_cluster_id?: string | null
          hypothesis: string
          hypothesized_component_kind: string
          mutation_surface: Json
          predicted_impact: Json
          proposed_candidate_id?: string | null
          risks: Json
          rollback_component_version_id?: string | null
          status?: string
          stop_condition: Json
        }
        Update: {
          budget?: Json
          created_at?: string
          evaluation_plan?: Json
          factory_evolution_proposal_id?: string
          failure_cluster_id?: string | null
          hypothesis?: string
          hypothesized_component_kind?: string
          mutation_surface?: Json
          predicted_impact?: Json
          proposed_candidate_id?: string | null
          risks?: Json
          rollback_component_version_id?: string | null
          status?: string
          stop_condition?: Json
        }
        Relationships: [
          {
            foreignKeyName: "factory_evolution_proposal_failure_cluster_id_fkey"
            columns: ["failure_cluster_id"]
            isOneToOne: false
            referencedRelation: "factory_failure_cluster"
            referencedColumns: ["factory_failure_cluster_id"]
          },
          {
            foreignKeyName: "factory_evolution_proposal_proposed_candidate_id_fkey"
            columns: ["proposed_candidate_id"]
            isOneToOne: false
            referencedRelation: "factory_candidate"
            referencedColumns: ["factory_candidate_id"]
          },
          {
            foreignKeyName: "factory_evolution_proposal_rollback_component_version_id_fkey"
            columns: ["rollback_component_version_id"]
            isOneToOne: false
            referencedRelation: "factory_component_version"
            referencedColumns: ["component_version_id"]
          },
        ]
      }
      factory_experiment: {
        Row: {
          created_at: string
          evolution_proposal_id: string
          experiment_version: string
          factory_experiment_id: string
          finished_at: string | null
          policy: Json
          split_manifest_digest: string
          started_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          evolution_proposal_id: string
          experiment_version: string
          factory_experiment_id?: string
          finished_at?: string | null
          policy: Json
          split_manifest_digest: string
          started_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          evolution_proposal_id?: string
          experiment_version?: string
          factory_experiment_id?: string
          finished_at?: string | null
          policy?: Json
          split_manifest_digest?: string
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "factory_experiment_evolution_proposal_id_fkey"
            columns: ["evolution_proposal_id"]
            isOneToOne: false
            referencedRelation: "factory_evolution_proposal"
            referencedColumns: ["factory_evolution_proposal_id"]
          },
        ]
      }
      factory_experiment_arm: {
        Row: {
          aggregate_metrics: Json
          arm_name: string
          assignment_probability: number | null
          created_at: string
          episode_ids: string[]
          factory_candidate_id: string
          factory_experiment_arm_id: string
          factory_experiment_id: string
        }
        Insert: {
          aggregate_metrics?: Json
          arm_name: string
          assignment_probability?: number | null
          created_at?: string
          episode_ids?: string[]
          factory_candidate_id: string
          factory_experiment_arm_id?: string
          factory_experiment_id: string
        }
        Update: {
          aggregate_metrics?: Json
          arm_name?: string
          assignment_probability?: number | null
          created_at?: string
          episode_ids?: string[]
          factory_candidate_id?: string
          factory_experiment_arm_id?: string
          factory_experiment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "factory_experiment_arm_factory_candidate_id_fkey"
            columns: ["factory_candidate_id"]
            isOneToOne: false
            referencedRelation: "factory_candidate"
            referencedColumns: ["factory_candidate_id"]
          },
          {
            foreignKeyName: "factory_experiment_arm_factory_experiment_id_fkey"
            columns: ["factory_experiment_id"]
            isOneToOne: false
            referencedRelation: "factory_experiment"
            referencedColumns: ["factory_experiment_id"]
          },
        ]
      }
      factory_failure_cluster: {
        Row: {
          affected_episode_ids: string[]
          created_at: string
          evidence: Json
          factory_failure_cluster_id: string
          severity: string
          signature: string
          status: string
          taxonomy_code: string
          title: string
          updated_at: string
        }
        Insert: {
          affected_episode_ids?: string[]
          created_at?: string
          evidence: Json
          factory_failure_cluster_id?: string
          severity: string
          signature: string
          status?: string
          taxonomy_code: string
          title: string
          updated_at?: string
        }
        Update: {
          affected_episode_ids?: string[]
          created_at?: string
          evidence?: Json
          factory_failure_cluster_id?: string
          severity?: string
          signature?: string
          status?: string
          taxonomy_code?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      factory_promotion_decision: {
        Row: {
          baseline_candidate_id: string
          candidate_id: string
          created_at: string
          decided_by: string
          decision: string
          evidence: Json
          factory_experiment_id: string
          factory_promotion_decision_id: string
          promotion_policy_version: string
          reasons: string[]
          rollback_component_version_id: string | null
        }
        Insert: {
          baseline_candidate_id: string
          candidate_id: string
          created_at?: string
          decided_by: string
          decision: string
          evidence: Json
          factory_experiment_id: string
          factory_promotion_decision_id?: string
          promotion_policy_version: string
          reasons?: string[]
          rollback_component_version_id?: string | null
        }
        Update: {
          baseline_candidate_id?: string
          candidate_id?: string
          created_at?: string
          decided_by?: string
          decision?: string
          evidence?: Json
          factory_experiment_id?: string
          factory_promotion_decision_id?: string
          promotion_policy_version?: string
          reasons?: string[]
          rollback_component_version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "factory_promotion_decision_baseline_candidate_id_fkey"
            columns: ["baseline_candidate_id"]
            isOneToOne: false
            referencedRelation: "factory_candidate"
            referencedColumns: ["factory_candidate_id"]
          },
          {
            foreignKeyName: "factory_promotion_decision_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "factory_candidate"
            referencedColumns: ["factory_candidate_id"]
          },
          {
            foreignKeyName: "factory_promotion_decision_factory_experiment_id_fkey"
            columns: ["factory_experiment_id"]
            isOneToOne: false
            referencedRelation: "factory_experiment"
            referencedColumns: ["factory_experiment_id"]
          },
          {
            foreignKeyName: "factory_promotion_decision_rollback_component_version_id_fkey"
            columns: ["rollback_component_version_id"]
            isOneToOne: false
            referencedRelation: "factory_component_version"
            referencedColumns: ["component_version_id"]
          },
        ]
      }
      factory_runtime_event: {
        Row: {
          agent_name: string
          agent_node_id: string | null
          call_id: string | null
          channel_kind: string | null
          emitted_at: string
          eve_event_id: string
          eve_session_id: string
          event_data: Json | null
          event_meta: Json
          event_ordinal: number
          event_type: string
          factory_episode_id: string
          ingested_at: string
          issue_number: number | null
          payload_byte_size: number
          payload_sha256: string
          payload_truncated: boolean
          redaction_version: string
          repository: string | null
          retention_until: string
          sensitivity_class: string
          subagent_name: string | null
        }
        Insert: {
          agent_name: string
          agent_node_id?: string | null
          call_id?: string | null
          channel_kind?: string | null
          emitted_at: string
          eve_event_id: string
          eve_session_id: string
          event_data?: Json | null
          event_meta: Json
          event_ordinal: number
          event_type: string
          factory_episode_id: string
          ingested_at?: string
          issue_number?: number | null
          payload_byte_size: number
          payload_sha256: string
          payload_truncated?: boolean
          redaction_version?: string
          repository?: string | null
          retention_until?: string
          sensitivity_class?: string
          subagent_name?: string | null
        }
        Update: {
          agent_name?: string
          agent_node_id?: string | null
          call_id?: string | null
          channel_kind?: string | null
          emitted_at?: string
          eve_event_id?: string
          eve_session_id?: string
          event_data?: Json | null
          event_meta?: Json
          event_ordinal?: number
          event_type?: string
          factory_episode_id?: string
          ingested_at?: string
          issue_number?: number | null
          payload_byte_size?: number
          payload_sha256?: string
          payload_truncated?: boolean
          redaction_version?: string
          repository?: string | null
          retention_until?: string
          sensitivity_class?: string
          subagent_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "factory_runtime_event_factory_episode_id_fkey"
            columns: ["factory_episode_id"]
            isOneToOne: false
            referencedRelation: "factory_episode"
            referencedColumns: ["factory_episode_id"]
          },
        ]
      }
      factory_score_vector: {
        Row: {
          created_at: string
          eligible_for_promotion: boolean
          factory_episode_id: string
          factory_score_vector_id: string
          ineligibility_reasons: string[]
          reward_contract_version: string
          vector: Json
          weighted_score: number | null
        }
        Insert: {
          created_at?: string
          eligible_for_promotion?: boolean
          factory_episode_id: string
          factory_score_vector_id?: string
          ineligibility_reasons?: string[]
          reward_contract_version: string
          vector: Json
          weighted_score?: number | null
        }
        Update: {
          created_at?: string
          eligible_for_promotion?: boolean
          factory_episode_id?: string
          factory_score_vector_id?: string
          ineligibility_reasons?: string[]
          reward_contract_version?: string
          vector?: Json
          weighted_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "factory_score_vector_factory_episode_id_fkey"
            columns: ["factory_episode_id"]
            isOneToOne: false
            referencedRelation: "factory_episode"
            referencedColumns: ["factory_episode_id"]
          },
        ]
      }
      factory_task: {
        Row: {
          challenge_id: string | null
          created_at: string
          data_split: string
          factory_task_id: string
          parent_task_id: string | null
          risk_tier: string
          slug: string
          spec: Json
          spec_digest: string
          status: string
          task_kind: string
          version: string
        }
        Insert: {
          challenge_id?: string | null
          created_at?: string
          data_split: string
          factory_task_id?: string
          parent_task_id?: string | null
          risk_tier?: string
          slug: string
          spec: Json
          spec_digest: string
          status?: string
          task_kind: string
          version: string
        }
        Update: {
          challenge_id?: string | null
          created_at?: string
          data_split?: string
          factory_task_id?: string
          parent_task_id?: string | null
          risk_tier?: string
          slug?: string
          spec?: Json
          spec_digest?: string
          status?: string
          task_kind?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "factory_task_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "factory_task"
            referencedColumns: ["factory_task_id"]
          },
        ]
      }
      factory_trace_span_ref: {
        Row: {
          agent_role: string | null
          artifact_id: string | null
          attributes: Json
          factory_episode_id: string
          factory_trace_span_ref_id: string
          finished_at: string | null
          operation_name: string
          parent_span_id: string | null
          span_id: string
          started_at: string | null
          trace_id: string
        }
        Insert: {
          agent_role?: string | null
          artifact_id?: string | null
          attributes?: Json
          factory_episode_id: string
          factory_trace_span_ref_id?: string
          finished_at?: string | null
          operation_name: string
          parent_span_id?: string | null
          span_id: string
          started_at?: string | null
          trace_id: string
        }
        Update: {
          agent_role?: string | null
          artifact_id?: string | null
          attributes?: Json
          factory_episode_id?: string
          factory_trace_span_ref_id?: string
          finished_at?: string | null
          operation_name?: string
          parent_span_id?: string | null
          span_id?: string
          started_at?: string | null
          trace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "factory_trace_span_ref_artifact_id_fkey"
            columns: ["artifact_id"]
            isOneToOne: false
            referencedRelation: "factory_artifact"
            referencedColumns: ["factory_artifact_id"]
          },
          {
            foreignKeyName: "factory_trace_span_ref_factory_episode_id_fkey"
            columns: ["factory_episode_id"]
            isOneToOne: false
            referencedRelation: "factory_episode"
            referencedColumns: ["factory_episode_id"]
          },
        ]
      }
      research_application_domain: {
        Row: {
          active: boolean
          description: string
          domain_code: string
          label: string
          parent_domain_code: string | null
          sort_order: number
        }
        Insert: {
          active?: boolean
          description: string
          domain_code: string
          label: string
          parent_domain_code?: string | null
          sort_order?: number
        }
        Update: {
          active?: boolean
          description?: string
          domain_code?: string
          label?: string
          parent_domain_code?: string | null
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "research_application_domain_parent_domain_code_fkey"
            columns: ["parent_domain_code"]
            isOneToOne: false
            referencedRelation: "research_application_domain"
            referencedColumns: ["domain_code"]
          },
        ]
      }
      research_category_definition: {
        Row: {
          category_code: Database["public"]["Enums"]["research_engineering_category_code"]
          description: string
          example_topics: string[]
          exclusion_criteria: string[]
          inclusion_criteria: string[]
          label: string
          sort_order: number
          taxonomy_version_id: string
        }
        Insert: {
          category_code: Database["public"]["Enums"]["research_engineering_category_code"]
          description: string
          example_topics?: string[]
          exclusion_criteria?: string[]
          inclusion_criteria?: string[]
          label: string
          sort_order: number
          taxonomy_version_id: string
        }
        Update: {
          category_code?: Database["public"]["Enums"]["research_engineering_category_code"]
          description?: string
          example_topics?: string[]
          exclusion_criteria?: string[]
          inclusion_criteria?: string[]
          label?: string
          sort_order?: number
          taxonomy_version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_category_definition_taxonomy_version_id_fkey"
            columns: ["taxonomy_version_id"]
            isOneToOne: false
            referencedRelation: "research_taxonomy_version"
            referencedColumns: ["taxonomy_version_id"]
          },
        ]
      }
      research_entity_candidate: {
        Row: {
          analysis_id: string
          candidate_id: string
          canonical_url: string | null
          confidence: number
          entity_kind: Database["public"]["Enums"]["research_entity_kind"]
          evidence_ids: string[]
          name: string
          normalized_name: string
          organization_name: string | null
          relationship_to_video: string
          verification_status: Database["public"]["Enums"]["research_verification_status"]
        }
        Insert: {
          analysis_id: string
          candidate_id?: string
          canonical_url?: string | null
          confidence: number
          entity_kind: Database["public"]["Enums"]["research_entity_kind"]
          evidence_ids?: string[]
          name: string
          normalized_name: string
          organization_name?: string | null
          relationship_to_video: string
          verification_status: Database["public"]["Enums"]["research_verification_status"]
        }
        Update: {
          analysis_id?: string
          candidate_id?: string
          canonical_url?: string | null
          confidence?: number
          entity_kind?: Database["public"]["Enums"]["research_entity_kind"]
          evidence_ids?: string[]
          name?: string
          normalized_name?: string
          organization_name?: string | null
          relationship_to_video?: string
          verification_status?: Database["public"]["Enums"]["research_verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "research_entity_candidate_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "research_video_analysis"
            referencedColumns: ["analysis_id"]
          },
        ]
      }
      research_evidence_anchor: {
        Row: {
          analysis_id: string
          end_character: number | null
          end_seconds: number | null
          evidence_id: string
          short_excerpt: string
          source_kind: Database["public"]["Enums"]["research_evidence_source_kind"]
          source_url: string | null
          start_character: number | null
          start_seconds: number | null
          supports: string
          transcript_segment: string | null
        }
        Insert: {
          analysis_id: string
          end_character?: number | null
          end_seconds?: number | null
          evidence_id?: string
          short_excerpt: string
          source_kind: Database["public"]["Enums"]["research_evidence_source_kind"]
          source_url?: string | null
          start_character?: number | null
          start_seconds?: number | null
          supports: string
          transcript_segment?: string | null
        }
        Update: {
          analysis_id?: string
          end_character?: number | null
          end_seconds?: number | null
          evidence_id?: string
          short_excerpt?: string
          source_kind?: Database["public"]["Enums"]["research_evidence_source_kind"]
          source_url?: string | null
          start_character?: number | null
          start_seconds?: number | null
          supports?: string
          transcript_segment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_evidence_anchor_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "research_video_analysis"
            referencedColumns: ["analysis_id"]
          },
        ]
      }
      research_ingestion_intent: {
        Row: {
          applied_at: string | null
          content_sha256: string
          created_at: string
          error_detail: string | null
          idempotency_key: string
          intent_id: string
          rejected_at: string | null
          run_id: string
          schema_version: string
          status: Database["public"]["Enums"]["research_intent_status"]
          storage_bucket: string
          storage_path: string
          validated_at: string | null
          video_id: string
        }
        Insert: {
          applied_at?: string | null
          content_sha256: string
          created_at?: string
          error_detail?: string | null
          idempotency_key: string
          intent_id?: string
          rejected_at?: string | null
          run_id: string
          schema_version: string
          status?: Database["public"]["Enums"]["research_intent_status"]
          storage_bucket: string
          storage_path: string
          validated_at?: string | null
          video_id: string
        }
        Update: {
          applied_at?: string | null
          content_sha256?: string
          created_at?: string
          error_detail?: string | null
          idempotency_key?: string
          intent_id?: string
          rejected_at?: string | null
          run_id?: string
          schema_version?: string
          status?: Database["public"]["Enums"]["research_intent_status"]
          storage_bucket?: string
          storage_path?: string
          validated_at?: string | null
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_ingestion_intent_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: true
            referencedRelation: "research_pre_research_run"
            referencedColumns: ["run_id"]
          },
          {
            foreignKeyName: "research_ingestion_intent_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "research_starter_videos"
            referencedColumns: ["video_id"]
          },
        ]
      }
      research_ingestion_intent_event: {
        Row: {
          affected_key: string | null
          affected_table: string | null
          created_at: string
          error_detail: string | null
          event_id: string
          intent_id: string
          operation_index: number
          operation_kind: string
          status: Database["public"]["Enums"]["research_intent_event_status"]
        }
        Insert: {
          affected_key?: string | null
          affected_table?: string | null
          created_at?: string
          error_detail?: string | null
          event_id?: string
          intent_id: string
          operation_index: number
          operation_kind: string
          status: Database["public"]["Enums"]["research_intent_event_status"]
        }
        Update: {
          affected_key?: string | null
          affected_table?: string | null
          created_at?: string
          error_detail?: string | null
          event_id?: string
          intent_id?: string
          operation_index?: number
          operation_kind?: string
          status?: Database["public"]["Enums"]["research_intent_event_status"]
        }
        Relationships: [
          {
            foreignKeyName: "research_ingestion_intent_event_intent_id_fkey"
            columns: ["intent_id"]
            isOneToOne: false
            referencedRelation: "research_ingestion_intent"
            referencedColumns: ["intent_id"]
          },
        ]
      }
      research_organization_candidate: {
        Row: {
          analysis_id: string
          authoritative_summary: string
          canonical_name: string
          confidence: number
          current_status: string
          evidence_ids: string[]
          featured_rank: number
          generated_at: string
          is_primary_featured: boolean
          normalized_name: string
          official_url: string
          organization_candidate_id: string
          organization_scope: Database["public"]["Enums"]["research_organization_scope"]
          ownership_changed_since_video: boolean
          parent_canonical_url: string | null
          parent_name: string | null
          primary_domain_code: Database["public"]["Enums"]["research_organization_domain_code"]
          relationship_roles: Database["public"]["Enums"]["research_video_organization_role"][]
          relationship_to_implementation: string
          secondary_domain_codes: Database["public"]["Enums"]["research_organization_domain_code"][]
          status_as_of: string
          video_id: string
          video_time_name: string | null
          video_time_parent_name: string | null
        }
        Insert: {
          analysis_id: string
          authoritative_summary: string
          canonical_name: string
          confidence: number
          current_status: string
          evidence_ids?: string[]
          featured_rank: number
          generated_at?: string
          is_primary_featured?: boolean
          normalized_name: string
          official_url: string
          organization_candidate_id?: string
          organization_scope: Database["public"]["Enums"]["research_organization_scope"]
          ownership_changed_since_video?: boolean
          parent_canonical_url?: string | null
          parent_name?: string | null
          primary_domain_code: Database["public"]["Enums"]["research_organization_domain_code"]
          relationship_roles: Database["public"]["Enums"]["research_video_organization_role"][]
          relationship_to_implementation: string
          secondary_domain_codes?: Database["public"]["Enums"]["research_organization_domain_code"][]
          status_as_of: string
          video_id: string
          video_time_name?: string | null
          video_time_parent_name?: string | null
        }
        Update: {
          analysis_id?: string
          authoritative_summary?: string
          canonical_name?: string
          confidence?: number
          current_status?: string
          evidence_ids?: string[]
          featured_rank?: number
          generated_at?: string
          is_primary_featured?: boolean
          normalized_name?: string
          official_url?: string
          organization_candidate_id?: string
          organization_scope?: Database["public"]["Enums"]["research_organization_scope"]
          ownership_changed_since_video?: boolean
          parent_canonical_url?: string | null
          parent_name?: string | null
          primary_domain_code?: Database["public"]["Enums"]["research_organization_domain_code"]
          relationship_roles?: Database["public"]["Enums"]["research_video_organization_role"][]
          relationship_to_implementation?: string
          secondary_domain_codes?: Database["public"]["Enums"]["research_organization_domain_code"][]
          status_as_of?: string
          video_id?: string
          video_time_name?: string | null
          video_time_parent_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_organization_candidate_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "research_video_analysis"
            referencedColumns: ["analysis_id"]
          },
          {
            foreignKeyName: "research_organization_candidate_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "research_starter_videos"
            referencedColumns: ["video_id"]
          },
        ]
      }
      research_organization_domain_definition: {
        Row: {
          active: boolean
          definition_version: string
          description: string
          domain_code: Database["public"]["Enums"]["research_organization_domain_code"]
          example_organizations: string[]
          exclusion_criteria: string[]
          inclusion_criteria: string[]
          label: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          definition_version?: string
          description: string
          domain_code: Database["public"]["Enums"]["research_organization_domain_code"]
          example_organizations?: string[]
          exclusion_criteria?: string[]
          inclusion_criteria?: string[]
          label: string
          sort_order: number
        }
        Update: {
          active?: boolean
          definition_version?: string
          description?: string
          domain_code?: Database["public"]["Enums"]["research_organization_domain_code"]
          example_organizations?: string[]
          exclusion_criteria?: string[]
          inclusion_criteria?: string[]
          label?: string
          sort_order?: number
        }
        Relationships: []
      }
      research_organization_source: {
        Row: {
          authority_tier: string
          evidence_id: string | null
          is_required_core_source: boolean
          normalized_url: string
          organization_candidate_id: string
          organization_source_id: string
          publicly_retrievable: boolean
          publisher: string
          retrieved_at: string
          source_published_at: string | null
          source_rank: number
          source_role: string
          supports: Json
          title: string
          url: string
          verification_status: Database["public"]["Enums"]["research_verification_status"]
        }
        Insert: {
          authority_tier: string
          evidence_id?: string | null
          is_required_core_source?: boolean
          normalized_url: string
          organization_candidate_id: string
          organization_source_id?: string
          publicly_retrievable: boolean
          publisher: string
          retrieved_at: string
          source_published_at?: string | null
          source_rank: number
          source_role: string
          supports?: Json
          title: string
          url: string
          verification_status: Database["public"]["Enums"]["research_verification_status"]
        }
        Update: {
          authority_tier?: string
          evidence_id?: string | null
          is_required_core_source?: boolean
          normalized_url?: string
          organization_candidate_id?: string
          organization_source_id?: string
          publicly_retrievable?: boolean
          publisher?: string
          retrieved_at?: string
          source_published_at?: string | null
          source_rank?: number
          source_role?: string
          supports?: Json
          title?: string
          url?: string
          verification_status?: Database["public"]["Enums"]["research_verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "research_organization_source_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: false
            referencedRelation: "research_evidence_anchor"
            referencedColumns: ["evidence_id"]
          },
          {
            foreignKeyName: "research_organization_source_organization_candidate_id_fkey"
            columns: ["organization_candidate_id"]
            isOneToOne: false
            referencedRelation: "research_organization_candidate"
            referencedColumns: ["organization_candidate_id"]
          },
        ]
      }
      research_pre_research_artifact: {
        Row: {
          artifact_id: string
          artifact_kind: string
          byte_count: number
          content_sha256: string
          created_at: string
          intent_id: string | null
          run_id: string
          schema_version: string
          storage_bucket: string
          storage_path: string
        }
        Insert: {
          artifact_id?: string
          artifact_kind: string
          byte_count: number
          content_sha256: string
          created_at?: string
          intent_id?: string | null
          run_id: string
          schema_version: string
          storage_bucket: string
          storage_path: string
        }
        Update: {
          artifact_id?: string
          artifact_kind?: string
          byte_count?: number
          content_sha256?: string
          created_at?: string
          intent_id?: string | null
          run_id?: string
          schema_version?: string
          storage_bucket?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_pre_research_artifact_intent_id_fkey"
            columns: ["intent_id"]
            isOneToOne: false
            referencedRelation: "research_ingestion_intent"
            referencedColumns: ["intent_id"]
          },
          {
            foreignKeyName: "research_pre_research_artifact_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "research_pre_research_run"
            referencedColumns: ["run_id"]
          },
        ]
      }
      research_pre_research_run: {
        Row: {
          attempt: number
          completed_at: string | null
          created_at: string
          error_code: string | null
          error_detail: string | null
          intent_path: string | null
          intent_sha256: string | null
          lease_expires_at: string | null
          lease_token: string | null
          model_id: string
          packet_schema_version: string
          packet_sha256: string | null
          packet_storage_prefix: string | null
          prompt_bundle_version: string
          research_as_of: string
          research_completed_at: string | null
          research_session_id: string | null
          run_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["research_pre_research_run_status"]
          synthesis_session_id: string | null
          synthesis_started_at: string | null
          taxonomy_version_id: string
          transcript_sha256: string
          updated_at: string
          video_id: string
          workflow_session_id: string | null
        }
        Insert: {
          attempt?: number
          completed_at?: string | null
          created_at?: string
          error_code?: string | null
          error_detail?: string | null
          intent_path?: string | null
          intent_sha256?: string | null
          lease_expires_at?: string | null
          lease_token?: string | null
          model_id: string
          packet_schema_version?: string
          packet_sha256?: string | null
          packet_storage_prefix?: string | null
          prompt_bundle_version: string
          research_as_of?: string
          research_completed_at?: string | null
          research_session_id?: string | null
          run_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["research_pre_research_run_status"]
          synthesis_session_id?: string | null
          synthesis_started_at?: string | null
          taxonomy_version_id: string
          transcript_sha256: string
          updated_at?: string
          video_id: string
          workflow_session_id?: string | null
        }
        Update: {
          attempt?: number
          completed_at?: string | null
          created_at?: string
          error_code?: string | null
          error_detail?: string | null
          intent_path?: string | null
          intent_sha256?: string | null
          lease_expires_at?: string | null
          lease_token?: string | null
          model_id?: string
          packet_schema_version?: string
          packet_sha256?: string | null
          packet_storage_prefix?: string | null
          prompt_bundle_version?: string
          research_as_of?: string
          research_completed_at?: string | null
          research_session_id?: string | null
          run_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["research_pre_research_run_status"]
          synthesis_session_id?: string | null
          synthesis_started_at?: string | null
          taxonomy_version_id?: string
          transcript_sha256?: string
          updated_at?: string
          video_id?: string
          workflow_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_pre_research_run_taxonomy_version_id_fkey"
            columns: ["taxonomy_version_id"]
            isOneToOne: false
            referencedRelation: "research_taxonomy_version"
            referencedColumns: ["taxonomy_version_id"]
          },
          {
            foreignKeyName: "research_pre_research_run_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "research_starter_videos"
            referencedColumns: ["video_id"]
          },
        ]
      }
      research_pre_research_session: {
        Row: {
          attempt: number
          completed_at: string | null
          error_code: string | null
          error_detail: string | null
          eve_session_id: string
          phase: string
          pre_research_session_id: string
          result_summary: Json | null
          run_id: string
          started_at: string
          status: string
        }
        Insert: {
          attempt: number
          completed_at?: string | null
          error_code?: string | null
          error_detail?: string | null
          eve_session_id: string
          phase: string
          pre_research_session_id?: string
          result_summary?: Json | null
          run_id: string
          started_at?: string
          status: string
        }
        Update: {
          attempt?: number
          completed_at?: string | null
          error_code?: string | null
          error_detail?: string | null
          eve_session_id?: string
          phase?: string
          pre_research_session_id?: string
          result_summary?: Json | null
          run_id?: string
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_pre_research_session_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "research_pre_research_run"
            referencedColumns: ["run_id"]
          },
        ]
      }
      research_pre_research_stage_execution: {
        Row: {
          attempt_count: number
          completed_artifact_sha256s: Json
          completed_at: string | null
          input_manifest_bucket: string | null
          input_manifest_path: string | null
          input_sha256: string | null
          last_error_code: string | null
          last_error_detail: string | null
          lease_expires_at: string | null
          lease_owner: string | null
          lease_token_hash: string | null
          model_id: string
          output_artifact_kinds: string[]
          prompt_bundle_version: string
          retry_after: string | null
          run_id: string
          stage: string
          stage_execution_id: string
          started_at: string | null
          status: string
          updated_at: string
          usage_summary: Json
        }
        Insert: {
          attempt_count?: number
          completed_artifact_sha256s?: Json
          completed_at?: string | null
          input_manifest_bucket?: string | null
          input_manifest_path?: string | null
          input_sha256?: string | null
          last_error_code?: string | null
          last_error_detail?: string | null
          lease_expires_at?: string | null
          lease_owner?: string | null
          lease_token_hash?: string | null
          model_id?: string
          output_artifact_kinds?: string[]
          prompt_bundle_version?: string
          retry_after?: string | null
          run_id: string
          stage: string
          stage_execution_id?: string
          started_at?: string | null
          status?: string
          updated_at?: string
          usage_summary?: Json
        }
        Update: {
          attempt_count?: number
          completed_artifact_sha256s?: Json
          completed_at?: string | null
          input_manifest_bucket?: string | null
          input_manifest_path?: string | null
          input_sha256?: string | null
          last_error_code?: string | null
          last_error_detail?: string | null
          lease_expires_at?: string | null
          lease_owner?: string | null
          lease_token_hash?: string | null
          model_id?: string
          output_artifact_kinds?: string[]
          prompt_bundle_version?: string
          retry_after?: string | null
          run_id?: string
          stage?: string
          stage_execution_id?: string
          started_at?: string | null
          status?: string
          updated_at?: string
          usage_summary?: Json
        }
        Relationships: [
          {
            foreignKeyName: "research_pre_research_stage_execution_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "research_pre_research_run"
            referencedColumns: ["run_id"]
          },
        ]
      }
      research_pre_research_video_state: {
        Row: {
          created_at: string
          duration_seconds: number | null
          eligibility_status: string
          evaluated_at: string | null
          finished_intent_id: string | null
          finished_transcript_sha256: string | null
          ineligibility_reasons: string[]
          latest_run_id: string | null
          pipeline_status: string
          pre_research_pipeline_finished: boolean
          pre_research_pipeline_finished_at: string | null
          transcript_object_exists: boolean
          transcript_sha256: string | null
          updated_at: string
          video_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          eligibility_status?: string
          evaluated_at?: string | null
          finished_intent_id?: string | null
          finished_transcript_sha256?: string | null
          ineligibility_reasons?: string[]
          latest_run_id?: string | null
          pipeline_status?: string
          pre_research_pipeline_finished?: boolean
          pre_research_pipeline_finished_at?: string | null
          transcript_object_exists?: boolean
          transcript_sha256?: string | null
          updated_at?: string
          video_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          eligibility_status?: string
          evaluated_at?: string | null
          finished_intent_id?: string | null
          finished_transcript_sha256?: string | null
          ineligibility_reasons?: string[]
          latest_run_id?: string | null
          pipeline_status?: string
          pre_research_pipeline_finished?: boolean
          pre_research_pipeline_finished_at?: string | null
          transcript_object_exists?: boolean
          transcript_sha256?: string | null
          updated_at?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_pre_research_video_state_finished_intent_id_fkey"
            columns: ["finished_intent_id"]
            isOneToOne: false
            referencedRelation: "research_ingestion_intent"
            referencedColumns: ["intent_id"]
          },
          {
            foreignKeyName: "research_pre_research_video_state_latest_run_id_fkey"
            columns: ["latest_run_id"]
            isOneToOne: false
            referencedRelation: "research_pre_research_run"
            referencedColumns: ["run_id"]
          },
          {
            foreignKeyName: "research_pre_research_video_state_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: true
            referencedRelation: "research_starter_videos"
            referencedColumns: ["video_id"]
          },
        ]
      }
      research_resource_candidate: {
        Row: {
          analysis_id: string
          confidence: number
          evidence_ids: string[]
          is_first_party: boolean
          license: string | null
          normalized_url: string
          publisher: string | null
          relationship_to_video: string
          resource_candidate_id: string
          resource_type: Database["public"]["Enums"]["research_resource_type"]
          title: string
          url: string
          verification_status: Database["public"]["Enums"]["research_verification_status"]
          why_valuable: string
        }
        Insert: {
          analysis_id: string
          confidence: number
          evidence_ids?: string[]
          is_first_party?: boolean
          license?: string | null
          normalized_url: string
          publisher?: string | null
          relationship_to_video: string
          resource_candidate_id?: string
          resource_type: Database["public"]["Enums"]["research_resource_type"]
          title: string
          url: string
          verification_status: Database["public"]["Enums"]["research_verification_status"]
          why_valuable: string
        }
        Update: {
          analysis_id?: string
          confidence?: number
          evidence_ids?: string[]
          is_first_party?: boolean
          license?: string | null
          normalized_url?: string
          publisher?: string | null
          relationship_to_video?: string
          resource_candidate_id?: string
          resource_type?: Database["public"]["Enums"]["research_resource_type"]
          title?: string
          url?: string
          verification_status?: Database["public"]["Enums"]["research_verification_status"]
          why_valuable?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_resource_candidate_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "research_video_analysis"
            referencedColumns: ["analysis_id"]
          },
        ]
      }
      research_starter_videos: {
        Row: {
          catalog_fetched_at: string | null
          channel_handle: string | null
          channel_id: string | null
          channel_title: string | null
          comment_count: number | null
          created_at: string
          description: string | null
          duration: string | null
          duration_seconds: number | null
          like_count: number | null
          metadata: Json
          pre_research_complete: boolean
          published_at: string | null
          source: string | null
          thumbnail_url: string | null
          title: string
          transcript_bucket: string | null
          transcript_char_count: number | null
          transcript_error: string | null
          transcript_fetched_at: string | null
          transcript_language: string | null
          transcript_path: string | null
          transcript_status: string
          transcript_text: string | null
          updated_at: string
          url: string | null
          video_id: string
          view_count: number | null
        }
        Insert: {
          catalog_fetched_at?: string | null
          channel_handle?: string | null
          channel_id?: string | null
          channel_title?: string | null
          comment_count?: number | null
          created_at?: string
          description?: string | null
          duration?: string | null
          duration_seconds?: number | null
          like_count?: number | null
          metadata?: Json
          pre_research_complete?: boolean
          published_at?: string | null
          source?: string | null
          thumbnail_url?: string | null
          title: string
          transcript_bucket?: string | null
          transcript_char_count?: number | null
          transcript_error?: string | null
          transcript_fetched_at?: string | null
          transcript_language?: string | null
          transcript_path?: string | null
          transcript_status?: string
          transcript_text?: string | null
          updated_at?: string
          url?: string | null
          video_id: string
          view_count?: number | null
        }
        Update: {
          catalog_fetched_at?: string | null
          channel_handle?: string | null
          channel_id?: string | null
          channel_title?: string | null
          comment_count?: number | null
          created_at?: string
          description?: string | null
          duration?: string | null
          duration_seconds?: number | null
          like_count?: number | null
          metadata?: Json
          pre_research_complete?: boolean
          published_at?: string | null
          source?: string | null
          thumbnail_url?: string | null
          title?: string
          transcript_bucket?: string | null
          transcript_char_count?: number | null
          transcript_error?: string | null
          transcript_fetched_at?: string | null
          transcript_language?: string | null
          transcript_path?: string | null
          transcript_status?: string
          transcript_text?: string | null
          updated_at?: string
          url?: string | null
          video_id?: string
          view_count?: number | null
        }
        Relationships: []
      }
      research_taxonomy_version: {
        Row: {
          activated_at: string | null
          created_at: string
          definition_sha256: string
          notes: string | null
          retired_at: string | null
          status: Database["public"]["Enums"]["research_taxonomy_status"]
          taxonomy_version_id: string
          version: string
        }
        Insert: {
          activated_at?: string | null
          created_at?: string
          definition_sha256: string
          notes?: string | null
          retired_at?: string | null
          status?: Database["public"]["Enums"]["research_taxonomy_status"]
          taxonomy_version_id?: string
          version: string
        }
        Update: {
          activated_at?: string | null
          created_at?: string
          definition_sha256?: string
          notes?: string | null
          retired_at?: string | null
          status?: Database["public"]["Enums"]["research_taxonomy_status"]
          taxonomy_version_id?: string
          version?: string
        }
        Relationships: []
      }
      research_video_analysis: {
        Row: {
          analysis_id: string
          challenge_seeds: Json
          concepts: Json
          content_form: Database["public"]["Enums"]["research_content_form"]
          contextualized_abstract: string
          curriculum_roles: string[]
          demonstrations: Json
          difficulty: Database["public"]["Enums"]["research_difficulty"]
          evidence_level: Database["public"]["Enums"]["research_evidence_level"]
          generated_at: string
          initial_summary: string
          key_takeaways: Json
          learning_outcomes: Json
          limitations: Json
          overall_confidence: number
          prerequisites: Json
          quantitative_claims: Json
          run_id: string
          structured_summary: string
          video_id: string
          why_it_matters: string
        }
        Insert: {
          analysis_id?: string
          challenge_seeds?: Json
          concepts?: Json
          content_form: Database["public"]["Enums"]["research_content_form"]
          contextualized_abstract: string
          curriculum_roles?: string[]
          demonstrations?: Json
          difficulty: Database["public"]["Enums"]["research_difficulty"]
          evidence_level: Database["public"]["Enums"]["research_evidence_level"]
          generated_at?: string
          initial_summary: string
          key_takeaways?: Json
          learning_outcomes?: Json
          limitations?: Json
          overall_confidence: number
          prerequisites?: Json
          quantitative_claims?: Json
          run_id: string
          structured_summary: string
          video_id: string
          why_it_matters: string
        }
        Update: {
          analysis_id?: string
          challenge_seeds?: Json
          concepts?: Json
          content_form?: Database["public"]["Enums"]["research_content_form"]
          contextualized_abstract?: string
          curriculum_roles?: string[]
          demonstrations?: Json
          difficulty?: Database["public"]["Enums"]["research_difficulty"]
          evidence_level?: Database["public"]["Enums"]["research_evidence_level"]
          generated_at?: string
          initial_summary?: string
          key_takeaways?: Json
          learning_outcomes?: Json
          limitations?: Json
          overall_confidence?: number
          prerequisites?: Json
          quantitative_claims?: Json
          run_id?: string
          structured_summary?: string
          video_id?: string
          why_it_matters?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_video_analysis_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: true
            referencedRelation: "research_pre_research_run"
            referencedColumns: ["run_id"]
          },
          {
            foreignKeyName: "research_video_analysis_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "research_starter_videos"
            referencedColumns: ["video_id"]
          },
        ]
      }
      research_video_category: {
        Row: {
          alternative_rank: number | null
          analysis_id: string
          assignment_role: Database["public"]["Enums"]["research_category_assignment_role"]
          category_code: Database["public"]["Enums"]["research_engineering_category_code"]
          confidence: number
          rationale: string
        }
        Insert: {
          alternative_rank?: number | null
          analysis_id: string
          assignment_role: Database["public"]["Enums"]["research_category_assignment_role"]
          category_code: Database["public"]["Enums"]["research_engineering_category_code"]
          confidence: number
          rationale: string
        }
        Update: {
          alternative_rank?: number | null
          analysis_id?: string
          assignment_role?: Database["public"]["Enums"]["research_category_assignment_role"]
          category_code?: Database["public"]["Enums"]["research_engineering_category_code"]
          confidence?: number
          rationale?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_video_category_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "research_video_analysis"
            referencedColumns: ["analysis_id"]
          },
        ]
      }
      research_video_domain: {
        Row: {
          analysis_id: string
          confidence: number
          domain_code: string
          rationale: string
        }
        Insert: {
          analysis_id: string
          confidence: number
          domain_code: string
          rationale: string
        }
        Update: {
          analysis_id?: string
          confidence?: number
          domain_code?: string
          rationale?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_video_domain_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "research_video_analysis"
            referencedColumns: ["analysis_id"]
          },
          {
            foreignKeyName: "research_video_domain_domain_code_fkey"
            columns: ["domain_code"]
            isOneToOne: false
            referencedRelation: "research_application_domain"
            referencedColumns: ["domain_code"]
          },
        ]
      }
      research_video_initial_summary: {
        Row: {
          ai_concepts: Json
          analysis_id: string
          evidence_ids: string[]
          external_context_notes: Json
          generated_at: string
          research_as_of: string
          software_engineering_concepts: Json
          temporal_context: string
          transcript_summary: string
          video_id: string
        }
        Insert: {
          ai_concepts?: Json
          analysis_id: string
          evidence_ids?: string[]
          external_context_notes?: Json
          generated_at?: string
          research_as_of: string
          software_engineering_concepts?: Json
          temporal_context: string
          transcript_summary: string
          video_id: string
        }
        Update: {
          ai_concepts?: Json
          analysis_id?: string
          evidence_ids?: string[]
          external_context_notes?: Json
          generated_at?: string
          research_as_of?: string
          software_engineering_concepts?: Json
          temporal_context?: string
          transcript_summary?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_video_initial_summary_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: true
            referencedRelation: "research_video_analysis"
            referencedColumns: ["analysis_id"]
          },
          {
            foreignKeyName: "research_video_initial_summary_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "research_starter_videos"
            referencedColumns: ["video_id"]
          },
        ]
      }
      research_video_lifecycle: {
        Row: {
          analysis_id: string
          lifecycle_stage: Database["public"]["Enums"]["research_lifecycle_stage"]
        }
        Insert: {
          analysis_id: string
          lifecycle_stage: Database["public"]["Enums"]["research_lifecycle_stage"]
        }
        Update: {
          analysis_id?: string
          lifecycle_stage?: Database["public"]["Enums"]["research_lifecycle_stage"]
        }
        Relationships: [
          {
            foreignKeyName: "research_video_lifecycle_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "research_video_analysis"
            referencedColumns: ["analysis_id"]
          },
        ]
      }
      research_video_technology_summary: {
        Row: {
          analysis_id: string
          confidence: number
          current_status: string
          evidence_ids: string[]
          family_label: string
          family_rank: number
          generated_at: string
          implementations: Json
          official_urls: Json
          primary_technology: string
          primary_technology_kind: string
          related_technologies: Json
          relationship_rationale: string
          research_as_of: string
          role_in_video: string
          summary: string
          technology_summary_id: string
          temporal_status: string
          video_id: string
          video_published_at: string | null
        }
        Insert: {
          analysis_id: string
          confidence: number
          current_status: string
          evidence_ids?: string[]
          family_label: string
          family_rank: number
          generated_at?: string
          implementations?: Json
          official_urls?: Json
          primary_technology: string
          primary_technology_kind: string
          related_technologies?: Json
          relationship_rationale: string
          research_as_of: string
          role_in_video: string
          summary: string
          technology_summary_id?: string
          temporal_status: string
          video_id: string
          video_published_at?: string | null
        }
        Update: {
          analysis_id?: string
          confidence?: number
          current_status?: string
          evidence_ids?: string[]
          family_label?: string
          family_rank?: number
          generated_at?: string
          implementations?: Json
          official_urls?: Json
          primary_technology?: string
          primary_technology_kind?: string
          related_technologies?: Json
          relationship_rationale?: string
          research_as_of?: string
          role_in_video?: string
          summary?: string
          technology_summary_id?: string
          temporal_status?: string
          video_id?: string
          video_published_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_video_technology_summary_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "research_video_analysis"
            referencedColumns: ["analysis_id"]
          },
          {
            foreignKeyName: "research_video_technology_summary_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "research_starter_videos"
            referencedColumns: ["video_id"]
          },
        ]
      }
      research_web_search_event: {
        Row: {
          provider: string
          query: string
          result_urls: Json
          run_id: string
          search_event_id: string
          search_purpose: string
          searched_at: string
          selected_urls: Json
          subagent: string
        }
        Insert: {
          provider?: string
          query: string
          result_urls?: Json
          run_id: string
          search_event_id?: string
          search_purpose: string
          searched_at?: string
          selected_urls?: Json
          subagent: string
        }
        Update: {
          provider?: string
          query?: string
          result_urls?: Json
          run_id?: string
          search_event_id?: string
          search_purpose?: string
          searched_at?: string
          selected_urls?: Json
          subagent?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_web_search_event_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "research_pre_research_run"
            referencedColumns: ["run_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      research_category_assignment_role: "primary" | "secondary"
      research_content_form:
        | "talk"
        | "tutorial"
        | "demo"
        | "panel"
        | "interview"
        | "workshop"
        | "keynote"
      research_difficulty:
        | "introductory"
        | "intermediate"
        | "advanced"
        | "expert"
      research_engineering_category_code:
        | "model_foundations_behavior"
        | "inference_model_systems"
        | "ai_data_engineering"
        | "post_training_continual_learning"
        | "prompting_llm_programming"
        | "context_engineering_memory"
        | "retrieval_search_knowledge"
        | "agent_architecture_harnesses"
        | "tools_protocols_integrations"
        | "orchestration_durable_execution"
        | "coding_agents_software_engineering"
        | "evaluation_testing_benchmarking"
        | "observability_reliability_llmops"
        | "security_safety_identity_governance"
        | "multimodal_realtime_systems"
        | "ai_product_ux_human_factors"
        | "ai_platforms_developer_tooling"
      research_entity_kind:
        | "person"
        | "organization"
        | "product"
        | "model"
        | "protocol"
        | "dataset"
        | "benchmark"
        | "paper"
        | "repository"
        | "other"
      research_evidence_level:
        | "anecdotal"
        | "case_study"
        | "benchmarked"
        | "production_system"
        | "research_paper"
      research_evidence_source_kind: "transcript" | "description" | "web"
      research_intent_event_status: "pending" | "applied" | "skipped" | "failed"
      research_intent_status: "draft" | "validated" | "applied" | "rejected"
      research_lifecycle_stage:
        | "research"
        | "design"
        | "implementation"
        | "evaluation"
        | "deployment"
        | "operations"
        | "governance"
      research_organization_domain_code:
        | "frontier_model_lab"
        | "applied_ai_research_lab"
        | "cloud_ai_platform"
        | "ai_compute_hardware_systems"
        | "model_training_inference_platform"
        | "ai_data_curation_training_platform"
        | "database_data_ai_platform"
        | "retrieval_knowledge_platform"
        | "agent_framework_orchestration"
        | "ai_developer_platform_sdk"
        | "coding_agents_developer_tools"
        | "evaluation_observability_llmops"
        | "ai_security_identity_governance"
        | "multimodal_voice_media_ai"
        | "robotics_embodied_edge_ai"
        | "enterprise_ai_automation"
        | "horizontal_ai_application"
        | "vertical_ai_application"
        | "open_source_ai_ecosystem"
        | "ai_protocol_standards_body"
        | "academic_nonprofit_research"
        | "ai_services_consulting"
        | "ai_community_education_media"
        | "ai_adopting_product_company"
        | "general_technology_ai_unit"
        | "diversified_technology_company"
        | "other_unknown"
      research_organization_scope:
        | "independent_company"
        | "parent_company"
        | "subsidiary"
        | "division"
        | "research_lab"
        | "product_organization"
        | "standards_body"
        | "academic_institution"
        | "nonprofit"
        | "community_education_media"
        | "other"
      research_pre_research_run_status:
        | "queued"
        | "claimed"
        | "analyzing"
        | "intent_ready"
        | "applying"
        | "applied"
        | "review_required"
        | "failed"
        | "superseded"
        | "research_complete"
        | "synthesizing"
      research_resource_type:
        | "repository"
        | "code_example"
        | "documentation"
        | "paper"
        | "article"
        | "slides"
        | "dataset"
        | "benchmark"
        | "model"
        | "demo"
        | "course"
        | "other"
      research_taxonomy_status: "draft" | "active" | "retired"
      research_verification_status:
        | "verified"
        | "likely"
        | "uncertain"
        | "rejected"
      research_video_organization_role:
        | "primary_featured_organization"
        | "implementation_owner"
        | "speaker_employer"
        | "parent_organization"
        | "subsidiary_or_division"
        | "acquisition_party"
        | "partner"
        | "customer_or_internal_user"
        | "standards_steward"
        | "mentioned_only"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  ranking: {
    Tables: {
      entity_group: {
        Row: {
          created_at: string
          definition: string | null
          entity_kind: string
          exclusion_rules: Json
          id: string
          inclusion_rules: Json
          purpose: string
          review_state: Database["ranking"]["Enums"]["approval_state"]
          slug: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          definition?: string | null
          entity_kind: string
          exclusion_rules?: Json
          id?: string
          inclusion_rules?: Json
          purpose: string
          review_state?: Database["ranking"]["Enums"]["approval_state"]
          slug: string
          tenant_id?: string
        }
        Update: {
          created_at?: string
          definition?: string | null
          entity_kind?: string
          exclusion_rules?: Json
          id?: string
          inclusion_rules?: Json
          purpose?: string
          review_state?: Database["ranking"]["Enums"]["approval_state"]
          slug?: string
          tenant_id?: string
        }
        Relationships: []
      }
      entity_group_version: {
        Row: {
          created_at: string
          entity_group_id: string
          id: string
          version: number
        }
        Insert: {
          created_at?: string
          entity_group_id: string
          id?: string
          version: number
        }
        Update: {
          created_at?: string
          entity_group_id?: string
          id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "entity_group_version_entity_group_id_fkey"
            columns: ["entity_group_id"]
            isOneToOne: false
            referencedRelation: "entity_group"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_definition: {
        Row: {
          created_at: string
          expression: string
          id: string
          inputs: Json
          slug: string
          version: number
        }
        Insert: {
          created_at?: string
          expression: string
          id?: string
          inputs?: Json
          slug: string
          version?: number
        }
        Update: {
          created_at?: string
          expression?: string
          id?: string
          inputs?: Json
          slug?: string
          version?: number
        }
        Relationships: []
      }
      feature_value: {
        Row: {
          computed_at: string
          entity_id: string
          entity_kind: string
          feature_definition_id: string
          id: string
          input_lineage: Json
          value_jsonb: Json | null
          value_numeric: number | null
        }
        Insert: {
          computed_at?: string
          entity_id: string
          entity_kind: string
          feature_definition_id: string
          id?: string
          input_lineage?: Json
          value_jsonb?: Json | null
          value_numeric?: number | null
        }
        Update: {
          computed_at?: string
          entity_id?: string
          entity_kind?: string
          feature_definition_id?: string
          id?: string
          input_lineage?: Json
          value_jsonb?: Json | null
          value_numeric?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_value_feature_definition_id_fkey"
            columns: ["feature_definition_id"]
            isOneToOne: false
            referencedRelation: "feature_definition"
            referencedColumns: ["id"]
          },
        ]
      }
      group_membership: {
        Row: {
          agent_skill_id: string | null
          ai_model_version_id: string | null
          created_at: string
          entity_kind: string | null
          group_version_id: string
          id: string
          library_id: string | null
          mcp_server_id: string | null
          organization_id: string | null
          paper_id: string | null
          person_id: string | null
          product_id: string | null
          provenance_claim_id: string | null
          repository_id: string | null
          valid_from: string
          valid_to: string | null
          video_id: string | null
        }
        Insert: {
          agent_skill_id?: string | null
          ai_model_version_id?: string | null
          created_at?: string
          entity_kind?: string | null
          group_version_id: string
          id?: string
          library_id?: string | null
          mcp_server_id?: string | null
          organization_id?: string | null
          paper_id?: string | null
          person_id?: string | null
          product_id?: string | null
          provenance_claim_id?: string | null
          repository_id?: string | null
          valid_from?: string
          valid_to?: string | null
          video_id?: string | null
        }
        Update: {
          agent_skill_id?: string | null
          ai_model_version_id?: string | null
          created_at?: string
          entity_kind?: string | null
          group_version_id?: string
          id?: string
          library_id?: string | null
          mcp_server_id?: string | null
          organization_id?: string | null
          paper_id?: string | null
          person_id?: string | null
          product_id?: string | null
          provenance_claim_id?: string | null
          repository_id?: string | null
          valid_from?: string
          valid_to?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_membership_group_version_id_fkey"
            columns: ["group_version_id"]
            isOneToOne: false
            referencedRelation: "entity_group_version"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard: {
        Row: {
          created_at: string
          group_version_id: string
          id: string
          policy_version_id: string
          slug: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          group_version_id: string
          id?: string
          policy_version_id: string
          slug: string
          tenant_id?: string
        }
        Update: {
          created_at?: string
          group_version_id?: string
          id?: string
          policy_version_id?: string
          slug?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_group_version_id_fkey"
            columns: ["group_version_id"]
            isOneToOne: false
            referencedRelation: "entity_group_version"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaderboard_policy_version_id_fkey"
            columns: ["policy_version_id"]
            isOneToOne: false
            referencedRelation: "ranking_policy_version"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_edition: {
        Row: {
          edition_no: number
          id: string
          leaderboard_id: string
          published_at: string
          ranking_run_id: string
        }
        Insert: {
          edition_no: number
          id?: string
          leaderboard_id: string
          published_at?: string
          ranking_run_id: string
        }
        Update: {
          edition_no?: number
          id?: string
          leaderboard_id?: string
          published_at?: string
          ranking_run_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_edition_leaderboard_id_fkey"
            columns: ["leaderboard_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaderboard_edition_ranking_run_id_fkey"
            columns: ["ranking_run_id"]
            isOneToOne: false
            referencedRelation: "ranking_run"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_snapshot: {
        Row: {
          frozen_at: string
          group_version_id: string
          id: string
          member_count: number
          members: Json
        }
        Insert: {
          frozen_at?: string
          group_version_id: string
          id?: string
          member_count: number
          members: Json
        }
        Update: {
          frozen_at?: string
          group_version_id?: string
          id?: string
          member_count?: number
          members?: Json
        }
        Relationships: [
          {
            foreignKeyName: "membership_snapshot_group_version_id_fkey"
            columns: ["group_version_id"]
            isOneToOne: false
            referencedRelation: "entity_group_version"
            referencedColumns: ["id"]
          },
        ]
      }
      metric_definition: {
        Row: {
          created_at: string
          id: string
          label: string
          slug: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          slug: string
          tenant_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          slug?: string
          tenant_id?: string
        }
        Relationships: []
      }
      metric_definition_version: {
        Row: {
          acquisition: string | null
          approval_state: Database["ranking"]["Enums"]["approval_state"]
          cadence: string | null
          created_at: string
          decay_policy: Json
          gaming_risk: string | null
          id: string
          locator_method: string | null
          metric_definition_id: string
          missingness_policy: string | null
          permitted_ranking_purposes: string[]
          semantics: string
          source_field: string | null
          unit: string | null
          version: number
        }
        Insert: {
          acquisition?: string | null
          approval_state?: Database["ranking"]["Enums"]["approval_state"]
          cadence?: string | null
          created_at?: string
          decay_policy?: Json
          gaming_risk?: string | null
          id?: string
          locator_method?: string | null
          metric_definition_id: string
          missingness_policy?: string | null
          permitted_ranking_purposes?: string[]
          semantics: string
          source_field?: string | null
          unit?: string | null
          version: number
        }
        Update: {
          acquisition?: string | null
          approval_state?: Database["ranking"]["Enums"]["approval_state"]
          cadence?: string | null
          created_at?: string
          decay_policy?: Json
          gaming_risk?: string | null
          id?: string
          locator_method?: string | null
          metric_definition_id?: string
          missingness_policy?: string | null
          permitted_ranking_purposes?: string[]
          semantics?: string
          source_field?: string | null
          unit?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "metric_definition_version_metric_definition_id_fkey"
            columns: ["metric_definition_id"]
            isOneToOne: false
            referencedRelation: "metric_definition"
            referencedColumns: ["id"]
          },
        ]
      }
      metric_observation: {
        Row: {
          agent_skill_id: string | null
          ai_model_version_id: string | null
          created_at: string
          definition_version_id: string
          entity_kind: string | null
          id: string
          library_id: string | null
          locator_id: string | null
          mcp_server_id: string | null
          observed_at: string
          organization_id: string | null
          paper_id: string | null
          person_id: string | null
          product_id: string | null
          repository_id: string | null
          run_id: string | null
          tenant_id: string
          value_jsonb: Json | null
          value_numeric: number | null
          value_text: string | null
          video_id: string | null
        }
        Insert: {
          agent_skill_id?: string | null
          ai_model_version_id?: string | null
          created_at?: string
          definition_version_id: string
          entity_kind?: string | null
          id?: string
          library_id?: string | null
          locator_id?: string | null
          mcp_server_id?: string | null
          observed_at: string
          organization_id?: string | null
          paper_id?: string | null
          person_id?: string | null
          product_id?: string | null
          repository_id?: string | null
          run_id?: string | null
          tenant_id?: string
          value_jsonb?: Json | null
          value_numeric?: number | null
          value_text?: string | null
          video_id?: string | null
        }
        Update: {
          agent_skill_id?: string | null
          ai_model_version_id?: string | null
          created_at?: string
          definition_version_id?: string
          entity_kind?: string | null
          id?: string
          library_id?: string | null
          locator_id?: string | null
          mcp_server_id?: string | null
          observed_at?: string
          organization_id?: string | null
          paper_id?: string | null
          person_id?: string | null
          product_id?: string | null
          repository_id?: string | null
          run_id?: string | null
          tenant_id?: string
          value_jsonb?: Json | null
          value_numeric?: number | null
          value_text?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metric_observation_definition_version_id_fkey"
            columns: ["definition_version_id"]
            isOneToOne: false
            referencedRelation: "metric_definition_version"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_observation_run_fk"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "ranking_run"
            referencedColumns: ["id"]
          },
        ]
      }
      ranking_policy: {
        Row: {
          created_at: string
          id: string
          purpose: string
          slug: string
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          purpose: string
          slug: string
          tenant_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          purpose?: string
          slug?: string
          tenant_id?: string
        }
        Relationships: []
      }
      ranking_policy_version: {
        Row: {
          approval_state: Database["ranking"]["Enums"]["approval_state"]
          created_at: string
          id: string
          penalties: Json
          ranking_policy_id: string
          version: number
          weights: Json
        }
        Insert: {
          approval_state?: Database["ranking"]["Enums"]["approval_state"]
          created_at?: string
          id?: string
          penalties?: Json
          ranking_policy_id: string
          version: number
          weights?: Json
        }
        Update: {
          approval_state?: Database["ranking"]["Enums"]["approval_state"]
          created_at?: string
          id?: string
          penalties?: Json
          ranking_policy_id?: string
          version?: number
          weights?: Json
        }
        Relationships: [
          {
            foreignKeyName: "ranking_policy_version_ranking_policy_id_fkey"
            columns: ["ranking_policy_id"]
            isOneToOne: false
            referencedRelation: "ranking_policy"
            referencedColumns: ["id"]
          },
        ]
      }
      ranking_result: {
        Row: {
          contributions: Json
          entity_id: string
          entity_kind: string
          explanation: string | null
          id: string
          penalties: Json
          rank: number
          run_id: string
          score: number
          uncertainty: number | null
        }
        Insert: {
          contributions?: Json
          entity_id: string
          entity_kind: string
          explanation?: string | null
          id?: string
          penalties?: Json
          rank: number
          run_id: string
          score: number
          uncertainty?: number | null
        }
        Update: {
          contributions?: Json
          entity_id?: string
          entity_kind?: string
          explanation?: string | null
          id?: string
          penalties?: Json
          rank?: number
          run_id?: string
          score?: number
          uncertainty?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ranking_result_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "ranking_run"
            referencedColumns: ["id"]
          },
        ]
      }
      ranking_run: {
        Row: {
          code_ref: string | null
          executed_at: string
          feature_set_hash: string | null
          id: string
          policy_version_id: string
          snapshot_id: string | null
          work_item_id: string | null
        }
        Insert: {
          code_ref?: string | null
          executed_at?: string
          feature_set_hash?: string | null
          id?: string
          policy_version_id: string
          snapshot_id?: string | null
          work_item_id?: string | null
        }
        Update: {
          code_ref?: string | null
          executed_at?: string
          feature_set_hash?: string | null
          id?: string
          policy_version_id?: string
          snapshot_id?: string | null
          work_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ranking_run_policy_version_id_fkey"
            columns: ["policy_version_id"]
            isOneToOne: false
            referencedRelation: "ranking_policy_version"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ranking_run_snapshot_id_fkey"
            columns: ["snapshot_id"]
            isOneToOne: false
            referencedRelation: "membership_snapshot"
            referencedColumns: ["id"]
          },
        ]
      }
      selection: {
        Row: {
          coverage_rationale: string | null
          created_at: string
          diversity_rationale: string | null
          id: string
          purpose: string
          run_id: string | null
          selected: Json
          tenant_id: string
        }
        Insert: {
          coverage_rationale?: string | null
          created_at?: string
          diversity_rationale?: string | null
          id?: string
          purpose: string
          run_id?: string | null
          selected?: Json
          tenant_id?: string
        }
        Update: {
          coverage_rationale?: string | null
          created_at?: string
          diversity_rationale?: string | null
          id?: string
          purpose?: string
          run_id?: string | null
          selected?: Json
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "selection_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "ranking_run"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      approval_state:
        | "draft"
        | "proposed"
        | "approved"
        | "deprecated"
        | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  research: {
    Tables: {
      bundle_artifact: {
        Row: {
          artifact_id: string
          bundle_id: string
          role: string
        }
        Insert: {
          artifact_id: string
          bundle_id: string
          role: string
        }
        Update: {
          artifact_id?: string
          bundle_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "bundle_artifact_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "research_bundle"
            referencedColumns: ["id"]
          },
        ]
      }
      comparison: {
        Row: {
          created_at: string
          dimensions: Json
          entity_ids: string[]
          entity_kind: string
          id: string
          mission_id: string
          title: string
          verdicts: Json
        }
        Insert: {
          created_at?: string
          dimensions?: Json
          entity_ids?: string[]
          entity_kind: string
          id?: string
          mission_id: string
          title: string
          verdicts?: Json
        }
        Update: {
          created_at?: string
          dimensions?: Json
          entity_ids?: string[]
          entity_kind?: string
          id?: string
          mission_id?: string
          title?: string
          verdicts?: Json
        }
        Relationships: []
      }
      downstream_handoff: {
        Row: {
          consumed_at: string | null
          consumed_by_work_item_id: string | null
          created_at: string
          id: string
          mission_id: string
          payload_artifact_id: string | null
          status: string
          target_pipeline: string
        }
        Insert: {
          consumed_at?: string | null
          consumed_by_work_item_id?: string | null
          created_at?: string
          id?: string
          mission_id: string
          payload_artifact_id?: string | null
          status?: string
          target_pipeline: string
        }
        Update: {
          consumed_at?: string | null
          consumed_by_work_item_id?: string | null
          created_at?: string
          id?: string
          mission_id?: string
          payload_artifact_id?: string | null
          status?: string
          target_pipeline?: string
        }
        Relationships: []
      }
      finding: {
        Row: {
          created_at: string
          id: string
          mission_id: string
          proposed_record_kind: string | null
          provenance_claim_id: string | null
          rejection_reason: string | null
          resolution: Database["research"]["Enums"]["finding_resolution"]
          resolved_at: string | null
          resolved_record_id: string | null
          statement: string
          structured: Json | null
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          mission_id: string
          proposed_record_kind?: string | null
          provenance_claim_id?: string | null
          rejection_reason?: string | null
          resolution?: Database["research"]["Enums"]["finding_resolution"]
          resolved_at?: string | null
          resolved_record_id?: string | null
          statement: string
          structured?: Json | null
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          mission_id?: string
          proposed_record_kind?: string | null
          provenance_claim_id?: string | null
          rejection_reason?: string | null
          resolution?: Database["research"]["Enums"]["finding_resolution"]
          resolved_at?: string | null
          resolved_record_id?: string | null
          statement?: string
          structured?: Json | null
          title?: string
        }
        Relationships: []
      }
      report: {
        Row: {
          created_at: string
          id: string
          mission_id: string | null
          slug: string
          tenant_id: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          mission_id?: string | null
          slug: string
          tenant_id?: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          mission_id?: string | null
          slug?: string
          tenant_id?: string
          title?: string
        }
        Relationships: []
      }
      report_claim: {
        Row: {
          claim_id: string
          report_version_id: string
          role: string
        }
        Insert: {
          claim_id: string
          report_version_id: string
          role?: string
        }
        Update: {
          claim_id?: string
          report_version_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_claim_report_version_id_fkey"
            columns: ["report_version_id"]
            isOneToOne: false
            referencedRelation: "report_version"
            referencedColumns: ["id"]
          },
        ]
      }
      report_version: {
        Row: {
          assurance_summary: Json
          id: string
          json_artifact_id: string | null
          markdown_artifact_id: string | null
          published_at: string
          report_id: string
          synthesis_consistency_eval_id: string | null
          version: number
        }
        Insert: {
          assurance_summary?: Json
          id?: string
          json_artifact_id?: string | null
          markdown_artifact_id?: string | null
          published_at?: string
          report_id: string
          synthesis_consistency_eval_id?: string | null
          version: number
        }
        Update: {
          assurance_summary?: Json
          id?: string
          json_artifact_id?: string | null
          markdown_artifact_id?: string | null
          published_at?: string
          report_id?: string
          synthesis_consistency_eval_id?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "report_version_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "report"
            referencedColumns: ["id"]
          },
        ]
      }
      research_bundle: {
        Row: {
          bundle_version: number
          created_at: string
          id: string
          manifest_artifact_id: string | null
          mission_id: string
          status: Database["research"]["Enums"]["bundle_status"]
          tenant_id: string
          updated_at: string
        }
        Insert: {
          bundle_version?: number
          created_at?: string
          id?: string
          manifest_artifact_id?: string | null
          mission_id: string
          status?: Database["research"]["Enums"]["bundle_status"]
          tenant_id?: string
          updated_at?: string
        }
        Update: {
          bundle_version?: number
          created_at?: string
          id?: string
          manifest_artifact_id?: string | null
          mission_id?: string
          status?: Database["research"]["Enums"]["bundle_status"]
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      bundle_status: "assembling" | "complete" | "failed" | "superseded"
      finding_resolution:
        | "pending"
        | "promoted"
        | "rejected"
        | "deferred"
        | "merged"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  research_private: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      begin_research_session: {
        Args: { p_eve_session_id: string; p_run_id: string }
        Returns: Json
      }
      begin_synthesis_session: {
        Args: { p_eve_session_id: string; p_run_id: string }
        Returns: Json
      }
      checkpoint_pre_research_stage_input: {
        Args: {
          p_bucket: string
          p_input_sha256: string
          p_lease_token: string
          p_manifest_path: string
          p_prompt_bundle_version: string
          p_run_id: string
          p_stage: string
          p_worker_id: string
        }
        Returns: Database["public"]["Tables"]["research_pre_research_stage_execution"]["Row"]
        SetofOptions: {
          from: "*"
          to: "research_pre_research_stage_execution"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      claim_pre_research_stage: {
        Args: {
          p_lease_seconds?: number
          p_run_id?: string
          p_worker_id: string
        }
        Returns: {
          attempt_count: number
          lease_expires_at: string
          lease_token: string
          output_artifact_kinds: string[]
          run_id: string
          stage: string
          stage_execution_id: string
        }[]
      }
      claim_pre_research_video: {
        Args: {
          p_lease_seconds?: number
          p_model_id?: string
          p_packet_schema_version?: string
          p_prompt_bundle_version?: string
          p_taxonomy_version?: string
          p_video_id?: string
        }
        Returns: Json
      }
      complete_pre_research_stage: {
        Args: {
          p_artifact_sha256s: Json
          p_lease_token: string
          p_next_status?: string
          p_run_id: string
          p_stage: string
          p_usage_summary?: Json
          p_worker_id: string
        }
        Returns: Database["public"]["Tables"]["research_pre_research_stage_execution"]["Row"]
        SetofOptions: {
          from: "*"
          to: "research_pre_research_stage_execution"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      complete_research_phase: {
        Args: { p_eve_session_id: string; p_run_id: string }
        Returns: Json
      }
      complete_synthesis_phase: {
        Args: {
          p_eve_session_id: string
          p_next_status: Database["public"]["Enums"]["research_pre_research_run_status"]
          p_run_id: string
        }
        Returns: Json
      }
      current_transcript_hash: { Args: { p_video_id: string }; Returns: string }
      ensure_pre_research_stage_rows: {
        Args: { p_run_id: string }
        Returns: undefined
      }
      evaluate_pre_research_qualification: {
        Args: {
          p_video: Database["public"]["Tables"]["research_starter_videos"]["Row"]
        }
        Returns: {
          already_finished: boolean
          already_live: boolean
          duration_seconds: number
          eligibility_status: string
          ineligibility_reasons: string[]
          transcript_object_exists: boolean
          transcript_sha256: string
        }[]
      }
      list_finished_pre_research_videos: {
        Args: never
        Returns: {
          analysis_id: string
          duration_seconds: number
          initial_summary: Json
          intent_id: string
          organization_candidates: Json
          packet_storage_prefix: string
          published_at: string
          research_as_of: string
          run_id: string
          technology_summaries: Json
          title: string
          transcript_bucket: string
          transcript_path: string
          transcript_sha256: string
          video_id: string
        }[]
      }
      park_pre_research_stage: {
        Args: {
          p_error_code: string
          p_error_detail: string
          p_lease_token: string
          p_retry_after: string
          p_retryable: boolean
          p_run_id: string
          p_stage: string
          p_worker_id: string
        }
        Returns: Database["public"]["Tables"]["research_pre_research_stage_execution"]["Row"]
        SetofOptions: {
          from: "*"
          to: "research_pre_research_stage_execution"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      project_pre_research_video_state: {
        Args: {
          p_latest_run_id?: string
          p_pipeline_status?: string
          p_video_id: string
        }
        Returns: Database["public"]["Tables"]["research_pre_research_video_state"]["Row"]
        SetofOptions: {
          from: "*"
          to: "research_pre_research_video_state"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      reconcile_pre_research_stage_rows: {
        Args: { p_run_id: string }
        Returns: undefined
      }
      refresh_pre_research_video_qualification: {
        Args: { p_video_id?: string }
        Returns: Json
      }
      touch_pre_research_run: {
        Args: {
          p_error_code?: string
          p_error_detail?: string
          p_intent_path?: string
          p_intent_sha256?: string
          p_lease_seconds?: number
          p_lease_token: string
          p_run_id: string
          p_status?: Database["public"]["Enums"]["research_pre_research_run_status"]
          p_workflow_session_id?: string
        }
        Returns: Database["public"]["Tables"]["research_pre_research_run"]["Row"]
        SetofOptions: {
          from: "*"
          to: "research_pre_research_run"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  retrieval: {
    Tables: {
      evidence_packet: {
        Row: {
          artifact_id: string | null
          created_at: string
          id: string
          packet: Json
          packet_schema_version: number
          run_id: string | null
          tenant_id: string
        }
        Insert: {
          artifact_id?: string | null
          created_at?: string
          id?: string
          packet: Json
          packet_schema_version?: number
          run_id?: string | null
          tenant_id?: string
        }
        Update: {
          artifact_id?: string | null
          created_at?: string
          id?: string
          packet?: Json
          packet_schema_version?: number
          run_id?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_packet_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "retrieval_run"
            referencedColumns: ["id"]
          },
        ]
      }
      packet_member: {
        Row: {
          advanced_usage_pattern_id: string | null
          benchmark_result_id: string | null
          claim_id: string | null
          compatibility_constraint_id: string | null
          contradiction_flags: Json
          coverage_role: string | null
          created_at: string
          failure_mode_id: string | null
          freshness: string | null
          id: string
          implementation_example_id: string | null
          locators: Json
          member_kind: string | null
          operational_practice_id: string | null
          packet_id: string
          security_consideration_id: string | null
          solution_pattern_id: string | null
          technical_problem_id: string | null
          verification_state: string | null
        }
        Insert: {
          advanced_usage_pattern_id?: string | null
          benchmark_result_id?: string | null
          claim_id?: string | null
          compatibility_constraint_id?: string | null
          contradiction_flags?: Json
          coverage_role?: string | null
          created_at?: string
          failure_mode_id?: string | null
          freshness?: string | null
          id?: string
          implementation_example_id?: string | null
          locators?: Json
          member_kind?: string | null
          operational_practice_id?: string | null
          packet_id: string
          security_consideration_id?: string | null
          solution_pattern_id?: string | null
          technical_problem_id?: string | null
          verification_state?: string | null
        }
        Update: {
          advanced_usage_pattern_id?: string | null
          benchmark_result_id?: string | null
          claim_id?: string | null
          compatibility_constraint_id?: string | null
          contradiction_flags?: Json
          coverage_role?: string | null
          created_at?: string
          failure_mode_id?: string | null
          freshness?: string | null
          id?: string
          implementation_example_id?: string | null
          locators?: Json
          member_kind?: string | null
          operational_practice_id?: string | null
          packet_id?: string
          security_consideration_id?: string | null
          solution_pattern_id?: string | null
          technical_problem_id?: string | null
          verification_state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "packet_member_packet_id_fkey"
            columns: ["packet_id"]
            isOneToOne: false
            referencedRelation: "evidence_packet"
            referencedColumns: ["id"]
          },
        ]
      }
      projection_procedure: {
        Row: {
          chunking: Json
          code_ref: string | null
          created_at: string
          description: string | null
          id: string
          slug: string
          template: string | null
          version: number
        }
        Insert: {
          chunking?: Json
          code_ref?: string | null
          created_at?: string
          description?: string | null
          id?: string
          slug: string
          template?: string | null
          version: number
        }
        Update: {
          chunking?: Json
          code_ref?: string | null
          created_at?: string
          description?: string | null
          id?: string
          slug?: string
          template?: string | null
          version?: number
        }
        Relationships: []
      }
      retrieval_candidate: {
        Row: {
          final_score: number | null
          id: string
          lexical_ref: string | null
          rank: number | null
          run_id: string
          stage_scores: Json
          vector_item_id: string | null
        }
        Insert: {
          final_score?: number | null
          id?: string
          lexical_ref?: string | null
          rank?: number | null
          run_id: string
          stage_scores?: Json
          vector_item_id?: string | null
        }
        Update: {
          final_score?: number | null
          id?: string
          lexical_ref?: string | null
          rank?: number | null
          run_id?: string
          stage_scores?: Json
          vector_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retrieval_candidate_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "retrieval_run"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retrieval_candidate_vector_item_id_fkey"
            columns: ["vector_item_id"]
            isOneToOne: false
            referencedRelation: "vector_item"
            referencedColumns: ["id"]
          },
        ]
      }
      retrieval_plan: {
        Row: {
          created_at: string
          decomposition: Json
          filters: Json
          id: string
          policy_version: number
          proposed_by_attempt_id: string | null
          query_intent: string
          spaces: Json
          tenant_id: string
          validated: boolean
          validation_errors: Json | null
        }
        Insert: {
          created_at?: string
          decomposition?: Json
          filters?: Json
          id?: string
          policy_version?: number
          proposed_by_attempt_id?: string | null
          query_intent: string
          spaces?: Json
          tenant_id?: string
          validated?: boolean
          validation_errors?: Json | null
        }
        Update: {
          created_at?: string
          decomposition?: Json
          filters?: Json
          id?: string
          policy_version?: number
          proposed_by_attempt_id?: string | null
          query_intent?: string
          spaces?: Json
          tenant_id?: string
          validated?: boolean
          validation_errors?: Json | null
        }
        Relationships: []
      }
      retrieval_run: {
        Row: {
          executed_at: string
          fusion_params: Json
          id: string
          plan_id: string
          reranker_id: string | null
          stage_timings: Json
        }
        Insert: {
          executed_at?: string
          fusion_params?: Json
          id?: string
          plan_id: string
          reranker_id?: string | null
          stage_timings?: Json
        }
        Update: {
          executed_at?: string
          fusion_params?: Json
          id?: string
          plan_id?: string
          reranker_id?: string | null
          stage_timings?: Json
        }
        Relationships: [
          {
            foreignKeyName: "retrieval_run_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "retrieval_plan"
            referencedColumns: ["id"]
          },
        ]
      }
      vector_item: {
        Row: {
          advanced_usage_pattern_id: string | null
          backend_location: string | null
          benchmark_result_id: string | null
          chunk_index: number
          claim_id: string | null
          compatibility_constraint_id: string | null
          content_sha256: string
          created_at: string
          embedding: string | null
          failure_mode_id: string | null
          generation_run_id: string | null
          id: string
          implementation_example_id: string | null
          operational_practice_id: string | null
          receipt_id: string | null
          report_version_id: string | null
          security_consideration_id: string | null
          solution_pattern_id: string | null
          source_kind: string | null
          source_version_hash: string | null
          space_version_id: string
          superseded_by_id: string | null
          talk_id: string | null
          technical_problem_id: string | null
          tenant_id: string
          verification_state: string
          video_id: string | null
        }
        Insert: {
          advanced_usage_pattern_id?: string | null
          backend_location?: string | null
          benchmark_result_id?: string | null
          chunk_index?: number
          claim_id?: string | null
          compatibility_constraint_id?: string | null
          content_sha256: string
          created_at?: string
          embedding?: string | null
          failure_mode_id?: string | null
          generation_run_id?: string | null
          id?: string
          implementation_example_id?: string | null
          operational_practice_id?: string | null
          receipt_id?: string | null
          report_version_id?: string | null
          security_consideration_id?: string | null
          solution_pattern_id?: string | null
          source_kind?: string | null
          source_version_hash?: string | null
          space_version_id: string
          superseded_by_id?: string | null
          talk_id?: string | null
          technical_problem_id?: string | null
          tenant_id?: string
          verification_state?: string
          video_id?: string | null
        }
        Update: {
          advanced_usage_pattern_id?: string | null
          backend_location?: string | null
          benchmark_result_id?: string | null
          chunk_index?: number
          claim_id?: string | null
          compatibility_constraint_id?: string | null
          content_sha256?: string
          created_at?: string
          embedding?: string | null
          failure_mode_id?: string | null
          generation_run_id?: string | null
          id?: string
          implementation_example_id?: string | null
          operational_practice_id?: string | null
          receipt_id?: string | null
          report_version_id?: string | null
          security_consideration_id?: string | null
          solution_pattern_id?: string | null
          source_kind?: string | null
          source_version_hash?: string | null
          space_version_id?: string
          superseded_by_id?: string | null
          talk_id?: string | null
          technical_problem_id?: string | null
          tenant_id?: string
          verification_state?: string
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vector_item_space_version_id_fkey"
            columns: ["space_version_id"]
            isOneToOne: false
            referencedRelation: "vector_space_version"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vector_item_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "vector_item"
            referencedColumns: ["id"]
          },
        ]
      }
      vector_space: {
        Row: {
          class: Database["retrieval"]["Enums"]["space_class"]
          created_at: string
          id: string
          purpose: string
          slug: string
          tenant_id: string
        }
        Insert: {
          class?: Database["retrieval"]["Enums"]["space_class"]
          created_at?: string
          id?: string
          purpose: string
          slug: string
          tenant_id?: string
        }
        Update: {
          class?: Database["retrieval"]["Enums"]["space_class"]
          created_at?: string
          id?: string
          purpose?: string
          slug?: string
          tenant_id?: string
        }
        Relationships: []
      }
      vector_space_version: {
        Row: {
          backend: Database["retrieval"]["Enums"]["backend_kind"]
          created_at: string
          dims: number
          embedding_model: string
          id: string
          projection_procedure_id: string | null
          promoted: boolean
          promotion_gate_eval_id: string | null
          vector_space_id: string
          version: number
        }
        Insert: {
          backend: Database["retrieval"]["Enums"]["backend_kind"]
          created_at?: string
          dims: number
          embedding_model: string
          id?: string
          projection_procedure_id?: string | null
          promoted?: boolean
          promotion_gate_eval_id?: string | null
          vector_space_id: string
          version: number
        }
        Update: {
          backend?: Database["retrieval"]["Enums"]["backend_kind"]
          created_at?: string
          dims?: number
          embedding_model?: string
          id?: string
          projection_procedure_id?: string | null
          promoted?: boolean
          promotion_gate_eval_id?: string | null
          vector_space_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "vector_space_version_projection_procedure_id_fkey"
            columns: ["projection_procedure_id"]
            isOneToOne: false
            referencedRelation: "projection_procedure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vector_space_version_vector_space_id_fkey"
            columns: ["vector_space_id"]
            isOneToOne: false
            referencedRelation: "vector_space"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      backend_kind: "vector_bucket" | "pgvector"
      space_class: "canonical" | "exploratory"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  staging: {
    Tables: {
      candidate: {
        Row: {
          candidate_kind: string
          capture_id: string | null
          created_at: string
          discovered_by_attempt_id: string | null
          discovery_method: string | null
          id: string
          locator_id: string | null
          mission_id: string | null
          provider: string | null
          raw: Json
          status: Database["staging"]["Enums"]["candidate_status"]
          tenant_id: string
          updated_at: string
        }
        Insert: {
          candidate_kind: string
          capture_id?: string | null
          created_at?: string
          discovered_by_attempt_id?: string | null
          discovery_method?: string | null
          id?: string
          locator_id?: string | null
          mission_id?: string | null
          provider?: string | null
          raw?: Json
          status?: Database["staging"]["Enums"]["candidate_status"]
          tenant_id?: string
          updated_at?: string
        }
        Update: {
          candidate_kind?: string
          capture_id?: string | null
          created_at?: string
          discovered_by_attempt_id?: string | null
          discovery_method?: string | null
          id?: string
          locator_id?: string | null
          mission_id?: string | null
          provider?: string | null
          raw?: Json
          status?: Database["staging"]["Enums"]["candidate_status"]
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      candidate_agent_skill: {
        Row: {
          candidate_id: string
          candidate_kind: string
          distribution: string | null
          name: string | null
          repository_url: string | null
          skill_format: string | null
          slug: string | null
        }
        Insert: {
          candidate_id: string
          candidate_kind?: string
          distribution?: string | null
          name?: string | null
          repository_url?: string | null
          skill_format?: string | null
          slug?: string | null
        }
        Update: {
          candidate_id?: string
          candidate_kind?: string
          distribution?: string | null
          name?: string | null
          repository_url?: string | null
          skill_format?: string | null
          slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_agent_skill_candidate_id_candidate_kind_fkey"
            columns: ["candidate_id", "candidate_kind"]
            isOneToOne: false
            referencedRelation: "candidate"
            referencedColumns: ["id", "candidate_kind"]
          },
          {
            foreignKeyName: "candidate_agent_skill_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: true
            referencedRelation: "candidate"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_ai_model: {
        Row: {
          candidate_id: string
          candidate_kind: string
          display_name: string | null
          family: string | null
          model_slug: string | null
          provider_name: string | null
        }
        Insert: {
          candidate_id: string
          candidate_kind?: string
          display_name?: string | null
          family?: string | null
          model_slug?: string | null
          provider_name?: string | null
        }
        Update: {
          candidate_id?: string
          candidate_kind?: string
          display_name?: string | null
          family?: string | null
          model_slug?: string | null
          provider_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_ai_model_candidate_id_candidate_kind_fkey"
            columns: ["candidate_id", "candidate_kind"]
            isOneToOne: false
            referencedRelation: "candidate"
            referencedColumns: ["id", "candidate_kind"]
          },
          {
            foreignKeyName: "candidate_ai_model_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: true
            referencedRelation: "candidate"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_ai_protocol: {
        Row: {
          candidate_id: string
          candidate_kind: string
          name: string | null
          slug: string | null
          spec_url: string | null
        }
        Insert: {
          candidate_id: string
          candidate_kind?: string
          name?: string | null
          slug?: string | null
          spec_url?: string | null
        }
        Update: {
          candidate_id?: string
          candidate_kind?: string
          name?: string | null
          slug?: string | null
          spec_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_ai_protocol_candidate_id_candidate_kind_fkey"
            columns: ["candidate_id", "candidate_kind"]
            isOneToOne: false
            referencedRelation: "candidate"
            referencedColumns: ["id", "candidate_kind"]
          },
          {
            foreignKeyName: "candidate_ai_protocol_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: true
            referencedRelation: "candidate"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_benchmark: {
        Row: {
          candidate_id: string
          candidate_kind: string
          homepage_url: string | null
          name: string | null
          task_domain: string | null
        }
        Insert: {
          candidate_id: string
          candidate_kind?: string
          homepage_url?: string | null
          name?: string | null
          task_domain?: string | null
        }
        Update: {
          candidate_id?: string
          candidate_kind?: string
          homepage_url?: string | null
          name?: string | null
          task_domain?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_benchmark_candidate_id_candidate_kind_fkey"
            columns: ["candidate_id", "candidate_kind"]
            isOneToOne: false
            referencedRelation: "candidate"
            referencedColumns: ["id", "candidate_kind"]
          },
          {
            foreignKeyName: "candidate_benchmark_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: true
            referencedRelation: "candidate"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_concept: {
        Row: {
          aliases: string[]
          candidate_id: string
          candidate_kind: string
          definition: string | null
          preferred_label: string | null
        }
        Insert: {
          aliases?: string[]
          candidate_id: string
          candidate_kind?: string
          definition?: string | null
          preferred_label?: string | null
        }
        Update: {
          aliases?: string[]
          candidate_id?: string
          candidate_kind?: string
          definition?: string | null
          preferred_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_concept_candidate_id_candidate_kind_fkey"
            columns: ["candidate_id", "candidate_kind"]
            isOneToOne: false
            referencedRelation: "candidate"
            referencedColumns: ["id", "candidate_kind"]
          },
          {
            foreignKeyName: "candidate_concept_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: true
            referencedRelation: "candidate"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_dataset: {
        Row: {
          candidate_id: string
          candidate_kind: string
          external_id: string | null
          host: string | null
          name: string | null
        }
        Insert: {
          candidate_id: string
          candidate_kind?: string
          external_id?: string | null
          host?: string | null
          name?: string | null
        }
        Update: {
          candidate_id?: string
          candidate_kind?: string
          external_id?: string | null
          host?: string | null
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_dataset_candidate_id_candidate_kind_fkey"
            columns: ["candidate_id", "candidate_kind"]
            isOneToOne: false
            referencedRelation: "candidate"
            referencedColumns: ["id", "candidate_kind"]
          },
          {
            foreignKeyName: "candidate_dataset_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: true
            referencedRelation: "candidate"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_library: {
        Row: {
          candidate_id: string
          candidate_kind: string
          display_name: string | null
          ecosystem: string | null
          homepage_url: string | null
          package_name: string | null
          primary_language: string | null
        }
        Insert: {
          candidate_id: string
          candidate_kind?: string
          display_name?: string | null
          ecosystem?: string | null
          homepage_url?: string | null
          package_name?: string | null
          primary_language?: string | null
        }
        Update: {
          candidate_id?: string
          candidate_kind?: string
          display_name?: string | null
          ecosystem?: string | null
          homepage_url?: string | null
          package_name?: string | null
          primary_language?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_library_candidate_id_candidate_kind_fkey"
            columns: ["candidate_id", "candidate_kind"]
            isOneToOne: false
            referencedRelation: "candidate"
            referencedColumns: ["id", "candidate_kind"]
          },
          {
            foreignKeyName: "candidate_library_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: true
            referencedRelation: "candidate"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_mcp_server: {
        Row: {
          candidate_id: string
          candidate_kind: string
          ecosystem: string | null
          name: string | null
          package_name: string | null
          registry_id: string | null
          repository_url: string | null
          transport_kinds: string[]
        }
        Insert: {
          candidate_id: string
          candidate_kind?: string
          ecosystem?: string | null
          name?: string | null
          package_name?: string | null
          registry_id?: string | null
          repository_url?: string | null
          transport_kinds?: string[]
        }
        Update: {
          candidate_id?: string
          candidate_kind?: string
          ecosystem?: string | null
          name?: string | null
          package_name?: string | null
          registry_id?: string | null
          repository_url?: string | null
          transport_kinds?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "candidate_mcp_server_candidate_id_candidate_kind_fkey"
            columns: ["candidate_id", "candidate_kind"]
            isOneToOne: false
            referencedRelation: "candidate"
            referencedColumns: ["id", "candidate_kind"]
          },
          {
            foreignKeyName: "candidate_mcp_server_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: true
            referencedRelation: "candidate"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_organization: {
        Row: {
          candidate_id: string
          candidate_kind: string
          display_name: string | null
          identifiers: Json
          legal_name: string | null
          website_url: string | null
        }
        Insert: {
          candidate_id: string
          candidate_kind?: string
          display_name?: string | null
          identifiers?: Json
          legal_name?: string | null
          website_url?: string | null
        }
        Update: {
          candidate_id?: string
          candidate_kind?: string
          display_name?: string | null
          identifiers?: Json
          legal_name?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_organization_candidate_id_candidate_kind_fkey"
            columns: ["candidate_id", "candidate_kind"]
            isOneToOne: false
            referencedRelation: "candidate"
            referencedColumns: ["id", "candidate_kind"]
          },
          {
            foreignKeyName: "candidate_organization_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: true
            referencedRelation: "candidate"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_paper: {
        Row: {
          arxiv_id: string | null
          candidate_id: string
          candidate_kind: string
          doi: string | null
          openreview_id: string | null
          published_on: string | null
          title: string | null
        }
        Insert: {
          arxiv_id?: string | null
          candidate_id: string
          candidate_kind?: string
          doi?: string | null
          openreview_id?: string | null
          published_on?: string | null
          title?: string | null
        }
        Update: {
          arxiv_id?: string | null
          candidate_id?: string
          candidate_kind?: string
          doi?: string | null
          openreview_id?: string | null
          published_on?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_paper_candidate_id_candidate_kind_fkey"
            columns: ["candidate_id", "candidate_kind"]
            isOneToOne: false
            referencedRelation: "candidate"
            referencedColumns: ["id", "candidate_kind"]
          },
          {
            foreignKeyName: "candidate_paper_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: true
            referencedRelation: "candidate"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_person: {
        Row: {
          candidate_id: string
          candidate_kind: string
          display_name: string | null
          family_name: string | null
          given_name: string | null
          headline: string | null
          identifiers: Json
        }
        Insert: {
          candidate_id: string
          candidate_kind?: string
          display_name?: string | null
          family_name?: string | null
          given_name?: string | null
          headline?: string | null
          identifiers?: Json
        }
        Update: {
          candidate_id?: string
          candidate_kind?: string
          display_name?: string | null
          family_name?: string | null
          given_name?: string | null
          headline?: string | null
          identifiers?: Json
        }
        Relationships: [
          {
            foreignKeyName: "candidate_person_candidate_id_candidate_kind_fkey"
            columns: ["candidate_id", "candidate_kind"]
            isOneToOne: false
            referencedRelation: "candidate"
            referencedColumns: ["id", "candidate_kind"]
          },
          {
            foreignKeyName: "candidate_person_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: true
            referencedRelation: "candidate"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_product: {
        Row: {
          candidate_id: string
          candidate_kind: string
          display_name: string | null
          homepage_url: string | null
          vendor_name: string | null
        }
        Insert: {
          candidate_id: string
          candidate_kind?: string
          display_name?: string | null
          homepage_url?: string | null
          vendor_name?: string | null
        }
        Update: {
          candidate_id?: string
          candidate_kind?: string
          display_name?: string | null
          homepage_url?: string | null
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_product_candidate_id_candidate_kind_fkey"
            columns: ["candidate_id", "candidate_kind"]
            isOneToOne: false
            referencedRelation: "candidate"
            referencedColumns: ["id", "candidate_kind"]
          },
          {
            foreignKeyName: "candidate_product_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: true
            referencedRelation: "candidate"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_repository: {
        Row: {
          candidate_id: string
          candidate_kind: string
          host: string | null
          name: string | null
          owner: string | null
          primary_language: string | null
        }
        Insert: {
          candidate_id: string
          candidate_kind?: string
          host?: string | null
          name?: string | null
          owner?: string | null
          primary_language?: string | null
        }
        Update: {
          candidate_id?: string
          candidate_kind?: string
          host?: string | null
          name?: string | null
          owner?: string | null
          primary_language?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_repository_candidate_id_candidate_kind_fkey"
            columns: ["candidate_id", "candidate_kind"]
            isOneToOne: false
            referencedRelation: "candidate"
            referencedColumns: ["id", "candidate_kind"]
          },
          {
            foreignKeyName: "candidate_repository_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: true
            referencedRelation: "candidate"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_talk: {
        Row: {
          candidate_id: string
          candidate_kind: string
          delivered_on: string | null
          event_name: string | null
          event_slug: string | null
          title: string | null
        }
        Insert: {
          candidate_id: string
          candidate_kind?: string
          delivered_on?: string | null
          event_name?: string | null
          event_slug?: string | null
          title?: string | null
        }
        Update: {
          candidate_id?: string
          candidate_kind?: string
          delivered_on?: string | null
          event_name?: string | null
          event_slug?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_talk_candidate_id_candidate_kind_fkey"
            columns: ["candidate_id", "candidate_kind"]
            isOneToOne: false
            referencedRelation: "candidate"
            referencedColumns: ["id", "candidate_kind"]
          },
          {
            foreignKeyName: "candidate_talk_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: true
            referencedRelation: "candidate"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_technical_record: {
        Row: {
          candidate_id: string
          candidate_kind: string
          record_kind: string
          scope: Json
          statement: string | null
          structured: Json | null
          title: string | null
        }
        Insert: {
          candidate_id: string
          candidate_kind?: string
          record_kind: string
          scope?: Json
          statement?: string | null
          structured?: Json | null
          title?: string | null
        }
        Update: {
          candidate_id?: string
          candidate_kind?: string
          record_kind?: string
          scope?: Json
          statement?: string | null
          structured?: Json | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_technical_record_candidate_id_candidate_kind_fkey"
            columns: ["candidate_id", "candidate_kind"]
            isOneToOne: false
            referencedRelation: "candidate"
            referencedColumns: ["id", "candidate_kind"]
          },
          {
            foreignKeyName: "candidate_technical_record_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: true
            referencedRelation: "candidate"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_video: {
        Row: {
          candidate_id: string
          candidate_kind: string
          channel: string | null
          external_id: string | null
          platform: string | null
          published_at: string | null
          title: string | null
        }
        Insert: {
          candidate_id: string
          candidate_kind?: string
          channel?: string | null
          external_id?: string | null
          platform?: string | null
          published_at?: string | null
          title?: string | null
        }
        Update: {
          candidate_id?: string
          candidate_kind?: string
          channel?: string | null
          external_id?: string | null
          platform?: string | null
          published_at?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_video_candidate_id_candidate_kind_fkey"
            columns: ["candidate_id", "candidate_kind"]
            isOneToOne: false
            referencedRelation: "candidate"
            referencedColumns: ["id", "candidate_kind"]
          },
          {
            foreignKeyName: "candidate_video_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: true
            referencedRelation: "candidate"
            referencedColumns: ["id"]
          },
        ]
      }
      identity_match: {
        Row: {
          agent_skill_id: string | null
          ai_model_id: string | null
          ai_protocol_id: string | null
          benchmark_id: string | null
          candidate_id: string
          concept_id: string | null
          created_at: string
          dataset_id: string | null
          decided: boolean
          id: string
          library_id: string | null
          match_method: string
          mcp_server_id: string | null
          organization_id: string | null
          paper_id: string | null
          person_id: string | null
          product_id: string | null
          repository_id: string | null
          score: number | null
          talk_id: string | null
          target_kind: string | null
          video_id: string | null
        }
        Insert: {
          agent_skill_id?: string | null
          ai_model_id?: string | null
          ai_protocol_id?: string | null
          benchmark_id?: string | null
          candidate_id: string
          concept_id?: string | null
          created_at?: string
          dataset_id?: string | null
          decided?: boolean
          id?: string
          library_id?: string | null
          match_method: string
          mcp_server_id?: string | null
          organization_id?: string | null
          paper_id?: string | null
          person_id?: string | null
          product_id?: string | null
          repository_id?: string | null
          score?: number | null
          talk_id?: string | null
          target_kind?: string | null
          video_id?: string | null
        }
        Update: {
          agent_skill_id?: string | null
          ai_model_id?: string | null
          ai_protocol_id?: string | null
          benchmark_id?: string | null
          candidate_id?: string
          concept_id?: string | null
          created_at?: string
          dataset_id?: string | null
          decided?: boolean
          id?: string
          library_id?: string | null
          match_method?: string
          mcp_server_id?: string | null
          organization_id?: string | null
          paper_id?: string | null
          person_id?: string | null
          product_id?: string | null
          repository_id?: string | null
          score?: number | null
          talk_id?: string | null
          target_kind?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "identity_match_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate"
            referencedColumns: ["id"]
          },
        ]
      }
      mention: {
        Row: {
          appeared_in_capture_id: string
          candidate_id: string
          created_at: string
          id: string
          snippet_locator_id: string | null
          surface_form: string | null
        }
        Insert: {
          appeared_in_capture_id: string
          candidate_id: string
          created_at?: string
          id?: string
          snippet_locator_id?: string | null
          surface_form?: string | null
        }
        Update: {
          appeared_in_capture_id?: string
          candidate_id?: string
          created_at?: string
          id?: string
          snippet_locator_id?: string | null
          surface_form?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mention_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate"
            referencedColumns: ["id"]
          },
        ]
      }
      resolution_decision: {
        Row: {
          candidate_id: string
          decided_at: string
          decided_by_attempt_id: string | null
          id: string
          identity_match_id: string | null
          intent_id: string | null
          outcome: Database["staging"]["Enums"]["resolution_outcome"]
          rationale: string | null
        }
        Insert: {
          candidate_id: string
          decided_at?: string
          decided_by_attempt_id?: string | null
          id?: string
          identity_match_id?: string | null
          intent_id?: string | null
          outcome: Database["staging"]["Enums"]["resolution_outcome"]
          rationale?: string | null
        }
        Update: {
          candidate_id?: string
          decided_at?: string
          decided_by_attempt_id?: string | null
          id?: string
          identity_match_id?: string | null
          intent_id?: string | null
          outcome?: Database["staging"]["Enums"]["resolution_outcome"]
          rationale?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resolution_decision_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resolution_decision_identity_match_id_fkey"
            columns: ["identity_match_id"]
            isOneToOne: false
            referencedRelation: "identity_match"
            referencedColumns: ["id"]
          },
        ]
      }
      vetting_decision: {
        Row: {
          candidate_id: string
          decided_at: string
          decided_by_attempt_id: string | null
          id: string
          outcome: Database["staging"]["Enums"]["vetting_outcome"]
          rationale: string
          review_task_id: string | null
        }
        Insert: {
          candidate_id: string
          decided_at?: string
          decided_by_attempt_id?: string | null
          id?: string
          outcome: Database["staging"]["Enums"]["vetting_outcome"]
          rationale: string
          review_task_id?: string | null
        }
        Update: {
          candidate_id?: string
          decided_at?: string
          decided_by_attempt_id?: string | null
          id?: string
          outcome?: Database["staging"]["Enums"]["vetting_outcome"]
          rationale?: string
          review_task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vetting_decision_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidate"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      candidate_status:
        | "discovered"
        | "enriched"
        | "matched"
        | "resolved"
        | "promoted"
        | "quarantined"
        | "rejected"
      resolution_outcome:
        | "insert"
        | "update"
        | "link"
        | "merge"
        | "supersede"
        | "no_op"
        | "quarantine"
        | "reject"
        | "review"
      vetting_outcome:
        | "approved_for_metrics"
        | "approved_for_research"
        | "approved_provisionally"
        | "deferred"
        | "insufficient_evidence"
        | "out_of_scope"
        | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  taxonomy: {
    Tables: {
      assignment: {
        Row: {
          advanced_usage_pattern_id: string | null
          agent_skill_id: string | null
          ai_model_id: string | null
          ai_protocol_id: string | null
          concept_id: string | null
          confidence: number | null
          created_at: string
          created_by_receipt_id: string | null
          failure_mode_id: string | null
          id: string
          lesson_id: string | null
          library_id: string | null
          mcp_server_id: string | null
          method: string
          organization_id: string | null
          paper_id: string | null
          person_id: string | null
          product_id: string | null
          provenance_claim_id: string | null
          repository_id: string | null
          review_task_id: string | null
          solution_pattern_id: string | null
          talk_id: string | null
          target_kind: string | null
          technical_problem_id: string | null
          tenant_id: string
          term_id: string
          valid_from: string
          valid_to: string | null
          video_id: string | null
        }
        Insert: {
          advanced_usage_pattern_id?: string | null
          agent_skill_id?: string | null
          ai_model_id?: string | null
          ai_protocol_id?: string | null
          concept_id?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string | null
          failure_mode_id?: string | null
          id?: string
          lesson_id?: string | null
          library_id?: string | null
          mcp_server_id?: string | null
          method: string
          organization_id?: string | null
          paper_id?: string | null
          person_id?: string | null
          product_id?: string | null
          provenance_claim_id?: string | null
          repository_id?: string | null
          review_task_id?: string | null
          solution_pattern_id?: string | null
          talk_id?: string | null
          target_kind?: string | null
          technical_problem_id?: string | null
          tenant_id?: string
          term_id: string
          valid_from?: string
          valid_to?: string | null
          video_id?: string | null
        }
        Update: {
          advanced_usage_pattern_id?: string | null
          agent_skill_id?: string | null
          ai_model_id?: string | null
          ai_protocol_id?: string | null
          concept_id?: string | null
          confidence?: number | null
          created_at?: string
          created_by_receipt_id?: string | null
          failure_mode_id?: string | null
          id?: string
          lesson_id?: string | null
          library_id?: string | null
          mcp_server_id?: string | null
          method?: string
          organization_id?: string | null
          paper_id?: string | null
          person_id?: string | null
          product_id?: string | null
          provenance_claim_id?: string | null
          repository_id?: string | null
          review_task_id?: string | null
          solution_pattern_id?: string | null
          talk_id?: string | null
          target_kind?: string | null
          technical_problem_id?: string | null
          tenant_id?: string
          term_id?: string
          valid_from?: string
          valid_to?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignment_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "term"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_review_requirement: {
        Row: {
          created_at: string
          facet_id: string
          requires_review: boolean
          rule: Json
        }
        Insert: {
          created_at?: string
          facet_id: string
          requires_review?: boolean
          rule?: Json
        }
        Update: {
          created_at?: string
          facet_id?: string
          requires_review?: boolean
          rule?: Json
        }
        Relationships: [
          {
            foreignKeyName: "assignment_review_requirement_facet_id_fkey"
            columns: ["facet_id"]
            isOneToOne: true
            referencedRelation: "facet"
            referencedColumns: ["id"]
          },
        ]
      }
      facet: {
        Row: {
          cardinality: string
          created_at: string
          description: string | null
          id: string
          label: string
          slug: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          cardinality?: string
          created_at?: string
          description?: string | null
          id?: string
          label: string
          slug: string
          tenant_id?: string
          updated_at?: string
        }
        Update: {
          cardinality?: string
          created_at?: string
          description?: string | null
          id?: string
          label?: string
          slug?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      facet_version: {
        Row: {
          approved_at: string | null
          approved_by_review_task_id: string | null
          created_at: string
          facet_id: string
          id: string
          notes: string | null
          status: Database["taxonomy"]["Enums"]["facet_status"]
          version: number
        }
        Insert: {
          approved_at?: string | null
          approved_by_review_task_id?: string | null
          created_at?: string
          facet_id: string
          id?: string
          notes?: string | null
          status?: Database["taxonomy"]["Enums"]["facet_status"]
          version: number
        }
        Update: {
          approved_at?: string | null
          approved_by_review_task_id?: string | null
          created_at?: string
          facet_id?: string
          id?: string
          notes?: string | null
          status?: Database["taxonomy"]["Enums"]["facet_status"]
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "facet_version_facet_id_fkey"
            columns: ["facet_id"]
            isOneToOne: false
            referencedRelation: "facet"
            referencedColumns: ["id"]
          },
        ]
      }
      term: {
        Row: {
          created_at: string
          definition: string | null
          facet_version_id: string
          id: string
          label: string
          parent_term_id: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          definition?: string | null
          facet_version_id: string
          id?: string
          label: string
          parent_term_id?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          definition?: string | null
          facet_version_id?: string
          id?: string
          label?: string
          parent_term_id?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "term_facet_version_id_fkey"
            columns: ["facet_version_id"]
            isOneToOne: false
            referencedRelation: "facet_version"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "term_parent_term_id_fkey"
            columns: ["parent_term_id"]
            isOneToOne: false
            referencedRelation: "term"
            referencedColumns: ["id"]
          },
        ]
      }
      term_relation: {
        Row: {
          created_at: string
          from_term_id: string
          relation_kind: string
          to_term_id: string
        }
        Insert: {
          created_at?: string
          from_term_id: string
          relation_kind: string
          to_term_id: string
        }
        Update: {
          created_at?: string
          from_term_id?: string
          relation_kind?: string
          to_term_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "term_relation_from_term_id_fkey"
            columns: ["from_term_id"]
            isOneToOne: false
            referencedRelation: "term"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "term_relation_to_term_id_fkey"
            columns: ["to_term_id"]
            isOneToOne: false
            referencedRelation: "term"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      facet_status: "draft" | "active" | "retired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  util: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_tenant_id: { Args: never; Returns: string }
      default_tenant_id: { Args: never; Returns: string }
      ensure_month_partitions: {
        Args: { p_months_ahead?: number }
        Returns: number
      }
      uuidv7: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  api: {
    Enums: {},
  },
  corpus: {
    Enums: {},
  },
  curriculum: {
    Enums: {
      publish_status: ["draft", "in_review", "published", "retired"],
    },
  },
  evaluation: {
    Enums: {
      gate_action: [
        "block",
        "quarantine",
        "repair",
        "rerun",
        "review",
        "escalate",
        "optimize",
        "allow",
      ],
      review_state: [
        "open",
        "claimed",
        "in_review",
        "decided",
        "escalated",
        "cancelled",
      ],
    },
  },
  evidence: {
    Enums: {
      claim_status: [
        "proposed",
        "verified",
        "disputed",
        "retracted",
        "superseded",
      ],
      support_verdict: [
        "directly_supported",
        "supported_with_qualification",
        "partially_supported",
        "context_only",
        "contradicted",
        "not_supported",
        "unverifiable",
      ],
    },
  },
  knowledge: {
    Enums: {
      maturity: ["experimental", "emerging", "established", "declining"],
      revalidation_state: [
        "fresh",
        "due",
        "in_progress",
        "stale",
        "failed",
        "retired",
      ],
    },
  },
  observability: {
    Enums: {},
  },
  orchestration: {
    Enums: {
      attempt_outcome: [
        "succeeded",
        "failed",
        "timeout",
        "cancelled",
        "rejected",
      ],
      bucket_class: [
        "source_captures",
        "candidate",
        "accepted",
        "ledger",
        "published",
      ],
      mission_status: [
        "created",
        "planning",
        "running",
        "paused",
        "blocked",
        "succeeded",
        "failed",
        "cancelled",
        "superseded",
      ],
      work_item_status: [
        "pending",
        "ready",
        "running",
        "blocked",
        "succeeded",
        "failed",
        "cancelled",
        "skipped",
      ],
    },
  },
  public: {
    Enums: {
      research_category_assignment_role: ["primary", "secondary"],
      research_content_form: [
        "talk",
        "tutorial",
        "demo",
        "panel",
        "interview",
        "workshop",
        "keynote",
      ],
      research_difficulty: [
        "introductory",
        "intermediate",
        "advanced",
        "expert",
      ],
      research_engineering_category_code: [
        "model_foundations_behavior",
        "inference_model_systems",
        "ai_data_engineering",
        "post_training_continual_learning",
        "prompting_llm_programming",
        "context_engineering_memory",
        "retrieval_search_knowledge",
        "agent_architecture_harnesses",
        "tools_protocols_integrations",
        "orchestration_durable_execution",
        "coding_agents_software_engineering",
        "evaluation_testing_benchmarking",
        "observability_reliability_llmops",
        "security_safety_identity_governance",
        "multimodal_realtime_systems",
        "ai_product_ux_human_factors",
        "ai_platforms_developer_tooling",
      ],
      research_entity_kind: [
        "person",
        "organization",
        "product",
        "model",
        "protocol",
        "dataset",
        "benchmark",
        "paper",
        "repository",
        "other",
      ],
      research_evidence_level: [
        "anecdotal",
        "case_study",
        "benchmarked",
        "production_system",
        "research_paper",
      ],
      research_evidence_source_kind: ["transcript", "description", "web"],
      research_intent_event_status: ["pending", "applied", "skipped", "failed"],
      research_intent_status: ["draft", "validated", "applied", "rejected"],
      research_lifecycle_stage: [
        "research",
        "design",
        "implementation",
        "evaluation",
        "deployment",
        "operations",
        "governance",
      ],
      research_organization_domain_code: [
        "frontier_model_lab",
        "applied_ai_research_lab",
        "cloud_ai_platform",
        "ai_compute_hardware_systems",
        "model_training_inference_platform",
        "ai_data_curation_training_platform",
        "database_data_ai_platform",
        "retrieval_knowledge_platform",
        "agent_framework_orchestration",
        "ai_developer_platform_sdk",
        "coding_agents_developer_tools",
        "evaluation_observability_llmops",
        "ai_security_identity_governance",
        "multimodal_voice_media_ai",
        "robotics_embodied_edge_ai",
        "enterprise_ai_automation",
        "horizontal_ai_application",
        "vertical_ai_application",
        "open_source_ai_ecosystem",
        "ai_protocol_standards_body",
        "academic_nonprofit_research",
        "ai_services_consulting",
        "ai_community_education_media",
        "ai_adopting_product_company",
        "general_technology_ai_unit",
        "diversified_technology_company",
        "other_unknown",
      ],
      research_organization_scope: [
        "independent_company",
        "parent_company",
        "subsidiary",
        "division",
        "research_lab",
        "product_organization",
        "standards_body",
        "academic_institution",
        "nonprofit",
        "community_education_media",
        "other",
      ],
      research_pre_research_run_status: [
        "queued",
        "claimed",
        "analyzing",
        "intent_ready",
        "applying",
        "applied",
        "review_required",
        "failed",
        "superseded",
        "research_complete",
        "synthesizing",
      ],
      research_resource_type: [
        "repository",
        "code_example",
        "documentation",
        "paper",
        "article",
        "slides",
        "dataset",
        "benchmark",
        "model",
        "demo",
        "course",
        "other",
      ],
      research_taxonomy_status: ["draft", "active", "retired"],
      research_verification_status: [
        "verified",
        "likely",
        "uncertain",
        "rejected",
      ],
      research_video_organization_role: [
        "primary_featured_organization",
        "implementation_owner",
        "speaker_employer",
        "parent_organization",
        "subsidiary_or_division",
        "acquisition_party",
        "partner",
        "customer_or_internal_user",
        "standards_steward",
        "mentioned_only",
      ],
    },
  },
  ranking: {
    Enums: {
      approval_state: [
        "draft",
        "proposed",
        "approved",
        "deprecated",
        "rejected",
      ],
    },
  },
  research: {
    Enums: {
      bundle_status: ["assembling", "complete", "failed", "superseded"],
      finding_resolution: [
        "pending",
        "promoted",
        "rejected",
        "deferred",
        "merged",
      ],
    },
  },
  research_private: {
    Enums: {},
  },
  retrieval: {
    Enums: {
      backend_kind: ["vector_bucket", "pgvector"],
      space_class: ["canonical", "exploratory"],
    },
  },
  staging: {
    Enums: {
      candidate_status: [
        "discovered",
        "enriched",
        "matched",
        "resolved",
        "promoted",
        "quarantined",
        "rejected",
      ],
      resolution_outcome: [
        "insert",
        "update",
        "link",
        "merge",
        "supersede",
        "no_op",
        "quarantine",
        "reject",
        "review",
      ],
      vetting_outcome: [
        "approved_for_metrics",
        "approved_for_research",
        "approved_provisionally",
        "deferred",
        "insufficient_evidence",
        "out_of_scope",
        "rejected",
      ],
    },
  },
  taxonomy: {
    Enums: {
      facet_status: ["draft", "active", "retired"],
    },
  },
  util: {
    Enums: {},
  },
} as const
