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

  // get current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
  }, []);


  const handleMapLoad = (map) => {
    if (window.google && window.google.maps && window.google.maps.places) {
      const service = new window.google.maps.places.PlacesService(map);
      const request = {
        location: new window.google.maps.LatLng(currentPosition.lat, currentPosition.lng),
        radius: '5000', // 5 km
        type: ['hospital', 'health', 'doctor'] 
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setUrgentCareLocations(results);
        } else {
          console.error('Nearby search failed:', status);
        }
      });
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={13}
        center={defaultCenter}
        onLoad={handleMapLoad} 
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
  );
}

export default MapComponent;
