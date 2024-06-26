import '../App.css';
import React, { useState, useEffect, useRef } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CloudIcon from '@mui/icons-material/Cloud';
import AirIcon from '@mui/icons-material/Air';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import Search from './Search';
import { useWeather } from '../contexts/WeatherContext';
import { updateHourlyForecast } from '../reducers/WeatherReducer';
import { useTranslation } from 'react-i18next';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';

const WeatherCard = () => {
  const { t, i18n } = useTranslation();
  const { state, dispatch, fetchWeatherData } = useWeather();
  const { weatherData, searchPerformed, loading } = state;

  const [selectedHourlyForecast, setSelectedHourlyForecast] = useState(null);
  const [selectedDailyForecast, setSelectedDailyForecast] = useState(null);

  useEffect(() => {
    i18n.changeLanguage('ar');
  }, [i18n]);

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
    const container = hourlyForecastContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth / 1;
      container.scrollTo({
        left: container.scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const slideLeft = () => {
    const container = hourlyForecastContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth / 1;
      container.scrollTo({
        left: container.scrollLeft - scrollAmount,
        behavior: 'smooth',
      });
    }
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
                  {weatherData.city ? t(weatherData.city) : ''}
                </Typography>
                <Typography
                  variant='h3'
                  className='country-name'
                >
                  {weatherData.country ? t(weatherData.country) : ''}
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
            <Search HandleSearch={(cityName) => fetchWeatherData(dispatch, cityName)} />
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
          <HourlyForecast
            weatherData={weatherData}
            selectedHourlyForecast={selectedHourlyForecast}
            handleHourlyClick={handleHourlyClick}
            slideLeft={slideLeft}
            slideRight={slideRight}
            hourlyForecastContainerRef={hourlyForecastContainerRef}
          />
        </div>
        <DailyForecast
          weatherData={weatherData}
          selectedDailyForecast={selectedDailyForecast}
          handleDailyClick={handleDailyClick}
        />
      </Container>
    </div>
  );
};

export default WeatherCard;
