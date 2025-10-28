"""
CSV conversion utilities.
"""
import pandas as pd
from datetime import datetime
from .models import Fixture

class FixtureConverter:
    """Converts fixtures between different formats."""

    @staticmethod
    def read_advanced_format(file_path: str) -> list[Fixture]:
        """Read fixtures from advanced format CSV."""
        df = pd.read_csv(file_path)
        fixtures = []
        
        for _, row in df.iterrows():
            fixture = Fixture.from_advanced_format(row)
            fixtures.append(fixture)
            
        return fixtures

    @staticmethod
    def to_template_format(fixtures: list[Fixture]) -> pd.DataFrame:
        """Convert fixtures to template format."""
        records = []
        
        for fixture in fixtures:
            records.append({
                'event_name': fixture.event_name,
                'start_date': fixture.start_date.strftime('%Y-%m-%d'),
                'end_date': fixture.end_date.strftime('%Y-%m-%d'),
                'start_time': fixture.start_time.strftime('%H:%M'),
                'end_time': fixture.end_time.strftime('%H:%M'),
                'description': fixture.description,
                'location': fixture.location,
                'access_groups': ','.join(fixture.access_groups),
                'rsvp': fixture.rsvp,
                'comments': fixture.comments,
                'attendance_tracking': fixture.attendance_tracking,
                'duty_roster': fixture.duty_roster,
                'ticketing': fixture.ticketing,
                'reference_id': fixture.reference_id
            })
            
        return pd.DataFrame.from_records(records)

    def convert_file(self, input_path: str, output_path: str) -> None:
        """Convert a file from advanced format to template format."""
        fixtures = self.read_advanced_format(input_path)
        df = self.to_template_format(fixtures)
        df.to_csv(output_path, index=False)
def validate_fixture_data(data):
    """Validate incoming fixture data"""
    if not data:
        raise ValueError("Empty fixture data")
    required_fields = ["date", "team_home", "team_away"]
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")
    return True
