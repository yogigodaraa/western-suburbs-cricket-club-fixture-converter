import { NextRequest, NextResponse } from 'next/server';
import { parse as csvParse } from 'csv-parse/sync';
import { stringify as csvStringify } from 'csv-stringify/sync';
import { processFixtureData } from '@/utils/fixtureConverter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  console.log('Received file upload request');
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    console.log('File received:', file.name);

    // Convert file to buffer
    console.log('Converting file to buffer');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const csvContent = buffer.toString('utf-8');
    
    // Parse CSV
    console.log('Parsing CSV file');
    const records = csvParse(csvContent, {
      columns: false,
      skip_empty_lines: true
    }) as string[][];
    
    // Convert records
    console.log('Converting records');
    const accessGroup = (formData.get('accessGroup') as string) || "Women's";
    const settings = JSON.parse((formData.get('settings') as string) || '{}');
    
    // Process through helper function
    const { rows: convertedRows, headers } = processFixtureData(records, accessGroup, settings);
    
    // Convert back to CSV
    console.log('Creating output CSV');
    const outputCsv = csvStringify([headers, ...convertedRows]);
    
    // Create response
    console.log('Sending response');
    return new NextResponse(outputCsv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=converted_${file.name}`,
      },
    });
  } catch (error) {
    console.error('API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Error processing file: ' + errorMessage },
      { status: 500 }
    );
  }
}// Cache bust: Tue Oct 28 21:24:18 AWST 2025
