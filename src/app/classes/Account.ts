
export class Account {

  private _username: string;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _accountID: number;
  private _role: string;
  private _isActive: number;

  constructor() {}



  set isActive(value: number) {
    this._isActive = value;
  }

  set username(value: string) {
    this._username = value;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  set email(value: string) {
    this._email = value;
  }

  set accountID(value: number) {
    this._accountID = value;
  }

  set role(value: string) {
    this._role = value;
  }

  get isActive(): number {
    return this._isActive;
  }

  get username(): string {
    return this._username;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get email(): string {
    return this._email;
  }

  get accountID(): number {
    return this._accountID;
  }

  get role(): string {
    return this._role;
  }
}
