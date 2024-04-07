import axios from 'axios';
import Swal from 'sweetalert2';

export const initialState = {
  weatherData: {},
  loading: false,
  searchPerformed: false,
};

const transformWeatherData = (data, location) => {
  const { temp_c: temperature, condition, wind_kph: windSpeed, humidity } = data.current;
  const { text: description, icon } = condition;

  const hourlyForecast = data.forecast.forecastday[0]?.hour || [];
  const dailyForecast = data.forecast.forecastday.slice(1);

  const formattedHourlyForecast = hourlyForecast.map((hour) => ({
    time: formatHour(hour.time),
    dateTime: formatDateTime(hour.time),
    temperature: toArabicDigits(Math.round(hour.temp_c)),
    maxTemperature: toArabicDigits(Math.round(hour.maxtemp_c)),
    minTemperature: toArabicDigits(Math.round(hour.mintemp_c)),
    humidity: toArabicDigits(Math.round(hour.humidity)),
    windSpeed: toArabicDigits(Math.round(hour.wind_kph)),
    icon: hour.condition.icon,
    condition: hour.condition.text,
  }));

  const formattedDailyForecast = dailyForecast.map((day) => ({
    dateTime: formatDateTime(day.date) || '',
    temperature: toArabicDigits(Math.round(day.day.avgtemp_c)),
    maxTemperature: toArabicDigits(Math.round(day.day.maxtemp_c)),
    minTemperature: toArabicDigits(Math.round(day.day.mintemp_c)),
    condition: day.day.condition.text,
    icon: day.day.condition.icon,
    windSpeed: toArabicDigits(Math.round(day.day.maxwind_kph)),
    humidity: toArabicDigits(Math.round(day.day.avghumidity)),
    hourlyForecast: day.hour.map((hour) => ({
      time: formatHour(hour.time),
      dateTime: formatDateTime(hour.time),
      temperature: toArabicDigits(Math.round(hour.temp_c)),
      maxTemperature: toArabicDigits(Math.round(hour.maxtemp_c)),
      minTemperature: toArabicDigits(Math.round(hour.mintemp_c)),
      humidity: toArabicDigits(Math.round(hour.humidity)),
      windSpeed: toArabicDigits(Math.round(hour.wind_kph)),
      icon: hour.condition.icon,
      condition: hour.condition.text,
    })),
  }));

  const transformedData = {
    city: location.name || '',
    country: location.country || '',
    dateTime: formatDateTime(location.localtime) || '',
    description,
    temperature: toArabicDigits(Math.round(temperature)),
    minTemperature: toArabicDigits(Math.round(data.forecast.forecastday[0].day.mintemp_c)),
    maxTemperature: toArabicDigits(Math.round(data.forecast.forecastday[0].day.maxtemp_c)),
    humidity: toArabicDigits(Math.round(humidity)),
    icon,
    wind: toArabicDigits(Math.round(windSpeed)),
    hourlyForecast: formattedHourlyForecast,
    dailyForecast: formattedDailyForecast,
  };

  return transformedData;
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
      // If input is a string (city name), fetch weather data by city name
      url = `https://api.weatherapi.com/v1/forecast.json?key=a93da07875fc465c97a75512241003&q=${input}&days=7&aqi=no&alerts=no&units=metric&lang=ar`;
    } else if (typeof input === 'object') {
      // If input is an object containing coordinates, fetch weather data by coordinates
      const { latitude, longitude } = input;
      url = `https://api.weatherapi.com/v1/forecast.json?key=a93da07875fc465c97a75512241003&q=${latitude},${longitude}&days=7&aqi=no&alerts=no&units=metric&lang=ar`;
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

const toArabicDigits = (number) => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(number).replace(/[0-9]/g, (match) => arabicDigits[Number(match)]);
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';

  if (dateTimeString.includes('T')) {
    return dateTimeString;
  }

  const parsedDate = new Date(dateTimeString);

  if (isNaN(parsedDate.getTime())) return '';

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // hour: 'numeric',
    // minute: 'numeric',
    hour12: false, // 24-hour format
  };

  const formatter = new Intl.DateTimeFormat('ar-EG', options);
  const formattedDateTime = formatter.format(parsedDate);

  return formattedDateTime;
};

const formatHour = (hour) => {
  const date = new Date(hour);
  const options = {
    hour: 'numeric',
    minute: 'numeric',
  };
  return date.toLocaleTimeString('ar-EG', options);
};
