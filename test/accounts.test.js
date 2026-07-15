import { CurrentAccount, FixedDeposit, SavingsAccount } from "../accounts";
import { InvalidAmountError } from "../error/InvalidAmountError";
import { InsufficientFundsError } from "../error/InsufficientFundsError";
import { AccountLockedError, InvalidOperationError, PartialWithdrawError } from "../error/FdErrors";

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
    expect(() => savAccount2.withdraw(300)).toThrow(InsufficientFundsError);
  });

  it("allows withdraw that leaves exactly the minimum balance", () => {
    const savAccount3 = new SavingsAccount("SA003", "QuasarDev", 400);
    savAccount3.withdraw(390);
    expect(savAccount3.balance).toBe(10);
  })
});

describe('CurrentAccount', () => { 
  it("increases the balance when depositing", () => {
    const currAccount = new CurrentAccount("CA001", "Kofigah", 100);
    currAccount.deposit(100);
    expect(currAccount.balance).toBe(200);
  });

  it("throws an error when amount to withdraw is negative", () => {
    const currAccount = new CurrentAccount("CA002", "Kwesi", 100);
    expect(() => currAccount.withdraw(-100)).toThrow(InvalidAmountError);
  });

  it("throws an error when wrong amount is requested", () => {
    const currAccount = new CurrentAccount("CA002", "Kwesi", 100);
    expect(() => currAccount.withdraw(400)).toThrow(InsufficientFundsError);
  });

  it("allows a withdraw that leaves exactly the overdraft", () => {
    const currAccount = new CurrentAccount("CA002", "Kwesi", 100);
    currAccount.withdraw(350)
    expect(currAccount.balance).toBe(-250);
  });
 });


describe("FixedDeposit", () => {
  it("reject attempt to deposit after account is created", () => {
    const newFd = new FixedDeposit("FD001", "Godfred", 45000, 7.8, 0.1);
    expect(() => newFd.deposit(10000)).toThrow(InvalidOperationError);
  });

  it("reject attempt to withdraw before maturity date", () => {
    const newFd = new FixedDeposit("FD001", "Godfred", 45000, 7.8, 1);
    expect(() => newFd.withdraw(10000)).toThrow(AccountLockedError);
  });

  it("reject partial withdrawal upon account maturity", () => {
    const newFd = new FixedDeposit("FD001", "Godfred", 45000, 7.8, -1);
    expect(() => newFd.withdraw(10000)).toThrow(PartialWithdrawError);
  });
});