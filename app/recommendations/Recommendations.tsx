"use client";

import React, { useEffect, useState } from 'react';
import { Button, Card, message } from 'antd';
import { useRouter } from 'next/navigation';
import MapComponent from '../components/MapComponent';

interface Recommendations {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const recommendationsData: Recommendations[] = [
  {
    id: 1,
    title: 'Immediate Self-Care',
    description: 'Apply ice to the affected area for 15-20 minutes every hour for the first 48 hours. Rest the injured area and avoid any strenuous activity.',
    icon: '❄️',
  },
  {
    id: 2,
    title: 'Pain Management',
    description: 'Take over-the-counter pain medication like ibuprofen to reduce swelling and pain. Consult with a healthcare provider if pain persists.',
    icon: '💊',
  },
  {
    id: 3,
    title: 'Rehabilitation Exercises',
    description: 'Start gentle stretching exercises once the swelling and pain have subsided. Consult with a physical therapist for proper recovery routines.',
    icon: '🧘‍♂️',
  },
  {
    id: 4,
    title: 'Hydration',
    description: 'Make sure to stay hydrated to aid in the recovery process. Drink plenty of water and avoid caffeine and alcohol.',
    icon: '💧',
  },
  {
    id: 5,
    title: 'Dietary Considerations',
    description: 'Consume a balanced diet rich in protein and vitamins to promote healing. Consider supplements if advised by your doctor.',
    icon: '🍎',
  },
  {
    id: 6,
    title: 'Sleep and Rest',
    description: 'Ensure adequate sleep and rest for optimal recovery. Avoid any activities that may aggravate the injury.',
    icon: '🛌',
  },
  {
    id: 7,
    title: 'Heat Therapy',
    description: 'After the initial 48 hours, consider using heat therapy to increase blood flow and promote healing.',
    icon: '♨️',
  },
  {
    id: 8,
    title: 'Avoid Re-injury',
    description: 'Take precautions to avoid re-injury. Use protective gear and avoid activities that may put stress on the injured area.',
    icon: '🦺',
  },
  {
    id: 9,
    title: 'Red Alert - Visit Urgent Care',
    description: 'If the pain is severe or you notice an unusual symptom like numbness or tingling, visit urgent care immediately. The location of nearby urgent care centers is shown below.',
    icon: '🚨',
  }
];

export default function Recommendations() {
  const router = useRouter();
  const [filteredRecommendations, setFilteredRecommendations] = useState<Recommendations[]>([]);
  const [injurySeverity, setInjurySeverity] = useState<string>('mild');

  useEffect(() => {
    const injuryDiagnosisData = localStorage.getItem('injuryDiagnosisData');
    const injurySeverity = localStorage.getItem('injurySeverity');
    if (injurySeverity) {
      setInjurySeverity(injurySeverity);
      setFilteredRecommendations(getRecommendationsFromSeverity(injurySeverity));
    } else if (injuryDiagnosisData) {
      const diagnosisData = JSON.parse(injuryDiagnosisData);
      const { severityLevel, filteredRecs } = evaluateSeverityAndFilter(diagnosisData);
      console.log('Retrieved severity from localStorage:', severityLevel);
      setInjurySeverity(severityLevel);
      setFilteredRecommendations(filteredRecs);
    } else {
      message.error('No diagnosis data found. Showing default recommendations.');
      setInjurySeverity('mild');
      setFilteredRecommendations(recommendationsData.slice(0, 6));
    }
  }, []);

  const evaluateSeverityAndFilter = (data: Record<string, string | number>) => {
    let severityLevel = 'mild';
    const { painFrequency, painDuration, bleeding, mobility } = data;
    const painIntensity = data.painIntensity as number;

    if (painIntensity >= 7 || bleeding === 'yes' || mobility === 'yes') {
      severityLevel = 'severe';
    } else if (painIntensity >= 4 || painFrequency === 'frequent' || painDuration === '3-6 hours') {
      severityLevel = 'moderate';
    }

    const filteredRecs = getRecommendationsFromSeverity(severityLevel);
    return { severityLevel, filteredRecs };
  };

  const getRecommendationsFromSeverity = (severity: string) => {
    let filteredRecs = [];
    if (severity === 'mild') {
      filteredRecs = recommendationsData.filter(rec => [1, 3, 4, 5, 6].includes(rec.id));
    } else if (severity === 'moderate') {
      filteredRecs = recommendationsData.filter(rec => [1, 2, 3, 4, 5, 6, 7, 8].includes(rec.id));
    } else {
      filteredRecs = recommendationsData;
    }
    return filteredRecs;
  };

  const goBackToHome = () => {
    localStorage.removeItem('injuryImages');
    localStorage.removeItem('injurySeverity');
    localStorage.removeItem('injuryDiagnosisData');

    setFilteredRecommendations([]);
    setInjurySeverity('mild');

    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-12 pb-16 gap-12 bg-gradient-to-r from-blue-200 via-teal-200 to-green-200">
      <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg border-2 border-blue-100">
        <h1 className="text-[4vw] font-bold mb-8 text-center text-teal-700">
          Recommendations
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((item) => (
            <Card
              key={item.id}
              title={<span>{item.icon} {item.title}</span>}
              bordered={true}
              style={
                item.id === 9
                  ? { border: '2px solid red', backgroundColor: '#fff3f3' }
                  : { backgroundColor: '#f5f5f5' }
              }
              headStyle={item.id === 9 ? { color: 'red' } : {}}
              hoverable={true}
            >
              <p className="text-[1.2vw]">{item.description}</p>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-8 items-center w-full">
          <Button
            type="default"
            onClick={goBackToHome}
            className="bg-pink-500 hover:bg-pink-600 text-white text-[1.5vw] font-semibold py-4 w-full max-w-xl rounded-lg shadow-lg transform hover:scale-105 transition-transform"
          >
            Go Back to Home
          </Button>
        </div>

        {injurySeverity === 'severe' && (
          <div className="mt-10">
            <h2 className="text-[1.5vw] font-semibold text-center mb-8 text-red-600">Urgent Care Locations</h2>
            <p className="text-center text-[1.2vw] mb-6">
              Please visit the nearest urgent care center if the injury is severe or if unusual symptoms persist.
            </p>

            <div id="map" className="w-full h-[450px] border border-gray-300">
              <MapComponent />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
