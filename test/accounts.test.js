import { SavingsAccount } from "../accounts";
import { InvalidAmountError } from "../error/InvalidAmountError";
import { InsufficientFundsError } from "../error/InsufficientFundsError";

describe("SavingsAccount", () => {
  it("increases the balance when depositing", () => {
    const account = new SavingsAccount("SA001", "Godfred", 100);
    account.deposit(50);
    expect(account.balance).toBe(150);
  });

  it("it throws an error when the amount to be withdrawn is negative", () => {
    const savAccount = new SavingsAccount("SA002", "Chuck", 200);
    expect(() => savAccount.withdraw(-50)).toThrow(InvalidAmountError);
  });

  it("it throws an error when a wrong withdraw amount is requested", () => {
    const savAccount2 = new SavingsAccount("SA002", "Quasar", 300);
    expect(() => savAccount2.withdraw(300).toThrow(InsufficientFundsError));
  });

  it("allows withdraw that leaves exactly the minimum balance", () => {
    const savAccount3 = new SavingsAccount("SA003", "QuasarDev", 400);
    expect(() => savAccount3.withdraw(390).toBe(10));
  })
});
