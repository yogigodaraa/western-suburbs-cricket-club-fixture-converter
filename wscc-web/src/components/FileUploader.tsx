'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const accessGroups = [
  "Women's",
  "Men's",
  "Junior Boys",
  "Junior Girls",
  "Senior Men's",
  "Senior Women's",
  "Veterans"
] as const;

const defaultSettings = {
  trackAttendance: true,
  enableComments: true,
  enableDutyRoster: true,
  gameDuration: 120, // minutes
  enableTicketing: true,
  generateForAllGrades: true
};

interface PreviewData {
  original: {
    headers: string[];
    rows: string[][];
    rawCsv: string;
  };
  converted: {
    headers: string[];
    rows: string[][];
    rawCsv: string;
  };
}

export default function FileUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedAccessGroup, setSelectedAccessGroup] = useState<typeof accessGroups[number]>(accessGroups[0]);
  const [availableGrades, setAvailableGrades] = useState<string[]>([]); // Will be populated from CSV
  const [selectedGrades, setSelectedGrades] = useState<Set<string>>(new Set()); // All selected by default
  const [showGradesDropdown, setShowGradesDropdown] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const [showHelp, setShowHelp] = useState(true); // Show help by default for new users
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  const toggleGrade = (grade: string) => {
    const newGrades = new Set(selectedGrades);
    if (newGrades.has(grade)) {
      newGrades.delete(grade);
    } else {
      newGrades.add(grade);
    }
    setSelectedGrades(newGrades);
  };

  const toggleAllGrades = () => {
    if (selectedGrades.size === availableGrades.length) {
      setSelectedGrades(new Set());
    } else {
      setSelectedGrades(new Set(availableGrades));
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (file.type !== 'text/csv') {
      setError('Please upload a CSV file');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);
    setPreviewData(null);

    // Read CSV to extract unique grades/teams
    const text = await file.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',').map((h: string) => h.replace(/"/g, '').trim());
    const gradeIndex = headers.indexOf('Grade');
    
    const uniqueGrades = new Set<string>();
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const cells = lines[i].split(',');
        const grade = cells[gradeIndex]?.replace(/"/g, '').trim();
        if (grade) {
          uniqueGrades.add(grade);
        }
      }
    }
    
    const sortedGrades = Array.from(uniqueGrades).sort();
    setAvailableGrades(sortedGrades);
    setSelectedGrades(new Set(sortedGrades)); // Select all by default

    const formData = new FormData();
    formData.append('file', file);
    formData.append('accessGroup', selectedAccessGroup);
    formData.append('selectedGrades', JSON.stringify(sortedGrades));
    formData.append('settings', JSON.stringify(settings));

    try {
      const response = await axios.post('/api/convert/preview', formData);
      setPreviewData(response.data);
      setSuccess('Preview generated successfully! Review the data below and click "Download" when ready.');
    } catch (err) {
      setError('Error processing file. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsUploading(false);
    }
  }, [settings, selectedAccessGroup, selectedGrades]);

  const handleDownload = async () => {
    if (!previewData) return;

    try {
      const formData = new FormData();
      const blob = new Blob([previewData.original.rawCsv], { type: 'text/csv' });
      const file = new File([blob], 'fixture.csv', { type: 'text/csv' });
      formData.append('file', file);
      formData.append('accessGroup', selectedAccessGroup);
      formData.append('selectedGrades', JSON.stringify(Array.from(selectedGrades)));
      formData.append('settings', JSON.stringify(settings));

      const response = await axios.post('/api/convert', formData, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'converted_fixture.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setSuccess('Your file has been converted and downloaded!');
    } catch (err) {
      setError('Error converting file. Please try again.');
      console.error('Error:', err);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  return (
    <div className="space-y-8">
      <button
        onClick={() => setShowHelp(!showHelp)}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center text-lg"
      >
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {showHelp ? 'Hide Help' : 'Need Help?'}
      </button>

      {showHelp && (
        <div className="bg-blue-50 p-6 rounded-xl mb-8 text-lg text-blue-900">
          <h3 className="text-xl font-bold mb-4">How to Use This Tool:</h3>
          <ol className="list-decimal list-inside space-y-4">
            <li>Choose your <b>team category</b> from the dropdown below</li>
            <li>Set how long your games usually run (default is 2 hours)</li>
            <li>Choose which features you want enabled for these games</li>
            <li>Drop your fixture file in the upload box or click to select it</li>
            <li>Your converted file will download automatically</li>
          </ol>
        </div>
      )}

      <div className="bg-white p-8 rounded-xl border-2 border-gray-100 shadow-sm">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Game Settings</h3>
        
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-3">
            <label htmlFor="accessGroup" className="block text-xl font-medium text-gray-700">
              Which team is this for?
              <span className="ml-2 text-red-500">*</span>
            </label>
            <select
              id="accessGroup"
              value={selectedAccessGroup}
              onChange={(e) => setSelectedAccessGroup(e.target.value as typeof accessGroups[number])}
              className="block w-full rounded-lg border-2 border-gray-300 py-4 px-4 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              {accessGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>

            <label className="block text-xl font-medium text-gray-700 mt-6">
              Which teams?
            </label>
            <div className="relative">
              <button
                onClick={() => setShowGradesDropdown(!showGradesDropdown)}
                className="block w-full rounded-lg border-2 border-gray-300 py-4 px-4 text-lg text-left focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white hover:border-blue-500 transition-colors"
              >
                <span className="text-gray-700">
                  {selectedGrades.size === availableGrades.length ? '✓ All Teams' : `${selectedGrades.size} teams selected`}
                </span>
              </button>

              {showGradesDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedGrades.size === availableGrades.length}
                        onChange={toggleAllGrades}
                        className="h-5 w-5 text-blue-600"
                      />
                      <span className="text-lg font-medium text-gray-700">All Teams</span>
                    </label>
                  </div>
                  <div className="p-4 space-y-3">
                    {availableGrades.map((grade: string) => (
                      <label key={grade} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={selectedGrades.has(grade)}
                          onChange={() => toggleGrade(grade)}
                          className="h-5 w-5 text-blue-600"
                        />
                        <span className="text-lg text-gray-700">{grade}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="gameDuration" className="block text-xl font-medium text-gray-700">
              How long do games usually run?
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                id="gameDuration"
                value={settings.gameDuration}
                onChange={(e) => setSettings({...settings, gameDuration: parseInt(e.target.value)})}
                min="30"
                max="300"
                step="30"
                className="block w-40 rounded-lg border-2 border-gray-300 py-4 px-4 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <span className="text-xl text-gray-600">minutes</span>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h4 className="text-xl font-medium text-gray-700 mb-6">What features do you need?</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={settings.trackAttendance}
                onChange={(e) => setSettings({...settings, trackAttendance: e.target.checked})}
                className="h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-lg text-gray-700">Track Attendance</span>
            </label>

            <label className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={settings.enableComments}
                onChange={(e) => setSettings({...settings, enableComments: e.target.checked})}
                className="h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-lg text-gray-700">Allow Comments</span>
            </label>

            <label className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={settings.enableDutyRoster}
                onChange={(e) => setSettings({...settings, enableDutyRoster: e.target.checked})}
                className="h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-lg text-gray-700">Use Duty Roster</span>
            </label>

            <label className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={settings.enableTicketing}
                onChange={(e) => setSettings({...settings, enableTicketing: e.target.checked})}
                className="h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-lg text-gray-700">Enable Ticketing</span>
            </label>

            <label className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={settings.generateForAllGrades}
                onChange={(e) => setSettings({...settings, generateForAllGrades: e.target.checked})}
                className="h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-lg text-gray-700">Generate for All Grades Together</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-2xl font-medium text-gray-700 mb-6">Now, upload your fixture file:</h4>
        <div
          {...getRootProps()}
          className={`border-3 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} disabled={isUploading} />
          <div className="space-y-6">
            <div className="text-6xl">📄</div>
            {isDragActive ? (
              <p className="text-blue-600 text-2xl">Drop your file here!</p>
            ) : (
              <div>
                <p className="text-gray-700 text-2xl mb-3">
                  Drag and drop your CSV file here
                </p>
                <p className="text-gray-500 text-xl">
                  Or click to browse your files
                </p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-6 p-6 bg-red-50 text-red-700 rounded-xl text-lg border-2 border-red-100">
            {error}
          </div>
        )}

        {isUploading && (
          <div className="mt-6 text-center text-xl text-gray-600">
            Converting your file...
          </div>
        )}

        {success && (
          <div className="mt-6 p-6 bg-green-50 text-green-700 rounded-xl text-lg border-2 border-green-100">
            {success}
          </div>
        )}

        {previewData && (
          <div className="mt-8 space-y-8">
            <div className="space-y-6">
              <h4 className="text-2xl font-medium text-gray-700">Original File Preview</h4>
              <div className="overflow-x-auto bg-white rounded-xl border-2 border-gray-100 shadow-sm">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      {previewData.original.headers.map((header: string, i: number) => (
                        <th key={i} className="px-6 py-4 text-left text-lg font-semibold text-gray-700">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {previewData.original.rows.slice(0, 3).map((row: string[], i: number) => (
                      <tr key={i}>
                        {row.map((cell: string, j: number) => (
                          <td key={j} className="px-6 py-4 text-lg text-gray-700">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-6 space-y-6">
              <h4 className="text-2xl font-medium text-gray-700">
                Converted File Preview
                <span className="text-lg font-normal text-gray-500 ml-3">
                  (How it will look after conversion)
                </span>
              </h4>
              <div className="overflow-x-auto bg-white rounded-xl border-2 border-gray-100 shadow-sm">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      {previewData.converted.headers.map((header: string, i: number) => (
                        <th key={i} className="px-6 py-4 text-left text-lg font-semibold text-gray-700">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {previewData.converted.rows.slice(0, 3).map((row: string[], i: number) => (
                      <tr key={i}>
                        {row.map((cell: string, j: number) => (
                          <td key={j} className="px-6 py-4 text-lg text-gray-700">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-8 py-4 text-xl font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Converted File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// Add improved error handling
export const handleError = (error: Error) => {
  console.error("File upload error:", error);
  return {
    success: false,
    message: error.message || "An error occurred during file upload"
  };
};
