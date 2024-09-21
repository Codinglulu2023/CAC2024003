"use client";

import React, { useEffect, useState } from 'react';
import { Button, Card, message } from 'antd';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Recommendations data
const recommendationsData = [
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

// Adjusted urgent care facilities with closer locations
const urgentCareLocations = [
  { lat: 40.7128, lng: -74.0060, name: "Urgent Care A", address: "123 Main St, New York, NY" },
  { lat: 40.7150, lng: -74.0100, name: "Urgent Care B", address: "456 Oak St, New York, NY" },
  { lat: 40.7172, lng: -74.0130, name: "Urgent Care C", address: "789 Pine St, New York, NY" },
  { lat: 40.7185, lng: -74.0070, name: "Urgent Care D", address: "321 Elm St, New York, NY" },
  { lat: 40.7112, lng: -74.0080, name: "Urgent Care E", address: "654 Cedar St, New York, NY" },
  { lat: 40.7123, lng: -74.0090, name: "Urgent Care F", address: "987 Birch St, New York, NY" },
  { lat: 40.7100, lng: -74.0050, name: "Urgent Care G", address: "111 Willow St, New York, NY" },
  { lat: 40.7130, lng: -74.0065, name: "Urgent Care H", address: "222 Maple St, New York, NY" },
  { lat: 40.7140, lng: -74.0075, name: "Urgent Care I", address: "333 Pineapple St, New York, NY" },
  { lat: 40.7155, lng: -74.0085, name: "Urgent Care J", address: "444 Apple St, New York, NY" },
];

// Fix for missing Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Recommendations() {
  const router = useRouter();
  const [filteredRecommendations, setFilteredRecommendations] = useState([]);
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

  const evaluateSeverityAndFilter = (data) => {
    // Define severity levels based on diagnosis data
    let severityLevel = 'mild'; // default
    const { painIntensity, painFrequency, painDuration, bleeding, mobility } = data;

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
              <MapContainer center={[averageLat, averageLng]} zoom={15} style={{ height: '100%', width: '100%' }}>
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
