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
    // Again just for fun
    if (amount < 0) {
      console.log("Dude!! Get a job");
      return;
    }

    if (this.balance === this.#minimumBalance || (this.balance - amount) < this.#minimumBalance) {
      console.log("Insufficient balance.");

      // A little functionality to print smart error messages
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