"use client";

import React, { useEffect, useState } from 'react';
import { Button, Card, message } from 'antd';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface Recommendations {
  id: number;
  title: string;
  description: string;
  icon: string;
}

// Recommendations data
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

// Updated urgent care facilities near 11952
const urgentCareLocations = [
  { lat: 40.9941, lng: -72.5371, name: "CityMD Riverhead Urgent Care", address: "999 Old Country Rd, Riverhead, NY 11901" },
  { lat: 40.9864, lng: -72.5313, name: "Northwell Health-GoHealth Urgent Care", address: "1842 Old Country Rd, Riverhead, NY 11901" },
  { lat: 40.9848, lng: -72.5315, name: "Peconic Bay Medical Center", address: "1300 Roanoke Ave, Riverhead, NY 11901" },
  { lat: 40.9836, lng: -72.5350, name: "North Fork Urgent Care", address: "2040 Main Rd, Laurel, NY 11948" },
  { lat: 40.9820, lng: -72.5380, name: "East End Urgent Care", address: "1411 Main Rd, Jamesport, NY 11947" },
  { lat: 40.9785, lng: -72.5405, name: "Mattituck Walk-In Clinic", address: "7555 Main Rd, Mattituck, NY 11952" },
  { lat: 40.9805, lng: -72.5410, name: "North Fork Immediate Care", address: "1450 Main Rd, Southold, NY 11971" },
  { lat: 40.9775, lng: -72.5435, name: "Greenport Harbor Urgent Care", address: "222 Manor Pl, Greenport, NY 11944" },
  { lat: 40.9745, lng: -72.5475, name: "Stony Brook Eastern Long Island Hospital", address: "201 Manor Pl, Greenport, NY 11944" },
  { lat: 40.9735, lng: -72.5505, name: "LI Urgent Care Manorville", address: "3400 Main Rd, Southold, NY 11971" }
];

// Fix for missing Leaflet marker icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Recommendations() {
  const router = useRouter();
  const [filteredRecommendations, setFilteredRecommendations] = useState<Recommendations[]>([]);
  const [severity, setSeverity] = useState('mild'); // Default to mild severity

  useEffect(() => {
    // Fetch diagnosis data from localStorage
    const storedData = localStorage.getItem('injuryDiagnosisData');
    if (storedData) {
      const diagnosisData = JSON.parse(storedData);
      const { severityLevel, filteredRecs } = evaluateSeverityAndFilter(diagnosisData);
      setSeverity(severityLevel);
      setFilteredRecommendations(filteredRecs);
    } else {
      // If no data, show default recommendations
      message.error('No diagnosis data found. Showing default recommendations.');
      setSeverity('mild');
      setFilteredRecommendations(recommendationsData.slice(0, 6));
    }
  }, []);

  const evaluateSeverityAndFilter = (data: Record<string, string | number>) => {
    // Define severity levels based on diagnosis data
    let severityLevel = 'mild'; // default
    const { painFrequency, painDuration, bleeding, mobility } = data;
    const painIntensity = data.painIntensity as number;
    
    if (painIntensity > 7 || bleeding === 'yes' || mobility === 'yes') {
      severityLevel = 'severe';
    } else if (painIntensity > 4 || painFrequency === 'frequent' || painDuration === '3-6 hours') {
      severityLevel = 'moderate';
    }

    let filteredRecs = [];
    if (severityLevel === 'mild') {
      filteredRecs = recommendationsData.filter(rec => [1, 3, 4, 5, 6].includes(rec.id));
    } else if (severityLevel === 'moderate') {
      filteredRecs = recommendationsData.filter(rec => [1, 2, 3, 4, 5, 6, 7, 8].includes(rec.id));
    } else {
      filteredRecs = recommendationsData; // Show all recommendations including Red Alert
    }

    return { severityLevel, filteredRecs };
  };

  const handleGoBack = () => {
    router.push('/injuryDiagnosisPage');
  };

  const goBackToHome = () => {
    router.push('/');
  };

  // Calculate map center based on urgent care locations
  const averageLat = urgentCareLocations.reduce((sum, loc) => sum + loc.lat, 0) / urgentCareLocations.length;
  const averageLng = urgentCareLocations.reduce((sum, loc) => sum + loc.lng, 0) / urgentCareLocations.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-12 bg-gradient-to-r from-blue-200 via-teal-200 to-green-200">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg border-2 border-blue-100">
        <h1 className="text-4xl font-bold mb-8 text-center text-teal-700">
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
              <p>{item.description}</p>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex justify-center gap-4">
          <Button 
            type="primary" 
            onClick={handleGoBack}
            className="bg-teal-600 hover:bg-teal-700 text-white text-lg font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform"
          >
            Go Back to Injury Diagnosis
          </Button>
          <Button 
            type="default" 
            onClick={goBackToHome}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform"
          >
            Go Back to Home
          </Button>
        </div>

        {/* Conditionally render map based on severity */}
        {severity === 'severe' && (
          <div className="mt-10">
            <h2 className="text-3xl font-semibold text-center mb-8 text-red-600">Urgent Care Locations</h2>
            <p className="text-center text-lg mb-6">
              Please visit the nearest urgent care center if the injury is severe or if unusual symptoms persist.
            </p>

            {/* Leaflet Map */}
            <div id="map" className="w-full h-[450px] border border-gray-300">
              <MapContainer center={[averageLat, averageLng]} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {urgentCareLocations.map((location, index) => (
                  <Marker key={index} position={[location.lat, location.lng]}>
                    <Popup>
                      <strong>{location.name}</strong><br />
                      {location.address}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
