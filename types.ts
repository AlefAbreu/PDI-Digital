export interface SurveyQuestion {
  id: number;
  text: string;
  category: string;
}

export interface MaturityLevelInfo {
  level: number;
  name: string;
  description: string;
  characteristics: string[];
}

export interface AIGeneratedSuggestion {
  title: string;
  description: string;
  steps: string[];
}

export type UserType = 'mentor' | 'mentee';

export interface User {
  id: string;
  name: string;
  type: UserType;
}

export interface DevelopmentActivity {
  id: string;
  title: string;
  description: string;
  steps: string[];
  dueDate: string; // ISO string
  status: 'draft' | 'assigned' | 'in_progress' | 'completed';
  isAI?: boolean;
  pdfAttachment?: {
    name: string;
    url: string;
  };
}

export interface MenteeProfile extends User {
  type: 'mentee';
  registrationNumber: string;
  mentorId: string;
  surveyAnswers?: number[];
  mentorSurveyAnswers?: number[];
  maturityLevel?: MaturityLevelInfo;
  developmentPlan: DevelopmentActivity[];
}

// Type alias to satisfy MenteeDashboard props which uses both Mentee and MenteeProfile
export type Mentee = MenteeProfile;
