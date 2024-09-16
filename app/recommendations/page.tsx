"use client";

import React, { useEffect } from 'react';
import { Button, Card } from 'antd';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Data for recommendations and urgent care locations
const recommendationsData = [
  {
    id: 1,
    title: 'Immediate Self-Care',
    description: 'Apply ice to the affected area for 15-20 minutes every hour for the first 48 hours. Rest the injured area and avoid any strenuous activity.',
  },
  {
    id: 2,
    title: 'Pain Management',
    description: 'Take over-the-counter pain medication like ibuprofen to reduce swelling and pain. Consult with a healthcare provider if pain persists.',
  },
  {
    id: 3,
    title: 'Rehabilitation Exercises',
    description: 'Start gentle stretching exercises once the swelling and pain have subsided. Consult with a physical therapist for proper recovery routines.',
  },
  {
    id: 4,
    title: 'Red Alert - Visit Urgent Care',
    description: 'If the pain is severe or you notice an unusual symptom like numbness or tingling, visit urgent care immediately. The location of nearby urgent care centers is shown below.',
  },
];

// Example urgent care facilities with lat/lng data
const urgentCareLocations = [
  { lat: 40.9121, lng: -73.1237, name: "Urgent Care A", address: "123 Main St, Town A, NY" },
  { lat: 40.9221, lng: -73.1134, name: "Urgent Care B", address: "456 Oak St, Town B, NY" },
  { lat: 40.9156, lng: -73.1324, name: "Urgent Care C", address: "789 Pine St, Town C, NY" },
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

  const handleGoBack = () => {
    router.push('/injuryDiagnosisPage');
  };

  const goBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="container mx-auto p-8">
      <h1 style={{ fontSize: '32px', marginBottom: '20px', textAlign: 'center' }}>Injury Recommendations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendationsData.map((item) => (
          <Card
            key={item.id}
            title={item.title}
            bordered={true}
            style={item.id === 4 ? { border: '2px solid red', backgroundColor: '#fff3f3' } : {}}
          >
            <p>{item.description}</p>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex justify-center gap-4">
        <Button type="primary" onClick={handleGoBack}>
          Go Back to Injury Diagnosis
        </Button>
        <Button type="default" onClick={goBackToHome}>
          Go Back to Home
        </Button>
      </div>

      <div className="mt-10">
        <h2 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '20px', color: 'red' }}>Urgent Care Locations</h2>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>
          Please visit the nearest urgent care center if the injury is severe or if unusual symptoms persist.
        </p>

        {/* Leaflet Map */}
        <div id="map" style={{ width: '100%', height: '450px', border: '1px solid black' }}>
        <MapContainer center={[40.9121, -73.1237]} zoom={12} style={{ height: '100%', width: '100%' }}>
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
    </div>
  );
}
