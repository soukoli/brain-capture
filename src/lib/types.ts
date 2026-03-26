// Types for Brain Capture app

export interface Capture {
  id: string;
  content: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  type: "text" | "voice";
}

export interface Project {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdAt: Date;
}

export type CaptureMode = "text" | "voice";

export interface CaptureFormData {
  content: string;
  projectId: string;
  type: CaptureMode;
}
