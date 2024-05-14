import formatHour from "./dateUtils/formatHour"
import formatDateTime from "./dateUtils/formatDateTime"
import toArabicDigits from "./numericUtils/toArabicDigits"

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

export default transformWeatherData;