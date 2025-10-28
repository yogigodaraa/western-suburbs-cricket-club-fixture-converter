"""
Test fixtures for the converter.
"""
import pytest
from datetime import datetime, time
from wscc_fixtures.models import Fixture
from wscc_fixtures.converter import FixtureConverter

@pytest.fixture
def sample_advanced_data():
    return {
        'Game Date': '02/11/2025',
        'Game Type': 'T20',
        'Grade': 'PSWL North A',
        'Round': 'Round 4',
        'Time': '14:00',
        'Home Team': 'University',
        'Away Team': 'Western Suburbs CC Women\'s',
        'Playing Surface': 'Menzies Park',
        'Game ID': '1178de45-ed5a-40b2-a966-6d6daa821cd7'
    }

@pytest.fixture
def sample_fixture():
    return Fixture(
        event_name='PSWL North A vs University',
        start_date=datetime(2025, 11, 2),
        end_date=datetime(2025, 11, 2),
        start_time=time(14, 0),
        end_time=time(16, 0),
        description='T20 Round 4: University vs Western Suburbs CC Women\'s',
        location='Menzies Park',
        access_groups=['Women\'s'],
        rsvp=False,
        comments=True,
        attendance_tracking=True,
        duty_roster=True,
        ticketing=False,
        reference_id='1178de45-ed5a-40b2-a966-6d6daa821cd7'
    )