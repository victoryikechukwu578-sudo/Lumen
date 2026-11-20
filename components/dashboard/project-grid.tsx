"use client";

import { Project } from "@/types/project";
import { Card } from "../ui/card";
import { ProjectCard } from "./project-card";
import { Plus } from "lucide-react"; // Assuming Plus icon is imported from lucide-react

export interface ProjectGridProps {
  projects: Project[];
  projectFiles: Record<string, Record<string, string>> | undefined;
  onNewProject: () => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProjectGrid({
  projects,
  projectFiles,
  onNewProject,
  onRename,
  onDelete,
}: ProjectGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* New Project Action Card */}
      <Card
        className="flex h-full cursor-pointer items-center justify-center gap-2 border-dashed transition-all duration-150 hover:brightness-[1.08]"
        onClick={onNewProject}
      >
        <Plus className="size-5 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          New Project
        </span>
      </Card>

      {/* Existing Project Cards Map */}
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          files={projectFiles?.[project.id] ?? {}}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}