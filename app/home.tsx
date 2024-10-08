"use client";

import React from 'react';
import { Button } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleAnalysisRedirect = () => {
    router.push('/imageAnalysis');
  };

  const handleDiagnosisRedirect = () => {
    router.push('/injuryDiagnosisPage');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-12 pb-16 gap-12 bg-gradient-to-r from-blue-200 via-teal-200 to-green-200">
      <main className="flex flex-col items-center justify-center w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg border-2 border-blue-100">
        <h1 className="text-[4vw] font-bold mb-8 text-center text-teal-700">
          Injury Detector
        </h1>
        <Image
          className="rounded-full shadow-lg"
          src="/20240919194536.png"
          alt="logo"
          width={300} 
          height={300}
          priority
          onError={(e) => {
            console.error('Image load failed:', e);
          }}
        />
        <p className="text-[1.5vw] text-center mt-6 mb-8 text-teal-800">
          The app does not provide professional medical advice. Please consult healthcare providers for proper diagnosis.
        </p>

        <div className="flex flex-col gap-6 items-center w-full">
          <Button
            type="primary"
            onClick={handleAnalysisRedirect}
            className="bg-teal-600 hover:bg-teal-700 text-white text-[1.5vw] font-semibold py-3 w-full max-w-xl rounded-lg shadow-lg transform hover:scale-105 transition-transform"
          >
            Image Analyzer
          </Button>
          <Button
            type="dashed"
            onClick={handleDiagnosisRedirect}
            className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-600 hover:to-pink-600 text-white text-[1.5vw] font-semibold py-3 w-full max-w-xl rounded-lg shadow-lg transform hover:scale-105 transition-transform"
          >
            Diagnosis Questionnaires
          </Button>
        </div>
      </main>

      <footer className="flex gap-6 flex-wrap items-center justify-center mt-10 text-teal-700 text-[1.2vw]">
        <a
          className="flex items-center gap-3 hover:underline hover:text-blue-600"
          href="https://www.hopkinsmedicine.org/health/conditions-and-diseases/sports-injuries/preventing-sports-injuries#:~:text=Develop%20a%20fitness%20plan%20that,properly%20after%20exercise%20or%20sports."
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={20} 
            height={20}
          />
          Preventing Sports Injuries
        </a>
        <a
          className="flex items-center gap-3 hover:underline hover:text-blue-600"
          href="https://www.cdc.gov/physical-activity-basics/about/index.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={20} 
            height={20}
          />
          CDC Guidelines For Physical Fitness
        </a>
      </footer>
    </div>
  );
}
