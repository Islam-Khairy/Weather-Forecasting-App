import React from 'react';
import Typography from '@mui/material/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

const HourlyForecast = ({
  weatherData,
  selectedHourlyForecast,
  handleHourlyClick,
  slideLeft,
  slideRight,
  hourlyForecastContainerRef,
}) => {
  if (!weatherData.hourlyForecast) return null;

  const handleSlideLeft = () => {
    slideLeft();
  };

  const handleSlideRight = () => {
    slideRight();
  };

  return (
    <div className='hourly-forecast-container'>
      <div
        className='hourly-forecast-items'
        ref={hourlyForecastContainerRef}
      >
        {weatherData.hourlyForecast.map((hourly, index) => (
          <div
            key={index}
            className={`hourly-forecast-item ${
              selectedHourlyForecast === hourly ? 'selected-item' : ''
            }`}
            onClick={() => handleHourlyClick(hourly)}
          >
            <div>
              <Typography variant='h5'>{hourly.time}</Typography>
            </div>
            <div className='hourly-forecast-temp-icon'>
              <Typography variant='h6'>{hourly.temperature}&deg;م</Typography>
              <img
                src={hourly.icon}
                alt=''
              />
            </div>
          </div>
        ))}
      </div>
      <div
        className='right-arrow'
        onClick={handleSlideRight}
      >
        <FontAwesomeIcon icon={faCaretRight} />
      </div>
      <div
        className='left-arrow'
        onClick={handleSlideLeft}
      >
        <FontAwesomeIcon icon={faCaretLeft} />
      </div>
    </div>
  );
};

export default HourlyForecast;
