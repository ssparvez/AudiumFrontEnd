export class UserPreferences {

  private _language: string = 'English';
  private _publicProfile: boolean = true;
  private _defaultPublicSession: boolean = true;
  private _showExplicitContent: boolean = false;
  private _quality: string = '192kbps';

  constructor() {}

  set language(value: string) {
    this._language = value;
  }

  set publicProfile(value: boolean) {
    this._publicProfile = value;
  }

  set defaultPublicSession(value: boolean) {
    this._defaultPublicSession = value;
  }

  set showExplicitContent(value: boolean) {
    this._showExplicitContent = value;
  }

  set quality(value: string) {
    this._quality = value;
  }

  get language(): string {
    return this._language;
  }

  get publicProfile(): boolean {
    return this._publicProfile;
  }

  get defaultPublicSession(): boolean {
    return this._defaultPublicSession;
  }

  get showExplicitContent(): boolean {
    return this._showExplicitContent;
  }

  get quality(): string {
    return this._quality;
  }
}
