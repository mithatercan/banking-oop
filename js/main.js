import bank from "./Bank.js";

let currentUser = null;

const openAccount = document.querySelector("#open-account");
const loginAccount = document.querySelector("#login-account");
const transferForm = document.querySelector("#transfer");
const depositForm = document.querySelector("#deposit");
const withdrawlForm = document.querySelector("#withdrawl");
const currentUserEl = document.querySelector("#current-user");
const currentUserBalance = document.querySelector("#balance");
const currentUserForms = document.querySelector(".current-user-forms");
const currentUserTransactions = document.querySelector(".transactions");

const links = document.querySelectorAll("header nav ul li");
const sections = document.querySelectorAll("section");

const activateSection = (id) => {
  sections.forEach((section) => {
    if (section.id === id) {
      section.classList.add("active");
    } else {
      section.classList.remove("active");
    }
  });
};

activateSection("login");

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    sections.forEach((section) => {
      if (section.id === e.target.dataset.section) {
        section.classList.add("active");
      } else {
        section.classList.remove("active");
      }
    });
  });
});

openAccount.addEventListener("submit", (e) => {
  e.preventDefault();
  const { name, age, country, job } = e.target;
  bank.openAccount({
    name: name.value,
    age: age.value,
    country: country.value,
    job: job.value,
  });
  name.value = "";
  age.value = "";
  country.value = "";
  job.value = "";

  activateSection("login");
});

const addTransactions = () => {
  const transactions = currentUser.transactions.map((transaction) => {
    return `<tr>
      <td>${transaction.date}</td>
      <td>${transaction.type}</td>
      <td>${transaction.amount}</td>
      <td>${typeof transaction.id === "undefined" ? "-" : transaction.id}</td>
     </tr>`;
  });

  currentUserTransactions.innerHTML = `
  <h3>Transactions</h3>
  <table>
  <tr>
    <th>DATE</th>
    <th>TYPE</th>
    <th>AMOUNT</th>
    <th>ID</th>
  </tr>
    ${transactions.join("")}
   </table>
`;
};

loginAccount.addEventListener("submit", (e) => {
  e.preventDefault();
  const { username, password } = e.target;
  currentUser = bank.loginAccount(username.value, password.value);

  if (currentUser) {
    currentUserBalance.innerHTML = `
          <div>Balance : ${currentUser.balance}</div>
`;
    currentUserEl.innerHTML = `
      <div>Current user : ${currentUser.details.username}</div>
      <button id="log-out">Log out</button>
    `;
    currentUserForms.classList.add("active");
    addTransactions();
  }
  const logOut = document.querySelector("#log-out");

  logOut.addEventListener("click", () => {
    currentUser.logout;
    currentUser = null;
    currentUserEl.innerHTML = "";
    currentUserBalance.innerHTML = "";
    currentUserTransactions.innerHTML = "";
    username.value = "";
    password.value = "";
    currentUserForms.classList.remove("active");

    activateSection("login");
  });

  activateSection("dashboard");
});

transferForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const { id, amount } = e.target;
  currentUser.sendMoney({
    id: id.value,
    amount: amount.value,
  });
  currentUserBalance.innerHTML = `
          <div>Balance : ${currentUser.balance}</div>
`;
  addTransactions();
  id.value = "";
  amount.value = "";
});

withdrawlForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const { amount } = e.target;
  currentUser.withdrawl(parseInt(amount.value));
  currentUserBalance.innerHTML = `
          <div>Balance : ${currentUser.balance}</div>
`;
  amount.value = "";
  addTransactions();
});

depositForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const { amount } = e.target;
  currentUser.deposit(parseInt(amount.value));
  currentUserBalance.innerHTML = `
          <div>Balance : ${currentUser.balance}</div>
`;
  amount.value = "";
  addTransactions();
});
