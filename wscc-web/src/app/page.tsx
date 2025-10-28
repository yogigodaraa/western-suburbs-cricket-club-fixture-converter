'use client';

import FileUploader from '@/components/FileUploader'

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-800">
          Fixture Converter
        </h1>
        <p className="text-xl text-center mb-8 text-gray-600">
          Convert your fixtures for Western Suburbs Cricket Club
        </p>
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <FileUploader />
        </div>
      </div>
    </main>
  )
}