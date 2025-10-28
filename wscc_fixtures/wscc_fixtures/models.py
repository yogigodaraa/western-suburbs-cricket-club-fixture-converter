"""
WSCC Fixtures data models.
"""
from dataclasses import dataclass
from datetime import datetime, time
from typing import Optional

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
        game_time = datetime.strptime(data['Time'], '%H:%M').time()
        end_time = time(game_time.hour + 2, game_time.minute)  # Assume 2 hours duration

        event_name = f"{data['Grade']} vs {data['Home Team'] if 'Western Suburbs' in data['Away Team'] else data['Away Team']}"
        description = f"{data['Game Type']} {data['Round']}: {data['Home Team']} vs {data['Away Team']}"

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