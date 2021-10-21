const checkAmount = (amount) => {
  if (amount < 0) {
    throw new Error("Amount can not be below zero.");
  }
};

export default checkAmount;
