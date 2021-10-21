import checkAmount from "./utils/checkAmount.js";
import bank from "./Bank.js";
class BankAccount {
  #user = {};
  #details = {
    id: null,
    username: null,
    password: null,
  };
  #isOnline = false;
  #balance = 0;
  #transactions = [];

  constructor(user, details) {
    this.#user = user;
    this.#details = details;
  }

  // ACCOUNT ACTIONS
  get details() {
    return this.#details;
  }
  get balance() {
    if (this.#isOnline) {
      return this.#balance;
    }
  }
  get transactions() {
    if (this.#isOnline) {
      return this.#transactions;
    }
  }

  login = (username, password) => {
    if (
      this.#details.username === username &&
      this.#details.password === password
    ) {
      this.#isOnline = true;
      return this;
    }
  };
  logout = () => {
    this.#isOnline = false;
  };

  #setAmount = (action) => {
    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();

    if (action.type === "deposit") {
      this.#balance += action.payload;
      this.#transactions.push({
        date: date,
        type: action.type,
        amount: +action.payload,
      });
    } else if (action.type === "widthdrawl") {
      this.#balance -= action.payload;
      this.#transactions.push({
        date: date,
        type: action.type,
        amount: -action.payload,
      });
    } else if (action.type === "send") {
      this.#balance -= parseInt(action.payload.amount);
      this.#transactions.push({
        date: date,
        type: action.type,
        amount: -action.payload.amount,
        id: action.payload.id,
      });
    } else if (action.type === "recive") {
      this.#balance += parseInt(action.payload.amount);
      this.#transactions.push({
        date: date,
        type: action.type,
        amount: +action.payload.amount,
        id: action.payload.id,
      });
    } else {
      throw new Error("Invalid action!");
    }
  };

  #transfer = (action) => {
    if (action.type === "send") {
      if (parseInt(action.payload.amount) >= this.#balance) {
        this.#setAmount(action);
        bank.moneyTransfer({
          id: action.payload.id,
          amount: parseInt(action.payload.amount),
        });
      } else {
        alert("You dont have enough amount to transfer.");
      }
    } else if (action.type === "recive") {
      this.#setAmount(action);
    } else {
      throw new Error("Invalid action!");
    }
  };

  deposit = (amount) => {
    if (this.#isOnline) {
      checkAmount(amount);
      this.#setAmount({
        type: "deposit",
        payload: amount,
      });
    }
  };
  withdrawl = (amount) => {
    if (this.#isOnline) {
      checkAmount(amount);
      if (amount <= this.balance) {
        this.#setAmount({
          type: "widthdrawl",
          payload: amount,
        });
      } else {
        throw new Error("This is more than your balance");
      }
    }
  };
  sendMoney = (data) => {
    if (this.#isOnline) {
      checkAmount(data.amount);
      if (this.#details.id !== data.id) {
        this.#transfer({
          type: "send",
          payload: {
            amount: data.amount,
            id: data.id,
          },
        });
      }
    }
  };
  reciveMoney = (amount) => {
    checkAmount(amount);
    this.#transfer({
      type: "recive",
      payload: {
        amount: amount,
      },
    });
  };
}

export default BankAccount;
