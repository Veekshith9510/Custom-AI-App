export interface AgendaItem {
  id: string;
  title: string;
  summary: string;
  actionItems: string[];
  stakeholders: string[];
  suggestedPercentage: number; // 0-100
}

export interface MeetingAgenda {
  title: string;
  items: AgendaItem[];
  totalDuration: number; // in minutes
}

export type FileType = 'markdown' | 'docx';
