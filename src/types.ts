// src/types.ts
export interface Scenario {
    ID: string;
    Summary: string;
    DangerRanking: string; // Keep as string if CSV loads it as string, or change to number if appropriate
    drv: string; // Y/N
    HeightenedCognitiveLoad: string; // Y/P/N - Added back
    SocialMisunderstanding: string; // Y/P/N - Added back
    EssentialActivities: string; // Y/P/N - Added back
    Impact: string; // Text description - Added back
    Narrative?: string; // Optional text
    CuratedWords?: string; // Optional text
    // Add any other columns from your 10-column CSV if they were missed
  }