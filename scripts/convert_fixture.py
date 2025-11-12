#!/usr/bin/env python3
import csv
from datetime import datetime, timedelta
from pathlib import Path

INPUT = Path('advanced_fixture_2025111261716.csv')
OUTPUT = Path('tmp/converted_fixture.csv')
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

# Template headers
headers = [
    'event_name','start_date','end_date','start_time','end_time','description',
    'location','access_groups','rsvp','comments','attendance_tracking','duty_roster','ticketing','reference_id'
]

def parse_date(d):
    # expect dd/mm/YYYY or dd/mm/YYYY, dd/mm/YYYY
    if ',' in d:
        d = d.split(',')[0].strip()
    parts = d.split('/')
    if len(parts) < 3:
        return ''
    day, month, year = parts
    return f"{year}-{month.zfill(2)}-{day.zfill(2)}"


def convert_row(row, headers_map, access_group='Public', settings=None):
    # settings: dict with gameDuration (minutes) and booleans
    if settings is None:
        settings = {}
    duration = int(settings.get('gameDuration', 120))
    time = row.get('Time','')
    start_time = time
    end_time = ''
    if time and ':' in time:
        try:
            hour, minute = time.split(':')
            start_dt = datetime(2000,1,1,int(hour),int(minute))
            end_dt = start_dt + timedelta(minutes=duration)
            end_time = end_dt.strftime('%H:%M')
        except Exception:
            end_time = ''

    # Determine event name: use Home Team vs Away Team for all matches
    home = (row.get('Home Team') or '').strip()
    away = (row.get('Away Team') or '').strip()
    grade = (row.get('Grade') or '').strip()
    # prefer Playing Surface then Venue for location
    location = row.get('Playing Surface') or row.get('Venue') or ''

    event_name = f"{grade} {home} vs {away}".strip()

    # reference id: keep empty as requested
    reference_id = ''

    return [
        event_name,
        parse_date(row.get('Game Date','')),
        parse_date(row.get('Game Date','')),
        start_time,
        end_time,
        f"{row.get('Game Type','')} {row.get('Round','')}: {home} vs {away}",
        location,
        # default access group: home team (so each team's events can be separated later)
        home or access_group,
        'true',
        'true' if settings.get('enableComments') else 'false',
        'true' if settings.get('trackAttendance') else 'false',
        'true' if settings.get('enableDutyRoster') else 'false',
        'true' if settings.get('enableTicketing') else 'false',
        reference_id
    ]


def main():
    with INPUT.open(newline='') as f:
        reader = csv.reader(f)
        records = list(reader)
    if not records:
        print('No records found')
        return
    original_headers = [h.strip('"') for h in records[0]]
    data_rows = records[1:]

    # map rows to dicts
    rows = []
    for r in data_rows:
        d = {original_headers[i]: (r[i] if i < len(r) else '') for i in range(len(original_headers))}
        rows.append(d)

    # sample settings
    settings = {'gameDuration': 120, 'enableComments': True, 'trackAttendance': False, 'enableDutyRoster': False, 'enableTicketing': False}

    converted = [headers]
    for row in rows:
        converted.append(convert_row(row, original_headers, access_group='Public', settings=settings))

    with OUTPUT.open('w', newline='') as out:
        writer = csv.writer(out)
        writer.writerows(converted)

    print('Wrote', OUTPUT)
    print('\nSample:')
    for line in converted[:5]:
        print(line)

if __name__ == '__main__':
    main()
