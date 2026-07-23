import { SurveySubmission, ThemeMode } from '../types';
import { INITIAL_SEED_SUBMISSIONS } from '../data/surveyData';

const SUBMISSIONS_KEY = 'olympia_survey_submissions_v1';
const PUBLISHED_KEY = 'olympia_survey_published_v1';
const THEME_KEY = 'olympia_survey_theme_v1';

export function getStoredSubmissions(): SurveySubmission[] {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    if (!raw) {
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(INITIAL_SEED_SUBMISSIONS));
      return INITIAL_SEED_SUBMISSIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load submissions from storage', e);
    return INITIAL_SEED_SUBMISSIONS;
  }
}

export function saveSubmission(submission: SurveySubmission): SurveySubmission[] {
  const current = getStoredSubmissions();
  // Filter out any existing submission by same member to allow updating
  const filtered = current.filter((s) => s.memberId !== submission.memberId);
  const updated = [submission, ...filtered];
  try {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save submission', e);
  }
  return updated;
}

export function getStoredPublishedState(): boolean {
  try {
    const raw = localStorage.getItem(PUBLISHED_KEY);
    return raw === 'true';
  } catch (e) {
    return false;
  }
}

export function setStoredPublishedState(isPublished: boolean): void {
  try {
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(isPublished));
  } catch (e) {
    console.error('Failed to set published state', e);
  }
}

export function getStoredTheme(): ThemeMode {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    return (raw as ThemeMode) || 'day';
  } catch (e) {
    return 'day';
  }
}

export function setStoredTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error('Failed to save theme', e);
  }
}

export function resetAllSubmissions(): SurveySubmission[] {
  try {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(INITIAL_SEED_SUBMISSIONS));
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(false));
  } catch (e) {
    console.error('Failed to reset submissions', e);
  }
  return INITIAL_SEED_SUBMISSIONS;
}
