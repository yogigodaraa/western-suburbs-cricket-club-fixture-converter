import { NextRequest } from 'next/server';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { processFixtureData } from '@/utils/fixtureConverter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File;
    const accessGroup = data.get('accessGroup') as string;
    const settings = JSON.parse(data.get('settings') as string);
    
    if (!file) {
      console.error('No file provided in request');
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing file: ${file.name}, size: ${file.size}`);
    const fileContent = await file.text();
    const originalRecords = parse(fileContent, {
      skip_empty_lines: true,
      trim: true
    });

    // Process the data for conversion preview
    const { headers: convertedHeaders, rows: convertedRows } = processFixtureData(
      originalRecords,
      accessGroup,
      settings
    );

    // Generate CSV string for converted data
    const convertedCsv = stringify([convertedHeaders, ...convertedRows]);

    return new Response(
      JSON.stringify({
        original: {
          headers: originalRecords[0],
          rows: originalRecords.slice(1),
          rawCsv: fileContent
        },
        converted: {
          headers: convertedHeaders,
          rows: convertedRows,
          rawCsv: convertedCsv
        }
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Error processing file:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error processing file',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}