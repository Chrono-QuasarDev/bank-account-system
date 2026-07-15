export class InvalidOperationError extends Error {
  constructor() {
    super("You cannot add funds to existing FD. Consider creating a new FD");
    this.name = "InvalidOperationError";
  }
}

export class AccountLockedError extends Error {
  constructor(accountNumber, maturityDate) {
    super(`Premature withdrawal is not allowed. Account ${accountNumber} matures on ${maturityDate.toDateString()}`);
    this.name = "AccountLockedError";
    this.accountNumber = accountNumber;
    this.maturityDate = maturityDate;
  }
}

export class PartialWithdrawError extends Error {
  constructor(maturityAmount) {
    super(`You can only withdraw a full amount of ${maturityAmount}`);
    this.name = "PartialWithdrawError";
    this.maturityAmount = maturityAmount
  }
}