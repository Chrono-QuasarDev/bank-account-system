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

    super(accountNumber, ownerName,)

    if (principal <= 0 || rate <= 0 || tenure <= 0) {
      console.log("Principal, rate, and tenure must be positive");
    }

    this.#principal = principal;
    this.#rate = rate / 100;
    this.#tenure = tenure;
    this.#compoundingFrequency = compoundingFrequence;
    this.#startDate = new Date();

    // Calculating Maturity Date
    this.#maturityDate = new Date();
    this.#maturityDate.setFullYear(this.#startDate.getFullYear() + tenure);

    // Calculate Maturity Amount: P(1 + r/n)^(nt)
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
    }
  }
}

const newFD = new FixedDeposit(1123, "Godfred", 45000, 7.8, 5);
newFD.getBalance();