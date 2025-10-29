type AdvancedFixture = {
  'Game Date': string;
  'Game Type': string;
  'Grade': string;
  'Round': string;
  'Time': string;
  'Home Team': string;
  'Away Team': string;
  'Playing Surface': string;
  'Game ID': string;
};

type TemplateFixture = {
  event_name: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  description: string;
  location: string;
  access_groups: string;
  rsvp: string;
  comments: string;
  attendance_tracking: string;
  duty_roster: string;
  ticketing: string;
  reference_id: string;
};

function convertFixture(fixture: AdvancedFixture, accessGroup: string, settings: any): TemplateFixture {
  // Parse date and time
  const [day, month, year] = fixture['Game Date'].split('/');
  const startDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  
  // Calculate times
  const [hour, minute] = fixture['Time'].split(':');
  const duration = settings.gameDuration || 120; // default to 120 minutes
  const startHour = parseInt(hour);
  const endHourValue = Math.floor(startHour + duration / 60);
  const endMinuteValue = (parseInt(minute) + duration % 60);
  const adjustedEndHour = Math.floor(endHourValue + endMinuteValue / 60);
  const adjustedEndMinute = (endMinuteValue % 60).toString().padStart(2, '0');
  
  // Determine the main team name
  const isHomeTeam = fixture['Away Team'].includes('Western Suburbs');
  const mainTeam = isHomeTeam ? fixture['Home Team'] : fixture['Away Team'];
  const endMinute = (parseInt(minute) + duration % 60).toString().padStart(2, '0');

  return {
    event_name: `${fixture['Grade']} vs ${mainTeam}`,
    start_date: startDate,
    end_date: startDate,
    start_time: fixture['Time'],
    end_time: `${adjustedEndHour}:${adjustedEndMinute}`,
    description: `${fixture['Game Type']} ${fixture['Round']}: ${fixture['Home Team']} vs ${fixture['Away Team']}`,
    location: fixture['Playing Surface'],
    access_groups: accessGroup,
    rsvp: 'true',
    comments: settings.enableComments ? 'true' : 'false',
    attendance_tracking: settings.trackAttendance ? 'true' : 'false',
    duty_roster: settings.enableDutyRoster ? 'true' : 'false',
    ticketing: settings.enableTicketing ? 'true' : 'false',
    reference_id: ''
  };
}

export function processFixtureData(records: string[][], accessGroup: string, settings: any) {
  // Extract headers and data rows
  const [originalHeaders, ...dataRows] = records;
  
  // Map headers to the template format
  const headers = [
    'event_name',
    'start_date',
    'end_date',
    'start_time',
    'end_time',
    'description',
    'location',
    'access_groups',
    'rsvp',
    'comments',
    'attendance_tracking',
    'duty_roster',
    'ticketing',
    'reference_id'
  ];

  // Convert each row
  const convertedRows = dataRows.map(row => {
    const fixture = originalHeaders.reduce((obj: any, header: string, index: number) => {
      obj[header] = row[index];
      return obj;
    }, {}) as AdvancedFixture;

    const converted = convertFixture(fixture, accessGroup, settings);
    return headers.map(header => converted[header as keyof TemplateFixture]);
  });

  return { headers, rows: convertedRows };
}
