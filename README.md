# Western Suburbs Cricket Club Fixture Converter

A web-based tool to convert cricket fixture files for Western Suburbs Cricket Club into a standardized format for their scheduling system.

## Features

- Easy-to-use web interface
- Support for different team categories
- Customizable game settings
  - Game duration
  - Attendance tracking
  - Comments
  - Duty roster
  - Ticketing options
- CSV file conversion
- Preview before download
- Responsive design

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- CSV parsing and generation

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yogigodaraa/western-suburbs-cricket-club-fixture-converter.git
cd western-suburbs-cricket-club-fixture-converter
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Select your team category from the dropdown
2. Configure game settings
3. Upload your CSV fixture file
4. Preview the conversion
5. Download the converted file

## File Format

### Input Format
The input CSV should contain the following columns:
- Game Date
- Game Type
- Grade
- Round
- Time
- Home Team
- Away Team
- Playing Surface
- Game ID

### Output Format
The converted CSV will contain:
- event_name
- start_date
- end_date
- start_time
- end_time
- description
- location
- access_groups
- rsvp
- comments
- attendance_tracking
- duty_roster
- ticketing
- reference_id

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
