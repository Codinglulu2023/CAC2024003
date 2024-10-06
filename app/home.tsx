"use client";

import React from 'react';
import { Button } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  // Redirect to image analysis page
  const handleAnalysisRedirect = () => {
    router.push('/imageAnalysis');
  };

  // Redirect to injury diagnosis page
  const handleDiagnosisRedirect = () => {
    router.push('/injuryDiagnosisPage');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-12 bg-gradient-to-r from-blue-200 via-teal-200 to-green-200">
      <main className="flex flex-col items-center justify-center w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg border-2 border-blue-100">
        <h1 className="text-6xl font-bold mb-6 text-center text-teal-700">
          Injury Detector
        </h1>
        <Image
          className="rounded-full shadow-lg"
          src="/20240919194536.png"
          alt="logo"
          width={400}
          height={400}
          priority
          onError={(e) => {
            console.error('Image load failed:', e);
          }}
        />
        <p className="text-lg text-center mt-6 mb-8 text-teal-800">
          The app does not provide professional medical advice, and the creator assumes no liability. Users are encouraged to consult healthcare providers for proper diagnosis.
        </p>

        <div className="flex flex-col gap-4 items-center w-full">
          <Button
            type="primary"
            onClick={handleAnalysisRedirect}
            className="bg-teal-600 hover:bg-teal-700 text-white text-lg font-semibold py-4 w-full max-w-md rounded-lg shadow-lg transform hover:scale-105 transition-transform"
          >
            Image Analyzer
          </Button>
          <Button
            type="dashed"
            onClick={handleDiagnosisRedirect}
            className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-600 hover:to-pink-600 text-white text-lg font-semibold py-4 w-full max-w-md rounded-lg shadow-lg transform hover:scale-105 transition-transform"
          >
            Diagnosis Questionnaires
          </Button>
        </div>
      </main>
    </div>
  );
}
