"use client";

import { Project } from "@/types/project";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const ProjectPreview = dynamic(
  () => import("./project-preview").then((mod) => ({
    default: mod.ProjectPreview,
  })),
  { ssr: false },
);

const VIRTUAL_WIDTH = 1024;
const THUMBNAIL_HEIGHT = 160;

export interface ProjectCardProps {
  project: Project;
  files?: Record<string, string>;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}

function getRelativeTime(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffInSeconds = Math.floor((now - then) / 1000);

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [unit, secondsInUnit] of units) {
    if (diffInSeconds >= secondsInUnit) {
      const value = Math.floor(diffInSeconds / secondsInUnit);
      return formatter.format(-value, unit);
    }
  }

  return "just now";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProjectCard({
  project,
  files,
  onRename,
  onDelete,
}: ProjectCardProps) {
  const router = useRouter();
  const initials = getInitials(project.name);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const hasFiles = files && Object.keys(files).length > 0;
  const [previewReady, setPreviewReady] = useState(false);

  useEffect(() => {
    if (!thumbnailRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerWidth = entry.contentRect.width;
        setScale(containerWidth / VIRTUAL_WIDTH);
      }
    });

    observer.observe(thumbnailRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      onClick={() => router.push(`/project/${project.id}`)}
      className="group cursor-pointer gap-0 overflow-hidden p-0 transition-all duration-150 hover:border-white/20 hover:brightness-[1.05]"
    >
      {/* Preview thumbnail */}
      <div
        ref={thumbnailRef}
        className={cn(
          "relative overflow-hidden",
          hasFiles
            ? "bg-[#1a1a1a]"
            : "bg-gradient-to-br from-[#6d9cff]/20 via-[#c084fc]/20 to-[#f87171]/20"
        )}
        style={{ height: THUMBNAIL_HEIGHT }}
      >
        {hasFiles && scale > 0 ? (
          <div
            className="absolute inset-0 origin-top-left"
            style={{ transform: `scale(${scale})` }}
          >
            <ProjectPreview
              files={files}
              onLoad={() => setPreviewReady(true)}
            />
          </div>
        ) : files === undefined ? (
          <Skeleton className="absolute inset-0 rounded-none" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-2xl font-bold text-muted-foreground/60">
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* Project info + action dropdown */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium">{project.name}</h3>
          <p className="text-xs text-muted-foreground">
            {getRelativeTime(project.updatedAt || project.createdAt)}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              className="opacity-0 group-hover:opacity-100"
              onClick={(event) => event.stopPropagation()}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            onClick={(event) => event.stopPropagation()}
          >
            <DropdownMenuItem onClick={() => onRename(project.id)}>
              <Pencil className="mr-2 size-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(project.id)}
            >
              <Trash2 className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}