"""
WSCC Fixtures data models.
"""
from dataclasses import dataclass
from datetime import datetime, time
from typing import Optional
from .team_mapping import normalize_team_name, get_display_name_from_grade

@dataclass
class Fixture:
    """Represents a cricket fixture."""
    event_name: str
    start_date: datetime
    end_date: datetime
    start_time: time
    end_time: time
    description: str
    location: str
    access_groups: list[str]
    rsvp: bool
    comments: bool
    attendance_tracking: bool
    duty_roster: bool
    ticketing: bool
    reference_id: str

    @classmethod
    def from_advanced_format(cls, data: dict) -> 'Fixture':
        """Create a Fixture from advanced format data."""
        game_date = datetime.strptime(data['Game Date'], '%d/%m/%Y')
        
        # Handle empty or missing time - default to 12:00
        time_str = data.get('Time', '').strip() or '12:00'
        game_time = datetime.strptime(time_str, '%H:%M').time()
        
        # Calculate end time based on duration (default 2 hours)
        end_hour = game_time.hour + 2
        end_minute = game_time.minute
        if end_hour >= 24:
            end_hour -= 24
        end_time = time(end_hour, end_minute)

        # Determine which team is Western Suburbs
        is_home_wscc = 'Western Suburbs' in data['Home Team']
        wscc_team = data['Home Team'] if is_home_wscc else data['Away Team']
        opponent = data['Away Team'] if is_home_wscc else data['Home Team']
        
        # Normalize team names
        normalized_wscc = normalize_team_name(wscc_team)
        normalized_opponent = normalize_team_name(opponent)
        
        # Get display grade name
        display_grade = get_display_name_from_grade(data['Grade'])
        
        event_name = f"{display_grade} vs {normalized_opponent}"
        description = f"{data['Game Type']} {data['Round']}: {normalized_wscc} vs {normalized_opponent}"

        return cls(
            event_name=event_name,
            start_date=game_date,
            end_date=game_date,
            start_time=game_time,
            end_time=end_time,
            description=description,
            location=data['Playing Surface'],
            access_groups=["Women's"],  # Default for women's league
            rsvp=False,
            comments=True,
            attendance_tracking=True,
            duty_roster=True,
            ticketing=False,
            reference_id=data['Game ID']
        )