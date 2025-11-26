"""
Team name mapping for standardizing team names across different formats.
"""

# Map from CSV team names (with sponsorships) to display names
TEAM_NAME_MAPPING = {
    # 2nd Grade (First Grade in display)
    "Hola Health WSCC 1st XI": "First Grade",
    "Hola Health WSCC 1st": "First Grade",
    "WSCC 1st XI": "First Grade",
    
    # 4th Grade (2nd Grade)
    "Kreative Property WSCC 2nd XI": "2nd Grade",
    "Kreative Property WSCC 2nd": "2nd Grade",
    "WSCC 2nd XI": "2nd Grade",
    
    # 5th Grade (3rd Grade)
    "Prestige Liquor WSCC 3rd XI": "3rd Grade",
    "Prestige Liquor WSCC 3rd": "3rd Grade",
    "WSCC 3rd XI": "3rd Grade",
    
    # 7th Grade (4th Grade)
    "Canaccord Genuity WSCC 4th XI": "4th Grade",
    "Canaccord Genuity WSCC 4th": "4th Grade",
    "WSCC 4th XI": "4th Grade",
    
    # One Day Grades
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
    
    # T20 formats
    "X Golf WSCC Colts": "Colts T20",
    "Hola Health WSCC T20 Div 1": "RJR Sports T20 Division 1",
    "Varsity WSCC T20 Div 2": "Twenty20 Div 2",
    "Prestige Liquor WSCC T20 Div 3": "Twenty20 Div 3",
}

def normalize_team_name(team_name: str) -> str:
    """
    Normalize a team name by removing sponsorship prefixes.
    
    Args:
        team_name: The original team name from the CSV
        
    Returns:
        The normalized team name for display
    """
    if not team_name:
        return team_name
    
    # Try exact match first
    if team_name in TEAM_NAME_MAPPING:
        return TEAM_NAME_MAPPING[team_name]
    
    # Try to find a match by extracting the WSCC part
    # This handles cases where the team name might have slight variations
    for original, normalized in TEAM_NAME_MAPPING.items():
        if original.lower() in team_name.lower() or team_name.lower() in original.lower():
            return normalized
    
    # If no mapping found, return original with WSCC removed for cleaner display
    if "WSCC" in team_name:
        return team_name.replace("WSCC", "").strip()
    
    return team_name


def get_display_name_from_grade(grade: str) -> str:
    """
    Get display name from the Grade field in the CSV.
    Maps grade names to user-friendly display names.
    
    Args:
        grade: The grade name from CSV
        
    Returns:
        Display-friendly grade name
    """
    grade_mapping = {
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
    }
    
    return grade_mapping.get(grade, grade)
