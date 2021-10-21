const generatePassword = () => {
  const max = 9999;
  const min = 1000;
  // get between these two numbers.
  return Math.floor(Math.random() * (max - min) + min);
};

export default generatePassword;
