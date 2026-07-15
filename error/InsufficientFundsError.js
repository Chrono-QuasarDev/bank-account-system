export class InsufficientFundsError extends Error {
  constructor(accountNumber, amountRequested, availableBalance) {
    super(`Insufficeint funds. Can only withdraw ${availableBalance}.`)
    this.name = "InsufficientFundsError";
    this.accountNumber = accountNumber;
    this.amountRequested = amountRequested;
  }
}