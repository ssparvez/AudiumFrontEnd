import { UserPreferences } from './UserPreferences'

export class Account {

  private _username: string;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _accountId: number;
  private _role: string;
  private _isActive: number;
  private _userPreferences: UserPreferences = new UserPreferences();

  constructor() {}

  public logout(): void {
    this.username = null;
    this.firstName = null;
    this.lastName = null;
    this.email = null;
    this.accountId = null;
    this.role = null;
    this.isActive = null;

    this.userPreferences.accountId = null;
    this.userPreferences.language = UserPreferences.DEFAULT_language;
    this.userPreferences.publicProfile = true;
    this.userPreferences.defaultPublicSession = true;
    this.userPreferences.showExplicitContent = true;
    this.userPreferences.quality = UserPreferences.DEFAULT_quality;
  }

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

  set userPreferences(value: UserPreferences) {
    this._userPreferences = value;
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

  get userPreferences(): UserPreferences {
    return this._userPreferences;
  }

}
