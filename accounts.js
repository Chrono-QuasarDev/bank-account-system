import { InvalidAmountError } from "./error/InvalidAmountError";

export class BankAccount {
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


export class SavingsAccount extends BankAccount {
  #minimumBalance = 10;
  #interestRate = 10;
  #availableBalance = this.balance - this.#minimumBalance;

  constructor(accountNumber, ownerName, balance) {
    super(accountNumber, ownerName, balance);
    console.log("Savings account created successfully.");
  }

  deposit(amount) {
    if (amount <= 0) throw new InvalidAmountError(amount);

    this.balance += amount;
    console.log(`${amount} deposited successfully.`);
  }

  withdraw(amount) {
    if (amount <= 0) throw new InvalidAmountError(amount);

    if (this.balance === this.#minimumBalance || (this.balance - amount) < this.#minimumBalance) {
      throw new InsufficientFundsError(this.accountNumber, amount, this.#availableBalance);
    } 

    this.balance -= amount;
    console.log(`${amount} withdrawn successfully.`);
    console.log(`New balance: ${this.balance}`);
  }

  getBalance() {
    console.log(this.balance);
  }
}


export class CurrentAccount extends BankAccount {
  #overdraftLimit = 250;
  #availableBalance = this.balance + this.#overdraftLimit;

  constructor(accountNumber, ownerName, balance) {
    super(accountNumber, ownerName, balance);
  }

  deposit(amount) {
    if (amount <= 0) throw new InvalidAmountError(amount);

    this.balance += amount;
    console.log(`${amount} deposited successfully.`);
  }

  withdraw(amount) {
    if (amount <= 0) throw new InvalidAmountError(amount);

    if (this.balance - amount < -this.#overdraftLimit) {
      throw new InsufficientFundsError(this.accountNumber, amount, this.#availableBalance);
    }

    this.balance -= amount;
    console.log(`${amount} withdrawn successfully`);
  }

  getBalance() {
    console.log(this.balance);
  }
}


export class FixedDeposit extends BankAccount {
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
    this.interestRate = rate;
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
