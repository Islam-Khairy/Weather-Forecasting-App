const toArabicDigits = (number) => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(number).replace(/[0-9]/g, (match) => arabicDigits[Number(match)]);
};

export default toArabicDigits;
