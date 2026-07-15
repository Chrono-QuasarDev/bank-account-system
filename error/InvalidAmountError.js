export class InvalidAmountError extends Error {
  constructor(amount) {
    super(`Invalid amount. You typed ${amount}`);
    this.name = "InvalidAmountError";
    this.amount = amount;
  }
}