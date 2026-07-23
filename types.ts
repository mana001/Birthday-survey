export type ThemeMode = 'day' | 'night';

export type ScreenState = 'landing' | 'members' | 'survey' | 'submissions';

export interface Member {
  id: string;
  name: string;
  title: string; // e.g. "Zeus - Ruler of Mount Olympus"
  defaultNickname: string;
  code: string;
  avatarIcon: string;
  quote: string;
  color: string;
}

export type QuestionType = 'single' | 'multiple' | 'text';

export interface QuizQuestion {
  id: string;
  segment: 1 | 2;
  title: string;
  subtitle?: string;
  type: QuestionType;
  placeholder?: string;
  options?: {
    id: string;
    text: string;
    icon?: string;
    isCorrect?: boolean; // Only for Segment 1
  }[];
  correctAnswersKeywords?: string[]; // Keywords for grading Segment 1 text input questions
  explanation?: string; // For segment 1 when answered
}

export interface MemberAnswer {
  questionId: string;
  selectedOptionIds: string[];
  textAnswer?: string;
  pointsEarned?: number; // Calculated for Segment 1
  maxPoints?: number;
}

export interface HighScorePrivilege {
  type: 'dare' | 'wish' | 'question' | 'request';
  content: string;
  punishmentPenalty?: string;
}

export interface SurveySubmission {
  id: string;
  memberId: string;
  nickname: string;
  submittedAt: string; // ISO String
  segment1Score: number;
  segment1MaxScore: number;
  answers: MemberAnswer[];
  relationshipNotes?: string;
  highScorePrivilege?: HighScorePrivilege;
}

export interface AppState {
  theme: ThemeMode;
  isOwner: boolean;
  isResultsPublished: boolean;
  activeMember: Member | null;
  activeNickname: string;
  submissions: SurveySubmission[];
}
