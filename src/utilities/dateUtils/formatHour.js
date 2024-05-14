const formatHour = (hour) => {
  const date = new Date(hour);
  const options = {
    hour: 'numeric',
    minute: 'numeric',
  };
  return date.toLocaleTimeString('ar-EG', options);
};

export default formatHour;
