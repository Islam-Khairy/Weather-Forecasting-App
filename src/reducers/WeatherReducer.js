import transformWeatherData from '../utilities/transformWeatherData';

import axios from 'axios';
import Swal from 'sweetalert2';

export const initialState = {
  weatherData: {},
  loading: false,
  searchPerformed: false,
};

export const WeatherReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_WEATHER_START':
      return { ...state, loading: true };

    case 'FETCH_WEATHER_SUCCESS':
      return {
        ...state,
        weatherData: transformWeatherData(action.payload.weatherData, action.payload.location),
        loading: false,
        searchPerformed: true,
      };

    case 'FETCH_FAILURE':
      let errorMessage = 'حدث خطأ غير متوقع، يرجى إعادة المحاولة';
      const { error } = action.payload;
      if (
        action.payload.error.response &&
        action.payload.error.response.data.error.message.includes('No matching location found.')
      ) {
        errorMessage = 'يرجى إدخال الاسم الصحيح للمدينة وإعادة المحاولة.';
      } else if (
        action.payload.error.message &&
        action.payload.error.message.includes('Network Error')
      ) {
        errorMessage = 'يرجى التحقق من الإتصال بالإنترنت وإعادة المحاولة';
      } else if (error instanceof TypeError && error.message.includes('timeout')) {
        errorMessage =
          'انتهى الوقت المحدد للإستجابة. يرجى التحقق من اتصال الإنترنت وإعادة المحاولة.';
      }
      Swal.fire({
        icon: 'error',
        title: 'عفواً',
        text: errorMessage,
      });
      return { ...state, loading: false };

    case 'UPDATE_HOURLY_FORECAST':
      return {
        ...state,
        weatherData: {
          ...state.weatherData,
          hourlyForecast: action.payload.hourlyForecast,
        },
      };

    default:
      return state;
  }
};

export const fetchWeatherData = async (dispatch, input) => {
  dispatch({ type: 'FETCH_WEATHER_START' });
  try {
    let url;
    if (typeof input === 'string') {
      url = `https://api.weatherapi.com/v1/forecast.json?key=7b868c502ed447be922102017242605&q=${input}&days=7&aqi=no&alerts=no&units=metric&lang=ar`;
    } else if (typeof input === 'object') {
      const { latitude, longitude } = input;
      url = `https://api.weatherapi.com/v1/forecast.json?key=7b868c502ed447be922102017242605&q=${latitude},${longitude}&days=7&aqi=no&alerts=no&units=metric&lang=ar`;
    }
    const response = await axios.get(url);
    const weatherData = response.data;
    if (!weatherData || !weatherData.location) {
      throw new Error('City data not found');
    }
    dispatch({
      type: 'FETCH_WEATHER_SUCCESS',
      payload: {
        weatherData,
        location: weatherData.location,
      },
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_FAILURE',
      payload: {
        error,
      },
    });
  }
};

export const updateHourlyForecast = (dispatch, updatedHourlyForecast) => {
  dispatch({
    type: 'UPDATE_HOURLY_FORECAST',
    payload: {
      hourlyForecast: updatedHourlyForecast,
    },
  });
};
