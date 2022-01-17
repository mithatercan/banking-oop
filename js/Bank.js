import BankAccount from "./BankAccount.js";
import { generateUID as uid } from "./utils/generateUID.js";
import generatePassword from "./utils/generatePassword.js";

const users = document.querySelector("#users");

class Bank {
  #accounts = [];
  #details = {};
  constructor(name, country, currency) {
    this.#details = {
      name: name,
      country: country,
    };
  }

  get details() {
    return this.#details;
  }
  
  showAccounts = () => {
    users.innerHTML = ``;
    const inner = document.createElement("div");
    this.#accounts.map((account) => {
      const userContainer = document.createElement("div");
      userContainer.innerHTML = `
       <pre>
         ${JSON.stringify(account.details)}
       </pre>`;
      inner.appendChild(userContainer);
    });
    users.appendChild(inner);
  };
  
  openAccount = (user) => {
    const details = {
      id: uid(),
      username: `user${this.#accounts.length + 1}`,
      password: `${generatePassword()}`,
    };
    const account = new BankAccount(user, details);
    this.#accounts.push(account);
    this.showAccounts();
  };
  
  loginAccount = (username, password) => {
    let user = null;
    this.#accounts.forEach((account) => {
      if (account.details.username === username) {
        user = account.login(username, password);
      }
    });
    return user;
  };
  
  moneyTransfer = (data) => {
    this.#accounts.map((account) => {
      if (account.details.id === data.id) {
        account.reciveMoney(data);
      }
    });
  };
}

const bank = new Bank("Bank of Xxx", "Turkey", "TRY");

bank.openAccount({
  name: "mithat",
  age: 23,
  country: "Turkey",
  job: "Student",
});
bank.openAccount({
  name: "mithat",
  age: 23,
  country: "Georgia",
  job: "Student",
});

export default bank;
