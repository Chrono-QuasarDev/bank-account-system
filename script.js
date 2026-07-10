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