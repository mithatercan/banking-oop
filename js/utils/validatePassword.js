const validatePassword = (password) => {
  if (/^\d+$/.test(password)) {
    return true;
  }
};

export default validatePassword;
