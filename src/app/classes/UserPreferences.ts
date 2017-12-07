export class UserPreferences {
  public static readonly languageOptions: string[] = [ "English", "Spanish", "French", "Chinese" ];
  public static readonly qualityOptions: string[] = [ "128kbps", "192kbps", "256kbps", "320kbps", "Lossless" ];

  public static readonly DEFAULT_language: string = UserPreferences.languageOptions[0];
  public static readonly DEFAULT_quality: string = UserPreferences.qualityOptions[1];

  private _accountId: number;
  private _language: string = UserPreferences.DEFAULT_language;
  private _publicProfile: boolean = true;
  private _defaultPublicSession: boolean = true;
  private _showExplicitContent: boolean = true;
  private _quality: string = UserPreferences.DEFAULT_quality;

  constructor() {}

  public loadWithJSON(json): void {
    this.accountId = json['accountId'];
    this.language = json['language'];
    this.publicProfile = json['publicProfile'];
    this.defaultPublicSession = json['defaultPublicSession'];
    this.showExplicitContent = json['showExplicitContent'];
    this.quality = json['quality'];
  }

  set accountId(value: number) {
    this._accountId = value;
  }

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

  get accountId(): number {
    return this._accountId;
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
