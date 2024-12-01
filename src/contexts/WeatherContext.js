import React, { createContext, useReducer, useContext } from 'react';
import { WeatherReducer, initialState, fetchWeatherData } from '../reducers/WeatherReducer';

  const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [state, dispatch] = useReducer(WeatherReducer, initialState);

  return (
    <WeatherContext.Provider value={{ state, dispatch, fetchWeatherData }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
