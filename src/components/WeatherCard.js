import '../App.css';
import React, { useState, useEffect, useRef } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CloudIcon from '@mui/icons-material/Cloud';
import AirIcon from '@mui/icons-material/Air';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import SearchComponent from './SearchComponent';
import { useWeather } from '../contexts/WeatherContext';
import { updateHourlyForecast } from '../reducers/WeatherReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

const WeatherCard = () => {
  const { state, dispatch, fetchWeatherData } = useWeather();
  const { weatherData, searchPerformed, loading } = state;

  const [selectedHourlyForecast, setSelectedHourlyForecast] = useState(null);
  const [selectedDailyForecast, setSelectedDailyForecast] = useState(null);

  useEffect(() => {
    setSelectedHourlyForecast(null);
    setSelectedDailyForecast(null);
  }, [loading]);

  const handleHourlyClick = (hourly) => {
    setSelectedHourlyForecast(hourly);
  };

  const handleDailyClick = (daily) => {
    setSelectedDailyForecast(daily);
    setSelectedHourlyForecast(null);
    if (daily && daily.hourlyForecast) {
      updateHourlyForecast(dispatch, daily.hourlyForecast);
    }
  };

  const hourlyForecastContainerRef = useRef(null);

  const slideRight = () => {
    if (hourlyForecastContainerRef.current) {
      hourlyForecastContainerRef.current.scrollLeft += 100;
    }
  };

  const slideLeft = () => {
    if (hourlyForecastContainerRef.current) {
      hourlyForecastContainerRef.current.scrollLeft -= 100;
    }
  };

  const renderHourlyForecast = () => {
    if (!weatherData.hourlyForecast) return null;
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
          id='rightArrow'
          className='right-arrow'
          onClick={slideRight}
        >
          <FontAwesomeIcon icon={faCaretRight} />
        </div>
        <div
          id='leftArrow'
          className='left-arrow'
          onClick={slideLeft}
        >
          <FontAwesomeIcon icon={faCaretLeft} />
        </div>
      </div>
    );
  };

  const renderDailyForecast = () => {
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
                <img
                  src={daily.icon}
                  alt=''
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Container maxWidth={false}>
        <div className={searchPerformed ? 'styled' : ''}>
          <div className='main-container'>
            <div className='right-container'>
              <div className='city-date'>
                <Typography
                  variant='h1'
                  className='city-name'
                >
                  {weatherData.city || ''}
                </Typography>
                <Typography
                  variant='h3'
                  className='country-name'
                >
                  {weatherData.country || ''}
                </Typography>
                <div className='date-time'>
                  <Typography variant='h4'>
                    {selectedDailyForecast ? selectedDailyForecast.dateTime : weatherData.dateTime}
                  </Typography>
                  <Typography variant='h5'>
                    {selectedHourlyForecast ? selectedHourlyForecast.time : weatherData.time}
                  </Typography>
                </div>
              </div>
              {weatherData.description && <CloudIcon className='cloud-icon' />}
              <div className='description'>
                <Typography variant='h3'>
                  {selectedHourlyForecast
                    ? selectedHourlyForecast.condition
                    : selectedDailyForecast
                    ? selectedDailyForecast.condition
                    : weatherData.description}
                </Typography>
                <img
                  src={
                    selectedHourlyForecast
                      ? selectedHourlyForecast.icon
                      : selectedDailyForecast
                      ? selectedDailyForecast.icon
                      : weatherData.icon
                  }
                  alt=''
                />
              </div>
            </div>
            <SearchComponent
              HandleOnClickEvent={(cityName) => fetchWeatherData(dispatch, cityName)}
            />
            <div
              id='spinner'
              style={{ display: loading ? 'block' : 'none' }}
            ></div>
            <div className='left-container'>
              <div>
                <Typography
                  variant='h1'
                  className='temp'
                >
                  {selectedHourlyForecast
                    ? `${selectedHourlyForecast.temperature}\u00B0`
                    : selectedDailyForecast
                    ? `${selectedDailyForecast.temperature}\u00B0`
                    : weatherData.temperature && `${weatherData.temperature}\u00B0`}
                </Typography>
              </div>
              <div className='min-max'>
                {(selectedDailyForecast ||
                  (weatherData.maxTemperature && weatherData.minTemperature)) && (
                  <Typography variant='h5'>
                    العظمى:{' '}
                    {selectedDailyForecast
                      ? selectedDailyForecast.maxTemperature
                      : weatherData.maxTemperature}
                    &deg;م | الصغرى:{' '}
                    {selectedDailyForecast
                      ? selectedDailyForecast.minTemperature
                      : weatherData.minTemperature}
                    &deg;م
                  </Typography>
                )}
              </div>
              {weatherData.humidity && (
                <div className='humidity'>
                  <Typography variant='h5'>
                    الرطوبة:{' '}
                    {selectedHourlyForecast
                      ? selectedHourlyForecast.humidity + '\u066a'
                      : selectedDailyForecast
                      ? selectedDailyForecast.humidity + '\u066a'
                      : weatherData.humidity + '\u066a'}
                  </Typography>
                  {weatherData && <WaterDropIcon />}
                </div>
              )}
              <div>
                {weatherData.wind && (
                  <div className='wind-speed'>
                    <Typography variant='h5'>
                      سرعة الرياح:{' '}
                      {selectedHourlyForecast
                        ? selectedHourlyForecast.windSpeed
                        : selectedDailyForecast
                        ? selectedDailyForecast.windSpeed
                        : weatherData.wind}{' '}
                      كم/ساعة
                    </Typography>
                    {weatherData && <AirIcon />}
                  </div>
                )}
              </div>
            </div>
          </div>
          {renderHourlyForecast()}
        </div>
        {renderDailyForecast()}
      </Container>
    </div>
  );
};

export default WeatherCard;
