"""
Tests for the Fixture model.
"""
from wscc_fixtures.models import Fixture

def test_fixture_from_advanced_format(sample_advanced_data, sample_fixture):
    """Test creating a Fixture from advanced format data."""
    fixture = Fixture.from_advanced_format(sample_advanced_data)
    
    assert fixture.event_name == sample_fixture.event_name
    assert fixture.start_date == sample_fixture.start_date
    assert fixture.end_date == sample_fixture.end_date
    assert fixture.start_time == sample_fixture.start_time
    assert fixture.end_time == sample_fixture.end_time
    assert fixture.description == sample_fixture.description
    assert fixture.location == sample_fixture.location
    assert fixture.access_groups == sample_fixture.access_groups
    assert fixture.reference_id == sample_fixture.reference_id