"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Project } from "@/lib/types";

interface ProjectSelectorProps {
  selectedProjectId: string;
  onProjectChange: (projectId: string) => void;
  projects: Project[];
}

export function ProjectSelector({
  selectedProjectId,
  onProjectChange,
  projects,
}: ProjectSelectorProps) {
  return (
    <div className="w-full space-y-2">
      <label
        htmlFor="project-select"
        className="text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        Project
      </label>
      <Select value={selectedProjectId} onValueChange={onProjectChange}>
        <SelectTrigger id="project-select" className="w-full">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <span>{project.name}</span>
              </div>
            </SelectItem>
          ))}
          <SelectItem value="__create_new__" className="text-blue-600">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Create new project</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
