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

export default formatDateTime;
