/**
 * Team name mapping utilities for standardizing team names
 */

const TEAM_NAME_MAPPING: { [key: string]: string } = {
  // 2nd Grade (First Grade in display)
  "Hola Health WSCC 1st XI": "First Grade",
  "Hola Health WSCC 1st": "First Grade",
  "WSCC 1st XI": "First Grade",
  
  // 4th Grade (2nd Grade)
  "Kreative Property WSCC 2nd XI": "2nd Grade",
  "Kreative Property WSCC 2nd": "2nd Grade",
  "WSCC 2nd XI": "2nd Grade",
  
  // 5th Grade (3rd Grade)
  "Prestige Liquor WSCC 3rd XI": "3rd Grade",
  "Prestige Liquor WSCC 3rd": "3rd Grade",
  "WSCC 3rd XI": "3rd Grade",
  
  // 7th Grade (4th Grade)
  "Canaccord Genuity WSCC 4th XI": "4th Grade",
  "Canaccord Genuity WSCC 4th": "4th Grade",
  "WSCC 4th XI": "4th Grade",
  
  // One Day Grades
  "WSCC One Day 1's": "One Day Grade 1",
  "WSCC One Day 1": "One Day Grade 1",
  "Hola Health WSCC One Day 2's": "One Day Grade 2",
  "Hola Health WSCC One Day 2": "One Day Grade 2",
  "WSCC One Day 3's": "One Day Grade 3",
  "WSCC One Day 3": "One Day Grade 3",
  "WSCC One Day 4's": "One Day Grade 4",
  "WSCC One Day 4": "One Day Grade 4",
  "WSCC One Day 5's": "One Day Grade 5",
  "WSCC One Day 5": "One Day Grade 5",
  
  // T20 formats
  "X Golf WSCC Colts": "Colts T20",
  "Hola Health WSCC T20 Div 1": "RJR Sports T20 Division 1",
  "Varsity WSCC T20 Div 2": "Twenty20 Div 2",
  "Prestige Liquor WSCC T20 Div 3": "Twenty20 Div 3",
};

const GRADE_MAPPING: { [key: string]: string } = {
  "2nd Grade": "1st XI",
  "4th Grade": "2nd XI",
  "5th Grade": "3rd XI",
  "7th Grade": "4th XI",
  "One Day Grade 1": "One Day 1",
  "One Day Grade 2": "One Day 2",
  "One Day Grade 3": "One Day 3",
  "One Day Grade 4": "One Day 4",
  "One Day Grade 5 Black": "One Day 5",
  "One Day Grade 5 Gold": "One Day 5",
  "Colts T20": "Colts",
  "RJR Sports T20 Division 1": "T20 Div 1",
  "Twenty20 Div 2": "T20 Div 2",
  "Twenty20 Div 3": "T20 Div 3",
};

/**
 * Normalize a team name by removing sponsorship prefixes
 */
export function normalizeTeamName(teamName: string): string {
  if (!teamName) {
    return teamName;
  }

  // Try exact match first
  if (teamName in TEAM_NAME_MAPPING) {
    return TEAM_NAME_MAPPING[teamName];
  }

  // Try to find a match by extracting the WSCC part
  for (const [original, normalized] of Object.entries(TEAM_NAME_MAPPING)) {
    if (original.toLowerCase().includes(teamName.toLowerCase()) || 
        teamName.toLowerCase().includes(original.toLowerCase())) {
      return normalized;
    }
  }

  // If no mapping found, return original with WSCC removed for cleaner display
  if (teamName.includes("WSCC")) {
    return teamName.replace("WSCC", "").trim();
  }

  return teamName;
}

/**
 * Get display name from the Grade field
 */
export function getDisplayNameFromGrade(grade: string): string {
  return GRADE_MAPPING[grade] || grade;
}
