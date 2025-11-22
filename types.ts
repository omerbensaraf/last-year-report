import { LucideIcon } from 'lucide-react';

export interface KPI {
  label: string;
  value: string;
  trend?: string; // e.g., "+15%"
  positive?: boolean;
}

export interface BulletPoint {
  title: string;
  description: string;
  lesson?: string;      // The highlighted lesson text
  lessonColor?: string; // Tailwind color class for the lesson
}

export interface SectionContent {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  description: string;
  kpis?: KPI[];
  bullets?: BulletPoint[];
  tags?: string[];
  imagePrompt?: string; // For placeholder generation logic if needed
  projects?: string[]; // New field for project lists
  illustration?: string; // URL for a section-specific image/gif
  galleryImages?: string[]; // List of URLs for the gallery section
}

export type SectionId = 
  | 'identity' 
  | 'success' 
  | 'challenges' 
  | 'focus' 
  | 'innovation' 
  | 'people' 
  | 'closing'
  | 'gallery';