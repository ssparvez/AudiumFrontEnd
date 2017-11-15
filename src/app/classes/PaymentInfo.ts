
export class PaymentInfo {

  constructor(private _ccNumber, private _ccExprMonth,
              private _ccExprYear, private _ccCCV,
              private _zipCode) {}


  get ccNumber() {
    return this._ccNumber;
  }

  set ccNumber(value) {
    this._ccNumber = value;
  }

  get ccExprMonth() {
    return this._ccExprMonth;
  }

  set ccExprMonth(value) {
    this._ccExprMonth = value;
  }

  get ccExprYear() {
    return this._ccExprYear;
  }

  set ccExprYear(value) {
    this._ccExprYear = value;
  }

  get ccCCV() {
    return this._ccCCV;
  }

  set ccCCV(value) {
    this._ccCCV = value;
  }

  get zipCode() {
    return this._zipCode;
  }

  set zipCode(value) {
    this._zipCode = value;
  }

  get ExprYearMonth() {
    return this.ccExprYear + '-' + this.ccExprMonth + '-01';
  }
}
