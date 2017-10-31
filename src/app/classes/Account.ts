
export class Account {

  constructor(private _username: string,
              private _firstName: string,
              private _lastName: string,
              private _email: string,
              private _accountID: number,
              private _role: string) {}


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
