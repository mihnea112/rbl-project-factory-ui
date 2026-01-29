"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";

type DbProject = Record<string, any> & {
  id: string;
};

function getImpact(project: DbProject) {
  return (
    project.impact_data ??
    project.impactData ??
    project.impact ??
    project.ai_result ??
    project.aiResult ??
    {}
  );
}

function pickFirst(project: DbProject, keys: string[], fallback: any = null) {
  for (const k of keys) {
    const v = project?.[k];
    if (v !== undefined && v !== null && String(v).trim?.() !== "") return v;
  }
  return fallback;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<DbProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/projects", { cache: "no-store" });
        const json = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(
            json?.error || `Failed to load projects (${res.status})`,
          );
        }

        setProjects((json?.projects ?? []) as DbProject[]);
      } catch (e: any) {
        setError(e?.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Active Projects
          </h1>
          <p className="text-muted-foreground">
            Browse impact projects seeking support across Romania.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Loading projects…</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive text-lg">{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No active projects at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const impact = getImpact(project);
              const beneficiaries =
                impact?.beneficiaries ??
                impact?.beneficiary_count ??
                impact?.beneficiariesCount;
              const ragStatus = impact?.rag_status ?? impact?.ragStatus;

              const rawStage = pickFirst(
                project,
                [
                  "stage",
                  "phase",
                  "lifecycle_stage",
                  "lifecycleStage",
                  "project_stage",
                  "projectStage",
                ],
                null,
              );
              const rawStatus = pickFirst(
                project,
                ["status", "state", "project_status", "projectStatus"],
                null,
              );
              const rawBudget = pickFirst(
                project,
                [
                  "budget",
                  "requested_budget",
                  "requestedBudget",
                  "seed_budget",
                  "seedBudget",
                ],
                null,
              );

              const stageLabel =
                rawStage === "incubation"
                  ? "Incubation"
                  : rawStage === "chapter-pilot"
                    ? "Pilot"
                    : rawStage === "scale"
                      ? "Scaling"
                      : (rawStage ?? "—");

              const budgetNumber =
                typeof rawBudget === "number" ? rawBudget : Number(rawBudget);
              const budgetLabel = Number.isFinite(budgetNumber)
                ? `$${(budgetNumber / 1000).toFixed(0)}K`
                : "—";

              return (
                <Link key={project.id} href={`/app/projects/${project.id}`}>
                  <Card className="p-6 border-border bg-card hover:shadow-lg hover:border-primary/20 transition-all cursor-pointer h-full flex flex-col">
                    {/* Header */}
                    <div className="mb-4">
                      <div className="flex gap-2 mb-3">
                        <Badge className="bg-primary/10 text-primary border-0">
                          {stageLabel}
                        </Badge>
                        <Badge variant="outline" className="border-border">
                          {rawStatus ?? "—"}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-foreground">
                        {pickFirst(
                          project,
                          [
                            "title",
                            "name",
                            "project_title",
                            "projectTitle",
                            "project_name",
                            "projectName",
                          ],
                          "Untitled project",
                        )}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 flex-grow">
                      {pickFirst(
                        project,
                        [
                          "description",
                          "summary",
                          "project_description",
                          "projectDescription",
                          "short_description",
                          "shortDescription",
                        ],
                        "—",
                      )}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Beneficiaries
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {beneficiaries ?? "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Budget
                        </p>
                        <p className="text-lg font-bold text-foreground">
                          {budgetLabel}
                        </p>
                      </div>
                    </div>

                    {/* RAG Status */}
                    {ragStatus ? (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Status
                        </p>
                        <div className="flex gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              ragStatus === "green"
                                ? "bg-emerald-500"
                                : ragStatus === "amber"
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                          />
                          <span className="text-sm font-medium text-foreground capitalize">
                            {String(ragStatus)}
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
