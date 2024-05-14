import React from 'react';
import Typography from '@mui/material/Typography';

const DailyForecast = ({ weatherData, selectedDailyForecast, handleDailyClick }) => {
  if (!weatherData.dailyForecast) return null;

  return (
    <div className='daily-forecast-container'>
    {weatherData.dailyForecast.map((daily, index) => (
        <div
          key={index}
          className={`daily-forecast-item ${
            selectedDailyForecast === daily ? 'selected-item' : ''
          }`}
          onClick={() => handleDailyClick(daily)}
        >
          <div className='daily-date'>
            <Typography variant='h5'>{daily.dateTime}</Typography>
          </div>
          <div className='min-max-icon'>
            <div className='min-max-temp'>
              <Typography variant='h6'>العظمى: {daily.maxTemperature}&deg;م</Typography>
              <Typography variant='h6'>الصغرى: {daily.minTemperature}&deg;م</Typography>
            </div>

            <div className='daily-icon'>
              <img src={daily.icon} alt='' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DailyForecast;
