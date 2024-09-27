// components/MapComponent.jsx
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const MapComponent = () => {
  const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 });
  const [urgentCareLocations, setUrgentCareLocations] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const mapStyles = {
    height: "450px",
    width: "100%"
  };

  const defaultCenter = {
    lat: currentPosition.lat,
    lng: currentPosition.lng
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
  }, []);

  useEffect(() => {
    if (currentPosition.lat !== 0 && currentPosition.lng !== 0) {
      loadNearbyUrgentCare();
    }
  }, [currentPosition]);


  const loadNearbyUrgentCare = () => {
    const mapElement = document.createElement('div');
    const service = new window.google.maps.places.PlacesService(mapElement);

    const request = {
      location: new window.google.maps.LatLng(currentPosition.lat, currentPosition.lng),
      radius: '10000', // 10 km
      type: ['hospital', 'health'] 
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        console.log('Nearby search results:', results);
        setUrgentCareLocations(results);
      } else {
        console.error('Nearby search failed:', status);
      }
    });
  };

  return (
    <div className="map-container">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        libraries={['places']} 
      >
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={defaultCenter}
          onLoad={loadNearbyUrgentCare} 
        >

          <Marker position={currentPosition} />

          {urgentCareLocations.map((location, index) => (
            <Marker
              key={index}
              position={{
                lat: location.geometry.location.lat(),
                lng: location.geometry.location.lng()
              }}
              onClick={() => setSelectedPlace(location)}
            />
          ))}

          {selectedPlace && (
            <InfoWindow
              position={{
                lat: selectedPlace.geometry.location.lat(),
                lng: selectedPlace.geometry.location.lng()
              }}
              onCloseClick={() => setSelectedPlace(null)}
            >
              <div>
                <strong>{selectedPlace.name}</strong><br />
                {selectedPlace.vicinity}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
      
      <style jsx>{`
        .map-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}

export default MapComponent;
