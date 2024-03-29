import React, { useState } from 'react';
import '../App.css';
import SearchIcon from '@mui/icons-material/Search';
import { useWeather } from '../contexts/WeatherContext';

const SearchComponent = ({ HandleOnClickEvent }) => {
  const [cityName, setCityName] = useState('');

  const { state } = useWeather();
  const { searchPerformed } = state;

  const handleChange = (e) => {
    setCityName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cityName.trim() === '') {
      return;
    }
    HandleOnClickEvent(cityName);
    setCityName('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
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
        </div>
      </form>
    </div>
  );
};

export default SearchComponent;
