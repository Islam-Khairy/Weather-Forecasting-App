// Search.js
import React, { useState } from 'react';
import '../App.css';
import SearchIcon from '@mui/icons-material/Search';
import GetLocation from './GetLocation';
import { useWeather } from '../contexts/WeatherContext';

const Search = ({ HandleSearch }) => {
  const [cityName, setCityName] = useState('');

  const { state, fetchWeatherData, dispatch } = useWeather();
  const { searchPerformed } = state;

  const handleChange = (e) => {
    setCityName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cityName.trim() === '') {
      return;
    }
    HandleSearch(cityName);
    setCityName('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          fetchWeatherData(dispatch, coordinates);
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
    <div className={searchPerformed ? 'styled-search-container' : 'search-container'}>
      <form onSubmit={handleSubmit}>
        <div className='search-wrapper'>
          <input
            type='text'
            value={cityName}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder='ادخل اسم المدينة'
          />
          <SearchIcon
            className='search-icon'
            onClick={handleSubmit}
          />
          <GetLocation onLocationDetected={handleGetLocation} />
        </div>
      </form>
    </div>
  );
};

export default Search;
