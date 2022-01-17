import checkAmount from "./utils/checkAmount.js";
import validatePassword from "./utils/validatePassword.js";
import bank from "./Bank.js";
class BankAccount {
  #user = {};
  #contacts = [];
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
  get user() {
    return this.#user;
  }
  
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
  
  #changeDetails = (action) => {
    switch (action.type) {
      case "password":
        this.#details.password = action.payload;
        break;
      default:
        break;
    }
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
    } else if (action.type === "withdrawal") {
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
        id: action.payload.userId,
      });
    } else {
      throw new Error("Invalid action!");
    }
  };

  #transfer = (action) => {
    if (action.type === "send") {
      if (parseInt(action.payload.amount) <= this.#balance) {
        this.#setAmount(action);
        bank.moneyTransfer({
          ...action.payload,
          amount: parseInt(action.payload.amount),
        });
        this.#contacts.push(action.payload.id);
      } else {
        alert("You dont have enough amount to transfer.");
      }
    } else if (action.type === "recive") {
      this.#setAmount(action);
      this.#contacts.push(action.payload.userId);
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
  
  withdrawal = (amount) => {
    if (this.#isOnline) {
      checkAmount(amount);
      if (amount <= this.balance) {
        this.#setAmount({
          type: "withdrawal",
          payload: amount,
        });
      } else {
        alert("You do not have enough amount to withdrawal.");
        throw new Error("You do not have enough amount to withdrawal.");
      }
    }
  };
  
  sendMoney = (data) => {
    if (this.#isOnline) {
      checkAmount(data.amount);
      if (this.#details.id !== data.id) {
        this.#transfer({
          type: "send",
          payload: data,
        });
      }
    }
  };
  
  reciveMoney = (data) => {
    checkAmount(data.amount);
    this.#transfer({
      type: "recive",
      payload: {
        userId: data.currentUser,
        amount: data.amount,
      },
    });
  };
  
  changePassword = (data) => {
    if (this.#isOnline) {
      if (data.current === this.#details.password) {
        if (data.password === data.rePassword) {
          if (validatePassword(data.password)) {
            this.#changeDetails({
              type: "password",
              payload: data.password,
            });
          } else {
            alert("Your password must contain only digits.");
          }
        } else {
          alert("Password does not match.");
        }
      } else {
        alert("It is not your current password.");
      }
    }
  };
}

export default BankAccount;
