
export class Account {

  private _username: string;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _accountId: number;
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

  set accountId(value: number) {
    this._accountId = value;
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

  get accountId(): number {
    return this._accountId;
  }

  get role(): string {
    return this._role;
  }


}
