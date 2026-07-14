class BankAccount {
  constructor(accountNumber, ownerName, balance) {
    this.accountNumber = accountNumber;
    this.ownerName = ownerName;
    this.balance = balance;
  }

  deposit() {
    throw new Error("You must implement deposit()");
  }

  withdraw() {
    throw new Error("You must implement withdraw()");
  }

  getBalance() {
    throw new Error("You must implement getBalance()");
  }
}


class SavingsAccount extends BankAccount {
  #minimumBalance = 10;
  #interestRate = 10;

  constructor(accountNumber, ownerName, balance) {
    super(accountNumber, ownerName, balance);
    console.log("Savings account created successfully.");
  }

  deposit(amount) {
    this.balance += amount;
    console.log(`${amount} deposited successfully.`);
  }

  withdraw(amount) {
    if (amount < 0) {
      console.log("Dude!! Get a job");
      return;
    }

    if (this.balance === this.#minimumBalance || (this.balance - amount) < this.#minimumBalance) {
      console.log("Insufficient balance.");

      if ((this.balance - this.#minimumBalance) < 0) {
        console.log(`You can only withdraw ${this.balance - this.#minimumBalance}`);
      } else {
        console.log("You cannot withdraw any more money. Deposit instead.");
      }
      return;
    } 

    this.balance -= amount;
    console.log(`${amount} withdrawn successfully.`);
    console.log(`New balance: ${this.balance}`);
  }

  getBalance() {
    console.log(this.balance);
  }
}


class CurrentAccount extends BankAccount {
  #overdraftLimit = 250;

  constructor(accountNumber, ownerName, balance) {
    super(accountNumber, ownerName, balance);
  }

  deposit(amount) {
    this.balance += amount;
    console.log(`${amount} deposited successfully.`);
  }

  withdraw(amount) {
    if (amount <= 0) {
      console.log("Declined! Withdrawal must be positive");
      return;
    }

    if (this.balance - amount < -this.#overdraftLimit) {
      console.log("Declined! Insufficient balance");
      console.log(`You can only withdraw ${this.balance + this.#overdraftLimit}`);
      return;
    }

    this.balance -= amount;
    console.log(`${amount} withdrawn successfully`);
  }

  getBalance() {
    console.log(this.balance);
  }
}


class FixedDeposit extends BankAccount {
  #principal;
  #rate;
  #tenure;
  #compoundingFrequency;
  #maturityAmount;
  #startDate;
  #maturityDate;

  constructor(accountNumber, ownerName, principal, rate, tenure, compoundingFrequence = 4) {

    super(accountNumber, ownerName, principal)

    if (principal <= 0 || rate <= 0 || tenure <= 0) {
      console.log("Principal, rate, and tenure must be positive");
    }

    this.#principal = principal;
    this.#rate = rate / 100;
    this.#tenure = tenure;
    this.#compoundingFrequency = compoundingFrequence;
    this.#startDate = new Date();

    this.#maturityDate = new Date();
    this.#maturityDate.setFullYear(this.#startDate.getFullYear() + tenure);

    this.#maturityAmount = this.#principal * Math.pow((1 + this.#rate / this.#compoundingFrequency), (this.#compoundingFrequency * this.#tenure));
  }

  deposit(amount) {
    throw new Error("You cannot add funds to existing FD. Please create a new FD.");
  }

  withdraw(amount) {
    const today = new Date();

    if (today < this.#maturityDate) {
      throw new Error(`Premature withdrawal is not allowed. Account matures on ${this.#maturityDate.toDateString()}`);      
    }

    if (amount > this.#maturityAmount) {
      throw new Error("Insufficient funds in matured deposit.");
    }

    if (amount === this.#maturityAmount) {
      console.log(`Withdrawal of ${amount} successfull. FD closed`);
      return;
    } else {
      throw new Error("Withdraw amount must match full maturity amount");
    }
  }

  getBalance() {
    const today = new Date();
    if (today >= this.#maturityDate) {
      console.log(this.#maturityAmount);
      return;
    } else {
      console.log(`Account matures on ${this.#maturityDate}. Current value not available.`);
    }
  }
}

const container = document.querySelector(".acc-list");
container.addEventListener("click", (e) => {
  const clickedItem = e.target.closest('.acc-element');

  if (!clickedItem) return;

  document.querySelectorAll('.acc-element').forEach(el => el.classList.remove('active'));
  clickedItem.classList.add('active');
});

const accounts = [];
let selectedAccount = null;
let accountType = null;

// UI Modal and Sidebar Management
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('modal');
  const newAccountBtn = document.getElementById('new-account-btn');
  const modalCloseBtn = document.getElementById('modal-close');
  const createBtn = document.getElementById('create-btn');
  const accElements = document.querySelectorAll('.acc-element');

  // Modal open/close
  newAccountBtn?.addEventListener('click', () => {
    modal.classList.add('open');
  });

  modalCloseBtn?.addEventListener('click', () => {
    modal.classList.remove('open');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });

  // Sidebar active state
  accElements.forEach(element => {
    element.addEventListener('click', () => {
      accElements.forEach(el => el.classList.remove('active'));
      element.classList.add('active');
    });
  });

  // Create account form submission
  createBtn?.addEventListener('click', () => {
    const accType = document.getElementById('acc-type').value;
    const name = document.getElementById('name').value;
    const accNum = document.getElementById('acc-num').value;
    const balance = document.getElementById('acc-balance').value;

    if (name.trim() && accNum.trim() && document.getElementById('acc-balance').value.trim()
    ) {
      // Store the data
      const account = createAccount(accType, name, accNum, balance);
      accounts.push(account);
      renderAccount();
      modal.classList.remove('open');

      // Reset form
      document.getElementById('acc-type').value = 'savings';
      document.getElementById('name').value = '';
      document.getElementById('acc-num').value = '';
      document.getElementById('acc-balance').value = '';
    }
  });
});


function createAccount(accType, name, accNum, balance) {
  let account;

  if(accType === 'savings') {
    account = new SavingsAccount(accNum, name, balance);
    accountType = "Savings"
  } else if(accType === 'fixed') {
    account = new FixedDeposit(accNum, name, balance, 10, 1);
    accountType = "Fixed"
  } else if(accType === 'current') {
    account = new CurrentAccount(accNum, name, balance);
    accountType = "Current"
  }

  return account;
}


function renderAccount() {
  container.innerHTML = '';

  accounts.forEach((account) => {
    const li = document.createElement('li');
    li.classList.add('acc-element');
    li.innerHTML = `
      <div class="acc-element__wrap">
        <div class="list-detail">
          <div class="list-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-piggy-bank" viewBox="0 0 16 16">
              <path d="M5 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.138-1.496A6.6 6.6 0 0 1 7.964 4.5c.666 0 1.303.097 1.893.273a.5.5 0 0 0 .286-.958A7.6 7.6 0 0 0 7.964 3.5c-.734 0-1.441.103-2.102.292a.5.5 0 1 0 .276.962"/>
              <path fill-rule="evenodd" d="M7.964 1.527c-2.977 0-5.571 1.704-6.32 4.125h-.55A1 1 0 0 0 .11 6.824l.254 1.46a1.5 1.5 0 0 0 1.478 1.243h.263c.3.513.688.978 1.145 1.382l-.729 2.477a.5.5 0 0 0 .48.641h2a.5.5 0 0 0 .471-.332l.482-1.351c.635.173 1.31.267 2.011.267.707 0 1.388-.095 2.028-.272l.543 1.372a.5.5 0 0 0 .465.316h2a.5.5 0 0 0 .478-.645l-.761-2.506C13.81 9.895 14.5 8.559 14.5 7.069q0-.218-.02-.431c.261-.11.508-.266.705-.444.315.306.815.306.815-.417 0 .223-.5.223-.461-.026a1 1 0 0 0 .09-.255.7.7 0 0 0-.202-.645.58.58 0 0 0-.707-.098.74.74 0 0 0-.375.562c-.024.243.082.48.32.654a2 2 0 0 1-.259.153c-.534-2.664-3.284-4.595-6.442-4.595M2.516 6.26c.455-2.066 2.667-3.733 5.448-3.733 3.146 0 5.536 2.114 5.536 4.542 0 1.254-.624 2.41-1.67 3.248a.5.5 0 0 0-.165.535l.66 2.175h-.985l-.59-1.487a.5.5 0 0 0-.629-.288c-.661.23-1.39.359-2.157.359a6.6 6.6 0 0 1-2.157-.359.5.5 0 0 0-.635.304l-.525 1.471h-.979l.633-2.15a.5.5 0 0 0-.17-.534 4.65 4.65 0 0 1-1.284-1.541.5.5 0 0 0-.446-.275h-.56a.5.5 0 0 1-.492-.414l-.254-1.46h.933a.5.5 0 0 0 .488-.393m12.621-.857a.6.6 0 0 1-.098.21l-.044-.025c-.146-.09-.157-.175-.152-.223a.24.24 0 0 1 .117-.173c.049-.027.08-.021.113.012a.2.2 0 0 1 .064.199"/>
            </svg>
          </div>
          <div>
            <h3>${account.ownerName}</h3>
            <p>${accountType} #${account.accountNumber}</p>
          </div>
        </div>
        <div class="amount">$${parseFloat(account.balance).toLocaleString()}</div>
      </div>
    `;

    li.addEventListener("click", () => {
      // Handle account click event
      selectedAccount = account;
      renderAccountInfo();
    });

    container.appendChild(li);
  });
}


function renderAccountInfo() {
  if (!selectedAccount) return;

  // Implementation for rendering account info
  document.querySelector(".owner").textContent = selectedAccount.ownerName;

  document.querySelector(".account-number").innerHTML = `${accountType} #${selectedAccount.accountNumber}`;
  document.querySelector(".balance").textContent = `$${parseFloat(selectedAccount.balance).toLocaleString()}`;
}


// Make deposit input field and button functional
const depositBtn = document.querySelector(".acc-details__deposit .btn");
const withdrawBtn = document.querySelector(".acc-details__withdrawal .btn");

depositBtn.addEventListener("click", () => {
  const amount = document.querySelector(".acc-details__deposit input").value;
  if (amount && selectedAccount) {
    selectedAccount.balance = parseFloat(selectedAccount.balance) + parseFloat(amount);
    renderAccount();
    renderAccountInfo();
  }
  document.querySelector(".acc-details__deposit input").value = "";
});

withdrawBtn.addEventListener("click", () => {
  const amount = document.querySelector(".acc-details__withdrawal input").value;
  if (amount && selectedAccount) {
    selectedAccount.balance = parseFloat(selectedAccount.balance) - parseFloat(amount);
    renderAccount();
    renderAccountInfo();
  }
  document.querySelector(".acc-details__withdrawal input").value = "";
});