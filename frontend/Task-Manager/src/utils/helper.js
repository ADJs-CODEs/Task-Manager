export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const addThousandSeperator = (num) => {

  if (num == null || isNaN(num)) return "";

  const [integerPart, fractionlPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionlPart
    ? `${formattedInteger}.${fractionlPart}`
    : formattedInteger;
}