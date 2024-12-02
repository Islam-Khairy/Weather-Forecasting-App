import React from 'react';
import PlaceIcon from '@mui/icons-material/Place';

const GetLocation = ({ onLocationDetected }) => {
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(latitude, longitude)
          onLocationDetected(latitude, longitude);
        },
        (error) => {
          console.error('Error getting user location:', error);
        },
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  return (
    <PlaceIcon className='location-icon' onClick={handleGetLocation} />
  );
};

export default GetLocation;
