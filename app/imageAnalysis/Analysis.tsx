"use client";

import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { useRouter } from 'next/navigation';

const Analysis = () => {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  useEffect(() => {
    // Get the analysis result from localStorage
    const severity = localStorage.getItem('injurySeverity');

    if (severity) {
      setAnalysisResult(severity);
    } else {
      message.error('No analysis result found. Redirecting to home.');
      router.push('/'); 
    }
  }, [router]);

  const handleCheckRecommendations = () => {
    router.push('/recommendations');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-r from-blue-200 via-teal-200 to-green-200">
      <h1 className="text-4xl font-bold mb-8 text-center text-teal-700">Analysis Result</h1>

      {analysisResult ? (
        <div className="text-center mb-8">
          <p className="text-2xl text-teal-800">
            Your injury is <span className="font-semibold text-teal-700">{analysisResult}</span>.
          </p>
        </div>
      ) : (
        <p className="text-lg text-center mb-8 text-red-600">No analysis result available.</p>
      )}

      <div className="flex flex-col gap-4 items-center w-full">
        <Button 
          type="dashed" 
          onClick={handleCheckRecommendations}
          className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-600 hover:to-pink-600 text-white text-lg font-semibold py-3 w-full max-w-xs rounded-lg shadow-lg transform hover:scale-105 transition-transform"
        >
          Check Recommendations
        </Button>
      </div>
    </div>
  );
};

export default Analysis;
