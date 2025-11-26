import { normalizeTeamName, getDisplayNameFromGrade } from './teamMapping';

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
  // Parse date and time - handle both DD/MM/YYYY and other formats
  let startDate = '';
  try {
    const dateParts = fixture['Game Date'].split('/');
    if (dateParts.length === 3) {
      const day = dateParts[0];
      const month = dateParts[1];
      const year = dateParts[2];
      startDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } else {
      // Fallback if date format is different
      startDate = fixture['Game Date'];
    }
  } catch (e) {
    startDate = fixture['Game Date'];
  }
  
  // Calculate times
  let startTimeStr = '12:00'; // Default to 12:00 PM if no time provided
  let endTimeStr = '14:00';   // Default end time
  
  try {
    // Use provided time or fall back to default
    const timeToUse = fixture['Time'] && fixture['Time'].trim() ? fixture['Time'] : '12:00';
    
    const timeParts = timeToUse.split(':');
    if (timeParts.length >= 2) {
      const hour = parseInt(timeParts[0]);
      const minute = parseInt(timeParts[1]);
      const duration = settings.gameDuration || 120; // default to 120 minutes
      
      const totalMinutes = hour * 60 + minute + duration;
      const endHour = Math.floor(totalMinutes / 60);
      const endMinute = totalMinutes % 60;
      
      startTimeStr = timeToUse;
      endTimeStr = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    }
  } catch (e) {
    startTimeStr = '12:00';
    endTimeStr = '14:00';
  }
  
  // Determine which team is Western Suburbs and normalize names
  const isHomeWSCC = fixture['Home Team'].includes('Western Suburbs');
  const wsccTeam = isHomeWSCC ? fixture['Home Team'] : fixture['Away Team'];
  const opponentTeam = isHomeWSCC ? fixture['Away Team'] : fixture['Home Team'];
  
  const normalizedWSCC = normalizeTeamName(wsccTeam);
  const normalizedOpponent = normalizeTeamName(opponentTeam);
  
  // Get display grade name
  const displayGrade = getDisplayNameFromGrade(fixture['Grade']);

  return {
    event_name: `${displayGrade} vs ${normalizedOpponent}`,
    start_date: startDate,
    end_date: startDate,
    start_time: startTimeStr,
    end_time: endTimeStr,
    description: `${fixture['Game Type']} ${fixture['Round']}: ${normalizedWSCC} vs ${normalizedOpponent}`,
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

  // Convert each row and handle multiple dates
  const convertedRows: string[][] = [];
  
  dataRows.forEach(row => {
    const fixture = originalHeaders.reduce((obj: any, header: string, index: number) => {
      obj[header] = row[index];
      return obj;
    }, {}) as AdvancedFixture;

    // Check if there are multiple dates separated by comma
    const gameDateStr = fixture['Game Date'] || '';
    const dates = gameDateStr.split(',').map(d => d.trim()).filter(d => d);
    
    if (dates.length > 1) {
      // Multiple dates - create a row for each date
      dates.forEach((singleDate, index) => {
        const fixtureForDate = { ...fixture, 'Game Date': singleDate };
        const converted = convertFixture(fixtureForDate, accessGroup, settings);
        convertedRows.push(headers.map(header => converted[header as keyof TemplateFixture]));
      });
    } else {
      // Single date - process normally
      const converted = convertFixture(fixture, accessGroup, settings);
      convertedRows.push(headers.map(header => converted[header as keyof TemplateFixture]));
    }
  });

  return { headers, rows: convertedRows };
}
