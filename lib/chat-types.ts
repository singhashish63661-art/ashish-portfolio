import type { Project } from "@/lib/data";

export type ChatReplyType = "text" | "calendar" | "socials" | "resume" | "project-preview";

export type BackupResponse = {
  text: string;
  type: ChatReplyType;
  data?: Project;
};
